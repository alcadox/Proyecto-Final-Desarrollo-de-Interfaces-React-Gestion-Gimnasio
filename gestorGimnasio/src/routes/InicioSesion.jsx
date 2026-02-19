// importamos hooks necesarios para manejar estado y redirecciones
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const InicioSesion = () => {
    // definimos las variables para guardar lo que escribe el usuario
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // funcion que se ejecuta al darle al boton de entrar
    const handleLogin = async () => {
        // limpiamos error anterior si lo hubiera
        setError('');

        // comprobamos que haya escrito algo
        if (!username || !password) {
            setError('Por favor, completa todos los campos para continuar.');
            return;
        }

        try {
            // llamamos al backend enviando usuario y contrasena
            const response = await axios.post('http://localhost:3001/login', {
                username,
                password,
            });

            // si va bien navegamos a la pagina principal
            if (response.data.ok) {
                navigate('/Clientes');
            } else {
                setError('Usuario o contraseña incorrectos.');
            }
        } catch (err) {
            console.error(err);
            setError('No se pudo conectar con el servidor. Inténtalo más tarde.');
        }
    };

    return (
        // fondo oscuro de pantalla completa para el login
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#0f172a' }} // fondo oscuro principal
        >
            <div className="card border-0 shadow-lg rounded-4" style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e293b' }}> 
                <div className="card-body p-5">

                    {/* titulo con color de acento */}
                    <h2 className="text-center fw-bold mb-4 text-info">Inicio de Sesión</h2>

                    {error && (
                            <div className="alert alert-danger rounded-3 text-center py-2 border-0 bg-danger bg-opacity-25 text-white">
                                {error}
                            </div>
                        )
                    }

                    <div className="d-flex flex-column gap-3">
                        <div>
                            <label className="form-label fw-bold small text-secondary">Usuario</label>
                            <input
                                type="text"
                                className="form-control form-control-lg rounded-3 border-0 text-white shadow-none"
                                placeholder="Introduce tu usuario"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} // input oscuro
                            />
                        </div>

                        <div>
                            <label className="form-label fw-bold small text-secondary">Contraseña</label>
                            <input
                                type="password"
                                className="form-control form-control-lg rounded-3 border-0 text-white shadow-none"
                                placeholder="Introduce tu contraseña"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                style={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} // input oscuro
                            />
                        </div>

                        {/* boton para iniciar sesion */}
                        <button
                            className="btn btn-primary btn-lg rounded-pill mt-3 fw-semibold border-0"
                            onClick={handleLogin}
                            style={{ background: "linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)" }} // boton con gradiente
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InicioSesion;