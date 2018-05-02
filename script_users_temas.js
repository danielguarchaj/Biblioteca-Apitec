var inicio_actual_temas = 0;
var saltos_tabla_temas = 10;
var fin_actual_temas = inicio_actual_temas + saltos_tabla_temas;

var Libros;
if (localStorage.libros != null) Libros = JSON.parse(localStorage.libros);

function ObtenerCantidadLibrosTema(_tema_id) {
    var Libros = JSON.parse(localStorage.libros);
    if (Libros == 'null') return;
    var cantidad_libros = 0;
    $.each(Libros, function(index, libro) {
        if (libro.autor_id == _tema_id) cantidad_libros++;
    });
    return cantidad_libros;
}
/*
    Funcion VerLibrosTema que recibe como parametro el inicio y fin de donde empieza y termina la visualizacion de los elementos
    en la tabla
    Se crea la estructura del html de la tabla unicamente con los elementos que esten dentro del rango de los parametros
    recibidos
    Se insertan los elementos al html
*/
function VerLibrosTema(_inicio, _fin, _filtro) {
    if (Libros == 'null') return;
    var tema_id = localStorage.id_ver_tema;
    if (tema_id == 'null') return;
    var tema_datos = ObtenerInfoTema(tema_id);
    $('#h3_titulo_pantalla').html('Libros de categoria: ' + tema_datos.tema);
    var libro_temas = ObtenerCantidadLibrosTema(tema_id);
    var array_libros_temas = [];
    $.each(Libros, function(index, libro) {
        if (libro.tema_id == tema_id) array_libros_temas.push(libro);
    })
    var temas_html = `<thead><tr>
                            <th class="ordenable">#</th>
                            <th class="ordenable">Libro</th>
                            <th class="ordenable">Autor</th>
                            <th class="ordenable">Ubicacion</th>
                            <th class="ordenable">Disp</th>
                            <th>Operaciones</th>
                        </tr></thead><tbody>`;
    if (_filtro == undefined) {
        $.each(array_libros_temas, function(index, libro) {
            if ((index >= _inicio) && (index < _fin)) {
                var autor_datos = ObtenerInfoAutor(libro.autor_id);
                temas_html += '<tr>';
                temas_html += '<td class="libro_seleccionado">' + libro.libro_id + '</td>';
                temas_html += '<td>' + libro.titulo + '</td>';
                temas_html += '<td>' + autor_datos.nombres + ' ' + autor_datos.apellidos + '</td>';
                temas_html += '<td>' + libro.ubicacion + '</td>';
                temas_html += '<td>' + libro.disponibles + '</td>';
                if (libro.disponibles > 0)
                    temas_html += '<td> <input type="button" class="button tabla_button" value="Prestar" onclick="ObtenerIdPrestarLibro(this)">  </td>';
                else
                    temas_html += '<td> No disponible  </td>';
                temas_html += '</td>';
            } else return;
        });
        temas_html += '</tbody>';
        $('#table_libros_tema').html(temas_html);
        if (array_libros_temas.length < saltos_tabla_temas) {
            $('#lbl_rango_libros_tema').html(`Del ${inicio_actual_temas+1} al ${array_libros_temas.length} de ${array_libros_temas.length}`);
        } else {
            $('#lbl_rango_libros_tema').html(`Del ${inicio_actual_temas+1} al ${fin_actual_temas} de ${array_libros_temas.length}`);
        }
    } else {
        $.each(_filtro, function(index, libro) {
            if ((index >= _inicio) && (index < _fin)) {
                var autor_datos = ObtenerInfoAutor(libro.autor_id);
                temas_html += '<tr>';
                temas_html += '<td class="libro_seleccionado">' + libro.libro_id + '</td>';
                temas_html += '<td>' + libro.titulo + '</td>';
                temas_html += '<td>' + autor_datos.nombres + ' ' + autor_datos.apellidos + '</td>';
                temas_html += '<td>' + libro.ubicacion + '</td>';
                temas_html += '<td>' + libro.disponibles + '</td>';
                if (libro.disponibles > 0)
                    temas_html += '<td> <input type="button" class="button tabla_button" value="Prestar" onclick="ObtenerIdPrestarLibro(this)">  </td>';
                else
                    temas_html += '<td> No disponible  </td>';
                temas_html += '</td>';
            } else return;
        });
        temas_html += '</tbody>';
        $('#table_libros_tema').html(temas_html);
        if (_filtro.length < saltos_tabla_temas) {
            $('#lbl_rango_libros_tema').html(`Del ${inicio_actual_temas+1} al ${_filtro.length} de ${_filtro.length}`);
        } else {
            $('#lbl_rango_libros_tema').html(`Del ${inicio_actual_temas+1} al ${fin_actual_temas} de ${_filtro.length}`);
        }
    }
}

VerLibrosTema(inicio_actual_temas, fin_actual_temas);

