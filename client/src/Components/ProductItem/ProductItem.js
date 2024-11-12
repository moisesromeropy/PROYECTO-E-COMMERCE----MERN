// I. Importaciones necesarias
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosImages } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import { MyContext } from '../../MyContext/MyContext';
import { fetchDataFromApi, postData } from '../../utils/api';

// II. Componente ProductItem
const ProductItem = (props) => {
    // II.a. Definición de estados
    const [isHovered, setIsHovered] = useState(false); // Estado para manejar el hover del producto
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga del producto
    const [isAddedToMyList, setIsAddedToMyList] = useState(false); // Estado para manejar si el producto está en la lista de favoritos

    // II.b. Uso del contexto y referencias
    const context = useContext(MyContext); // Uso del contexto para acceder a funciones y estados globales
    const sliderRef = useRef(); // Referencia para el slider de imágenes del producto

    // II.c. Configuración del slider
    var settings = {
        dots: true,
        infinite: true,
        loop: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: 100
    };

    // III. Función para ver detalles del producto
    const viewProductDetails = (id) => {
        context.openProductDetailsModal(id, true);
    };

    // IV. Función para manejar el evento de mouse enter
    const handleMouseEnter = (id) => {
        if (!isLoading) {
            setIsHovered(true); // Activa el estado de hover
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPlay(); // Inicia el autoplay del slider
                }
            }, 20);
        }

        const user = JSON.parse(localStorage.getItem("user"));
        // Verifica si el producto está en la lista de favoritos del usuario
        fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.id}`).then((res) => {
            if (res.length !== 0) {
                setIsAddedToMyList(true);
            }
        }).catch((error) => {
            console.error("Error fetching my list:", error);
        });
    };

    // V. Función para manejar el evento de mouse leave
    const handleMouseLeave = () => {
        if (!isLoading) {
            setIsHovered(false); // Desactiva el estado de hover
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPause(); // Detiene el autoplay del slider
                }
            }, 20);
        }
    };

    // VI. Efecto para manejar la carga del producto
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false); // Desactiva el estado de carga después de 500ms
        }, 500);
    }, []);

    // VII. Función para añadir el producto a mi lista
    const addToMyList = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const data = {
                productTitle: props?.item?.name,
                image: props.item?.images[0],
                rating: props?.item?.rating,
                price: props?.item?.price,
                productId: id,
                userId: user?.userId
            };
            // Añade el producto a la lista de favoritos del usuario
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "El producto ha sido agregado a mi lista"
                    });

                    fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.id}`).then((res) => {
                        if (res.length !== 0) {
                            setIsAddedToMyList(true);
                        }
                    }).catch((error) => {
                        console.error("Error fetching my list:", error);
                    });

                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            }).catch((error) => {
                console.error("Error adding to my list:", error);
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Por favor inicia sesión para continuar"
            });
        }
    };

    // VIII. Renderizado del componente
    if (!props.item || !props.item.images) {
        return <div>Error: Missing product data</div>;
    }

    return (
        <>
            <div className={`productItem ${props.itemView}`}
                onMouseEnter={() => handleMouseEnter(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}
                onMouseLeave={handleMouseLeave}
            >
                <div className="img_rapper">
                    <Link to={`/product/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id}`}>
                        <div className='productItemSliderWrapper'>
                            {isHovered && (
                                <Slider {...settings} ref={sliderRef} className='productItemSlider'>
                                    {props.item?.images?.map((image, index) => (
                                        <div className='slick-slide' key={index}>
                                            <img src={image} className="w-100" alt={`Product image ${index}`} />
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </div>
                        {isLoading ? (
                            <Skeleton variant="rectangular" width={300} height={400}>
                                <IoIosImages />
                            </Skeleton>
                        ) : (
                            <img src={props.item?.images[0]} className="w-100" alt="Product" />
                        )}
                    </Link>
                    <span className="badge badge-primary">{props.item?.discount}%</span>
                    <div className="actions">
                        <Button onClick={() => viewProductDetails(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}>
                            <TfiFullscreen />
                        </Button>
                        <Button className={isAddedToMyList ? 'active' : ''} onClick={() => addToMyList(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}>
                            {isAddedToMyList ? <FaHeart style={{ fontSize: '20px' }} /> : <IoMdHeartEmpty style={{ fontSize: '20px' }} />}
                        </Button>
                    </div>
                </div>
                <div className="info">
                    <Link to={`/product/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id}`}>
                        <h4>{`${props?.item?.name?.substr(0, 30)}...`}</h4>
                    </Link>
                    {props?.item?.countInStock >= 1 ? (
                        <span className="text-success d-block">En Stock</span>
                    ) : (
                        <span className="text-danger d-block">No hay stock disponible</span>
                    )}
                    <Rating className="mt-2 mb-2" name="read-only" value={props?.item?.rating} readOnly size="small" precision={0.5} />
                    <div className="d-flex">
                        <span className="oldPrice">Gs {props?.item?.oldPrice}</span>
                        <span className="netPrice text-danger ml-2">Gs {props?.item?.price}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
    //IX. Exportación del componente
export default ProductItem;
