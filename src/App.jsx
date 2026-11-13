import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Simulator from './pages/Simulator'
import Compare from './pages/Compare'
import Quest from './pages/Quest'
import Learn from './pages/Learn'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/quest" element={<Quest />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
