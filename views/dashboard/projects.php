<h1 class="m-title"><?php echo $title; ?></h1>

<!-- FILTRO -->
 <div class="filter-section">
    <div class="filter-item">
        <label for="search-filter"><i class="fa-solid fa-magnifying-glass"></i></label>
        <input type="text" id="search-filter" placeholder="Buscar">
    </div>

    <div class="filter-item">
        <label for="status-filter"><i class="fa-solid fa-filter"></i></label>
        <select id="status-filter">
            <option value="all">Todos</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Activo">En progreso</option>
            <option value="Completado">Completados</option>
            <option value="" disabled>Prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
        </select>
    </div>
</div>

<div class='projects-container'></div>

<?php
    $script = "
    <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>    
    <script type='module' src='/build/js/pages/dashboard/projects.js'></script>
    ";
?>