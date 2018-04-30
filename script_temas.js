var Temas = []; //array Temas que contendra todos los temas ingresados por el usuario en localStorage
var tema = {//Protoripo tema que sirve para crear nuevos temas
    tema_id: 0,
    tema: '',
    fecha_ingreso: ''
};
var saltos_tabla = 2; //variable para determinar cuantos elementos se muestran en la tabla
var inicio_actual = 0;//variable para saber en que elemento se encuentra el inicio de la tabla actualmente
var fin_actual = inicio_actual + saltos_tabla;//variable que se calcula a partir de la suma del inicio actual y los saltos de tabla indica el fin acutal de la tabla

CargarTemas();//Se cargan temas de local storeage si existen
//GenerarTemasTest();
VerTemas(inicio_actual, fin_actual);//se muestran los temas en la tabla segun las variables previamente definidas


function CargarTemas() {//funcion que carga el arreglo temas desde localStorage
    var retrievedObject = localStorage.getItem('temas');
    if (retrievedObject != null) {
        Temas = JSON.parse(retrievedObject);
    }
}

function GuardarTemas() {//funcion que se encarga de guardar y sobreescribir el arreglo temas en local storage
    localStorage.setItem('temas', JSON.stringify(Temas));
}

//funcion que se encarga de retornar una cadena fecha con fecha de hoy con el formato dd/mm/aaaa
function ObtenerFechaHoy() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    return dia + '/' + mes + '/' + anio;
}

//Funcion que genera temas de prueba si la variable en localStorage de temas no existe
function GenerarTemasTest() {
    if (localStorage.getItem('temas') != null) return;
    for (var i = 0; i < 17; i++) {
        var nuevo_tema = Object.create(tema);
        nuevo_tema.tema_id = Temas.length + 1;
        nuevo_tema.tema = 'mi tema' + i;
        nuevo_tema.fecha_ingreso = ObtenerFechaHoy();
        Temas.push(nuevo_tema);
        GuardarTemas();
    }
}

/*
    Funcion que recibe como parametro el nombre del tema
    Crea un objeto nuevo_tema de tipo tema
    Se le asigna  id autoincrementable
    Se le asigna el nombre del tema y fecha de ingreso
    Se hace push al arreglo de objetos Temas
    Se guardar los cambios en localStorage con la funcion GuardarTemas
    Se notificar al usuario por medio de un alert
    Redirige a la pagina temas.html
*/
function AgregarNuevoTema(_tema) {
    var nuevo_tema = Object.create(tema);
    if (Temas.length == 0) nuevo_tema.tema_id = 1;
    else nuevo_tema.tema_id = Temas[Temas.length - 1].tema_id + 1;
    nuevo_tema.tema = _tema;
    nuevo_tema.fecha_ingreso = ObtenerFechaHoy();
    Temas.push(nuevo_tema);
    GuardarTemas();
    alert('Tema agregado exitosamente');
    window.location.href = 'temas.html';
}

/*
    Funcion VerTemas que recibe como parametro el inicio y fin de donde empieza y termina la visualizacion de los elementos
    en la tabla
    Se crea la estructura del html de la tabla unicamente con los elementos que esten dentro del rango de los parametros
    recibidos
    Se insertan los elementos al html
*/
function VerTemas(_inicio, _fin) {
    var temas_html = `<thead><tr>
                            <th class="ordenable">#</th>
                            <th class="ordenable">Tema</th>
                            <th class="ordenable">Fecha de ingreso</th>
                            <th>Operaciones</th>
                        </tr></thead><tbody>`;
    $.each(Temas, function(index, tema) {
        if ((index >= _inicio) && (index < _fin)) {
            temas_html += '<tr>';
            temas_html += '<td class="tema_seleccionado">' + tema.tema_id + '</td>';
            temas_html += '<td>' + tema.tema + '</td>';
            temas_html += '<td>' + tema.fecha_ingreso + '</td>';
            temas_html += '<td> <input type="button" class="button tabla_button" value="Editar" onclick="ObtenerIdEditarTemaTabla(this)"> - ' +
                '<input type="button" class="button tabla_button" value="Eliminar" onclick="EliminarTemaTabla(this)"> </td>';
            temas_html += '</td>';
        } else return;
    });
    temas_html += '</tbody>';
    $('#table_temas').html(temas_html);
    Temas.length < saltos_tabla ? $('#lbl_rango_temas').html(`Del ${inicio_actual+1} al ${Temas.length} de ${Temas.length}`) : $('#lbl_rango_temas').html(`Del ${inicio_actual+1} al ${fin_actual} de ${Temas.length}`);
}

