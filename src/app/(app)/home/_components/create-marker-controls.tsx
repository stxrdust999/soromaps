import { Button } from "@/components/ui/button";

interface CreateMarkerControlsProps {
  isCreating: boolean;
  onStartCreating: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function CreateMarkerControls({
  isCreating,
  onStartCreating,
  onCancel,
  onSave,
}: CreateMarkerControlsProps) {
  return (
    <div className="flex gap-2 mt-2 w-full justify-between">
      {!isCreating ? (
        <Button onClick={onStartCreating} className="w-full">
          + Adicionar Novo Local
        </Button>
      ) : (
        <>
          <Button variant="destructive" onClick={onCancel} className="w-1/2">
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={onSave}
            className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
          >
            Salvar Ponto Aqui
          </Button>
        </>
      )}
    </div>
  );
}