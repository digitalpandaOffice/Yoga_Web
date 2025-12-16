<?php
namespace App\Config;

class SMTP {
    private $host = 'smtp.edvayueducationalfoundation.in';
    private $port = 465;
    private $username = 'admissions@edvayueducationalfoundation.in';
    private $password = 'Dx3b8e9af'; // User must update this
    private $fromEmail = 'admissions@edvayueducationalfoundation.in';
    private $fromName = 'Edvayu Admissions';

    public function send($to, $subject, $htmlMessage) {
        // Simple socket based SMTP client for SSL/465
        $socket = fsockopen("ssl://{$this->host}", $this->port, $errno, $errstr, 10);
        if (!$socket) {
            error_log("SMTP Connect Failed: $errstr ($errno)");
            return false;
        }

        // Helper to send command and check response
        $sendCmd = function($cmd) use ($socket) {
            fputs($socket, $cmd . "\r\n");
            $response = fgets($socket, 512);
            // echo $response . "<br>"; // Debug
            return $response;
        };

        // Read initial greeting
        fgets($socket, 512);

        $sendCmd("EHLO " . $_SERVER['SERVER_NAME']);
        $sendCmd("AUTH LOGIN");
        $sendCmd(base64_encode($this->username));
        $sendCmd(base64_encode($this->password));

        $sendCmd("MAIL FROM: <{$this->fromEmail}>");
        $sendCmd("RCPT TO: <$to>");
        $sendCmd("DATA");

        // Headers
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$this->fromName} <{$this->fromEmail}>\r\n";
        $headers .= "To: $to\r\n";
        $headers .= "Subject: $subject\r\n";

        fputs($socket, "$headers\r\n$htmlMessage\r\n.\r\n");
        $result = fgets($socket, 512);

        $sendCmd("QUIT");
        fclose($socket);

        if (strpos($result, '250') !== false) {
            return true;
        } else {
            error_log("SMTP Send Failed: $result");
            return false;
        }
    }
}
