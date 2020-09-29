import React from "react";
import { render } from "@testing-library/react";
import { TestApp, TestServiceFirst } from "./initial.mock";

test("render", () => {
  const { getByText } = render(<TestApp />);
  const linkElement = getByText(/Click/i);
  expect(linkElement).toBeDefined();
});

test("click 3 times", async () => {
  let services: any;
  const { getByText } = render(
    <TestApp servicesOnReady={(ss) => (services = ss)} />
  );
  const linkElement = getByText(/Click/i);
  linkElement.click();
  linkElement.click();
  linkElement.click();
  expect(services.get(TestServiceFirst).isBiggerOrEqualThen3).toBeTruthy();
});

test("call hook", async () => {
  let services: any;
  const { getByText } = render(
    <TestApp servicesOnReady={(ss) => (services = ss)} />
  );
  const linkElement = getByText(/Click/i);
  linkElement.click();
  expect(services.get(TestServiceFirst).mockFn).toBeCalled();
});
