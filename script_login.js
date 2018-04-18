var Administradores = [];//arreglo administradores que contendra los objetos administrador
ObtenerAdministradores();//se cargan los administradores de localStorage si los hay

function ObtenerAdministradores() {//funcion que se encarga de obtener el arreglo administradores desde local storage
    var retrievedObject = localStorage.getItem('administradores');
    if (retrievedObject != null) {
        Administradores = JSON.parse(retrievedObject);
    }
}

function ValidarLogin() {//funcion que se usa para validar el login buscando el correo y verificando si coinciden los datos ingresados
    var correo = $('#txt_correo_login').val();
    var password = $('#txt_password_login').val();
    var encontrado = false;
    $.each(Administradores, function(index, cuenta) {
        if (correo == cuenta.correo) {
            if (password == cuenta.password) {
                encontrado = true;
                return;
            }
        }
    });
    return encontrado;
}

$(function() {
    //evento del boton btn_iniciar_login que valida los campos ingresados y procede a verificar si coinciden los datos
    //setea en 1 la variable de sesion en localStorage si los datos coinciden
    //redirige a libros.html
    $('#btn_iniciar_login').click(function() {

        var error = false;
        var mensaje = '';

        if ($('#txt_correo_login').val() == '') {
            error = true;
            mensaje += 'Ingrese su correo\n';
        }
        if ($('#txt_password_login').val() == '') {
            error = true;
            mensaje += 'Ingrese su contraseña\n';
        }

        if (error) {
            alert(mensaje);
            return;
        }

        if (ValidarLogin()) {
            window.location.href = 'libros.html';
            localStorage.setItem('sesion', 1);
        } else {
            alert('Los datos no coinciden o la contraseña es incorrecta');
        }
    });

});
