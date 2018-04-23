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
var prestamo = {
    prestamo_id: 0,
    libro_id: 0,
    usuario_id: 0,
    fecha_prestamo: '',
    fecha_devolucion: '',
    token: '',
    estado: 1
};
var saltos_tabla = 3; //variable para determinar cuantos elementos se muestran en la tabla
var inicio_actual = 0; //variable para saber en que elemento se encuentra el inicio de la tabla actualmente
var fin_actual = inicio_actual + saltos_tabla; //variable que se calcula a partir de la suma del inicio actual y
//los saltos de tabla indica el fin acutal de la tabla

CargarLibros(); //Se cargan libros de local storeage si existen
VerLibros(inicio_actual, fin_actual); //se muestran los libros en la tabla segun las variables previamente definidas

function CargarLibros() { //funcion que carga el arreglo libros desde localStorage
    var retrievedObject = localStorage.getItem('libros');
    if (retrievedObject != null) {
        Libros = JSON.parse(retrievedObject);
    }
}

function GuardarLibros() { //funcion que se encarga de guardar y sobreescribir el arreglo libros en local storage
    localStorage.setItem('libros', JSON.stringify(Libros));
}

//funcion que se encarga de retornar una cadena fecha con fecha de hoy con el formato dd/mm/aaaa
function ObtenerFechaHoy(_usa_format) {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    if (_usa_format != 'usa_format')return dia + '/' + mes + '/' + anio;
    else return mes + '/' + dia + '/' + anio;
}

function ObtenerDiaHoy() {
    var fecha = new Date();
    return fecha.getDate();
}

/*
    Funcion que recibe como parametro el id del autor y el array autores previamente cargada de localStorage
    recorre el arreglo de objetos y devuelve el objeto que haga coincidencia con el id recibido
*/
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
        var boton = '<input type="button" class="button tabla_button" value="Prestar" onclick="ObtenerIdPrestarLibro(this)">';
        if (libro.disponibles == 0) boton = 'No Disponible';
        var nombre_autor = ObtenerInfoAutor(libro.autor_id);
        var nombre_tema = ObtenerInfoTema(libro.tema_id);
        if ((index >= _inicio) && (index < _fin)) {
            libros_html += '<tr>';
            libros_html += '<td class="libro_seleccionado">' + libro.libro_id + '</td>';
            libros_html += '<td>' + libro.titulo + '</td>';
            libros_html += '<td>' + nombre_autor.nombres + '</td>';
            libros_html += '<td>' + nombre_tema.tema + '</td>';
            libros_html += '<td>' + libro.ubicacion + '</td>';
            libros_html += '<td>' + libro.disponibles + '</td>';
            libros_html += '<td> ' + boton + '</td>';
            libros_html += '</tr>';
        } else return;
    });
    $('#table_libros').html(libros_html);
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
    Funcionq q no recibe parametros y setea los datos a los tds corresponidentes de la tabla info libro
    Busca la informacion del libro por medio de un indice que se recibe de una funcion que recie el id del libro
    Obtiene informacion sobre el autor por medio del id del autor relacionado con el libro
    Obtiene informacion sobre el tema por medio del id del tema relacionado con el libro
*/
function SetearDatosLibro() {
    var id_libro = localStorage.prestar_libro;
    var indice = ObtenerLibroIndex(id_libro);
    var autor = ObtenerInfoAutor(Libros[indice].autor_id);
    var tema = ObtenerInfoTema(Libros[indice].tema_id);
    $('#td_libro_titulo').html(Libros[indice].titulo);
    $('#td_libro_autor').html(autor.nombres);
    $('#td_libro_tema').html(tema.tema);
    $('#td_libro_ubicacion').html(Libros[indice].ubicacion);
    $('#td_libro_disponibles').html(Libros[indice].disponibles);
    $('#td_libro_prestamo').html(ObtenerFechaHoy());
    $('#td_libro_devolucion').html(ObtenerFechaDevolucion());
}

/*
    Funcion que se llama desde cada boton de cada elemento de la tabla que recibe como parametro el boton
    Se obtiene el id del elemento por medio de jquery
    Se guarda el id en localStorage
    se redirige a usuarios_prestar_libro.html
*/
function ObtenerIdPrestarLibro(_elemento) {
    var id_libro = parseInt($(_elemento).closest('tr').find('.libro_seleccionado').text());
    localStorage.setItem('prestar_libro', id_libro);
    window.location.href = 'usuarios_prestar_libro.html';
}

/*
    Funcion TokenDuplicado que recibe como parametro un token
    Recoorre el arreglo de prestamos
    devuelve una varialbe bandera encontrado q se igualara a true si se encuentra un token
*/
function TokenDuplicado(_token) {
    var prestamos = [];
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    var encontrado = false;
    $.each(prestamos, function(index, valor) {
        if (_token == valor.token) encontrado = true;
    });
    return encontrado;
}

