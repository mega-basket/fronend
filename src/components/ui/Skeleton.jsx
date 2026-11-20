// Grey placeholder blocks shaped like the real content, shown while data
// loads. They feel faster than a spinner because the layout doesn't jump.

export const Skeleton = ({ className = "" }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-md bg-neutral-200/70 ${className}`} />
);

const Page = ({ label, className = "", children }) => (
  <div role="status" aria-label={label} className={`mx-auto px-4 py-8 ${className}`}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-neutral-200 bg-white p-4 shadow-card ${className}`}>{children}</div>
);

export const CartSkeleton = () => (
  <Page label="Loading your cart" className="max-w-5xl">
    <Skeleton className="mb-6 h-9 w-40" />
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex gap-4">
            <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-16" />
          </Card>
        ))}
      </div>
      <Card className="h-fit w-full space-y-3 p-5 lg:w-80">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="mt-2 h-12 w-full rounded-xl" />
      </Card>
    </div>
  </Page>
);

export const WishlistSkeleton = () => (
  <Page label="Loading your wishlist" className="max-w-6xl">
    <Skeleton className="mb-6 h-9 w-48" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex gap-4">
          <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        </Card>
      ))}
    </div>
  </Page>
);

export const OrdersSkeleton = () => (
  <Page label="Loading your orders" className="max-w-4xl sm:px-6">
    <Skeleton className="mb-6 h-9 w-40" />
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          {Array.from({ length: 2 }).map((__, j) => (
            <div key={j} className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </Card>
      ))}
    </div>
  </Page>
);

export const ProfileSkeleton = () => (
  <Page label="Loading your profile" className="max-w-5xl pt-6 sm:px-6">
    <Card className="flex items-center gap-4 p-6">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </Card>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <Card className="space-y-4 p-6 lg:col-span-2">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ))}
      </Card>
      <Card className="space-y-3 p-6">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-xl" />
        ))}
      </Card>
    </div>
  </Page>
);

export const CheckoutSkeleton = () => (
  <Page label="Loading checkout" className="max-w-6xl py-6 sm:px-6">
    <Skeleton className="mb-6 h-9 w-40" />
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="space-y-3 p-5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </Card>
        ))}
      </div>
      <Card className="h-fit w-full space-y-3 p-5 lg:w-96">
        <Skeleton className="h-6 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-xl" />
      </Card>
    </div>
  </Page>
);

export default Skeleton;
