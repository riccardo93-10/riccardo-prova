<?php
// Imposta header per JSON
header('Content-Type: application/json');

// Legge il contenuto raw della richiesta
$input = file_get_contents("php://input");

// Decodifica JSON in oggetto PHP
$oggetto = json_decode($input);

// Controlla se la decodifica è andata a buon fine
if ($oggetto === null) {
    echo json_encode([
        "success" => false,
        "messaggio" => "JSON non valido"
    ]);
    exit;
}

// Genera valore casuale tra 50 e 10000
$valore = rand(50, 10000);

// Costruisce la risposta
$response = [
    "success" => true,
    "valore" => number_format($valore, 2, '.', ''), // 2 decimali
    "valuta" => "EUR"
];

// Restituisce JSON
echo json_encode($response);
?>