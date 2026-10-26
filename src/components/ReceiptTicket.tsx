import { Share, StyleSheet, Text, View } from "react-native";
import type { Receipt } from "../types";
import { cop, formatDateTime, codeToBarWidths } from "../utils";
import { colors, cardShadow } from "../theme";
import { Button, Icon, InfoRow } from "./ui";

interface ReceiptTicketProps {
  receipt: Receipt;
  onNuevoPago: () => void;
}

const NOTCHES = 18;

export default function ReceiptTicket({ receipt, onNuevoPago }: ReceiptTicketProps) {
  const bars = codeToBarWidths(receipt.code);

  async function handleCompartir() {
    const message = [
      "Colilla de pago — Parqueadero Unilasallista",
      `Estado: APROBADO`,
      `Código: ${receipt.code}`,
      `Placa: ${receipt.plate}`,
      `Usuario: ${receipt.owner}`,
      `Rol: ${receipt.role}`,
      `Vehículo: ${receipt.vehicle}`,
      `Método de pago: ${receipt.method}`,
      `Valor pagado: ${cop(receipt.amount)}`,
      `Fecha y hora: ${formatDateTime(receipt.datetime)}`,
    ].join("\n");

    try {
      await Share.share({ message });
    } catch {
      // El usuario cerró el menú de compartir o no hay apps disponibles.
    }
  }

  return (
    <View>
      <View style={styles.ticket}>
        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.badge}>
              <Icon name="check-circle" size={14} color={colors.green700} />
              <Text style={styles.badgeText}>APROBADO</Text>
            </View>
            <Text style={styles.tag}>Colilla virtual</Text>
          </View>

          <Text style={styles.codeLabel}>Código de transacción</Text>
          <Text style={styles.code}>{receipt.code}</Text>

          <View style={styles.rows}>
            <InfoRow first label="Placa" value={receipt.plate} />
            <InfoRow label="Usuario" value={receipt.owner} />
            <InfoRow label="Rol" value={receipt.role} />
            <InfoRow label="Tipo de vehículo" value={receipt.vehicle} />
            <InfoRow label="Método de pago" value={receipt.method} />
            <InfoRow label="Fecha y hora" value={formatDateTime(receipt.datetime)} />
          </View>

          <View style={styles.total}>
            <Text style={styles.totalLabel}>Valor pagado</Text>
            <Text style={styles.totalValue}>{cop(receipt.amount)}</Text>
          </View>

          {/* Código de barras decorativo */}
          <View style={styles.bars}>
            {bars.map((w, i) => (
              <View key={i} style={{ width: 2, height: w * 6, backgroundColor: "rgba(15,27,51,0.7)" }} />
            ))}
          </View>
        </View>

        {/* Borde perforado */}
        <View style={styles.notchRow}>
          {Array.from({ length: NOTCHES }).map((_, i) => (
            <View key={i} style={styles.notch} />
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Conserva este comprobante. Válido únicamente para la fecha de pago indicada.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Compartir / Guardar" variant="outline" icon="share-variant-outline" onPress={handleCompartir} style={styles.flex} />
        <Button label="Nuevo pago" icon="restart" onPress={onNuevoPago} style={styles.flex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticket: {
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray100,
    overflow: "hidden",
    ...cardShadow,
  },
  body: { padding: 20, paddingBottom: 12 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: colors.green100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: colors.green700 },
  tag: { fontSize: 11, fontWeight: "500", color: colors.gray400 },
  codeLabel: { marginTop: 16, fontSize: 11, color: colors.gray400 },
  code: { fontSize: 18, fontWeight: "800", letterSpacing: 0.5, color: colors.navy },
  rows: { marginTop: 12 },
  total: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    backgroundColor: colors.navy,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  totalLabel: { fontSize: 14, color: "rgba(255,255,255,0.7)" },
  totalValue: { fontSize: 20, fontWeight: "800", color: colors.white },
  bars: { marginTop: 16, flexDirection: "row", alignItems: "flex-end", gap: 3, height: 26, opacity: 0.7 },
  notchRow: {
    height: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  notch: { height: 14, width: 14, borderRadius: 7, marginTop: 1, backgroundColor: colors.paper },
  footer: { backgroundColor: colors.paper, paddingHorizontal: 20, paddingVertical: 12 },
  footerText: { fontSize: 11, color: colors.gray400, textAlign: "center" },
  actions: { marginTop: 16, flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
});
