import type { PlateDirectory, RateTable, PaymentMethodOption, Role, VehicleType } from "./types";

/** "Base de datos" simulada de vehículos autorizados. */
export const MOCK_DB: PlateDirectory = {
  ABC123: "Juan Camilo Restrepo",
  XYZ789: "María Fernanda Gómez",
  MOTO12: "Carlos Andrés Ruiz",
};

/** Tarifa plana diaria según Rol x Tipo de vehículo. */
export const RATES: RateTable = {
  Estudiante: { Carro: 6000, Moto: 3000 },
  Docente: { Carro: 5000, Moto: 2500 },
  Empleado: { Carro: 4000, Moto: 2000 },
};

/** PIN de acceso simulado para la vista exclusiva de celadores/portería. */
export const CELADOR_PIN = "1234";

export const ROLES: Role[] = ["Estudiante", "Docente", "Empleado"];
export const VEHICLES: VehicleType[] = ["Carro", "Moto"];

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: "Nequi", label: "Nequi", hint: "Pago desde tu app Nequi" },
  { id: "Bancolombia", label: "Bancolombia", hint: "Botón Bancolombia a la Mano" },
  { id: "Tarjeta", label: "Tarjeta crédito / débito", hint: "Visa, Mastercard, Amex" },
  { id: "PSE", label: "PSE", hint: "Débito directo desde tu banco" },
];

export function getRate(role: Role, vehicle: VehicleType): number {
  return RATES[role][vehicle];
}
