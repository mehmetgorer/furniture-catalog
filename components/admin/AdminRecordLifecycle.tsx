import { AdminConfirmDeleteForm } from "@/components/admin/AdminConfirmDeleteForm";
import {
  entityActivateButtonLabel,
  entityDeactivateButtonLabel,
} from "@/lib/admin/admin-copy";

type AdminRecordLifecycleProps = Readonly<{
  entityLabel: string;
  recordId: string;
  isActive: boolean;
  deactivateAction: (formData: FormData) => void | Promise<void>;
  activateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
}>;

export function AdminRecordLifecycle({
  entityLabel,
  recordId,
  isActive,
  deactivateAction,
  activateAction,
  deleteAction,
}: AdminRecordLifecycleProps) {
  if (isActive) {
    return (
      <section className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-6">
        <h2 className="text-sm font-semibold text-amber-100">Pasife Al</h2>
        <p className="mt-2 text-sm text-amber-200/80">
          Bu {entityLabel} vitrin sitesinde gizlenir. Daha sonra pasifken tekrar aktifleştirebilir veya kalıcı olarak
          silebilirsiniz.
        </p>
        <form action={deactivateAction} className="mt-4">
          <input type="hidden" name="id" value={recordId} />
          <button
            type="submit"
            className="min-h-[44px] rounded-full border border-amber-700/80 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            {entityDeactivateButtonLabel(entityLabel)}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6">
        <h2 className="text-sm font-semibold text-emerald-100">Aktifleştir</h2>
        <p className="mt-2 text-sm text-emerald-200/80">Bu {entityLabel} vitrin sitesinde tekrar görünür hale gelir.</p>
        <form action={activateAction} className="mt-4">
          <input type="hidden" name="id" value={recordId} />
          <button
            type="submit"
            className="min-h-[44px] rounded-full border border-emerald-700/80 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            {entityActivateButtonLabel(entityLabel)}
          </button>
        </form>
      </div>

      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
        <h2 className="text-sm font-semibold text-red-100">Kalıcı Sil</h2>
        <p className="mt-2 text-sm text-red-200/80">
          Bu içerik kalıcı olarak kaldırılır. Yalnızca pasifken kullanılabilir. Yüklenen görseller otomatik silinmez.
        </p>
        <AdminConfirmDeleteForm
          action={deleteAction}
          id={recordId}
          entityLabel={entityLabel}
          className="mt-4"
          buttonClassName="min-h-[44px] rounded-full border border-red-700/80 px-5 py-2.5 text-sm font-semibold text-red-100 transition hover:bg-red-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        />
      </section>
    </section>
  );
}
