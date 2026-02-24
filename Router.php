<?php

namespace MVC;

class Router
{
    public array $routes = [];

    public function get($url, $fn){
        $this->routes['GET'][$url] = $fn;
    }

    public function post($url, $fn) {
        $this->routes['POST'][$url] = $fn;
    }

    public function put($url, $fn) {
        $this->routes['PUT'][$url] = $fn;
    }

    public function delete($url, $fn) {
        $this->routes['DELETE'][$url] = $fn;
    }

    public function comprobarRutas() {

        $currentUrl = $_SERVER['PATH_INFO'] ?? '/';
        $httpMethod = $_SERVER['REQUEST_METHOD'];

        if (!isset($this->routes[$httpMethod])) {
            http_response_code(405);
            echo "Método no permitido";
            return;
        }

        foreach ($this->routes[$httpMethod] as $route => $fn) {

            // Convertir {id} en expresión regular
            $routePattern = preg_replace('#\{[a-zA-Z_]+\}#', '([^/]+)', $route);
            $routePattern = "#^" . $routePattern . "$#";

            if (preg_match($routePattern, $currentUrl, $matches)) {

                array_shift($matches); // quitar coincidencia completa

                [$controller, $controllerMethod] = $fn;

                if (is_string($controller)) {
                    $controller = new $controller;
                }

                call_user_func_array([$controller, $controllerMethod], array_merge([$this], $matches));

                return;
            }
        }

        http_response_code(404);
        echo "Página No Encontrada o Ruta no válida";
    }


    // public function comprobarRutas() {

    //     $currentUrl = $_SERVER['PATH_INFO'] ?? '/';
    //     $method = $_SERVER['REQUEST_METHOD'];

    //     $fn = $this->routes[$method][$currentUrl] ?? null;

    //     if ( $fn ) {
    //         [$controller, $method] = $fn;

    //         if (is_string($controller)) {
    //             $controller = new $controller;
    //         }

    //         call_user_func([$controller, $method], $this);
    //     } else {
    //         echo "Página No Encontrada o Ruta no válida";
    //     }
    // }

    public function render($view, $datos = [], $layout = 'public'){

        // Extraer variables dinámicamente con doble signo $$
        foreach ($datos as $key => $value) {
            $$key = $value;
        }

        ob_start();

        include_once __DIR__ . "/views/$view.php";
        $contenido = ob_get_clean();

        include_once __DIR__ . "/views/layouts/{$layout}.php";
    }
}
