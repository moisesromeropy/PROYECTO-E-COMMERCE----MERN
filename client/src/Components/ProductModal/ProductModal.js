//  I: Importación de dependencias y componentes
import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { useContext, useEffect, useState } from 'react';
import QuantityBox from '../QuantityBox/QuantityBox';
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineCompareArrows } from "react-icons/md";
import { MyContext } from '../../MyContext/MyContext';
import ProductZoom from '../ProductZoom/ProductZoom';
import { IoCartSharp } from "react-icons/io5";
import { editData, fetchDataFromApi, postData } from '../../utils/api';
import { FaHeart } from "react-icons/fa";

//  II: Definición y estado inicial del componente ProductModal
const ProductModal = (props) => {
    const [productQuantity, setProductQuantity] = useState(1); // Estado para la cantidad de producto
    const [activeSize, setActiveSize] = useState(null); // Estado para el tamaño seleccionado
    const [tabError, setTabError] = useState(false); // Estado para el error de selección de tamaño
    const [isAddedToMyList, setIsAddedToMyList] = useState(false); // Estado para verificar si el producto está en la lista de deseos

    const context = useContext(MyContext); // Contexto para manejar el estado global de la aplicación

    // Efecto para inicializar el tamaño y verificar si el producto está en la lista de deseos
    useEffect(() => {
        if (props?.data?.productRam.length === 0 && props?.data?.productWeight.length === 0 && props?.data?.size.length === 0) {
            setActiveSize(1);
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?productId=${props?.data?.id}&userId=${user?.userId}`).then((res) => {
            if (res.length !== 0) {
                setIsAddedToMyList(true);
            }
        })
    }, [props?.data?.id, props?.data?.productRam.length, props?.data?.productWeight.length, props?.data?.size.length]);

    // Función para actualizar la cantidad del producto
    const quantity = (val) => {
        setProductQuantity(val);
    }

    // Función para actualizar el tamaño activo
    const isActive = (index) => {
        setActiveSize(index);
        setTabError(false);
    }

    // Función para agregar el producto al carrito de compras
    const addtoCart = () => {
        if (activeSize !== null) {
            const user = JSON.parse(localStorage.getItem("user"));

            const cartFields = {
                productTitle: props?.data?.name,
                image: props?.data?.images[0],
                rating: props?.data?.rating,
                price: props?.data?.price,
                quantity: productQuantity,
                subTotal: parseInt(props?.data?.price * productQuantity),
                productId: props?.data?.id,
                countInStock: props?.data?.countInStock,
                userId: user?.userId,
            };

            context.addToCart(cartFields);
        } else {
            setTabError(true);
        }
    }

    // Función para agregar el producto a la lista de deseos
    const addToMyList = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const data = {
                productTitle: props?.data?.name,
                image: props?.data?.images[0],
                rating: props?.data?.rating,
                price: props?.data?.price,
                productId: id,
                userId: user?.userId,
            };
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "El producto ha sido agregado a tu lista de deseos",
                    });
                    setIsAddedToMyList(true);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg,
                    });
                }
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Por favor, inicia sesión para continuar",
            });
        }
    }

    // III: Renderizado del componente ProductModal
    return (
        <>
            <Dialog open={context.isOpenProductModal} className="productModal" onClose={() => context.setisOpenProductModal(false)}>
                <Button className='close_' onClick={() => context.setisOpenProductModal(false)}><MdClose /></Button>
                <h4 className="mb-1 font-weight-bold pr-5">{props?.data?.name}</h4>
                <div className='d-flex align-items-center'>
                    <div className='d-flex align-items-center mr-4'>
                        <span>Marca:</span>
                        <span className='ml-2'><b>{props?.data?.brand}</b> </span>
                    </div>
                    <Rating name="read-only" value={parseInt(props?.data?.rating)} size="small" precision={0.5} readOnly />
                </div>
                <hr />
                <div className='row mt-2 productDetaileModal'>
                    <div className='col-md-5'>
                        <ProductZoom images={props?.data?.images} discount={props?.data?.discount} />
                    </div>
                    <div className='col-md-7'>
                        <div className='d-flex info align-items-center mb-3'>
                            <span className='oldPrice lg mr-2'>Rs: {props?.data?.oldPrice}</span>
                            <span className='netPrice text-danger lg'>Rs: {props?.data?.price}</span>
                        </div>
                        <span className="badge bg-success">EN STOCK</span>
                        <p className='mt-3'>Rs: {props?.data?.description}</p>
                        {props?.data?.productRam?.length !== 0 &&
                            <div className='productSize d-flex align-items-center'>
                                <span>RAM:</span>
                                <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                    {props?.data?.productRam?.map((item, index) => (
                                        <li key={index} className='list-inline-item'>
                                            <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                        {props?.data?.size?.length !== 0 &&
                            <div className='productSize d-flex align-items-center'>
                                <span>Tamaño:</span>
                                <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                    {props?.data?.size?.map((item, index) => (
                                        <li key={index} className='list-inline-item'>
                                            <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                        {props?.data?.productWeight?.length !== 0 &&
                            <div className='productSize d-flex align-items-center'>
                                <span>Peso:</span>
                                <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                    {props?.data?.productWeight?.map((item, index) => (
                                        <li key={index} className='list-inline-item'>
                                            <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                        <div className='d-flex align-items-center'>
                            <QuantityBox quantity={quantity} item={props?.data} />
                            <Button className='btn-blue bg-red btn-lg btn-big btn-round ml-3' onClick={addtoCart}>
                                <IoCartSharp />
                                {context.addingInCart === true ? "adding..." : " Agregar al carrito"}
                            </Button>
                        </div>
                        <div className='d-flex align-items-center mt-5 actions'>
                            <Button className='btn-round btn-sml' variant="outlined" onClick={() => addToMyList(props?.data?.id)} >
                                {isAddedToMyList === true ?
                                    <>
                                        <FaHeart className="text-danger" />
                                        &nbsp; AGREGAR A LA LISTA DE DESEOS
                                    </>
                                    :
                                    <>
                                        <IoIosHeartEmpty />
                                        &nbsp; AGREGAR A LA LISTA DE DESEOS
                                    </>
                                }
                            </Button>
                            <Button className='btn-round btn-sml ml-3' variant="outlined">
                                <MdOutlineCompareArrows /> &nbsp; COMPARAR
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

//  IV: Exportación del componente ProductModal
export default ProductModal;
