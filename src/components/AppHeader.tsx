import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, usePathname, type Href } from "expo-router";
import { colors, MAX_WIDTH } from "../theme";
import { Icon, type IconName } from "./ui";

const NAV_ITEMS: { href: Href; path: string; label: string; icon: IconName }[] = [
  { href: "/" as Href, path: "/", label: "Inicio", icon: "home-outline" },
  { href: "/pago" as Href, path: "/pago", label: "Pagar", icon: "credit-card-outline" },
  { href: "/registro" as Href, path: "/registro", label: "Registro", icon: "account-plus-outline" },
  { href: "/revision" as Href, path: "/revision", label: "Portería", icon: "shield-check-outline" },
];

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <LinearGradient
      colors={[colors.navyDark, colors.navy, colors.purpleDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.inner}>
        <Pressable
          onPress={() => router.navigate("/" as Href)}
          style={styles.brand}
          accessibilityRole="link"
          accessibilityLabel="Ir al inicio"
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>UL</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.brandSmall}>Corporación Universitaria</Text>
            <Text style={styles.brandTitle} numberOfLines={1}>
              Parqueadero Unilasallista
            </Text>
          </View>
        </Pressable>

        <Text style={styles.tagline}>
          Paga tu tarifa diaria en línea, registra tu vehículo o verifica pagos desde portería.
        </Text>

        <View style={styles.nav} accessibilityRole="tablist">
          {NAV_ITEMS.map((item) => {
            const active = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
            return (
              <Pressable
                key={item.path}
                onPress={() => router.navigate(item.href)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[styles.navItem, active && styles.navItemActive]}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  color={active ? colors.navy : "rgba(255,255,255,0.75)"}
                />
                <Text style={[styles.navLabel, { color: active ? colors.navy : "rgba(255,255,255,0.75)" }]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: colors.white, fontSize: 16, fontWeight: "800" },
  brandSmall: { color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: "600" },
  brandTitle: { color: colors.white, fontSize: 18, fontWeight: "800" },
  tagline: { marginTop: 12, color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 19 },
  nav: {
    marginTop: 20,
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navItemActive: { backgroundColor: colors.white },
  navLabel: { fontSize: 11, fontWeight: "600" },
});
