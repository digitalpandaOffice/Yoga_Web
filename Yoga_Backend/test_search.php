<?php
$url = 'http://localhost/Yoga_Web/Yoga_Backend/AdmitCards/search';
$data = ['registration_number' => 'Reg/7272', 'dob' => '2002-12-01'];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true 
    ],
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response:\n";
echo $result;
