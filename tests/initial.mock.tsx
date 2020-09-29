import React from "react";
import { useServiceProvider, createService } from "../src";

export const TestServiceFirst = createService(
  () => {
    const [state, setState] = React.useState(() => ({
      counter: 0,
      text: "hello",
      mockFn: jest.fn(),
    }));
    return {
      ...state,
      get isBiggerOrEqualThen3() {
        return state.counter >= 3;
      },
      increaseCounter() {
        setState({
          ...state,
          counter: state.counter + 1,
        });
      },
    };
  },
  (state: any) => {
    state.mockFn();
  }
);

export const TestAppSetter = ({ servicesOnReady, services, children }) => {
  const ss = new Map();
  for (let s of services) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ss.set(s, React.useContext(s));
  }
  servicesOnReady && servicesOnReady(ss);
  return <>{children}</>;
};

const Services = [TestServiceFirst];

export const TestAppClick = () => {
  const service = React.useContext(TestServiceFirst);
  return <div onClick={service.increaseCounter}>Click</div>;
};

export const TestApp = ({ servicesOnReady }: { servicesOnReady?: any }) => {
  const [ServiceProvider, ServiceProviderHook] = useServiceProvider(
    ...Services
  );
  return (
    <ServiceProvider>
      <div className="container">
        <ServiceProviderHook>
          <TestAppSetter services={Services} servicesOnReady={servicesOnReady}>
            <TestAppClick />
          </TestAppSetter>
        </ServiceProviderHook>
      </div>
    </ServiceProvider>
  );
};
