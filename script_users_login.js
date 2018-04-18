var Usuarios = [];//arreglo usuarios que contendra los objetos usuario
ObtenerUsuarios();//se cargan los usuarios de localStorage si los hay

function ObtenerUsuarios() {//funcion que se encarga de obtener el arreglo usuarios desde local storage
    var retrievedObject = localStorage.getItem('usuarios');
    if (retrievedObject != null) {
        Usuarios = JSON.parse(retrievedObject);
    }
}

function ValidarLogin() {//funcion que se usa para validar el login buscando el correo y verificando si coinciden los datos ingresados
    var correo = $('#txt_correo_login').val();
    var password = $('#txt_password_login').val();
    var encontrado = false;
    $.each(Usuarios, function(index, cuenta) {
        if (correo == cuenta.correo) {
            if (password == cuenta.password) {
                localStorage.setItem('user_logeado', index);
                encontrado = true;
            }
        }
    });
    return encontrado;
}

$(function() {
    //evento del boton btn_iniciar_login que valida los campos ingresados y procede a verificar si coinciden los datos
    //setea en 1 la variable de sesion en localStorage para users si los datos coinciden
    //redirige a usuarios_libros.html
    $('#btn_iniciar_login').click(function() {
        var mensaje = '';
        if ($('#txt_correo_login').val() == '') mensaje += 'Ingrese su correo\n';
        if ($('#txt_password_login').val() == '') mensaje += 'Ingrese su contraseña\n';
        if (mensaje!='') {
            alert(mensaje);
            return;
        }
        if (ValidarLogin()) {
            window.location.href = 'usuarios_libros.html';
            localStorage.setItem('sesion_user', 1);
        } else {
            alert('Los datos no coinciden o la contraseña es incorrecta');
        }
    });

});
