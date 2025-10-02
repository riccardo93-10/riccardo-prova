<?php
// api.php
// Abilita CORS
header("Access-Control-Allow-Origin: *"); // oppure specifica: "https://tuodominio.com"
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Leggo il parametro "type" dalla query string
$type = isset($_GET['type']) ? $_GET['type'] : null;

$data;
switch ($type) {
    case "occupazioni":
        // Array di stringhe da restituire
        $data = ['Dipendente privato','Dipendente pubblico','Pensionato','Sfasulato...'];
        break;
    
    case "contratti":
        // Array di stringhe da restituire
        $data = ['Indeterminato','Determinato','Altro '];
        break;
 }

// Restituisce la risposta JSON
echo json_encode($data);

?>