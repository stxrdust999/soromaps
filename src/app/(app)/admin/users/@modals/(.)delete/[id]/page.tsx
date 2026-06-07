import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function DeleteUserModalPage({ params }: DeleteUserModalPageProps) {
  const { id } = await params;

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="py-6 px-6 border border-black/20">
        <div className="flex flex-col gap-2">
          <DialogTitle className="font-semibold text-lg">Excluir usuário</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
          </DialogDescription>
        </div>
        
        <div className="flex flex-row justify-end gap-3 mt-4">
          <Button variant="secondary">
            Cancelar
          </Button>
          <Button variant="destructive">
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
