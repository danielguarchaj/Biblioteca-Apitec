var Libros = []; //array Libros que contendra todos los libros ingresados por el usuario en localStorage
var libro = { //Protoripo libro que sirve para crear nuevos autores
    libro_id: 0,
    titulo: '',
    autor_id: 0,
    tema_id: 0,
    ubicacion: '',
    disponibles: 0,
    fecha_ingreso: ''
};
var saltos_tabla = 3; //variable para determinar cuantos elementos se muestran en la tabla
var inicio_actual = 0; //variable para saber en que elemento se encuentra el inicio de la tabla actualmente
var fin_actual = inicio_actual + saltos_tabla; //variable que se calcula a partir de la suma del inicio actual y
var saltos_tabla_prestamos = 5;
var inicio_actual_prestamos = 0;
var fin_actual_prestamos = inicio_actual_prestamos + saltos_tabla_prestamos;
//los saltos de tabla indica el fin acutal de la tabla

CargarLibros(); //Se cargan libros de local storeage si existen
//GenerarLibrosTest();
VerLibros(inicio_actual, fin_actual); //se muestran los libros en la tabla segun las variables previamente definidas
VerLibrosPrestados(inicio_actual_prestamos, fin_actual_prestamos);

function CargarLibros() { //funcion que carga el arreglo libros desde localStorage
    var retrievedObject = localStorage.getItem('libros');
    if (retrievedObject != null) {
        Libros = JSON.parse(retrievedObject);
    }
}

function CargarAutores() { //funcion que carga el arreglo autores desde localStorage
    var retrievedObject = localStorage.getItem('autores');
    if (retrievedObject != null) {
        var Autores = JSON.parse(retrievedObject);
        var autores_html = '';
        $.each(Autores, function(index, autor) {
            autores_html += `<option value='${autor.autor_id}'>${autor.nombres} ${autor.apellidos}</option>`;
        });
        $('.slc_autor').html(autores_html);
        return true;
    } else {
        return false;
    }
}

function CargarTemas() { //funcion que carga el arreglo temas desde localStorage
    var retrievedObject = localStorage.getItem('temas');
    if (retrievedObject != null) {
        var Temas = JSON.parse(retrievedObject);
        var temas_html = '';
        $.each(Temas, function(index, tema) {
            temas_html += `<option value='${tema.tema_id}'>${tema.tema}</option>`;
        });
        $('.slc_tema').html(temas_html);
        return true;
    } else {
        return false;
    }
}

function ObtenerAutores() { //funcion que se encarga de obtener el arreglo autores desde local storage
    var retrievedObject = localStorage.getItem('autores');
    Autores = JSON.parse(retrievedObject);
}

function GuardarLibros() { //funcion que se encarga de guardar y sobreescribir el arreglo libros en local storage
    localStorage.setItem('libros', JSON.stringify(Libros));
}

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