/*
    Al realizar el préstamo, se debe generar un token UNICO aleatorio, alfanumérico de
    15 caracteres que identificará el prestamo, no se debe incluir el cero, la letra “o”
    minúscula y mayúscula, la letra ele minúscula “l”, la letra i mayúscula “I”, debido a su
    parecido visual.
    Funcion GenerarToken que no recibe ningun parametro y retorna un token con el formato antes mencionado
    Se verifica por medio de un dowhile que un token no esté repetido en ningun otro token dentro del arreglo prestamos
        Dentro de un for de 0 a 14 se genera aleatoriamente cada codigo ascii para luego obtener su valor en string y concatenarlo a
        la variable token cada rango es para evitar los caracteres que se especifican anteriormente
*/
function GenerarToken() {
    var token = '';
    do {
        for (var i = 0; i < 15; i++) {
            var ascii;
            var rango = Math.floor((Math.random() * 7));
            var char;
            switch (rango) {
                case 0:
                    ascii = Math.floor((Math.random() * (73 - 65) + 65));
                    char = String.fromCharCode(ascii);
                    token += char;
                    break;
                case 1:
                    ascii = Math.floor((Math.random() * (78 - 74) + 74));
                    char = String.fromCharCode(ascii);
                    token += char;
                    break;
                case 2:
                    ascii = Math.floor((Math.random() * (91 - 80) + 80));
                    char = String.fromCharCode(ascii);
                    token += char;
                    break;
                case 3:
                    ascii = Math.floor((Math.random() * (108 - 97) + 97));
                    char = String.fromCharCode(ascii);
                    token += char;
                    break;
                case 4:
                    ascii = Math.floor((Math.random() * (111 - 109) + 109));
                    char = String.fromCharCode(ascii);
                    token += char;
                    break;
                case 5:
                    ascii = Math.floor((Math.random() * (123 - 112) + 112));
                    char = String.fromCharCode(ascii);
                    token += char;
                    break;
                case 6:
                    ascii = Math.floor((Math.random() * (58 - 49) + 49));
                    char = String.fromCharCode(ascii);
                    token += char;
                    break;
                default:
            }
        }
    } while (TokenDuplicado(token));
    return token;
}

/*
    Funcion ObtenerFechaDevolucion que no recibe ningun parametro y retorna la fecha de devolucion como string en formato
    dd/mm/aaaa haciendo uso de funciones auxiliares
        -ObtenerFechaHoy pidiendo formato de usa
        -ObtenerDiaHoy que devuelve el dia actual
    Se le suman 8 dias a la fecha de hoy y ese sera la fecha de devolucion
*/
function ObtenerFechaDevolucion() {
    var date = new Date(ObtenerFechaHoy('usa_format'));
    date.setDate(ObtenerDiaHoy()+8);
    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    var anio = date.getFullYear();
    return fecha_devolucion = dia + '/' + mes + '/' + anio;
}
/*
    Un usuario puede tener como máximo 10 libros prestados. Este dato debe ser
    configurable únicamente por un administrador.
    • Si un usuario ya tiene 10 libros prestados, no puede prestar ninguno, a menos que
    devuelva alguno
    Funcion que recorre el arreglo prestamos buscado coincidencias del parametro que recibe que es el id del usuario
    Si existe coincidencia se incrementa la variable cantidad_prestamos
    Retorna cantidad_prestamos
*/
function CantidadPrestamosUsuario(_usuario_id) {
    var cantidad_prestamos = 0;
    var prestamos = [];
    if(localStorage.prestamos!=null)prestamos = JSON.parse(localStorage.prestamos);
    $.each(prestamos, function (index, valor) {
        if(valor.usuario_id == _usuario_id && (valor.estado == 1 || valor.estado == 2))cantidad_prestamos++;
    });
    return cantidad_prestamos;
}

/*
    Funcion VerificarPrestamo que no recibe ningun parametro y obtiene datos desde local storage
    Los datos que se obtienen de local storage son:
        - Arreglo de prestamos
        - index del usuario logeado
        - id del libro a prestar
        - Arreglo de usuarios
    Se verifica estado del usuario
        Si es moroso se concatena mensaje de error
        Si tiene mas de 10 libros prestados se concatena mensaje de error
    Si mensaje de error es vacio
        Se realiza el prestamo del libro
    Si hay mensajes de error
        Se muestran en un alert
*/
function VerificarPrestamo() {
    var mensaje = '';
    var nuevo_prestamo = Object.create(prestamo);
    var prestamos = [];
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    var libro_id = parseInt(localStorage.prestar_libro);
    var usuario_index = localStorage.user_logeado;
    var usuarios = JSON.parse(localStorage.usuarios);
    if (usuarios[usuario_index].estado != '1') mensaje += '\n- Usuario moroso';
    var cantidad_prestamos = CantidadPrestamosUsuario(usuarios[usuario_index].id);
    console.log(cantidad_prestamos);
    if (cantidad_prestamos>=10) mensaje += '\n- Ya tiene ' + cantidad_prestamos + ' libros prestados, el maximo permitido es 10';
    if (usuarios[usuario_index].estado != 1) mensaje += '\n- Usuario moroso, solvente su deuda para poder prestar mas libros';
    if (mensaje == ''){
        var libro_index = ObtenerLibroIndex(libro_id);
        Libros[libro_index].disponibles--;
        if (prestamos.length == 0) nuevo_prestamo.prestamo_id = 1;
        else nuevo_prestamo.prestamo_id = prestamos[prestamos.length - 1].prestamo_id + 1;
        nuevo_prestamo.libro_id = libro_id;
        nuevo_prestamo.usuario_id = usuarios[usuario_index].id;
        //nuevo_prestamo.fecha_prestamo = $('#td_libro_prestamo').html();
        //nuevo_prestamo.fecha_devolucion = $('#td_libro_devolucion').html();
        nuevo_prestamo.fecha_prestamo = "10/4/2018";
        nuevo_prestamo.fecha_devolucion = "15/4/2018";
        nuevo_prestamo.token = GenerarToken();
        nuevo_prestamo.estado = 1;
        prestamos.push(nuevo_prestamo);
        localStorage.setItem('prestamos', JSON.stringify(prestamos));
        GuardarLibros();
        alert('Libro prestado');
        window.location.href = 'usuarios_libros.html';
    }else {
        alert(mensaje);
        window.location.href = 'usuarios_libros.html';
    }

}

$(function() {

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

});
