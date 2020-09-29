import React from "react";

export type ServiceContextHook<T = any> = React.Context<T> & {
  useState: () => T;
  useLogic: (state: T) => void;
};

export type ServiceContextHookGeneric<T = any> =
  | ServiceContextHook<T>
  | [ServiceContextHook<T>, T]
  | [ServiceContextHook<T>, T, (state: T) => void]
  | [ServiceContextHook<T>, (state: T) => void];

export const ServiceProviderContext = React.createContext<
  ServiceContextHookGeneric[]
>(null);