/*
    Funcion ObtenerDiferenciaDias que recibe como parametro la fecha de devolucion del libro y fecha actual
    Retorna un entero que sera la diferencia entre ambas fechas
        Se resta la fecha actual menos la fecha de devolucion
            Si el resultado es positivo significa que hay mora
            Si el resultado es negativo o igual a cero significa que no se cobra mora y se devolvio a timpo
*/
function ObtenerDiferenciaDias(_fecha_devolucion, _fecha_hoy) {
    var fecha_devolucion = new Date(_fecha_devolucion);
    var fecha_hoy = new Date(_fecha_hoy);
    var timeDiff = fecha_hoy.getTime() - fecha_devolucion.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

//Funcion que genera libros de prueba si la variable en localStorage de libros no existe
function GenerarLibrosTest() {
    if (localStorage.getItem('libros') != null) return;
    for (var i = 0; i < 43; i++) {
        var nuevo_libro = Object.create(libro);
        nuevo_libro.libro_id = Libros.length + 1;
        nuevo_libro.titulo = 'titulo' + i;
        nuevo_libro.tema_id = 11;
        nuevo_libro.autor_id = 5;
        nuevo_libro.disponibles = 10;
        nuevo_libro.ubicacion = 'ubicacion' + i;
        nuevo_libro.fecha_ingreso = ObtenerFechaHoy();
        Libros.push(nuevo_libro);
        GuardarLibros();
    }
}

/*
    Funcion que recibe como parametro los datos del libro
    Crea un objeto nuevo_libro de tipo libro
    Se le asigna  id autoincrementable
    Se le asignan los datos corresponidentes
    Se hace push al arreglo de objetos Libros
    Se guardar los cambios en localStorage con la funcion GuardarAutores
    Se notificar al usuario por medio de un alert
    Redirige a la pagina libros.html
*/
function AgregarNuevoLibro(_titulo, _tema, _autor, _existencia, _ubicacion, _fecha_ingreso) {
    var nuevo_libro = Object.create(libro);
    if (Libros.length == 0) nuevo_libro.libro_id = 1;
    else nuevo_libro.libro_id = Libros[Libros.length - 1].libro_id + 1;
    nuevo_libro.titulo = _titulo;
    nuevo_libro.tema_id = _tema;
    nuevo_libro.autor_id = _autor;
    nuevo_libro.disponibles = _existencia;
    nuevo_libro.ubicacion = _ubicacion;
    nuevo_libro.fecha_ingreso = _fecha_ingreso;
    Libros.push(nuevo_libro);
    GuardarLibros();
    alert('Libro agregado exitosamente');
    window.location.href = 'libros.html';
}

/*
    Funcion que no reibe parametros y valida cada uno de los campos
    si hay error notifica al usuario
    si no procede a registrar nuevo libro
*/
function ValidarRegistroNuevoLibro() {
    var titulo = $('#txt_titulo_libro').val();
    var autor = $('#slc_autor_libro').val();
    var tema = $('#slc_tema_libro').val();
    var existencia = $('#txt_existencia').val();
    var ubicacion = $('#txt_ubicacion').val();
    var fecha_ingreso = $('#txt_fecha_registro_libro').val();
    var mensaje = '';
    var error = false;
    if (titulo == '') {
        mensaje += 'Debe ingresar el titulo del libro\n';
        error = true;
    }
    if (autor == '') {
        mensaje += 'Debe seleccionar el autor del libro\n';
        error = true;
    }
    if (tema == '') {
        mensaje += 'Debe seleccionar el tema del libro\n';
        error = true;
    }
    if (existencia == '') {
        mensaje += 'Debe la cantidad de libros existentes\n';
        error = true;
    }
    if (ubicacion == '') {
        mensaje += 'Debe ingresar la ubicacion del libro\n';
        error = true;
    }
    error ? alert(mensaje) : AgregarNuevoLibro(titulo, tema, autor, existencia, ubicacion, fecha_ingreso);
}

/*
    Funcion que recibe como parametro el id del autor y el array autores previamente cargada de localStorage
    recorre el arreglo de objetos y devuelve el objeto que haga coincidencia con el id recibido
*/
function ObtenerDatosAutor(_id, _array) {
    var datos;
    $.each(_array, function(index, value) {
        if (_id == value.autor_id) datos = value.nombres + ' ' + value.apellidos;
    })
    return datos;
}

/*
    Funcion que recibe como parametro el id del tema y el array temas previamente cargada de localStorage
    recorre el arreglo de objetos y devuelve el objeto que haga coincidencia con el id recibido
*/
function ObtenerDatosTema(_id, _array) {
    var datos;
    $.each(_array, function(index, value) {
        if (_id == value.tema_id) datos = value.tema;
    })
    return datos;
}

/*
    Funcion ObtenerDatosUsuario que recibe como parametro el id del usuario y el array de usuarios, devuelve toda la informacion
    como objeto del usuario que coincida con el id recibido
*/
function ObtenerDatosUsuario(_id, _array) {
    var datos;
    $.each(_array, function(index, value) {
        if (_id == value.id) datos = value;
    })
    return datos;
}

function ObtenerDatosLibro(_id, _array) {
    var datos;
    $.each(_array, function(index, value) {
        if (_id == value.libro_id) datos = value;
    })
    return datos;
}

/*
    Funcion VerLibros que recibe como parametro el inicio y fin de donde empieza y termina la visualizacion de los elementos
    en la tabla
    Se crea la estructura del html de la tabla unicamente con los elementos que esten dentro del rango de los parametros
    recibidos
    Se insertan los elementos al html
*/
function VerLibros(_inicio, _fin) {
    var Autores_retreived = JSON.parse(localStorage.getItem('autores'));
    var Temas_retreived = JSON.parse(localStorage.getItem('temas'));
    var libros_html = `<tr>
                            <th>#</th>
                            <th>Libro</th>
                            <th>Autor</th>
                            <th>Tema</th>
                            <th>Ubicación</th>
                            <th>Disp</th>
                            <th>Operaciones</th>
                        </tr>`;
    $.each(Libros, function(index, libro) {
        if ((index >= _inicio) && (index < _fin)) {
            libros_html += '<tr>';
            libros_html += '<td class="libro_seleccionado">' + libro.libro_id + '</td>';
            libros_html += '<td>' + libro.titulo + '</td>';
            libros_html += '<td>' + ObtenerDatosAutor(libro.autor_id, Autores_retreived) + '</td>';
            libros_html += '<td>' + ObtenerDatosTema(libro.tema_id, Temas_retreived) + '</td>';
            libros_html += '<td>' + libro.ubicacion + '</td>';
            libros_html += '<td>' + libro.disponibles + '</td>';
            libros_html += '<td> <input type="button" class="button tabla_button" value="Editar" onclick="ObtenerIdEditarLibroTabla(this)"> - ' +
                '<input type="button" class="button tabla_button" value="Eliminar" onclick="EliminarLibroTabla(this)"> </td>';
            libros_html += '</tr>';
        } else return;
    });
    $('#table_libros').html(libros_html);
    Libros.length < saltos_tabla ? $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${Libros.length} de ${Libros.length}`) : $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${fin_actual} de ${Libros.length}`);
    if (Libros.length == 0) $('#lbl_rango_libros').html('Del 0 al 0 de 0');
}

