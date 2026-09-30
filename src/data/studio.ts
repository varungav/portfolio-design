// All copy and imagery here is PLACEHOLDER. Replace with client-supplied
// photography, projects, services and testimonials. Nothing below is a claim
// about a real business.

export const studio = {
  name: "Studio Name",
  tagline: "Furniture and interiors, made to be lived with.",
  /** Flip to true when the site goes live to show the contact details and enable the enquiry form. */
  contactLive: false,
  contactName: "Praveen Kumar B",
  email: "praveenkumar114@gmail.com",
  phone: "+971 529498820",
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  /** Path under /public, e.g. "/images/project-one.jpg". Omit to show a placeholder. */
  image?: string;
  /** "contain" for a cutout/transparent-background shot; "cover" (default) for a normal photo. */
  imageFit?: "cover" | "contain";
  /** Short line shown under the title in the project showcase. */
  tagline?: string;
  /** Small note shown under the photo, e.g. "Approved Client Concept Design". */
  caption?: string;
  /** Overrides the shared `projectProcess` values below for this project only. */
  scope?: string;
  tools?: string;
  delivered?: string;
  /** Drawing sheets shown in the open panel instead of the 3D-model placeholder. */
  gallery?: { src: string; label: string; caption: string }[];
  /** Line shown under the gallery, e.g. availability of the full package. */
  galleryNote?: string;
};

/** Scope/tools/delivered are the same across projects — shown in the showcase unless a project overrides them. */
export const projectProcess = {
  scope: "Full production-ready technical detailing",
  tools: "SolidWorks",
  delivered: "3D final output, elevations, sections, construction detail",
};

const DRAWING_TAGLINE = "Retail Fixture Design · Detailed technical drawing";
const DRAWING_NOTE = "Complete production drawing package available on request.";
const CAP_3D = "Final look after production, every material called out for client approval";
const CAP_ELEVATION = "Fully dimensioned face view for manufacturing";

export const projects: Project[] = [
  {
    slug: "cash-counter",
    title: "Cash Counter",
    category: "Commercial",
    year: "Year",
    summary: "Project description to be supplied by the client.",
    image: "/images/cash-counter.png",
    imageFit: "contain",
    tagline: DRAWING_TAGLINE,
    caption: "Approved Client Concept Design",
    gallery: [
      {
        src: "/images/cash-counter-3d.png",
        label: "3D view",
        caption: CAP_3D,
      },
      {
        src: "/images/cash-counter-elevation.png",
        label: "Elevation",
        caption: CAP_ELEVATION,
      },
      {
        src: "/images/cash-counter-section-1.png",
        label: "Section",
        caption: "Internal construction: shelving & hardware",
      },
      {
        src: "/images/cash-counter-section-2.png",
        label: "Section",
        caption: "Internal construction: shelving & hardware",
      },
      {
        src: "/images/cash-counter-detail.png",
        label: "Detail",
        caption: "Construction spec: glass drawer details",
      },
    ],
    galleryNote: DRAWING_NOTE,
  },
  {
    slug: "signages",
    title: "Signages",
    category: "Retail Fixture Design",
    year: "Year",
    summary: "Project description to be supplied by the client.",
    image: "/images/project-culti-milano.png",
    imageFit: "contain",
    tagline: DRAWING_TAGLINE,
    caption: "Approved Client Concept Design",
    gallery: [
      { src: "/images/signages-3d.png", label: "3D view", caption: CAP_3D },
      { src: "/images/signages-elevation.png", label: "Elevation", caption: CAP_ELEVATION },
      { src: "/images/signages-section.png", label: "Section", caption: "Internal construction: wire passing" },
    ],
    galleryNote: DRAWING_NOTE,
  },
  {
    slug: "product-display",
    title: "Product Display",
    category: "Retail Fixture Design",
    year: "Year",
    summary: "Project description to be supplied by the client.",
    image: "/images/project-kitchen-display.png",
    tagline: DRAWING_TAGLINE,
    caption: "Approved Client Concept Design",
    gallery: [
      { src: "/images/product-display-3d.png", label: "3D view", caption: CAP_3D },
      { src: "/images/product-display-elevation-1.png", label: "Elevation", caption: CAP_ELEVATION },
      { src: "/images/product-display-elevation-2.png", label: "Elevation", caption: CAP_ELEVATION },
      { src: "/images/product-display-detail.png", label: "Detail", caption: "Construction spec: acrylic fixing" },
    ],
    galleryNote: DRAWING_NOTE,
  },
  {
    slug: "backwall",
    title: "Backwall",
    category: "Retail Fixture Design",
    year: "Year",
    summary: "Project description to be supplied by the client.",
    image: "/images/project-shelving-unit.png",
    tagline: DRAWING_TAGLINE,
    caption: "Approved Client Concept Design",
    gallery: [
      { src: "/images/backwall-3d.png", label: "3D view", caption: CAP_3D },
      { src: "/images/backwall-elevation-1.png", label: "Elevation", caption: CAP_ELEVATION },
      { src: "/images/backwall-elevation-2.png", label: "Elevation", caption: CAP_ELEVATION },
      { src: "/images/backwall-detail.png", label: "Detail", caption: "Construction spec: power plug" },
    ],
    galleryNote: DRAWING_NOTE,
  },
  {
    slug: "retail-counter",
    title: "Retail Counter",
    category: "Retail Fixture Design",
    year: "Year",
    summary: "Project description to be supplied by the client.",
    image: "/images/project-retail-counter.png",
    tagline: DRAWING_TAGLINE,
    caption: "Approved Client Concept Design",
    gallery: [
      { src: "/images/retail-counter-3d.png", label: "3D view", caption: CAP_3D },
      { src: "/images/retail-counter-elevation.png", label: "Elevation", caption: CAP_ELEVATION },
      { src: "/images/retail-counter-section.png", label: "Section", caption: "Internal construction: shelving & hardware" },
      { src: "/images/retail-counter-detail.png", label: "Detail", caption: "Construction spec: finger pull" },
    ],
    galleryNote: DRAWING_NOTE,
  },
];

