// componente reutilizable para el boton de actualizar (sirve tanto para cliente como entrenador)
const BotonActualizarUsuario = ({onClick, children}) =>{
    return(
        <button
            className="btn btn-info w-100 fw-bold text-dark rounded-pill py-3 shadow-lg"
            style={{ letterSpacing: '1px' }}
            onClick={onClick}
            >
            {/* children es el texto que le pasemos entre las etiquetas del componente */}
            {children}
        </button>
    );
}

export default BotonActualizarUsuario;