/*
    Funcion VerLibrosPrestados que recibe como parametros el inicio y el fin de la cantidad de elementos que se desea ver
    Muestra informacion de todos los libros que se encuentran actualmente en prestamos es decir en estado 1 o 2
*/
function VerLibrosPrestados(_inicio, _fin) {
    var autores;
    var temas;
    var prestamos;
    var usuarios;
    var usr_index;
    if (localStorage.autores != null) autores = JSON.parse(localStorage.autores);
    else return;
    if (localStorage.temas != null) temas = JSON.parse(localStorage.temas);
    else return;
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;
    if (localStorage.usuarios != null) usuarios = JSON.parse(localStorage.usuarios);
    else return;
    if (localStorage.user_logeado != null) usr_index = localStorage.user_logeado;
    else return;
    var prestamos_html = `<tr>
                            <th>#</th>
                            <th>Codigo</th>
                            <th>Libro</th>
                            <th>Autor</th>
                            <th>Tema</th>
                            <th>Prestamo</th>
                            <th>Devolucion</th>
                            <th>Usuario</th>
                            <th>Estado</th>
                            <th>Operacion</th>
                        </tr>`;
    $.each(prestamos, function(index, prestamo) {
        var datos_libro = ObtenerDatosLibro(prestamo.libro_id, Libros);
        if ((index >= _inicio) && (index < _fin)) {
            prestamos_html += '<tr>';
            prestamos_html += '<td class="prestamo_seleccionado">' + prestamo.id + '</td>';
            prestamos_html += '<td>' + prestamo.token + '</td>';
            prestamos_html += '<td>' + datos_libro.titulo + '</td>';
            prestamos_html += '<td>' + ObtenerDatosAutor(datos_libro.autor_id, autores) + '</td>';
            prestamos_html += '<td>' + ObtenerDatosTema(datos_libro.tema_id, temas) + '</td>';
            prestamos_html += '<td>' + prestamo.fecha_prestamo + '</td>';
            prestamos_html += '<td>' + prestamo.fecha_devolucion + '</td>';
            prestamos_html += '<td>' + usuarios[usr_index].nombres + ' ' + usuarios[usr_index].apellidos + '</td>';
            prestamos_html += '<td>' + usuarios[usr_index].estado + '</td>';
            prestamos_html += '<td> <input type="button" class="button tabla_button" value="Devolver" onclick="ObtenerIdDevolverLibroTabla(this)"> </td>';
            prestamos_html += '</tr>';
        } else return;
    });
    $('#table_libros_prestados').html(prestamos_html);
    Libros.length < saltos_tabla ? $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${Libros.length} de ${Libros.length}`) : $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${fin_actual} de ${Libros.length}`);
    if (Libros.length == 0) $('#lbl_rango_libros').html('Del 0 al 0 de 0');
}


