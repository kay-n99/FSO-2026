import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { createRoot } from 'react-dom/client' 

import App from './App'
import { NotificationContextProvider } from './NotificationContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </NotificationContextProvider>
)