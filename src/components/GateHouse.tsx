import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { GateCheckResult, PaymentsStore } from "../types";
import { cop, formatDateTime } from "../utils";
import { colors } from "../theme";
import { Button, Card, Icon, InfoRow, PlateInput } from "./ui";

export default function GateHouse({ payments }: { payments: PaymentsStore }) {
  const [plateInput, setPlateInput] = useState("");
  const [result, setResult] = useState<GateCheckResult | null>(null);

  function handleVerificar() {
    const plate = plateInput.trim().toUpperCase().replace(/\s+/g, "");
    if (!plate) return;
    const found = payments[plate];
    setResult(
      found ? { status: "paid", plate, data: found } : { status: "pending", plate, data: null }
    );
  }

  return (
    <View style={{ gap: 16 }}>
      <Card>
        <View style={styles.titleRow}>
          <Icon name="shield-check-outline" size={20} color={colors.purple} />
          <Text style={styles.title}>Verificación en portería</Text>
        </View>
        <Text style={styles.desc}>
          Digita la placa del vehículo para confirmar si el pago de hoy ya fue registrado.
        </Text>

        <PlateInput value={plateInput} onChangeText={setPlateInput} onSubmitEditing={handleVerificar} />
        <Button label="Verificar estado de pago" onPress={handleVerificar} style={{ marginTop: 12 }} />
      </Card>

      {result?.status === "paid" && result.data && (
        <View style={styles.paid}>
          <View style={styles.resultHead}>
            <Icon name="check-circle" size={20} color={colors.green600} />
            <Text style={styles.paidTitle}>PAGO CONFIRMADO HOY</Text>
          </View>
          <View style={styles.paidRows}>
            <InfoRow first borderColor={colors.green200} label="Placa" value={result.data.plate} />
            <InfoRow borderColor={colors.green200} label="Usuario" value={result.data.owner} />
            <InfoRow borderColor={colors.green200} label="Rol" value={result.data.role} />
            <InfoRow borderColor={colors.green200} label="Vehículo" value={result.data.vehicle} />
            <InfoRow borderColor={colors.green200} label="Valor" value={cop(result.data.amount)} />
            <InfoRow borderColor={colors.green200} label="Hora de pago" value={formatDateTime(result.data.datetime)} />
          </View>
        </View>
      )}

      {result?.status === "pending" && (
        <View style={styles.pending}>
          <Icon name="close-circle" size={32} color={colors.red600} />
          <Text style={styles.pendingTitle}>PAGO PENDIENTE</Text>
          <Text style={styles.pendingText}>
            La placa <Text style={{ fontWeight: "700" }}>{result.plate}</Text> no registra pago del
            parqueadero para el día de hoy.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontWeight: "700", color: colors.navy },
  desc: { marginTop: 4, marginBottom: 12, fontSize: 14, color: colors.gray500 },
  paid: { borderRadius: 16, borderWidth: 2, borderColor: colors.green500, backgroundColor: colors.green50, padding: 20 },
  resultHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  paidTitle: { fontSize: 15, fontWeight: "800", color: colors.green700 },
  paidRows: { marginTop: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.6)", paddingHorizontal: 16 },
  pending: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.red500,
    backgroundColor: colors.red50,
    padding: 20,
  },
  pendingTitle: { marginTop: 8, fontSize: 15, fontWeight: "800", color: colors.red700 },
  pendingText: { marginTop: 4, fontSize: 14, color: colors.red600, textAlign: "center" },
});
