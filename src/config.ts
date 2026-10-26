/**
 * URL base del backend. Se puede definir con la variable EXPO_PUBLIC_API_URL
 * (por ejemplo en un archivo .env) sin tocar el código.
 *
 * Ojo: "localhost" dentro de un celular o emulador NO apunta a tu computador.
 *  - Emulador Android:  http://10.0.2.2:8080
 *  - Celular físico:    http://<IP-de-tu-PC-en-la-red>:8080
 *  - Simulador iOS/web: http://localhost:8080
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export const REGISTER_ENDPOINT = `${API_BASE_URL}/api/vehiculos/registrar`;
