// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LoginModal from "./components/LoginModal";

describe("Login Modal Test Elements", () => {
  test("renders App component", () => {
    render(<LoginModal />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
