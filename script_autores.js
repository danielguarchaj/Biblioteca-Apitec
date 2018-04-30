var Autores = []; //array Autores que contendra todos los autores ingresados por el usuario en localStorage
var autor = { //Protoripo autor que sirve para crear nuevos autores
    autor_id: 0,
    nombres: '',
    apellidos: '',
    nacionalidad: 0,
    genero: null,
    nacimiento: '',
    fallecimiento: '',
    fecha_ingreso: ''
};
var saltos_tabla = 2; //variable para determinar cuantos elementos se muestran en la tabla
var inicio_actual = 0;//variable para saber en que elemento se encuentra el inicio de la tabla actualmente
var fin_actual = inicio_actual + saltos_tabla;//variable que se calcula a partir de la suma del inicio actual y los saltos de tabla indica el fin acutal de la tabla

CargarAutores();//Se cargan autores de local storeage si existen
//GenerarAutoresTest();
VerAutores(inicio_actual, fin_actual); //se muestran los autores en la tabla segun las variables previamente definidas

function CargarAutores() {//funcion que carga el arreglo autores desde localStorage
    var retrievedObject = localStorage.getItem('autores');
    if (retrievedObject != null) {
        Autores = JSON.parse(retrievedObject);
    }
}

function GuardarAutores() {//funcion que se encarga de guardar y sobreescribir el arreglo autores en local storage
    localStorage.setItem('autores', JSON.stringify(Autores));
}

//funcion que se encarga de retornar una cadena fecha con fecha de hoy con el formato dd/mm/aaaa
function ObtenerFechaHoy() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    return dia + '/' + mes + '/' + anio;
}

//Funcion que genera autores de prueba si la variable en localStorage de autores no existe
function GenerarAutoresTest() {
    if (localStorage.getItem('autores') != null) return;
    for (var i = 0; i < 43; i++) {
        var nuevo_autor = Object.create(autor);
        nuevo_autor.autor_id = Autores.length + 1;
        nuevo_autor.nombres = 'nombres' + i;
        nuevo_autor.apellidos = 'apellidos' + i;
        nuevo_autor.nacionalidad = 'nacionalidad_autor' + i;
        nuevo_autor.nacimiento = 'dd/mm/aaaa';
        nuevo_autor.fallecimiento = 'dd/mm/aaaa';
        nuevo_autor.fecha_ingreso = ObtenerFechaHoy();
        Autores.push(nuevo_autor);
        GuardarAutores();
    }
}

/*
    Funcion que recibe como parametro los datos del autor
    Crea un objeto nuevo_autor de tipo autor
    Se le asigna  id autoincrementable
    Se le asignan los datos corresponidentes
    Se hace push al arreglo de objetos Autores
    Se guardar los cambios en localStorage con la funcion GuardarAutores
    Se notificar al usuario por medio de un alert
    Redirige a la pagina autores.html
*/
function AgregarNuevoAutor(_nombres, _apellidos, _nacionalidad, _genero, _nacimiento, _fallecimiento, _fecha_ingreso) {
    var nuevo_autor = Object.create(autor);
    if (Autores.length == 0) nuevo_autor.autor_id = 1;
    else nuevo_autor.autor_id = Autores[Autores.length - 1].autor_id + 1;
    nuevo_autor.nombres = _nombres;
    nuevo_autor.apellidos = _apellidos;
    nuevo_autor.nacionalidad = _nacionalidad;
    nuevo_autor.genero = _genero;
    nuevo_autor.nacimiento = _nacimiento;
    nuevo_autor.fallecimiento = _fallecimiento;
    nuevo_autor.fecha_ingreso = _fecha_ingreso;
    Autores.push(nuevo_autor);
    GuardarAutores();
    alert('Autor agregado exitosamente');
    window.location.href = 'autores.html';
}

/*
    Funcion que recibe como parametro el id del autor y el array de paises
    busca coincidencia del id del pais con el id de pais asignado al autor
    retorna el nombre del pais si encuentra
*/
function ObtenerNacionalidadAutor(_id, _array) {
    var datos = '';
    $.each(_array, function(index, pais) {
        if (_id == pais.id) datos += pais.nombre;
    })
    return datos;
}

