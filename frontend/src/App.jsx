import { useState } from 'react'
import './css/App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Exchange from './pages/Exchange'
import Orders from './pages/Orders'
import NavBar from './components/NavBar'

function App() {
  return (
    <div>
      <NavBar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />}> </Route>
          <Route path="/exchange" element={<Exchange />}> </Route>
          <Route path="/orders" element={<Orders />}> </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
