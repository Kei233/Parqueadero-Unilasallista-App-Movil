import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { MOCK_DB, CELADOR_PIN } from "../data";
import type { PlateDirectory, PaymentsStore, Receipt } from "../types";

interface AppDataContextValue {
  plates: PlateDirectory;
  registerPlate: (plate: string, owner: string) => void;

  payments: PaymentsStore;
  registerPayment: (receipt: Receipt) => void;

  isCeladorAuthenticated: boolean;
  authenticateCelador: (pin: string) => boolean;
  logoutCelador: () => void;

  /** Permite precargar en /pago la placa recién registrada en /registro. */
  lastRegisteredPlate: string | null;
  setLastRegisteredPlate: (plate: string | null) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [plates, setPlates] = useState<PlateDirectory>(MOCK_DB);
  const [payments, setPayments] = useState<PaymentsStore>({});
  const [isCeladorAuthenticated, setIsCeladorAuthenticated] = useState(false);
  const [lastRegisteredPlate, setLastRegisteredPlate] = useState<string | null>(null);

  const value = useMemo<AppDataContextValue>(
    () => ({
      plates,
      registerPlate: (plate, owner) => {
        setPlates((prev) => ({ ...prev, [plate]: owner }));
      },
      payments,
      registerPayment: (receipt) => {
        setPayments((prev) => ({ ...prev, [receipt.plate]: receipt }));
      },
      isCeladorAuthenticated,
      authenticateCelador: (pin) => {
        const ok = pin === CELADOR_PIN;
        if (ok) setIsCeladorAuthenticated(true);
        return ok;
      },
      logoutCelador: () => setIsCeladorAuthenticated(false),
      lastRegisteredPlate,
      setLastRegisteredPlate,
    }),
    [plates, payments, isCeladorAuthenticated, lastRegisteredPlate]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData debe usarse dentro de <AppDataProvider>");
  return ctx;
}
