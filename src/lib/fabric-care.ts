export type FabricCareSource = {
  label: string;
  url: string;
};

export type FabricCareVideo = {
  title: string;
  provider: "YouTube" | "Vimeo";
  embedUrl: string;
  watchUrl: string;
  brand?: string;
};

export type FabricCareImageSet = {
  hero: string;
  detail: string;
  alt: string;
  note: string;
};

export type FabricCareBrand = {
  slug: string;
  name: string;
  shortName: string;
  sourceStatus: "official" | "supplier-guidance";
  heroEyebrow: string;
  summary: string;
  bestFor: string;
  cleaningCodeNote: string;
  quickFacts: string[];
  routineCare: string[];
  immediateSpillResponse: string[];
  stubbornStainCare: string[];
  cautions: string[];
  workshopNote?: string;
  sourceNote?: string;
  sources: FabricCareSource[];
  videos: FabricCareVideo[];
  images: FabricCareImageSet;
};

export const FABRIC_CARE_VIDEOS: FabricCareVideo[] = [
  {
    title: "How To Clean Crypton Fabrics",
    provider: "YouTube",
    embedUrl: "https://www.youtube.com/embed/8Q1VyHIVX4E",
    watchUrl: "https://www.youtube.com/watch?v=8Q1VyHIVX4E",
    brand: "Crypton",
  },
  {
    title: "How to Clean Dirt and Mud from Crypton Fabric",
    provider: "YouTube",
    embedUrl: "https://www.youtube.com/embed/YDDaE5HL1_Y",
    watchUrl: "https://www.youtube.com/watch?v=YDDaE5HL1_Y",
    brand: "Crypton",
  },
  {
    title: "How to Clean Chocolate from Crypton Fabric",
    provider: "YouTube",
    embedUrl: "https://www.youtube.com/embed/vlWcVG1CMiw",
    watchUrl: "https://www.youtube.com/watch?v=vlWcVG1CMiw",
    brand: "Crypton",
  },
  {
    title: "How To Clean FibreGuard",
    provider: "YouTube",
    embedUrl: "https://www.youtube.com/embed/jcMa5lCUGBc",
    watchUrl: "https://www.youtube.com/watch?v=jcMa5lCUGBc",
    brand: "FibreGuard",
  },
  {
    title: "Alta Repellency and Antimicrobial Technology",
    provider: "Vimeo",
    embedUrl: "https://player.vimeo.com/video/400342701",
    watchUrl: "https://vimeo.com/400342701",
    brand: "Alta",
  },
];

export const FABRIC_CARE_PRINCIPLES = [
  "Always identify the fabric brand and confirm the cleaning code before using any cleaner.",
  "Blot, lift, and rinse before you reach for stronger chemistry.",
  "Soft brushes, white cloths, and controlled moisture are safer than aggressive scrubbing.",
  "Rinse out soap residue thoroughly. Residue attracts more soil over time.",
  "Air drying is the safest finish for most performance upholstery fabrics.",
];

