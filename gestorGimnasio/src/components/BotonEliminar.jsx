function BotonEliminar ({texto, onClick}){

    return(
        <div>
            <button 
                type="button"
                className="btn btn-outline-danger"
                onClick={onClick}
            >
                {texto}
            </button>
        </div>
    );
}

export default BotonEliminar;