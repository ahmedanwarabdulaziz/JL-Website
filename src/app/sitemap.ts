import type { MetadataRoute } from "next";
import { getProjects, getUpholsteryPieces } from "@/lib/firestore";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_ROUTES = [
  "",
  "/about",
  "/commercial",
  "/contact",
  "/fabric",
  "/fabric-care-guide",
  "/faq",
  "/projects",
  "/services",
];

function makeUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function toDate(
  value: { toDate?: () => Date } | null | undefined
): Date | undefined {
  if (value && typeof value.toDate === "function") {
    return value.toDate();
  }

  return undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: makeUrl(path),
    lastModified: now,
  }));

  try {
    const [projects, pieces] = await Promise.all([
      getProjects(),
      getUpholsteryPieces(),
    ]);

    const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
      url: makeUrl(`/projects/${project.slug}`),
      lastModified: toDate(project.updatedAt) ?? toDate(project.createdAt) ?? now,
    }));

    const pieceEntries: MetadataRoute.Sitemap = pieces.map((piece) => ({
      url: makeUrl(`/projects/piece/${piece.slug}`),
      lastModified: toDate(piece.updatedAt) ?? toDate(piece.createdAt) ?? now,
    }));

    return [...staticEntries, ...projectEntries, ...pieceEntries];
  } catch {
    return staticEntries;
  }
}
