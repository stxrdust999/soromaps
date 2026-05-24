import { useState } from "react";
import {
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";

interface Location {
  id: number;
  nome: string;
  lat: number;
  lng: number;
}

interface LocationMarkerProps {
  location: Location;
  onUpdate: (updatedLocation: Location) => void;
  onDelete: (id: number) => void;
}

export default function LocationMarker({
  location,
  onUpdate,
  onDelete,
}: LocationMarkerProps) {
  // Controle para saber se estamos editando ou apenas visualizando
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Guarda o texto que o usuário está digitando no momento
  const [newName, setNewName] = useState(location.nome);

  const handleSave = async () => {
    try {
      // Fazendo o PUT na API (ajuste a URL se sua rota for diferente)
      const response = await fetch(
        `http://localhost:5068/api/markers/${location.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: newName,
            lat: location.lat,
            lng: location.lng,
          }),
        },
      );

      if (response.ok) {
        // Se a API retornar sucesso, avisa o componente pai para atualizar a tela
        onUpdate({ ...location, nome: newName });
        setIsEditing(false);
      } else {
        alert("Erro ao atualizar o ponto na API.");
      }
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Fazendo o DELETE na API (o padrão REST é enviar a requisição para a rota do ID)
      const response = await fetch(
        `http://localhost:5068/api/markers/${location.id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Se a API retornar sucesso, avisa a HomePage para remover o ponto da tela
        onDelete(location.id);
      } else {
        alert("Erro ao excluir o ponto na API.");
        setIsDeleting(false); // Cancela o visual de exclusão em caso de erro
      }
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      setIsDeleting(false);
    }
  };

  return (
    <MapMarker longitude={location.lng} latitude={location.lat}>
      <MarkerContent>
        {/* O "pinguinho" no mapa */}
        <div className="bg-primary size-4 rounded-full border-2 border-white shadow-lg cursor-pointer" />
      </MarkerContent>

      <MarkerTooltip>{location.nome}</MarkerTooltip>

      <MarkerPopup>
        <div className="p-2 w-48 space-y-2">
          {isDeleting ? (
            // --- MODO CONFIRMAÇÃO DE EXCLUSÃO ---
            <>
              <p className="text-sm font-bold text-center text-red-500">
                Excluir ponto?
              </p>
              <p className="text-xs text-center text-muted-foreground mb-2">
                Isso não pode ser desfeito.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-1/2"
                  onClick={() => setIsDeleting(false)}
                >
                  Não
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-1/2"
                  onClick={handleDelete}
                >
                  Sim
                </Button>
              </div>
            </>
          ) : isEditing ? (
            // --- MODO EDIÇÃO ---
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-sm border rounded p-1 text-black bg-white"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-1/2"
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(location.nome);
                  }}
                >
                  Cancelar
                </Button>
                <Button size="sm" className="w-1/2" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </>
          ) : (
            // --- MODO LEITURA ---
            <>
              <p className="text-sm font-bold truncate">{location.nome}</p>
              <p className="text-xs text-muted-foreground">
                Ponto de interesse
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-1/2"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-1/2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsDeleting(true)}
                >
                  Excluir
                </Button>
              </div>
            </>
          )}
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}
