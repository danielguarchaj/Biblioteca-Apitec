var saltos_tabla_historial = 10; //variable para determinar cuantos elementos se muestran en la tabla
var inicio_actual_historial = 0; //variable para saber en que elemento se encuentra el inicio de la tabla actualmente
var fin_actual_historial = inicio_actual_historial + saltos_tabla_historial; //variable que se calcula a partir de la suma del inicio actual y
//los saltos de tabla indica el fin acutal de la tabla

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
    var Autores_retreived = JSON.parse(localStorage.getItem('autores'));
    var Temas_retreived = JSON.parse(localStorage.getItem('temas'));
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
        }else if (usuarios[usuario_index].id == prestamo.usuario_id && (prestamo.estado == 3 || prestamo.estado == 4)) {
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
        }
    });
    $('#table_mis_prestamos').html(libros_prestados_html);
    $('#table_historial').html(libros_devueltos_html);
}

VerLibrosPrestados();
