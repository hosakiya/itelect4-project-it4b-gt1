import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { askAi } from "../api/client";
import ReviewPage from "./ReviewPage";

vi.mock("../api/client", () => ({
  askAi: vi.fn(),
}));

const reviewResponse = {
  summary: "You are researching web security for an IT project.",
  recommendations: ["Web Security for Developers"],
  guidance: ["Check the catalog for available copies before reserving."],
  readiness: "not-yet" as const,
};

function renderReviewPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReviewPage />
    </QueryClientProvider>,
  );
}

describe("ReviewPage", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates the prompt before submitting", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    renderReviewPage();

    await user.type(
      screen.getByLabelText("Your Project or Reading Inquiry"),
      "Too short",
    );
    await user.click(screen.getByRole("button", { name: "Review My Inquiry" }));

    expect(
      await screen.findByText(
        "Describe your project or reading inquiry in at least 20 characters.",
      ),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(askAi).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("submits a valid prompt and renders every response field", async () => {
    vi.mocked(askAi).mockResolvedValue(reviewResponse);
    const user = userEvent.setup();
    renderReviewPage();

    await user.type(
      screen.getByLabelText("Your Project or Reading Inquiry"),
      "  I am researching web security for our IT project.  ",
    );
    await user.click(screen.getByRole("button", { name: "Review My Inquiry" }));

    expect(vi.mocked(askAi).mock.calls[0]?.[0]).toBe(
      "I am researching web security for our IT project.",
    );
    expect(await screen.findByText(reviewResponse.summary)).toBeInTheDocument();
    expect(
      screen.getByText(reviewResponse.recommendations[0]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(reviewResponse.guidance[0]),
    ).toBeInTheDocument();
    expect(screen.getByText("Needs Refinement")).toBeInTheDocument();
  });
});
