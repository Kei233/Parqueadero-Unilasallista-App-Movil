import { StyleSheet, Text, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import Screen from "../components/Screen";
import { Button, Card, Icon } from "../components/ui";
import { colors } from "../theme";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Screen>
      <Card style={styles.card}>
        <View style={styles.iconBox}>
          <Icon name="compass-outline" size={24} color={colors.navy} />
        </View>
        <Text style={styles.title}>Página no encontrada</Text>
        <Text style={styles.desc}>
          La ruta que buscas no existe dentro de la plataforma de parqueadero.
        </Text>
        <Button label="Volver al inicio" onPress={() => router.navigate("/" as Href)} style={{ marginTop: 20, alignSelf: "stretch" }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", padding: 32 },
  iconBox: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "rgba(15,27,51,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginTop: 12, fontSize: 16, fontWeight: "700", color: colors.navy },
  desc: { marginTop: 4, fontSize: 14, color: colors.gray500, textAlign: "center" },
});
