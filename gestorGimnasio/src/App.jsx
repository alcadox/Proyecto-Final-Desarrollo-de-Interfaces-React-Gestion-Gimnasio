import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Clientes from './routes/Clientes';
import InicioSesion from './routes/InicioSesion';
import Entrenadores from './routes/Entrenadores';
import Cliente from './routes/Cliente';



function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InicioSesion />} />
          <Route path="/Clientes" element={<Clientes/>} />
          <Route path="/Entrenadores" element={<Entrenadores/>} />
          <Route path="/Cliente/:id" element={<Cliente/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
