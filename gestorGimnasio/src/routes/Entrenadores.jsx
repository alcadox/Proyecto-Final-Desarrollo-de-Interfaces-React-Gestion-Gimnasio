import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '../components/Menu';
import CardError from '../components/CardError';
import CardExito from '../components/CardExito';
import BotonEliminar from '../components/BotonEliminar';
import BotonEditar from '../components/BotonEditar';
import { useNavigate } from "react-router-dom";


const Entrenadores = () => {
    // entrenadores: nombre de la variable que guarda los entrenadores
    // setEntrenadores: nombre de la funcion que añade entrenadores a la variable
    const [entrenadores, setEntrenadores] = useState([]);

    // se ejecuta cada vez que se recarga la pagina o se entra a la pagina /entrenadores
    useEffect(() => {
        traerEntrenadores();
    },[]);

    const traerEntrenadores = async () => {
        try {
            // solicita al backend los entrenadores
            const response = await axios.get('http://localhost:3001/entrenadores');
            //introduce los entrenadores en la variable entrenadores
            setEntrenadores(response.data);
        } catch (error) {
            console.error('Error al cargar Entrenadores:', error);
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toISOString().split('T')[0];
    };

    const navigate = useNavigate();

    // buscador: nombre de la variable que guarda el texto del buscador
    // setBuscador: nombre de la funcion que actualiza "buscador"
    const[buscador, setBuscador] = useState("");

    // error: guarda mensajes de error para mostrarlos en la pagina
    // seterror: funcion que actualiza 'error'
    const [error, setError] = useState('');

    //mensajeExito: nombre de la variable que guarda el mensaje de exito
    // setMensajeExito: nombre de la funcion que actualiza la varibale 'mensajeExito'
    const [mensajeExito, setMensajeExito] = useState('');

    // error: guarda mensajes de error para mostrarlos en la pagina
    // seterror: funcion que actualiza 'error'
    const [errorSuperior, setErrorSuperior] = useState('');

    // mensajeExito: nombre de la variable que guarda el mensaje de exito
    // setMensajeExito: nombre de la funcion que actualiza la varibale 'mensajeExito'
    const [mensajeExitoSuperior, setMensajeExitoSuperior] = useState('');

    // formData: nombre de la variable que guarda los datos del nuevo entrenador
    // setFormData: nombre de la funcion que añade los datos al diccionario
    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        dni: "",
        fecha_nacimiento: "",
        telefono: "",
        email: "",
        especialidad: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_pago: "MENSUAL",
        notas: "",
        alta: ""
    });

    // funcion que añade la variable que cambie de un campo de entrenador
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(
            prev => (
                {
                    ...prev,
                    [name]: type === "checkbox" ? checked : value
                }
            )
        );
    };

    // funcion que se llama al pulsar el botón de añadir un nuevo entrenador
    const clickBotonNuevoEntrenador = async (e) => {
        setMensajeExitoSuperior("");
        setErrorSuperior("");
        //previene que se recargue la pagina
        e.preventDefault();

        // comprobamos que los campos obligatorios no esten vacios
        if (!comprobacionBasicaCampos()) return;

        try {
            const response = await axios.post('http://localhost:3001/nuevoEntrenador', formData);
            // si todo OK
            setMensajeExito(response.data.message);
            traerEntrenadores();

        } catch(err){
            if(err.response && err.response.data){
                // si el servidor responde con un error, mostramos el mensaje que nos envió
                setError(err.response.data.message);
            } else {
                // cualquier otro error de conexión
                alert("Error al conectar con el servidor");
            }
            console.log("Error al añadir entrenador: ", err);
        }
    };

    const comprobacionBasicaCampos = () => {
        setError("");
        setMensajeExito("");

        // lista para guardar los campos vacios para posteriormente mostrarlos en un mensaje de error
        let nuevosCamposVacios = [];
        
        // recorre el diccionario formData y si la clave/campo es obligatorio
        // entra en el switch y añade el campo vacio a la lista
        for (let clave in formData) {

            switch (clave) {
                case "dni":
                    const dni = formData[clave].trim().toUpperCase();
                    const regex = /^[0-9]{8}[A-Z]$/;

                    if (!regex.test(dni)) {
                        setError("Formato de DNI inválido.");
                        return false;
                    }

                    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
                    const numero = parseInt(dni.substring(0, 8), 10);
                    const letraCorrecta = letras[numero % 23];

                    if (dni[8] !== letraCorrecta) {
                        setError("La letra del DNI no es válida.");
                        return false;
                    }

                break;
                case "nombre":
                case "apellidos":
                case "fecha_nacimiento":
                case "fecha_inicio":
                    const valor = formData[clave];

                    if (typeof valor === "string" && !valor.trim()) {
                        nuevosCamposVacios.push(clave);
                    }
                break;
            }
        }

        if (nuevosCamposVacios.length > 0){
            setError("Rellena los campos obligatorios: " + nuevosCamposVacios.join(", "))
            return false;
        } else {
            return true;
        }
    };

    // actualiza la variable "buscador" con el texto del buscador
    const manejarBuscar = (e) => {
        setBuscador(e.target.value);
    };

    const manejarClickBorrado = async (idEntrenadorBorrar) => {
         try {
            const response = await axios.delete(
                'http://localhost:3001/eliminarEntrenador', {
                    data: {id: idEntrenadorBorrar}
                }
            );
            
            // si todo OK
            setMensajeExitoSuperior(response.data.message);
            setErrorSuperior("");
            traerEntrenadores();

        } catch(err){
            if(err.response && err.response.data){
                // si el servidor responde con un error, mostramos el mensaje que nos envió
                setErrorSuperior(err.response.data.message);
            } else {
                // cualquier otro error de conexión
                alert("Error al conectar con el servidor");
            }
            console.log("Error al eliminar entrenador: ", err);
            setMensajeExitoSuperior("");
        }
    }
    
    // aplica los filtros
    const entrenadoresFiltrados = entrenadores.filter(entrenador => {
        const texto = buscador.toLowerCase();

        return (
            entrenador.nombre?.toLowerCase().includes(texto) ||
            entrenador.apellidos?.toLowerCase().includes(texto) ||
            entrenador.dni?.toLowerCase().includes(texto) ||
            entrenador.especialidad?.toLowerCase().includes(texto)
        );
    });

    const manejarClickEditar = (idEntrenador) => {
        navigate(`/Entrenador/${idEntrenador}`);
    };

    return (
        
        <div className="container-fluid px-4" style={{ marginTop: "80px" }}>
            <Menu nombre={'Admin'}/>
            <div className="row g-4">
                {/* Panel izquierdo - Alta entrenador */}
                <div className="col-12 col-lg-4 col-xxl-3 ">
                    <div className="card shadow-sm border-0 rounded-4 h-100">
                    <div className="card-body p-4 ">
                        <h5 className="fw-bold mb-3">Añadir nuevo entrenador</h5>

                        <form className="row g-3">
                        <div className="col-6">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                name='nombre'
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-6">
                            <label className="form-label">Apellidos</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                name='apellidos'
                                value={formData.apellidos}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-6">
                            <label className="form-label">DNI</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                name='dni'
                                value={formData.dni}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-6">
                            <label className="form-label">Fecha nacimiento</label>
                            <input
                                type="date"
                                className="form-control rounded-3"
                                name='fecha_nacimiento'
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-6">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                name='telefono'
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder='Opcional'
                            />
                        </div>

                        <div className="col-6">
                            <label className="form-label">Email</label>
                            <input 
                                type="email"
                                className="form-control rounded-3"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='Opcional'
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Especialidad</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                rows="2"
                                name='especialidad'
                                value={formData.especialidad}
                                onChange={handleChange}
                                placeholder='Opcional'
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Notas</label>
                            <textarea
                                className="form-control rounded-3"
                                rows="2"
                                name='notas'
                                value={formData.notas}
                                onChange={handleChange}
                                placeholder='Opcional'
                            >
                            </textarea>
                        </div>

                        <div className="col-6">
                            <label className="form-label">Fecha inicio</label>
                            <input
                                type="date"
                                className="form-control rounded-3"
                                name='fecha_inicio'
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-6">
                            <label className="form-label">Fecha fin (opcional)</label>
                            <input
                                type="date"
                                className="form-control rounded-3"
                                name='fecha_fin'
                                value={formData.fecha_fin}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-6">
                            <label className="form-label">Tipo de pago</label>
                            <select 
                                className="form-select rounded-3"
                                name='tipo_pago'
                                value={formData.tipo_pago}
                                onChange={handleChange}
                            >
                                <option>MENSUAL</option>
                                <option>ANUAL</option>
                                <option>SEMANAL</option>
                            </select>
                        </div>

                        <div className="col-6 d-flex align-items-center">
                            <div className="form-check mt-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name='alta'
                                onChange={handleChange}
                                checked 
                            />
                            <label className="form-check-label">Alta</label>
                            </div>
                        </div>
                        {error &&(
                            <CardError error={error}/>
                        )}
                        {mensajeExito &&(
                            <CardExito mensaje={mensajeExito}/>
                        )}
                        <div className="col-12">
                            <button 
                                type="button"
                                className="btn btn-success w-100 rounded-pill py-2"
                                onClick={clickBotonNuevoEntrenador}
                            >
                            Añadir entrenador
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Panel derecho - Tabla */}
            <div className="col-12 col-lg-8 col-xxl-9">
                <div className="card shadow-sm border-0 rounded-4 h-100">
                    <div className="card-body p-4">
                        <h2 className="fw-bold mb-3">Entrenadores</h2>
                        {errorSuperior &&(
                            <CardError error={errorSuperior}/>
                        )}
                        {mensajeExitoSuperior &&(
                            <CardExito mensaje={mensajeExitoSuperior}/>
                        )}
                        <div className="d-flex gap-3 mb-3">
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Buscar..."
                            onChange={manejarBuscar}
                            value={buscador}
                        />
                        </div>

                        <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                            <table className="table table-hover align-middle">
                                <thead className="sticky-top" style={{ backgroundColor: '#111', color: '#fff' }}>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Apellidos</th>
                                        <th>Fecha inicio</th>
                                        <th>Fecha fin</th>
                                        <th>Alta</th>
                                        <th>Especialidad</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {entrenadoresFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            No hay entrenadores
                                        </td>
                                    </tr>
                                ) : (
                                    entrenadoresFiltrados.map(entrenador => (
                                    <tr key={entrenador.id}>
                                        <td>{entrenador.id}</td>
                                        <td>{entrenador.nombre}</td>
                                        <td>{entrenador.apellidos}</td>
                                        <td>{formatDate(entrenador.fecha_inicio)}</td>
                                        <td>{formatDate(entrenador.fecha_fin)}</td>
                                        <td>
                                            <input type="checkbox" checked={entrenador.alta} readOnly />
                                        </td>
                                        <td>{entrenador.especialidad}</td>
                                        <td className='d-flex gap-2'>
                                            <BotonEliminar
                                                texto={"Eliminar"}
                                                onClick={() => manejarClickBorrado(entrenador.id)}
                                            />
                                            <BotonEditar
                                                texto={"Editar"}
                                                onClick={() => manejarClickEditar(entrenador.id)}
                                            />
                                        </td>
                                    </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Entrenadores;
