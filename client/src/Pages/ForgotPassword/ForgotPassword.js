// I. Importación de módulos y componentes
import React, { useState, useContext } from 'react'; // Importación de React y hooks
import { TextField, Button, CircularProgress, Alert } from '@mui/material'; // Importación de componentes de MUI
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto personalizado
import { postData } from '../../utils/api'; // Importación de función para hacer llamadas a la API
import { useNavigate } from 'react-router-dom'; // Importación del hook useNavigate de react-router-dom
import Logo from '../../assets/images/logo.png'; // Importación de la imagen del logo

// II. Definición del componente ForgotPassword
const ForgotPassword = () => {
    // II.a Definición de estados
    const [email, setEmail] = useState(''); // Estado para el email
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar el estado de carga
    const [error, setError] = useState(''); // Estado para el mensaje de error

    const context = useContext(MyContext); // Uso del contexto personalizado
    const navigate = useNavigate(); // Uso del hook useNavigate para la navegación

    // III. Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Establece el estado de carga a verdadero
        setError(''); // Limpia cualquier mensaje de error anterior

        try {
            const res = await postData('/api/user/forgot-password', { email });
            if (!res.error) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Revise su correo electrónico', // Muestra un mensaje de éxito
                });
                setTimeout(() => {
                    setIsLoading(false); // Establece el estado de carga a falso
                    navigate('/signIn'); // Redirige a la página de inicio de sesión
                }, 2000);
            } else {
                setError(res.error); // Establece el mensaje de error recibido
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.error, // Muestra el mensaje de error
                });
                setIsLoading(false); // Establece el estado de carga a falso
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setError('Ocurrió un error. Inténtalo de nuevo.'); // Establece un mensaje de error genérico
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Ocurrió un error. Inténtalo de nuevo.', // Muestra el mensaje de error genérico
            });
            setIsLoading(false); // Establece el estado de carga a falso
        }
    };

    // IV. Renderizado del componente
    return (
        <section className="section forgotPasswordPage">
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center mb-4">
                        <img src={Logo} style={{ width: '100px' }} alt="Logo" /> {/* Logo de la aplicación */}
                    </div>

                    <form className="mt-2" onSubmit={handleSubmit}>
                        <h2 className="mb-3">Recuperar Contraseña</h2> {/* Título del formulario */}

                        <div className="form-group">
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                className="w-100"
                                required
                            />
                        </div>

                        {error && (
                            <div className="form-group">
                                <Alert severity="error">{error}</Alert> {/* Muestra el mensaje de error si existe */}
                            </div>
                        )}

                        <div className="d-flex align-items-center mt-3 mb-3">
                            <Button type="submit" disabled={isLoading} className="btn-blue w-100 btn-lg btn-big">
                                {isLoading ? <CircularProgress /> : 'Enviar correo de recuperación'} {/* Botón de envío */}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword; // v. Exportación del componente
