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

<?php
    $script = "
        <script type='module' src='/build/js/pages/dashboard/projectTasks.js'></script>
    ";
?>