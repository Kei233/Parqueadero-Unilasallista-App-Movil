import type { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, cardShadow } from "../theme";

export type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export function Icon({
  name,
  size = 16,
  color = colors.navy,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

// ---------------------------------------------------------------------------
// Botón principal / secundario
// ---------------------------------------------------------------------------
type ButtonVariant = "primary" | "outline" | "white" | "ghostLight";

const BUTTON_VARIANTS: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.purple, fg: colors.white },
  outline: { bg: colors.white, fg: colors.gray600, border: colors.gray200 },
  white: { bg: colors.white, fg: colors.navy },
  ghostLight: { bg: "transparent", fg: colors.white, border: "rgba(255,255,255,0.25)" },
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  trailingIcon,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const v = BUTTON_VARIANTS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        trailingIcon ? styles.buttonSpread : null,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : null,
        pressed && { opacity: 0.85 },
        inactive && { opacity: 0.65 },
        style,
      ]}
    >
      <View style={styles.buttonInner}>
        {loading ? (
          <ActivityIndicator size="small" color={v.fg} />
        ) : icon ? (
          <Icon name={icon} size={18} color={v.fg} />
        ) : null}
        <Text style={[styles.buttonText, { color: v.fg }]}>{label}</Text>
      </View>
      {trailingIcon ? <Icon name={trailingIcon} size={16} color={v.fg} /> : null}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Opción seleccionable (rol, tipo de vehículo...)
// ---------------------------------------------------------------------------
export function Choice({
  label,
  active,
  onPress,
  icon,
  disabled = false,
  style,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const fg = active ? colors.purple : colors.gray500;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      style={[
        styles.choice,
        active ? styles.choiceActive : styles.choiceIdle,
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={fg} /> : null}
      <Text style={[styles.choiceText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Campos y avisos
// ---------------------------------------------------------------------------
export function PlateInput({
  value,
  onChangeText,
  editable = true,
  ...rest
}: TextInputProps) {
  return (
    <TextInput
      {...rest}
      value={value}
      onChangeText={(t) => onChangeText?.(t.toUpperCase())}
      editable={editable}
      placeholder="Ej: ABC123"
      placeholderTextColor={colors.gray400}
      autoCapitalize="characters"
      autoCorrect={false}
      autoComplete="off"
      maxLength={8}
      style={[styles.plateInput, !editable && { opacity: 0.6 }]}
    />
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.errorBanner} accessibilityRole="alert">
      <Icon name="close-circle" size={16} color={colors.red600} />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

/** Fila "etiqueta ... valor" usada en comprobante y resultado de portería. */
export function InfoRow({
  label,
  value,
  first = false,
  borderColor = colors.gray200,
}: {
  label: string;
  value: string;
  first?: boolean;
  borderColor?: string;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !first && { borderTopWidth: 1, borderTopColor: borderColor },
      ]}
    >
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
    padding: 20,
    ...cardShadow,
  },
  label: { fontSize: 12, fontWeight: "600", color: colors.gray600 },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonSpread: { justifyContent: "space-between" },
  buttonInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  buttonText: { fontSize: 15, fontWeight: "600" },

  choice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
  },
  choiceActive: { borderColor: colors.purple, backgroundColor: colors.purpleTint },
  choiceIdle: { borderColor: colors.gray200, backgroundColor: colors.white },
  choiceText: { fontSize: 14, fontWeight: "600" },

  plateInput: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
    color: colors.navy,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.red100,
    backgroundColor: colors.red50,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: { flex: 1, fontSize: 14, color: colors.red700, lineHeight: 19 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 14, color: colors.gray500 },
  infoValue: { flexShrink: 1, fontSize: 14, fontWeight: "600", color: colors.navy, textAlign: "right" },
});
