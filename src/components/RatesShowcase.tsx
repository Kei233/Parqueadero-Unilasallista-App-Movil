import { StyleSheet, Text, View } from "react-native";
import { ROLES, RATES } from "../data";
import { cop } from "../utils";
import { colors } from "../theme";
import type { Role } from "../types";
import { Icon, type IconName } from "./ui";

const ROLE_ICONS: Record<Role, IconName> = {
  Estudiante: "school-outline",
  Docente: "book-open-variant",
  Empleado: "briefcase-outline",
};

/** Vitrina de tarifas siempre visible (página de inicio). */
export default function RatesShowcase() {
  return (
    <View style={styles.wrap}>
      {ROLES.map((role) => (
        <View key={role} style={styles.card}>
          <View style={styles.head}>
            <View style={styles.iconBox}>
              <Icon name={ROLE_ICONS[role]} size={18} color={colors.purple} />
            </View>
            <Text style={styles.role}>{role}</Text>
          </View>
          <View style={styles.prices}>
            <View style={styles.price}>
              <Icon name="car" size={14} color={colors.gray400} />
              <Text style={styles.priceText}>{cop(RATES[role].Carro)}</Text>
            </View>
            <View style={styles.price}>
              <Icon name="motorbike" size={14} color={colors.gray400} />
              <Text style={styles.priceText}>{cop(RATES[role].Moto)}</Text>
            </View>
          </View>
        </View>
      ))}
      <Text style={styles.note}>Tarifa plana diaria — no se cobra por horas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16, gap: 10 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
    backgroundColor: colors.gray50,
    padding: 16,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    height: 36,
    width: 36,
    borderRadius: 12,
    backgroundColor: colors.purpleTint,
    alignItems: "center",
    justifyContent: "center",
  },
  role: { fontSize: 14, fontWeight: "700", color: colors.navy },
  prices: { marginTop: 12, flexDirection: "row", gap: 8 },
  price: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray100,
    backgroundColor: colors.white,
    paddingVertical: 8,
  },
  priceText: { fontSize: 14, fontWeight: "800", color: colors.navy },
  note: { fontSize: 11, color: colors.gray400, textAlign: "center", paddingTop: 2 },
});
