// Image helpers. Product/category images live on Cloudinary, which can
// resize and re-encode on the fly via URL parameters. We ask for:
//   f_auto  – best format the browser supports (AVIF/WebP)
//   q_auto  – automatic quality/size trade-off
//   c_limit,w_N – scale down to N px wide (never upscale)
// Non-Cloudinary URLs are returned untouched.

const CLOUDINARY_UPLOAD = /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)/;

export const isCloudinary = (url) => typeof url === "string" && CLOUDINARY_UPLOAD.test(url);

export const cdnImage = (url, width) => {
  if (!isCloudinary(url) || !width) return url;
  return url.replace(CLOUDINARY_UPLOAD, `$1f_auto,q_auto,c_limit,w_${Math.round(width)}/`);
};

/**
 * Props to spread onto an <img>: optimised src, a 1x/2x srcSet for retina
 * screens, and lazy loading unless the image is above the fold (`priority`).
 *
 *   <img {...imgProps(url, 400)} alt="…" className="…" />
 */
export const imgProps = (url, width, { priority = false } = {}) => {
  const props = {
    src: cdnImage(url, width),
    loading: priority ? "eager" : "lazy",
    decoding: "async",
  };
  if (isCloudinary(url) && width) {
    props.srcSet = `${cdnImage(url, width)} 1x, ${cdnImage(url, width * 2)} 2x`;
  }
  if (priority) props.fetchPriority = "high";
  return props;
};
