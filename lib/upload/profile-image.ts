import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Persists an uploaded profile image under public/uploads/profiles.
 * @returns Public URL path (e.g. /uploads/profiles/abc.jpg).
 */
export async function saveProfileImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, GIF, and WebP images are allowed.");
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Profile image must be 2MB or smaller.");
  }

  const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const filename = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/profiles/${filename}`;
}
