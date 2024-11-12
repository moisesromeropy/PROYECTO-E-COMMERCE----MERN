// I. Importaciones necesarias
// Importamos componentes y estilos de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

// Importamos el componente y estilos de InnerImageZoom
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
// Importamos hooks de React
import { useRef, useState } from 'react';



// II. Definición del componente ProductZoom
const ProductZoom = (props) => {
    // III. Definición de los estados y referencias
    const [slideIndex, setSlideIndex] = useState(0); // Estado para el índice de la diapositiva actual
    const zoomSliderBig = useRef(); // Referencia para el slider grande
    const zoomSlider = useRef(); // Referencia para el slider de miniaturas

    // Función para cambiar la diapositiva
    const goto = (index) => {
        setSlideIndex(index); // Actualiza el índice de la diapositiva actual
        zoomSlider.current.swiper.slideTo(index); // Cambia la diapositiva en el slider de miniaturas
        zoomSliderBig.current.swiper.slideTo(index); // Cambia la diapositiva en el slider grande
    }

    // IV. Renderizado del componente
    return (
        <div className="productZoom">
            {/* V. Sección de imagen ampliada del producto */}
            <div className='productZoom productZoomBig position-relative mb-3'>
                {/* Muestra el descuento en un badge */}
                <div className='badge badge-primary'>{props?.discount}%</div>
                <Swiper
                    slidesPerView={1} // Muestra una diapositiva a la vez
                    spaceBetween={0} // No hay espacio entre diapositivas
                    navigation={false} // Desactiva la navegación
                    slidesPerGroup={1} // Mueve una diapositiva a la vez
                    modules={[Navigation]} // Incluye el módulo de navegación
                    className="zoomSliderBig"
                    ref={zoomSliderBig}
                >
                    {/* Itera sobre las imágenes proporcionadas en props */}
                    {
                        props?.images?.map((img, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className='item'>
                                        {/* Componente para el zoom de la imagen */}
                                        <InnerImageZoom
                                            zoomType="hover" // Tipo de zoom al pasar el ratón
                                            zoomScale={1} // Escala del zoom
                                            src={img} // Fuente de la imagen
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>

            {/* VI. Sección de miniaturas del producto */}
            <Swiper
                slidesPerView={5} // Muestra cinco diapositivas a la vez
                spaceBetween={0} // No hay espacio entre diapositivas
                navigation={true} // Activa la navegación
                slidesPerGroup={1} // Mueve una diapositiva a la vez
                modules={[Navigation]} // Incluye el módulo de navegación
                className="zoomSlider"
                ref={zoomSlider}
            >
                {/* Itera sobre las imágenes proporcionadas en props */}
                {
                    props?.images?.map((img, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <div className={`item ${slideIndex === index && 'item_active'}`}>
                                    {/* Imagen en miniatura, al hacer clic cambia la diapositiva */}
                                    <img src={img} className='w-100' onClick={() => goto(index)} />
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default ProductZoom;
