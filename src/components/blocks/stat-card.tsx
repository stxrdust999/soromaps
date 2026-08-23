import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
}

/**
 * Contador de perfil: número grande, rótulo pequeno.
 *
 * `tabular-nums` mantém a linha estável quando os valores mudam de largura —
 * uma faixa de quatro contadores dançando a cada render é o defeito que essa
 * classe evita.
 */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col">
        <span className="font-semibold text-2xl tabular-nums">{value}</span>
        <span className="text-muted-foreground text-xs">{label}</span>
      </CardContent>
    </Card>
  );
}
