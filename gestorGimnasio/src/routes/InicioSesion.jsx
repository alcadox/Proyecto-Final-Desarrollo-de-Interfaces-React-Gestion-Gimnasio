import { useState } from 'react'; // useState sirve para guardar datos que cambian (estado)
import { useNavigate } from 'react-router-dom'; // useNavigate para cambiar de pagina (navegar)
import axios from 'axios'; // axios para hacer peticiones http al servidor
import 'bootstrap/dist/css/bootstrap.min.css'; // importamos estilos de bootstrap

const InicioSesion = () => {
	// estados (variables que recuerdan cosas entre renderizados)
    
	// username: guarda el nombre/usuario que escribe la persona
	// setusername: funcion que actualiza 'username'
	const [username, setUsername] = useState('');

	// password: guarda la contrasena que escribe la persona
	// setpassword: funcion que actualiza 'password'
	const [password, setPassword] = useState('');

	// error: guarda mensajes de error para mostrarlos en la pagina
	// seterror: funcion que actualiza 'error'
	const [error, setError] = useState('');

	// obtenemos la funcion para navegar entre paginas
	const navigate = useNavigate();

	// funcion que se ejecuta cuando el usuario intenta iniciar sesion
	const handleLogin = async () => {
		// 1) limpiar error anterior (si lo hubiera)
		setError('');

		// 2) validacion simple en el frontend: ambos campos obligatorios
		if (!username || !password) {
			// si falta usuario o contrasena, mostramos un mensaje y salimos
			setError('Por favor, completa todos los campos para continuar.');
			return; // no seguir
		}

		try {
			// 3) enviamos los datos al servidor via POST
			//    la url 'http://localhost:3001/login'
			const response = await axios.post('http://localhost:3001/login', {
				username,
				password,
			});

			// 4) revisamos la respuesta del servidor
			if (response.data.ok) {
				// si el servidor dice que todo esta bien, navegamos a la pantalla de clientes
				navigate('/Clientes');
			} else {
				// si el servidor dice que no esta bien, mostramos mensaje de credenciales incorrectas
				setError('Usuario o contraseña incorrectos.');
			}
		} catch (err) {
			// 5) si hubo un error de red o servidor, lo mostramos por consola y damos un mensaje al usuario
			console.error(err);
			setError('No se pudo conectar con el servidor. Inténtalo más tarde.');
		}
	};

	// ui
	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: '100vh', background: '#f5f7fb' }}
		>
			{/* tarjeta centrada que contiene el formulario */}
			<div className="card border-0 shadow-lg rounded-4" style={{ width: '100%', maxWidth: '420px' }}>
				<div className="card-body p-5">

					{/* titulo */}
					<h2 className="text-center fw-bold mb-4">Inicio de Sesión</h2>

					{/* si hay un mensaje de error, se muestra esta alerta */}
					{error && (
							<div className="alert alert-danger rounded-3 text-center py-2">
								{error}
							</div>
						)
					}

					<div className="d-flex flex-column gap-3">
						{/* campo de usuario */}
						<div>
							<label className="form-label fw-semibold">Usuario</label>
							<input
								type="text"
								className="form-control form-control-lg rounded-3"
								placeholder="Introduce tu usuario"
								value={username} 
								onChange={(e) => setUsername(e.target.value)} // al escribir, actualizamos 'username'
							/>
						</div>

						{/* campo de contrasena */}
						<div>
							<label className="form-label fw-semibold">Contraseña</label>
							<input
								type="password"
								className="form-control form-control-lg rounded-3"
								placeholder="Introduce tu contraseña"
								value={password} 
								onChange={(e) => setPassword(e.target.value)} // al escribir, actualizamos 'password'
								onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // si presiona enter, intentamos iniciar sesion
							/>
						</div>

						{/* boton que llama a handleLogin cuando se clickea */}
						<button
							className="btn btn-primary btn-lg rounded-pill mt-3 fw-semibold"
							onClick={handleLogin}
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
