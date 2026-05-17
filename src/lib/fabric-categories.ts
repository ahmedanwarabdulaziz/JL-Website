export type SupplierTier = 1 | 2 | 3;

export interface Supplier {
  id: string;
  name: string;
  tier: SupplierTier;
  specialty: string;
  location?: string;
  website?: string;
  logoPlaceholder?: string;
  logoUrl?: string;
}

export const SUPPLIERS: Supplier[] = [
  // Tier 1 - International Premium
  { id: "kravet", name: "Kravet", tier: 1, specialty: "Luxury fabrics, wallcovering, furniture", website: "https://www.kravet.com", logoPlaceholder: "K", logoUrl: "/images/Fabric suppliers/Kravet.jpeg" },
  { id: "maharam", name: "Maharam", tier: 1, specialty: "Performance commercial textiles", website: "https://www.maharam.com", logoPlaceholder: "M", logoUrl: "/images/Fabric suppliers/Maharam.jpeg" },
  { id: "scalamandre", name: "House of Scalamandré", tier: 1, specialty: "Heritage luxury, hospitality, residential", website: "https://www.scalamandre.com", logoPlaceholder: "S", logoUrl: "/images/Fabric suppliers/House of Scalamandre.jpeg" },
  { id: "charlotte", name: "Charlotte Fabrics", tier: 1, specialty: "Performance upholstery, residential", website: "https://www.charlottefabrics.com", logoPlaceholder: "C", logoUrl: "/images/Fabric suppliers/Charlotte Fabrics.jpeg" },
  { id: "jf", name: "JF Fabrics", tier: 1, specialty: "Toronto-based wholesaler, huge stocking", website: "https://www.jffabrics.com", logoPlaceholder: "J", logoUrl: "/images/Fabric suppliers/JF Fabrics.jpeg" },

  // Tier 2 - Canadian Established Distributors
  { id: "ennis", name: "J. Ennis Fabrics", tier: 2, specialty: "Full-range wholesale: fabric, vinyl, foam, supplies", location: "Mississauga, ON", website: "https://www.ennisfabrics.com", logoUrl: "/images/Fabric suppliers/J. Ennis Fabrics.jpeg" },
  { id: "alendel", name: "Alendel Fabrics", tier: 2, specialty: "Decorative & upholstery, trade-only", location: "North York/Concord, ON", website: "https://alendel.com", logoUrl: "/images/Fabric suppliers/Alendel Fabrics.jpeg" },
  { id: "wovetex", name: "Wovetex", tier: 2, specialty: "Fabric converter, editor; brands: FabriCo, Stoff Home", location: "Canada-wide", website: "https://wovetex.com", logoUrl: "/images/Fabric suppliers/Wovetex.jpeg" },
  { id: "trican", name: "TRICAN Corp.", tier: 2, specialty: "Sunbrella, Phifertex, outdoor/marine", location: "Canada", website: "https://www.tricancorp.ca", logoUrl: "/images/Fabric suppliers/TRICAN Corp.jpeg" },
  { id: "evergreen", name: "Evergreen Fabrics", tier: 2, specialty: "Residential & commercial", location: "Brampton, ON", website: "https://evergreenfabrics.com", logoUrl: "/images/Fabric suppliers/Evergreen Fabrics.jpeg" },
  { id: "kb", name: "KB Fabrics (KB Contract)", tier: 2, specialty: "Performance, vinyl, leather; contract + residential", location: "Canada", logoUrl: "/images/Fabric suppliers/KB Fabrics (KB Contract).jpeg" },
  { id: "triden", name: "Triden Distributors", tier: 2, specialty: "100% Canadian; fabric, vinyl, leather, foam", location: "Pickering, ON", website: "https://triden.com", logoUrl: "/images/Fabric suppliers/Triden Distributors.jpeg" },
  { id: "master", name: "Master Fabric", tier: 2, specialty: "Full-range upholstery materials", location: "Canada", logoUrl: "/images/Fabric suppliers/Master Fabric.jpeg" },

  // Tier 3 - Specialty Suppliers
  { id: "ctl", name: "CTL Leather", tier: 3, specialty: "Aniline, nubuck, premium hides", website: "https://www.ctlleather.com", logoUrl: "/images/Fabric suppliers/CTL Leather.jpeg" },
  { id: "perfect-leather", name: "Perfect Leather", tier: 3, specialty: "Toronto leather importer since 1969; cowhide, lamb, exotic", website: "http://www.perfectleathergoods.com", logoUrl: "/images/Fabric suppliers/Perfect Leather.jpeg" },
  { id: "equus", name: "Equus Fabrics", tier: 3, specialty: "Velvet, vinyl, linen, performance; theatre & staging", website: "https://equusfabrics.com", logoUrl: "/images/Fabric suppliers/Equus Fabrics.jpeg" }
];

export interface FabricCategory {
  id: string;
  name: string;
  h1: string;
  description: string;
  image: string;
  suppliers: string[]; // supplier IDs
  applications: string[];
  care: string;
}

