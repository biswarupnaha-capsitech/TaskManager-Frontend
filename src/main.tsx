import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TaskProvider } from './context/TaskContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { AuthProvider } from './context/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <FluentProvider theme={webLightTheme}>
    <TaskProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </TaskProvider>,
  </FluentProvider>
)
