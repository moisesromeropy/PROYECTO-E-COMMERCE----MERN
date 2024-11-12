// I. Importaciones necesarias
import React, { useState, useContext } from 'react';
import { TextField, Button, CircularProgress, Alert } from '@mui/material'; // Importaciones de componentes de Material-UI
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto personalizado
import { postData } from '../../utils/api'; // Importación de la función postData para hacer peticiones a la API
import { useNavigate, useParams } from 'react-router-dom'; // Importaciones de hooks de react-router-dom
import Logo from '../../assets/images/logo.png'; // Importación del logo

// II. Definición del componente ResetPassword
const ResetPassword = () => {
  // II.a Definición de estados
  const [password, setPassword] = useState(''); // Estado para la nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para confirmar la nueva contraseña
  const [isLoading, setIsLoading] = useState(false); // Estado para el indicador de carga
  const [error, setError] = useState(''); // Estado para manejar errores
  const context = useContext(MyContext); // Uso del contexto personalizado
  const navigate = useNavigate(); // Uso del hook useNavigate para la navegación
  const { token } = useParams(); // Obtiene el token desde los parámetros de la URL

  // III. Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validación de coincidencia de contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      // Envío de la nueva contraseña a la API
      const res = await postData(`/api/user/reset-password/${token}`, { newPassword: password });
      if (!res.error) {
        context.setAlertBox({
          open: true,
          error: false,
          msg: 'Contraseña restablecida con éxito',
        });
        setTimeout(() => {
          navigate('/signIn');
        }, 2000);
      } else {
        setError(res.error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: res.error,
        });
      }
    } catch (error) {
      setError('Ocurrió un error. Inténtalo de nuevo.');
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Ocurrió un error. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // IV. Renderizado del componente ResetPassword
  return (
    <section className="section resetPasswordPage">
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center mb-4">
            <img src={Logo} style={{ width: '100px' }} alt="Logo" /> {/* Logo de la empresa */}
          </div>

          <form className="mt-2" onSubmit={handleSubmit}>
            <h2 className="mb-3">Restablecer Contraseña</h2>

            <div className="form-group">
              <TextField
                id="password"
                label="Nueva contraseña"
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
                className="w-100"
                required
              />
            </div>

            <div className="form-group">
              <TextField
                id="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="standard"
                className="w-100"
                required
              />
            </div>

            {error && (
              <div className="form-group">
                <Alert severity="error">{error}</Alert> {/* Muestra un mensaje de error si las contraseñas no coinciden */}
              </div>
            )}

            <div className="d-flex align-items-center mt-3 mb-3">
              <Button type="submit" disabled={isLoading} className="btn-blue w-100 btn-lg btn-big">
                {isLoading ? <CircularProgress /> : 'Restablecer Contraseña'} {/* Botón de envío del formulario */}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// V. Exportación del componente ResetPassword
export default ResetPassword;
