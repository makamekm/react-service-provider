import React from "react";
import { render } from "@testing-library/react";
import {
  TestApp,
  TestMockApp,
  TestMockHookApp,
  TestServiceFirst,
} from "./initial.mock";

test("should render", () => {
  const { getByText } = render(<TestApp />);
  const linkElement = getByText(/Click/i);
  expect(linkElement).toBeDefined();
});

test("should click 3 times", async () => {
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

test("should call hook after click", async () => {
  let services: any;
  const { getByText } = render(
    <TestApp servicesOnReady={(ss) => (services = ss)} />
  );
  const linkElement = getByText(/Click/i);
  linkElement.click();
  expect(services.get(TestServiceFirst).mockFn).toBeCalled();
});

test("should mock service with value after click", async () => {
  const mock = {
    increaseCounter: jest.fn(),
  };
  const { getByText } = render(<TestMockApp mockValue={mock} />);
  const linkElement = getByText(/Click/i);
  linkElement.click();
  expect(mock.increaseCounter).toBeCalled();
});

test("should NOT mock service with value after click", async () => {
  const mock = {
    increaseCounter: jest.fn(),
  };
  render(<TestMockApp mockValue={mock} />);
  expect(mock.increaseCounter).toBeCalledTimes(0);
});

test("should mock service with value and hook after click", async () => {
  const hook = jest.fn();
  const mock = {
    increaseCounter: jest.fn(),
  };
  const { getByText } = render(
    <TestMockHookApp mockValue={mock} mockHook={hook} />
  );
  const linkElement = getByText(/Click/i);
  linkElement.click();
  expect(mock.increaseCounter).toBeCalled();
  expect(hook).toBeCalled();
});

test("should NOT mock service with value and hook after click", async () => {
  const hook = jest.fn();
  const mock = {
    increaseCounter: jest.fn(),
  };
  render(<TestMockHookApp mockValue={mock} mockHook={hook} />);
  expect(mock.increaseCounter).toBeCalledTimes(0);
  expect(hook).toBeCalled();
});
