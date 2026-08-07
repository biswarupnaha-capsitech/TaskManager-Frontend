import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { Provider } from "react-redux"
import { store } from "./app/store.ts"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <FluentProvider theme={webLightTheme}>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ToastProvider>
    </QueryClientProvider>
  </FluentProvider>
)
