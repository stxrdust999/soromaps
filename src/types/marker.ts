/**
 * Marcador como `GET /api/markers` devolve — a API mantém os campos em pt-BR,
 * diferente de `UserResource`, que chega em camelCase.
 */
export interface MarkerResource {
  id: number;
  nome: string;
  lat: number;
  lng: number;
}
