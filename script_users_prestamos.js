var saltos_tabla_historial = 10; //variable para determinar cuantos elementos se muestran en la tabla
var inicio_actual_historial = 0; //variable para saber en que elemento se encuentra el inicio de la tabla actualmente
var fin_actual_historial = inicio_actual_historial + saltos_tabla_historial; //variable que se calcula a partir de la suma del inicio actual y
//los saltos de tabla indica el fin acutal de la tabla
var cont_historial;

/*
    Funcion ObtenerDatosLibro que recibe de parametro el id del libro y obtiene el arreglo de libros desde local storage
    Devuelve el libro como objeto que coincida con el id solicitado
*/
function ObtenerDatosLibro(_id_libro) {
    var Libros_retreived = JSON.parse(localStorage.libros);
    var libro_encontrado;
    $.each(Libros_retreived, function(index, libro) {
        if (_id_libro == libro.libro_id) libro_encontrado = libro;
    });
    return libro_encontrado;
}

/*
    Funcion ObtenerEstadoPrestamo que devuelve el nombre correspondiente al estado del prestamo
    Recibe como parametro el numero de estado y devuelve la estructura de una etiqueta td para mostrar en la tabla
*/
function ObtenerEstadoPrestamo(_estado) {
    var td_html = '';
    switch (_estado) {
        case 1:
            td_html = '<td style="color: blue">Prestado</td>';
            break;
        case 2:
            td_html = '<td style="color: red;">Mora</td>';
            break;
        case 3:
            td_html = '<td style="color: green">Devuelto</td>';
            break;
        case 4:
            td_html = '<td style="color: red">Devuelto con mora</td>';
            break;
        default:
            return;
    }
    return td_html;
}



function VerLibrosPrestados() {
    var Autores_retreived;
    if (localStorage.autores!=null)Autores_retreived = JSON.parse(localStorage.getItem('autores'));
    else return;
    var Temas_retreived;
    if (localStorage.temas!=null) Temas_retreived = JSON.parse(localStorage.getItem('temas'));
    else return;
    var Prestamos_retreived;
    if(localStorage.prestamos != null) Prestamos_retreived = JSON.parse(localStorage.getItem('prestamos'));
    else return;
    var usuario_index = localStorage.user_logeado;
    var usuarios = JSON.parse(localStorage.usuarios);
    var libro_info;
    var nombre_autor;
    var nombre_tema;
    var libros_prestados_html = `<tr>
                            <th>#</th>
                            <th>Codigo</th>
                            <th>Libro</th>
                            <th>Autor</th>
                            <th>Tema</th>
                            <th>Prestamo</th>
                            <th>Devolucion</th>
                            <th>Estado</th>
                        </tr>`;
    $.each(Prestamos_retreived, function(index, prestamo) {
        if (usuarios[usuario_index].id == prestamo.usuario_id && (prestamo.estado == 1 || prestamo.estado == 2)) {
            libro_info = ObtenerDatosLibro(prestamo.libro_id);
            nombre_autor = ObtenerInfoAutor(libro_info.autor_id);
            nombre_tema = ObtenerInfoTema(libro_info.tema_id);
            libros_prestados_html += '<tr>';
            libros_prestados_html += '<td>' + prestamo.prestamo_id + '</td>';
            libros_prestados_html += '<td>' + prestamo.token + '</td>';
            libros_prestados_html += '<td>' + libro_info.titulo + '</td>';
            libros_prestados_html += '<td>' + nombre_autor.nombres + ' ' + nombre_autor.apellidos + '</td>';
            libros_prestados_html += '<td>' + nombre_tema.tema + '</td>';
            libros_prestados_html += '<td>' + prestamo.fecha_prestamo + '</td>';
            libros_prestados_html += '<td>' + prestamo.fecha_devolucion + '</td>';
            libros_prestados_html += ObtenerEstadoPrestamo(prestamo.estado);
            libros_prestados_html += '</tr>';
        }else return false;
    });
    $('#table_mis_prestamos').html(libros_prestados_html);
}

VerLibrosPrestados();

