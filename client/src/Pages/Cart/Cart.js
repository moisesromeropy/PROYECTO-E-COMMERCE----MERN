// I. Importación de módulos y componentes
import { Link } from "react-router-dom"; // Importación del componente Link de react-router-dom
import Rating from '@mui/material/Rating'; // Importación del componente Rating de MUI
import QuantityBox from "../../Components/QuantityBox/QuantityBox"; // Importación del componente QuantityBox
import { IoIosClose } from "react-icons/io"; // Importación del ícono IoIosClose de react-icons
import Button from '@mui/material/Button'; // Importación del componente Button de MUI
import emprtCart from '../../assets/images/emptyCart.png'; // Importación de la imagen de carrito vacío
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto personalizado
import { useContext, useEffect, useState } from "react"; // Importación de hooks de React
import { deleteData, editData, fetchDataFromApi } from "../../utils/api"; // Importación de funciones para hacer llamadas a la API
import { IoBagCheckOutline } from "react-icons/io5"; // Importación del ícono IoBagCheckOutline de react-icons
import { FaHome } from "react-icons/fa"; // Importación del ícono FaHome de react-icons
import { loadStripe } from '@stripe/stripe-js'; // Importación de la función loadStripe de Stripe
import { useNavigate } from 'react-router-dom'; // Importación del hook useNavigate de react-router-dom

