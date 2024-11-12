// I. Importaciones necesarias
import React, { useContext } from "react";
import Carousel from 'react-bootstrap/Carousel'; // Importar Carousel de react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import { MyContext } from '../../MyContext/MyContext';

// II. Componente HomeBanner
const HomeBanner = (props) => {
    const context = useContext(MyContext); // Uso del contexto global

    // III. Verificar si props.data es un arreglo
    if (!Array.isArray(props.data)) {
        console.error('HomeBanner data prop no es un array');
        return null;
    }

    // IV. Renderización del componente
    return (
        <div className="container mt-3">
            <div className="homeBannerSection">
                <Carousel
                    controls={context.windowWidth > 992 ? true : false} // Mostrar controles en pantallas grandes
                    indicators={false} // Ocultar indicadores
                    interval={3500} // Intervalo de autoplay en ms
                    fade // Efecto de desvanecimiento
                >
                    {
                        // V. Mapear datos para crear diapositivas
                        props.data.length !== 0 && props.data.map((item, index) => (
                            <Carousel.Item key={index}>
                                <div className="item">
                                    <img src={item?.images[0]} className="d-block w-100" alt={`Slide ${index}`} /> {/* Imagen de la diapositiva */}
                                </div>
                            </Carousel.Item>
                        ))
                    }
                </Carousel>
            </div>
        </div>
    );
}

// VI. Exportación del componente
export default HomeBanner;
