<h1 class="m-title"><?php echo $title; ?></h1>

<div class="dash-container">
    <section>
        <h2>Proximos Proyectos</h2>
        <div class="timeline">
            <div class="time-line"></div>
        </div>
    </section>
    <section>
        <h2>Continua donde lo dejaste</h2>
        <div class="todays-projects"></div>
    </section>
    <section>
        <h2>Resumen</h2>
        <div class=""></div>
    </section>
</div>

<?php
    $script = "
        <script type='module' src='/build/js/pages/dashboard/dashboard.js'></script>
    ";
?>