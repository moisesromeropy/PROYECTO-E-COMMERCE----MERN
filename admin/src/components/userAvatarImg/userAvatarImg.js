// I. Importaciones necesarias
// (No hay importaciones necesarias para este componente)

// II. Definición del componente UserAvatarImgComponent
const UserAvatarImgComponent = (props) => {
    // III. Renderizado del componente
    return (
        <div className={`userImg ${props.lg === true && 'lg'}`}>
            <span className="rounded-circle">
                {/* IV. Imagen del avatar del usuario */}
                <img src={props.img} alt="User Avatar" />
            </span>
        </div>
    );
}

// V. Exportación del componente
export default UserAvatarImgComponent;
