// I. Importación de dependencias y componentes
import ProductZoom from "../../Components/ProductZoom/ProductZoom";
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox/QuantityBox";
import Button from '@mui/material/Button';
import { BsCartFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import RelatedProducts from "./RelatedProducts/RelatedProducts";
import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData, deleteData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../MyContext/MyContext';
import { FaHeart } from "react-icons/fa";

// II. Definición del componente ProductDetails
const ProductDetails = () => {

    // II.a Definición de estados
    const [activeSize, setActiveSize] = useState(null); // Estado para el tamaño activo
    const [activeTabs, setActiveTabs] = useState(0); // Estado para la pestaña activa
    const [productData, setProductData] = useState({}); // Estado para los datos del producto
    const [relatedProductData, setRelatedProductData] = useState([]); // Estado para los productos relacionados
    const [recentlyViewdProducts, setRecentlyViewdProducts] = useState([]); // Estado para los productos vistos recientemente
    const [isLoading, setIsLoading] = useState(false); // Estado para el indicador de carga
    const [reviewsData, setReviewsData] = useState([]); // Estado para los datos de las reseñas
    const [isAddedToMyList, setIsAddedToMyList] = useState(false); // Estado para saber si el producto se añadió a la lista de deseos
    const [myListId, setMyListId] = useState(null);
    let [cartFields, setCartFields] = useState({}); // Estado para los campos del carrito
    let [productQuantity, setProductQuantity] = useState(); // Estado para la cantidad de producto
    const [tabError, setTabError] = useState(false); // Estado para el error de la pestaña

    const { id } = useParams(); // Obtiene el id del producto desde los parámetros de la URL

    const context = useContext(MyContext); // Obtiene el contexto global

    // Función para establecer el tamaño activo
    const isActive = (index) => {
        setActiveSize(index);
        setTabError(false);
    }

    // Efecto para cargar los datos del producto y las reseñas
    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveSize(null);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res);

            if (res?.productRam?.length === 0 && res?.productWeight?.length === 0 && res?.size?.length === 0) {
                setActiveSize(1);
            }

            fetchDataFromApi(`/api/products?subCatId=${res?.subCatId}`)
                .then((res) => {
                    const filteredData = res?.products?.filter(item => item.id !== id);
                    setRelatedProductData(filteredData);
                });
        });

        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setReviewsData(res);
        });

        const user = JSON.parse(localStorage.getItem("user"));

        fetchDataFromApi(`/api/my-list/filtrado?productId=${id}&userId=${user?.id}`)
    .then((res) => {
        if (res && res.length > 0) {
            // Si hay resultados en la respuesta
            console.log(res[0]._id);    
            setMyListId(res[0]._id);
            setIsAddedToMyList(true);
        } else {
            // Si la respuesta está vacía
            setIsAddedToMyList(false);
        }
    })
    .catch((error) => {
        // Si el error es un 404, significa que no se encontró el elemento
        if (error.response && error.response.status === 404) {
            setIsAddedToMyList(false);
        } else {
            console.error("Error al buscar en MyList:", error);
        }
    });

    }, [id]);

    const [rating, setRating] = useState(1); // Estado para la calificación
    const [reviews, setReviews] = useState({
        productId: "",
        customerName: "",
        customerId: "",
        review: "",
        customerRating: 1
    });

    // Función para manejar cambios en los inputs
    const onChangeInput = (e) => {
        setReviews(() => ({
            ...reviews,
            [e.target.name]: e.target.value
        }));
    }

    // Función para cambiar la calificación
    const changeRating = (event, newValue) => {
        setRating(newValue);
        setReviews((prevState) => ({
            ...prevState,
            customerRating: newValue
        }));
    }

    // Función para añadir una reseña

    //
    //a
    // ESTA PARTE SE MODIFICO PARA EL ENVIO DE RESEÑAS
    //
    //

    const addReview = (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        
        console.log(user);
        console.log(user.userId);

        const updatedReview = {
            ...reviews,
            customerName: user.name,
            customerId: user.id,
            productId: id
        };

        setIsLoading(true);
        console.log(updatedReview);

        postData("/api/productReviews/add", updatedReview).then(() => {
            setIsLoading(false);
            setReviews({
                productId: "",
                customerName: "",
                customerId: "",
                review: "",
                customerRating: 1
            });

            fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
                setReviewsData(res);
            });
        });
    }

    // Función para actualizar la cantidad del producto
    const quantity = (val) => {
        setProductQuantity(val);
    }

    // Función para añadir el producto al carrito
    const addToCart = () => {
        if (activeSize !== null) {
            const user = JSON.parse(localStorage.getItem("user"));
            cartFields = {
                productTitle: productData?.name,
                image: productData?.images[0],
                rating: productData?.rating,
                price: productData?.price,
                quantity: productQuantity,
                subTotal: parseInt(productData?.price * productQuantity),
                productId: productData?.id,
                countInStock: productData?.countInStock,
                userId: user?.id
            };
            context.addToCart(cartFields);
        } else {
            setTabError(true);
        }
    }

    // Función para seleccionar un ítem (vacía)
    const selectedItem = () => {}

    // Función para desplazarse a las reseñas
    const gotoReviews = () => {
        window.scrollTo({
            top: 550,
            behavior: 'smooth',
        });

        setActiveTabs(2);
    }

    // Función para añadir el producto a la lista de deseos
    const addToMyList = (id) => {
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const data = {
                productTitle: productData?.name,
                image: productData?.images[0],
                rating: productData?.rating,
                price: productData?.price,
                productId: id,
                userId: user?.id
            };
            if(isAddedToMyList){
                console.log(myListId);
                // Uso en el componente de React
                // Uso en el componente de React
                deleteData(`/api/my-list/${myListId}`)
    .then((res) => {
        console.log(res.data);
        if (res?.success) {  // Verifica si la respuesta contiene 'success' como true
            // Si la eliminación fue exitosa, actualiza el estado
            setIsAddedToMyList(false);
            console.log("El producto se eliminó de mi lista");
            
        } else {
            // Si la eliminación no fue exitosa, muestra un mensaje de advertencia
            console.warn("Error al eliminar el producto de MyList:", res?.message || "Operación fallida");
        }
    })
    .catch((error) => {
        // Manejo de errores inesperados en la solicitud
        console.error("Error al intentar eliminar el producto de MyList:", error);
        setIsAddedToMyList(false);  // Restablece el estado en caso de error
    });

                                
        }else{
            postData(`/api/my-list/add/`, data)
    .then((res) => {
        if (res?._id) { // Verificamos si el servidor devolvió un id, lo que indica que el producto fue añadido
            // Si el producto se añadió exitosamente, establece el estado en true
            setIsAddedToMyList(true);
            setMyListId(res._id);
            // Realiza la verificación de la adición después de un pequeño retraso
            setTimeout(() => {
                fetchDataFromApi(`/api/my-list?productId=${data.productId}&userId=${data.userId}`)
                    .then((fetchRes) => {
                        // Verifica si el producto agregado está en la lista
                        setIsAddedToMyList(fetchRes?.length > 0);
                    })
                    .catch((fetchError) => {
                        console.error("Error en la verificación de MyList:", fetchError);
                        setIsAddedToMyList(false); // Restablece en caso de error de verificación
                    });
            }, 500); // Ajusta el retraso según lo necesites (500ms)
        } else {
            // Si la adición no fue exitosa (es decir, no se devuelve un _id), establece `isAddedToMyList` en false
            setIsAddedToMyList(false);
        }
    })
    .catch((error) => {
        // Maneja cualquier error de la solicitud `postData`
        console.error("Error al añadir el producto a MyList:", error);
        setIsAddedToMyList(false);
    });

        }
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Por favor inicie sesión para continuar"
            });
        }
    }

    // III. Renderizado del componente ProductDetails
    return (
        <>
            <section className="productDetails section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 pl-5 part1">
                            <ProductZoom images={productData?.images} discount={productData?.discount} />
                        </div>

                        <div className="col-md-7 pl-5 pr-5 part2">
                            <h2 className="hd text-capitalize">{productData?.name}</h2>
                            <ul className="list list-inline d-flex align-items-center">
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <span className="text-light mr-2">Marca: </span>
                                        <span>{productData?.brand}</span>
                                    </div>
                                </li>

                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <Rating name="read-only" value={parseFloat(productData?.rating)} precision={0.5} readOnly size="small" />
                                        <span className="text-light cursor ml-2" onClick={gotoReviews}>{reviewsData?.length || 0} Reseñas</span>
                                    </div>
                                </li>
                            </ul>

                            <div className="d-flex info mb-3">
                                <span className="oldPrice">Gs: {productData?.oldPrice}</span>
                                <span className="netPrice text-danger ml-2">Gs: {productData?.price}</span>
                            </div>

                            {
                                productData?.countInStock >= 1 ?
                                    <span className="badge badge-success">EN STOCK</span>
                                    :
                                    <span className="badge badge-danger">AGOTADO</span>
                            }

                            <p className="mt-3">{productData?.description}</p>

                            {
                                productData?.productRam?.length > 0 &&
                                <div className='productSize d-flex align-items-center'>
                                    <span>RAM:</span>
                                    <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                        {
                                            productData?.productRam?.map((item, index) => {
                                                return (
                                                    <li className='list-inline-item' key={index}><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a></li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }

                            {
                                productData?.size?.length > 0 &&
                                <div className='productSize d-flex align-items-center'>
                                    <span>Tamaño:</span>
                                    <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                        {
                                            productData?.size?.map((item, index) => {
                                                return (
                                                    <li className='list-inline-item' key={index}><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a></li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }

                            {
                                productData?.productWeight?.length > 0 &&
                                <div className='productSize d-flex align-items-center'>
                                    <span>Peso:</span>
                                    <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                        {
                                            productData?.productWeight?.map((item, index) => {
                                                return (
                                                    <li className='list-inline-item' key={index}><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a></li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }

                            <div className="d-flex align-items-center mt-3 actions_">
                                <QuantityBox quantity={quantity} item={productData} selectedItem={selectedItem} />

                                <div className="d-flex align-items-center btnActions">
                                    <Button className="btn-blue btn-lg btn-big btn-round bg-red" onClick={() => addToCart()}>
                                        <BsCartFill /> &nbsp;
                                        {
                                            context.addingInCart === true ? "agregando..." : " Añadir al carrito"
                                        }
                                    </Button>

                                    <Tooltip title={`${isAddedToMyList === true ? 'Añadido a la lista de deseos' : 'Añadir a la lista de deseos'}`} placement="top">
                                        <Button className={`btn-blue btn-lg btn-big btn-circle ml-4`} onClick={() => addToMyList(id)}>
                                            {
                                                isAddedToMyList === true ? <FaHeart className="text-danger" /> 
                                                    :
                                                    <FaRegHeart />
                                            }
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Añadir para comparar" placement="top">
                                        <Button className="btn-blue btn-lg btn-big btn-circle ml-2">
                                            <MdOutlineCompareArrows />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className='card mt-5 p-5 detailsPageTabs'>
                        <div className='customTabs'>
                            <ul className='list list-inline'>
                                <li className='list-inline-item'>
                                    <Button className={`${activeTabs === 0 && 'active'}`}
                                        onClick={() => setActiveTabs(0)}
                                    >Descripción</Button>
                                </li>
                                <li className='list-inline-item'>
                                    <Button className={`${activeTabs === 1 && 'active'}`}
                                        onClick={() => setActiveTabs(1)}
                                    >Información adicional</Button>
                                </li>
                                <li className='list-inline-item'>
                                    <Button className={`${activeTabs === 2 && 'active'}`}
                                        onClick={() => setActiveTabs(2)}
                                    >Reseñas ({reviewsData?.length || 0})</Button>
                                </li>
                            </ul>

                            <br />

                            {activeTabs === 0 && <div className='tabContent'>{productData?.description}</div>}

                            {activeTabs === 1 && (
                                <div className='tabContent'>
                                    <div className='table-responsive'>
                                        <table className='table table-bordered'>
                                            <tbody>
                                                <tr className="stand-up">
                                                    <th>Stand Up</th>
                                                    <td><p>35″L x 24″W x 37-45″H (de frente a rueda trasera)</p></td>
                                                </tr>
                                                <tr className="folded-wo-wheels">
                                                    <th>Plegado (sin ruedas)</th>
                                                    <td><p>32.5″L x 18.5″W x 16.5″H</p></td>
                                                </tr>
                                                <tr className="folded-w-wheels">
                                                    <th>Plegado (con ruedas)</th>
                                                    <td><p>32.5″L x 24″W x 18.5″H</p></td>
                                                </tr>
                                                <tr className="door-pass-through">
                                                    <th>Ancho de paso</th>
                                                    <td><p>24</p></td>
                                                </tr>
                                                <tr className="frame">
                                                    <th>Marco</th>
                                                    <td><p>Aluminio</p></td>
                                                </tr>
                                                <tr className="weight-wo-wheels">
                                                    <th>Peso (sin ruedas)</th>
                                                    <td><p>20 LBS</p></td>
                                                </tr>
                                                <tr className="weight-capacity">
                                                    <th>Capacidad de peso</th>
                                                    <td><p>60 LBS</p></td>
                                                </tr>
                                                <tr className="width">
                                                    <th>Ancho</th>
                                                    <td><p>24″</p></td>
                                                </tr>
                                                <tr className="handle-height-ground-to-handle">
                                                    <th>Altura del mango (desde el suelo al mango)</th>
                                                    <td><p>37-45″</p></td>
                                                </tr>
                                                <tr className="wheels">
                                                    <th>Ruedas</th>
                                                    <td><p>12″ aire / banda de rodadura ancha</p></td>
                                                </tr>
                                                <tr className="seat-back-height">
                                                    <th>Altura del respaldo</th>
                                                    <td><p>21.5″</p></td>
                                                </tr>
                                                <tr className="head-room-inside-canopy">
                                                    <th>Altura interior (dentro del dosel)</th>
                                                    <td><p>25″</p></td>
                                                </tr>
                                                <tr className="pa_color">
                                                    <th>Color</th>
                                                    <td><p>Negro, Azul, Rojo, Blanco</p></td>
                                                </tr>
                                                <tr className="pa_size">
                                                    <th>Tamaño</th>
                                                    <td><p>M, S</p></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTabs === 2 && (
                                <div className='tabContent'>
                                    <div className='row'>
                                        <div className='col-md-8'>
                                            <h3>Preguntas y respuestas de clientes</h3>
                                            <br />

                                            {reviewsData?.length > 0 && reviewsData.slice(0).reverse().map((item, index) => (
                                                <div className='reviewBox mb-4 border-bottom' key={index}>
                                                    <div className='info'>
                                                        <div className='d-flex align-items-center w-100'>
                                                            <h5>{item?.customerName}</h5>
                                                            <div className='ml-auto'>
                                                                <Rating name="half-rating-read" value={parseFloat(item?.customerRating)} readOnly size="small" />
                                                            </div>
                                                        </div>
                                                        <h6 className='text-light'>{item?.dateCreated}</h6>
                                                        <p>{item?.review}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <br className='res-hide' />

                                            <form className='reviewForm' onSubmit={addReview}>
                                                <h4>Añadir una reseña</h4>
                                                <div className='form-group'>
                                                    <textarea className='form-control shadow' placeholder='Escribe una reseña' name='review' value={reviews.review} onChange={onChangeInput}></textarea>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <div className='form-group'>
                                                            <Rating name="rating" value={rating} precision={0.5} onChange={changeRating} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <br />
                                                <div className='form-group'>
                                                    <Button type='submit' className='btn-blue btn-lg btn-big btn-round'>
                                                        {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'Enviar reseña'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <br />

                    {relatedProductData?.length > 0 && <RelatedProducts title="PRODUCTOS RELACIONADOS" data={relatedProductData} />}
                </div>
            </section>
        </>
    );
}

// IV. Exportación del componente ProductDetails
export default ProductDetails;
