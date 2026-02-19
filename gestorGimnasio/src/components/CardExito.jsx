// componente simple para mostrar una alerta de exito verde
function CardExito({mensaje}){
    return(
        <div className="alert alert-success text-center" role="alert">
            <div>
                {mensaje}
            </div>
        </div>
    )
}

export default CardExito;