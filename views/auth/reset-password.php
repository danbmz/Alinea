<div class="center-form">
    <div class="form-container">
        <h2 class="form-title">Restablecer Contraseña</h2>

        <form method="post" class="general-form">
            <div class="alerts-container"></div>

            <div class="form-group">
                <label for="password" class="form-label">Ingrese tu nueva contraseña:</label>
                <input type="password" id="password" name="password" class="form-input" placeholder="********" required>
            </div>
            <div class="form-group">
                <label for="confirm-password" class="form-label">Confirma tu contraseña:</label>
                <input type="password" id="confirm-password" name="confirm-password" class="form-input" placeholder="********" required>
            </div>

            <div class="form-actions">
                <input type="submit" value="Restablecer contraseña" class="form-button">
            </div>
        </form>
    </div>
</div>

<?php 
    $script = "
        <script type='module' src='/build/js/pages/auth/reset.js'></script>
    ";
?>