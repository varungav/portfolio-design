// All copy and imagery here is PLACEHOLDER. Replace with client-supplied
// photography, projects, services and testimonials. Nothing below is a claim
// about a real business.

export const studio = {
  name: "Studio Name",
  tagline: "Furniture and interiors, made to be lived with.",
  email: "hello@example.com",
  location: "Location to be supplied",
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  /** Path under /public, e.g. "/images/project-one.jpg". Omit to show a placeholder. */
  image?: string;
};

export const projects: Project[] = [
  { slug: "project-one", title: "Project One", category: "Residential", year: "Year", summary: "Project description to be supplied by the client." },
  { slug: "project-two", title: "Project Two", category: "Hospitality", year: "Year", summary: "Project description to be supplied by the client." },
  { slug: "project-three", title: "Project Three", category: "Residential", year: "Year", summary: "Project description to be supplied by the client." },
  { slug: "project-four", title: "Project Four", category: "Commercial", year: "Year", summary: "Project description to be supplied by the client." },
];

export type Collection = { slug: string; name: string; note: string; image?: string };

export const collections: Collection[] = [
  { slug: "collection-one", name: "Collection One", note: "Materials and pieces to be supplied." },
  { slug: "collection-two", name: "Collection Two", note: "Materials and pieces to be supplied." },
  { slug: "collection-three", name: "Collection Three", note: "Materials and pieces to be supplied." },
];

export const services: { name: string; text: string }[] = [
  { name: "Service One", text: "Service description to be supplied by the client." },
  { name: "Service Two", text: "Service description to be supplied by the client." },
  { name: "Service Three", text: "Service description to be supplied by the client." },
];

/** Add real client quotes here. The section renders only when this has entries. */
export const testimonials: { quote: string; author: string }[] = [];

export const nav = [
  { label: "About", to: "/about" },
  { label: "Projects", to: "/work" },
  { label: "Portfolio", to: "/collections" },
  { label: "What we offer", to: "/services" },
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
  count: 50,
  years: 3,
  sectors: ["Luxury retail", "Travel retail", "Beauty & fragrance", "Watches & jewelry", "F&B", "FMCG"],
};

/** Profile copy as supplied by the client. */
export const profile = {
  role: "Retail Production Designer",
  name: "Praveen Kumar B",
  status: "Freelancer",
  paragraphs: [
    "Hi, I'm Praveen, a technical designer for retail stores, kiosks and custom furniture. In the last 3 years I've worked with 50+ brands across luxury retail, travel retail, beauty and fragrance, watches and jewelry, F&B and FMCG.",
    "I turn approved concept designs into clear, production-ready technical documentation, enabling manufacturers to understand the design intent, construction details, materials, and dimensions clearly, reducing back-and-forth communication and unnecessary approval cycles before production.",
  ],
};
