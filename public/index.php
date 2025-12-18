<?php 

require_once __DIR__ . '/../includes/app.php';

use MVC\Router;
$router = new Router();

// RUTAS DE AUTENTICACIÓN - iniciar sesion
$router->get('/login', [Controllers\AuthController::class, 'login']);
// crear cuenta nueva
$router->get('/register', [Controllers\AuthController::class, 'register']);
// Mensajes - confirmar cuenta
$router->get('/verify-account', [Controllers\AuthController::class, 'verifyAccount']);
// reestablecer password
$router->get('/forgot', [Controllers\AuthController::class, 'forgotPassword']);
$router->get('/reset', [Controllers\AuthController::class, 'resetPassword']);

// API - RUTAS DE AUTENTICACIÓN
$router->post('/api/login', [ApiControllers\AuthApiController::class, 'loginAPI']);
$router->post('/api/register', [ApiControllers\AuthApiController::class, 'registerAPI']);
$router->post('/api/forgot', [ApiControllers\AuthApiController::class, 'forgotPasswordAPI']);
$router->post('/api/reset', [ApiControllers\AuthApiController::class, 'resetPasswordAPI']);
$router->post('/api/verify-account', [ApiControllers\AuthApiController::class, 'verifyAccountAPI']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();