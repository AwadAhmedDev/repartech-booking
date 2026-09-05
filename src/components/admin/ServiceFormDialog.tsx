import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Service } from "../../types/database";
import type { ServiceInput } from "../../lib/api";

export function ServiceFormDialog({
  initial,
  onSave,
  onClose,
}: {
  initial: Service | null;
  onSave: (input: ServiceInput) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [duration, setDuration] = useState(initial?.duration_minutes ?? 60);
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [priceMax, setPriceMax] = useState(initial?.price_max ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        duration_minutes: duration,
        price,
        price_max: priceMax > price ? priceMax : null,
        is_active: isActive,
      });
    } catch (err) {
      console.error("Failed to save service:", err);
      setError("Impossible d'enregistrer ce service. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-0 py-0 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8">
      <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-navy-900 p-6 shadow-premium sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">
            {initial ? "Modifier le Service" : "Ajouter un Service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">
              Nom du Service
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">
              Description
            </span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">
                Durée (minutes)
              </span>
              <input
                required
                type="number"
                min={15}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">
                Prix minimum (€)
              </span>
              <input
                required
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">
                Prix maximum (€)
              </span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                placeholder="Laisser à 0 si prix fixe"
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/60"
              />
            </label>
          </div>

          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-400"
            />
            <span className="text-sm text-white/70">
              Actif (visible sur le site public)
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3.5 py-2.5 text-xs text-danger-500">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {initial ? "Enregistrer les Modifications" : "Ajouter un Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
