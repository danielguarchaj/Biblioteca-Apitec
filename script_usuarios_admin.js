var index;
var usuarios;
if (localStorage.ver_perfil_index != null) index = JSON.parse(localStorage.ver_perfil_index);
if (localStorage.usuarios != null) usuarios = JSON.parse(localStorage.usuarios);
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
            usuarios_html += `<td> <input type="button" class="button tabla_button" value="Ver" onclick="VerPerfilUsuario(${index})"> </td>`;
            usuarios_html += '</tr>';
        } else return;
    });
    $('#table_usuarios').html(usuarios_html);
    usuarios.length < saltos_tabla_usuarios ? $('#lbl_rango_usuarios').html(`Del ${inicio_actual_usuarios+1} al ${usuarios.length} de ${usuarios.length}`) : $('#lbl_rango_usuarios').html(`Del ${inicio_actual_usuarios+1} al ${fin_actual_usuarios} de ${usuarios.length}`);
    if (usuarios.length == 0) $('#lbl_rango_usuarios').html('Del 0 al 0 de 0');
}

VerUsuarios(inicio_actual_usuarios, fin_actual_usuarios);

function VerPerfilUsuario(_index) {
    localStorage.setItem('ver_perfil_index', _index);
    window.location.href = 'admin_ver_perfil.html';
}

function SetearDatosPerfil() {
    index = parseInt(index);
    $('#txt_nombres_admin').val(usuarios[index].nombres);
    $('#txt_nombres_admin').val(usuarios[index].nombres);
    $('#txt_apellidos_admin').val(usuarios[index].apellidos);
    $('#txt_direccion_admin').val(usuarios[index].direccion);
    $('#txt_telefono_admin').val(usuarios[index].telefono);
    $('#txt_correo_admin').val(usuarios[index].correo);
    if (usuarios[index].genero == 1) $("#radio_masculino").attr('checked', true);
    else $('#radio_femenino_admin').attr('checked', true);
    $('#txt_nacimiento_admin').val(usuarios[index].nacimiento);
    $('#txt_cui_admin').val(usuarios[index].cui);
    $('#txt_zona_admin').val(usuarios[index].zona);
    $('#txt_institucion_educativa_admin').val(usuarios[index].institucion);
    $('#slc_escolaridad_admin').val(usuarios[index].escolaridad);
    //var url = (usuarios[index].foto);
    //var url = decodeURIComponent(escape(window.atob( usuarios[index].foto )));
    //var url = atob(usuarios[index].foto);
    //$('#img_foto').attr('src', usuarios[index].foto);
}

function VerDepartamentos() {
    var departamentos_html = '';
    $.each(Departamentos, function(index, depto) {
        departamentos_html += '<option value="' + depto.id + '">' + depto.nombre + '</option>';
    });
    $('#slc_departamento_admin').html(departamentos_html);
}

function VerMunicipios() {
    var depto = $('#slc_departamento_admin').val();
    var municipios_html = '';
    $.each(Municipios, function(index, municipio) {
        if (depto == municipio.departamento_id)
            municipios_html += '<option value="' + municipio.id + '">' + municipio.nombre + '</option>';
    });
    $('#slc_municipio_admin').html(municipios_html);
}

function SetearDepartamentoMunicipio() {
    var depto = ObtenerDepartamentoId(usuarios[index].municipio);
    var municipio = usuarios[index].municipio;
    var municipios_html = '';
    $.each(Municipios, function (index, municipio) {
        if(depto == municipio.departamento_id)
            municipios_html += '<option value="' + municipio.id + '">' + municipio.nombre + '</option>';
    });
    $('#slc_departamento_admin').val(depto);
    $('#slc_municipio_admin').html(municipios_html);
    $('#slc_municipio_admin').val(municipio);
}

function ObtenerDepartamentoId(_municipio_id) {
    var departamento_id;
    $.each(Municipios, function(index, municipio) {
        if (_municipio_id == municipio.id)departamento_id = municipio.departamento_id;
    });
    return departamento_id;
}

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
