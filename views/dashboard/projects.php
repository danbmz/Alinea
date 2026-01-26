<div class="content">
    <!-- Sidebar - es un template -->
    <?php require_once __DIR__ . '/templates/sidebar.php'; ?>
    <main class="main_cont">
        <!-- Template del header -->
        <?php require_once __DIR__ . '/templates/dash_header.php' ?>
        <!-- Demas contenido personalizado de cada vista -->
        <h1 class="m_title"><?php echo $title; ?></h1>
    </main>
</div>

<?php
    $script = "
        <script type='module' src='/build/js/pages/dashboard/projects.js'></script>
    ";
?>