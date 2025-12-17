<?php
namespace Model;
class ActiveRecord {

    // Base DE DATOS
    protected static $db;
    protected static $tableName = '';
    protected static $dbColumns = [];

    // Alertas y Mensajes
    protected static $alerts = [];
    
    // Definir la conexión a la BD - includes/database.php
    public static function setDB($database) {
        self::$db = $database;
    }

    public static function setAlert($type, $message) {
        static::$alerts[$type][] = $message;
    }
    // Validación
    public static function getAlerts() {
        return static::$alerts;
    }

    public function validate() {
        static::$alerts = [];
        return static::$alerts;
    }

    // Registros - CRUD
    public function save() {
        $result = '';
        if(!is_null($this->id)) {
            // actualizar
            $result = $this->update();
        } else {
            // Creando un nuevo registro
            $result = $this->create();
        }
        return $result;
    }

    public static function all() {
        $query = "SELECT * FROM " . static::$tableName;
        $result = self::querySQL($query);
        return $result;
    }

    // Busca un registro por su id
    public static function find($id) {
        $query = "SELECT * FROM " . static::$tableName  ." WHERE id = ${id}";
        $result = self::querySQL($query);
        return array_shift( $result ) ;
    }

    // Obtener Registro
    public static function get($limit) {
        $query = "SELECT * FROM " . static::$tableName . " LIMIT ${limit}";
        $result = self::querySQL($query);
        return array_shift( $result ) ;
    }

    // Busqueda Where con Columna 
    public static function where($column, $value) {
        $query = "SELECT * FROM " . static::$tableName . " WHERE ${column} = '${value}'";
        $result = self::querySQL($query);
        return array_shift( $result ) ;
    }

    // SQL para Consultas Avanzadas.
    public static function SQL($query) {
        $result = self::querySQL($query);
        return $result;
    }

    // crea un nuevo registro
    public function create() {
        // Sanitizar los datos
        $properties = $this->cleanProperties();

        // Insertar en la base de datos
        $query = " INSERT INTO " . static::$tableName . " ( ";
        $query .= join(', ', array_keys($properties));
        $query .= " ) VALUES (' "; 
        $query .= join("', '", array_values($properties));
        $query .= " ') ";

        // result de la consulta
        $result = self::$db->query($query);

        return [
           'result' =>  $result,
           'id' => self::$db->insert_id
        ];
    }

    public function update() {
        // Sanitizar los datos
        $properties = $this->cleanProperties();

        // Iterar para ir agregando cada campo de la BD
        $values = [];
        foreach($properties as $key => $value) {
            $values[] = "{$key}='{$value}'";
        }

        $query = "UPDATE " . static::$tableName ." SET ";
        $query .=  join(', ', $values );
        $query .= " WHERE id = '" . self::$db->escape_string($this->id) . "' ";
        $query .= " LIMIT 1 "; 

        // debuguear($query);

        $result = self::$db->query($query);
        return $result;
    }

    // Eliminar un registro - Toma el ID de Active Record
    public function delete() {
        $query = "DELETE FROM "  . static::$tableName . " WHERE id = " . self::$db->escape_string($this->id) . " LIMIT 1";
        $result = self::$db->query($query);
        return $result;
    }

    public static function querySQL($query) {
        // Consultar la base de datos
        $result = self::$db->query($query);

        // Iterar los results
        $array = [];
        while($row = $result->fetch_assoc()) {
            $array[] = static::createObject($row);
        }

        // liberar la memoria
        $result->free();

        // retornar los results
        return $array;
    }

    protected static function createObject($row) {
        // Instancia un objeto vacio con la forma de la clase que lo llama
        $object = new static;

        foreach($row as $key => $value ) {
            if(property_exists( $object, $key  )) {
                $object->$key = $value;
            }
        }

        return $object;
    }



    // Identificar y unir los atributos de la BD
    public function properties() {
        $properties = [];
        foreach(static::$dbColumns as $column) {
            if($column === 'id') continue;
            $properties[$column] = $this->$column;
        }
        return $properties;
    }

    public function cleanProperties() {
        $properties = $this->properties();
        $sanitizedData = [];
        foreach($properties as $key => $value ) {
            $sanitizedData[$key] = self::$db->escape_string($value);
        }
        return $sanitizedData;
    }

    public function sync($args=[]) { 
        foreach($args as $key => $value) {
          if(property_exists($this, $key) && !is_null($value)) {
            $this->$key = $value;
          }
        }
    }
}