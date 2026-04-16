<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alinea <?php echo $titulo ?? ''; ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Open+Sans&display=swap" rel="stylesheet"> 
    <script src='https://kit.fontawesome.com/a77864d23f.js' crossorigin='anonymous'></script>
    <link rel="stylesheet" href="/build/css/app.css">
</head>
<body>
    <div>
        <div class="content">
            <!-- Sidebar - es un template -->
            <?php require_once __DIR__ . '../../dashboard/templates/sidebar.php'; ?>
            <main class="main_cont">
                <!-- Template del header -->
                <?php require_once __DIR__ . '../../dashboard/templates/dash_header.php' ?>
                <!-- Demas contenido personalizado de cada vista -->
                <?php echo $contenido; ?>
            </main>
        </div>
        <?php echo $script ?? ''; ?>
        <script type='module' src='/build/js/pages/dashboard/dashboardLayout.js'></script>
    </div>
</body>
</html>