<?php

namespace Model;

use Model\ActiveRecord;
use DateTime;

class Project extends ActiveRecord {
    protected static $tableName = 'projects';
    protected static $dbColumns = ['id', 'project_name', 'description', 'url', 'user_id', 'project_status', 'priority', 'created_at', 'estimated_end_date', 'progress', 'color'];

    public $id;
    public $project_name;
    public $description;
    public $url;
    public $user_id;
    public $project_status;
    public $priority;
    public $created_at;
    public $estimated_end_date;
    public $progress;
    public $color;

    public function __construct($args = []){
        $this->id = $args['id'] ?? null;
        $this->project_name = $args['project_name'] ?? '';
        $this->description = $args['description'] ?? '';
        $this->url = $args['url'] ?? '';
        $this->user_id = $args['user_id'] ?? null;
        $this->project_status = $args['project_status'] ?? 'Pendiente';
        $this->priority = $args['priority'] ?? 'Baja';
        $this->created_at = $args['created_at'] ?? date('Y-m-d');
        $this->estimated_end_date = $args['estimated_end_date'] ?? '';
        $this->progress = $args['progress'] ?? 0;
        $this->color = $args['color'] ?? '#1E90FF';
    }

    public function validateNewProject() {
        // Validaciones del nombre y descripción
        if (!trim($this->project_name)) {
            self::setAlert('error', 'El nombre es obligatorio desde el back');
        }
        if (strlen($this->project_name) < 5 || strlen($this->project_name) > 100) {
            self::$alerts['error'][] = 'Nombre muy corto o muy largo';
        }
        if (!trim($this->description) || strlen($this->description) > 1000) {
            self::$alerts['error'][] = 'La descripción no debe pasar los 1000 caracteres';
        }

        // Validaciones de prioridad
        if (!trim($this->priority)) {
            self::$alerts['error'][] = 'La prioridad del proyecto es obligatoria';
        }
        if ($this->priority !== 'Baja' && $this->priority !== 'Media' && $this->priority !== 'Alta') {
            self::$alerts['error'][] = 'Valor inválido para la prioridad';
        }

        // Validacion de fecha
        if (!trim($this->estimated_end_date)) {
            self::$alerts['error'][] = 'La fecha de finalización es obligatoria';
        }
        $date = DateTime::createFromFormat('Y-m-d', $this->estimated_end_date);
        if ($date === false) {
            self::$alerts['error'][] = 'Formato de fecha inválido';
        }
        if($date < new DateTime()) {
            self::$alerts['error'][] = 'Selecciona una fecha correcta';
        }

        // Validacion del color
        if (!trim($this->color)) {
            self::$alerts['error'][] = 'El color del proyecto es obligatorio';
        }
        if (!preg_match('/^#([0-9A-Fa-f]{6})$/', $this->color)) {
            self::$alerts['error'][] = 'Formato de color inválido';
        }

        return self::$alerts;
    }

    public function getTotalTasks() {
        $id = (int) $this->id;

        $query = "SELECT 
            COUNT(*) as total,
            COALESCE(SUM(completed), 0) as completed
            FROM tasks
            WHERE project_id = {$id}";

        $result = self::$db->query($query);
        $data = $result->fetch_assoc();

        return $data;
    }

    public function updateProgressAndStatus() {
        $total = $this->getTotalTasks();
            $progress = (int) $total['total'] > 0 ? ($total['completed'] / $total['total']) * 100 : 0;
            
            // actualizamos el progreso del proyecto
            $this->progress = $progress;

            // Checamos el status del proyecto
            if ($total['completed'] == $total['total'] && $total['total'] > 0) {
                $this->project_status = 'Completado';
            } elseif ($total['completed'] > 0) {
                $this->project_status = 'Activo';
            } else {
                $this->project_status = 'Pendiente';
            }
    }
}
