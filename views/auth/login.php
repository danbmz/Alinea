<div class="center-form">
    <div class="form-container">
        <h2 class="form-title">Iniciar Sesión</h2>
        <form method="POST" class="general-form">
            <div class="alerts-container"></div>

            <div class="form-group">
                <label for="email" class="form-label">Email:</label>
                <input type="email" id="email" name="email" value="" class="form-input" placeholder="correo@correo.com" required>
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Contraseña:</label>
                <input type="password" id="password" name="password" value="" class="form-input" placeholder="********" required>
            </div>

            <div class="form-actions">
                <input type="submit" value="Iniciar Sesión" class="form-button">
            </div>
        </form>

        <div class="auth-links">
            <a href="/register" class="link">¿Aún no tienes una cuenta? Regístrate</a>
            <a href="/forgot" class="link">¿Olvidaste tu contraseña?</a>
        </div>
    </div>
</div>

<?php 
    $script = "
        <script type='module' src='/build/js/pages/auth/login.js'></script>
    ";
?>