import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TaskProvider } from './context/TaskContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'

createRoot(document.getElementById('root')!).render(
  <FluentProvider theme={webLightTheme}>
    <TaskProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </TaskProvider>,
  </FluentProvider>
)
