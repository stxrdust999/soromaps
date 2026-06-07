import { useState } from "react";
import {
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
//estados do popup do mapa
type PopupState = "view" | "edit" | "delete";

export default function LocationMarker({
  location,
  onUpdate,
  onDelete,
}: LocationMarkerProps) {
  const [state, setState] = useState<PopupState>("view");
  const [newName, setNewName] = useState(location.nome);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  //funcao pra editar o ponto
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/api/markers/${location.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: newName,
          lat: location.lat,
          lng: location.lng,
        }),
      });

      if (response.ok) {
        onUpdate({ ...location, nome: newName });
        setState("view"); // Volta para o modo de leitura
      } else {
        alert("Erro ao atualizar o ponto na API.");
      }
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
    }
  };

  //funcao pra deletar o ponto
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/markers/${location.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(location.id);
      } else {
        alert("Erro ao excluir o ponto na API.");
        setState("view");
      }
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      setState("view");
    }
  };

  // switch pra cada estado do pupup, se editar, vai ficar de tal jeito
  const renderPopupContent = () => {
    switch (state) {
      case "edit":
        return (
          <>
            <Input
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
                  setState("view");
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
        );

      case "delete":
        return (
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
                onClick={() => setState("view")}
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
        );

      case "view":
      default:
        return (
          <>
            <p className="text-sm font-bold truncate">{location.nome}</p>
            <p className="text-xs text-muted-foreground">Ponto de interesse</p>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="w-1/2"
                onClick={() => setState("edit")}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-1/2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setState("delete")}
              >
                Excluir
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <MapMarker longitude={location.lng} latitude={location.lat}>
      <MarkerContent>
        <div className="bg-primary size-4 rounded-full border-2 border-white shadow-lg cursor-pointer" />
      </MarkerContent>

      <MarkerTooltip>{location.nome}</MarkerTooltip>

      <MarkerPopup>
        <div className="p-2 w-48 space-y-2">{renderPopupContent()}</div>
      </MarkerPopup>
    </MapMarker>
  );
}
