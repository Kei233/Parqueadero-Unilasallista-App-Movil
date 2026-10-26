import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter, type Href } from "expo-router";

import Screen from "../components/Screen";
import { Button, Card, Choice, ErrorBanner, Icon, Label, PlateInput, type IconName } from "../components/ui";
import { useAppData } from "../context/AppDataContext";
import { REGISTER_ENDPOINT } from "../config";
import { colors } from "../theme";

// ---------------------------------------------------------------------------
// Contrato con el backend
// ---------------------------------------------------------------------------
const REQUEST_TIMEOUT_MS = 15000;

/** Rol: Empleado = 0, Estudiante = 1 (se envía como `idRol`). */
const ROLE_OPTIONS = [
  { label: "Estudiante", value: 1 },
  { label: "Empleado", value: 0 },
] as const;

/** Tipo de vehículo: Moto = 0, Carro = 1 (se envía como `tipoVehiculo`). */
const VEHICLE_OPTIONS: readonly { label: string; value: number; icon: IconName }[] = [
  { label: "Carro", value: 1, icon: "car" },
  { label: "Moto", value: 0, icon: "motorbike" },
];

interface RegisterVehicleRequest {
  placa: string;
  idRol: number;
  tipoVehiculo: number;
}

interface RegisterVehicleResponse {
  idVehiculo: number;
  placa: string;
  tipoVehiculo: number;
  nombreRol: string;
}

type Status = "idle" | "loading" | "success" | "error";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function isRegisterResponse(data: unknown): data is RegisterVehicleResponse {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.idVehiculo === "number" &&
    typeof d.placa === "string" &&
    typeof d.tipoVehiculo === "number" &&
    typeof d.nombreRol === "string"
  );
}

/** Intenta leer un mensaje del backend; si no hay, usa uno amigable según el status HTTP. */
async function buildApiError(res: Response, plate: string): Promise<ApiError> {
  let serverMessage = "";
  try {
    const body = (await res.json()) as { message?: unknown; mensaje?: unknown };
    const candidate = body.message ?? body.mensaje;
    if (typeof candidate === "string") serverMessage = candidate.trim();
  } catch {
    // El cuerpo no era JSON: usamos el mensaje por defecto.
  }

  if (serverMessage) return new ApiError(serverMessage, res.status);

  if (res.status === 400 || res.status === 422) {
    return new ApiError("Los datos enviados no son válidos. Revisa la información e inténtalo de nuevo.", res.status);
  }
  if (res.status === 409) {
    return new ApiError(`La placa ${plate} ya se encuentra registrada.`, res.status);
  }
  if (res.status >= 500) {
    return new ApiError("El servidor tuvo un problema al procesar tu registro. Inténtalo de nuevo en unos minutos.", res.status);
  }
  return new ApiError("No pudimos registrar tu vehículo. Inténtalo de nuevo.", res.status);
}

