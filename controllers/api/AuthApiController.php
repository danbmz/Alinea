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
        // Lógica para iniciar sesión
        echo 'Login API';
    }

    public function forgotPasswordAPI() {
        // Lógica para recuperar contraseña
        echo 'Forgot Password API';
    }

    public function resetPasswordAPI() {
        // Lógica para restablecer contraseña
        echo 'Reset Password API';
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