/*
    Funcion que busca el elemento en arreglo de objetos por medio de un id que recibe como parametro
    Retorna el indice donde se encontro el elemento
*/
function ObtenerLibroIndex(_id) {
    var indice;
    $.each(Libros, function(index, libro) {
        if (libro.libro_id == _id) indice = index;
    });
    return indice;
}

/*
    Funcion que recibe como parametro el id del elemento a eliminar
    Busca el elemento dentro del arreglo
    Si lo encuentra lo eleimina
    Retorna una variable bandera para indicar como true si se encontro y elimino el elemento
    False si no lo encontro y no se elimino
*/
function EliminarLibro(_id) {
    var encontrado = false;
    var indice = 0;
    $.each(Libros, function(index, libro) {
        if (libro.libro_id == _id) {
            indice = index;
            encontrado = true;
            return;
        }
    });
    Libros.splice(indice, 1);
    GuardarLibros();
    return encontrado;
}

/*
    Funcion que se encarga de obtener el id del elemento que se quiere eliminar en la tabla
    Recibe como parametro el elemento en este caso el boton que se presiona
    Se busca la clase autor_seleccionado por medio de jquery y se obtiene el id del elemento a eliminar
    Se verifica si el id tiene asociados libros
        Si tiene se avisa que no se puede Eliminar
        Si no tiene se procede a llamar a la funcion EliminarAutor
*/
function EliminarLibroTabla(_elemento) {
    var id_elemento = parseInt($(_elemento).closest('tr').find('.libro_seleccionado').text());
    if (confirm('Esta seguro que desea eliminar este libro?')) {
        if (EliminarLibro(id_elemento)) {
            alert('Libro elminado!');
            location.reload();
        } else alert('No se pudo eliminar el libro');
    }
}

function ObtenerInfoAutor(_id) {
    var autores = JSON.parse(localStorage.autores)
    var autor;
    $.each(autores, function(index, value) {
        if (_id == value.autor_id) autor = value;
    });
    return autor;
}

/*
    Funcion que recibe como parametro el id del tema y el array temas previamente cargada de localStorage
    recorre el arreglo de objetos y devuelve el objeto que haga coincidencia con el id recibido
*/
function ObtenerInfoTema(_id) {
    var temas = JSON.parse(localStorage.temas);
    var tema;
    $.each(temas, function(index, value) {
        if (_id == value.tema_id) tema = value;
    })
    return tema;
}

function ObtenerDatosPrestamo(_token) {
    var obj_prestamo;
    var prestamos;
    if (localStorage.prestamos == null) return;
    else prestamos = JSON.parse(localStorage.prestamos);
    $.each(prestamos, function(index, value) {
        if (_token == value.token) obj_prestamo = value;
    });
    return obj_prestamo;
}

/*
    Funcionq q no recibe parametros y setea los datos a los txts corresponidentes
    Cargando el id del elemento desde local storage
*/
function SetearDatosLibro(_transaccion, _codigo_prestamo) {
    if (_transaccion == 'devolver' && _codigo_prestamo != '') {
        var prestamo = ObtenerDatosPrestamo(_codigo_prestamo);
        if (prestamo == undefined) return false;
        var indice = ObtenerLibroIndex(prestamo.libro_id);
        var autor = ObtenerInfoAutor(Libros[indice].autor_id);
        var tema = ObtenerInfoTema(Libros[indice].tema_id);
        $('#td_libro_titulo').html(Libros[indice].titulo);
        $('#td_libro_autor').html(autor.nombres + ' ' + autor.apellidos);
        $('#td_libro_tema').html(tema.tema);
        $('#td_libro_ubicacion').html(Libros[indice].ubicacion);
        $('#td_libro_disponibles').html(Libros[indice].disponibles);
        $('#td_libro_prestamo').html(prestamo.fecha_prestamo);
        $('#td_libro_devolucion').html(prestamo.fecha_devolucion);
        return true;
    } else {
        var id_libro = localStorage.getItem('editar_libro');
        var indice = ObtenerLibroIndex(id_libro);
        $('#txt_titulo_libro_editar').val(Libros[indice].titulo);
        $('#slc_autor_libro_editar').val(Libros[indice].autor_id);
        $('#slc_tema_libro_editar').val(Libros[indice].tema_id);
        $('#txt_existencia_editar').val(Libros[indice].disponibles);
        $('#txt_ubicacion_editar').val(Libros[indice].ubicacion);
        $('#txt_fecha_registro_libro_editar').val(Libros[indice].fecha_ingreso);
        return true;
    }
}

