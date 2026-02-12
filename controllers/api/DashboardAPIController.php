<?php

namespace ApiControllers;

use Model\Project;
use Model\Task;

class DashboardAPIController {
    public function getProjectsAPI(){
        try {        
            // Iniciamos session para acceder al id del usuario
            session_start();
            $userId = $_SESSION['id'];

            if (!$userId) {
                return $this->response(401, 'Usuario no autenticado');
            }

            // Obtener proyectos del usuario con nuevo metodo que obtiene todos los resultados y no solo 1 como where.
            $projects = Project::belongsTo('user_id', $userId);
            // Si no hay proyectos devolvemos un mensaje
            if(!$projects) {
                return $this->response(200, 'Aún no tienes proyectos.', ['projects' => []]);
            }
            // Si si hay proyectos, los mandamos al Front
            return $this->response(200, 'Proyectos obtenidos exitosamente.', ['projects' => $projects]);

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
            // Si existe
            $project->user_id = $_SESSION['id']; // Asignar el ID del usuario desde la sesión
            $project->url = md5(uniqid()); // Generar una URL unica para identificar el proyecto
            $result = $project->save(); // Guardamos

            // Responder con mensajes de éxito o error
            if($result) {
                return $this->response(201, 'Tu proyecto fue creado exitosamente.', ['url' => $project->url]);
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

    public function createTaskAPI() {
        try{
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                return $this->response(400, 'Datos inválidos');
            }

            // Consultamos el proyecto para asegurarnos que exista y que el usuario tenga permiso para agregar tareas
            $project = Project::where('url', $data['project_id']);
            session_start();
            if (!$project || $project->user_id !== $_SESSION['id']) {
                return $this->response(403, 'No tienes permiso para agregar tareas a este proyecto.');
            }

            // Validación básica del formulario
            $task = new Task($data);
            $alerts = $task->validateNewTask();

            if (!empty($alerts['error'])) {
                return $this->response(422, 'Errores de validación', ['errors' => $alerts['error']]);
            }

            // Si no hay errores, asignamos el ID del proyecto a la tarea y la guardamos
            $task->project_id = $project->id;
            $result = $task->save();

            if($result) {
                return $this->response(201, 'Tarea creada exitosamente.', ['task' => $task]);
            } else {
                return $this->response(500, 'Error al crear nueva tarea.');
            }

        } catch (\Throwable $e){
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

    public function getTasksAPI() {
        try {        
            // Iniciamos session para acceder al id del usuario
            session_start();
            $userId = $_SESSION['id'];

            if (!$userId) {
                return $this->response(401, 'Usuario no autenticado');
            }

            // Obtener el proyecto que contiene las tareas y Verificamos que hemos obtenido el resultado correctamente
            $project = Project::where('user_id', $userId);
            if(!$project) {
                return $this->response(401, 'Este proyecto no fue encontrado');
            }

            // Obtener tareas del usuario con nuevo metodo que obtiene todos los resultados y no solo 1 como where.
            $tasks = Task::belongsTo('project_id', $project->id);
            if(!$tasks) {
                return $this->response(200, 'Aún no tienes tareas.', ['tasks' => []]);
            }

            // Si si hay tareas, los mandamos al Front
            return $this->response(200, 'Tareas obtenidas exitosamente.', ['tasks' => $tasks]);

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
