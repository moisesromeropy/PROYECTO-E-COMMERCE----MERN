// I. Importaciones necesarias
import React, { useContext } from "react";
import Carousel from 'react-bootstrap/Carousel'; // Importar Carousel de react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import { Link } from "react-router-dom"; // Importar Link de react-router-dom
import { MyContext } from '../../MyContext/MyContext'; // Importar el contexto global

// II. Componente HomeCat
const HomeCat = (props) => {
    const context = useContext(MyContext); // Uso del contexto global

    // III. Renderización del componente
    return (
        <section className="homeCat pb-2">
            <div style={{marginTop: "50px"}} className="container">
                <h3 className="mb-3 hd">Categorias destacadas</h3>
                <Carousel
                    controls={context.windowWidth > 992 ? true : false} // Mostrar controles en pantallas grandes
                    indicators={false} // Ocultar indicadores
                    interval={null} // Desactivar autoplay
                    wrap={false} // Desactivar el bucle
                >
                    {
                        // IV. Mapear datos para crear diapositivas
props.catData?.length > 0 && props.catData.map((cat, index) => {
    // Verificar que cat.images es un array y tiene al menos un elemento
    const hasImage = Array.isArray(cat.images) && cat.images.length > 0;

    return (
        <Carousel.Item key={index}>
    <Link to={`/products/category/${cat._id}`}>
        <div
            className="item text-center cursor"
            style={{
                borderRadius: "10px",
                background: "#6d4aae",
                height: "50px",
                display: "flex",          // Habilitar flexbox
                alignItems: "center",     // Centrar verticalmente
                justifyContent: "center"  // Centrar horizontalmente
            }}
        >
            <h6
    style={{
        margin: 0,                   // Eliminar margen por defecto
        color: "#fff",               // Color blanco para el texto
        textTransform: "capitalize",  // Convertir texto a mayúsculas
        fontWeight: "bold",          // Hacer texto en negrita
        fontSize: "16px",            // Ajustar tamaño de fuente si es necesario
        display: "flex",             // Habilitar flexbox para centrar texto
        alignItems: "center",        // Centrar verticalmente
        justifyContent: "center"     // Centrar horizontalmente
    }}
>
    {cat.name}
</h6>
        </div>
    </Link>
</Carousel.Item>
    );
})
                    }
                </Carousel>
            </div>
        </section>
    )
}

// V. Exportación del componente
export default HomeCat;