/*function DeterminarEstadoUsuario(_usuario_id) {
    var usuarios;
    if (localStorage.usuarios != null) usuarios = JSON.parse(localStorage.usuarios);
    else return;
    var usr_index;
    $.each(usuarios, function (index, usr) {
        if (_usuario_id == usr.id) {
            usr_index = index;
            return;
        }
    });
    var prestamos;
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;

    $.each(prestamos, function (index, prestamo) {

    })
}*/

function DevolverLibro(_token) {
    var prestamos;
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;
    $.each(prestamos, function(index, valor) {
        if (_token == valor.token) {
            /*Se resta la fecha actual menos la fecha de devolucion
                Si el resultado es positivo significa que hay mora
                Si el resultado es negativo o igual a cero significa que no se cobra mora y se devolvio a timpo*/
            var fecha_actual = ObtenerFechaFormatoUSA(ObtenerFechaHoy());
            var fecha_devolucion = ObtenerFechaFormatoUSA(valor.fecha_devolucion);
            var diferencia_dias = ObtenerDiferenciaDias(fecha_devolucion, fecha_actual);
            prestamos[index].fecha_devolucion_real = ObtenerFechaHoy();
            if (diferencia_dias > 0 || valor.estado == 2) {
                prestamos[index].estado = 4;
                prestamos[index].mora = diferencia_dias;
                //Cambio de estado de usuario de moroso a solvente pendiente:
            } else {
                prestamos[index].estado = 3;
                prestamos[index].dias_anticipacion = Math.abs(diferencia_dias);
            }
            //return;
        }
    });
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
}


/*
    Funcion que no recibe parametros
    Se obtiene el valor del id del libro que se debe modificar desde local storage previamente guardada desde el click en la tabla
    se obtiene el index del libro por medio del id
    se guardan los cambios en el arreglo en el indice correcto
    Se llama la funcion GuardarLibros para acutalizar datos en local storage
    se redirige a libros.html
*/
function ModificarLibro() {
    var id_libro = localStorage.getItem('editar_libro');
    var indice = ObtenerLibroIndex(id_libro);
    Libros[indice].titulo = $('#txt_titulo_libro_editar').val();
    Libros[indice].ubicacion = $('#txt_ubicacion_editar').val();
    Libros[indice].disponibles = $('#txt_existencia_editar').val();
    Libros[indice].fecha_ingreso = $('#txt_fecha_registro_libro_editar').val();
    Libros[indice].autor_id = $('#slc_autor_libro_editar').val();
    Libros[indice].tema_id = $('#slc_tema_libro_editar').val();
    GuardarLibros();
    alert('Libro Modificado con exito!');
    window.location.href = 'libros.html';
}

/*
    Funion que se llama desde cada boton de cada elemento de la tabla que recibe como parametro el boton
    Se obtiene el id del elemento por medio de jquery
    Se guarda el id en localStorage
    se redirige a editar_libro.html
*/
function ObtenerIdEditarLibroTabla(_elemento) {
    var id_libro = parseInt($(_elemento).closest('tr').find('.libro_seleccionado').text());
    localStorage.setItem('editar_libro', id_libro);
    window.location.href = 'editar_libro.html';
}

