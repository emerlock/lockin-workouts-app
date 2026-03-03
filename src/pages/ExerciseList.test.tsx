import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ExerciseList from "./ExerciseList";

const renderPage = (initialPath = "/exercises") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/exercises" element={<ExerciseList />} />
      </Routes>
    </MemoryRouter>,
  );

describe("ExerciseList page", () => {
  it("paginates exercises with 10 items per page", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText(/Page 1 of \d+/)).toBeInTheDocument();
    expect(screen.getByText("Jumping Jacks")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(/Page 2 of \d+/)).toBeInTheDocument();
    expect(screen.queryByText("Jumping Jacks")).not.toBeInTheDocument();
  });

  it("applies tag filter from query params and can clear it", async () => {
    const user = userEvent.setup();
    renderPage("/exercises?tag=cardio");

    expect(screen.getByText("Tag filter:")).toBeInTheDocument();
    expect(screen.getByText("cardio")).toBeInTheDocument();
    expect(screen.getByText("7 exercises shown")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.queryByText("Tag filter:")).not.toBeInTheDocument();
  });

  it("renders a sticky filter/search container", () => {
    renderPage();

    const summary = screen.getByText(/exercises shown/);
    const stickyContainer = summary.closest("div");

    expect(stickyContainer).not.toBeNull();
    expect(stickyContainer?.className).toContain("sticky");
    expect(stickyContainer?.className).toContain("top-2");
  });

  it("shows warm-up/stretch exercises when focus filter is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Warm-Up / Stretch" }));

    expect(screen.getByText("Neck Rolls")).toBeInTheDocument();
    expect(screen.getAllByText(/warm-up\/stretch/i).length).toBeGreaterThan(0);
    expect(screen.queryByText("Push-Ups")).not.toBeInTheDocument();
  });

  it("shows cooldown exercises when cooldown filter is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Cooldown" }));

    expect(screen.getByText("Standing Forward Fold Stretch")).toBeInTheDocument();
    expect(screen.getAllByText(/cooldown/i).length).toBeGreaterThan(0);
    expect(screen.queryByText("Push-Ups")).not.toBeInTheDocument();
  });
});