export const FABRIC_CATEGORIES: Record<string, FabricCategory> = {
  "leather": {
    id: "leather",
    name: "Leather & Leatherette",
    h1: "Premium Leather Upholstery Fabric",
    description: "Discover our exquisite collection of premium leather and leatherette upholstery materials. Ideal for adding a touch of luxury and durability to your furniture, our leathers are sourced from top suppliers ensuring quality and longevity. Whether you are recovering a residential sofa or outfitting a commercial space, leather offers unmatched sophistication and ease of maintenance.",
    image: "/images/06-Leather & Leatherette.jpeg",
    suppliers: ["ctl", "perfect-leather", "equus"],
    applications: ["Residential Furniture", "Commercial Seating", "Automotive Interiors"],
    care: "Wipe with a damp cloth. Use specialized leather conditioners periodically to maintain suppleness and prevent cracking. Avoid harsh chemicals."
  },
  "outdoor": {
    id: "outdoor",
    name: "Outdoor & Marine",
    h1: "Outdoor & Marine Upholstery Fabric",
    description: "Fade-resistant, mildew-resistant, and built to withstand the elements. Our outdoor and marine upholstery fabrics are perfect for patio furniture, boat interiors, and sunrooms. Featuring top industry brands like Sunbrella and Phifertex, we ensure your outdoor seating remains vibrant and durable season after season.",
    image: "/images/07-Outdoor & Marine.jpeg",
    suppliers: ["trican", "ennis"],
    applications: ["Patio Furniture", "Marine Seating", "Awnings", "Sunrooms"],
    care: "Brush off loose dirt. Wash with a mild soap and lukewarm water solution. Rinse thoroughly and allow to air dry. Do not machine dry."
  },
  "performance": {
    id: "performance",
    name: "Performance & Stain-Resistant",
    h1: "Performance & Stain-Resistant Fabric",
    description: "Designed for real life, our performance fabrics offer incredible stain resistance, easy cleanability, and exceptional durability without compromising on softness or style. Perfect for households with children and pets, or high-traffic commercial environments where spills are inevitable.",
    image: "/images/08-Performance & Stain-Resistant.jpeg",
    suppliers: ["kb", "charlotte", "alendel"],
    applications: ["Family Rooms", "Dining Chairs", "Commercial Spaces", "Pet-Friendly Homes"],
    care: "Most spills can be blotted with a clean, dry cloth. For tougher stains, use a mild soap and water mixture. Always refer to specific brand guidelines for finishes like Crypton or Alta."
  },
  "velvet-decorative": {
    id: "velvet-decorative",
    name: "Velvet, Boucle & Decorative",
    h1: "Velvet & Decorative Upholstery Fabric",
    description: "Elevate your interiors with our luxurious selection of velvet, boucle, and woven decorative fabrics. These materials add incredible texture, depth, and a premium feel to any custom upholstery project. From vibrant jewel tones to subtle neutrals, we have the perfect statement fabric for your vision.",
    image: "/images/09-Velvet, Boucle & Decorative.jpeg",
    suppliers: ["alendel", "wovetex", "jf", "kravet"],
    applications: ["Accent Chairs", "Headboards", "Decorative Pillows", "Luxury Residential"],
    care: "Vacuum regularly with an upholstery attachment. For velvet, brush in the direction of the pile to maintain its appearance. Professional cleaning is often recommended for deep stains."
  },
  "vinyl-commercial": {
    id: "vinyl-commercial",
    name: "Commercial-Grade Vinyl",
    h1: "Commercial Vinyl Upholstery",
    description: "Heavy-duty commercial vinyl built for the most demanding environments. Featuring anti-bacterial, mildew-resistant, and high-abrasion finishes (up to 2+ million double rubs). Ideal for restaurants, healthcare facilities, and gyms where hygiene and extreme durability are top priorities.",
    image: "/images/10-Commercial-Grade Vinyl.jpeg",
    suppliers: ["ennis", "triden", "evergreen"],
    applications: ["Restaurants & Hospitality", "Healthcare Clinics", "Fitness Centers", "High-Traffic Areas"],
    care: "Wipe clean with a mild soap and water solution. Disinfectants can be used on approved commercial vinyls, but always rinse with clean water afterwards to prevent residue buildup."
  },
  "luxury": {
    id: "luxury",
    name: "Luxury & Designer",
    h1: "Luxury Designer Upholstery Fabric",
    description: "Access the world's most prestigious textile houses. Our luxury designer collection features heritage patterns, cutting-edge commercial performance textiles, and exclusive residential fabrics from industry leaders. Create a truly bespoke space with uncompromising quality.",
    image: "/images/11-Luxury & Designer.jpeg",
    suppliers: ["kravet", "maharam", "scalamandre"],
    applications: ["High-End Residential", "Boutique Hospitality", "Executive Offices", "Custom Heirloom Furniture"],
    care: "Care varies significantly by exact textile composition. Always adhere strictly to the manufacturer's cleaning code. Professional dry cleaning is often required for delicate natural fibers."
  }
};
