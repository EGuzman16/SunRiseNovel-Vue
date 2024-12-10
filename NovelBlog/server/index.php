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

// Verifica la conexión a la base de datos
if ($conexionBD->connect_error) {
    die("Conexión fallida: " . $conexionBD->connect_error);
}

// Consulta datos y recepciona una clave para consultar dichos datos con dicha clave
if (isset($_GET["consultar"])) {
    $sqlComunidades = mysqli_query($conexionBD, "SELECT * FROM comunidades WHERE ID=" . $_GET["consultar"]);
    if (mysqli_num_rows($sqlComunidades) > 0) {
        $comunidades = mysqli_fetch_all($sqlComunidades, MYSQLI_ASSOC);
        echo json_encode($comunidades);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

// Borrar pero se le debe de enviar una clave (para borrado)
if (isset($_GET["borrar"])) {
    // Obtener la imagen antes de borrar
    $sqlImagen = mysqli_query($conexionBD, "SELECT imagen FROM comunidades WHERE ID=" . $_GET["borrar"]);
    $imagen = mysqli_fetch_assoc($sqlImagen)['imagen'];

    // Borrar el registro de la base de datos
    $sqlComunidades = mysqli_query($conexionBD, "DELETE FROM comunidades WHERE ID=" . $_GET["borrar"]);
    if ($sqlComunidades) {
        // Borrar la imagen del servidor
        if (file_exists($imagen)) {
            unlink($imagen);
        }
        echo json_encode(["success" => 1]);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

// Inserta un nuevo registro y recepciona en método POST los datos de nombre, web e imagen
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET["insertar"])) {
    $nombre = $_POST['nombre'];
    $web = $_POST['web'];
    $imagen = $_FILES['imagen'];

    if ($nombre != "" && $web != "" && $imagen['name'] != "") {
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($imagen["name"]);
        if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
            $sqlComunidades = mysqli_query($conexionBD, "INSERT INTO comunidades(nombre, web, imagen) VALUES('$nombre', '$web', '$target_file')");
            echo json_encode(["success" => 1]);
        } else {
            echo json_encode(["success" => 0, "message" => "Error al subir la imagen"]);
        }
    } else {
        echo json_encode(["success" => 0, "message" => "Datos incompletos"]);
    }
    exit();
}

// Actualiza datos pero recepciona datos de nombre, web, imagen y una clave para realizar la actualización
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET["actualizar"])) {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $web = $_POST['web'];
    $imagen = isset($_FILES['imagen']) ? $_FILES['imagen'] : null;

    if ($imagen && $imagen['name'] != "") {
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($imagen["name"]);
        if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
            // Obtener la imagen anterior
            $sqlImagen = mysqli_query($conexionBD, "SELECT imagen FROM comunidades WHERE ID=" . $id);
            $imagenAnterior = mysqli_fetch_assoc($sqlImagen)['imagen'];

            // Actualizar el registro en la base de datos
            $sqlComunidades = mysqli_query($conexionBD, "UPDATE comunidades SET nombre='$nombre', web='$web', imagen='$target_file' WHERE ID='$id'");
            if ($sqlComunidades) {
                // Borrar la imagen anterior del servidor
                if (file_exists($imagenAnterior)) {
                    unlink($imagenAnterior);
                }
                echo json_encode(["success" => 1]);
            } else {
                echo json_encode(["success" => 0, "message" => "Error al actualizar en la base de datos"]);
            }
        } else {
            echo json_encode(["success" => 0, "message" => "Error al subir la imagen"]);
        }
    } else {
        $sqlComunidades = mysqli_query($conexionBD, "UPDATE comunidades SET nombre='$nombre', web='$web' WHERE ID='$id'");
        if ($sqlComunidades) {
            echo json_encode(["success" => 1]);
        } else {
            echo json_encode(["success" => 0, "message" => "Error al actualizar en la base de datos"]);
        }
    }
    exit();
}

// Consulta todos los registros de la tabla comunidades
$sqlComunidades = mysqli_query($conexionBD, "SELECT * FROM comunidades");
if (mysqli_num_rows($sqlComunidades) > 0) {
    $comunidades = mysqli_fetch_all($sqlComunidades, MYSQLI_ASSOC);
    echo json_encode($comunidades);
} else {
    echo json_encode([["success" => 0]]);
}
?>