import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ModerationDecisionMock,
  moderationHistoryMock,
} from "@/mocks/admin-moderation";

type Decision = ModerationDecisionMock["decisao"];

const DECISION_VARIANT: Record<
  Decision,
  "success" | "destructive" | "secondary"
> = {
  aprovado: "success",
  rejeitado: "destructive",
  devolvido: "secondary",
};

/** Rótulo curto: na coluna, "Devolvido ao autor" empurraria a tabela. */
const DECISION_LABEL: Record<Decision, string> = {
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  devolvido: "Devolvido",
};

/** Trilha de auditoria das decisões recentes, com desfazer de janela curta. */
export function HistoryTable() {
  return (
    <div className="flex flex-col gap-3.5 px-8 pb-9">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ponto</TableHead>
            <TableHead className="w-36">Decisão</TableHead>
            <TableHead className="w-52">Motivo</TableHead>
            <TableHead className="w-44">Moderador</TableHead>
            <TableHead className="w-40">Quando</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {moderationHistoryMock.map((decision) => (
            <TableRow key={decision.id}>
              <TableCell>
                <p className="font-medium">{decision.nome}</p>
                <p className="text-muted-foreground text-xs">
                  {decision.bairro}
                </p>
              </TableCell>

              <TableCell>
                <Badge variant={DECISION_VARIANT[decision.decisao]}>
                  {DECISION_LABEL[decision.decisao]}
                </Badge>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {decision.motivo ?? "—"}
              </TableCell>

              <TableCell>{decision.moderador}</TableCell>

              <TableCell className="text-muted-foreground tabular-nums">
                {decision.quando}
              </TableCell>

              <TableCell className="text-right">
                {decision.podeDesfazer ? (
                  <Button variant="outline" size="xs">
                    Desfazer
                  </Button>
                ) : (
                  <span className="text-muted-foreground/70 text-xs">
                    prazo esgotado
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="text-muted-foreground px-1 text-xs">
        Decisões dos últimos 7 dias · “Desfazer” fica disponível por 24 h após a
        decisão.
      </p>
    </div>
  );
}
