<?php

namespace ApiControllers;

use Model\Project;

class DashboardAPIController {
    public function getProjectsAPI(){

    }

    public function createProjectAPI() {
        try {        
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                return $this->response(400, 'Datos inválidos');
            }

            // Validación básica
            $project = new Project($data);
            $alerts = $project->validateNewProject();

            if (!empty($alerts['error'])) {
                return $this->response(422, 'Errores de validación', ['errors' => $alerts['error']]);
            }

            // Si no hay errores, revisamos que exista el usuario
            session_start();
            if (!isset($_SESSION['id'])) {
                return $this->response(401, 'Usuario no autenticado');
            }
            // Si existe, asignamos el ID de usuario y guardamos el proyecto
            $project->user_id = $_SESSION['id']; // Asignar el ID del usuario desde la sesión
            $result = $project->save();

            // Responder con mensajes de éxito o error
            if($result) {
                return $this->response(201, 'Tu proyecto fue creado exitosamente.');
            } else {
                return $this->response(500, 'Error al crear el proyecto.');
            }

        } catch (\Throwable $e) {
            // return $this->response(500, 'Error al procesar la solicitud, intentalo de nuevo más tarde.');
            return $this->response(
                500,
                'Error interno',
                [
                    'exception' => get_class($e),
                    'message'   => $e->getMessage(),
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine()
                ]
            );
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
