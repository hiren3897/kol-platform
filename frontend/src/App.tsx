import './App.css'
import Dashboard from './pages/Dashboard'
import { KolProvider } from './providers/KolProvider'

function App() {

  return (
    <KolProvider>
      <Dashboard />
    </KolProvider>
  )
}

export default App
