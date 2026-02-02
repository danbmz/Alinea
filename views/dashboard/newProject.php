<div class="content">
    <!-- Sidebar - es un template -->
    <?php require_once __DIR__ . '/templates/sidebar.php'; ?>
    <main class="main_cont">
        <!-- Template del header -->
        <?php require_once __DIR__ . '/templates/dash_header.php' ?>
        <!-- Demas contenido personalizado de cada vista -->
        <h1 class="m_title"><?php echo $title; ?></h1>

        <!-- Formulario de creación de proyecto -->
        <div class="m_form-project">
            <div class="form-container">
                <form method="POST" class="general-form">
                    <div class="alerts-container"></div>

                    <div class="form-group">
                        <label for="name" class="form-label">Nombre del proyecto:</label>
                        <input type="text" id="name" name="project_name" class="form-input" >
                    </div>
                    <div class="form-group">
                        <label for="description" class="form-label">Especificaciones:</label>
                        <textarea id="description" name="description" class="form-input" ></textarea>
                    </div>
                    <div class="form-group">
                        <label for="priority" class="form-label">Prioridad:</label>
                        <select name="priority" id="priority" class="form-input" >
                            <option value="" disabled selected>Seleccionar</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="estimated_end_date" class="form-label">Fecha de entrega:</label>
                        <input type="date" id="estimated_end_date" name="estimated_end_date" value="" class="form-input" >
                    </div>
                    <div class="form-group">
                        <label for="color" class="form-label">Color de la tarjeta:</label>
                        <input type="color" id="color" name="color" class="form-input" value="#1E90FF">
                    </div>
                    
                    <div class="form_actions">
                        <input type="submit" class="form-button" value="Crear Proyecto">
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

<?php
    $script = "
        <script type='module' src='/build/js/pages/dashboard/newProject.js'></script>
    ";
?>