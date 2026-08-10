import RouteContainer from "./routes/RouteContainer";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./context/ToastContext";
import { store } from "./app/store";
import { Provider } from "react-redux";

const queryClient = new QueryClient()

// TypeScript only:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
    import('@tanstack/query-core')
    .QueryClient
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient
function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Provider store={store}>
            <RouteContainer />
          </Provider>
        </ToastProvider>
      </QueryClientProvider>
    </FluentProvider>
  );
}

export default App;