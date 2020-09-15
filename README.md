# React Service Provider

```
npm i --save react-service-provider
```

This package has been created for inplementing IOC Design Pattern & Services.

Example:

## SomeComponent.tsx (observer is from MobX)

```
const SomeComponent = observer((props) => {
  const secondService = React.useContext(SecondService);
  return (
     <div onClick={secondService.increaseCounter}>
       {secondService.counter}
     </div>
  );
});
```

## index.tsx

```
export const App = () => {
  const [ServiceProvider] = React.useState<React.FC>(() =>
    ServiceProviderFactory(
      FirstService,
      SecondService,
    )
  );

  return (
    <ServiceProvider>
      <Router basename={basePath}>
        <ServiceProviderHook>
         <AppLayout>
           <RoutedContent />
         </AppLayout>
        </ServiceProviderHook>
      </Router>
    </ServiceProvider>
  );
};
```

## FirstService.tsx (useLocalStore is from MobX)

```
export const FirstService = createService(
  () => {
    const service = useLocalStore(() => ({
      counter: 0,
      get isCounterBigger5() {
        return service.counter > 5;
      },
      limitCounter: () => {
        if (service.isCounterBigger5) {
          service.counter = 0;
        }
      },
    }));
    return service;
  }
);
```

## SecondService.tsx (useLocalStore is from MobX)

```
export const SecondService = createService(
  () => {
    const service = useLocalStore(() => ({
      firstService: null as FirstService,
      get counter() {
        return service.firstService.counter > 5;
      },
      increaseCounter: () => {
        service.firstService.counter++;
        service.firstService.limitCounter();
      },
    }));
    return service;
  },
  (service) => {
    service.firstService = React.useContext(FirstService);
  }
);
```
