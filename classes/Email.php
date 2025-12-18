<?php

namespace Classes;
use PHPMailer\PHPMailer\PHPMailer;

class Email {
    public $email;
    public $nombre;
    public $token;

    public function __construct(string $email, string $nombre, string $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function confirmarEmail(){
        // 1.Creamos una nueva instancia de PHPMailer y configuramos
        $phpmailer = new PHPMailer();
        $phpmailer->isSMTP();
        $phpmailer->Host = $_ENV['EMAIL_HOST'];
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = $_ENV['EMAIL_PORT'];
        $phpmailer->Username = $_ENV['EMAIL_USER'];
        $phpmailer->Password = $_ENV['EMAIL_PASS'];

        // 2.Configurar encabezado del email
        $phpmailer->setFrom('cuentas@Alinea.com');
        $phpmailer->addAddress($this->email, 'Alinea.com');
        $phpmailer->Subject = 'Confirma tu cuenta';

        // 3.Habilitar HTML
        $phpmailer->isHTML(true);
        $phpmailer->CharSet = 'UTF-8';

        // 4.Definir el contenido
        $contenido  = '<html>';
        $contenido .= '<body>';
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong>, has creado una cuenta en <b>Alinea</b>. Ahora solo debes confirmarla dando click en el siguiente enlace:</p>";
        $contenido .= "<p><a href='" . $_ENV['APP_URL'] . "/verify-account?token=" . $this->token . "' target='_blank'>Confirmar cuenta</a></p>";
        $contenido .= "<p>Si tú no solicitaste esta cuenta, simplemente ignora este mensaje.</p>";
        $contenido .= '</body>';
        $contenido .= '</html>';

        
        // 5.Agregamos el contenido al cuerpo del correo
        $phpmailer->Body = $contenido;
        $phpmailer->AltBody = 'Este mensaje es para que puedas confirmar la creacion de tu nueva cuenta';

        // 6.Enviar el email
        $phpmailer->send();
    }
    // Email para resetear password
    public function sendPasswordResetEmail(){
        // 1.Creamos una nueva instancia de PHPMailer y configuramos
        $phpmailer = new PHPMailer();
        $phpmailer->isSMTP();
        $phpmailer->Host = $_ENV['EMAIL_HOST'];
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = $_ENV['EMAIL_PORT'];
        $phpmailer->Username = $_ENV['EMAIL_USER'];
        $phpmailer->Password = $_ENV['EMAIL_PASS'];

        // 2.Configurar encabezado del email
        $phpmailer->setFrom('cuentas@BarberShop.com');
        $phpmailer->addAddress($this->email);
        $phpmailer->Subject = 'Reestablecer contraseña';

        // 3.Habilitar HTML
        $phpmailer->isHTML(true);
        $phpmailer->CharSet = 'UTF-8';

        // 4.Definir el contenido
        $contenido  = '<html>';
        $contenido .= '<body>';
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong>, has solicitado reestablecer tu contraseña en <b>BarberShopElite</b>. Para continuar haz click en el siguiente enlace:</p>";
        $contenido .= "<p><a href='" . $_ENV['APP_URL'] . "/reset-password?token=" . $this->token . "' target='_blank'>Reestablecer contraseña</a></p>";
        $contenido .= "<p>Si tú no solicitaste este cambio puedes ignorar este mensaje.</p>";
        $contenido .= '</body>';
        $contenido .= '</html>';

        // 5.Agregamos el contenido al cuerpo del correo
        $phpmailer->Body = $contenido;
        $phpmailer->AltBody = 'Este mensaje es para que puedas reestablecer la contraseña de tu cuenta en BarberShopElite';

        // 6.Enviar el email
        $resultado = $phpmailer->send();
        return $resultado;
    }
}