function vehicleLabel(value: number): string {
  return VEHICLE_OPTIONS.find((v) => v.value === value)?.label ?? "Vehículo";
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerPlate, setLastRegisteredPlate } = useAppData();

  const [plateInput, setPlateInput] = useState("");
  const [idRol, setIdRol] = useState<number | null>(null);
  const [tipoVehiculo, setTipoVehiculo] = useState<number | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<RegisterVehicleResponse | null>(null);

  // Cancela la petición en vuelo si el usuario sale de la pantalla.
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const isLoading = status === "loading";

  function clearError() {
    if (status === "error") setStatus("idle");
    if (error) setError("");
  }

  async function handleSubmit() {
    if (isLoading) return;

    const plate = plateInput.trim().toUpperCase().replace(/\s+/g, "");

    if (!/^[A-Z0-9]{5,8}$/.test(plate)) {
      setError("Ingresa una placa válida, por ejemplo ABC123.");
      setStatus("error");
      return;
    }
    if (idRol === null) {
      setError("Selecciona si eres estudiante o empleado.");
      setStatus("error");
      return;
    }
    if (tipoVehiculo === null) {
      setError("Selecciona el tipo de vehículo.");
      setStatus("error");
      return;
    }

    const payload: RegisterVehicleRequest = { placa: plate, idRol, tipoVehiculo };

    setError("");
    setStatus("loading");

    const controller = new AbortController();
    abortRef.current = controller;
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) throw await buildApiError(res, plate);

      const data: unknown = await res.json();
      if (!isRegisterResponse(data)) throw new Error("invalid-response");

      // Mantiene operativo el flujo local de /pago con la placa recién registrada.
      registerPlate(data.placa, data.nombreRol);
      setLastRegisteredPlate(data.placa);
      setResult(data);
      setStatus("success");
    } catch (err) {
      // Cancelada por salir de la pantalla: no hay a quién mostrarle el error.
      if (controller.signal.aborted && !timedOut) return;

      if (timedOut) {
        setError("El servidor tardó demasiado en responder. Revisa tu conexión e inténtalo de nuevo.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError("No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.");
      } else {
        setError("Recibimos una respuesta inesperada del servidor. Inténtalo de nuevo.");
      }
      setStatus("error");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function handleNuevoRegistro() {
    setPlateInput("");
    setIdRol(null);
    setTipoVehiculo(null);
    setError("");
    setResult(null);
    setStatus("idle");
  }

  // ------------------------------ Éxito ------------------------------
  if (status === "success" && result) {
    return (
      <Screen>
        <Card style={styles.successCard}>
          <View style={styles.successIcon}>
            <Icon name="check-circle-outline" size={26} color={colors.green600} />
          </View>
          <Text style={styles.title}>¡Vehículo registrado!</Text>
          <Text style={styles.successText} accessibilityLiveRegion="polite">
            La placa <Text style={styles.bold}>{result.placa}</Text> quedó registrada como{" "}
            <Text style={styles.semibold}>{vehicleLabel(result.tipoVehiculo)}</Text> de{" "}
            <Text style={styles.semibold}>{result.nombreRol}</Text> en el sistema de Unilasallista.
          </Text>

          <View style={styles.successButtons}>
            <Button
              label="Ir a pagar mi parqueadero"
              trailingIcon="arrow-right"
              onPress={() => router.navigate("/pago" as Href)}
            />
            <Button label="Registrar otro vehículo" variant="outline" onPress={handleNuevoRegistro} />
          </View>
        </Card>
      </Screen>
    );
  }

  // ----------------------------- Formulario -----------------------------
  return (
    <Screen>
      <Card>
        <View style={styles.titleRow}>
          <Icon name="account-plus-outline" size={20} color={colors.purple} />
          <Text style={styles.title}>Registra tu vehículo</Text>
        </View>
        <Text style={styles.desc}>
          Antes de pagar por primera vez, registra tu placa en el sistema de parqueadero de
          Unilasallista.
        </Text>

        <View style={styles.form}>
          <View>
            <Label>Placa del vehículo</Label>
            <PlateInput
              value={plateInput}
              editable={!isLoading}
              onChangeText={(t) => {
                setPlateInput(t);
                clearError();
              }}
              onSubmitEditing={handleSubmit}
            />
          </View>

          <View>
            <Label>Rol</Label>
            <View style={styles.choiceRow}>
              {ROLE_OPTIONS.map((r) => (
                <Choice
                  key={r.value}
                  label={r.label}
                  active={idRol === r.value}
                  disabled={isLoading}
                  onPress={() => {
                    setIdRol(r.value);
                    clearError();
                  }}
                  style={styles.flex}
                />
              ))}
            </View>
          </View>

          <View>
            <Label>Tipo de vehículo</Label>
            <View style={styles.choiceRow}>
              {VEHICLE_OPTIONS.map((v) => (
                <Choice
                  key={v.value}
                  label={v.label}
                  icon={v.icon}
                  active={tipoVehiculo === v.value}
                  disabled={isLoading}
                  onPress={() => {
                    setTipoVehiculo(v.value);
                    clearError();
                  }}
                  style={styles.flex}
                />
              ))}
            </View>
          </View>

          {status === "error" && error ? <ErrorBanner message={error} /> : null}

          <Button
            label={isLoading ? "Registrando..." : "Registrar vehículo"}
            icon="account-plus-outline"
            loading={isLoading}
            onPress={handleSubmit}
          />
        </View>

        <Text style={styles.footnote}>
          ¿Ya estás registrado?{" "}
          <Text style={styles.link} onPress={() => router.navigate("/pago" as Href)}>
            Ve directo a pagar
          </Text>
          .
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontWeight: "700", color: colors.navy },
  desc: { marginTop: 4, fontSize: 14, color: colors.gray500 },
  form: { marginTop: 16, gap: 16 },
  choiceRow: { marginTop: 6, flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
  footnote: { marginTop: 16, fontSize: 11, color: colors.gray400, textAlign: "center" },
  link: { fontWeight: "600", color: colors.purple },

  successCard: { alignItems: "center" },
  successIcon: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: colors.green100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successText: { marginTop: 4, fontSize: 14, color: colors.gray500, textAlign: "center", lineHeight: 20 },
  bold: { fontWeight: "700", color: colors.navy },
  semibold: { fontWeight: "600" },
  successButtons: { marginTop: 20, alignSelf: "stretch", gap: 8 },
});
