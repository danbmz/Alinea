<?php

namespace Controllers;

use Model\User;
use MVC\Router;

class AuthController {
    public static function login(Router $router) {
        $router->render('auth/login', [
            'titulo' => '| Iniciar Sesión'
        ]);
    } 
    public static function register(Router $router) {
        $router->render('auth/register', [
            'titulo' => '| Crear Cuenta'
        ]);
    }
    public static function forgotPassword(Router $router) {
        $router->render('auth/forgot-password', [
            'titulo' => '|  Recuperar Contraseña'
        ]);
    }
    public static function resetPassword(Router $router) {
        $router->render('auth/reset-password', [
            'titulo' => '| Restablecer Contraseña'
        ]);
    }
    // Funciones que muestran mensajes
    public static function verifyAccount() {
        debuguear('Verify Account Controller');
    }
    public static function message() {
        debuguear('message Controller');
    }
}