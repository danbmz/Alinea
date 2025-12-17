<?php

namespace Model;

use Model\ActiveRecord;

class User extends ActiveRecord {
    protected static $tableName = 'users';
    protected static $dbColumns = ['id', 'name', 'email', 'password', 'created_at', 'confirmed', 'token'];

    public $id;
    public $name;
    public $email;
    public $password;
    public $created_at;
    public $confirmed;
    public $token;

    public function __construct($args = []){
        $this->id = $args['id'] ?? null;
        $this->name = $args['name'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->created_at = $args['created_at'] ?? date('Y-m-d H:i:s');
        $this->confirmed = $args['confirmed'] ?? 0;
        $this->token = $args['token'] ?? '';
    }

    public function validateInputs() {

        // Validar 0 campos vacios y nombre
        if(!trim($this->name) || !trim($this->email) || !trim($this->password)) {
            self::$alerts['error'][] = 'Todos los campos son obligatorios';
        }  elseif (strlen($this->name) < 2) {
            self::$alerts['error'][] = 'El nombre debe tener al menos 2 caracteres';
        } elseif (strlen($this->name) > 60) {
            self::$alerts['error'][] = 'El nombre no puede exceder 100 caracteres';
        } elseif (!preg_match("/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/u", $this->name)) {
            self::$alerts['error'][] = 'El nombre solo puede contener letras y espacios';
        }

        // Validar email
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            self::$alerts['error'][] = 'El formato del correo no es válido';
        } elseif (strlen($this->email) > 60) {
            self::$alerts['error'][] = 'El correo no puede exceder 60 caracteres';
        } elseif (self::where('email', $this->email)) {
            self::$alerts['error'][] = 'El correo ya está registrado';
        }

        // Validar password
        if (strlen($this->password) < 8) {
            self::$alerts['error'][] = 'La contraseña debe tener al menos 8 caracteres';
        } elseif (strlen($this->password) > 60) {
            self::$alerts['error'][] = 'La contraseña no puede exceder 60 caracteres';
        } elseif (!preg_match("/[A-Z]/", $this->password)) {
            self::$alerts['error'][] = 'La contraseña debe contener al menos una mayúscula';
        } elseif (!preg_match("/[a-z]/", $this->password)) {
            self::$alerts['error'][] = 'La contraseña debe contener al menos una minúscula';
        } elseif (!preg_match("/[0-9]/", $this->password)) {
            self::$alerts['error'][] = 'La contraseña debe contener al menos un número';
        }

        return self::$alerts;
    }

    public function hashPassword() {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }
    public function createToken() {
        $this->token = uniqid();
    }
}