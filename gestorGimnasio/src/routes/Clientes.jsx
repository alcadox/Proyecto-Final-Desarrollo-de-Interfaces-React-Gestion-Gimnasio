import React, { useEffect, useState } from "react"
import axios from "axios"
import Menu from "../components/Menu"
import CardError from "../components/CardError"
import CardExito from "../components/CardExito"
import BotonEliminar from "../components/BotonEliminar"
import BotonEditar from "../components/BotonEditar"
import { useNavigate } from "react-router-dom"
import "../styles/styleTable.css"

const Clientes = () => {
    const navigate = useNavigate()

    const [clientes, setClientes] = useState([])
    const [buscador, setBuscador] = useState("")
    const [error, setError] = useState("")
    const [errorSuperior, setErrorSuperior] = useState("")
    const [mensajeExitoSuperior, setMensajeExitoSuperior] = useState("")
    const [mensajeExito, setMensajeExito] = useState("")

    useEffect(() => {
        fetchClientes()
    }, [])

    const fetchClientes = async () => {
        try {
            const response = await axios.get("http://localhost:3001/clientes")
            setClientes(response.data)
        } catch (error) {
            console.error("Error al cargar clientes:", error)
        }
    }

    const formatDate = date => {
        if (!date) return "-"
        return new Date(date).toISOString().split("T")[0]
    }

    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        dni: "",
        fecha_nacimiento: "",
        telefono: "",
        email: "",
        peso: "",
        altura: "",
        objetivo: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_pago: "MENSUAL",
        trainer_id: "",
        alta: "",
    })

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const clickBotonNuevoCliente = async e => {
        setMensajeExitoSuperior("")
        setErrorSuperior("")
        e.preventDefault()

        if (!comprobacionBasicaCampos()) return

        try {
            const response = await axios.post(
                "http://localhost:3001/nuevoCliente",
                formData
            )
            setMensajeExito(response.data.message)
            fetchClientes()
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message)
            } else {
                alert("Error al conectar con el servidor")
            }
            console.log("Error al añadir cliente: ", err)
        }
    }

    const comprobacionBasicaCampos = () => {
        setError("")
        setMensajeExito("")

        let nuevosCamposVacios = []

        for (let clave in formData) {
            switch (clave) {
                case "dni":
                /*const dni = formData[clave].trim().toUpperCase()
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

                    break*/
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

    const manejarBuscar = e => {
        setBuscador(e.target.value)
    }

    const clientesFiltrados = clientes.filter(cliente => {
        const texto = buscador.toLowerCase()

        return (
            cliente.nombre?.toLowerCase().includes(texto) ||
            cliente.apellidos?.toLowerCase().includes(texto) ||
            cliente.dni?.toLowerCase().includes(texto)
        )
    })

    const manejarClickBorrado = async idClienteBorrar => {
        try {
            const response = await axios.delete(
                "http://localhost:3001/eliminarCliente",
                {
                    data: { id: idClienteBorrar },
                }
            )

            setMensajeExitoSuperior(response.data.message)
            setErrorSuperior("")
            fetchClientes()
        } catch (err) {
            if (err.response && err.response.data) {
                setErrorSuperior(err.response.data.message)
            } else {
                alert("Error al conectar con el servidor")
            }
            console.log("Error al eliminar cliente: ", err)
            setMensajeExitoSuperior("")
        }
    }

    const manejarClickEditar = idCliente => {
        navigate(`/Cliente/${idCliente}`)
    }

    // Estilo común para inputs
    const inputStyle = {
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        color: "white",
    }
    // Estilo para filas (tarjeta) en la tabla
    const rowCardStyle = {
        display: "grid",
        gridTemplateColumns: "60px 1fr 1fr 120px 120px 60px 160px",
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
                    {/* Panel izquierdo - Alta cliente */}
                    <div className="col-12 col-lg-4 col-xxl-3 ">
                        <div
                            className="card shadow-lg border-0 rounded-4 h-100"
                            style={{ backgroundColor: "#1e293b" }}
                        >
                            <div className="card-body p-4 text-white">
                                <h5 className="fw-bold mb-3 text-info">
                                    Añadir nuevo cliente
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

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Peso (kg)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="peso"
                                            value={formData.peso}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Altura (cm)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="altura"
                                            value={formData.altura}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">
                                            Objetivo
                                        </label>
                                        <textarea
                                            className="form-control rounded-3 border-0 shadow-none"
                                            rows="2"
                                            name="objetivo"
                                            value={formData.objetivo}
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

                                    <div className="col-6">
                                        <label className="form-label small text-secondary fw-bold">
                                            Entrenador ID
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 border-0 shadow-none"
                                            name="trainer_id"
                                            value={formData.trainer_id}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                            style={inputStyle}
                                        />
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
                                            onClick={clickBotonNuevoCliente}
                                        >
                                            Añadir cliente
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Panel derecho - Tabla */}
                    <div className="col-12 col-lg-8 col-xxl-9">
                        <div
                            className="card shadow-lg border-0 rounded-4 h-100"
                            style={{ backgroundColor: "#1e293b" }}
                        >
                            <div className="card-body p-4 text-white">
                                <h2 className="fw-bold mb-3 text-info">
                                    Clientes
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
                                        maxHeight: "670px",
                                        overflowY: "auto",
                                    }}
                                >
                                    <table className="table table-hover align-middle">
                                        <thead className="sticky-top">
                                            <tr>
                                                <th className="text-secondary">
                                                    ID
                                                </th>
                                                <th className="text-secondary">
                                                    Nombre
                                                </th>
                                                <th className="text-secondary">
                                                    Apellidos
                                                </th>
                                                <th className="text-secondary">
                                                    Fecha inicio
                                                </th>
                                                <th className="text-secondary">
                                                    Fecha fin
                                                </th>
                                                <th className="text-secondary">
                                                    Alta
                                                </th>
                                                <th className="text-secondary">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientesFiltrados.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="7"
                                                        className="text-center py-4 text-white-50"
                                                    >
                                                        No hay clientes
                                                    </td>
                                                </tr>
                                            ) : (
                                                clientesFiltrados.map(
                                                    cliente => (
                                                        <tr
                                                            key={cliente.id}
                                                            style={{
                                                                background:
                                                                    "transparent",
                                                            }}
                                                        >
                                                            <td
                                                                colSpan="7"
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
                                                                            cliente.id
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className="text-white"
                                                                        style={{
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {
                                                                            cliente.nombre
                                                                        }
                                                                    </div>
                                                                    <div className="text-white">
                                                                        {
                                                                            cliente.apellidos
                                                                        }
                                                                    </div>
                                                                    <div className="text-white-50">
                                                                        {formatDate(
                                                                            cliente.fecha_inicio
                                                                        )}
                                                                    </div>
                                                                    <div className="text-white-50">
                                                                        {formatDate(
                                                                            cliente.fecha_fin
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
                                                                                cliente.alta
                                                                            }
                                                                            readOnly
                                                                            style={{
                                                                                accentColor:
                                                                                    "#0ea5e9",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="d-flex gap-2 justify-content-end">
                                                                        <BotonEliminar
                                                                            texto={
                                                                                "Eliminar"
                                                                            }
                                                                            onClick={() =>
                                                                                manejarClickBorrado(
                                                                                    cliente.id
                                                                                )
                                                                            }
                                                                        />
                                                                        <BotonEditar
                                                                            texto={
                                                                                "Editar"
                                                                            }
                                                                            onClick={() =>
                                                                                manejarClickEditar(
                                                                                    cliente.id
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

export default Clientes