$(function() {

    /*
        evento click del boton salir que redirige al login
        setea variable de sesion a 0
        setea variables de edicion a null
    */
    $('.btn_salir').click(function() {
        window.location.href = 'login.html';
        localStorage.setItem('sesion', 0);
        localStorage.setItem('editar_libro', null);
        localStorage.setItem('editar_autor', null);
    });

    /*
        evento click del boton agregar nuevo libro
        redirige a nuevo_libro.html
    */
    $('#btn_agregar_nuevo_libro').click(function() {
        window.location.href = 'nuevo_libro.html';
    });

    /*
        evento click del boton regresar de nuevo libro
        redirige a libros.html
    */
    $('#btn_regresar_agregar_libro').click(function() {
        window.location.href = 'libros.html';
    });

    /*
        evento click del boton registrar en nuevo libro
        llama a la funcion ValidarRegistroLibro para validar campos y registrar
    */
    $('#btn_aceptar_agregar_libro').on('click', function() {
        ValidarRegistroNuevoLibro();
    });

    /*
        evento click del boton anterior para paginacion de la tabla
        llama  la funcion VerLibros con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla es decir existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerLibros con los nuevos parametros
    */
    $('#btn_anterior_libros').on('click', function() {
        if (inicio_actual >= saltos_tabla) {
            inicio_actual -= saltos_tabla;
            fin_actual -= saltos_tabla;
            VerLibros(inicio_actual, fin_actual);
        }
    });

    /*
        evento click del boton siguiente para paginacion de la tabla
        llama  la funcion VerLibros con sus respectivos parametros si:
            el inicio_actual es menor que el tamano del arreglo es decir que existen elementos siguientes
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerLibros con los nuevos parametros
    */
    $('#btn_siguiente_libros').on('click', function() {
        if (fin_actual < Libros.length) {
            inicio_actual += saltos_tabla;
            fin_actual += saltos_tabla;
            VerLibros(inicio_actual, fin_actual);
        }
        if (inicio_actual + saltos_tabla > Libros.length) {
            $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${Libros.length} de ${Libros.length}`);
        }
    });

    /*
        evento click del boton ver 10 libros para paginacion de la tabla
        modifica las variables de saltos_tabla a 10
        regersa al inicio
        llama  la funcion VerLibros con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla osea q existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerLibros con los nuevos parametros
    */
    $('#btn_ver_10_libros').on('click', function() {
        saltos_tabla = 10;
        inicio_actual = 0;
        fin_actual = inicio_actual + saltos_tabla;
        VerLibros(inicio_actual, fin_actual);
        if (inicio_actual + saltos_tabla > Libros.length) {
            $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${Libros.length} de ${Libros.length}`);
        }
    });

    /*
        evento click del boton ver 20 libros para paginacion de la tabla
        modifica las variables de saltos_tabla a 20
        regersa al inicio
        llama  la funcion VerLibros con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla osea q existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerLibros con los nuevos parametros
    */
    $('#btn_ver_20_libros').on('click', function() {
        saltos_tabla = 20;
        inicio_actual = 0;
        fin_actual = inicio_actual + saltos_tabla;
        VerLibros(inicio_actual, fin_actual);
        if (inicio_actual + saltos_tabla > Libros.length) {
            $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${Libros.length} de ${Libros.length}`);
        }
    });

    /*
        evento click del boton ver 50 libros para paginacion de la tabla
        modifica las variables de saltos_tabla a 50
        regersa al inicio
        llama  la funcion VerLibros con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla osea q existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerLibros con los nuevos parametros
    */
    $('#btn_ver_50_libros').on('click', function() {
        saltos_tabla = 50;
        inicio_actual = 0;
        fin_actual = inicio_actual + saltos_tabla;
        VerLibros(inicio_actual, fin_actual);
        if (inicio_actual + saltos_tabla > Libros.length) {
            $('#lbl_rango_libros').html(`Del ${inicio_actual+1} al ${Libros.length} de ${Libros.length}`);
        }
    });

    /*
        Eventos de botones de navegacion que redirigen a sus respectivas pantallas y modificar el valor de variables en localStorage
    */
    $('#btn_regresar_editar_libro').click(function() {
        window.location.href = 'libros.html';
        localStorage.setItem('editar_libro', null);
    });

    $('#btn_aceptar_editar_libro').click(function() {
        ModificarLibro();
    });

    $('#btn_salir_editar_libros').click(function() {
        window.location.href = 'login.html';
        localStorage.setItem('sesion', 0);
        localStorage.setItem('editar_libro', null);
    });

    $('.btn_pagina_actual').click(function() {
        location.reload();
    });

    $('.btn_autores').click(function() {
        window.location.href = 'autores.html';
    });

    $('.btn_temas').click(function() {
        window.location.href = 'temas.html';
    });

    $('.btn_libros').click(function() {
        window.location.href = 'libros.html';
    });

    $('#btn_devolver_libro').click(function() {
        window.location.href = 'libros_devolver.html';
    });

    $('.btn_prestamos').click(function() {
        window.location.href = 'libros_prestamos.html';
    });

    $('#btn_buscar_prestamo').click(function() {
        var token = $('#txt_codigo_prestamo').val();
        if (token == '') return;
        if (!SetearDatosLibro('devolver', token)) alert('Codigo de prestamo incorrecto');
        else SetearDatosLibro('devolver', token);
    });

    $('#btn_aceptar_devolucion_libro').click(function() {
        DevolverLibro($('#txt_codigo_prestamo').val());
        alert('Libro devuelto');
    });

});