/*
    Funcion BuscarLibroTema que recibe como parametro el texto que se esta buscando
    La funcion se llama en el envento on change del input txt_buscar_libro
    De esta forma se buscan coincidencias por cada vez que la cadena vaya cambiando
    Para la busqueda se usa la funcion indexOf
*/
function BuscarLibroTema(_busqueda) {
    var Libros = JSON.parse(localStorage.libros);
    if (Libros == 'null') return;
    var tema_id = localStorage.id_ver_tema;
    if (tema_id == 'null')return;
    var array_libros_temas = [];
    $.each(Libros, function (index, libro) {
        if(libro.tema_id == tema_id)array_libros_temas.push(libro);
    })
    var criterio_busqueda = parseInt($('#slc_buscar_libro_tema_por').val());
    var filtro = [];
    switch (criterio_busqueda) {
        case 1:
            $.each(array_libros_temas, function(indice, libro) {
                if (libro.titulo.indexOf(_busqueda) >= 0) filtro.push(libro);
            })
            break;
        case 2:
            $.each(array_libros_temas, function(indice, libro) {
                var autor_datos = ObtenerInfoAutor(libro.autor_id);
                var autor_nombre = autor_datos.nombres + ' ' + autor_datos.apellidos;
                if (autor_nombre.indexOf(_busqueda) >= 0) filtro.push(libro);
            })
            break;
        case 3:
            $.each(array_libros_temas, function(indice, libro) {
                if (libro.ubicacion.indexOf(_busqueda) >= 0) filtro.push(libro);
            })
            break;
        default:
            break;
    }
    VerLibrosTema(inicio_actual_temas, fin_actual_temas, filtro);
}


/*
    Funcion VerTemas que recibe como parametro el inicio y fin de donde empieza y termina la visualizacion de los elementos
    en la tabla
    Se crea la estructura del html de la tabla unicamente con los elementos que esten dentro del rango de los parametros
    recibidos
    Se insertan los elementos al html
*/
function VerTemas(_inicio, _fin, _filtro) {
    var Temas;
    if (localStorage.temas != null) Temas = JSON.parse(localStorage.temas);
    else return;
    var temas_html = `<thead><tr>
                            <th class="ordenable">#</th>
                            <th class="ordenable">Tema</th>
                            <th>Operaciones</th>
                        </tr></thead><tbody>`;
    if (_filtro == undefined) {
        $.each(Temas, function(index, tema) {
            if ((index >= _inicio) && (index < _fin)) {
                temas_html += '<tr>';
                temas_html += '<td>' + tema.tema_id + '</td>';
                temas_html += '<td>' + tema.tema + '</td>';
                temas_html += '<td> <input type="button" class="button tabla_button" value="Ver" onclick="MostrarLibrosTema(' + tema.tema_id + ')">  </td>';
                temas_html += '</tr>';
            } else return;
        });
        temas_html += '</tbody>';
        $('#table_temas').html(temas_html);
        if (Temas.length < saltos_tabla_temas) {
            $('#lbl_rango_temas').html(`Del ${inicio_actual_temas+1} al ${Temas.length} de ${Temas.length}`);
        } else {
            $('#lbl_rango_temas').html(`Del ${inicio_actual_temas+1} al ${fin_actual_temas} de ${Temas.length}`);
        }
    } else {
        $.each(_filtro, function(index, tema) {
            if ((index >= _inicio) && (index < _fin)) {
                temas_html += '<tr>';
                temas_html += '<td>' + tema.tema_id + '</td>';
                temas_html += '<td>' + tema.tema + '</td>';
                temas_html += '<td> <input type="button" class="button tabla_button" value="Ver" onclick="MostrarLibrosTema(' + tema.tema_id + ')">  </td>';
                temas_html += '</tr>';
            } else return;
        });
        temas_html += '</tbody>';
        $('#table_temas').html(temas_html);
        if (_filtro.length < saltos_tabla_temas) {
            $('#lbl_rango_temas').html(`Del ${inicio_actual_temas+1} al ${_filtro.length} de ${_filtro.length}`);
        } else {
            $('#lbl_rango_temas').html(`Del ${inicio_actual_temas+1} al ${fin_actual_temas} de ${_filtro.length}`);
        }
    }
}

/*
    Funcion BuscarTema que recibe como parametro el texto que se esta buscando
    La funcion se llama en el envento on change del input txt_buscar_libro
    De esta forma se buscan coincidencias por cada vez que la cadena vaya cambiando
    Para la busqueda se usa la funcion indexOf
*/
function BuscarTema(_busqueda) {
    var Temas = JSON.parse(localStorage.temas);
    if (Temas == 'null') return;
    var filtro = [];
    $.each(Temas, function(indice, tema) {
        if (tema.tema.indexOf(_busqueda) >= 0) filtro.push(tema);
    })
    VerTemas(inicio_actual_temas, fin_actual_temas, filtro);
}

VerTemas(inicio_actual_temas, fin_actual_temas);

/*
    Funcion que recibe como parametro el index del autor al que se quiere ver
    Se guarda el index en localStorage para ser usado despues y ver libros relacionados con el autor
*/
function MostrarLibrosTema(_id_ver_tema) {
    localStorage.setItem('id_ver_tema', _id_ver_tema);
    window.location.href = "usuarios_ver_tema_libros.html";
}

$(function() {

    $('#txt_buscar_autor_usr').on('keyup', function() {
        BuscarAutor(this.value);
    })

    $('#txt_buscar_libro_autor').on('keyup', function() {
        BuscarLibroAutor(this.value);
    })

    $('#txt_buscar_tema_usr').on('keyup', function() {
        BuscarTema(this.value);
    })

    $('#txt_buscar_libro_tema').on('keyup', function() {
        BuscarLibroTema(this.value);
    })

    $('#table_autores').tablesorter();
    $('#table_temas').tablesorter();
    $('#table_libros_autor').tablesorter();

})
