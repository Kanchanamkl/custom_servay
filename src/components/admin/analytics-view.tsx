"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  Shirt,
  Palette,
  Tag,
  Ruler,
  AlertCircle,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import type { SurveyAnalytics } from "@/lib/analytics";

export function AnalyticsView({ analytics }: { analytics: SurveyAnalytics }) {
  if (analytics.totalResponses === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center">
        <Users className="mx-auto size-12 text-muted-foreground/60" strokeWidth={1.5} />
        <h3 className="mt-4 font-serif text-2xl font-medium">No survey responses yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your survey link with potential customers to begin collecting market research data.
        </p>
      </div>
    );
  }

  const { kpis } = analytics;

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Disclaimer banner */}
      <div className="flex gap-3 rounded-2xl border border-wine/20 bg-blush/40 p-4 text-sm sm:items-center">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-wine sm:mt-0" />
        <div className="text-muted-foreground">
          <strong className="font-medium text-ink">Market Research Guidance: </strong>
          Survey popularity indicates relative customer interest and aesthetic preference, not guaranteed sales or exact inventory demand forecasts. Use these insights alongside production minimums (MOQ) and pricing margins.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Total Participants"
          value={analytics.totalResponses}
          subtext="100% completed"
          icon={Users}
        />
        <KpiCard
          label="Top Design"
          value={kpis.mostPopularDesign}
          subtext="Highest selections"
          icon={Shirt}
          truncate
        />
        <KpiCard
          label="Top Category"
          value={kpis.mostPopularCategory}
          subtext="Strongest demand"
          icon={Sparkles}
        />
        <KpiCard
          label="Top Color"
          value={kpis.mostPreferredColor}
          subtext="Most picked swatch"
          icon={Palette}
        />
        <KpiCard
          label="Price Sweetspot"
          value={kpis.mostPopularPriceRange.replace("LKR ", "")}
          subtext="Perceived value"
          icon={Tag}
        />
        <KpiCard
          label="Top Size"
          value={kpis.mostPreferredSize}
          subtext="Demand curve"
          icon={Ruler}
        />
      </div>

      {/* Key Insights Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* High Intent & Consent */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-ink">Purchase Intention Score</h3>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <CheckCircle className="size-3.5" /> {analytics.kpis.highIntentRate}% High Intent
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Percentage of respondents who definitely or probably would buy at their chosen price point.
          </p>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.purchaseIntentionBreakdown}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="label" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value} votes`, "Votes"]}
                  contentStyle={{ backgroundColor: "#fffdfa", borderRadius: "12px", border: "1px solid #e7ddd2" }}
                />
                <Bar dataKey="count" fill="#6b1e36" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-ink">Category Demand Distribution</h3>
            <span className="text-xs font-medium text-muted-foreground">Total Design Selections</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Relative interest across Tops, Blouses, and Dresses.
          </p>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, _name, item) => {
                    const payload = item?.payload as { percentage?: number } | undefined;
                    return [`${val} picks (${payload?.percentage ?? 0}%)`, "Selections"];
                  }}
                  contentStyle={{ backgroundColor: "#fffdfa", borderRadius: "12px", border: "1px solid #e7ddd2" }}
                />
                <Bar dataKey="count" fill="#a8566d" radius={[6, 6, 0, 0]}>
                  {analytics.categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#6b1e36" : index === 1 ? "#a8566d" : "#d9a5a5"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Design Popularity Leaderboard */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-xl font-medium text-ink">Design Popularity Ranking</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Total times each clothing design was selected, along with how many marked it as their favorite.
            </p>
          </div>
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink">
            {analytics.designPopularity.length} Designs Tested
          </span>
        </div>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics.designPopularity}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val, name) => [
                  name === "totalSelections" ? `${val} Selections` : `${val} Favorites`,
                  name === "totalSelections" ? "Total Picks" : "Hearted",
                ]}
                contentStyle={{ backgroundColor: "#fffdfa", borderRadius: "12px", border: "1px solid #e7ddd2" }}
              />
              <Bar dataKey="totalSelections" fill="#6b1e36" name="Total Selections" radius={[0, 4, 4, 0]} />
              <Bar dataKey="favorites" fill="#d9a5a5" name="Favorited" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Colors & Price Ranges */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Color Preferences */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <h3 className="font-serif text-xl font-medium text-ink">Preferred Colors</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Aggregated colorway preferences selected across all chosen items.
          </p>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.colorBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} picks`, "Picks"]}
                  contentStyle={{ backgroundColor: "#fffdfa", borderRadius: "12px", border: "1px solid #e7ddd2" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {analytics.colorBreakdown.map((entry, index) => (
                    <Cell key={`color-${index}`} fill={entry.color || "#6b1e36"} stroke="#888" strokeWidth={0.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Range Distribution */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <h3 className="font-serif text-xl font-medium text-ink">Price Acceptance (LKR)</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Price range participants consider reasonable for their selected designs.
          </p>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.priceRangeBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} respondents`, "Responses"]}
                  contentStyle={{ backgroundColor: "#fffdfa", borderRadius: "12px", border: "1px solid #e7ddd2" }}
                />
                <Bar dataKey="count" fill="#4f1426" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Style, Fabric & Size Preferences */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fashion Styles */}
        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <h3 className="font-serif text-lg font-medium text-ink">Fashion Styles</h3>
          <p className="text-xs text-muted-foreground">Aesthetic directions with highest affinity</p>
          <div className="mt-4 space-y-2.5">
            {analytics.fashionStylesBreakdown.map((s) => (
              <div key={s.key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{s.label}</span>
                  <span className="text-muted-foreground">{s.count} ({s.percentage}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-sand/60">
                  <div
                    className="h-full rounded-full bg-wine transition-all"
                    style={{ width: `${Math.min(100, s.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fabrics */}
        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <h3 className="font-serif text-lg font-medium text-ink">Fabric Demand</h3>
          <p className="text-xs text-muted-foreground">Material preferences for the island climate</p>
          <div className="mt-4 space-y-2.5">
            {analytics.fabricsBreakdown.map((f) => (
              <div key={f.key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{f.label}</span>
                  <span className="text-muted-foreground">{f.count} ({f.percentage}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-sand/60">
                  <div
                    className="h-full rounded-full bg-taupe transition-all"
                    style={{ width: `${Math.min(100, f.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Size Distribution */}
        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <h3 className="font-serif text-lg font-medium text-ink">Size Distribution Curve</h3>
          <p className="text-xs text-muted-foreground">Guide for sizing breakdown in batch #1</p>
          <div className="mt-4 space-y-2.5">
            {analytics.sizeBreakdown.map((sz) => (
              <div key={sz.key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{sz.label}</span>
                  <span className="text-muted-foreground">{sz.count} ({sz.percentage}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-sand/60">
                  <div
                    className="h-full rounded-full bg-wine-dark transition-all"
                    style={{ width: `${Math.min(100, sz.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  subtext,
  icon: Icon,
  truncate,
}: {
  label: string;
  value: React.ReactNode;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  truncate?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{label}</span>
        <span className="grid size-7 place-items-center rounded-lg bg-blush text-wine">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3">
        <div
          title={typeof value === "string" ? value : undefined}
          className={`font-serif text-2xl font-semibold text-ink sm:text-3xl ${truncate ? "truncate" : ""}`}
        >
          {value}
        </div>
        <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{subtext}</p>
      </div>
    </div>
  );
}
