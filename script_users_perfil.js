var usuarios = JSON.parse(localStorage.usuarios);
var usr_index = localStorage.user_logeado;

function MostrarEstadoPrestamos() {
    var prestamos = JSON.parse(localStorage.prestamos);
    if (prestamos=='null')return;
    var prestamos_activos = 0;
    var prestamos_mora = 0;
    var usr_id = usuarios[usr_index].id;
    $.each(prestamos, function (index, prestamo) {
        if(prestamo.usuario_id == usr_id){
            if (prestamo.estado == 1)prestamos_activos++;
            if (prestamo.estado == 2)prestamos_mora++;
        }
    });
    $('#td_prestamos_mora').html(prestamos_mora);
    $('#td_prestados_actualmente').html(prestamos_activos);
}

function SetearDatosUsuario() {
    $('#txt_nombres').val(usuarios[usr_index].nombres);
    $('#txt_apellidos').val(usuarios[usr_index].apellidos);
    $('#txt_direccion').val(usuarios[usr_index].direccion);
    $('#txt_telefono').val(usuarios[usr_index].telefono);
    $('#txt_correo').val(usuarios[usr_index].correo);
    if (usuarios[usr_index].genero == 1) $("#radio_masculino").attr('checked', true);
    else $('#radio_femenino').attr('checked', true);
    $('#txt_nacimiento').val(usuarios[usr_index].nacimiento);
    $('#txt_cui').val(usuarios[usr_index].cui);
    $('#txt_zona').val(usuarios[usr_index].zona);
    $('#txt_institucion_educativa').val(usuarios[usr_index].institucion);
    $('#slc_escolaridad').val(usuarios[usr_index].escolaridad);
    //var url = (usuarios[usr_index].foto);
    //var url = decodeURIComponent(escape(window.atob( usuarios[usr_index].foto )));
    //var url = atob(usuarios[usr_index].foto);
    $('#img_foto').attr('src', usuarios[usr_index].foto);
}

function SetearDepartamentoMunicipio() {
    var depto = ObtenerDepartamentoId(usuarios[usr_index].municipio);
    var municipio = usuarios[usr_index].municipio;
    var municipios_html = '';
    $.each(Municipios, function (index, municipio) {
        if(depto == municipio.departamento_id)
            municipios_html += '<option value="' + municipio.id + '">' + municipio.nombre + '</option>';
    });
    $('#slc_departamento').val(depto);
    $('#slc_municipio').html(municipios_html);
    $('#slc_municipio').val(municipio);
}

function ObtenerDepartamentoId(_municipio_id) {
    var departamento_id;
    $.each(Municipios, function(index, municipio) {
        if (_municipio_id == municipio.id)departamento_id = municipio.departamento_id;
    });
    return departamento_id;
}

function VerDepartamentos() {
    var departamentos_html = '';
    $.each(Departamentos, function(index, depto) {
        departamentos_html += '<option value="' + depto.id + '">' + depto.nombre + '</option>';
    });
    $('#slc_departamento').html(departamentos_html);
}

function VerMunicipios() {
    var depto = $('#slc_departamento').val();
    var municipios_html = '';
    $.each(Municipios, function(index, municipio) {
        if (depto == municipio.departamento_id)
            municipios_html += '<option value="' + municipio.id + '">' + municipio.nombre + '</option>';
    });
    $('#slc_municipio').html(municipios_html);
}

function CorreoDuplicado(_correo) {
    if (_correo == usuarios[usr_index].correo)return false;
    var encontrado = false;
    $.each(usuarios, function(index, valor) {
        if (valor.correo == _correo) encontrado = true;
    });
    return encontrado;
}

function ValidarFormularioEditar() { //se validan los campos del nuevo registro y se inserta si no hay error si hay error se notifica al usuario
    var mensaje = '';
    if ($('#txt_nombres').val() == '') mensaje += '\n-Nombre invalido';

    if ($('#txt_apellidos').val() == '') mensaje += '\n-Apellido invalido';

    if ($('#txt_direccion').val() == '') mensaje += '\n-Direccion invalida';

    if (!ValidarTelefono($('#txt_telefono').val())) mensaje += '\n-Telefono invalido';

    if (!ValidarCorreo($('#txt_correo').val())) mensaje += '\n-Correo invalido';

    if (CorreoDuplicado($('#txt_correo').val())) mensaje += '\n-El correo ' + $('#txt_correo').val() + ' ya esta registrada con otra cuenta';

    //if (!ValidarPassword($('#txt_password').val())) mensaje += '\n-La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula. Puede tener otros simbolos';

    //if ($('#txt_password').val() != $('#txt_confirmar_password').val()) mensaje += '\n-Las contraseñas no coinciden';

    if (!$('input:radio[name=radio_genero]:checked').val()) mensaje += '\n-Seleccione su genero';

    if (!ValidarFecha($('#txt_nacimiento').val())) mensaje += '\n-Formato de fecha incorrecta';

    if (!ValidarCui($('#txt_cui').val())) mensaje += '\n-Cui invalido';

    if ($('#slc_escolaridad').val() != '1' && $('#txt_institucion_educativa').val() == '') mensaje += '\n-Debe ingresar su insitucion educativa';

    if (mensaje == '') {
        usuarios[usr_index].nombres = $('#txt_nombres').val();
        usuarios[usr_index].apellidos = $('#txt_apellidos').val();
        usuarios[usr_index].direccion = $('#txt_direccion').val();
        usuarios[usr_index].telefono = $('#txt_telefono').val();
        usuarios[usr_index].correo = $('#txt_correo').val();
        //usuarios[usr_index].password = $('#txt_password').val();
        usuarios[usr_index].genero = $('input:radio[name=radio_genero]:checked').val();
        usuarios[usr_index].nacimiento = $('#txt_nacimiento').val();
        usuarios[usr_index].cui = $('#txt_cui').val();
        usuarios[usr_index].municipio = $('#slc_municipio').val();
        usuarios[usr_index].zona = $('#txt_zona').val();
        usuarios[usr_index].institucion = $('#txt_institucion_educativa').val();
        //usuarios[usr_index].foto = url_img;
        usuarios[usr_index].escolaridad = $('#slc_escolaridad').val();
        usuarios[usr_index].estado = '1';
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Cuenta modificada con exito! Vuelve a autenticarte.');
        //localStorage.setItem('sesion_user', 0);
        //window.location.href = 'usuarios_login.html';
    } else {
        alert(mensaje);
    }
}

$('#slc_departamento').on('change', function() {
    VerMunicipios();
});

$('#btn_guardar').click(function () {
    ValidarFormularioEditar();
});

$(function() {
    VerDepartamentos();
    VerMunicipios();
    SetearDatosUsuario();
    MostrarEstadoPrestamos();
    SetearDepartamentoMunicipio();
});
