import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme";
import { Button, Card, Icon, Label } from "./ui";

interface PinGateProps {
  title: string;
  description: string;
  onSubmit: (pin: string) => boolean;
}

export default function PinGate({ title, description, onSubmit }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const ok = onSubmit(pin);
    if (!ok) {
      setError("PIN incorrecto. Verifica con coordinación de portería.");
      setPin("");
    }
  }

  return (
    <Card style={styles.card}>
      <View style={styles.iconBox}>
        <Icon name="lock-outline" size={22} color={colors.navy} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>

      <View style={styles.form}>
        <Label>PIN de acceso</Label>
        <TextInput
          value={pin}
          onChangeText={(t) => {
            setPin(t);
            if (error) setError("");
          }}
          secureTextEntry
          keyboardType="number-pad"
          maxLength={6}
          placeholder="••••"
          placeholderTextColor={colors.gray400}
          onSubmitEditing={handleSubmit}
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Ingresar" icon="shield-check-outline" onPress={handleSubmit} style={{ marginTop: 16 }} />
      </View>

      <Text style={styles.hint}>PIN de prueba (prototipo): 1234</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center" },
  iconBox: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "rgba(15,27,51,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginTop: 12, fontSize: 16, fontWeight: "700", color: colors.navy, textAlign: "center" },
  desc: { marginTop: 4, fontSize: 14, color: colors.gray500, textAlign: "center" },
  form: { marginTop: 16, alignSelf: "stretch" },
  input: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 6,
    textAlign: "center",
    color: colors.navy,
  },
  error: { marginTop: 8, fontSize: 14, color: colors.red600 },
  hint: { marginTop: 16, fontSize: 11, color: colors.gray400 },
});