export const FABRIC_CARE_BRANDS: FabricCareBrand[] = [
  {
    slug: "alta",
    name: "Alta",
    shortName: "Alta",
    sourceStatus: "official",
    heroEyebrow: "Performance Repellency",
    summary:
      "Alta is a performance textile treatment designed to repel both oil-based and water-based stains while preserving the hand, appearance, and breathability of the fabric.",
    bestFor:
      "Residential upholstery, hospitality, healthcare, workplace seating, and fabrics where you want easier day-to-day cleanup without sacrificing softness.",
    cleaningCodeNote:
      "Alta guidance should be used together with the specific care code on the fabric sample or supplier specification sheet.",
    quickFacts: [
      "Oil- and water-based stain repellency",
      "Warm-water rinsing is the first response for residual spots",
      "Mild dish soap can be used for stubborn staining",
      "Steam cleaning is not recommended",
    ],
    routineCare: [
      "Vacuum regularly with an upholstery attachment to reduce dry soil build-up.",
      "Address spills quickly while liquids are still sitting on the surface.",
      "Use warm water extraction for broader maintenance if the fabric manufacturer permits it.",
      "For washable items, keep temperatures moderate and avoid harsh detergent systems.",
    ],
    immediateSpillResponse: [
      "If the liquid is still beading, gently blot with a dry, clean absorbent cloth. Do not rub.",
      "If a mark remains, remove debris first, then flush the area with warm water and blot with a clean cloth.",
      "Repeat warm-water rinsing and blotting until the spot releases.",
      "If more help is needed, mix 2-3 drops of mild dishwashing detergent into 1 cup of water, work it in gently, then rinse thoroughly with warm water.",
    ],
    stubbornStainCare: [
      "Start with the warm-water flush before moving to soap.",
      "Use only a small amount of mild dish detergent.",
      "Blot rather than aggressively brushing the surface.",
      "Remove all soap residue so it does not attract future dirt.",
    ],
    cautions: [
      "Do not steam clean Alta-treated fabrics.",
      "Do not use harsh detergents, solvents, fabric softeners, or oxidizing cleaners.",
      "Avoid extremely hot wash temperatures.",
      "Always test any cleaning method on a hidden area first.",
    ],
    sources: [
      {
        label: "Fabricut Alta Cleaning Instructions",
        url: "https://fabricut.com/cleanable-performance/cleaning/alta",
      },
      {
        label: "MasterFabrics Alta Overview and Cleaning Guide",
        url: "https://masterfabrics.com/en/alta/",
      },
      {
        label: "Applied Textiles Alta Cleaning Instructions",
        url: "https://applied-textiles.com/alta-cleaning-instructions/",
      },
    ],
    videos: FABRIC_CARE_VIDEOS.filter((video) => video.brand === "Alta"),
    images: {
      hero: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      detail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      alt: "Neutral textured upholstery fabric on a refined lounge chair",
      note: "Soft hand feel with performance repellency",
    },
  },
  {
    slug: "crypton",
    name: "Crypton",
    shortName: "Crypton",
    sourceStatus: "official",
    heroEyebrow: "Barrier Performance",
    summary:
      "Crypton upholstery fabrics are engineered for stain, moisture, and odor resistance, but they still rely on correct spot cleaning and periodic maintenance to stay looking their best.",
    bestFor:
      "High-traffic family furniture, hospitality seating, healthcare and contract environments, and upholstery where easy repeat cleaning matters.",
    cleaningCodeNote:
      "Crypton guidance varies by product family. Confirm whether your textile is Crypton Home or contract-grade Crypton before using specialty cleaners or disinfectants.",
    quickFacts: [
      "Soap-and-water spot cleaning is the standard first response",
      "Hot water extraction is recommended for tougher or overall maintenance cleaning",
      "Rinsing is essential because leftover soap attracts soil",
      "Do not oversaturate while spot cleaning",
    ],
    routineCare: [
      "Vacuum every 1-2 weeks with an upholstery attachment.",
      "Brush off loose crumbs, lint, hair, and soil before stains get embedded.",
      "Rotate and turn loose cushions to equalize wear where applicable.",
      "Plan periodic extraction cleaning or professional upholstery cleaning for overall maintenance.",
    ],
    immediateSpillResponse: [
      "Blot liquids on the surface with a clean, soft towel and remove loose debris first.",
      "Mix 1/4 teaspoon of mild enzyme detergent with 1 cup of lukewarm water.",
      "Mist the affected area lightly; do not oversaturate.",
      "Work from the outside of the stain inward using a soft brush or cloth.",
      "Rinse thoroughly with clean water, blot excess moisture, and allow the fabric to air dry.",
    ],
    stubbornStainCare: [
      "Repeat the standard soap-and-water process before moving to stronger specialty cleaners.",
      "For medium or ground-in staining, use hot water extraction for broader cleaning.",
      "Use Crypton-branded cleaners if you need a brand-specific stronger option.",
      "Continue rinsing until no residue remains in the upholstery surface.",
    ],
    cautions: [
      "Do not oversaturate the fabric during spot cleaning.",
      "Do not leave detergent residue behind.",
      "Do not assume every stain is fully removable; items like permanent marker or nail polish can remain.",
      "Follow the exact product-family guidance if you are considering disinfectants or bleach-based systems.",
    ],
    sources: [
      {
        label: "Fabricut Crypton Home Cleaning Instructions",
        url: "https://fabricut.com/cleanable-performance/cleaning/crypton-home",
      },
      {
        label: "Crypton Fabric Care and Maintenance Guide",
        url: "https://crypton.com/upholstery-care/",
      },
      {
        label: "Crypton Printable Cleaning Instructions (PDF)",
        url: "https://crypton.com/marketing/cleaning-and-care/crypton-fabric-cleaning-instructions.pdf",
      },
      {
        label: "Crypton Cleaning and Care Hub",
        url: "https://crypton.com/how-to-clean/",
      },
    ],
    videos: FABRIC_CARE_VIDEOS.filter((video) => video.brand === "Crypton"),
    images: {
      hero: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
      detail: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80",
      alt: "Modern sofa in a bright family living room",
      note: "Built for family life and repeat cleaning",
    },
  },
  {
    slug: "endurepel",
    name: "Endurepel",
    shortName: "Endurepel",
    sourceStatus: "official",
    heroEyebrow: "Easy-Clean Finish",
    summary:
      "Endurepel is Ennis Fabrics' performance finish family. Shield focuses on woven easy-clean stain repellency, while Armour is used on coated products where mildew and antibacterial protection are important.",
    bestFor:
      "Residential seating, office seating, hospitality seating, and contract upholstery where easy cleanup and moisture resistance are important.",
    cleaningCodeNote:
      "Many Endurepel Shield product sheets list cleaning code W, meaning water-based cleaners or foam. Always confirm the code on your exact fabric before cleaning.",
    quickFacts: [
      "Water-based and low-alcohol spills can bead on the surface",
      "Prompt blotting gives the best results",
      "Heavy oil-based stains may need mild detergent",
      "Specific cleaning codes vary by the exact Ennis fabric",
    ],
    routineCare: [
      "Vacuum or brush gently to remove grit before it gets embedded into the upholstery.",
      "Clean spills as soon as possible while the finish is actively repelling the mess.",
      "Use water-based cleaning agents only when your exact fabric carries cleaning code W.",
      "For full-piece cleaning, stay within the fabric's cleaning code and supplier sheet.",
    ],
    immediateSpillResponse: [
      "Blot away excess liquid or mess with a dry, clean towel.",
      "For common water-based staining, use a mild soap-and-water solution and work gently from the outside inward.",
      "Use a soft brush only if needed and blot frequently with a clean towel.",
      "For most Endurepel Shield fabrics, keep the cleaning process water-based unless the supplier sheet says otherwise.",
    ],
    stubbornStainCare: [
      "For heavy oil-based staining, use mild detergent promptly as Ennis recommends.",
      "If your fabric is water-cleanable, repeat the water-based process before escalating to specialty upholstery products.",
      "Where supplier guidance permits, a professional upholstery cleaner can be used for more stubborn water-borne soil.",
      "Allow the fabric to dry completely before judging the final result.",
    ],
    cautions: [
      "Do not assume all Endurepel fabrics clean the same way; the product sheet and cleaning code control.",
      "Do not use aggressive brushing or harsh chemistry without confirming compatibility.",
      "Test all methods in a hidden area first.",
      "Stop cleaning and contact the supplier if the finish, color, or hand changes unexpectedly.",
    ],
    workshopNote:
      "JL Upholstery can use the supplier cleaning code, finish type, and end-use to help you choose the safest maintenance approach before you clean.",
    sources: [
      {
        label: "Ennis Fabrics: Learn About Our Endurepel Products",
        url: "https://ennisfabrics.com/blogs/news/learn-about-our-endurepel-products",
      },
      {
        label: "Example Endurepel Product Sheet (Pace)",
        url: "https://ennisfabrics.com/products/endurepel-pace",
      },
      {
        label: "Example Endurepel Product Sheet (Heavenly)",
        url: "https://ennisfabrics.com/products/endurepel-heavenly",
      },
    ],
    videos: [],
    images: {
      hero: "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=1600&q=80",
      detail: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80",
      alt: "Hospitality-style banquette upholstery with textured woven fabric",
      note: "Practical finish for residential and contract seating",
    },
  },
  {
    slug: "fibreguard",
    name: "FibreGuard",
    shortName: "FibreGuard",
    sourceStatus: "official",
    heroEyebrow: "Fibre-Level Protection",
    summary:
      "FibreGuard fabrics are designed to clean with remarkably simple methods: usually water first, then a white bar soap only when needed, followed by natural air drying.",
    bestFor:
      "Homes, hospitality, offices, healthcare-adjacent settings, and upholstery clients who want stain resistance without relying on harsh cleaning chemicals.",
    cleaningCodeNote:
      "FibreGuard guidance is generally consistent across the brand family, but always confirm whether you are working with indoor, Pro, or Outdoor collections.",
    quickFacts: [
      "Water is the main cleaning tool",
      "White bar soap is reserved for tougher stains",
      "Microfibre cloths are preferred for the circular-motion step",
      "Heat should not be used to dry the treated area",
    ],
    routineCare: [
      "Remove dry debris and loose residue before introducing moisture.",
      "Use blotting, not paper-towel scrubbing, to avoid forcing fibres into the fabric.",
      "Reserve soap for more stubborn marks and keep it minimal.",
      "Let the fabric dry naturally with no hairdryer or direct heat.",
    ],
    immediateSpillResponse: [
      "For thick residue such as mud, ketchup, lipstick, or similar messes, lift the excess first with a flat utensil.",
      "Apply water and blot with a white paper towel until transfer stops.",
      "Apply more water and use a microfibre cloth in gentle circular motions.",
      "Allow the area to air dry completely.",
    ],
    stubbornStainCare: [
      "Follow the water-only process first.",
      "If staining remains, use a white bar soap intermittently with water while continuing gentle circular motions.",
      "Repeat until the stain lifts, then allow the upholstery to air dry naturally.",
      "For outdoor or healthcare-adjacent collections, confirm the exact line before using any stronger chemistry.",
    ],
    cautions: [
      "Do not use a hairdryer or any other heat source.",
      "Do not start by scrubbing with paper towel.",
      "Do not jump straight to harsh stain removers or bleach-based chemistry.",
      "Always test a hidden area if you introduce any soap or additional cleaner.",
    ],
    sources: [
      {
        label: "FibreGuard: How to Clean",
        url: "https://fibreguard.com/how-to-clean",
      },
      {
        label: "Fabricut FibreGuard Cleaning Instructions",
        url: "https://qr.fabricut.com/cleanable-performance/cleaning/fibreguard",
      },
      {
        label: "FibreGuard Blog: How to Clean a Fabric Sofa at Home",
        url: "https://fibreguard.com/blog/how-to-clean-a-fabric-sofa-at-home",
      },
    ],
    videos: FABRIC_CARE_VIDEOS.filter((video) => video.brand === "FibreGuard"),
    images: {
      hero: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      detail: "https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&w=1600&q=80",
      alt: "Minimal upholstered seating in a calm design-forward interior",
      note: "Water-first cleaning with a soft visual finish",
    },
  },
  {
    slug: "dura-guard",
    name: "Dura-Guard",
    shortName: "Dura-Guard",
    sourceStatus: "supplier-guidance",
    heroEyebrow: "Supplier-Dependent Guidance",
    summary:
      "Dura-Guard branded textiles can vary by supplier, so maintenance should always be confirmed against the exact fabric specification sheet, cleaning code, and vendor guidance before treatment.",
    bestFor:
      "Projects where the fabric has a documented Dura-Guard finish or supplier care sheet and you want a conservative, verification-first maintenance process.",
    cleaningCodeNote:
      "We were not able to verify a single official upholstery-care source for every Dura-Guard textile. Treat the steps below as supplier guidance that must be confirmed against the exact fabric you purchased.",
    quickFacts: [
      "Begin with vacuuming or soft-brush dry cleaning",
      "Use mild soap and water for routine spot care",
      "Air drying is preferred",
      "Bleach-based cleaning should only happen if the supplier specifically permits it",
    ],
    routineCare: [
      "Vacuum or use a soft brush to remove loose dirt and grit.",
      "Rinse with cold or lukewarm water when simple soil removal is needed.",
      "Use a mild soap-and-water solution with a soft brush for routine spot cleaning.",
      "Allow the fabric to air dry fully before returning it to service.",
    ],
    immediateSpillResponse: [
      "Blot or lift the excess spill immediately with a clean, dry towel.",
      "Use a small amount of mild soap and water with a soft cloth or brush.",
      "Rinse away any soap residue thoroughly with clean water.",
      "Air dry without direct heat.",
    ],
    stubbornStainCare: [
      "Use only supplier-approved upholstery products for tougher staining.",
      "If the supplier specifically allows it, a diluted bleach solution may be used for severe staining after testing a hidden area first.",
      "Rinse thoroughly after any detergent or bleach exposure.",
      "If the repellency drops after cleaning, use only a supplier-approved guard product to restore it.",
    ],
    cautions: [
      "Do not use bleach unless your exact supplier documentation allows it.",
      "Do not use water over 100 degrees Fahrenheit.",
      "Do not machine dry, steam press, or use abrasive cleaners, ammonia, or harsh chemicals.",
      "If the supplier care sheet conflicts with the guidance below, follow the supplier sheet.",
    ],
    sourceNote:
      "This page is intentionally conservative because Dura-Guard care instructions vary by vendor and product type.",
    workshopNote:
      "If you bring us the fabric sample, cleaning code, or supplier spec sheet, JL Upholstery can help you confirm the safest cleaning approach before you try anything stronger.",
    sources: [],
    videos: [],
    images: {
      hero: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
      detail: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
      alt: "High-traffic upholstered lounge seating with durable fabric",
      note: "Always verify the exact supplier care sheet first",
    },
  },
];

export const FABRIC_CARE_BRAND_MAP = Object.fromEntries(
  FABRIC_CARE_BRANDS.map((brand) => [brand.slug, brand])
) as Record<string, FabricCareBrand>;
