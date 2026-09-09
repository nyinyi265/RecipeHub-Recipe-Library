import Image from "next/image";

interface RecipeGalleryProps {
  images: string[];
}

export function RecipeGallery({ images }: RecipeGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Gallery</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((src, index) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt={`Recipe gallery image ${index + 1}`}
              fill
              sizes="(min-width:640px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
