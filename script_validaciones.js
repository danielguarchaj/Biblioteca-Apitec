/*
    Funcion que recibe como parametro un evento del teclado
    Valida unicamente la tecla backspace y digitos
    Retorna true si la tecla recibida es correcta
*/
function ValidarEntradaEntero(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    var patron = /\d/;
    tecla = String.fromCharCode(tecla);
    return patron.test(tecla);
}

/*
    Funcion que recibe la cadena ingresada en el campo CUI
    Valida unicamente digitos de tamano 13 exactamente
    retorna true si la cadena es correcta
*/
function ValidarCui(_cui) {
    var patron = /^(\d){13}$/;
    return (patron.test(_cui));
}

/*
    Funcion que recibe como parametro un evento del teclado
    Valida unicamente las siguientes tecllas:
        -Backspace 8
        -Espacio 32
        -Comilla simple ' 39
        -Tilde inversa ` 96
        -Tilde 296
        -Letras mayusculas y minusculas de a - z
    Retorna true si la recibida es correcta
*/
function ValidarEntradaLetras(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    if (tecla == 32) return true;
    if (tecla == 39) return true;
    if (tecla == 96) return true;
    if (tecla == 239) return true;
    var patron = /[a-zA-z]/;
    tecla = String.fromCharCode(tecla);
    return patron.test(tecla);
}

/*
    Funcion que recibe como parametro un evento del teclado
    Valida unicamente las siguientes teclas:
        -Backspace 8
        -Letras mayusculas y minusculas de a - z
        -Arroba @ 64
        -Punto . 46
        -Guion bajo _ 95
        -Digitos 0-9
     Retorna true si la recibida es correcta
*/
function ValidarEntradaCorreo(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    if (tecla == 64) return true;
    if (tecla == 46) return true;
    if (tecla == 95) return true;
    if (tecla >= 48 && tecla <= 57) return true;
    var patron = /[a-zA-z]/;
    tecla = String.fromCharCode(tecla);
    return patron.test(tecla);
}

/*
    Funcion que recibe la cadena ingresada en el campo Telefono
    Valida unicamente digitos de tamano 8 exactamente
    retorna true si la cadena es correcta
*/
function ValidarTelefono(_telefono) {
    var patron = /^[\d]{8}$/;
    return patron.test(_telefono);
}

/*
    Funcion que recibe la cadena ingresada en el campo Correo
    Valida que la cadena ingresada tenga el formato correcto de correo segun la expresion regular
    retorna true si la cadena es correcta
*/
function ValidarCorreo(_correo) {
    var patron = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return patron.test(_correo);
}

/*
    Funcion que recibe la cadena ingresada en el campo password
    Valida que la cadena tenga el formato correcto segun la expresion regular
    retorna true si la cadena es correcta
*/
function ValidarPassword(_password) {
    //La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.
    //Puede tener otros símbolos.
    var patron = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return patron.test(_password);
}

/*
    Funcion que recibe un evento del teclado
    Valida unicamente las siguientes teclas:
    - Backspace 8
    - Diagonal / 47
    - Digitos del 0 al 9
    Retorna true si la tecla recibida es correcta
*/
function ValidarEntradaFecha(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    if (tecla == 47) return true;
    var patron = /\d/;
    tecla = String.fromCharCode(tecla);
    return patron.test(tecla);
}

/*
    Funcion que recibe la cadena ingresada en el campo fecha
    Valida que la cadena tenga el formato correcto segun la expresion regular
    retorna true si la cadena es correcta
*/
function ValidarFecha(_fecha) {
    var patron = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/;
    //El cero es opcional en cada elemento de fehca (dia, mes) el a;o debe tener 4 caracteres
    return patron.test(_fecha);
}

/*
    Funcion que recibe la cadena fecha de nacimiento previamente validada con el formato: dd/mm/aaaa
    Retorna true si a la fecha de hoy la edad es mayor a 18
*/
function MayorEdad(_fecha) {
    var array_fecha = _fecha.split('/');
    var dia_nac = Number(array_fecha[0]);
    var mes_nac = Number(array_fecha[1]);
    var anio_nac = Number(array_fecha[2]);
    var fecha_hoy = new Date();
    var dia_hoy = fecha_hoy.getDate();
    var mes_hoy = fecha_hoy.getMonth() + 1;
    var anio_hoy = fecha_hoy.getFullYear();
    var edad = anio_hoy - anio_nac;
    if (edad > 18) return true;
    if (edad < 18) return false;
    if (edad == 18) {
        if (mes_nac > mes_hoy) return false;
        else if (mes_nac < mes_hoy) return true;
        else {
            if (dia_hoy >= dia_nac) return true;
            else return false;
        }
    }
}

/*
    Funcion que recibe la fecha de nacimiento y determina si se debe mostrar el campo de autorizacion para menores
    Se llama a la funcion validar fecha para determinar si el formato es correcto
        Si es correcto se procede a verificar la edad
            Si no es mayor de edad se muestra el campo
        Si no es correcto se da un return y no se hace nada ya que se le notificara al usuario que la fecha ingresada
        es incorrecta cuando este presione el boton registrarme
*/
function ValidarEdad(_fecha) {
    if (!ValidarFecha(_fecha)) {
        return;
    }
    if (!MayorEdad(_fecha)) $('#div_autorizacion_menor').show();
    else $('#div_autorizacion_menor').hide();

}
