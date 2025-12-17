<?php

namespace ApiControllers;

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


    public static function loginAPI() {
        // Lógica para iniciar sesión
        echo 'Login API';
    }

    public static function forgotPasswordAPI() {
        // Lógica para recuperar contraseña
        echo 'Forgot Password API';
    }

    public static function resetPasswordAPI() {
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
