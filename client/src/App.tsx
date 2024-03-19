import { ConfigProvider, theme } from "antd"

import HomePage from "./pages/Home"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: false,
    },
  },
});

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.defaultAlgorithm]
      }}
    >
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App