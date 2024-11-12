// I. Importaciones necesarias
import { Carousel } from 'react-responsive-carousel'; // Importa el componente Carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa los estilos del carrusel
import InnerImageZoom from 'react-inner-image-zoom'; // Importa el componente de zoom de imágenes
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'; // Importa los estilos del zoom de imágenes
import { useState } from 'react'; // Importa el hook useState

// II. Componente ProductZoom
const ProductZoom = (props) => {
    // III. Definición de estados
    const [slideIndex, setSlideIndex] = useState(0); // Estado para controlar el índice de la diapositiva

    // IV. Función para cambiar la diapositiva
    const goto = (index) => {
        setSlideIndex(index);
    };

    // V. Renderización del componente
    return (
        <div className="productZoom">
            <div className='productZoom productZoomBig position-relative mb-3'>
                <div className='badge badge-primary'>{props?.discount}%</div>
                <Carousel 
                    selectedItem={slideIndex}
                    onChange={(index) => setSlideIndex(index)}
                    showArrows={true}
                    showThumbs={false}
                    infiniteLoop={true}
                    showStatus={false}
                    showIndicators={false}
                >
                    {
                        // VI. Mapear las imágenes para el carrusel principal
                        props?.images?.map((img, index) => {
                            return (
                                <div key={index} className='item'>
                                    <InnerImageZoom
                                        zoomType="hover" 
                                        zoomScale={1}
                                        src={img} 
                                    />
                                </div>
                            );
                        })
                    }
                </Carousel>
            </div>

            <div className="thumbnail-carousel">
                <Carousel
                    selectedItem={slideIndex}
                    onChange={(index) => setSlideIndex(index)}
                    showArrows={true}
                    showThumbs={false}
                    infiniteLoop={false}
                    showStatus={false}
                    showIndicators={false}
                    centerMode={true}
                    centerSlidePercentage={20}
                    className="zoomSlider"
                >
                    {
                        // VII. Mapear las imágenes para el carrusel de miniaturas
                        props?.images?.map((img, index) => {
                            return (
                                <div 
                                    key={index}
                                    className={`item ${slideIndex === index ? 'item_active' : ''}`}
                                    onClick={() => goto(index)}
                                >
                                    <img src={img} className='w-100' />
                                </div>
                            );
                        })
                    }
                </Carousel>
            </div>
        </div>
    );
};

// VIII. Exportación del componente
export default ProductZoom;
