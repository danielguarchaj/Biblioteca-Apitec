//funcion que se encarga de retornar una cadena fecha con fecha de hoy con el formato dd/mm/aaaa
function ObtenerFechaHoy() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    return dia + '/' + mes + '/' + anio;
}

//Funcion que recibe como parametro un formato de fecha dd/mm/aaaa y retorna la misma fecha en formato mm/dd/aaaa
function ObtenerFechaFormatoUSA(_fecha) {
    var fecha = _fecha.split('/');
    var dia = fecha[0];
    var mes = fecha[1];
    var anio = fecha[2];
    return mes + '/' + dia + '/' + anio;
}

function ObtenerDiferenciaDias(_fecha_devolucion, _fecha_hoy) {
    var fecha_devolucion = new Date(_fecha_devolucion);
    var fecha_hoy = new Date(_fecha_hoy);
    var timeDiff = fecha_hoy.getTime() - fecha_devolucion.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/*
    Funcion ActualizarEstadoPrestamo que no recibe parametros
    Carga prestamos desde localStorage si los hay
    Recorre el array de prestamos y obtiene la diferencia de dias entre devolucion y prestamo
    Si la diferencia es mayor a cero y el estado sigue en 1 osea que sigue en prestamo
    Significa que ya se encuentra en mora y se actualiza el estado a 2
    Se sobreescriben datos a localStorage
*/
function ActualizarEstadoPrestamo() {
    var prestamos;
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;
    $.each(prestamos, function (index, prestamo) {
        var diff = ObtenerDiferenciaDias(ObtenerFechaFormatoUSA(prestamo.fecha_devolucion), ObtenerFechaFormatoUSA(ObtenerFechaHoy()));
        if(diff > 0 && prestamo.estado == 1)prestamo.estado = 2;
        if(diff < 0 && prestamo.estado == 1)prestamo.dias_restantes = Math.abs(diff);
    });
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
}


/*
    Funcino ActualizarEstadoUsuarioMoroso que no recibe parametros y no retorna ningun valor
    Carga usuarios y prestamos desde localStorage si los hay
    Recorre el arreglo de usuarios
        En cada vuelta recorre todo el arreglo de prestamos para determinar el estado de cada libro perteneciente al usuario
        Si se un libro se encuentra en estado 2 osea moroso el usuario sera pasado a estado 2 osea moroso
    Se sobreescriben los datos en localStorage
*/
function ActualizarEstadoUsuarioMoroso() {
    var usuarios;
    var prestamos;
    if(localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;
    if(localStorage.usuarios != null) usuarios = JSON.parse(localStorage.usuarios);
    else return;

    $.each(usuarios, function (index, usuario) {
        $.each(prestamos, function (i, prestamo) {
            if(usuario.id==prestamo.usuario_id){
                if(prestamo.estado==2)usuario.estado=2;
            }
        })
    })
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

//Llamada a las funciones
ActualizarEstadoUsuarioMoroso();
ActualizarEstadoPrestamo();