/*
    Funcion VerAutores que recibe como parametro el inicio y fin de donde empieza y termina la visualizacion de los elementos
    en la tabla
    Se crea la estructura del html de la tabla unicamente con los elementos que esten dentro del rango de los parametros
    recibidos
    Se insertan los elementos al html
*/
function VerAutores(_inicio, _fin) {
    var Paises_retreived = JSON.parse(localStorage.getItem('paises'));
    var autores_html = `<thead><tr>
                            <th class="ordenable">#</th>
                            <th class="ordenable">Nombres</th>
                            <th class="ordenable">Apellidos</th>
                            <th class="ordenable">Nacionalidad</th>
                            <th class="ordenable">Fecha de ingreso</th>
                            <th>Operaciones</th>
                        </tr></thead><tbody>`;
    $.each(Autores, function(index, autor) {
        if ((index >= _inicio) && (index < _fin)) {
            autores_html += '<tr>';
            autores_html += '<td class="autor_seleccionado">' + autor.autor_id + '</td>';
            autores_html += '<td>' + autor.nombres + '</td>';
            autores_html += '<td>' + autor.apellidos + '</td>';
            autores_html += '<td>' + ObtenerNacionalidadAutor(autor.nacionalidad, Paises_retreived) + '</td>';
            autores_html += '<td>' + autor.fecha_ingreso + '</td>';
            autores_html += '<td> <input type="button" class="button tabla_button" value="Editar" onclick="ObtenerIdEditarAutorTabla(this)"> - ' +
                '<input type="button" class="button tabla_button" value="Eliminar" onclick="EliminarAutorTabla(this)"> </td>';
            autores_html += '</td>';
        } else return;
    });
    autores_html += '</tbody>';
    $('#table_autores').html(autores_html);
    if (Autores.length < saltos_tabla) {
        $('#lbl_rango_autores').html(`Del ${inicio_actual+1} al ${Autores.length} de ${Autores.length}`);
    } else {
        $('#lbl_rango_autores').html(`Del ${inicio_actual+1} al ${fin_actual} de ${Autores.length}`);
    }
}

