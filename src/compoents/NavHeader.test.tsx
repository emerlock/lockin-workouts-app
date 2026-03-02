import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NavHeader from "./NavHeader";

describe("NavHeader active links", () => {
  it("highlights only Create Workout on /workouts/new", () => {
    render(
      <MemoryRouter initialEntries={["/workouts/new"]}>
        <NavHeader />
      </MemoryRouter>,
    );

    const workoutsLink = screen.getByRole("link", { name: "Workouts" });
    const createLink = screen.getByRole("link", { name: "Create Workout" });

    expect(createLink.className).toContain("bg-brand-secondary");
    expect(workoutsLink.className).not.toContain("bg-brand-secondary");
  });
});
