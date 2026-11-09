"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Image as ImageIcon,
  X,
  Upload,
  Shirt,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { ClothingDesign } from "@/lib/data/types";
import { formatLkr } from "@/lib/format";
import { CATEGORIES, labelOf, type Category } from "@/lib/survey/options";
import {
  createDesignAction,
  updateDesignAction,
  toggleDesignActiveAction,
  uploadDesignImageAction,
} from "@/lib/admin/actions";

export function DesignsView({ designs }: { designs: ClothingDesign[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<ClothingDesign | null>(null);

  const handleOpenAdd = () => {
    setEditingDesign(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (d: ClothingDesign) => {
    setEditingDesign(d);
    setModalOpen(true);
  };

  const handleToggle = async (d: ClothingDesign) => {
    const nextState = !d.is_active;
    const res = await toggleDesignActiveAction(d.id, nextState);
    if (res.ok) {
      toast.success(`${d.design_name} is now ${nextState ? "active" : "inactive"}`);
    } else {
      toast.error(res.error || "Failed to update design");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-medium text-ink">Clothing Designs</h3>
          <p className="text-xs text-muted-foreground">
            Manage designs displayed in the public survey gallery. Only active designs are shown.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-wine px-5 text-xs font-medium text-ivory shadow-sm transition hover:bg-wine-dark"
        >
          <Plus className="size-4" /> Add New Design
        </button>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {designs.map((d) => (
          <div
            key={d.id}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition ${
              d.is_active ? "border-border/80" : "border-border/40 opacity-60"
            }`}
          >
            {/* Image Preview */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream">
              {d.image_url ? (
                <Image
                  src={d.image_url}
                  alt={d.design_name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-taupe">
                  <Shirt className="size-10" strokeWidth={1.5} />
                </div>
              )}
              <span className="absolute top-2.5 left-2.5 rounded-full bg-ivory/90 px-2 py-0.5 text-[0.65rem] font-medium tracking-wider text-ink uppercase backdrop-blur-xs">
                {labelOf(CATEGORIES, d.category)}
              </span>
              <span
                className={`absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase ${
                  d.is_active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {d.is_active ? "Active" : "Hidden"}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <h4 className="font-serif text-lg font-medium text-ink">{d.design_name}</h4>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                {d.description || "No description provided."}
              </p>
              <p className="mt-2 text-xs font-semibold text-wine">
                Est. {formatLkr(d.estimated_price_min, d.estimated_price_max)}
              </p>

              {/* Action buttons */}
              <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3">
                <button
                  type="button"
                  onClick={() => handleToggle(d)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    d.is_active
                      ? "bg-muted text-muted-foreground hover:bg-zinc-200"
                      : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  }`}
                >
                  {d.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(d)}
                  className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-blush hover:text-wine"
                  title="Edit Design"
                >
                  <Edit2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <DesignFormModal
          design={editingDesign}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function DesignFormModal({
  design,
  onClose,
}: {
  design: ClothingDesign | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(design?.design_name ?? "");
  const [desc, setDesc] = useState(design?.description ?? "");
  const [category, setCategory] = useState<Category>(design?.category ?? "casual_tops");
  const [priceMin, setPriceMin] = useState(design?.estimated_price_min?.toString() ?? "2500");
  const [priceMax, setPriceMax] = useState(design?.estimated_price_max?.toString() ?? "3500");
  const [imageUrl, setImageUrl] = useState(design?.image_url ?? "");
  const [isActive, setIsActive] = useState(design?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(design?.sort_order?.toString() ?? "50");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await uploadDesignImageAction(fd);
      if (res.ok && res.url) {
        setImageUrl(res.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(res.error || "Failed to upload image");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Please enter a design name");
    }

    const min = parseInt(priceMin, 10);
    const max = parseInt(priceMax, 10);
    if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
      return toast.error("Please enter a valid price range (Min <= Max)");
    }

    setSubmitting(true);
    try {
      if (design) {
        // Edit
        const res = await updateDesignAction(design.id, {
          design_name: name.trim(),
          description: desc.trim() || null,
          category,
          image_url: imageUrl.trim() || null,
          estimated_price_min: min,
          estimated_price_max: max,
          is_active: isActive,
          sort_order: parseInt(sortOrder, 10) || 50,
        });
        if (res.ok) {
          toast.success("Design updated successfully");
          onClose();
        } else {
          toast.error(res.error || "Update failed");
        }
      } else {
        // Create
        const res = await createDesignAction({
          design_name: name.trim(),
          description: desc.trim() || undefined,
          category,
          image_url: imageUrl.trim() || undefined,
          estimated_price_min: min,
          estimated_price_max: max,
          is_active: isActive,
          sort_order: parseInt(sortOrder, 10) || 50,
        });
        if (res.ok) {
          toast.success("Design created successfully");
          onClose();
        } else {
          toast.error(res.error || "Creation failed");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="design-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in-0"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-ink"
        >
          <X className="size-5" />
        </button>

        <h3 id="design-form-title" className="font-serif text-2xl font-medium text-ink">
          {design ? "Edit Design" : "Add New Clothing Design"}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          This piece will be included in the market survey gallery.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div>
            <label htmlFor="design-name-input" className="block text-xs font-medium text-muted-foreground">
              Design Name *
            </label>
            <input
              id="design-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Linen Wrap Blouse"
              className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-wine/50"
            />
          </div>

          <div>
            <label htmlFor="design-category-select" className="block text-xs font-medium text-muted-foreground">
              Category *
            </label>
            <select
              id="design-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-wine/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="design-price-min-input" className="block text-xs font-medium text-muted-foreground">
                Est. Min Price (LKR) *
              </label>
              <input
                id="design-price-min-input"
                type="number"
                min="0"
                step="100"
                required
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-wine/50"
              />
            </div>
            <div>
              <label htmlFor="design-price-max-input" className="block text-xs font-medium text-muted-foreground">
                Est. Max Price (LKR) *
              </label>
              <input
                id="design-price-max-input"
                type="number"
                min="0"
                step="100"
                required
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-wine/50"
              />
            </div>
          </div>

          {/* Image Upload or URL */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Design Image
            </label>
            <div className="mt-1 flex items-center gap-3">
              {imageUrl ? (
                <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                  <Image src={imageUrl} alt="" fill sizes="56px" className="object-cover" />
                </div>
              ) : (
                <div className="grid aspect-[3/4] w-14 shrink-0 place-items-center rounded-lg bg-sand/60 text-muted-foreground">
                  <ImageIcon className="size-5" />
                </div>
              )}
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL or upload a file"
                  className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-wine/50"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-ink transition hover:bg-sand">
                  {uploading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  {uploading ? "Uploading…" : "Upload from device"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="design-description-textarea" className="block text-xs font-medium text-muted-foreground">
              Description (optional)
            </label>
            <textarea
              id="design-description-textarea"
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Breathable linen top with flutter sleeves."
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs outline-none focus:border-wine/50"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border/80 pt-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded accent-[#6b1e36]"
              />
              <span>Display in public survey (Active)</span>
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="design-sort-order" className="text-xs text-muted-foreground">Order</label>
              <input
                id="design-sort-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-8 w-16 rounded-lg border border-input bg-background px-2 text-xs text-center outline-none focus:border-wine/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 rounded-full border border-border px-5 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-wine px-6 text-xs font-medium text-ivory hover:bg-wine-dark disabled:opacity-50"
            >
              {submitting && <Loader2 className="size-3.5 animate-spin" />}
              {design ? "Save Changes" : "Create Design"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

