"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Eye,
  User,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { SurveyResponse } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";
import {
  PRICE_RANGES,
  PURCHASE_INTENTIONS,
  labelOf,
  FASHION_STYLES,
  FABRICS,
  FITS,
  SIZES,
} from "@/lib/survey/options";

const PAGE_SIZE = 15;

export function ResponsesView({
  responses,
  exportToken,
}: {
  responses: SurveyResponse[];
  exportToken?: string;
}) {
  const [search, setSearch] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  // Filtered and searched data
  const filtered = useMemo(() => {
    return responses.filter((r) => {
      // 1. Search
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = r.full_name.toLowerCase().includes(query);
        const matchesMobile = r.mobile_number.includes(query);
        const matchesDesign = r.selected_designs.some((d) => d.design_name.toLowerCase().includes(query));
        if (!matchesName && !matchesMobile && !matchesDesign) return false;
      }
      // 2. Intent filter
      if (intentFilter !== "all" && r.purchase_intention !== intentFilter) return false;
      // 3. Price filter
      if (priceFilter !== "all" && r.price_range !== priceFilter) return false;

      return true;
    });
  }, [responses, search, intentFilter, priceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleExportCsv = () => {
    const url = exportToken
      ? `/api/admin/export?token=${encodeURIComponent(exportToken)}`
      : `/api/admin/export`;
    window.location.href = url;
  };

  return (
    <div className="space-y-6">
      {/* Controls header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, mobile, or design…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-full border border-input bg-card pr-4 pl-9 text-xs outline-none transition focus:border-wine/50 focus:ring-2 focus:ring-ring/20 sm:text-sm"
            />
          </div>

          {/* Intent filter */}
          <select
            value={intentFilter}
            onChange={(e) => {
              setIntentFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-full border border-input bg-card px-3 text-xs outline-none focus:border-wine/50"
          >
            <option value="all">All Intentions</option>
            {PURCHASE_INTENTIONS.map((pi) => (
              <option key={pi.value} value={pi.value}>
                {pi.label}
              </option>
            ))}
          </select>

          {/* Price filter */}
          <select
            value={priceFilter}
            onChange={(e) => {
              setPriceFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-full border border-input bg-card px-3 text-xs outline-none focus:border-wine/50"
          >
            <option value="all">All Prices</option>
            {PRICE_RANGES.map((pr) => (
              <option key={pr.value} value={pr.value}>
                {pr.label}
              </option>
            ))}
          </select>
        </div>

        {/* CSV Export */}
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-xs font-medium text-ivory transition hover:bg-wine focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Download className="size-4" /> Export CSV ({filtered.length})
        </button>
      </div>

      {/* Responses Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/80 bg-cream/50 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 sm:px-6">Participant</th>
                <th className="px-4 py-3">Selected Designs</th>
                <th className="px-4 py-3">Price Range</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No responses matching your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const intentLabel = labelOf(PURCHASE_INTENTIONS, r.purchase_intention);
                  const isHighIntent =
                    r.purchase_intention === "definitely" || r.purchase_intention === "probably";

                  return (
                    <tr key={r.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3 sm:px-6">
                        <div className="font-medium text-ink">{r.full_name}</div>
                        <div className="text-xs text-muted-foreground">{r.mobile_number || "—"}</div>
                      </td>
                      <td className="max-w-[240px] px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.selected_designs.slice(0, 3).map((d) => (
                            <span
                              key={d.clothing_design_id}
                              className="inline-flex items-center gap-1 rounded-md bg-sand/60 px-2 py-0.5 text-xs text-ink"
                            >
                              {d.design_name}
                              {d.is_favorite && <Heart className="size-3 fill-wine text-wine" />}
                            </span>
                          ))}
                          {r.selected_designs.length > 3 && (
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                              +{r.selected_designs.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-wine">
                        {labelOf(PRICE_RANGES, r.price_range)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${isHighIntent
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {intentLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDateTime(r.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedResponse(r)}
                          className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-blush hover:text-wine"
                          title="View Full Details"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/80 px-4 py-3 sm:px-6">
            <span className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} responses
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-ink disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="flex items-center px-2 text-xs font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-ink disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Details Modal */}
      {selectedResponse && (
        <ResponseDetailsModal
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
        />
      )}
    </div>
  );
}

function ResponseDetailsModal({
  response,
  onClose,
}: {
  response: SurveyResponse;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="response-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in-0"
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-ink"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-blush text-wine">
            <User className="size-5" />
          </span>
          <div>
            <h3 id="response-detail-title" className="font-serif text-2xl font-medium text-ink">
              {response.full_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {response.mobile_number ? `${response.mobile_number} · ` : ""}Submitted {formatDateTime(response.created_at)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-sm">
          {/* Selected designs with preferences */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Selected Designs ({response.selected_designs.length})
            </h4>
            <div className="mt-3 space-y-3">
              {response.selected_designs.map((d) => (
                <div
                  key={d.clothing_design_id}
                  className="rounded-xl border border-border/80 bg-background p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">{d.design_name}</span>
                    {d.is_favorite && (
                      <span className="flex items-center gap-1 text-xs font-medium text-wine">
                        <Heart className="size-3.5 fill-wine" /> Favorite
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong className="text-ink">Preferred Colors: </strong>
                    {d.preferred_colors.join(", ")}
                    {d.other_color ? ` (${d.other_color})` : ""}
                  </div>
                  {Object.keys(d.customization_preferences).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {d.customization_preferences.sleeve && (
                        <span>Sleeve: {d.customization_preferences.sleeve}</span>
                      )}
                      {d.customization_preferences.neckline && (
                        <span>Neckline: {d.customization_preferences.neckline}</span>
                      )}
                      {d.customization_preferences.length && (
                        <span>Length: {d.customization_preferences.length}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Intention */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/80 bg-background p-4">
            <div>
              <span className="text-xs text-muted-foreground">Price Acceptance</span>
              <div className="mt-0.5 font-serif text-lg font-semibold text-wine">
                {labelOf(PRICE_RANGES, response.price_range)}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Purchase Likelihood</span>
              <div className="mt-0.5 font-serif text-lg font-semibold text-ink">
                {labelOf(PURCHASE_INTENTIONS, response.purchase_intention)}
              </div>
            </div>
          </div>

          {/* Fit & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Preferred Fit</span>
              <div className="font-medium">{labelOf(FITS, response.preferred_fit)}</div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Usual Size</span>
              <div className="font-medium">{labelOf(SIZES, response.clothing_size)}</div>
            </div>
          </div>

          {/* Style & Fabric */}
          <div>
            <span className="text-xs text-muted-foreground">Fashion Styles</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {response.fashion_styles.map((s) => (
                <span key={s} className="rounded-full bg-sand/60 px-2.5 py-0.5 text-xs">
                  {labelOf(FASHION_STYLES, s)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground">Fabric Preferences</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {response.fabric_preferences.map((f) => (
                <span key={f} className="rounded-full bg-sand/60 px-2.5 py-0.5 text-xs">
                  {labelOf(FABRICS, f)}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {response.feedback && (
            <div>
              <span className="text-xs text-muted-foreground">Participant Feedback</span>
              <p className="mt-1 rounded-xl bg-cream/70 p-3 text-xs leading-relaxed italic">
                &ldquo;{response.feedback}&rdquo;
              </p>
            </div>
          )}

          {/* Opt-in status
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            {response.launch_updates_consent ? (
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <Check className="size-4" /> Opted in for launch & pre-order updates
              </span>
            ) : (
              <span>Did not opt in for updates</span>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

