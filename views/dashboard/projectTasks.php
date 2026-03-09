<h1 class="m_title"><?php echo $title; ?></h1>

<!-- Contenedor para los proyectos -->
<div class='task-container' >
    <div class="project-desc">
        <p><?php echo $description; ?></p>
        <button class="btn" id="new-task">
            &#43; Nueva Tarea
        </button>
    </div>

    <section class="tasks-list" id="tasks-list"></section>
    <section class="completed-task-list">
        <h3>Tareas completadas</h3>
        <div class="completed-section"></div>
    </section>

</div>

<?php
    $script = "
        <script type='module' src='/build/js/pages/dashboard/projectTasks.js'></script>
    ";
?>