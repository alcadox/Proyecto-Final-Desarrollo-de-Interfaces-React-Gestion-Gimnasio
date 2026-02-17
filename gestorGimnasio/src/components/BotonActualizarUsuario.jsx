
const BotonActualizarUsuario = ({onClick, children}) =>{
    return(
        <button
            className="btn btn-info w-100 fw-bold text-dark rounded-pill py-3 shadow-lg"
            style={{ letterSpacing: '1px' }}
            onClick={onClick}
            >
            {children}
        </button>
    );
}


export default BotonActualizarUsuario;