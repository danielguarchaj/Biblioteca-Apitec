var saltos_tabla_usuarios = 10;
var inicio_actual_usuarios = 0;
var fin_actual_usuarios = inicio_actual_usuarios + saltos_tabla_usuarios;

function ObtenerCantidadLibrosPrestados(_usuario_id, _prestamos) {
    var prestamos = 0;
    $.each(_prestamos, function(index, prestamo) {
        if (_usuario_id == prestamo.usuario_id) prestamos++;
    })
    return prestamos;
}

function ObtenerNombreDepartamento(_municipio_id) {
    var departamento_id;
    var departamento_nombre;
    $.each(Municipios, function(index, municipio) {
        if (municipio.id == _municipio_id) departamento_id = municipio.departamento_id;
    });
    $.each(Departamentos, function (index, departamento) {
        if(departamento.id == departamento_id)departamento_nombre=departamento.nombre;
    });
    return departamento_nombre;
}

/*
    Funcion VerUsuarios que recibe como parametros el inicio y el fin de la cantidad de elementos que se desea ver
    Muestra informacion de todos los usuarios
*/
function VerUsuarios(_inicio, _fin) {
    var usuarios;
    var prestamos;
    if (localStorage.usuarios != null) usuarios = JSON.parse(localStorage.usuarios);
    else return;
    if (localStorage.prestamos != null) prestamos = JSON.parse(localStorage.prestamos);
    else return;
    var usuarios_html = `<tr>
                            <th>#</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Departamento</th>
                            <th>Libros</th>
                            <th>Estado</th>
                            <th>Operaciones</th>
                        </tr>`;
    $.each(usuarios, function(index, usuario) {
        var estado;
        if (usuario.estado == 1) {
            estado = '<td style="color: blue;"> Activo </td>';
        } else {
            estado = '<td style="color: red;"> Moroso </td>';
        }
        if ((index >= _inicio) && (index < _fin)) {
            usuarios_html += '<tr>';
            usuarios_html += '<td class="usuario_seleccionado">' + usuario.id + '</td>';
            usuarios_html += '<td>' + usuario.nombres + '</td>';
            usuarios_html += '<td>' + usuario.apellidos + '</td>';
            usuarios_html += '<td>' + ObtenerNombreDepartamento(usuario.municipio) + '</td>';
            usuarios_html += '<td>' + ObtenerCantidadLibrosPrestados(usuario.id, prestamos) + '</td>';
            usuarios_html += estado;
            usuarios_html += '<td> <input type="button" class="button tabla_button" value="Ver" onclick="VerUsiarioPerfil(this)"> </td>';
            usuarios_html += '</tr>';
        } else return;
    });
    $('#table_usuarios').html(usuarios_html);
    usuarios.length < saltos_tabla_usuarios ? $('#lbl_rango_usuarios').html(`Del ${inicio_actual_usuarios+1} al ${usuarios.length} de ${usuarios.length}`) : $('#lbl_rango_usuarios').html(`Del ${inicio_actual_usuarios+1} al ${fin_actual_usuarios} de ${usuarios.length}`);
    if (usuarios.length == 0) $('#lbl_rango_usuarios').html('Del 0 al 0 de 0');
}

VerUsuarios(inicio_actual_usuarios, fin_actual_usuarios);

/*
    evento click del boton anterior para paginacion de la tabla
    llama  la funcion VerUsuarios con sus respectivos parametros si:
        el inicio_actual es mayor o igual que saltos de tabla es decir existen elementos anteriores
        actualiza las variables inicio y fin actual si se mueve
        procede a llamar a la funcion VerLibros con los nuevos parametros
*/
$('#btn_usuarios_anterior').on('click', function() {
    if (inicio_actual_usuarios >= saltos_tabla_usuarios) {
        inicio_actual_usuarios -= saltos_tabla_usuarios;
        fin_actual_usuarios -= saltos_tabla_usuarios;
        VerUsuarios(inicio_actual_usuarios, fin_actual_usuarios);
    }
});

/*
    evento click del boton siguiente para paginacion de la tabla
    llama  la funcion VerUsuarios con sus respectivos parametros si:
        el inicio_actual es menor que el tamano del arreglo es decir que existen elementos siguientes
        actualiza las variables inicio y fin actual si se mueve
        procede a llamar a la funcion VerLibros con los nuevos parametros
*/
$('#btn_usuarios_siguiente').on('click', function() {
    var usuarios;
    if (localStorage.usuarios != null) usuarios = JSON.parse(localStorage.usuarios);
    else return;
    if (fin_actual_usuarios < usuarios.length) {
        inicio_actual_usuarios += saltos_tabla_usuarios;
        fin_actual_usuarios += saltos_tabla_usuarios;
        VerUsuarios(inicio_actual_usuarios, fin_actual_usuarios);
    }
    if (inicio_actual_usuarios + saltos_tabla_usuarios > usuarios.length) {
        $('#lbl_rango_usuarios').html(`Del ${inicio_actual_usuarios+1} al ${usuarios.length} de ${usuarios.length}`);
    }
});
