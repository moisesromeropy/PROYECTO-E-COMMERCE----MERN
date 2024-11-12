// I. Importaciones necesarias
import { Link } from "react-router-dom"; // Importación del componente Link de react-router-dom
import Rating from '@mui/material/Rating'; // Importación del componente Rating de MUI
import { IoIosClose } from "react-icons/io"; // Importación del ícono IoIosClose de react-icons
import Button from '@mui/material/Button'; // Importación del componente Button de MUI
import emprtCart from '../../assets/images/myList.png'; // Importación de la imagen de la lista vacía
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto personalizado
import { useContext, useEffect, useState } from "react"; // Importación de hooks de React
import { deleteData, fetchDataFromApi } from "../../utils/api"; // Importación de funciones para hacer llamadas a la API
import { FaHome } from "react-icons/fa"; // Importación del ícono FaHome de react-icons
import { useNavigate } from 'react-router-dom'; // Importación del hook useNavigate de react-router-dom

// II. Definición del componente MyList
const MyList = () => {
    // II.a Definición de estados
    const [myListData, setmyListData] = useState([]); // Estado para los datos de la lista
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar el estado de carga
    const [isLogin, setIsLogin] = useState(false); // Estado para controlar si el usuario está logueado

    const context = useContext(MyContext); // Uso del contexto personalizado
    const history = useNavigate(); // Uso del hook useNavigate para la navegación

    // III. useEffect para obtener datos de la lista al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0); // Desplazar la ventana al inicio

        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true); // Si hay token, establece el estado de login a verdadero
        } else {
            history("/signIn"); // Si no hay token, redirige a la página de inicio de sesión
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?userId=${user?.id}`).then((res) => {
            if (Array.isArray(res)) {
                setmyListData(res);
            } else {
                setmyListData([]); // O cualquier manejo de error que prefieras
            }
        });
    }, []);

    // IV. Función para eliminar un item de la lista
    const removeItem = (id) => {
        setIsLoading(true); // Establece el estado de carga a verdadero
        deleteData(`/api/my-list/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "item removed from My List!",
            });

            const user = JSON.parse(localStorage.getItem("user"));
            fetchDataFromApi(`/api/my-list?userId=${user?.id}`).then((res) => {
                if (Array.isArray(res)) {
                    setmyListData(res);
                } else {
                    setmyListData([]); // O cualquier manejo de error que prefieras
                }
                setIsLoading(false); // Establece el estado de carga a falso
            });
        });
    };

    // V. Renderizado del componente
    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <div className="myListTableWrapper">
                        <h2 className="hd mb-1">Mi lista de productos</h2>
                        <p>There are <b className="text-red">{myListData?.length}</b> Productos en mi lista</p>
                        {Array.isArray(myListData) && myListData.length !== 0 ? (
                            <div className="row">
                                <div className="col-md-12 pr-5">
                                    <div className="table-responsive myListTable">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th width="50%">Producto</th>
                                                    <th width="15%">Precio Unitario</th>
                                                    <th width="10%">Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myListData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td width="50%">
                                                            <Link to={`/product/${item?.productId}`}>
                                                                <div className="d-flex align-items-center cartItemimgWrapper">
                                                                    <div className="imgWrapper">
                                                                        <img src={item?.image} className="w-100" alt={item?.productTitle} />
                                                                    </div>
                                                                    <div className="info px-3">
                                                                        <h6>{item?.productTitle}</h6>
                                                                        <Rating name="read-only" value={item?.rating} readOnly size="small" />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td width="15%">Rs {item?.price}</td>
                                                        <td width="10%">
                                                            <span className="remove" onClick={() => removeItem(item?._id)}>
                                                                <IoIosClose />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty d-flex align-items-center justify-content-center flex-column">
                                <img src={emprtCart} width="150" alt="Empty List" />
                                <h3>Mi lista está actualmente vacía</h3>
                                <br />
                                <Link to="/">
                                    <Button className="btn-blue bg-red btn-lg btn-big btn-round">
                                        <FaHome /> &nbsp; Continuar comprando...
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {isLoading === true && <div className="loadingOverlay"></div>}
        </>
    );
};

export default MyList; // Exportación del componente
