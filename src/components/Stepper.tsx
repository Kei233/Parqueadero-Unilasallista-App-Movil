import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { Icon } from "./ui";

const STEP_LABELS = ["Placa", "Tarifa", "Pago", "Comprobante"];

export default function Stepper({ step }: { step: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Paso ${step} de ${STEP_LABELS.length}`}>
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <View key={label} style={styles.item}>
            <View style={styles.line}>
              <View
                style={[
                  styles.connector,
                  i === 0 && { backgroundColor: "transparent" },
                  (done || active) && i !== 0 && { backgroundColor: colors.purple },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  done ? styles.dotDone : active ? styles.dotActive : styles.dotIdle,
                ]}
              >
                {done ? (
                  <Icon name="check" size={14} color={colors.white} />
                ) : (
                  <Text style={[styles.dotText, { color: active ? colors.white : colors.gray500 }]}>
                    {n}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.connector,
                  i === STEP_LABELS.length - 1 && { backgroundColor: "transparent" },
                  done && i !== STEP_LABELS.length - 1 && { backgroundColor: colors.purple },
                ]}
              />
            </View>
            <Text style={[styles.label, { color: active ? colors.navy : colors.gray400 }]}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  item: { flex: 1, alignItems: "center" },
  line: { flexDirection: "row", alignItems: "center", width: "100%" },
  connector: { flex: 1, height: 2, backgroundColor: colors.gray200 },
  dot: { height: 28, width: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dotDone: { backgroundColor: colors.purple },
  dotActive: { backgroundColor: colors.navy },
  dotIdle: { backgroundColor: colors.gray200 },
  dotText: { fontSize: 12, fontWeight: "700" },
  label: { marginTop: 6, fontSize: 11, fontWeight: "500" },
});
