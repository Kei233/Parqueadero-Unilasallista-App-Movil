import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { Icon } from "./ui";

const FAQS = [
  {
    question: "¿Qué pasa si no pago el parqueadero hoy?",
    answer:
      "El celador de portería verifica tu placa en la vista de revisión. Si no registra pago del día, se aplica el protocolo institucional para vehículos sin pago vigente.",
  },
  {
    question: "¿Puedo pagar para varios días a la vez?",
    answer:
      "No. La tarifa es plana y diaria: cada pago cubre únicamente el día en curso, desde las 12:00 a. m.",
  },
  {
    question: "¿Qué hago si mi placa no aparece registrada?",
    answer:
      "Regístrala primero con tu número de placa, rol y tipo de vehículo en la sección Registro. Después podrás iniciar el pago con normalidad.",
  },
  {
    question: "¿Puedo cambiar de rol o de vehículo cada día?",
    answer:
      "Sí. En cada pago eliges tu rol (Estudiante, Docente o Empleado) y el tipo de vehículo, y la tarifa se calcula automáticamente según esa combinación.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <View style={styles.list}>
      {FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <View key={faq.question} style={[styles.item, i > 0 && styles.divider]}>
            <Pressable
              onPress={() => setOpenIndex(open ? null : i)}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              style={styles.question}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Icon name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.gray400} />
            </Pressable>
            {open && <Text style={styles.answer}>{faq.answer}</Text>}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 4 },
  item: { paddingVertical: 6 },
  divider: { borderTopWidth: 1, borderTopColor: colors.gray100 },
  question: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingVertical: 8 },
  questionText: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.navy },
  answer: { paddingBottom: 8, paddingRight: 24, fontSize: 12, color: colors.gray500, lineHeight: 18 },
});
