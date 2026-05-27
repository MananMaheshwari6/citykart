import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onError"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  /**
   * When true, replaces a failed image with a neutral icon + muted background
   * sized to fill the parent instead of swapping to `fallbackSrc`. Useful
   * for tiny thumbnails where a real placeholder image looks awkward.
   */
  iconFallback?: boolean;
}

function hasValidSrc(src: string | null | undefined): src is string {
  return typeof src === "string" && src.trim().length > 0;
}

/**
 * Drop-in `<img>` replacement that:
 *  - Renders the public `/placeholder.svg` instead of a broken-image icon
 *    when the URL is missing or 404s.
 *  - Handles double-failure (if the fallback itself 404s) without an
 *    infinite onError loop.
 *  - Adds a subtle muted background so the layout doesn't flash empty
 *    before the image loads.
 *  - Adjusts object-fit / padding when in the fallback state so the
 *    placeholder SVG doesn't get stretched by `object-cover`.
 *  - Lazy-loads by default; opt out by passing `loading="eager"`.
 */
export function SmartImage({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  iconFallback = false,
  loading = "lazy",
  ...rest
}: SmartImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(hasValidSrc(src) ? src : fallbackSrc);
  const [errored, setErrored] = useState<boolean>(!hasValidSrc(src));

  useEffect(() => {
    if (hasValidSrc(src)) {
      setImgSrc(src);
      setErrored(false);
    } else {
      setImgSrc(fallbackSrc);
      setErrored(true);
    }
  }, [src, fallbackSrc]);

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    // Stop a possible infinite loop if the fallback itself 404s.
    e.currentTarget.onerror = null;
    if (errored) return;
    setErrored(true);
    setImgSrc(fallbackSrc);
  };

  if (errored && iconFallback) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
      >
        <ImageOff className="h-6 w-6 opacity-60" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={cn(
        "bg-muted",
        className,
        errored && "object-contain p-3 opacity-70"
      )}
      {...rest}
    />
  );
}
