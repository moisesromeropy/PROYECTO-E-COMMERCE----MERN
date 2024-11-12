// I. Importaciones necesarias
import React, { useEffect, useState } from 'react'; // Importación de React y hooks
import { fetchDataFromApi } from '../../utils/api'; // Importación de función para hacer fetch a la API
// Import Pagination from '@mui/material/Pagination'; // Importación del componente Pagination de MUI
import Dialog from '@mui/material/Dialog'; // Importación del componente Dialog de MUI
import { MdClose } from "react-icons/md"; // Importación del ícono MdClose de react-icons
import Button from '@mui/material/Button'; // Importación del componente Button de MUI
import { useNavigate } from 'react-router-dom'; // Importación del hook useNavigate de react-router-dom

// II. Definición del componente Orders
const Orders = () => {
    // II.a Definición de estados
    const [orders, setOrders] = useState([]); // Estado para las órdenes
    const [products, setProducts] = useState([]); // Estado para los productos de una orden
    const [page, setPage] = useState(1); // Estado para la página actual de la paginación
    const [isOpenModal, setIsOpenModal] = useState(false); // Estado para controlar la apertura del modal
    const [isLogin, setIsLogin] = useState(false); // Estado para controlar si el usuario está logueado

    const history = useNavigate(); // Uso del hook useNavigate para la navegación

    // III. useEffect para obtener datos de las órdenes al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0); // Desplazar la ventana al inicio

        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true); // Si hay token, establece el estado de login a verdadero
        } else {
            history("/signIn"); // Si no hay token, redirige a la página de inicio de sesión
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/orders?userid=${user?.userId}`).then((res) => {
            if (Array.isArray(res)) {
                setOrders(res);
            } else {
                setOrders([]); // O cualquier manejo de error que prefieras
            }
        });
    }, []);

    // IV. Función para mostrar los productos de una orden
    const showProducts = (id) => {
        fetchDataFromApi(`/api/orders/${id}`).then((res) => {
            setIsOpenModal(true); // Abre el modal
            setProducts(res.products); // Establece los productos de la orden
        });
    };

    // V. Renderizado del componente
    return (
        <>
            <section className="section">
                <div className='container'>
                    <h2 className='hd'>Orders</h2>
                    <div className='table-responsive orderTable'>
                        <table className='table table-striped table-bordered'>
                            <thead className='thead-light'>
                                <tr>
                                    <th>Identificación de pago</th>
                                    <th>Productos</th>
                                    <th>Nombre</th>
                                    <th>Teléfono móvil</th>
                                    <th>Dirección</th>
                                    <th>Codigo de Pin</th>
                                    <th>Monto total</th>
                                    <th>Email</th>
                                    <th>ID de Usuario</th>
                                    <th>Estado de la órden</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(orders) && orders.length !== 0 && orders.map((order, index) => (
                                    <tr key={index}>
                                        <td><span className='text-blue font-weight-bold'>{order?.paymentId}</span></td>
                                        <td><span className='text-blue font-weight-bold cursor' onClick={() => showProducts(order?._id)}>Click here to view</span></td>
                                        <td>{order?.name}</td>
                                        <td>{order?.phoneNumber}</td>
                                        <td>{order?.address}</td>
                                        <td>{order?.pincode}</td>
                                        <td>{order?.amount}</td>
                                        <td>{order?.email}</td>
                                        <td>{order?.userid}</td>
                                        <td>
                                            {order?.status === "pending" ? (
                                                <span className='badge badge-danger'>{order?.status}</span>
                                            ) : (
                                                <span className='badge badge-success'>{order?.status}</span>
                                            )}
                                        </td>
                                        <td>{order?.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* VI. Modal para mostrar los productos de una orden */}
            <Dialog open={isOpenModal} className="productModal">
                <Button className='close_' onClick={() => setIsOpenModal(false)}><MdClose /></Button>
                <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>
                <div className='table-responsive orderTable'>
                    <table className='table table-striped table-bordered'>
                        <thead className='thead-light'>
                            <tr>
                                <th>Id del producto</th>
                                <th>Nombre del Producto</th>
                                <th>Imagen</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>SubTotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.length !== 0 && products.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.productId}</td>
                                    <td style={{ whiteSpace: "inherit" }}>
                                        <span>{item?.productTitle?.substr(0, 30) + '...'}</span>
                                    </td>
                                    <td>
                                        <div className='img'>
                                            <img src={item?.image} alt={item?.productTitle} />
                                        </div>
                                    </td>
                                    <td>{item?.quantity}</td>
                                    <td>{item?.price}</td>
                                    <td>{item?.subTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Dialog>
        </>
    );
};

export default Orders; // VII. Exportación del componente
