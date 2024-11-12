// I. Importaciones necesarias
import React, { useContext } from "react"; // Importaciones de React y hooks
import { Swiper, SwiperSlide } from 'swiper/react'; // Importación de componentes de Swiper
import 'swiper/css'; // Importación de estilos de Swiper
import 'swiper/css/navigation'; // Importación de estilos de navegación de Swiper
import { Navigation } from 'swiper/modules'; // Importación del módulo de navegación de Swiper
import ProductItem from "../../../Components/ProductItem/ProductItem"; // Componente ProductItem

import { MyContext } from '../../../MyContext/MyContext'; // Contexto de la aplicación

// II. Definición del componente RelatedProducts
const RelatedProducts = (props) => {
    const context = useContext(MyContext); // Uso del contexto personalizado

    // III. Renderizado del componente
    return (
        <>
            <div className="d-flex align-items-center mt-3">
                <div className="info w-75">
                    <h3 className="mb-0 hd">{props.title}</h3> {/* Título de la sección */}
                </div>
            </div>

            <div className="product_row relatedProducts w-100 mt-0">
                <Swiper
                    slidesPerView={5}
                    spaceBetween={0}
                    navigation={true}
                    slidesPerGroup={context.windowWidth > 992 ? 3 : 1}
                    modules={[Navigation]}
                    className="mySwiper"
                    breakpoints={{
                        350: {
                            slidesPerView: 1,
                            spaceBetween: 5,
                        },
                        400: {
                            slidesPerView: 2,
                            spaceBetween: 5,
                        },
                        600: {
                            slidesPerView: 3,
                            spaceBetween: 5,
                        },
                        750: {
                            slidesPerView: 5,
                            spaceBetween: 5,
                        }
                    }}
                >
                    {props?.data?.length !== 0 && props?.data?.map((item, index) => (
                        <SwiperSlide key={index}>
                            <ProductItem item={item} itemView={props.itemView} /> {/* Componente ProductItem */}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}

export default RelatedProducts; //IV. Exportación del componente