export type Collection = { slug: string; name: string; note: string; image?: string };

export const collections: Collection[] = [
  { slug: "collection-one", name: "Collection One", note: "Materials and pieces to be supplied." },
  { slug: "collection-two", name: "Collection Two", note: "Materials and pieces to be supplied." },
  { slug: "collection-three", name: "Collection Three", note: "Materials and pieces to be supplied." },
];

export const services: { name: string; tag: string; price: string; unit: string; text: string }[] = [
  {
    name: "Hourly basis",
    tag: "Pay for time taken",
    price: "$25",
    unit: "/ hour",
    text: "Best for small furniture pieces or quick technical drawings. You only pay for the time the piece actually takes.",
  },
  {
    name: "Project basis",
    tag: "Fixed, confirmed upfront",
    price: "$200 – $1200",
    unit: "/ fixture",
    text: "Fixed price for larger or more detailed fixtures, based on 1–2 days of work at the same hourly rate. Estimate confirmed before starting.",
  },
];

export const deliverables = ["3D view", "Elevation", "Section", "Construction detail", "Material call-outs"];

/** Add real client quotes here. The section renders only when this has entries. */
export const testimonials: { quote: string; author: string }[] = [];

export const nav = [
  { label: "Projects", to: "/work" },
  { label: "Portfolio", to: "/collections" },
  { label: "Services & Pricing", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** Brands shown in the homepage tour. PLACEHOLDER names and photos: replace with
 *  real brands and client photography (files under /public). */
export type Brand = { name: string; note: string; photos: string[] };

const seedPhotos = (seed: string) =>
  Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/800/1000`);

export const brands: Brand[] = [
  { name: "Brand One", note: "Interiors to be supplied", photos: seedPhotos("brand-one") },
  { name: "Brand Two", note: "Interiors to be supplied", photos: seedPhotos("brand-two") },
  { name: "Brand Three", note: "Interiors to be supplied", photos: seedPhotos("brand-three") },
];

/** Client brands, as supplied by the studio. `look` only varies the typography. */
export type ClientBrand = { name: string; look: "wide" | "small" | "bold" | "serif" | "italic" };

const R = (...items: [string, ClientBrand["look"]][]): ClientBrand[] =>
  items.map(([name, look]) => ({ name, look }));

/** One entry per carousel row, in the order the studio supplied them. */
export const clientBrandRows: ClientBrand[][] = [
  R(["Estée Lauder", "wide"], ["Starbucks", "bold"], ["Venini", "serif"], ["Omega", "bold"], ["Initio", "wide"]),
  R(["Memo Paris", "wide"], ["Culti Milano", "serif"], ["Tanishq", "bold"], ["Da Milano", "bold"], ["Trendy Time", "bold"]),
  R(["Joël Robuchon", "small"], ["Maje", "wide"], ["Luca Faloni", "italic"], ["OKX", "bold"], ["Arkadyan", "bold"]),
  R(["Ralph Lauren", "wide"], ["Vacheron", "wide"]),
  R(["AHK", "bold"], ["Calvin Klein", "wide"]),
  R(["Frame", "wide"], ["Tryano", "bold"]),
  R(["AFJ", "bold"], ["Fugazzi", "italic"], ["A.P.C.", "wide"], ["Serge Lutens", "small"], ["Jo Malone", "wide"]),
  R(["Kilian", "wide"], ["Narciso Rodriguez", "small"], ["Issey Miyake", "small"], ["Chanel", "bold"], ["BCI", "bold"]),
  R(["Denza", "bold"], ["Al Barari", "serif"], ["AB Maldives", "small"], ["Korea Town", "bold"], ["Portofino", "italic"]),
];

export const clientBrands: ClientBrand[] = clientBrandRows.flat();

export const brandStats = {
  count: 40,
  sectors: ["Luxury retail", "Travel retail", "Beauty & fragrance", "Watches & jewelry", "F&B", "FMCG"],
};

/** Profile copy as supplied by the client. */
export const profile = {
  role: "Retail Production Designer",
  name: "Praveen Kumar B",
  status: "Freelancer",
  paragraphs: [
    "Hi, I'm Praveen, a technical designer for retail stores, kiosks and custom furniture. I've worked with 40+ brands across luxury retail, travel retail, beauty and fragrance, watches and jewelry, F&B and FMCG.",
    "I turn approved concept designs into clear, production-ready technical documentation, enabling manufacturers to understand the design intent, construction details, materials, and dimensions clearly, reducing back-and-forth communication and unnecessary approval cycles before production.",
  ],
};
