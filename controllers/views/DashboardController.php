<?php

namespace Controllers;

use MVC\Router;

class DashboardController {
    public static function dashboard(Router $router) {
        // Iniciamos el session para tener acceso a sus datos
        session_start();
        // verificamos que haya iniciado sesion
        isAuth();

        // Si esta logeado, mostramos la vista
        $router->render('dashboard/index', [
            'name' => $_SESSION['name'],
            'title' => 'Dashboard'
        ]);
    } 
    public static function projects(Router $router) {
        // Iniciamos el session para tener acceso a sus datos
        session_start();
        // verificamos que haya iniciado sesion
        isAuth();

        // Si esta logeado, mostramos la vista
        $router->render('dashboard/projects', [
            'name' => $_SESSION['name'],
            'title' => 'Proyectos'
        ]);
    } 
    public static function createProject(Router $router) {
        // Iniciamos el session para tener acceso a sus datos
        session_start();
        // verificamos que haya iniciado sesion
        isAuth();

        // Si esta logeado, mostramos la vista
        $router->render('dashboard/new_project', [
            'name' => $_SESSION['name'],
            'title' => 'Crear Proyecto'
        ]);
    } 
    
}