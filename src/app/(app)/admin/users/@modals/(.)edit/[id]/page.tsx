import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import UserForm from "../../../_components/user-form";

interface EditUserModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserModalPage({ params }: EditUserModalPageProps) {
  const { id } = await params;

  return (
    <div>
      <Dialog open>
        <DialogContent
          showCloseButton={false}
          className="py-6 px-0 border border-black/20"
        >
          <UserForm onSubmit={() => {}} isEditing />
        </DialogContent>
      </Dialog>
    </div>
  );
}
