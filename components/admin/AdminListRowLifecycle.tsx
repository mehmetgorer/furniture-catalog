import { AdminConfirmDeleteForm } from "@/components/admin/AdminConfirmDeleteForm";

type AdminListRowLifecycleProps = Readonly<{
  id: string;
  isActive: boolean;
  entityLabel: string;
  deactivateAction: (formData: FormData) => void | Promise<void>;
  activateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
}>;

export function AdminListRowLifecycle({
  id,
  isActive,
  entityLabel,
  deactivateAction,
  activateAction,
  deleteAction,
}: AdminListRowLifecycleProps) {
  if (isActive) {
    return (
      <form action={deactivateAction} className="inline">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-full border border-amber-800/80 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-950/40"
        >
          Pasife Al
        </button>
      </form>
    );
  }

  return (
    <>
      <form action={activateAction} className="inline">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-full border border-emerald-800/80 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-950/40"
        >
          Aktifleştir
        </button>
      </form>
      <AdminConfirmDeleteForm action={deleteAction} id={id} entityLabel={entityLabel} />
    </>
  );
}
