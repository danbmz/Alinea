<div class="center-form">
    <div class="form-container">
        <h2 class="form-title">Crear Cuenta</h2>
        <div class="form-content">
            <div class="alerts-container"></div>
    
            <form method="POST" class="general-form">
                
                <div class="form-group">
                    <label for="name" class="form-label">Nombre:</label>
                    <input type="text" id="name" name="name" value="" class="form-input" placeholder="Ej. Jose Lopez" >
                </div>
    
                <div class="form-group">
                    <label for="email" class="form-label">Correo:</label>
                    <input type="email" id="email" name="email" value="" class="form-input" placeholder="Ej. correo@gmail.com" >
                </div>
    
                <div class="form-group">
                    <label for="password" class="form-label">Contraseña:</label>
                    <input type="password" id="password" name="password" class="form-input" placeholder="********" >
                </div>
    
                <div class="form-group">
                    <label for="confirm_password" class="form-label">Verificar Contraseña:</label>
                    <input type="password" id="confirm_password" name="confirm_password" class="form-input" placeholder="********" >
                </div>
    
                <div class="form-actions">
                    <input type="submit" value="Registrarse" class="form-button">
                </div>
            </form>
        </div>

        <div class="auth-links">
            <a href="/login" class="link">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
    </div>
</div>

<?php 
    $script = "
        <script type='module' src='/build/js/pages/auth/register.js'></script>
    ";
?>