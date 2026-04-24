<?php

namespace Controllers;

use MVC\Router;
use Model\Project;

class DashboardController {
    public static function dashboard(Router $router) {
        // Iniciamos el session para tener acceso a sus datos
        session_start();
        // verificamos que haya iniciado sesion
        isAuth();

        // Si esta logeado, mostramos la vista
        $router->render('dashboard/index', [
            'name' => $_SESSION['name'],
            'title' => 'ALINEA'
        ], 'dashboard');
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
        ], 'dashboard');
    } 
    public static function createProject(Router $router) {
        // Iniciamos el session para tener acceso a sus datos
        session_start();
        // verificamos que haya iniciado sesion
        isAuth();

        // Si esta logeado, mostramos la vista
        $router->render('dashboard/newProject', [
            'name' => $_SESSION['name'],
            'title' => 'Crear Proyecto'
        ], 'dashboard');
    } 
    public static function showProject(Router $router) {
        // Iniciamos el session para tener acceso a sus datos
        session_start();
        // verificamos que haya iniciado sesion
        isAuth();

        // validar que exista la URL
        $url = $_GET['id'];
        if(!$url){
            header('Location: /user/projects');
            return;
        }

        // Revisamos que exista el proyecto y que pertenezca al usuario autenticado
        $project = Project::where('url', $url);
        if (!$project || $project->user_id !== $_SESSION['id']) {
            header('Location: /user/projects');
            return;
        }

        // Si esta logeado, mostramos la vista
        $router->render('dashboard/projectTasks', [
            'name' => $_SESSION['name'],
            'title' => $project->project_name,
            'description' => $project->description
        ], 'dashboard');
    } 
}