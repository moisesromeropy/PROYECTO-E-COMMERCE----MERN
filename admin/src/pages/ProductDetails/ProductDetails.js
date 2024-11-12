// I. Importaciones necesarias
import React, { useEffect, useState } from "react";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
//import Button from '@mui/material/Button';
import { useNavigate, useParams } from "react-router-dom";

import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import UserAvatarImgComponent from "../../components/userAvatarImg/userAvatarImg";
import Rating from '@mui/material/Rating';
import { MdFilterVintage } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io"; // Color
import { MdPhotoSizeSelectActual } from "react-icons/md"; // Tamaño
import { IoIosPricetags } from "react-icons/io"; // Precio
import { FaShoppingCart } from "react-icons/fa"; // Carrito de compras
import { MdRateReview } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { fetchDataFromApi } from "../../utils/api";
import ProductZoom from '../../components/ProductZoom/ProductZoom';

// II. Definición del componente StyledBreadcrumb para los breadcrumbs personalizados
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

// III. Definición del componente ProductDetails
const ProductDetails = () => {
    // IV. Definición de estados
    const [productData, setProductData] = useState([]);
    const [reviewsData, setReviewsData] = useState([]);
    const { id } = useParams(); // Obtención del ID del producto desde los parámetros de la URL
    const navigate = useNavigate(); // Hook para navegación

    // V. Efecto para desplazar la ventana hacia arriba al cargar el componente
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // VI. Efecto para obtener los datos del producto y sus reseñas al cargar el componente
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res);
        });

        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setReviewsData(res);
        });

    }, [id]);

    // VII. Renderización del componente
    return (
        <>
            <div className="right-content w-100 productDetails">
                {/* VIII. Sección de encabezado con breadcrumbs */}
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Vista del Producto</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                            onClick={() => navigate('/dashboard')} // Navegación al Dashboard
                        />
                        <StyledBreadcrumb
                            label="Productos"
                            component="a"
                            href="#"
                            onClick={() => navigate('/productos')} // Navegación a la lista de productos
                        />
                        <StyledBreadcrumb
                            label="Vista del Producto"
                        />
                    </Breadcrumbs>
                </div>

                {/* IX. Sección principal del producto */}
                <div className='card productDetailsSEction'>
                    <div className='row'>
                        <div className='col-md-5'>
                            {/* X. Galería de productos */}
                            <div className="sliderWrapper pt-3 pb-3 pl-4 pr-4">
                                <h6 className="mb-4">Galería de Productos</h6>
                                <ProductZoom images={productData?.images} discount={productData?.discount} />
                            </div>
                        </div>

                        <div className='col-md-7'>
                            {/* XI. Detalles del producto */}
                            <div className="pt-3 pb-3 pl-4 pr-4">
                                <h6 className="mb-4">Detalles del Producto</h6>
                                <h4>{productData?.name}</h4>

                                <div className="productInfo mt-4">
                                    <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Marca</span>
                                        </div>
                                        <div className="col-sm-9">
                                            : <span>{productData?.brand}</span>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><BiSolidCategoryAlt /></span>
                                            <span className="name">Categoría</span>
                                        </div>
                                        <div className="col-sm-9">
                                            : <span>{productData?.catName}</span>
                                        </div>
                                    </div>

                                    {productData?.color &&
                                        <div className="row">
                                            <div className="col-sm-3 d-flex align-items-center">
                                                <span className="icon"><IoIosColorPalette /></span>
                                                <span className="name">Color</span>
                                            </div>
                                            <div className="col-sm-9">
                                                : <span>{productData?.color}</span>
                                            </div>
                                        </div>
                                    }

                                    {productData?.productRam?.length !== 0 &&
                                        <div className="row">
                                            <div className="col-sm-3 d-flex align-items-center">
                                                <span className="icon"><MdFilterVintage /></span>
                                                <span className="name">RAM</span>
                                            </div>
                                            <div className="col-sm-9">
                                                : <span>
                                                    <div className="row">
                                                        <ul className="list list-inline tags sml">
                                                            {productData?.productRam?.map((item, index) => (
                                                                <li className="list-inline-item" key={index}>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    }

                                    {productData?.size?.length !== 0 &&
                                        <div className="row">
                                            <div className="col-sm-3 d-flex align-items-center">
                                                <span className="icon"><MdPhotoSizeSelectActual /></span>
                                                <span className="name">Tamaño</span>
                                            </div>
                                            <div className="col-sm-9">
                                                : <span>
                                                    <div className="row">
                                                        <ul className="list list-inline tags sml">
                                                            {productData?.size?.map((item, index) => (
                                                                <li className="list-inline-item" key={index}>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    }

                                    {productData?.price &&
                                        <div className="row">
                                            <div className="col-sm-3 d-flex align-items-center">
                                                <span className="icon"><IoIosPricetags /></span>
                                                <span className="name">Precio</span>
                                            </div>
                                            <div className="col-sm-9">
                                                : <span>${productData?.price}</span>
                                            </div>
                                        </div>
                                    }

                                    {productData?.productWeight?.length !== 0 &&
                                        <div className="row">
                                            <div className="col-sm-3 d-flex align-items-center">
                                                <span className="icon"><FaShoppingCart /></span>
                                                <span className="name">Peso</span>
                                            </div>
                                            <div className="col-sm-9">
                                                : <span>
                                                    <div className="row">
                                                        <ul className="list list-inline tags sml">
                                                            {productData?.productWeight?.map((item, index) => (
                                                                <li className="list-inline-item" key={index}>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    }

                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdRateReview /></span>
                                            <span className="name">Reseñas</span>
                                        </div>
                                        <div className="col-sm-9">
                                            : <span>({reviewsData?.length}) Reseñas</span>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><BsPatchCheckFill /></span>
                                            <span className="name">Publicado</span>
                                        </div>
                                        <div className="col-sm-9">
                                            : <span>{productData?.dateCreated}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* XII. Descripción del producto y reseñas de clientes */}
                    <div className="p-4">
                        <h6 className="mt-4 mb-3">Descripción del Producto</h6>
                        <p>{productData?.description}</p>
                        <br />

                        {reviewsData?.length !== 0 &&
                            <>
                                <h6 className="mt-4 mb-4">Reseñas de clientes</h6>
                                <div className="reviewsSection">
                                    {reviewsData?.map((review, index) => (
                                        <div className="reviewsRow" key={index}>
                                            <div className="row">
                                                <div className="col-sm-7 d-flex">
                                                    <div className="d-flex flex-column">
                                                        <div className="userInfo d-flex align-items-center mb-3">
                                                            <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true} />
                                                            <div className="info pl-3">
                                                                <h6>{review?.customerName}</h6>
                                                                <span>{review?.dateCreated}</span>
                                                            </div>
                                                        </div>
                                                        <Rating name="read-only" value={review?.customerRating} readOnly />
                                                    </div>
                                                </div>
                                                <p className="mt-3">{review?.review}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

// XIII. Exportación del componente
export default ProductDetails;
