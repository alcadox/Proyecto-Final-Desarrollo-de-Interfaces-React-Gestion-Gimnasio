
const CardUsuarioAsignado = ({usuario, titulo, onChange, name, trainerId}) => {
    return(
        <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px dashed #334155' }}>
            <h6 className="fw-bold text-white mb-3 small text-uppercase" style={{ letterSpacing: '1px' }}>{titulo}</h6>
            <div className="row g-2">
                <div className="col-md-4">
                    <label className="fw-bold small text-secondary mb-2">ID</label>
                    <input
                        type="text"
                        className="form-control bg-transparent text-white border-secondary"
                        style={{ borderColor: '#475569' }}
                        value={trainerId || ""}
                        name={name}
                        onChange={onChange}
                    />
                </div>
                <div className="col-md-4">
                    <label className="fw-bold small text-secondary mb-2">Nombre</label>
                    <input
                        type="text"
                        className="form-control bg-transparent text-white border-secondary"
                        placeholder="Nombre"
                        style={{ borderColor: '#475569' }}
                        value={usuario.nombre}
                    />
                </div>
                <div className="col-md-4">
                    <label className="fw-bold small text-secondary mb-2">Apellidos</label>
                    <input
                        type="text"
                        className="form-control bg-transparent text-white border-secondary"
                        placeholder="Apellidos"
                        style={{ borderColor: '#475569' }}
                        value={usuario.apellidos}
                    />
                </div>
                <div className="col-md-4">
                    <label className="fw-bold small text-secondary mb-2">Telefono</label>
                    
                    <input
                        type="text"
                        className="form-control bg-transparent text-white border-secondary"
                        placeholder="Teléfono"
                            style={{ borderColor: '#475569' }}
                        value={usuario.telefono}
                    />
                </div>
            </div>
        </div>
    );
}

export default CardUsuarioAsignado;