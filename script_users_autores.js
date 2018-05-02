var inicio_actual_autores = 0;
var saltos_tabla_autores = 10;
var fin_actual_autores = inicio_actual_autores + saltos_tabla_autores;

var Libros = JSON.parse(localStorage.libros);

function ObtenerNacionalidadAutor(_id_pais) {
    var Paises_retreived = JSON.parse(localStorage.getItem('paises'));
    if (Paises_retreived == 'null') return;
    var datos = '';
    $.each(Paises_retreived, function(index, pais) {
        if (_id_pais == pais.id) datos += pais.nombre;
    })
    return datos;
}

function ObtenerCantidadLibrosAutor(_autor_id) {
    var Libros = JSON.parse(localStorage.libros);
    if (Libros == 'null') return;
    var cantidad_libros = 0;
    $.each(Libros, function(index, libro) {
        if (libro.autor_id == _autor_id) cantidad_libros++;
    });
    return cantidad_libros;
}
/*
    Funcion VerLibrosAutor que recibe como parametro el inicio y fin de donde empieza y termina la visualizacion de los elementos
    en la tabla
    Se crea la estructura del html de la tabla unicamente con los elementos que esten dentro del rango de los parametros
    recibidos
    Se insertan los elementos al html
*/
function VerLibrosAutor(_inicio, _fin, _filtro) {
    if (Libros == 'null') return;
    var autor_id = localStorage.index_ver_autor;
    if (autor_id == 'null') return;
    var autor_datos = ObtenerInfoAutor(autor_id);
    $('#h3_titulo_pantalla').html('Libros escritos por: ' + autor_datos.nombres + ' ' + autor_datos.apellidos);
    var libros_autor = ObtenerCantidadLibrosAutor(autor_id);
    var array_libros_autor = [];
    $.each(Libros, function (index, libro) {
        if(libro.autor_id == autor_id)array_libros_autor.push(libro);
    })
    var libros_html = `<thead><tr>
                            <th class="ordenable">#</th>
                            <th class="ordenable">Libro</th>
                            <th class="ordenable">Tema</th>
                            <th class="ordenable">Ubicacion</th>
                            <th class="ordenable">Disp</th>
                            <th>Operaciones</th>
                        </tr></thead><tbody>`;
    if (_filtro == undefined) {
        $.each(array_libros_autor, function(index, libro) {
            if ((index >= _inicio) && (index < _fin)) {
                var info_tema = ObtenerInfoTema(libro.tema_id);
                libros_html += '<tr>';
                libros_html += '<td class="libro_seleccionado">' + libro.libro_id + '</td>';
                libros_html += '<td>' + libro.titulo + '</td>';
                libros_html += '<td>' + info_tema.tema + '</td>';
                libros_html += '<td>' + libro.ubicacion + '</td>';
                libros_html += '<td>' + libro.disponibles + '</td>';
                if (libro.disponibles > 0)
                libros_html += '<td> <input type="button" class="button tabla_button" value="Prestar" onclick="ObtenerIdPrestarLibro(this)">  </td>';
                else
                libros_html += '<td> No disponible  </td>';
                libros_html += '</td>';
            } else return;
        });
        libros_html += '</tbody>';
        $('#table_libros_autor').html(libros_html);
        if (array_libros_autor.length < saltos_tabla_autores) {
            $('#lbl_rango_libros_autor').html(`Del ${inicio_actual_autores+1} al ${array_libros_autor.length} de ${array_libros_autor.length}`);
        } else {
            $('#lbl_rango_libros_autor').html(`Del ${inicio_actual_autores+1} al ${fin_actual_autores} de ${array_libros_autor.length}`);
        }
    } else {
        $.each(_filtro, function(index, libro) {
            if ((index >= _inicio) && (index < _fin) && (libro.autor_id == autor_id)) {
                var info_tema = ObtenerInfoTema(libro.tema_id);
                libros_html += '<tr>';
                libros_html += '<td class="libro_seleccionado">' + libro.libro_id + '</td>';
                libros_html += '<td>' + libro.titulo + '</td>';
                libros_html += '<td>' + info_tema.tema + '</td>';
                libros_html += '<td>' + libro.ubicacion + '</td>';
                libros_html += '<td>' + libro.disponibles + '</td>';
                if (libro.disponibles > 0)
                libros_html += '<td> <input type="button" class="button tabla_button" value="Prestar" onclick="ObtenerIdPrestarLibro(this)">  </td>';
                else
                libros_html += '<td> No disponible  </td>';
                libros_html += '</td>';
            } else return;
        });
        libros_html += '</tbody>';
        $('#table_libros_autor').html(libros_html);
        if (_filtro.length < saltos_tabla_autores) {
            $('#lbl_rango_libros_autor').html(`Del ${inicio_actual_autores+1} al ${_filtro.length} de ${_filtro.length}`);
        } else {
            $('#lbl_rango_libros_autor').html(`Del ${inicio_actual_autores+1} al ${fin_actual_autores} de ${_filtro.length}`);
        }
    }
}

