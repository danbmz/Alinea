<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\DashboardController;
use MVC\Router;
$router = new Router();

// VISTAS DE AUTENTICACIÓN - iniciar sesion
$router->get('/login', [Controllers\AuthController::class, 'login']);
// crear cuenta nueva
$router->get('/register', [Controllers\AuthController::class, 'register']);
// Mensajes - confirmar cuenta
$router->get('/verify-account', [Controllers\AuthController::class, 'verifyAccount']);
// reestablecer password
$router->get('/forgot', [Controllers\AuthController::class, 'forgotPassword']);
$router->get('/reset', [Controllers\AuthController::class, 'resetPassword']);

// VISTAS DEL DASHBOARD - usuario
$router->get('/user/dashboard', [Controllers\DashboardController::class, 'dashboard']);
$router->get('/user/projects', [Controllers\DashboardController::class, 'projects']);
$router->get('/user/projects/create', [Controllers\DashboardController::class, 'createProject']);




// API - RUTAS DE AUTENTICACIÓN
$router->post('/api/login', [ApiControllers\AuthApiController::class, 'loginAPI']);
$router->post('/api/logout', [ApiControllers\AuthApiController::class, 'logoutAPI']);
$router->post('/api/register', [ApiControllers\AuthApiController::class, 'registerAPI']);
$router->post('/api/forgot', [ApiControllers\AuthApiController::class, 'forgotPasswordAPI']);
$router->post('/api/reset', [ApiControllers\AuthApiController::class, 'resetPasswordAPI']);
$router->post('/api/verify-account', [ApiControllers\AuthApiController::class, 'verifyAccountAPI']);
$router->post('/api/validate-token', [ApiControllers\AuthApiController::class, 'validateTokenAPI']);

// API - RUTAS DEL DASHBOARD
$router->post('/api/projects', [ApiControllers\DashboardApiController::class, 'getProjectsAPI']);
$router->post('/api/projects/create', [ApiControllers\DashboardAPIController::class, 'createProjectAPI']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();