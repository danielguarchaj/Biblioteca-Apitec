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
    Funcion ActualizarEstadoPrestamo que no
*/
function ActualizarEstadoPrestamo(_estado) {
    var prestamos;
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;
    $.each(prestamos, function (index, prestamo) {
        var diff = ObtenerDiferenciaDias(ObtenerFechaFormatoUSA(prestamo.fecha_devolucion), ObtenerFechaFormatoUSA(ObtenerFechaHoy()));
        if(diff > 0 && prestamo.estado == 1)prestamo.estado = 2;
    });
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
}

ActualizarEstadoPrestamo();
