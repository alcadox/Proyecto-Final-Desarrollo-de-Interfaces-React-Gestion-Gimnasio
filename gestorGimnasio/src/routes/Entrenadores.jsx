import React, { useEffect, useState } from "react"
import axios from "axios"
import Menu from "../components/Menu"
import CardError from "../components/CardError"
import CardExito from "../components/CardExito"
import BotonEliminar from "../components/BotonEliminar"
import BotonEditar from "../components/BotonEditar"
import { useNavigate } from "react-router-dom"

const Entrenadores = () => {
    // estado para guardar la lista de entrenadores
    const [entrenadores, setEntrenadores] = useState([])

    // cargamos los entrenadores al entrar en la pagina
    useEffect(() => {
        traerEntrenadores()
    }, [])

    // peticion al backend para traer todos los entrenadores
    const traerEntrenadores = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/entrenadores"
            )
            setEntrenadores(response.data)
        } catch (error) {
            console.error("Error al cargar Entrenadores:", error)
        }
    }

    // funcion para que la fecha no de problemas al mostrarla
    const formatDate = date => {
        if (!date) return "-"
        return new Date(date).toISOString().split("T")[0]
    }

    const navigate = useNavigate()

    // estados para guardar lo que buscamos y diferentes mensajes
    const [buscador, setBuscador] = useState("")
    const [error, setError] = useState("")
    const [mensajeExito, setMensajeExito] = useState("")
    const [errorSuperior, setErrorSuperior] = useState("")
    const [mensajeExitoSuperior, setMensajeExitoSuperior] = useState("")

    // estado inicial del formulario para crear entrenadores
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
        alta: "",
    })

    // actualiza el estado segun escribimos en el formulario
    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // funcion que se ejecuta al enviar el formulario para crear un entrenador
    const clickBotonNuevoEntrenador = async e => {
        setMensajeExitoSuperior("")
        setErrorSuperior("")
        // previene que se recargue la pagina entera
        e.preventDefault()

        if (!comprobacionBasicaCampos()) return

        try {
            const response = await axios.post(
                "http://localhost:3001/nuevoEntrenador",
                formData
            )
            setMensajeExito(response.data.message)
            traerEntrenadores() // recargamos la lista si fue bien
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message)
            } else {
                alert("Error al conectar con el servidor")
            }
            console.log("Error al añadir entrenador: ", err)
        }
    }

    // valida que los campos obligatorios esten rellenos y el dni sea correcto
    const comprobacionBasicaCampos = () => {
        setError("")
        setMensajeExito("")

        let nuevosCamposVacios = []

        for (let clave in formData) {
            switch (clave) {
                case "dni":
                    const dni = formData[clave].trim().toUpperCase()
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
                case "nombre":
                case "apellidos":
                case "fecha_nacimiento":
                case "fecha_inicio":
                    const valor = formData[clave]

                    if (typeof valor === "string" && !valor.trim()) {
                        nuevosCamposVacios.push(clave)
                    }
                    break
            }
        }

        // avisamos de que campos faltan
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

    // actualiza el estado del buscador
    const manejarBuscar = e => {
        setBuscador(e.target.value)
    }

    // funcion para eliminar un entrenador por su id
    const manejarClickBorrado = async idEntrenadorBorrar => {
        try {
            const response = await axios.delete(
                "http://localhost:3001/eliminarEntrenador",
                {
                    data: { id: idEntrenadorBorrar },
                }
            )

            setMensajeExitoSuperior(response.data.message)
            setErrorSuperior("")
            traerEntrenadores()
        } catch (err) {
            if (err.response && err.response.data) {
                setErrorSuperior(err.response.data.message)
            } else {
                alert("Error al conectar con el servidor")
            }
            console.log("Error al eliminar entrenador: ", err)
            setMensajeExitoSuperior("")
        }
    }

    // filtramos la lista segun lo que haya en el buscador
    const entrenadoresFiltrados = entrenadores.filter(entrenador => {
        const texto = buscador.toLowerCase()

        return (
            entrenador.nombre?.toLowerCase().includes(texto) ||
            entrenador.apellidos?.toLowerCase().includes(texto) ||
            entrenador.dni?.toLowerCase().includes(texto) ||
            entrenador.especialidad?.toLowerCase().includes(texto)
        )
    })

    // te manda a la vista del entrenador para editarlo
    const manejarClickEditar = idEntrenador => {
        navigate(`/Entrenador/${idEntrenador}`)
    }

    // estilo comun para inputs
    const inputStyle = {
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        color: "white",
    }
    // estilo para filas (tarjeta) en la tabla
    const rowCardStyle = {
        display: "grid",
        gridTemplateColumns: "60px 1fr 1fr 120px 120px 60px 160px 160px",
        gap: "12px",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#0b1220",
        border: "1px solid #334155",
        borderRadius: "10px",
    }

    return (
        <div
            className="min-vh-100"
            style={{
                backgroundColor: "#0f172a",
                paddingTop: "80px",
                paddingBottom: "40px",
            }}
        >
            <div className="container-fluid px-4">
                <Menu nombre={"Admin"} />
                <div className="row g-4">
                    {/* panel izquierdo - alta entrenador */}
                    <div className="col-12 col-lg-4 col-xxl-3 ">
                        <div
                            className="card shadow-lg border-0 rounded-4 h-100"
                            style={{ backgroundColor: "#1e293b" }}
                        >
                            <div className="card-body p-4 text-white">
                                <h5 className="fw-bold mb-3 text-info">
                                    Añadir nuevo entrenador
                                </h5>

                                <form className="row g-3">
                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Apellidos
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            DNI
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Fecha nacimiento
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="fecha_nacimiento"
                                            value={formData.fecha_nacimiento}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">
                                            Especialidad
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            rows="2"
                                            name="especialidad"
                                            value={formData.especialidad}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">
                                            Notas
                                        </label>
                                        <textarea
                                            className="form-control rounded-3 border-0 shadow-none"
                                            rows="2"
                                            name="notas"
                                            value={formData.notas}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                            style={inputStyle}
                                        ></textarea>
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Fecha inicio
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="fecha_inicio"
                                            value={formData.fecha_inicio}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Fecha fin
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="fecha_fin"
                                            value={formData.fecha_fin}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Tipo de pago
                                        </label>
                                        <select
                                            className="form-select rounded-3 border-0 shadow-none"
                                            name="tipo_pago"
                                            value={formData.tipo_pago}
                                            onChange={handleChange}
                                            style={inputStyle}
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

                                    <div className="col-6 d-flex align-items-center">
                                        <div className="form-check mt-4">
                                            <input
                                                className="form-check-input shadow-none"
                                                type="checkbox"
                                                name="alta"
                                                onChange={handleChange}
                                                checked
                                                style={{
                                                    cursor: "pointer",
                                                    backgroundColor:
                                                        formData.alta
                                                            ? "#0ea5e9"
                                                            : "transparent",
                                                    borderColor: "#334155",
                                                }}
                                            />
                                            <label className="form-check-label small text-white ms-2">
                                                Alta
                                            </label>
                                        </div>
                                    </div>
                                    {error && <CardError error={error} />}
                                    {mensajeExito && (
                                        <CardExito mensaje={mensajeExito} />
                                    )}
                                    <div className="col-12">
                                        <button
                                            type="button"
                                            className="btn btn-success w-100 rounded-pill py-2 fw-bold"
                                            onClick={clickBotonNuevoEntrenador}
                                        >
                                            Añadir entrenador
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* panel derecho - tabla */}
                    <div className="col-12 col-lg-8 col-xxl-9">
                        <div
                            className="card shadow-lg border-0 rounded-4 h-100"
                            style={{ backgroundColor: "#1e293b" }}
                        >
                            <div className="card-body p-4 text-white">
                                <h2 className="fw-bold mb-3 text-info">
                                    Entrenadores
                                </h2>
                                {errorSuperior && (
                                    <CardError error={errorSuperior} />
                                )}
                                {mensajeExitoSuperior && (
                                    <CardExito mensaje={mensajeExitoSuperior} />
                                )}
                                <div className="d-flex gap-3 mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-pill border-0 shadow-none"
                                        placeholder="Buscar..."
                                        onChange={manejarBuscar}
                                        value={buscador}
                                        style={inputStyle}
                                    />
                                </div>

                                <div
                                    style={{
                                        maxHeight: "520px",
                                        overflowY: "auto",
                                    }}
                                >
                                    <table
                                        className="table table-hover table-dark align-middle"
                                        style={{
                                            backgroundColor: "transparent",
                                        }}
                                    >
                                        <thead
                                            className="sticky-top"
                                            style={{
                                                backgroundColor: "#0f172a",
                                            }}
                                        >
                                            <tr>
                                                <th className="bg-dark text-secondary">
                                                    ID
                                                </th>
                                                <th className="bg-dark text-secondary">
                                                    Nombre
                                                </th>
                                                <th className="bg-dark text-secondary">
                                                    Apellidos
                                                </th>
                                                <th className="bg-dark text-secondary">
                                                    Fecha inicio
                                                </th>
                                                <th className="bg-dark text-secondary">
                                                    Fecha fin
                                                </th>
                                                <th className="bg-dark text-secondary">
                                                    Alta
                                                </th>
                                                <th className="bg-dark text-secondary">
                                                    Especialidad
                                                </th>
                                                <th className="bg-dark text-secondary">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entrenadoresFiltrados.length ===
                                            0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-4 text-white-50"
                                                    >
                                                        No hay entrenadores
                                                    </td>
                                                </tr>
                                            ) : (
                                                entrenadoresFiltrados.map(
                                                    entrenador => (
                                                        <tr
                                                            key={entrenador.id}
                                                            style={{
                                                                background:
                                                                    "transparent",
                                                            }}
                                                        >
                                                            <td
                                                                colSpan="8"
                                                                className="py-2"
                                                            >
                                                                <div
                                                                    style={
                                                                        rowCardStyle
                                                                    }
                                                                >
                                                                    <div
                                                                        className="text-white text-center"
                                                                        style={{
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {
                                                                            entrenador.id
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className="text-white"
                                                                        style={{
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {
                                                                            entrenador.nombre
                                                                        }
                                                                    </div>
                                                                    <div className="text-white">
                                                                        {
                                                                            entrenador.apellidos
                                                                        }
                                                                    </div>
                                                                    <div className="text-white-50">
                                                                        {formatDate(
                                                                            entrenador.fecha_inicio
                                                                        )}
                                                                    </div>
                                                                    <div className="text-white-50">
                                                                        {formatDate(
                                                                            entrenador.fecha_fin
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                entrenador.alta
                                                                            }
                                                                            readOnly
                                                                            style={{
                                                                                accentColor:
                                                                                    "#0ea5e9",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="text-info"
                                                                        style={{
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            entrenador.especialidad
                                                                        }
                                                                    </div>
                                                                    <div className="d-flex gap-2 justify-content-end">
                                                                        <BotonEliminar
                                                                            texto={
                                                                                "Eliminar"
                                                                            }
                                                                            onClick={() =>
                                                                                manejarClickBorrado(
                                                                                    entrenador.id
                                                                                )
                                                                            }
                                                                        />
                                                                        <BotonEditar
                                                                            texto={
                                                                                "Editar"
                                                                            }
                                                                            onClick={() =>
                                                                                manejarClickEditar(
                                                                                    entrenador.id
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Entrenadores