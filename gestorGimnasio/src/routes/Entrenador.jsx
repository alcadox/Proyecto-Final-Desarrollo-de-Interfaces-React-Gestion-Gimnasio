import { useParams, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"
import CabeceraEditar from "../components/CabeceraEditar"
import CardError from "../components/CardError"
import CardExito from "../components/CardExito"
import BotonActualizarUsuario from "../components/BotonActualizarUsuario"

const Entrenador = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [entrenador, setEntrenador] = useState({})
    const [entrenadorOriginal, setEntrenadorOriginal] = useState({})
    
    // Lista de clientes asignados a este entrenador
    const [clientesAsignados, setClientesAsignados] = useState([])

    const [error, setError] = useState("")
    const [mensajeExito, setMensajeExito] = useState("")
    const [file, setFile] = useState(null)

    const formatDate = date => {
        if (!date) return "-"
        return new Date(date).toISOString().split("T")[0]
    }

    const [todosLosClientes, setTodosLosClientes] = useState([]);

    // Función para cargar clientes sin entrenador
    const fetchClientesSinEntrenador = async () => {
        try {
            const response = await axios.get("http://localhost:3001/clientes");
            // Filtramos los que no tienen trainer_id o cuyo trainer_id sea null
            const disponibles = response.data.filter(c => !c.trainer_id);
            setTodosLosClientes(disponibles);
        } catch (err) {
            console.error("Error cargando clientes disponibles", err);
        }
    };

    useEffect(() => {
        fetchClientesSinEntrenador();
    }, [clientesAsignados]); // Recargar cuando cambie la lista de asignados

    // Función para ASIGNAR un cliente al entrenador actual
    const asignarCliente = async (clienteId) => {
        try {
            await axios.put("http://localhost:3001/asignarEntrenador", { 
                clienteId, 
                trainerId: id 
            });
            setMensajeExito("Cliente asignado correctamente");
            fetchClientesAsignados(); // Recargamos la lista del entrenador
        } catch (err) {
            setError("Error al asignar el cliente.");
        }
    };

    // 1. Cargar datos del Entrenador
    useEffect(() => {
        const fetchEntrenador = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/entrenador/${id}`
                )
                if(response.data.length > 0){
                    setEntrenador(response.data[0])
                    setEntrenadorOriginal(response.data[0])
                }
            } catch (err) {
                console.error(err)
                setError("No se pudo cargar la información del entrenador.")
            }
        }
        fetchEntrenador();
    }, [id])

    // 2. Cargar Clientes Asignados
    const fetchClientesAsignados = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/entrenador/${id}/clientes`)
            setClientesAsignados(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchClientesAsignados()
    }, [id])


    // Manejo de Imagen
    const seleccionarImagen = e => {
        setFile(e.target.files[0])
    }

    const enviarImagen = async () => {
        setError("")
        setMensajeExito("")

        if (!file) {
            setError("ERROR: Para actualizar una imagen primero debes seleccionar una nueva.")
            return
        }

        const formdata = new FormData()
        formdata.append("image", file)
        formdata.append("id", id)

        try {
            
            const respuesta = await axios.post(
                "http://localhost:3001/entrenadores/foto",
                formdata,
                { headers: { "Content-Type": "multipart/form-data" } }
            )

            setEntrenador({ ...entrenador, foto: respuesta.data.path })
            setMensajeExito("Imagen actualizada correctamente")
        } catch (error) {
            console.error(error)
            alert("Error al subir imagen")
        }
        document.getElementById("fileinput").value = null
        setFile(null)
    }

    // Manejo de Inputs
    const manejarCambio = e => {
        const { name, value, type, checked } = e.target
        setEntrenador(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        }))
    }

    // Validación
    const comprobacionBasicaCampos = () => {
        setError("")
        setMensajeExito("")
        let nuevosCamposVacios = []

        for (let clave in entrenador) {
            switch (clave) {
                case "dni": {
                    const dni = entrenador[clave].trim().toUpperCase()
                    const regex = /^[0-9]{8}[A-Z]$/
                    if (!regex.test(dni)) {
                        setError("Formato de DNI inválido.")
                        return false
                    }
                    const letras = "TRWAGMYFPDXBNJZSQVHLCKE"
                    const numero = parseInt(dni.substring(0, 8), 10)
                    if (dni[8] !== letras[numero % 23]) {
                        setError("La letra del DNI no es válida.")
                        return false
                    }
                    break
                }
                case "nombre":
                case "apellidos":
                case "fecha_nacimiento":
                case "fecha_inicio": {
                    const valor = entrenador[clave]
                    if (typeof valor === "string" && !valor.trim()) {
                        nuevosCamposVacios.push(clave)
                    }
                    break
                }
            }
        }

        if (nuevosCamposVacios.length > 0) {
            setError("Rellena los campos obligatorios: " + nuevosCamposVacios.join(", "))
            return false
        }
        return true
    }

    // Actualizar Entrenador
    const clickBotonActualizarEntrenador = async e => {
        setMensajeExito("")
        setError("")
        e.preventDefault()

        if (JSON.stringify(entrenadorOriginal) === JSON.stringify(entrenador)) {
            setError("Ningún cambio detectado.")
            return
        }

        if (!comprobacionBasicaCampos()) return

        try {
            const response = await axios.put(
                `http://localhost:3001/actualizarEntrenador/${id}`,
                entrenador
            )
            setMensajeExito(response.data.message)
            setEntrenadorOriginal(entrenador)
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message)
            } else {
                alert("Error al conectar con el servidor")
            }
        }
    }

    // Desvincular Cliente
    const desvincularCliente = async (clienteId) => {
        if(!window.confirm("¿Seguro que quieres quitar a este cliente de la lista del entrenador?")) return;
        
        try {
            await axios.put("http://localhost:3001/desasignarCliente", { clienteId })
            // Recargamos la lista localmente filtrando el eliminado
            setClientesAsignados(prev => prev.filter(c => c.id !== clienteId))
            setMensajeExito("Cliente desvinculado correctamente.")
        } catch (err) {
            setError("Error al desvincular el cliente.")
        }
    }

    const editarCliente = (cliente) => {
        navigate(`/Cliente/${cliente.id}`)
    }

    return (
        <div className="min-vh-100 p-4" style={{ backgroundColor: "#0f172a" }}>
            <div className="container" style={{ maxWidth: "1100px" }}>
                
                {/* Cabecera reutilizada */}
                <CabeceraEditar
                    usuario={entrenador}
                    titulo={
                        "Editar Entrenador: " +
                        (entrenador.nombre || "") +
                        " " +
                        (entrenador.apellidos || "")
                    }
                    onClick={() => navigate("/Entrenadores")} 
                />

                {error && <CardError error={error} />}
                {mensajeExito && <CardExito mensaje={mensajeExito} />}

                <div className="row g-4">
                    {/* Columna Principal - FICHA TÉCNICA */}
                    <div className="col-lg-8">
                        <div
                            className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
                            style={{ backgroundColor: "#1e293b" }}
                        >
                            <div
                                className="card-header p-4 border-bottom border-secondary border-opacity-25"
                                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                            >
                                <h5 className="fw-bold text-info m-0">
                                    <i className="bi bi-briefcase me-2"></i>
                                    Datos Laborales
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                {/* Fechas */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="fw-bold small text-secondary mb-2 uppercase">
                                            Fecha Contratación
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg border-0 text-white shadow-none"
                                            style={{
                                                backgroundColor: "#0f172a",
                                                border: "1px solid #334155",
                                            }}
                                            value={formatDate(entrenador.fecha_inicio)}
                                            name="fecha_inicio"
                                            onChange={manejarCambio}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="fw-bold small text-secondary mb-2 uppercase">
                                            Fin de Contrato
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg border-0 text-white shadow-none"
                                            style={{
                                                backgroundColor: "#0f172a",
                                                border: "1px solid #334155",
                                            }}
                                            value={formatDate(entrenador.fecha_fin)}
                                            name="fecha_fin"
                                            onChange={manejarCambio}
                                        />
                                    </div>
                                </div>

                                {/* Widgets: Especialidad y Pago (Adaptado de Peso/Altura) */}
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="p-3 rounded-3" style={{ backgroundColor: "#0f172a" }}>
                                            <label className="fw-bold small text-info mb-1">
                                                Especialidad
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg border-0 bg-transparent text-white fw-bold p-0 shadow-none"
                                                    placeholder="Ej: Crossfit"
                                                    value={entrenador.especialidad || ""}
                                                    name="especialidad"
                                                    onChange={manejarCambio}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 rounded-3" style={{ backgroundColor: "#0f172a" }}>
                                            <label className="fw-bold small text-info mb-1">
                                                Modalidad de Cobro
                                            </label>
                                            <select
                                                className="form-select border-0 bg-transparent text-white fw-bold p-0 shadow-none cursor-pointer"
                                                value={entrenador.tipo_pago || "MENSUAL"}
                                                name="tipo_pago"
                                                onChange={manejarCambio}
                                            >
                                                <option className="bg-dark">MENSUAL</option>
                                                <option className="bg-dark">ANUAL</option>
                                                <option className="bg-dark">SEMANAL</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {/* Notas*/}
                                    <div className="col-12 mt-3">
                                        <label className="fw-bold small text-secondary mb-2">
                                            Notas / Observaciones
                                        </label>
                                        <textarea
                                            className="form-control border-0 text-white shadow-none p-3"
                                            rows="3"
                                            style={{
                                                backgroundColor: "#0f172a",
                                                border: "1px solid #334155",
                                            }}
                                            placeholder="Notas internas sobre el entrenador..."
                                            value={entrenador.notas || ""}
                                            name="notas"
                                            onChange={manejarCambio}
                                        ></textarea>
                                    </div>

                                    {/* LISTA DE CLIENTES ASIGNADOS */}
                                    <div className="col-12 mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                                            <h6 className="fw-bold text-white m-0">
                                                Clientes Asignados ({clientesAsignados.length})
                                            </h6>
                                            
                                            {/* NUEVO: Selector para añadir cliente */}
                                            <div className="d-flex gap-2">
                                                <select 
                                                    className="form-select form-select-sm bg-dark text-white border-secondary"
                                                    style={{ width: "200px" }}
                                                    onChange={(e) => e.target.value && asignarCliente(e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>+ Añadir Cliente</option>
                                                    {todosLosClientes.map(c => (
                                                        <option key={c.id} value={c.id}>{c.nombre} {c.apellidos}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        
                                        {clientesAsignados.length === 0 ? (
                                            <div className="text-white-50 small fst-italic p-3 bg-black bg-opacity-20 rounded">
                                                No tiene clientes asignados actualmente.
                                            </div>
                                        ) : (
                                            <div 
                                                className="pe-2" 
                                                style={{ maxHeight: "400px", overflowY: "auto" }}
                                            >
                                                <div className="d-flex flex-column gap-2">
                                                    {clientesAsignados.map(cliente => (
                                                        <div 
                                                            key={cliente.id} 
                                                            className="d-flex align-items-center justify-content-between p-3 rounded-3"
                                                            style={{ 
                                                                backgroundColor: "#0f172a", 
                                                                border: "1px solid #334155"
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-3">
                                                                <img 
                                                                    src={cliente.foto ? `http://localhost:3001${cliente.foto}` : "/images/img_desconocida.png"} 
                                                                    alt="Avatar"
                                                                    className="rounded-circle object-fit-cover"
                                                                    style={{ width: "40px", height: "40px", border: "2px solid #3b82f6" }}
                                                                />
                                                                <div>
                                                                    <div className="fw-bold text-white small">
                                                                        {cliente.nombre} {cliente.apellidos}
                                                                    </div>
                                                                    <div className="text-white-50" style={{ fontSize: "0.75rem" }}>
                                                                        DNI: {cliente.dni}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="d-flex gap-2">
                                                                <button 
                                                                    className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
                                                                    style={{ width: "32px", height: "32px", borderRadius: "8px" }}
                                                                    title="Editar cliente"
                                                                    onClick={() => editarCliente(cliente)}
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                                                                    style={{ width: "32px", height: "32px", borderRadius: "8px" }}
                                                                    title="Quitar cliente"
                                                                    onClick={() => desvincularCliente(cliente.id)}
                                                                >
                                                                    <i className="bi bi-trash-fill"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Lateral (Igual que Cliente) */}
                    <div className="col-lg-4">
                        <div
                            className="card border-0 shadow-lg rounded-4 text-white h-100 pt-1"
                            style={{
                                background: "linear-gradient(180deg, #1e3a8a 0%, #172554 100%)",
                            }}
                        >
                            <div className="card-body pt-0 px-4 pb-4 d-flex flex-column">
                                <div className="card-body d-flex justify-content-center">
                                    <img
                                        src={
                                            entrenador?.foto
                                                ? `http://localhost:3001${entrenador.foto}`
                                                : "/images/img_desconocida.png"
                                        }
                                        className="card-img-top"
                                        alt="Imagen entrenador"
                                        style={{ height: "150px", width: "150px", objectFit: "cover", borderRadius: "50%" }}
                                    />
                                </div>
                                <div className="card-body d-flex justify-content-center pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => document.getElementById("fileinput").click()}
                                    >
                                        Seleccionar imagen
                                    </button>
                                </div>
                                <div className="card-body d-flex justify-content-center pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-success mt-2"
                                        onClick={enviarImagen}
                                    >
                                        Actualizar imagen
                                    </button>

                                    <input
                                        type="file"
                                        id="fileinput"
                                        accept="image/*"
                                        onChange={seleccionarImagen}
                                        style={{ display: "none" }}
                                    />
                                </div>

                                <h5 className="fw-bold mb-4 text-info d-flex align-items-center pt-3">
                                    <span
                                        className="bg-info rounded-circle me-2"
                                        style={{ width: "8px", height: "8px" }}
                                    ></span>
                                    Datos Personales
                                </h5>

                                <div className="mb-4">
                                    <label className="small text-white-50 mb-2">Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white mb-2 py-2"
                                        placeholder="Nombre"
                                        value={entrenador.nombre || ""}
                                        name="nombre"
                                        onChange={manejarCambio}
                                    />
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        placeholder="Apellidos"
                                        value={entrenador.apellidos || ""}
                                        name="apellidos"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="small text-white-50 mb-2">Identificación (DNI/NIE)</label>
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        placeholder="DNI"
                                        value={entrenador.dni || ""}
                                        name="dni"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="small text-white-50 mb-2">Información de Contacto</label>
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white mb-2 py-2"
                                        placeholder="Email"
                                        value={entrenador.email || ""}
                                        name="email"
                                        onChange={manejarCambio}
                                    />
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        placeholder="Teléfono"
                                        value={entrenador.telefono || ""}
                                        name="telefono"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="small text-white-50 mb-2">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        value={formatDate(entrenador.fecha_nacimiento)}
                                        name="fecha_nacimiento"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mt-auto pt-4">
                                    <div className="p-3 rounded-4 bg-black bg-opacity-20 mb-4 border border-white border-opacity-10">
                                        <div className="form-check form-switch d-flex justify-content-between align-items-center p-0">
                                            <label className="form-check-label text-white fw-bold mb-0">
                                                Estado del Entrenador
                                            </label>
                                            <input
                                                className="form-check-input m-0 shadow-none"
                                                type="checkbox"
                                                checked={entrenador.alta === 1}
                                                style={{ width: "2.5em", height: "1.25em", cursor: "pointer" }}
                                                name="alta"
                                                onChange={manejarCambio}
                                            />
                                        </div>
                                        <div className="small text-info mt-1 fw-bold">
                                            {
                                                entrenador.alta === 1
                                                ? "ENTRENADOR ACTIVO"
                                                : "ENTRENADOR INACTIVO"
                                            }
                                        </div>
                                    </div>
                                    <BotonActualizarUsuario onClick={clickBotonActualizarEntrenador}>
                                        ACTUALIZAR ENTRENADOR
                                    </BotonActualizarUsuario>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Entrenador