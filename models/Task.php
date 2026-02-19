<?php

namespace Model;

use Model\ActiveRecord;

class Task extends ActiveRecord {
    protected static $tableName = 'tasks';
    protected static $dbColumns = ['id', 'task_name', 'description', 'project_id', 'task_status', 'created_at'];

    public $id;
    public $task_name;
    public $description;
    public $project_id;
    public $task_status;
    public $created_at;

    public function __construct($args = []){
        $this->id = $args['id'] ?? null;
        $this->task_name = $args['task_name'] ?? '';
        $this->description = $args['description'] ?? '';
        $this->project_id = $args['project_id'] ?? null;
        $this->task_status = $args['task_status'] ?? 'Pendiente';
        $this->created_at = $args['created_at'] ?? date('Y-m-d');
    }

    public function validateNewTask(){
        if(!trim($this->task_name)) {
            self::$alerts['error'][] = 'El nombre de la tarea es obligatorio';
        }
        if(!trim($this->description)) {
            self::$alerts['error'][] = 'Debes agregar una descripción';
        }

        if(strlen($this->description) < 1 || strlen($this->description) > 1000) {
            self::$alerts['error'][] = 'Usa una descripción concisa para tu tarea';
        }

        return self::$alerts;
    }
}
