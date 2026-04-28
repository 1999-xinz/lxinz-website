import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { useClickRipple } from './hooks/use-click-ripple'

function App() {
  useClickRipple()

  return <RouterProvider router={router} />
}

export default App
