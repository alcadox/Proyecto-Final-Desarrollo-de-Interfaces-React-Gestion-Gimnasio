// importamos los estilos globales
import './App.css'
// importamos las herramientas necesarias para crear las rutas de la web
import { BrowserRouter, Route, Routes } from "react-router-dom";
// importamos las distintas paginas de nuestra aplicacion
import Clientes from './routes/Clientes';
import InicioSesion from './routes/InicioSesion';
import Entrenadores from './routes/Entrenadores';
import Cliente from './routes/Cliente';
import Entrenador from './routes/Entrenador';

function App() {
  return (
    // contenedor principal de la aplicacion
    <div className="App">
      {/* configuramos el enrutador para poder movernos entre paginas */}
      <BrowserRouter>
        <Routes>
          {/* definimos cada ruta y que componente debe cargar cuando el usuario entre en ella */}
          <Route path="/" element={<InicioSesion />} />
          <Route path="/Clientes" element={<Clientes/>} />
          <Route path="/Entrenadores" element={<Entrenadores/>} />
          {/* pasamos el id por la url para saber que cliente o entrenador editar */}
          <Route path="/Cliente/:id" element={<Cliente/>} />
          <Route path="/Entrenador/:id" element={<Entrenador/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App