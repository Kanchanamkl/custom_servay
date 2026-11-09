import type { ClothingDesign } from "./types";

/**
 * Sample designs written to data/designs.json the first time the app runs.
 * Images are bundled in /public/images/designs. Admins can edit/replace them
 * from /admin-pannel afterwards.
 */
const created = "2026-11-09T00:00:00.000Z";

type Seed = Omit<ClothingDesign, "created_at" | "updated_at" | "is_active">;

const seeds: Seed[] = [
  { id: "d01-ivory-ribbed-knit-tee", design_name: "Ivory Ribbed Knit Tee", description: "Fitted ribbed knit with a soft crew neckline.", category: "casual_tops", image_url: "/images/designs/ivory-ribbed-knit-tee.jpg", estimated_price_min: 2000, estimated_price_max: 2500, sort_order: 10 },
  { id: "d02-sage-linen-camisole", design_name: "Sage Linen Camisole", description: "Breathable linen cami with delicate straps.", category: "casual_tops", image_url: "/images/designs/sage-linen-camisole.jpg", estimated_price_min: 2200, estimated_price_max: 2800, sort_order: 20 },
  { id: "d03-dusty-pink-boxy-tee", design_name: "Dusty Pink Boxy Tee", description: "Relaxed cotton tee with dropped shoulders.", category: "casual_tops", image_url: "/images/designs/dusty-pink-boxy-tee.jpg", estimated_price_min: 1800, estimated_price_max: 2400, sort_order: 30 },
  { id: "d04-striped-oversized-shirt", design_name: "Striped Oversized Shirt", description: "Crisp cotton stripes in an easy oversized cut.", category: "casual_tops", image_url: "/images/designs/striped-oversized-shirt.jpg", estimated_price_min: 2800, estimated_price_max: 3500, sort_order: 40 },
  { id: "d05-burgundy-satin-wrap-blouse", design_name: "Burgundy Satin Wrap Blouse", description: "Fluid satin wrap with a flattering V-neck.", category: "blouses", image_url: "/images/designs/burgundy-satin-wrap-blouse.jpg", estimated_price_min: 3200, estimated_price_max: 4000, sort_order: 50 },
  { id: "d06-white-puff-sleeve-blouse", design_name: "White Puff-Sleeve Blouse", description: "Square neckline and romantic puff sleeves.", category: "blouses", image_url: "/images/designs/white-puff-sleeve-blouse.jpg", estimated_price_min: 2800, estimated_price_max: 3400, sort_order: 60 },
  { id: "d07-beige-linen-button-down", design_name: "Beige Linen Button-Down", description: "Relaxed linen blouse for warm days and office looks.", category: "blouses", image_url: "/images/designs/beige-linen-blouse.jpg", estimated_price_min: 3000, estimated_price_max: 3600, sort_order: 70 },
  { id: "d08-navy-bow-office-blouse", design_name: "Navy Bow Office Blouse", description: "Polished long-sleeve blouse with a soft tie-bow.", category: "blouses", image_url: "/images/designs/navy-bow-office-blouse.jpg", estimated_price_min: 3200, estimated_price_max: 3900, sort_order: 80 },
  { id: "d09-black-satin-slip-midi", design_name: "Black Satin Slip Midi Dress", description: "Timeless slip dress for evenings out.", category: "dresses", image_url: "/images/designs/black-slip-midi-dress.jpg", estimated_price_min: 3800, estimated_price_max: 4800, sort_order: 90 },
  { id: "d10-sage-tiered-maxi-dress", design_name: "Sage Tiered Maxi Dress", description: "Airy cotton maxi with flutter sleeves.", category: "dresses", image_url: "/images/designs/sage-tiered-maxi-dress.jpg", estimated_price_min: 4000, estimated_price_max: 5000, sort_order: 100 },
  { id: "d11-dusty-pink-wrap-dress", design_name: "Dusty Pink Floral Wrap Dress", description: "Knee-length wrap dress with a subtle floral print.", category: "dresses", image_url: "/images/designs/dusty-pink-wrap-dress.jpg", estimated_price_min: 3500, estimated_price_max: 4500, sort_order: 110 },
  { id: "d12-beige-linen-shirt-dress", design_name: "Beige Linen Shirt Dress", description: "Belted midi shirt dress in breathable linen.", category: "dresses", image_url: "/images/designs/beige-linen-shirt-dress.jpg", estimated_price_min: 3600, estimated_price_max: 4600, sort_order: 120 },
];

export function seedDesigns(): ClothingDesign[] {
  return seeds.map((s) => ({ ...s, is_active: true, created_at: created, updated_at: created }));
}