function VerHistorialPrestamos(_inicio, _fin, _filtro) {
    var Autores_retreived;
    if (localStorage.autores!=null)Autores_retreived = JSON.parse(localStorage.getItem('autores'));
    else return;
    var Temas_retreived;
    if (localStorage.temas!=null) Temas_retreived = JSON.parse(localStorage.getItem('temas'));
    else return;
    var Prestamos_retreived;
    if(localStorage.prestamos != null) Prestamos_retreived = JSON.parse(localStorage.getItem('prestamos'));
    else return;
    cont_historial = 0;
    var usuario_index = localStorage.user_logeado;
    var usuarios = JSON.parse(localStorage.usuarios);
    var libro_info;
    var nombre_autor;
    var nombre_tema;
    var libros_devueltos_html = `<tr>
                                <th>#</th>
                                <th>Codigo</th>
                                <th>Libro</th>
                                <th>Autor</th>
                                <th>Tema</th>
                                <th>Prestamo</th>
                                <th>Devolucion</th>
                                <th>Estado</th>
                            </tr>`;
    if (_filtro == undefined) {
        $.each(Prestamos_retreived, function(index, prestamo) {
            if ((index >= _inicio) && (index < _fin)) {
                if (usuarios[usuario_index].id == prestamo.usuario_id && (prestamo.estado > 2)) {
                    libro_info = ObtenerDatosLibro(prestamo.libro_id);
                    nombre_autor = ObtenerInfoAutor(libro_info.autor_id);
                    nombre_tema = ObtenerInfoTema(libro_info.tema_id);
                    libros_devueltos_html += '<tr>';
                    libros_devueltos_html += '<td>' + prestamo.prestamo_id + '</td>';
                    libros_devueltos_html += '<td>' + prestamo.token + '</td>';
                    libros_devueltos_html += '<td>' + libro_info.titulo + '</td>';
                    libros_devueltos_html += '<td>' + nombre_autor.nombres + ' ' + nombre_autor.apellidos + '</td>';
                    libros_devueltos_html += '<td>' + nombre_tema.tema + '</td>';
                    libros_devueltos_html += '<td>' + prestamo.fecha_prestamo + '</td>';
                    libros_devueltos_html += '<td>' + prestamo.fecha_devolucion + '</td>';
                    libros_devueltos_html += ObtenerEstadoPrestamo(prestamo.estado);
                    libros_devueltos_html += '</tr>';
                    cont_historial++;
                }
            }else return false;
        });
        $('#table_historial').html(libros_devueltos_html);
        cont_historial < saltos_tabla_historial ? $('#lbl_rango_libros_historial').html(`Del ${inicio_actual_historial+1} al ${cont_historial} de ${cont_historial}`) : $('#lbl_rango_libros_historial').html(`Del ${inicio_actual_historial+1} al ${fin_actual_historial} de ${cont_historial}`);
        if (cont_historial == 0) $('#lbl_rango_libros_historial').html('Del 0 al 0 de 0');
    }else {
        $.each(_filtro, function(index, prestamo) {
            if ((index >= _inicio) && (index < _fin)) {
                if (usuarios[usuario_index].id == prestamo.usuario_id && (prestamo.estado > 2)) {
                    libro_info = ObtenerDatosLibro(prestamo.libro_id);
                    nombre_autor = ObtenerInfoAutor(libro_info.autor_id);
                    nombre_tema = ObtenerInfoTema(libro_info.tema_id);
                    libros_devueltos_html += '<tr>';
                    libros_devueltos_html += '<td>' + prestamo.prestamo_id + '</td>';
                    libros_devueltos_html += '<td>' + prestamo.token + '</td>';
                    libros_devueltos_html += '<td>' + libro_info.titulo + '</td>';
                    libros_devueltos_html += '<td>' + nombre_autor.nombres + ' ' + nombre_autor.apellidos + '</td>';
                    libros_devueltos_html += '<td>' + nombre_tema.tema + '</td>';
                    libros_devueltos_html += '<td>' + prestamo.fecha_prestamo + '</td>';
                    libros_devueltos_html += '<td>' + prestamo.fecha_devolucion + '</td>';
                    libros_devueltos_html += ObtenerEstadoPrestamo(prestamo.estado);
                    libros_devueltos_html += '</tr>';
                    cont_historial++;
                }
            }else return false;
        });
        $('#table_historial').html(libros_devueltos_html);
        _filtro.length < saltos_tabla_historial ? $('#lbl_rango_libros_historial').html(`Del ${inicio_actual_historial+1} al ${_filtro.length} de ${_filtro.length}`) : $('#lbl_rango_libros_historial').html(`Del ${inicio_actual_historial+1} al ${fin_actual_historial} de ${_filtro.length}`);
        if (_filtro.length == 0) $('#lbl_rango_libros_historial').html('Del 0 al 0 de 0');
    }
}

