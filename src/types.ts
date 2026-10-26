export type Role = "Estudiante" | "Docente" | "Empleado";

export type VehicleType = "Carro" | "Moto";

export type PaymentMethodId = "Nequi" | "Bancolombia" | "Tarjeta" | "PSE";

export interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
  hint: string;
}

export interface Receipt {
  code: string;
  plate: string;
  owner: string;
  role: Role;
  vehicle: VehicleType;
  amount: number;
  method: PaymentMethodId;
  datetime: Date;
}

export interface GateCheckResult {
  status: "paid" | "pending";
  plate: string;
  data: Receipt | null;
}

/** Diccionario placa -> propietario, simula la tabla de vehículos registrados. */
export type PlateDirectory = Record<string, string>;

/** Tabla de tarifas planas diarias, indexada por Rol y luego por tipo de vehículo. */
export type RateTable = Record<Role, Record<VehicleType, number>>;

/** Registro de pagos del día, indexado por placa. */
export type PaymentsStore = Record<string, Receipt>;
