import { Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import PinGate from "../components/PinGate";
import GateHouse from "../components/GateHouse";
import { Icon } from "../components/ui";
import { useAppData } from "../context/AppDataContext";
import { colors } from "../theme";

export default function ReviewPage() {
  const { isCeladorAuthenticated, authenticateCelador, logoutCelador, payments } = useAppData();

  return (
    <Screen>
      {!isCeladorAuthenticated ? (
        <PinGate
          title="Acceso exclusivo para celadores"
          description="Ingresa el PIN de portería para verificar el estado de pago de los vehículos."
          onSubmit={authenticateCelador}
        />
      ) : (
        <View style={{ gap: 16 }}>
          <Pressable onPress={logoutCelador} style={styles.logout} accessibilityRole="button">
            <Icon name="logout" size={14} color={colors.gray400} />
            <Text style={styles.logoutText}>Cerrar sesión de portería</Text>
          </Pressable>
          <GateHouse payments={payments} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  logout: { alignSelf: "flex-end", flexDirection: "row", alignItems: "center", gap: 6 },
  logoutText: { fontSize: 12, fontWeight: "600", color: colors.gray400 },
});
