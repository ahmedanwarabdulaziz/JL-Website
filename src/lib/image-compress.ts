/**
 * Client-side image compression using the browser Canvas API.
 * Resizes and converts images to WebP before upload — no server processing needed.
 *
 * Typical result: 10-15MB phone photo → 100-300KB WebP.
 */

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const WEBP_QUALITY = 0.75;

/** Load a File/Blob into an HTMLImageElement. */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/** Compress and resize an image file.  Returns a WebP Blob (~100-300KB). */
export async function compressImage(
  file: File,
  options?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<Blob> {
  const maxW = options?.maxWidth ?? MAX_WIDTH;
  const maxH = options?.maxHeight ?? MAX_HEIGHT;
  const quality = options?.quality ?? WEBP_QUALITY;

  const img = await loadImage(file);
  let { naturalWidth: w, naturalHeight: h } = img;

  // Scale down if larger than max dimensions (preserve aspect ratio)
  if (w > maxW || h > maxH) {
    const ratio = Math.min(maxW / w, maxH / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  // Use OffscreenCanvas if available (faster, works in Web Workers)
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.convertToBlob({ type: "image/webp", quality });
  }

  // Fallback: regular Canvas (Safari < 16.4)
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not supported");
  ctx.drawImage(img, 0, 0, w, h);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/webp",
      quality
    );
  });
}
