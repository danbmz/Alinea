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
            <option value="Completado">Completados</option>
            <option value="Cancelado">Cancelados</option>
        </select>
    </div>
</div>

<div class='projects-container'></div>

<?php
    $script = "
        <script type='module' src='/build/js/pages/dashboard/projects.js'></script>
    ";
?>