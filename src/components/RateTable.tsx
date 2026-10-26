import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ROLES, RATES } from "../data";
import { cop } from "../utils";
import { colors } from "../theme";
import { Icon } from "./ui";

/** Tabla de tarifas compacta y colapsable (usada dentro del flujo de pago). */
export default function RateTable() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.box}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>Ver tabla de tarifas del día</Text>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.gray400} />
      </Pressable>

      {open && (
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.roleCol} />
            <View style={styles.cell}>
              <Icon name="car" size={14} color={colors.gray500} />
              <Text style={styles.head}>Carro</Text>
            </View>
            <View style={styles.cell}>
              <Icon name="motorbike" size={14} color={colors.gray500} />
              <Text style={styles.head}>Moto</Text>
            </View>
          </View>
          {ROLES.map((role) => (
            <View key={role} style={styles.row}>
              <Text style={[styles.roleCol, styles.roleText]}>{role}</Text>
              <Text style={[styles.col, styles.price]}>{cop(RATES[role].Carro)}</Text>
              <Text style={[styles.col, styles.price]}>{cop(RATES[role].Moto)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: "hidden",
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleText: { fontSize: 14, fontWeight: "600", color: colors.navy },
  table: { padding: 12 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  roleCol: { flex: 1.2 },
  roleText: { fontSize: 14, fontWeight: "500", color: colors.gray700 },
  cell: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  col: { flex: 1, textAlign: "center" },
  head: { fontSize: 12, fontWeight: "600", color: colors.gray500 },
  price: { fontSize: 14, fontWeight: "600", color: colors.navy },
});