/*
    Funcion que busca el elemento en arreglo de objetos por medio de un id que recibe como parametro
    Retorna el indice donde se encontro el elemento
*/
function ObtenerAutorIndex(_id) {
    var indice;
    $.each(Autores, function(index, autor) {
        if (autor.autor_id == _id) indice = index;
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
function EliminarAutor(_id) {
    var encontrado = false;
    var indice = 0;
    $.each(Autores, function(index, autor) {
        if (autor.autor_id == _id) {
            indice = index;
            encontrado = true;
            return;
        }
    });
    Autores.splice(indice, 1);
    GuardarAutores();
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
function EliminarAutorTabla(_elemento) {
    var id_elemento = parseInt($(_elemento).closest('tr').find('.autor_seleccionado').text());
    if (confirm('Esta seguro que desea eliminar este Autor?')) {
        if (ExisteAsociacionAutorConLibro(id_elemento)) alert('Existen libros asociados con este autor, eliminalos primero.')
        else {
            if (EliminarAutor(id_elemento)) {
                alert('Autor elminado!');
                location.reload();
            } else alert('No se pudo eliminar el autor');
        }
    }
}

/*
    Funcionq q no recibe parametros y setea los datos a los txts corresponidentes
    Cargando el id del elemento desde local storage
*/
function SetearDatosAutor() {
    var id_autor = localStorage.getItem('editar_autor');
    var indice = ObtenerAutorIndex(id_autor);
    $('#txt_nombres_autor_editar').val(Autores[indice].nombres);
    $('#txt_apellidos_autor_editar').val(Autores[indice].apellidos);
    $('#slc_nacionalidad_autor_editar').val(Autores[indice].nacionalidad);
    $('#txt_fecha_nacimiento_autor_editar').val(Autores[indice].nacimiento);
    $('#txt_fecha_fallecimiento_autor_editar').val(Autores[indice].fallecimiento);
    $('#txt_fecha_ingreso_autor_editar').val(Autores[indice].fecha_ingreso);
    if(Autores[indice].genero==1)$("#radio_masculino_autor_editar").attr('checked', true);
    else $('#radio_femenino_autor_editar').attr('checked', true);
}

/*
    Se cargan los paises al select de pais en la ventana nuevo autor o editar autor
*/
function CargarPaises() {
    var paises_html = '';
    $.each(Paises, function(index, pais) {
        paises_html += `<option value='${pais.id}'>${pais.nombre}</option>`;
    });
    $('.slc_pais').html(paises_html);
}

/*
    Funcion que recibe los datos nuevos del autor
    Se obtiene el valor del id del autor desde local storage
    se obtiene el index del autor por medio del id
    se guardan los cambios en el arreglo en el indice correcto
    Se llama la funcion GuardarAutores para acutalizar datos en local storage
    se redirige a autores.html
*/
function ModificarAutor(_nombres, _apellidos, _nacionalidad, _genero, _nacimiento, _fallecimiento, _fecha_ingreso) {
    var id_autor = localStorage.getItem('editar_autor');
    var indice = ObtenerAutorIndex(id_autor);
    Autores[indice].nombres = _nombres;
    Autores[indice].apellidos = _apellidos;
    Autores[indice].nacionalidad = _nacionalidad;
    Autores[indice].genero = _genero;
    Autores[indice].nacimiento = _nacimiento;
    Autores[indice].fallecimiento = _fallecimiento;
    Autores[indice].fecha_ingreso = _fecha_ingreso;
    GuardarAutores();
    alert('Autor Modificado con exito!');
    window.location.href = 'autores.html';
}

/*
    Funion que se llama desde cada boton de cada elemento de la tabla que recibe como parametro el boton
    Se obtiene el id del elemento por medio de jquery
    Se guarda el id en localStorage
    se redirige a editar_autor.html
*/
function ObtenerIdEditarAutorTabla(_elemento) {
    var id_autor = parseInt($(_elemento).closest('tr').find('.autor_seleccionado').text());
    localStorage.setItem('editar_autor', id_autor);
    window.location.href = 'editar_autor.html';
}

/*
    Funcion que no reibe parametros y valida cada uno de los campos
    si hay error notifica al usuario
    si no procede a registrar nuevo autor
*/
function ValidarRegistroAutor() {
    var error = false;
    var mensaje = '';
    var nombres = $('#txt_nombres_autor').val();
    var apellidos = $('#txt_apellidos_autor').val();
    var nacionalidad = $('#slc_nacionalidad_autor').val();
    var genero = $('input:radio[name=radio_genero_autor]:checked').val();
    var nacimiento = $('#txt_fecha_nacimiento_autor').val();
    var fallecimiento = $('#txt_fecha_fallecimiento_autor').val();
    var fecha_ingreso = $('#txt_fecha_ingreso_autor').val();

    if (nombres == '') {
        error = true;
        mensaje += 'Debe ingresar al menos un nombre\n';
    }
    if (apellidos == '') {
        error = true;
        mensaje += 'Debe ingresar al menos un apellido\n';
    }
    if (!genero) {
        error = true;
        mensaje += 'Debe seleccionar el genero\n';
    }
    if (nacimiento == '') {
        error = true;
        mensaje += 'Debe ingresar la fecha de nacimiento\n';
    }
    if (nacimiento != '' && !ValidarFecha(nacimiento)) {
        error = true;
        mensaje += 'Formato de fecha de nacimiento incorrecta\n';
    }
    if (fallecimiento != '' && !ValidarFecha(fallecimiento)) {
        error = true;
        mensaje += 'Formato de fecha de fallecimiento incorrecta\n';
    }
    error ? alert(mensaje) : AgregarNuevoAutor(nombres, apellidos, nacionalidad, genero, nacimiento, fallecimiento, fecha_ingreso);
}

/*
    Funcion que valida los campos de modificar autor
    si hay error notifica al usuario
    si no procede a modificar el autor
*/
function ValidarModificacionAutor() {
    var error = false;
    var mensaje = '';
    var nombres = $('#txt_nombres_autor_editar').val();
    var apellidos = $('#txt_apellidos_autor_editar').val();
    var nacionalidad = $('#slc_nacionalidad_autor_editar').val();
    var genero = $('input:radio[name=radio_genero_autor_editar]:checked').val();
    var nacimiento = $('#txt_fecha_nacimiento_autor_editar').val();
    var fallecimiento = $('#txt_fecha_fallecimiento_autor_editar').val();
    var fecha_ingreso = $('#txt_fecha_ingreso_autor_editar').val();

    if (nombres == '') {
        error = true;
        mensaje += 'Debe ingresar al menos un nombre\n';
    }
    if (apellidos == '') {
        error = true;
        mensaje += 'Debe ingresar al menos un apellido\n';
    }
    if (!genero) {
        error = true;
        mensaje += 'Debe seleccionar el genero\n';
    }
    if (nacimiento == '') {
        error = true;
        mensaje += 'Debe ingresar la fecha de nacimiento\n';
    }
    if (nacimiento != '' && !ValidarFecha(nacimiento)) {
        error = true;
        mensaje += 'Formato de fecha de nacimiento incorrecta\n';
    }
    if (fallecimiento != '' && !ValidarFecha(fallecimiento)) {
        error = true;
        mensaje += 'Formato de fecha de fallecimiento incorrecta\n';
    }
    error ? alert(mensaje) : ModificarAutor(nombres, apellidos, nacionalidad, genero, nacimiento, fallecimiento, fecha_ingreso);
}

/*
    Funcion que recibe el id del autor
    carga el arreglo libros desde localStorage
    busca por medio de un each si el id ingresado esta asociado a un libro o varios
    retorna una variable bandera para saber si es true encontrado y false no encontrado
*/
function ExisteAsociacionAutorConLibro(_id_autor) {
    var Libros_retreived = JSON.parse(localStorage.getItem('libros'));
    if(Libros_retreived == null) return false;
    if (Libros_retreived.length == 0) return false;
    var encontrado = false;
    $.each(Libros_retreived, function(index, value) {
        if (_id_autor == parseInt(value.autor_id)) {
            encontrado = true;
            return;
        }
    })
    return encontrado;
}

/*
    funcion para llamar eventos de los elementos de html
*/
$(function() {

    $('#table_autores').tablesorter();

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
        evento click del boton agregar nuevo autor
        redirige a nuevo_autor.html
    */
    $('#btn_agregar_nuevo_autor').click(function() {
        window.location.href = 'nuevo_autor.html';
    });

    /*
        evento click del boton regresar de nuevo autor
        redirige a autores.html
    */
    $('#btn_regresar_agregar_autor').click(function() { ///////////////
        window.location.href = 'autores.html';
    });

    /*
        evento click del boton registrar en nuevo autor
        llama a la funcion ValidarRegistroAutor para validar campos y registrar
    */
    $('#btn_aceptar_agregar_autor').on('click', function() { ///////////////////
        ValidarRegistroAutor();
    });

    /*
        evento click del boton regresar de ventana editar
        redirige a autores.html
    */
    $('#btn_regresar_editar_autor').on('click', function() { ///////////////////
        window.location.href = 'autores.html';
    });

    /*
        evento click del boton aceptar en ventana editar autor
        llama la fucnion ValidarModificacionAutor valida campos y modifica
    */
    $('#btn_aceptar_editar_autor').on('click', function() { ///////////////////
        ValidarModificacionAutor();
    });

    /*
        evento click del boton anterior para paginacion de la tabla
        llama  la funcion VerAutores con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla osea q existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerAutores con los nuevos parametros
    */
    $('#btn_anterior_autores').on('click', function() {
        if (inicio_actual >= saltos_tabla) {
            inicio_actual -= saltos_tabla;
            fin_actual -= saltos_tabla;
            VerAutores(inicio_actual, fin_actual);
        }
    });

    /*
        evento click del boton siguiente para paginacion de la tabla
        llama  la funcion VerAutores con sus respectivos parametros si:
            el inicio_actual es menor que el tamano del arreglo es decir que existen elementos siguientes
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerAutores con los nuevos parametros
    */
    $('#btn_siguiente_autores').on('click', function() {
        if (fin_actual < Autores.length) {
            inicio_actual += saltos_tabla;
            fin_actual += saltos_tabla;
            VerAutores(inicio_actual, fin_actual);
        }
        //si se ha llegao al final de los elementos y se muestran los ultimos acutalmente
        //se setea el rango de objetos visibles de la siguiente manera
        if (inicio_actual + saltos_tabla > Autores.length) {
            $('#lbl_rango_autores').html(`Del ${inicio_actual+1} al ${Autores.length} de ${Autores.length}`);
        }
    });

    /*
        evento click del boton ver 10 autores para paginacion de la tabla
        modifica las variables de saltos_tabla a 10
        regersa al inicio
        llama  la funcion VerAutores con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla osea q existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerAutores con los nuevos parametros
    */
    $('#btn_ver_10_autores').on('click', function() {
        saltos_tabla = 10;
        inicio_actual = 0;
        fin_actual = inicio_actual + saltos_tabla;
        VerAutores(inicio_actual, fin_actual);
        if (inicio_actual + saltos_tabla > Autores.length) {
            $('#lbl_rango_autores').html(`Del ${inicio_actual+1} al ${Autores.length} de ${Autores.length}`);
        }
    });

    /*
        evento click del boton ver 20 autores para paginacion de la tabla
        modifica las variables de saltos_tabla a 20
        regersa al inicio
        llama  la funcion VerAutores con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla osea q existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerAutores con los nuevos parametros
    */
    $('#btn_ver_20_autores').on('click', function() {
        saltos_tabla = 20;
        inicio_actual = 0;
        fin_actual = inicio_actual + saltos_tabla;
        VerAutores(inicio_actual, fin_actual);
        if (inicio_actual + saltos_tabla > Autores.length) {
            $('#lbl_rango_autores').html(`Del ${inicio_actual+1} al ${Autores.length} de ${Autores.length}`);
        }
    });

    /*
        evento click del boton ver 50 autores para paginacion de la tabla
        modifica las variables de saltos_tabla a 50
        regersa al inicio
        llama  la funcion VerAutores con sus respectivos parametros si:
            el inicio_actual es mayor o igual que saltos de tabla osea q existen elementos anteriores
            actualiza las variables inicio y fin actual si se mueve
            procede a llamar a la funcion VerAutores con los nuevos parametros
    */
    $('#btn_ver_50_autores').on('click', function() {
        saltos_tabla = 50;
        inicio_actual = 0;
        fin_actual = inicio_actual + saltos_tabla;
        VerAutores(inicio_actual, fin_actual);
        if (inicio_actual + saltos_tabla > Autores.length) {
            $('#lbl_rango_autores').html(`Del ${inicio_actual+1} al ${Autores.length} de ${Autores.length}`);
        }
    });

    $('#btn_regresar_agregar_autor').click(function() { //////////
        window.location.href = 'autores.html';
    });

    $('#btn_regresar_editar_autor').click(function() { //////////
        window.location.href = 'autores.html';
    });

    $('.btn_pagina_actual').click(function() {
        location.reload();
    });

    $('.btn_libros').click(function() {
        window.location.href = 'libros.html';
    });

    $('.btn_prestamos').click(function() {
        window.location.href = 'libros_prestamos.html';
    });

    $('.btn_usuarios').click(function() {
        window.location.href = 'usuarios.html';
    });

    $('.btn_temas').click(function() {
        window.location.href = 'temas.html';
    });

});