// II. Definición del componente Cart
const Cart = () => {
    // II.a Definición de estados
    const [cartData, setCartData] = useState([]); // Estado para los datos del carrito
    const [productQuantity, setProductQuantity] = useState(); // Estado para la cantidad de producto
    let [cartFields, setCartFields] = useState({}); // Estado para los campos del carrito
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar el estado de carga
    const [selectedQuantity, setselectedQuantity] = useState(); // Estado para la cantidad seleccionada
    const [chengeQuantity, setchengeQuantity] = useState(0); // Estado para la cantidad cambiada
    const [isLogin, setIsLogin] = useState(false); // Estado para controlar si el usuario está logueado

    const context = useContext(MyContext); // Uso del contexto personalizado
    const history = useNavigate(); // Uso del hook useNavigate para la navegación

    // III. useEffect para obtener datos del carrito al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0); // Desplazar la ventana al inicio

        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true); // Si hay token, establece el estado de login a verdadero
        } else {
            history("/signIn"); // Si no hay token, redirige a la página de inicio de sesión
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/cart?userId=${user?.id}`).then((res) => {
            if (Array.isArray(res)) {
                setCartData(res);
            } else {
                setCartData([]); // O cualquier manejo de error que prefieras
            }
            setselectedQuantity(res?.quantity); // Establece la cantidad seleccionada
        });
    }, []);

    // IV. Función para actualizar la cantidad del producto
    const quantity = (val) => {
        setProductQuantity(val); // Establece la cantidad del producto
        setchengeQuantity(val); // Establece la cantidad cambiada
    };

    // V. Función para actualizar el producto seleccionado
    const selectedItem = (item, quantityVal) => {
        if (chengeQuantity !== 0) {
            setIsLoading(true); // Establece el estado de carga a verdadero
            const user = JSON.parse(localStorage.getItem("user"));
            cartFields.productTitle = item?.productTitle;
            cartFields.image = item?.image;
            cartFields.rating = item?.rating;
            cartFields.price = item?.price;
            cartFields.quantity = quantityVal;
            cartFields.subTotal = parseInt(item?.price * quantityVal);
            cartFields.productId = item?.productId;
            cartFields.userId = user?.id;
            console.log(item._id)
            editData(`/api/cart/update/${item?._id}`, cartFields).then((res) => {
                setTimeout(() => {
                    setIsLoading(false); // Establece el estado de carga a falso
                    const user = JSON.parse(localStorage.getItem("user"));
                    fetchDataFromApi(`/api/cart?userId=${user?.id}`).then((res) => {
                        if (Array.isArray(res)) {
                            setCartData(res);
                        } else {
                            setCartData([]); // O cualquier manejo de error que prefieras
                        }
                    });
                }, 1000);
            });
        }
    };

    // VI. Función para eliminar un item del carrito
    const removeItem = (id) => {
        setIsLoading(true); // Establece el estado de carga a verdadero
        deleteData(`/api/cart/remove/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "¡Artículo eliminado del carrito!",
            });

            const user = JSON.parse(localStorage.getItem("user"));
            fetchDataFromApi(`/api/cart?userId=${user?.id}`).then((res) => {
                if (Array.isArray(res)) {
                    setCartData(res);
                } else {
                    setCartData([]); // O cualquier manejo de error que prefieras
                }
                setIsLoading(false); // Establece el estado de carga a falso
            });

            context.getCartData(); // Actualiza los datos del carrito en el contexto
        });
    };

    // VII. Renderizado del componente
    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <h2 className="hd mb-1">Tu carrito</h2>
                    <p>Hay <b className="text-red">{cartData?.length}</b> productos en tu carrito:</p>

                    {Array.isArray(cartData) && cartData.length !== 0 ? (
                        <div className="row">
                            <div className="col-md-9 pr-5">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th width="35%">Producto</th>
                                                <th width="15%">Precio Unitario</th>
                                                <th width="25%">Cantidad</th>
                                                <th width="15%">Subtotal</th>
                                                <th width="10%">Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartData.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td width="35%">
                                                            <Link to={`/product/${item?.productId}`}>
                                                                <div className="d-flex align-items-center cartItemimgWrapper">
                                                                    <div className="imgWrapper">
                                                                        <img src={item?.image} className="w-100" alt={item?.productTitle} />
                                                                    </div>
                                                                    <div className="info px-3">
                                                                        <h6>{item?.productTitle?.substr(0, 30) + '...'}</h6>
                                                                        <Rating name="read-only" value={item?.rating} readOnly size="small" />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td width="15%">Rs {item?.price}</td>
                                                        <td width="25%">
                                                            <QuantityBox quantity={quantity} item={item} selectedItem={selectedItem} value={item?.quantity} />
                                                        </td>
                                                        <td width="15%">Rs. {item?.subTotal}</td>
                                                        <td width="10%"><span className="remove" onClick={() => removeItem(item?._id)}><IoIosClose /></span></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card border p-3 cartDetails">
                                    <h4>Total</h4>

                                    <div className="d-flex align-items-center mb-3">
                                        <span>Subtotal</span>
                                        <span className="ml-auto text-red font-weight-bold">
                                            {(context.cartData?.length !== 0 ? context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center mb-3">
                                        <span>Envío</span>
                                        <span className="ml-auto"><b>Gratis</b></span>
                                    </div>

                                    <div className="d-flex align-items-center mb-3">
                                        <span>Estimación para</span>
                                        <span className="ml-auto"><b>Paraguay</b></span>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <span>Total</span>
                                        <span className="ml-auto text-red font-weight-bold">
                                            {(context.cartData?.length !== 0 ? context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                        </span>
                                    </div>

                                    <br />
                                    <Link to="/checkout">
                                        <Button className='btn-blue bg-red btn-lg btn-big'><IoBagCheckOutline /> &nbsp; Salir</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty d-flex align-items-center justify-content-center flex-column">
                            <img src={emprtCart} width="150" alt="Empty Cart" />
                            <h3>Su carrito actualmente está vacío</h3>
                            <br />
                            <Link to="/"> <Button className='btn-blue bg-red btn-lg btn-big btn-round'><FaHome /> &nbsp; Continuar comprando</Button></Link>
                        </div>
                    )}
                </div>
            </section>

            {isLoading === true && <div className="loadingOverlay"></div>}
        </>
    );
}

export default Cart; // VIII. Exportación del componente
