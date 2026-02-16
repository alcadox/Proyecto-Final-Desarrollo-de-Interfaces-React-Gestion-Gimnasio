
const CabeceraEditar = ({usuario, titulo, onClick}) =>{
    return(
        <div className="bg-white bg-opacity-10 rounded-4 p-4 mb-4 d-flex justify-content-between align-items-center shadow-sm" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-white">
                <h2 className="fw-bold m-0" style={{ letterSpacing: '-1px' }}>{titulo}</h2>
                <span className="badge rounded-pill bg-info text-dark mt-2 fw-bold">ID: {usuario.id} • PANEL GESTIÓN</span>
            </div>
            <button
                className="btn btn-outline-light rounded-circle p-0 shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px', transition: '0.3s' }}
                onClick={onClick}
            >
                <span className="fs-5">✕</span>
            </button>
        </div>
    );
}

export default CabeceraEditar;