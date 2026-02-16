function BotonEditar ({texto, onClick}){

    return(
        <div>
            <button 
                type="button"
                className="btn btn-outline-warning"
                onClick={onClick}
            >
                {texto}
            </button>
        </div>
    );
}

export default BotonEditar;