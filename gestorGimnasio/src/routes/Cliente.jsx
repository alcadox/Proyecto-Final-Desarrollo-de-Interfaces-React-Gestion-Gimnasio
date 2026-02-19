import { useParams } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import CabeceraEditar from "../components/CabeceraEditar"
import CardError from "../components/CardError"
import CardExito from "../components/CardExito"
import BotonActualizarUsuario from "../components/BotonActualizarUsuario"
import CardInformacion from "../components/CardInformacion"

const Cliente = () => {
    const { id } = useParams()

    const [cliente, setCliente] = useState({})
    const [clienteOriginal, setClienteOriginal] = useState({})
    const [entrenador, setEntrenador] = useState(null)

    // error: guarda mensajes de error para mostrarlos en la pagina
    // seterror: funcion que actualiza 'error'
    const [error, setError] = useState("")

    const [mensajeInfo, setMensajeInfo] = useState("")
    const [mensajeInfoImagen, setMensajeInfoImagen] = useState("")

    // mensajeexito: nombre de la variable que guarda el mensaje de exito
    // setmensajeexito: nombre de la funcion que actualiza la variable 'mensajeexito'
    const [mensajeExito, setMensajeExito] = useState("")

    const navigate = useNavigate()

    // array con todos los archivos seleccionados, en nuestro caso solo uno, el primero
    const seleccionarImagen = e => {
        // para mostrar las propiedades de la imagen seleccionada
        // console.log(e.target.file[0])
        // para colocarlo en el estado de mi componente
        setFile(e.target.files[0])
    }

    const [file, setFile] = useState(null)

    const formatDate = date => {
        if (!date) return "-"
        return new Date(date).toISOString().split("T")[0]
    }

    // cargamos los datos del cliente al entrar en la vista
    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/cliente/${id}`
                )
                console.log(response.data)
                setCliente(response.data[0])
                setClienteOriginal(response.data[0])
            } catch (err) {
                console.error(err)
            }
        }

        fetchCliente()
    }, [id])

    // si el cliente tiene un entrenador asignado, buscamos sus datos
    useEffect(() => {
        const consultarEntrenador = async () => {
            if (cliente.trainer_id == null) {
                setEntrenador(null)
                return
            }

            try {
                const response = await axios.get(
                    `http://localhost:3001/entrenador/${cliente.trainer_id}`
                )

                setEntrenador(
                    response.data.length > 0 ? response.data[0] : null
                )
            } catch {
                setEntrenador(null)
            }
        }
        consultarEntrenador()
    }, [cliente.trainer_id])

    // funcion para subir y actualizar la foto del cliente
    const enviarImagen = async () => {
        setError("")
        setMensajeExito("")
        setMensajeInfoImagen("")

        if (!file) {
            setMensajeInfoImagen(
                "Para actualizar una imagen primero debes seleccionar una nueva."
            )
            return
        }

        const formdata = new FormData()

        formdata.append("image", file) // imagen
        formdata.append("id", id) // id del cliente

        try {
            const respuesta = await axios.post(
                "http://localhost:3001/clientes/foto",
                formdata,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            // actualizamos cliente para que se vea la nueva imagen
            setCliente({
                ...cliente,
                foto: respuesta.data.path,
            })
        } catch (error) {
            console.error(error)
            alert("Error al subir imagen")
        }

        document.getElementById("fileinput").value = null
        setFile(null)
    }

    // actualiza el estado del cliente segun escribimos en los inputs
    const manejarCambio = e => {
        const { name, value, type, checked } = e.target

        setCliente(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        }))

        if (name == "trainer_id") {
            setMensajeInfo(
                "Cambios de la asignación del entrenador sin guardar."
            )
        }
    }

    // funcion para guardar los cambios del cliente en la base de datos
    const clickBotonActualizarcliente = async e => {
        setMensajeExito("")
        setError("")
        // previene que se recargue la pagina
        e.preventDefault()

        if (JSON.stringify(clienteOriginal) === JSON.stringify(cliente)) {
            setError("Ningún cambio detectado.")
            return
        }

        // comprobamos que los campos obligatorios no esten vacios
        if (!comprobacionBasicaCampos()) return

        try {
            const response = await axios.put(
                `http://localhost:3001/actualizarCliente/${id}`,
                cliente
            )
            // si todo ok
            setMensajeExito(response.data.message)
            setClienteOriginal(cliente)
            setMensajeInfo("")
        } catch (err) {
            if (err.response && err.response.data) {
                // si el servidor responde con un error, mostramos el mensaje que nos envio
                setError(err.response.data.message)
            } else {
                // cualquier otro error de conexion
                alert("Error al conectar con el servidor")
            }
            console.log("Error al actualizar el cliente: ", err)
        }
    }

    const comprobacionBasicaCampos = () => {
        setError("")
        setMensajeExito("")

        // lista para guardar los campos vacios para posteriormente mostrarlos en un mensaje de error
        let nuevosCamposVacios = []

        // recorre el diccionario cliente y si la clave/campo es obligatorio
        // entra en el switch y anade el campo vacio a la lista
        for (let clave in cliente) {
            switch (clave) {
                case "dni": {
                    const dni = cliente[clave].trim().toUpperCase()
                    const regex = /^[0-9]{8}[A-Z]$/

                    if (!regex.test(dni)) {
                        setError("Formato de DNI inválido.")
                        return false
                    }

                    const letras = "TRWAGMYFPDXBNJZSQVHLCKE"
                    const numero = parseInt(dni.substring(0, 8), 10)
                    const letraCorrecta = letras[numero % 23]

                    if (dni[8] !== letraCorrecta) {
                        setError("La letra del DNI no es válida.")
                        return false
                    }

                    break
                }

                case "nombre":
                case "apellidos":
                case "fecha_nacimiento":
                case "fecha_inicio": {
                    const valor = cliente[clave]

                    if (typeof valor === "string" && !valor.trim()) {
                        nuevosCamposVacios.push(clave)
                    }

                    break
                }
            }
        }

        if (nuevosCamposVacios.length > 0) {
            setError(
                "Rellena los campos obligatorios: " +
                    nuevosCamposVacios.join(", ")
            )
            return false
        } else {
            return true
        }
    }

    return (
        <div className="min-vh-100 p-4" style={{ backgroundColor: "#0f172a" }}>
            {" "}
            {/* fondo azul oxford mas profundo */}
            <div className="container" style={{ maxWidth: "1100px" }}>
                {/* cabecera flotante con efecto */}
                <CabeceraEditar
                    usuario={cliente}
                    titulo={
                        "Editar Cliente: " +
                        cliente.nombre +
                        " " +
                        cliente.apellidos
                    }
                    onClick={() => navigate("/Clientes")}
                />
                {mensajeInfoImagen && (
                    <CardInformacion mensaje={mensajeInfoImagen} />
                )}
                <div className="row g-4">
                    {/* columna principal - ficha tecnica (ajustada con contraste alto) */}
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
                                    <i className="bi bi-clipboard-data me-2"></i>
                                    Ficha Técnica de la Cuota
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                {/* grid de fechas con inputs oscuros de alto contraste */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="fw-bold small text-secondary mb-2 uppercase">
                                            Fecha Inicio
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg border-0 text-white shadow-none"
                                            style={{
                                                backgroundColor: "#0f172a",
                                                border: "1px solid #334155",
                                            }}
                                            value={formatDate(
                                                cliente.fecha_inicio
                                            )}
                                            name="fecha_inicio"
                                            onChange={manejarCambio}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="fw-bold small text-secondary mb-2 uppercase">
                                            Fecha Fin
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg border-0 text-white shadow-none"
                                            style={{
                                                backgroundColor: "#0f172a",
                                                border: "1px solid #334155",
                                            }}
                                            value={formatDate(
                                                cliente.fecha_fin
                                            )}
                                            name="fecha_fin"
                                            onChange={manejarCambio}
                                        />
                                    </div>
                                </div>

                                {/* metricas y objetivo con diseno de widgets */}
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div
                                            className="p-3 rounded-3"
                                            style={{
                                                backgroundColor: "#0f172a",
                                            }}
                                        >
                                            <label className="fw-bold small text-info mb-1">
                                                Peso
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg border-0 bg-transparent text-white fw-bold p-0 shadow-none"
                                                    placeholder="00.0"
                                                    value={cliente.peso}
                                                    name="peso"
                                                    onChange={manejarCambio}
                                                />
                                                <span className="text-secondary ms-2">
                                                    kg
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div
                                            className="p-3 rounded-3"
                                            style={{
                                                backgroundColor: "#0f172a",
                                            }}
                                        >
                                            <label className="fw-bold small text-info mb-1">
                                                Altura
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg border-0 bg-transparent text-white fw-bold p-0 shadow-none"
                                                    placeholder="000"
                                                    value={cliente.altura}
                                                    name="altura"
                                                    onChange={manejarCambio}
                                                />
                                                <span className="text-secondary ms-2">
                                                    cm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div
                                            className="p-3 rounded-3"
                                            style={{
                                                backgroundColor: "#0f172a",
                                            }}
                                        >
                                            <label className="fw-bold small text-info mb-1">
                                                Plan Contratado
                                            </label>
                                            <select
                                                className="form-select border-0 bg-transparent text-white fw-bold p-0 shadow-none cursor-pointer"
                                                value={cliente.tipo_pago}
                                                name="tipo_pago"
                                                onChange={manejarCambio}
                                            >
                                                <option className="bg-dark">
                                                    MENSUAL
                                                </option>
                                                <option className="bg-dark">
                                                    ANUAL
                                                </option>
                                                <option className="bg-dark">
                                                    SEMANAL
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="fw-bold small text-secondary mb-2">
                                            Objetivo del Cliente
                                        </label>
                                        <textarea
                                            className="form-control border-0 text-white shadow-none p-3"
                                            rows="3"
                                            style={{
                                                backgroundColor: "#0f172a",
                                                border: "1px solid #334155",
                                            }}
                                            placeholder="Ej: Pérdida de grasa y aumento de masa muscular..."
                                            value={cliente.objetivo}
                                            name="objetivo"
                                            onChange={manejarCambio}
                                        ></textarea>
                                    </div>
                                    {/* --- seccion entrenador --- */}
                                    <div className="col-12 mt-4">
                                        {mensajeInfo && (
                                            <CardInformacion
                                                mensaje={mensajeInfo}
                                            />
                                        )}
                                        <div className="d-flex justify-content-between align-items-end mb-2">
                                            <label className="fw-bold small text-secondary">
                                                Entrenador Personal
                                            </label>
                                            {/* pequeno badge indicador */}
                                            {cliente.trainer_id ? (
                                                entrenador ? (
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                                                        <i className="bi bi-check-circle me-1"></i>{" "}
                                                        Asignado
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
                                                        <i className="bi bi-hourglass-split me-1"></i>{" "}
                                                        Buscando...
                                                    </span>
                                                )
                                            ) : (
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25">
                                                    <i className="bi bi-dash-circle me-1"></i>{" "}
                                                    Sin asignar
                                                </span>
                                            )}
                                        </div>

                                        {/* logica de renderizado condicional */}
                                        {entrenador ? (
                                            // opcion a: entrenador encontrado y cargado -> tarjeta pro
                                            <div
                                                className="card border-0 text-white shadow-sm overflow-hidden"
                                                style={{
                                                    backgroundColor: "#253347", // ligeramente mas claro que el fondo
                                                    transition: "all 0.3s ease",
                                                }}
                                            >
                                                <div className="card-body p-3">
                                                    <div className="row align-items-center">
                                                        {/* avatar */}
                                                        <div className="col-auto">
                                                            <img
                                                                src={
                                                                    entrenador.foto
                                                                        ? `http://localhost:3001${entrenador.foto}`
                                                                        : "/images/img_desconocida.png"
                                                                }
                                                                alt="Foto Entrenador"
                                                                className="rounded-circle border border-2 border-info"
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit:
                                                                        "cover",
                                                                }}
                                                            />
                                                        </div>
                                                        {/* info textual */}
                                                        <div className="col">
                                                            <h6 className="mb-0 fw-bold text-white">
                                                                {
                                                                    entrenador.nombre
                                                                }{" "}
                                                                {
                                                                    entrenador.apellidos
                                                                }
                                                            </h6>
                                                            <small className="text-info opacity-75 d-block mb-1">
                                                                {entrenador.especialidad ||
                                                                    "Entrenador General"}
                                                            </small>
                                                            {entrenador.email && (
                                                                <small
                                                                    className="text-white-50 d-flex align-items-center"
                                                                    style={{
                                                                        fontSize:
                                                                            "0.8rem",
                                                                    }}
                                                                >
                                                                    <i className="bi bi-envelope me-2"></i>
                                                                    {
                                                                        entrenador.email
                                                                    }
                                                                </small>
                                                            )}
                                                        </div>
                                                        {/* botones de accion */}
                                                        <div className="col-auto d-flex gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: "36px",
                                                                    height: "36px",
                                                                }}
                                                                title="Ver Perfil"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/Entrenador/${cliente.trainer_id}`
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: "36px",
                                                                    height: "36px",
                                                                }}
                                                                title="Desvincular"
                                                                onClick={() => {
                                                                    setCliente(
                                                                        prev => ({
                                                                            ...prev,
                                                                            trainer_id:
                                                                                null,
                                                                        })
                                                                    )
                                                                    setEntrenador(
                                                                        null
                                                                    )
                                                                    setMensajeInfo(
                                                                        "Cambios de la asignación del entrenador sin guardar."
                                                                    )
                                                                }}
                                                            >
                                                                <i
                                                                    className="bi bi-link-45deg"
                                                                    style={{
                                                                        fontSize:
                                                                            "1.2rem",
                                                                    }}
                                                                ></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // opcion b: no hay entrenador o id incorrecto -> input de asignacion
                                            <div
                                                className="p-4 rounded-3 text-center border border-secondary border-opacity-25 border-dashed"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(255,255,255,0.02)",
                                                }}
                                            >
                                                {cliente.trainer_id &&
                                                !entrenador ? (
                                                    // caso b1: id existe pero no devuelve datos (error)
                                                    <div className="mb-3">
                                                        <div className="text-danger mb-2">
                                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                                            No se encuentra el
                                                            entrenador (ID:{" "}
                                                            {cliente.trainer_id}
                                                            )
                                                        </div>
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={
                                                                () => setCliente(prev => ({
                                                                        ...prev,
                                                                        trainer_id:
                                                                            null,
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            Limpiar ID
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // caso b2: totalmente vacio -> input para asignar
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className="mb-3 text-white-50 small">
                                                            Introduce el ID del
                                                            entrenador para
                                                            vincularlo
                                                        </div>
                                                        <div
                                                            className="input-group"
                                                            style={{
                                                                maxWidth:
                                                                    "300px",
                                                            }}
                                                        >
                                                            <span className="input-group-text bg-transparent border-secondary text-secondary">
                                                                ID
                                                            </span>
                                                            <input
                                                                type="number"
                                                                className="form-control bg-transparent border-secondary text-white shadow-none"
                                                                placeholder="Ej: 5"
                                                                name="trainer_id"
                                                                // usamos value vacio si es null para que no salga warning de uncontrolled
                                                                value={
                                                                    cliente.trainer_id ||
                                                                    ""
                                                                }
                                                                onChange={
                                                                    manejarCambio
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* --- fin seccion entrenador --- */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* columna lateral (datos personales) - manteniendo el estilo cobalt original */}
                    <div className="col-lg-4">
                        <div
                            className="card border-0 shadow-lg rounded-4 text-white h-100 pt-1"
                            style={{
                                background:
                                    "linear-gradient(180deg, #1e3a8a 0%, #172554 100%)",
                            }}
                        >
                            <div className="card-body pt-0 px-4 pb-4 d-flex flex-column">
                                <div className="card-body d-flex justify-content-center">
                                    <img
                                        src={
                                            cliente?.foto
                                                ? `http://localhost:3001${cliente.foto}`
                                                : "/images/img_desconocida.png"
                                        }
                                        className="card-img-top "
                                        alt="Imagen cliente"
                                        style={{
                                            height: "150px",
                                            width: "150px",
                                        }}
                                    />
                                </div>
                                <div className="card-body d-flex justify-content-center pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            document
                                                .getElementById("fileinput")
                                                .click()
                                            setMensajeInfoImagen(
                                                "Imagen cargada a la espera de ser subida."
                                            )
                                        }}
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
                                    <label className="small text-white-50 mb-2">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white mb-2 py-2"
                                        placeholder="Nombre"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.1) !important",
                                        }}
                                        value={cliente.nombre}
                                        name="nombre"
                                        onChange={manejarCambio}
                                    />
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        placeholder="Apellidos"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.1) !important",
                                        }}
                                        value={cliente.apellidos}
                                        name="apellidos"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="small text-white-50 mb-2">
                                        Identificación (DNI/NIE)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        placeholder="DNI"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.1) !important",
                                        }}
                                        value={cliente.dni}
                                        name="dni"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="small text-white-50 mb-2">
                                        Información de Contacto
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white mb-2 py-2"
                                        placeholder="Email"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.1) !important",
                                        }}
                                        value={cliente.email}
                                        name="email"
                                        onChange={manejarCambio}
                                    />
                                    <input
                                        type="text"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        placeholder="Teléfono"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.1) !important",
                                        }}
                                        value={cliente.telefono}
                                        name="telefono"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="small text-white-50 mb-2">
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control bg-white bg-opacity-10 border-0 text-white py-2"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.1) !important",
                                        }}
                                        value={formatDate(
                                            cliente.fecha_nacimiento
                                        )}
                                        name="fecha_nacimiento"
                                        onChange={manejarCambio}
                                    />
                                </div>

                                <div className="mt-auto pt-4">
                                    <div className="p-3 rounded-4 bg-black bg-opacity-20 mb-4 border border-white border-opacity-10">
                                        <div className="form-check form-switch d-flex justify-content-between align-items-center p-0">
                                            <label className="form-check-label text-white fw-bold mb-0">
                                                Estado del Socio
                                            </label>
                                            <input
                                                className="form-check-input m-0 shadow-none"
                                                type="checkbox"
                                                checked={cliente.alta === 1}
                                                style={{
                                                    width: "2.5em",
                                                    height: "1.25em",
                                                    cursor: "pointer",
                                                }}
                                                name="alta"
                                                onChange={manejarCambio}
                                            />
                                        </div>
                                        <div className="small text-info mt-1 fw-bold">
                                            {cliente.alta === 1
                                                ? "CLIENTE ACTIVO"
                                                : "CLIENTE INACTIVO"}
                                        </div>
                                    </div>
                                    {error && <CardError error={error} />}
                                    {mensajeExito && (
                                        <CardExito mensaje={mensajeExito} />
                                    )}
                                    <BotonActualizarUsuario
                                        onClick={clickBotonActualizarcliente}
                                    >
                                        ACTUALIZAR CLIENTE
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

export default Cliente