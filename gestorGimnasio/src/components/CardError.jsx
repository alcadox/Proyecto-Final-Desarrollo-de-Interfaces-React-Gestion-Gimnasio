// componente simple para mostrar una alerta de error roja
function CardError({error}){
    return(
        <div className="alert alert-danger rounded-3 text-center py-2">
            {error}
        </div>
    )
}

export default CardError;