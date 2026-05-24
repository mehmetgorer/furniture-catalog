type AdminActionAlertProps = Readonly<{
  deactivateError?: string;
  deactivated?: string;
  activateError?: string;
  activated?: string;
  deleteError?: string;
  deleted?: string;
}>;

export function AdminActionAlert({
  deactivateError,
  deactivated,
  activateError,
  activated,
  deleteError,
  deleted,
}: AdminActionAlertProps) {
  const error = deactivateError ?? activateError ?? deleteError;
  if (error) {
    return (
      <p
        className="mt-6 rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-100"
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (deactivated) {
    return (
      <p className="mt-6 rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
        Pasife alındı. Bu listede kalır; vitrin sitesinde görünmez.
      </p>
    );
  }

  if (activated) {
    return (
      <p className="mt-6 rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
        Aktifleştirildi. Vitrin sitesinde tekrar yayınlanır.
      </p>
    );
  }

  if (deleted) {
    return (
      <p className="mt-6 rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
        Kalıcı olarak silindi. Yüklenen görseller dosya depolama alanında kalabilir.
      </p>
    );
  }

  return null;
}
