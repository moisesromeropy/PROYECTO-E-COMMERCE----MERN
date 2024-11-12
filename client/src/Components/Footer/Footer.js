// I. Importaciones necesarias
import React, { useState } from 'react';
import { LuShirt } from "react-icons/lu"; // Importa el icono de camiseta de react-icons
import { TbTruckDelivery } from "react-icons/tb"; // Importa el icono de camión de entrega de react-icons
import { CiDiscount1, CiBadgeDollar } from "react-icons/ci"; // Importa los iconos de descuento y dólar de react-icons
import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom para la navegación
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa"; // Importa los iconos de redes sociales de react-icons
import newsLetterImg from '../../assets/images/newsletter.png'; // Importa la imagen del newsletter
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI
import { IoMailOutline } from "react-icons/io5"; // Importa el icono de correo de react-icons
import { postData } from '../../utils/api'; // Importa la función postData para enviar datos al backend

// II. Definición del componente Footer
const Footer = () => {
    const [email, setEmail] = useState(""); // Estado para almacenar el correo electrónico
    const [message, setMessage] = useState(""); // Estado para almacenar mensajes de respuesta

    // II.1. Función para manejar la suscripción
    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (email) {
            const response = await postData("/subscription/subscribe", { email }); // Ajuste aquí
            if (response.success) {
                setMessage("¡Suscripción exitosa!");
                setEmail(""); // Borra el correo electrónico después de una suscripción exitosa
            } else {
                setMessage("Falló la suscripción. Por favor, intenta de nuevo.");
            }
        } else {
            setMessage("Por favor, introduce una dirección de correo válida.");
        }
    };

    return (
        <>
            {/* III. Sección del boletín de noticias */}
            <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white mb-1">$20 de descuento en tu primera compra...</p>
                            <h3 className="text-white">Únete a nuestro boletín mensual</h3>
                            <p className="text-light">
                                Únete a nuestra suscripción por e-mail para que te enteres<br /> 
                                de las promociones y cupones de descuento.
                            </p>

                            <form className="mt-4" onSubmit={handleSubscribe}>
                                <IoMailOutline />
                                <input 
                                    type="text" 
                                    placeholder="Tu dirección de correo electrónico..." 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                                <Button type="submit">Suscribirse</Button>
                            </form>
                            {message && <p style={{ color: 'white' }}>{message}</p>} {/* Estilo del mensaje en blanco */}
                        </div>

                        <div className="col-md-6">
                            <img src={newsLetterImg} alt="Newsletter" />
                        </div>
                    </div>
                </div>
            </section>

            {/* IV. Pie de página */}
            <footer>
                <div className="container">
                    {/* IV.1. Información superior del pie de página */}
                    <div className="topInfo row">
                        <div className="col d-flex align-items-center">
                            <span><LuShirt /></span>
                            <span className="ml-2">Productos originales</span>
                        </div>

                        <div className="col d-flex align-items-center">
                            <span><TbTruckDelivery /></span>
                            <span className="ml-2">Envíos gratuitos desde 500.000 Gs</span>
                        </div>

                        <div className="col d-flex align-items-center">
                            <span><CiDiscount1  /></span>
                            <span className="ml-2">Mega descuentos mensuales</span>
                        </div>

                        <div className="col d-flex align-items-center">
                            <span><CiBadgeDollar /></span>
                            <span className="ml-2">El mejor precio del mercado</span>
                        </div>
                    </div>

                    {/* IV.2. Enlaces del pie de página */}
                    <div className="row mt-5 linksWrap">
                        <div className="col">
                            <h5>CATEGORIA 1</h5>
                            <ul>
                                <li><Link to="#">SUBCATEGORIA 1.1</Link></li>
                                <li><Link to="#">SUBCATEGORIA 1.2</Link></li>
                                <li><Link to="#">SUBCATEGORIA 1.3</Link></li>
                                <li><Link to="#">SUBCATEGORIA 1.4</Link></li>
                                <li><Link to="#">SUBCATEGORIA 1.5</Link></li>
                            </ul>
                        </div>

                        <div className="col">
                            <h5>CATEGORIA 2</h5>
                            <ul>
                                <li><Link to="#">SUBCATEGORIA 2.1</Link></li>
                                <li><Link to="#">SUBCATEGORIA 2.2</Link></li>
                                <li><Link to="#">SUBCATEGORIA 2.3</Link></li>
                                <li><Link to="#">SUBCATEGORIA 2.4</Link></li>
                                <li><Link to="#">SUBCATEGORIA 2.5</Link></li>
                            </ul>
                        </div>

                        <div className="col">
                            <h5>CATEGORIA 3</h5>
                            <ul>
                                <li><Link to="#">SUBCATEGORIA 3.1</Link></li>
                                <li><Link to="#">SUBCATEGORIA 3.2</Link></li>
                                <li><Link to="#">SUBCATEGORIA 3.3</Link></li>
                                <li><Link to="#">SUBCATEGORIA 3.4</Link></li>
                                <li><Link to="#">SUBCATEGORIA 3.5</Link></li>
                            </ul>
                        </div>

                        <div className="col">
                            <h5>CATEGORIA 4</h5>
                            <ul>
                                <li><Link to="#">SUBCATEGORIA 4.1</Link></li>
                                <li><Link to="#">SUBCATEGORIA 4.2</Link></li>
                                <li><Link to="#">SUBCATEGORIA 4.3</Link></li>
                                <li><Link to="#">SUBCATEGORIA 4.4</Link></li>
                                <li><Link to="#">SUBCATEGORIA 4.5</Link></li>
                            </ul>
                        </div>

                        <div className="col">
                            <h5>CATEGORIA 5</h5>
                            <ul>
                                <li><Link to="#">SUBCATEGORIA 5.1</Link></li>
                                <li><Link to="#">SUBCATEGORIA 5.2</Link></li>
                                <li><Link to="#">SUBCATEGORIA 5.3</Link></li>
                                <li><Link to="#">SUBCATEGORIA 5.4</Link></li>
                                <li><Link to="#">SUBCATEGORIA 5.5</Link></li>
                            </ul>
                        </div>
                    </div>

                   {/* IV.3. Información de derechos de autor y redes sociales */}
                    <div className="copyright mt-3 pt-3 pb-3 d-flex">
                        <p className="mb-0">Copyright 2024. Todos los derechos reservados</p>
                        <ul className="list list-inline ml-auto mb-0 socials">
                            <li className="list-inline-item">
                                <a href="https://www.facebook.com/tuPagina" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                            </li>
                            <li className="list-inline-item">
                                <a href="https://www.twitter.com/tuCuenta" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                            </li>
                            <li className="list-inline-item">
                                <a href="https://www.instagram.com/tuCuenta" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}

// V. Exportación del componente
export default Footer;
