import { useState } from 'react'
import { Inicio } from './components/pages/Inicio.jsx'
import { Route } from 'react-router-dom'
import { Rutas } from './routes/Rutas.jsx'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; 

function App() {
  
  return (
    <div className='layout'>

      <Rutas></Rutas>
      

    </div>
  )
}

export default App
