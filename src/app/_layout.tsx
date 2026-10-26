import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppDataProvider } from "../context/AppDataContext";

export default function RootLayout() {
  return (
    <AppDataProvider>
      <StatusBar style="light" />
      <Slot />
    </AppDataProvider>
  );
}
