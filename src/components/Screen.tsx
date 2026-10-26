import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, MAX_WIDTH } from "../theme";
import AppHeader from "./AppHeader";

/**
 * Contenedor común de todas las páginas: franja segura superior, encabezado
 * institucional (que se desplaza con el contenido, como en la web) y pie de página.
 */
export default function Screen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* Mantiene legible la barra de estado aunque el encabezado se desplace */}
      <View style={{ height: insets.top, backgroundColor: colors.navyDark }} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppHeader />
          <View style={styles.content}>{children}</View>
          <Text style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
            © {new Date().getFullYear()} Corporación Universitaria Unilasallista — Prototipo
            funcional
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 20,
  },
  footer: { textAlign: "center", fontSize: 11, color: colors.gray400, paddingHorizontal: 20 },
});