VerHistorialPrestamos(inicio_actual_historial, fin_actual_historial);

function BuscarPrestamoHistorial(_busqueda) {
    var prestamos;
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;
    var criterio_busqueda = parseInt($('#slc_buscar_prestamo_hist_por').val());
    var usuarios;
    var filtro = [];
    switch (criterio_busqueda) {
        case 1://Buscar por titulo del libro
            $.each(prestamos, function(indice, prestamo) {
                if (prestamo.estado > 2) {
                    var libro_info = ObtenerDatosLibro(prestamo.libro_id);
                    if (libro_info.titulo.indexOf(_busqueda) >= 0) filtro.push(prestamo);
                }
            });
            break;
        case 2://Buscar por autor del libro
            $.each(prestamos, function(indice, prestamo) {
                if (prestamo.estado > 2) {
                    var libro_info = ObtenerDatosLibro(prestamo.libro_id);
                    var autor_datos = ObtenerInfoAutor(libro_info.autor_id);
                    var autor_nombres = autor_datos.nombres + ' ' + autor_datos.apellidos;
                    if (autor_nombres.indexOf(_busqueda) >= 0) filtro.push(prestamo);
                }
            });
            break;
        case 3://Buscar por tema
            $.each(prestamos, function(indice, prestamo) {
                if (prestamo.estado > 2) {
                    var libro_info = ObtenerDatosLibro(prestamo.libro_id);
                    var tema_datos = ObtenerInfoTema(libro_info.tema_id);
                    if (tema_datos.tema.indexOf(_busqueda) >= 0) filtro.push(prestamo);
                }
            })
            break;
        case 4://Buscar por codigo
            $.each(prestamos, function(indice, prestamo) {
                if (prestamo.estado > 2) {
                    if (prestamo.token.indexOf(_busqueda) >= 0) filtro.push(prestamo);
                }
            })
            break;
        default:
            break;
    }
    VerHistorialPrestamos(inicio_actual_historial, fin_actual_historial, filtro);
}

/*
    evento click del boton siguiente para paginacion de la tabla
    llama  la funcion VerLibros con sus respectivos parametros si:
        el inicio_actual es menor que el tamano del arreglo es decir que existen elementos siguientes
        actualiza las variables inicio y fin actual si se mueve
        procede a llamar a la funcion VerLibros con los nuevos parametros
*/
$('#btn_siguiente_libros_historial').on('click', function() {
    if (fin_actual_historial < cont_historial) {
        inicio_actual_historial += saltos_tabla_historial;
        fin_actual_historial += saltos_tabla_historial;
        VerHistorialPrestamos(inicio_actual_historial, fin_actual_historial);
    }
    if (inicio_actual_historial + saltos_tabla_historial > cont_historial) {
        $('#lbl_rango_libros_historial').html(`Del ${inicio_actual_historial+1} al ${cont_historial} de ${cont_historial}`);
    }
});

/*
    evento click del boton anterior para paginacion de la tabla
    llama  la funcion VerLibrosPrestados con sus respectivos parametros si:
        el inicio_actual es mayor o igual que saltos de tabla es decir existen elementos anteriores
        actualiza las variables inicio y fin actual si se mueve
        procede a llamar a la funcion VerLibros con los nuevos parametros
*/
$('#btn_anterior_libros_historial').on('click', function() {
    if (inicio_actual_historial >= saltos_tabla_historial) {
        inicio_actual_historial -= saltos_tabla_historial;
        fin_actual_historial -= saltos_tabla_historial;
        VerHistorialPrestamos(inicio_actual_historial, fin_actual_historial);
    }
});

$('#txt_buscar_prestamo_hist').on('keyup', function () {
    BuscarPrestamoHistorial(this.value);
})
