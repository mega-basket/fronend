import { useMemo, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetProductReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "../../../../api/component/useReviews";

/**
 * ReviewsSection
 * --------------
 * Reads product reviews and exposes create / edit / delete.
 * Expects `currentUserId` so it can show edit/delete on the user's own review.
 */
const ReviewsSection = ({ productId, currentUserId }) => {
  const { data, isLoading } = useGetProductReviews(productId);
  const reviews = Array.isArray(data) ? data : [];
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const myReview = useMemo(
    () => reviews.find((r) => r.userId?._id === currentUserId),
    [reviews, currentUserId]
  );

  // Aggregate stats
  const { avg, total, distribution } = useMemo(() => {
    const total = reviews.length;
    if (!total) return { avg: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    const dist = [0, 0, 0, 0, 0]; // index 0 = 5★, index 4 = 1★
    reviews.forEach((r) => {
      const idx = 5 - Math.round(r.rating);
      if (idx >= 0 && idx < 5) dist[idx] += 1;
    });
    return { avg: sum / total, total, distribution: dist };
  }, [reviews]);

  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">
          Ratings & Reviews
        </h2>
        <span className="text-sm text-neutral-500">
          {total} review{total === 1 ? "" : "s"}
        </span>
      </div>

      {/* Summary + Distribution */}
      <div className="mt-6 grid gap-8 border-b border-neutral-200 pb-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-start">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-semibold tracking-tight text-neutral-900 tabular-nums">
              {total ? avg.toFixed(1) : "—"}
            </span>
            <span className="text-lg text-neutral-400">/ 5</span>
          </div>
          <StarRow value={avg} size={16} />
          <p className="mt-1 text-sm text-neutral-500">
            Based on {total} review{total === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {distribution.map((count, i) => {
            const stars = 5 - i;
            const pct = total ? (count / total) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-6 text-neutral-600 tabular-nums">{stars}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-neutral-500 tabular-nums">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write / edit form */}
      {currentUserId ? (
        <ReviewForm
          productId={productId}
          existing={myReview}
          onCreate={(payload) =>
            createReview.mutate(payload, {
              onSuccess: () => toast.success("Review posted"),
              onError: (err) =>
                toast.error(
                  err?.response?.data?.message || "Could not post review"
                ),
            })
          }
          onUpdate={(payload) =>
            updateReview.mutate(
              { ...payload, productId },
              {
                onSuccess: () => toast.success("Review updated"),
                onError: () => toast.error("Could not update review"),
              }
            )
          }
          onDelete={() =>
            deleteReview.mutate(
              { reviewId: myReview._id, productId },
              {
                onSuccess: () => toast.success("Review deleted"),
                onError: () => toast.error("Could not delete review"),
              }
            )
          }
          submitting={createReview.isPending || updateReview.isPending}
          deleting={deleteReview.isPending}
        />
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-200 p-4 text-sm text-neutral-600">
          Sign in to leave a review.
        </div>
      )}

      {/* Review list */}
      <div className="mt-8 divide-y divide-neutral-100">
        {isLoading &&
          [0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse py-6">
              <div className="h-4 w-32 rounded bg-neutral-100" />
              <div className="mt-3 h-3 w-full rounded bg-neutral-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-neutral-100" />
            </div>
          ))}

        {!isLoading && reviews.length === 0 && (
          <p className="py-8 text-sm text-neutral-500">
            No reviews yet — be the first to share your experience.
          </p>
        )}

        {reviews.map((r) => (
          <ReviewItem
            key={r._id}
            review={r}
            isMine={r.userId?._id === currentUserId}
          />
        ))}
      </div>
    </section>
  );
};

/* -------------------------------- Form -------------------------------- */

const ReviewForm = ({
  existing,
  onCreate,
  onUpdate,
  onDelete,
  submitting,
  deleting,
  productId,
}) => {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existing?.comment ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    if (existing) {
      onUpdate({ reviewId: existing._id, rating, comment });
    } else {
      onCreate({ productId, rating, comment });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-neutral-200 bg-white p-5"
    >
      <p className="text-sm font-medium text-neutral-900">
        {existing ? "Edit your review" : "Write a review"}
      </p>

      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = (hover || rating) >= n;
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded"
              aria-label={`Rate ${n} out of 5`}
            >
              <Star
                size={22}
                className={
                  active
                    ? "fill-amber-400 text-amber-400"
                    : "fill-neutral-200 text-neutral-200"
                }
              />
            </button>
          );
        })}
        {rating > 0 && (
          <span className="ml-2 text-sm text-neutral-500 tabular-nums">
            {rating}.0
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="Share what you liked or didn't. Was the size right? How's the build quality?"
        className="mt-3 w-full resize-none rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
      />
      <div className="mt-1 text-right text-xs text-neutral-400 tabular-nums">
        {comment.length}/1000
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        {existing ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete review
          </button>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={submitting || !rating}
          className="inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : existing
            ? "Update review"
            : "Post review"}
        </button>
      </div>
    </form>
  );
};

/* ------------------------------ Review row ------------------------------ */

const ReviewItem = ({ review, isMine }) => {
  const name = review.userId?.name || "Anonymous";
  const initial = name.charAt(0).toUpperCase();
  const dateStr = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="flex gap-4 py-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-700">
        {initial}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm font-medium text-neutral-900">{name}</span>
          {isMine && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              You
            </span>
          )}
          <span className="text-xs text-neutral-400">· {dateStr}</span>
        </div>
        <div className="mt-1">
          <StarRow value={review.rating} size={13} />
        </div>
        {review.comment && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            {review.comment}
          </p>
        )}
      </div>
    </article>
  );
};

/* --------------------------------- Stars --------------------------------- */

const StarRow = ({ value = 0, size = 14 }) => (
  <div className="flex items-center gap-0.5" aria-label={`Rated ${value} of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={
          n <= Math.round(value)
            ? "fill-amber-400 text-amber-400"
            : "fill-neutral-200 text-neutral-200"
        }
      />
    ))}
  </div>
);

export default ReviewsSection;