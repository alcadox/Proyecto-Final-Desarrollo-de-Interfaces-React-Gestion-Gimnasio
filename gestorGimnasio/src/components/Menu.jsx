// importamos los estilos propios del menu
import "../styles/styleMenu.css"

function Menu({nombre}){
    return(
        <div>
           {/* barra superior fija */}
           <nav className="navbar fixed-top custom-navbar navbar-dark">
                <div className="container-fluid ">
                        <a className="navbar-brand">Bienvenido, {nombre}</a>
                        {/* boton tipo hamburguesa para abrir el panel en moviles */}
                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        {/* panel lateral offcanvas */}
                        <div className="offcanvas offcanvas-end custom-offcanvas" tabIndex="-1" id="offcanvasNavbar">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            {/* lista de enlaces del menu */}
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/Clientes">Clientes</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/Entrenadores">Entrenadores</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Menu;