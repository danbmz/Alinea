<div class="alerts-container">
    <?php 
        foreach($alerts as $key => $messages){
            foreach($messages as $message){ ?>
                <span class="alert <?php echo $key; ?>"><?php echo $message; ?></span>
            <?php
            }
        }
    ?>
</div>