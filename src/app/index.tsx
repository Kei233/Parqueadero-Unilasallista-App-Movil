import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, type Href } from "expo-router";
import Screen from "../components/Screen";
import RatesShowcase from "../components/RatesShowcase";
import FaqAccordion from "../components/FaqAccordion";
import { Button, Card, Icon, type IconName } from "../components/ui";
import { colors, cardShadow } from "../theme";

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "clipboard-check-outline",
    title: "Consulta tu placa",
    text: "Verificamos que tu vehículo esté registrado en el sistema.",
  },
  {
    icon: "wallet-outline",
    title: "Revisa tu tarifa",
    text: "Según tu rol y tipo de vehículo calculamos el valor del día.",
  },
  {
    icon: "check-decagram-outline",
    title: "Paga y descarga",
    text: "Confirma el pago y guarda tu colilla virtual como comprobante.",
  },
];

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: "clock-outline", title: "Ahorra tiempo", text: "Paga en menos de un minuto, sin filas físicas en portería." },
  { icon: "shield-check-outline", title: "Pago seguro", text: "Procesado con los principales medios de pago del país." },
  { icon: "receipt-text-outline", title: "Comprobante digital", text: "Descarga tu colilla virtual como respaldo del pago." },
  { icon: "cellphone", title: "Disponible 24/7", text: "Ingresa desde cualquier dispositivo, cuando lo necesites." },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <Screen>
      {/* HERO */}
      <LinearGradient
        colors={[colors.navyDark, colors.navy, colors.purpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroIconTop} pointerEvents="none">
          <Icon name="ticket-outline" size={96} color="rgba(255,255,255,0.10)" />
        </View>
        <View style={styles.heroIconBottom} pointerEvents="none">
          <Icon name="cash" size={80} color="rgba(255,255,255,0.10)" />
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillText}>Plataforma virtual de parqueadero</Text>
        </View>
        <Text style={styles.heroTitle}>Tu parqueadero, pagado en minutos</Text>
        <Text style={styles.heroText}>
          Estudiantes, docentes y empleados de la Corporación Universitaria Unilasallista pueden
          pagar su tarifa diaria desde el celular o el computador, sin filas en portería.
        </Text>

        <View style={styles.heroButtons}>
          <Button
            variant="white"
            icon="car"
            trailingIcon="arrow-right"
            label="Pagar mi parqueadero"
            onPress={() => router.navigate("/pago" as Href)}
          />
          <Button
            variant="ghostLight"
            icon="account-plus-outline"
            trailingIcon="arrow-right"
            label="Registrar mi vehículo"
            onPress={() => router.navigate("/registro" as Href)}
          />
        </View>
      </LinearGradient>

      {/* BENEFICIOS */}
      <Card>
        <Text style={styles.sectionTitle}>¿Por qué pagar en línea?</Text>
        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Icon name={b.icon} size={18} color={colors.purple} />
              </View>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* CÓMO FUNCIONA */}
      <Card>
        <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.stepTitleRow}>
                  <Icon name={s.icon} size={15} color={colors.purple} />
                  <Text style={styles.stepTitle}>{s.title}</Text>
                </View>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* TARIFAS */}
      <Card>
        <View style={styles.tariffHead}>
          <Text style={styles.sectionTitle}>Tarifas del día</Text>
          <View style={styles.tariffPill}>
            <Text style={styles.tariffPillText}>Desde 12:00 a.m.</Text>
          </View>
        </View>
        <RatesShowcase />
      </Card>

      {/* FAQ */}
      <Card>
        <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
        <FaqAccordion />
      </Card>

      <Pressable onPress={() => router.navigate("/revision" as Href)} style={styles.staffLink} accessibilityRole="link">
        <Icon name="shield-check-outline" size={14} color={colors.gray400} />
        <Text style={styles.staffLinkText}>¿Eres celador de portería? Ingresa a la vista de revisión</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 16, padding: 24, overflow: "hidden", ...cardShadow },
  heroIconTop: { position: "absolute", right: -12, top: -12, transform: [{ rotate: "12deg" }] },
  heroIconBottom: { position: "absolute", left: -16, bottom: 8 },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pillText: { fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.7)" },
  heroTitle: { marginTop: 12, fontSize: 24, fontWeight: "800", color: colors.white, lineHeight: 30 },
  heroText: { marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 21 },
  heroButtons: { marginTop: 20, gap: 8 },

  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.navy },

  benefits: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  benefit: {
    flexGrow: 1,
    flexBasis: "45%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
    backgroundColor: colors.gray50,
    padding: 14,
  },
  benefitIcon: {
    height: 32,
    width: 32,
    borderRadius: 8,
    backgroundColor: colors.purpleTint,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTitle: { marginTop: 8, fontSize: 12, fontWeight: "700", color: colors.navy },
  benefitText: { marginTop: 2, fontSize: 11, color: colors.gray500, lineHeight: 15 },

  steps: { marginTop: 12, gap: 12 },
  step: { flexDirection: "row", gap: 12 },
  stepNumber: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: colors.purpleTint,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: { fontSize: 12, fontWeight: "700", color: colors.purple },
  stepTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  stepTitle: { fontSize: 14, fontWeight: "600", color: colors.navy },
  stepText: { marginTop: 2, fontSize: 12, color: colors.gray500 },

  tariffHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tariffPill: { borderRadius: 999, backgroundColor: colors.purpleTint, paddingHorizontal: 10, paddingVertical: 4 },
  tariffPillText: { fontSize: 11, fontWeight: "600", color: colors.purple },

  staffLink: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 4 },
  staffLinkText: { flexShrink: 1, fontSize: 12, fontWeight: "600", color: colors.gray400, textAlign: "center" },
});