VerLibrosAutor(inicio_actual_autores, fin_actual_autores);

/*
    Funcion BuscarLibroAutor que recibe como parametro el texto que se esta buscando
    La funcion se llama en el envento on change del input txt_buscar_libro
    De esta forma se buscan coincidencias por cada vez que la cadena vaya cambiando
    Para la busqueda se usa la funcion indexOf
*/
function BuscarLibroAutor(_busqueda) {
    var Libros = JSON.parse(localStorage.libros);
    if (Libros == 'null') return;
    var autor_id = localStorage.index_ver_autor;
    if (autor_id == 'null')return;
    var array_libros_autor = [];
    $.each(Libros, function (index, libro) {
        if(libro.autor_id == autor_id)array_libros_autor.push(libro);
    })
    var criterio_busqueda = parseInt($('#slc_buscar_libro_autor_por').val());
    var filtro = [];
    switch (criterio_busqueda) {
        case 1:
            $.each(array_libros_autor, function(indice, libro) {
                if (libro.titulo.indexOf(_busqueda) >= 0) filtro.push(libro);
            })
            break;
        case 2:
            $.each(array_libros_autor, function(indice, libro) {
                var tema_datos = ObtenerInfoTema(libro.tema_id);
                if (tema_datos.tema.indexOf(_busqueda) >= 0) filtro.push(libro);
            })
            break;
        case 3:
            $.each(array_libros_autor, function(indice, libro) {
                if (libro.ubicacion.indexOf(_busqueda) >= 0) filtro.push(libro);
            })
            break;
        default:
            break;
    }
    VerLibrosAutor(inicio_actual_autores, fin_actual_autores, filtro);
}


