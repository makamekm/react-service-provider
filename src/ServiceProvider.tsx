import React from "react";
import {
  ServiceContextHook,
  ServiceProviderContext,
  ServiceContextHookGeneric,
} from "./context";

export function useServiceProvider(...services: ServiceContextHookGeneric[]) {
  const [ServiceProvider] = React.useState<React.FC>(() =>
    ServiceProviderFactory(...services)
  );
  return [ServiceProvider, ServiceProviderHook];
}

export function createService<T>(
  useState: () => T,
  useLogic: (state: T) => void = () => {}
): ServiceContextHook<T> {
  const context: any = React.createContext<T>(null);
  context.useState = useState;
  context.useLogic = useLogic;
  return context;
}

export const ServiceProviderHook: React.FC = ({ children }) => {
  const services = React.useContext(ServiceProviderContext);
  for (const service of services) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = React.useContext(
      Array.isArray(service) ? service[0] : service
    );
    !Array.isArray(service)
      ? service.useLogic(state)
      : typeof service[1] === "function"
      ? service[1](state)
      : typeof service[2] === "function"
      ? service[2](state)
      : undefined;
  }
  return <>{children}</>;
};

const createServiceProvider: (
  Parent: React.FC,
  service: ServiceContextHook,
  value?: any
) => React.FC = (Parent, service, value) => {
  Parent = Parent || React.Fragment;
  return ({ children }) => {
    service["_value"] = value || service.useState();
    return (
      <Parent>
        <service.Provider value={service["_value"]}>
          {children}
        </service.Provider>
      </Parent>
    );
  };
};

export const ServiceProviderFactory = (
  ...services: ServiceContextHookGeneric[]
): React.FC => ({ children }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Provider] = React.useState<React.FC>(() =>
    services.reduce<React.FC>((Component, service) => {
      return createServiceProvider(
        Component,
        Array.isArray(service) ? service[0] : service,
        Array.isArray(service) && typeof service[1] === "object"
          ? service[1]
          : undefined
      );
    }, null)
  );

  return (
    <ServiceProviderContext.Provider value={services}>
      <Provider>{children}</Provider>
    </ServiceProviderContext.Provider>
  );
};
