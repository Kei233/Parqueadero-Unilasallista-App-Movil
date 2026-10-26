import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, type Href } from "expo-router";

import Screen from "../components/Screen";
import Stepper from "../components/Stepper";
import RateTable from "../components/RateTable";
import ReceiptTicket from "../components/ReceiptTicket";
import { Button, Card, Choice, ErrorBanner, Icon, Label, PlateInput, type IconName } from "../components/ui";
import { useAppData } from "../context/AppDataContext";
import { ROLES, VEHICLES, PAYMENT_METHODS, getRate } from "../data";
import { cop, generateTxCode } from "../utils";
import { colors } from "../theme";
import type { Role, VehicleType, PaymentMethodId, Receipt } from "../types";

const METHOD_ICONS: Record<PaymentMethodId, IconName> = {
  Nequi: "cellphone",
  Bancolombia: "bank",
  Tarjeta: "credit-card-outline",
  PSE: "wallet-outline",
};

export default function PaymentPage() {
  const router = useRouter();
  const { plates, registerPayment, lastRegisteredPlate, setLastRegisteredPlate } = useAppData();

  const [step, setStep] = useState(1);
  const [plateInput, setPlateInput] = useState("");
  const [plateError, setPlateError] = useState("");
  const [currentPlate, setCurrentPlate] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("Estudiante");
  const [vehicle, setVehicle] = useState<VehicleType>("Carro");
  const [method, setMethod] = useState<PaymentMethodId>("Nequi");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Si el usuario llega recién registrado desde /registro, precargamos su placa.
  useEffect(() => {
    if (lastRegisteredPlate) {
      setPlateInput(lastRegisteredPlate);
      setLastRegisteredPlate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const amount = getRate(role, vehicle);

  function handleConsultar() {
    const plate = plateInput.trim().toUpperCase().replace(/\s+/g, "");
    if (!plate) {
      setPlateError("Ingresa una placa para continuar.");
      return;
    }
    if (!plates[plate]) {
      setPlateError("La placa ingresada no se encuentra registrada en el sistema de Unilasallista.");
      return;
    }
    setPlateError("");
    setCurrentPlate(plate);
    setRole("Estudiante");
    setVehicle("Carro");
    setStep(2);
  }

  function handleConfirmarPago() {
    if (!currentPlate) return;
    setProcessing(true);
    timerRef.current = setTimeout(() => {
      const newReceipt: Receipt = {
        code: generateTxCode(),
        plate: currentPlate,
        owner: plates[currentPlate],
        role,
        vehicle,
        amount,
        method,
        datetime: new Date(),
      };
      registerPayment(newReceipt);
      setReceipt(newReceipt);
      setProcessing(false);
      setStep(4);
    }, 1500);
  }

  function handleNuevoPago() {
    setStep(1);
    setPlateInput("");
    setPlateError("");
    setCurrentPlate(null);
    setReceipt(null);
    setMethod("Nequi");
  }

  return (
    <Screen>
      <Stepper step={step} />

      {/* PASO 1 — Consulta de placa */}
      {step === 1 && (
        <Card>
          <Text style={styles.title}>Consulta tu placa</Text>
          <Text style={styles.desc}>
            Digita la placa del vehículo registrado en Unilasallista para iniciar el pago del día.
          </Text>

          <View style={{ marginTop: 16 }}>
            <Label>Placa del vehículo</Label>
            <PlateInput
              value={plateInput}
              onChangeText={(t) => {
                setPlateInput(t);
                if (plateError) setPlateError("");
              }}
              onSubmitEditing={handleConsultar}
            />
            {plateError ? (
              <View style={{ marginTop: 12 }}>
                <ErrorBanner message={plateError} />
              </View>
            ) : null}
            <Button label="Consultar / Iniciar Pago" icon="magnify" onPress={handleConsultar} style={{ marginTop: 16 }} />
          </View>

          <RateTable />

          <Text style={styles.footnote}>
            ¿Tu placa no aparece?{" "}
            <Text style={styles.link} onPress={() => router.navigate("/registro" as Href)}>
              Regístrala aquí
            </Text>
            . Placas de prueba: ABC123 · XYZ789 · MOTO12
          </Text>
        </Card>
      )}

      {/* PASO 2 — Rol, vehículo y tarifa */}
      {step === 2 && currentPlate && (
        <Card>
          <View style={styles.ownerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.small}>Vehículo registrado a</Text>
              <Text style={styles.title}>{plates[currentPlate]}</Text>
            </View>
            <View style={styles.plateBadge}>
              <Text style={styles.plateBadgeText}>{currentPlate}</Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Label>Rol</Label>
            <View style={styles.choiceRow}>
              {ROLES.map((r) => (
                <Choice key={r} label={r} active={role === r} onPress={() => setRole(r)} style={styles.flex} />
              ))}
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <Label>Tipo de vehículo</Label>
            <View style={styles.choiceRow}>
              {VEHICLES.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  icon={v === "Carro" ? "car" : "motorbike"}
                  active={vehicle === v}
                  onPress={() => setVehicle(v)}
                  style={styles.flex}
                />
              ))}
            </View>
          </View>

          <LinearGradient
            colors={[colors.navy, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.summary}
          >
            <View>
              <Text style={styles.summaryLabel}>Valor a pagar hoy</Text>
              <Text style={styles.summaryAmount}>{cop(amount)}</Text>
            </View>
            <Text style={styles.summaryMeta}>
              {role}
              {"\n"}
              {vehicle}
            </Text>
          </LinearGradient>

          <View style={styles.notice}>
            <Icon name="clock-outline" size={16} color={colors.blue600} />
            <Text style={styles.noticeText}>
              Servicio disponible para pago del día actual desde las 12:00 a.m. Tarifas planas por día.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Button label="Atrás" variant="outline" onPress={() => setStep(1)} style={styles.flex} />
            <Button label="Continuar al pago" onPress={() => setStep(3)} style={styles.flex2} />
          </View>
        </Card>
      )}

      {/* PASO 3 — Método de pago */}
      {step === 3 && (
        <Card>
          <Text style={styles.title}>Método de pago</Text>
          <Text style={styles.desc}>Selecciona cómo quieres pagar el parqueadero de hoy.</Text>

          <View style={styles.methods}>
            {PAYMENT_METHODS.map((m) => {
              const active = method === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setMethod(m.id)}
                  disabled={processing}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={[styles.method, active ? styles.methodActive : styles.methodIdle]}
                >
                  <View style={[styles.radio, active && { borderColor: colors.purple }]}>
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={[styles.methodIcon, { backgroundColor: active ? colors.purple : colors.gray100 }]}>
                    <Icon name={METHOD_ICONS[m.id]} size={18} color={active ? colors.white : colors.gray500} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodLabel}>{m.label}</Text>
                    <Text style={styles.methodHint}>{m.hint}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.buttonRow}>
            <Button label="Atrás" variant="outline" disabled={processing} onPress={() => setStep(2)} style={styles.flex} />
            <Button
              label={processing ? "Procesando..." : `Confirmar y Pagar ${cop(amount)}`}
              loading={processing}
              onPress={handleConfirmarPago}
              style={styles.flex2}
            />
          </View>
        </Card>
      )}

      {/* PASO 4 — Colilla de pago */}
      {step === 4 && receipt && <ReceiptTicket receipt={receipt} onNuevoPago={handleNuevoPago} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "700", color: colors.navy },
  desc: { marginTop: 4, fontSize: 14, color: colors.gray500 },
  small: { fontSize: 12, color: colors.gray500 },
  footnote: { marginTop: 16, fontSize: 11, color: colors.gray400, textAlign: "center" },
  link: { fontWeight: "600", color: colors.purple },
  flex: { flex: 1 },
  flex2: { flex: 2 },

  ownerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  plateBadge: { borderRadius: 8, backgroundColor: colors.navy, paddingHorizontal: 12, paddingVertical: 6 },
  plateBadgeText: { color: colors.white, fontSize: 14, fontWeight: "700", letterSpacing: 1.5 },
  choiceRow: { marginTop: 6, flexDirection: "row", gap: 8 },

  summary: {
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  summaryAmount: { fontSize: 24, fontWeight: "800", color: colors.white },
  summaryMeta: { fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "right", lineHeight: 17 },

  notice: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blue100,
    backgroundColor: colors.blue50,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noticeText: { flex: 1, fontSize: 12, color: colors.blue800, lineHeight: 17 },

  buttonRow: { marginTop: 20, flexDirection: "row", gap: 8 },

  methods: { marginTop: 16, gap: 8 },
  method: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 },
  methodActive: { borderColor: colors.purple, backgroundColor: colors.purpleTintSoft },
  methodIdle: { borderColor: colors.gray200, backgroundColor: colors.white },
  radio: { height: 18, width: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.gray400, alignItems: "center", justifyContent: "center" },
  radioDot: { height: 8, width: 8, borderRadius: 4, backgroundColor: colors.purple },
  methodIcon: { height: 36, width: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  methodLabel: { fontSize: 14, fontWeight: "600", color: colors.navy },
  methodHint: { fontSize: 12, color: colors.gray500 },
});
