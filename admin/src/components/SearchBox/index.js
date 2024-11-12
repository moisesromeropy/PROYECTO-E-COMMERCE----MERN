// I. Importaciones necesarias
import { IoSearch } from "react-icons/io5";

// II. Definición del componente SearchBox
const SearchBox = () => {

    // III. Renderizado del componente
    return (
        <div className="searchBox position-relative d-flex align-items-center">
            {/* IV. Icono de búsqueda */}
            <IoSearch className="mr-2"/>
            {/* V. Campo de entrada para la búsqueda */}
            <input type="text" placeholder="Buscar aquí..." />
        </div>
    );
}

// VI. Exportación del componente
export default SearchBox;
