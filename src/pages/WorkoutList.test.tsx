import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import WorkoutList from "./WorkoutList";

const renderPage = () =>
  render(
    <MemoryRouter>
      <WorkoutList />
    </MemoryRouter>,
  );

describe("WorkoutList search", () => {
  it("filters workouts by search text", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText("Standing Conditioning")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Search workouts..."), "core");

    expect(screen.queryByText("Standing Conditioning")).not.toBeInTheDocument();
    expect(screen.getByText("Bodyweight Core Control")).toBeInTheDocument();
    expect(screen.getByText(/workouts shown/i)).toBeInTheDocument();
  });

  it("filters workouts by selected tag", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "cooldown" }));

    expect(screen.getByText("5-Minute Cooldown Flow")).toBeInTheDocument();
    expect(screen.queryByText("Standing Conditioning")).not.toBeInTheDocument();
  });

  it("paginates workouts with 5 per page", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText(/Page 1 of \d+/)).toBeInTheDocument();
    expect(screen.queryByText("Bodyweight Core Control")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(/Page 2 of \d+/)).toBeInTheDocument();
    expect(screen.getByText("Bodyweight Core Control")).toBeInTheDocument();
  });
});
