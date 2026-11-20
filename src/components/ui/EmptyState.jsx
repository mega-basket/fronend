import Button from "./Button";

/**
 * Generic "nothing here yet" state — empty cart, wishlist, orders, search
 * results, etc. — so every module shares the same layout instead of each
 * page hand-rolling its own.
 */
const EmptyState = ({
  image,
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
    <div className="max-w-md text-center">
      {image && (
        <img src={image} alt="" className="mx-auto w-56 object-contain md:w-72" />
      )}
      {!image && icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          {icon}
        </div>
      )}
      <h2 className="mt-6 text-2xl font-bold text-neutral-900 md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 leading-7 text-neutral-500">{description}</p>
      )}
      {actionLabel && (
        <Button onClick={onAction} className="mt-8" size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  </div>
);

export default EmptyState;