/*
    Funcion VerAutores que recibe como parametro el inicio y fin de donde empieza y termina la visualizacion de los elementos
    en la tabla
    Se crea la estructura del html de la tabla unicamente con los elementos que esten dentro del rango de los parametros
    recibidos
    Se insertan los elementos al html
*/
function VerAutores(_inicio, _fin, _filtro) {
    var Autores = JSON.parse(localStorage.autores);
    if (Autores == 'null') return;
    var autores_html = `<thead><tr>
                            <th class="ordenable">#</th>
                            <th class="ordenable">Nombres</th>
                            <th class="ordenable">Apellidos</th>
                            <th class="ordenable">Nacionalidad</th>
                            <th class="ordenable">Libros</th>
                            <th>Operaciones</th>
                        </tr></thead><tbody>`;
    if (_filtro == undefined) {
        $.each(Autores, function(index, autor) {
            if ((index >= _inicio) && (index < _fin)) {
                autores_html += '<tr>';
                autores_html += '<td>' + autor.autor_id + '</td>';
                autores_html += '<td>' + autor.nombres + '</td>';
                autores_html += '<td>' + autor.apellidos + '</td>';
                autores_html += '<td>' + ObtenerNacionalidadAutor(autor.nacionalidad) + '</td>';
                autores_html += '<td>' + ObtenerCantidadLibrosAutor(autor.autor_id) + '</td>';
                autores_html += '<td> <input type="button" class="button tabla_button" value="Ver" onclick="MostrarLibrosAutor(' + autor.autor_id + ')">  </td>';
                autores_html += '</td>';
            } else return;
        });
        autores_html += '</tbody>';
        $('#table_autores').html(autores_html);
        if (Autores.length < saltos_tabla_autores) {
            $('#lbl_rango_autores').html(`Del ${inicio_actual_autores+1} al ${Autores.length} de ${Autores.length}`);
        } else {
            $('#lbl_rango_autores').html(`Del ${inicio_actual_autores+1} al ${fin_actual_autores} de ${Autores.length}`);
        }
    } else {
        $.each(_filtro, function(index, autor) {
            if ((index >= _inicio) && (index < _fin)) {
                autores_html += '<tr>';
                autores_html += '<td>' + autor.autor_id + '</td>';
                autores_html += '<td>' + autor.nombres + '</td>';
                autores_html += '<td>' + autor.apellidos + '</td>';
                autores_html += '<td>' + ObtenerNacionalidadAutor(autor.nacionalidad) + '</td>';
                autores_html += '<td>' + ObtenerCantidadLibrosAutor(autor.autor_id) + '</td>';
                autores_html += '<td> <input type="button" class="button tabla_button" value="Ver" onclick="MostrarLibrosAutor(' + autor.autor_id + ')">  </td>';
                autores_html += '</td>';
            } else return;
        });
        autores_html += '</tbody>';
        $('#table_autores').html(autores_html);
        if (_filtro.length < saltos_tabla_autores) {
            $('#lbl_rango_autores').html(`Del ${inicio_actual_autores+1} al ${_filtro.length} de ${_filtro.length}`);
        } else {
            $('#lbl_rango_autores').html(`Del ${inicio_actual_autores+1} al ${fin_actual_autores} de ${_filtro.length}`);
        }
    }
}

/*
    Funcion BuscarAutor que recibe como parametro el texto que se esta buscando
    La funcion se llama en el envento on change del input txt_buscar_libro
    De esta forma se buscan coincidencias por cada vez que la cadena vaya cambiando
    Para la busqueda se usa la funcion indexOf
*/
function BuscarAutor(_busqueda) {
    var Autores = JSON.parse(localStorage.autores);
    if (Autores == 'null') return;
    var criterio_busqueda = parseInt($('#slc_buscar_autor_por').val());
    var filtro = [];
    switch (criterio_busqueda) {
        case 1:
            $.each(Autores, function(indice, autor) {
                if (autor.nombres.indexOf(_busqueda) >= 0) filtro.push(autor);
            })
            break;
        case 2:
            $.each(Autores, function(indice, autor) {
                if (autor.apellidos.indexOf(_busqueda) >= 0) filtro.push(autor);
            })
            break;
        case 3:
            $.each(Autores, function(indice, autor) {
                var autor_nacionalidad = ObtenerNacionalidadAutor(autor.autor_id);
                if (autor_nacionalidad.indexOf(_busqueda) >= 0) filtro.push(autor);
            })
            break;
        default:
            break;
    }
    VerAutores(inicio_actual_autores, fin_actual_autores, filtro);
}

VerAutores(inicio_actual_autores, fin_actual_autores);

/*
    Funcion que recibe como parametro el index del autor al que se quiere ver
    Se guarda el index en localStorage para ser usado despues y ver libros relacionados con el autor
*/
function MostrarLibrosAutor(_index_ver_autor) {
    localStorage.setItem('index_ver_autor', _index_ver_autor);
    window.location.href = "usuarios_ver_autor_libros.html";
}

$(function () {

    $('#txt_buscar_autor_usr').on('keyup', function () {
        BuscarAutor(this.value);
    })

    $('#txt_buscar_libro_autor').on('keyup', function () {
        BuscarLibroAutor(this.value);
    })

    $('#table_autores').tablesorter();
    $('#table_libros_autor').tablesorter();

})