/*
    Funcion que busca el elemento en arreglo de objetos por medio de un id que recibe como parametro
    Retora el indice donde se encontro el elemento
*/
function ObtenerTemaIndex(_id) {
    var indice;
    $.each(Temas, function(index, tema) {
        if (tema.tema_id == _id) indice = index;
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
function EliminarTema(_id) {
    var encontrado = false;
    var indice = 0;
    $.each(Temas, function(index, tema) {
        if (tema.tema_id == _id) {
            indice = index;
            encontrado = true;
            return;
        }
    });
    Temas.splice(indice, 1);
    GuardarTemas();
    return encontrado;
}

/*
    Funcion que se encarga de obtener el id del elemento que se quiere eliminar en la tabla
    Recibe como parametro el elemento en este caso el boton que se presiona
    Se busca la clase tema_seleccionado por medio de jquery y se obtiene el id del elemento a eliminar
    Se verifica si el id tiene asociados libros
        Si tiene se avisa que no se puede Eliminar
        Si no tiene se procede a llamar a la funcion EliminarTema
*/
function EliminarTemaTabla(_elemento) {
    var id_elemento = parseInt($(_elemento).closest('tr').find('.tema_seleccionado').text());
    if (confirm('Esta seguro que desea eliminar este Tema?')) {
        if (ExisteAsociacionTemaConLibro(id_elemento)) {
            alert('Existen libros asociados con este tema, eliminalos primero.');
        } else {
            if (EliminarTema(id_elemento)) {
                alert('Tema elminado!');
                location.reload();
            } else alert('No se pudo eliminar el tema');
        }
    }
}

/*
    Funcionq q no recibe parametros y setea los datos a los txts corresponidentes
    Cargando el id del elemento desde local storage
*/
function SetearDatosTema() {
    var id_tema = localStorage.getItem('editar_tema');
    var indice = ObtenerTemaIndex(id_tema);
    $('#txt_nombre_tema_editar').val(Temas[indice].tema);
    $('#txt_fecha_ingreso_tema_editar').val(Temas[indice].fecha_ingreso);
}

/*
    Se obtiene el valor del id del tema desde local storage
    se obtiene el index del tema por medio del id
    se guardan los cambios en el arreglo en el indice correcto
    Se llama la funcion GuardarTemas para acutalizar datos en local storage
    se redirige a temas.html
*/
function ModificarTema(_tema) {
    var id_tema = localStorage.getItem('editar_tema');
    var indice = ObtenerTemaIndex(id_tema);
    Temas[indice].tema = _tema;
    GuardarTemas();
    alert('Tema Modificado con exito!');
    window.location.href = 'temas.html';
}

/*
    Funion que se llama desde cada boton de cada elemento de la tabla que recibe como parametro el boton
    Se obtiene el id del elemento por medio de jquery
    Se guarda el id en localStorage
    se redirige a editar_tema
*/
function ObtenerIdEditarTemaTabla(_elemento) {
    var id_tema = parseInt($(_elemento).closest('tr').find('.tema_seleccionado').text());
    localStorage.setItem('editar_tema', id_tema);
    window.location.href = 'editar_tema.html';
}

/*
    Funcion que no reibe parametros y valida cada uno de los campos
    si hay error notifica al usuario
    si no procede a registrar nuevo tema
*/
function ValidarRegistroTema() {
    var error = false;
    var mensaje = '';
    var tema = $('#txt_nombre_tema').val();
    var fecha_ingreso = $('#txt_fecha_ingreso_tema').val();
    if (tema == '') {
        error = true;
        mensaje += 'Debe ingresar el nombre del tema\n';
    }
    error ? alert(mensaje) : AgregarNuevoTema(tema);
}

/*
    Funcion que valida los campos de modificar temas
    si hay error notifica al usuario
    si no procede a modificar el tema
*/
function ValidarModificacionTema() {
    var error = false;
    var mensaje = '';
    var tema = $('#txt_nombre_tema_editar').val();
    var fecha_ingreso = $('#txt_fecha_ingreso_tema_editar').val();
    if (tema == '') {
        error = true;
        mensaje += 'Debe ingresar el nombre del tema\n';
    }
    error ? alert(mensaje) : ModificarTema(tema);
}

/*
    Funcion que recibe el id del tema
    carga el arreglo libros desde localStorage
    busca por medio de un each si el id ingresado esta asociado a un libro o varios
    retorna una variable bandera para saber si es true encontrado y false no encontrado
*/
function ExisteAsociacionTemaConLibro(_id_tema) {
    var Libros_retreived = JSON.parse(localStorage.getItem('libros'));
    if(Libros_retreived == null) return false;
    if (Libros_retreived.length == 0) return false;
    var encontrado = false;
    $.each(Libros_retreived, function(index, value) {
        if (_id_tema == parseInt(value.tema_id)) {
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

    $('#table_temas').tablesorter();

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
        localStorage.setItem('editar_tema', null);
    });

    /*
        evento click del boton agregar nuevo tema
        redirige a nuevo_tema.html
    */
    $('#btn_agregar_nuevo_tema').click(function() {
        window.location.href = 'nuevo_tema.html';
    });

    /*
        evento click del boton regresar de nuevo tema
        redirige a temas.html
    */
    $('#btn_regresar_agregar_tema').click(function() { ///////////////
        window.location.href = 'temas.html';
    });

    $('.btn_prestamos').click(function() {
        window.location.href = 'libros_prestamos.html';
    });

    $('.btn_usuarios').click(function() {
        window.location.href = 'usuarios.html';
    });

    /*
        evento click del boton registrar en nuevo tema
        llama a la funcion ValidarRegistroTema para validar campos y registrar
    */
    $('#btn_aceptar_agregar_tema').on('click', function() { ///////////////////
        ValidarRegistroTema();
    });

    /*
        evento click del boton regresar de ventana editar
        redirige a temas.html
    */
    $('#btn_regresar_editar_tema').on('click', function() { ///////////////////
        window.location.href = 'temas.html';
    });

    /*
        evento click del boton aceptar en ventana editar tema
        llama la fucnion ValidarModificacionTema valida campos y modifica
    */
    $('#btn_aceptar_editar_tema').on('click', function() { ///////////////////
        ValidarModificacionTema();
    });

    /*
        evento click en la clase btn_pagina_actual que recarga la pagina actual
    */
    $('.btn_pagina_actual').click(function() {
        location.reload();
    });

    /*
        evento click de la clase btn_libros que redirige a libros.html
    */
    $('.btn_libros').click(function() {
        window.location.href = 'libros.html';
    });

    /*
        evento click de btn_autores que redirige a autores.html
    */
    $('.btn_autores').click(function() {
        window.location.href = 'autores.html';
    });

});
