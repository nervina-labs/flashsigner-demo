import { useMemo } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Provider as JotaiProvider } from 'jotai'
import { Routers } from './routes'

function App() {
  const queryClient = useMemo(() => new QueryClient(), [])
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <Routers />
        </JotaiProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
