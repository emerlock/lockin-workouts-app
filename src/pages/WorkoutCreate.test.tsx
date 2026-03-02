import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import WorkoutCreate from "./WorkoutCreate";

const renderPage = () =>
  render(
    <MemoryRouter>
      <WorkoutCreate />
    </MemoryRouter>,
  );

describe("WorkoutCreate page", () => {
  it("paginates exercises with 5 items per page", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getAllByRole("checkbox")).toHaveLength(5);
    expect(screen.getByText(/Page 1 of \d+/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(/Page 2 of \d+/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Jumping Jacks")).not.toBeInTheDocument();
  });

  it("filters to bodyweight exercises", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Bodyweight" }));

    expect(screen.getByText("Inchworm Walkouts")).toBeInTheDocument();
    expect(screen.queryByText("Jumping Jacks")).not.toBeInTheDocument();
    expect(screen.getByText(/Page 1 of \d+/)).toBeInTheDocument();
  });

  it("shows validation when fewer than 6 exercises are selected", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("Leg Day"), "My Custom Workout");
    await user.click(screen.getByRole("checkbox", { name: /Jumping Jacks/i }));
    await user.click(screen.getByRole("button", { name: "Save Workout" }));

    expect(screen.getByText("Select at least 6 different exercises.")).toBeInTheDocument();
  });
});
