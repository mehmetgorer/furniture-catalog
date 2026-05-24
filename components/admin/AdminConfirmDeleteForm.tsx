"use client";

import { permanentDeleteConfirm } from "@/lib/admin/admin-copy";

type AdminConfirmDeleteFormProps = Readonly<{
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  entityLabel: string;
  className?: string;
  buttonClassName?: string;
}>;

export function AdminConfirmDeleteForm({
  action,
  id,
  entityLabel,
  className = "inline",
  buttonClassName = "rounded-full border border-red-800/80 px-3 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-950/50",
}: AdminConfirmDeleteFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(permanentDeleteConfirm(entityLabel))) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={buttonClassName}>
        Kalıcı Sil
      </button>
    </form>
  );
}
