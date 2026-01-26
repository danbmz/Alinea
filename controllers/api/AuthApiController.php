<?php

namespace ApiControllers;

use Classes\Email;
use Model\User;

class AuthApiController {
    public function registerAPI() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                return $this->response(400, 'Datos inválidos');
            }

            // Validación básica
            $user = new User($data);
            $alerts = $user->validateInputs();

            if (!empty($alerts['error'])) {
                return $this->response(422, 'Errores de validación', ['errors' => $alerts['error']]);
            }

            // Si no hay errores, proceder con el registro
            $user->hashPassword();
            $user->createToken();

            // Enviar email de confirmación (lógica no implementada aquí)
            $email = new Email($user->email, $user->name, $user->token);
            $email->confirmarEmail();

            // Guardar el usuario en la base de datos
            $result = $user->save();

            // Responder con mensajes de éxito o error
            if($result) {
                return $this->response(201, 'Usuario registrado correctamente. Revisa tu correo para activar tu cuenta.');
            } else {
                return $this->response(500, 'Error al guardar el usuario');
            }

        } catch (\Throwable $e) {
            return $this->response(500, 'Error interno del servidor');
        }
    }

    public function verifyAccountAPI() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Obtener token del cuerpo de la solicitud
            $token = $data['token'] ?? null;

            if (!$token) {
                return $this->response(400, 'Token inválido');
            }

            // Buscar usuario por token
            $user = User::where('token', $token);

            // Buscar usuario por cofirmprobación previa
            if (!$user) {
                return $this->response(404, 'Usuario no encontrado o token inválido');
            }
            
            if ($user->confirmed ) {
                return $this->response(200, 'La cuenta ya ha sido verificada', ['status' => 'already_verified']);
            }


            // Cambiar estado de la cuenta a confirmada
            $user->confirmed = 1;

            $result = $user->save();

            if ($result) {
                return $this->response(200, 'Cuenta verificada correctamente');
            } else {
                return $this->response(500, 'Error al verificar la cuenta');
            }

        } catch (\Throwable $e) {
            return $this->response(500, 'Error interno del servidor');
        }
    }

    public function loginAPI() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
        
            if(!$data){
                return $this->response(400, 'No se recibieron los datos enviados.');
            }

            // Aca se ejecuta y usamos cosas instanciadas dentro de la validacion, pero que pasa si no existe el usuario?
            $alerts = User::validateLoginForm($data);
            if(!empty($alerts)){
                return $this->response(422, 'Errores de validación', ['errors' => $alerts['error']]);
            }

            // Si no hay errores y el usuario existe
            $user = User::where('email', $data['email']);
            $auth = $user->verifyPassword($data['password']);
            if(!$auth) {
                return $this->response(422, 'Errores de validación', ['errors'=>['La contraseña es incorrecta.']]);
            }

            // Si el usuario existe y sus credenciales coinciden, iniciamos un session 
            session_start();
            $_SESSION['id'] = $user->id;
            $_SESSION['name'] = $user->name;
            $_SESSION['email'] = $user->email;
            $_SESSION['login'] = true;

            // Indicamos el front que se inicio sesion con exito.
            return $this->response(200, 'Inicio de sesión exitoso');

        } catch (\Throwable $th) {
            // return $this->response(500, $th->getMessage());
            return $this->response(500, 'Error interno del servidor');
        }
    }

    public function logoutAPI(){
        // iniciamos el session para acceder a los datos
        session_start();

        try {
            // Vaciamos el session
            $_SESSION = [];
            // Destruimos el session
            session_destroy();

            // Devolvemos una respuesta al Front;
            return $this->response(200, 'Logout exitoso');

        } catch (\Throwable $th) {
            return $this->response(500, 'Hubo un problema al intentar cerrar la sesión');
        }
    }

    public function forgotPasswordAPI() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Obtener email y verificar que exista del cuerpo de la solicitud
            $email = $data['email'] ?? null;
            if (!$email) {
                return $this->response(400, 'Email requerido');
            }
            
            // Validar formato del email y existencia
            $alerts = User::validateEmail($email);
            if (!empty($alerts['error'])) {
                return $this->response(422, 'Errores de validación', ['errors' => $alerts['error']]);
            }
            
            // // Buscar usuario por email 
            $user = User::where('email', $email);
            // crear un nuevo token y guardamos en la base de datos
            $user->createToken();
            $user->save();

            // Enviar email con instrucciones
            $email = new Email($user->email, $user->name, $user->token);
            $result = $email->sendPasswordResetEmail();
            
            // Si no se pudo enviar el email mostramos un error
            if (!$result) {
                return $this->response(500, 'Error al enviar el correo electrónico');
            }

            return $this->response(200, 'Instrucciones enviadas a tu correo electrónico');

        } catch (\Throwable $e) {
            return $this->response(500, 'Error interno del servidor');
            // return $this->response(500, $e->getMessage());
        }
    }

    public function resetPasswordAPI() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $token = $data['token'] ?? '';
            $newPassword = $data['newPassword'] ?? '';
            $confirmPassword = $data['confirmPassword'] ?? '';
            

            if(!$token) {
                return $this->response(400, 'Token inválido');
            }
            
            // Validar nuevas contraseñas
            $alerts = User::validatePasswordReset($newPassword, $confirmPassword);
            if(!empty($alerts['error'])) {
                return $this->response(422, 'Errores de validación', ['errors' => $alerts['error']]);
                // debuguear($user);
            }

            // Buscar usuario por token
            $user = User::where('token', $token);
            if(!$user) {
                return $this->response(404, 'Usuario no encontrado o token inválido');
            }
            
            // Actualizar la contraseña
            $user->password = $newPassword;
            $user->hashPassword();
            $user->token = ""; // Invalidate the token
            
            $result = $user->save();

            if($result) {
                return $this->response(200, 'Contraseña restablecida correctamente');
            } else {
                return $this->response(500, 'Error al restablecer la contraseña, intenta de nuevo más tarde');
            }
        } catch (\Throwable $e) {
            return $this->response(500, 'Error del servidor');
        }
    }

    // Metodo reutilizable para validar token   
    public function validateTokenAPI() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $token = $data['token'] ?? null;

            if(!$token) {
                return $this->response(400, 'Token inválido');
            }

            // Buscar usuario por token
            $user = User::where('token', $token);
            if(!$user) {
                return $this->response(404, 'Token inválido o usuario no encontrado');
            }

            return $this->response(200, 'Token válido');

        } catch (\Throwable $th) {
            return $this->response(500, 'Error del servidor');
        }
    }

    // Métodos auxiliares para respuestas JSON
    protected function response(int $code, string $message, array $data = []) {
        http_response_code($code);
        return $this->json([
            'message' => $message,
            'data' => $data
        ]);
    }

    protected function json(array $data){
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

}
