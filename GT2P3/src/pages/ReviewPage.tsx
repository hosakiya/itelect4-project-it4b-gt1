import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AiReview } from "../types/index";
import { askAi } from "../api/client";
import { reviewFormSchema, type ReviewFormValues } from "../schemas/reviewSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, BookOpen, CheckCircle, HelpCircle, AlertCircle } from "lucide-react";

// Record mapping each readiness value to its distinct badge styling
const READINESS_STYLE: Record<AiReview["readiness"], string> = {
  ready: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
  almost: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700",
  "not-yet": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-700",
};

const READINESS_LABELS: Record<AiReview["readiness"], string> = {
  ready: "Ready for Checkout / Submission",
  almost: "Almost Ready (Needs Minor Details)",
  "not-yet": "Needs Refinement",
};

export default function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: "" },
  });

  const review = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.prompt);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-emerald)] font-mono">
            AI Library Advisor
          </span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)]">
          AI Book & Research Review
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Describe your research topic, course project, or reading interests to receive personalized book recommendations and reservation guidance.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="prompt" className="text-sm font-semibold text-[var(--text-primary)]">
              Your Project or Reading Inquiry
            </Label>
            <textarea
              id="prompt"
              rows={6}
              {...register("prompt")}
              aria-invalid={errors.prompt ? true : undefined}
              placeholder="Example: I am working on our IT elective project on web security and backend API design. I need reference textbooks and practical guides on Node.js, Express, and database indexing before our thesis submission deadline..."
              className="w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[var(--accent-indigo)] focus:ring-2 focus:ring-[var(--accent-indigo)]/20 transition duration-200 resize-y"
            />
            {errors.prompt && (
              <p className="text-sm text-rose-500 font-medium">
                {errors.prompt.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={review.isPending}
            className="justify-self-start px-6 py-2.5 rounded-xl font-semibold bg-[var(--accent-indigo)] text-white hover:bg-[var(--accent-indigo-hover)] shadow-sm shadow-[var(--accent-indigo)]/25 transition disabled:opacity-50 cursor-pointer"
          >
            {review.isPending ? "Consulting AI..." : "Review My Inquiry"}
          </Button>
        </form>

        {review.isError && (
          <div className="mt-4 p-4 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {review.error.message}
            </p>
          </div>
        )}

        {review.data && (
          <div className="mt-8 grid gap-6 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-card)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                Evaluation Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${READINESS_STYLE[review.data.readiness]}`}
              >
                {review.data.readiness === "ready" && <CheckCircle className="w-3.5 h-3.5" />}
                {review.data.readiness === "almost" && <HelpCircle className="w-3.5 h-3.5" />}
                {review.data.readiness === "not-yet" && <AlertCircle className="w-3.5 h-3.5" />}
                {READINESS_LABELS[review.data.readiness] || review.data.readiness}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono mb-1.5">
                Summary of Inquiry
              </h3>
              <p className="text-base text-[var(--text-primary)] font-medium leading-relaxed">
                {review.data.summary}
              </p>
            </div>

            <div className="grid gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-emerald)]" />
                Recommended Books & Academic Resources
              </h3>
              <ul className="list-disc pl-5 text-sm text-[var(--text-primary)] space-y-1.5">
                {review.data.recommendations.map((rec) => (
                  <li key={rec} className="leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-indigo)]" />
                Library Guidance & Next Steps
              </h3>
              <ul className="list-disc pl-5 text-sm text-[var(--text-primary)] space-y-1.5">
                {review.data.guidance.map((tip) => (
                  <li key={tip} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
