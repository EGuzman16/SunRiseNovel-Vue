<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Maneja las solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conecta a la base de datos con usuario, contraseña y nombre de la BD
$servidor = "localhost"; 
$usuario = "root"; 
$contrasenia = ""; 
$nombreBaseDatos = "novel_blog";
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);

// Consulta datos y recepciona una clave para consultar dichos datos con dicha clave
if (isset($_GET["consultar"])){
    $sqlComunidades = mysqli_query($conexionBD,"SELECT * FROM comunidades WHERE ID=".$_GET["consultar"]);
    if(mysqli_num_rows($sqlComunidades) > 0){
        $comunidades = mysqli_fetch_all($sqlComunidades,MYSQLI_ASSOC);
        echo json_encode($comunidades);
        exit();
    }
    else{  echo json_encode(["success"=>0]); }
}

// Borrar pero se le debe de enviar una clave (para borrado)
if (isset($_GET["borrar"])){
    $sqlComunidades = mysqli_query($conexionBD,"DELETE FROM comunidades WHERE ID=".$_GET["borrar"]);
    if($sqlComunidades){
        echo json_encode(["success"=>1]);
        exit();
    }
    else{  echo json_encode(["success"=>0]); }
}

// Inserta un nuevo registro y recepciona en método POST los datos de nombre, web e imagen
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET["insertar"])) {
    $data = json_decode(file_get_contents("php://input"));
    $nombre = $data->nombre;
    $web = $data->web;
    $imagen = $data->imagen;
    if (($nombre != "") && ($web != "") && ($imagen != "")) {
        $sqlComunidades = mysqli_query($conexionBD, "INSERT INTO comunidades(nombre, web, imagen) VALUES('$nombre', '$web', '$imagen')");
        echo json_encode(["success" => 1]);
    } else {
        echo json_encode(["success" => 0, "message" => "Datos incompletos"]);
    }
    exit();
}

// Actualiza datos pero recepciona datos de nombre, web, imagen y una clave para realizar la actualización
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET["actualizar"])) {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $nombre = $data->nombre;
    $web = $data->web;
    $imagen = $data->imagen;
    $sqlComunidades = mysqli_query($conexionBD,"UPDATE comunidades SET nombre='$nombre', web='$web', imagen='$imagen' WHERE ID='$id'");
    echo json_encode(["success"=>1]);
    exit();
}

// Consulta todos los registros de la tabla comunidades
$sqlComunidades = mysqli_query($conexionBD,"SELECT * FROM comunidades");
if(mysqli_num_rows($sqlComunidades) > 0){
    $comunidades = mysqli_fetch_all($sqlComunidades,MYSQLI_ASSOC);
    echo json_encode($comunidades);
}
else{ echo json_encode([["success"=>0]]); }
?>