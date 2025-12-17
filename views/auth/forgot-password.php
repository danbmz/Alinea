<div class="center-form">
    <div class="form-container">
        <h2 class="form-title">¿Olvidaste tu contraseña?</h2>
        <p class="form-subtitle">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

        <form action="/forgot" method="post" class="general-form">
            <div class="form-group">
                <label for="email" class="form-label">Correo electrónico: </label>
                <input type="email" id="email" name="email" class="form-input" required>
            </div>

            <div class="form-actions">
                <input type="submit" value="Enviar" class="form-button">
            </div>
        </form>
    </div>
</div>

<?php 
    $script = "
        <script src='/build/js/pages/forgot.js'></script>
    ";
?>