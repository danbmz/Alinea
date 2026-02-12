<div class="content">
    <!-- Sidebar - es un template -->
    <?php require_once __DIR__ . '/templates/sidebar.php'; ?>
    <main class="main_cont">
        <!-- Template del header -->
        <?php require_once __DIR__ . '/templates/dash_header.php' ?>
        <!-- Demas contenido personalizado de cada vista -->
        <h1 class="m_title"><?php echo $title; ?></h1>

        <!-- Contenedor para los proyectos -->
        <div class='task-container' >
            <div class="project-desc">
                <p><?php echo $description; ?></p>
                <button class="btn" id="new-task">
                    &#43; Nueva Tarea
                </button>
            </div>
        </div>
        <div class="tasks-list" id="tasks-list"></div>
        
    </main>
</div>

<?php
    $script = "
        <script type='module' src='/build/js/pages/dashboard/projectView.js'></script>
    ";
?>