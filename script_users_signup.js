var Usuarios = []; //array Usuarios que contendra todos los usuarios ingresados
var url_img = '';
var usuario = { //Protoripo usuario que sirve para crear nuevos administradores
    id: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    correo: '',
    password: '',
    genero: '',
    nacimiento: '',
    cui: '',
    municipio: '',
    zona: '',
    institucion: '',
    foto: '',
    escolaridad: '',
    estado: ''
};

CargarDepartamentos(); //carga los departamentos al html
VerMunicipios(); //inserta los municipios del primer departamento al select de municipios
ObtenerUsuarios(); //se cargan usuarios si hay

function ObtenerUsuarios() { //se cargan usuarios desde localStorage
    var retrievedObject = localStorage.getItem('usuarios');
    if (retrievedObject != null) {
        Usuarios = JSON.parse(retrievedObject);
    }
}

function GuardarUsuario() { //se guardan los usuarios en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(Usuarios));
}

function CargarDepartamentos() { //Funcion que no recibe arametros e inserta los departamentos al html
    var departamentos_html = '';
    $.each(Departamentos, function(index, departamento) {
        departamentos_html += `<option value='${departamento.id}'>${departamento.nombre}</option>`;
    });
    $('#slc_departamento').html(departamentos_html);
}

function VerMunicipios() { //Funcion que no recibe parametros e inserta los municipios corresponidentes al departamento seleccionado
    var municipios_html = '';
    $.each(Municipios, function(i, municipio) {
        if ($('#slc_departamento').val() == municipio.departamento_id) {
            municipios_html += `<option value='${municipio.id}'>${municipio.nombre}</option>`;
        }
    });
    $('#slc_municipio').html(municipios_html);
}

function CorreoDuplicado(_correo) {
    var encontrado = false;
    $.each(Usuarios, function(index, valor) {
        if (valor.correo == _correo) encontrado = true;
    })
    return encontrado;
}

function ValidarRegistroNuevo() { //se validan los campos del nuevo registro y se inserta si no hay error si hay error se notifica al usuario
    var mensaje = '';
    if ($('#txt_nombres').val() == '') mensaje += '\n-Nombre invalido';

    if ($('#txt_apellidos').val() == '') mensaje += '\n-Apellido invalido';

    if ($('#txt_direccion').val() == '') mensaje += '\n-Direccion invalida';

    if (!ValidarTelefono($('#txt_telefono').val())) mensaje += '\n-Telefono invalido';

    if (!ValidarCorreo($('#txt_correo').val())) mensaje += '\n-Correo invalido';

    if (CorreoDuplicado($('#txt_correo').val())) mensaje += '\n-El correo ' + $('#txt_correo').val() + ' ya esta registrada con otra cuenta';

    if (!ValidarPassword($('#txt_password').val())) mensaje += '\n-La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula. Puede tener otros simbolos';

    if ($('#txt_password').val() != $('#txt_confirmar_password').val()) mensaje += '\n-Las contraseñas no coinciden';

    if (!$('input:radio[name=radio_genero]:checked').val()) mensaje += '\n-Seleccione su genero';

    if (!ValidarFecha($('#txt_nacimiento').val())) mensaje += '\n-Formato de fecha incorrecta';

    if (!ValidarCui($('#txt_cui').val())) mensaje += '\n-Cui invalido';

    if (!$("#chk_terminos_condiciones").prop("checked")) mensaje += '\n-Debes aceptar los terminos y condiciones de uso';

    if ($('#slc_escolaridad').val() != '1' && $('#txt_institucion_educativa').val() == '') mensaje += '\n-Debes ingresar tu insitucion educativa';

    if (mensaje == '') {
        var usuario_nuevo = Object.create(usuario);
        usuario_nuevo.id = Usuarios.length + 1;
        usuario_nuevo.nombres = $('#txt_nombres').val();
        usuario_nuevo.apellidos = $('#txt_apellidos').val();
        usuario_nuevo.direccion = $('#txt_direccion').val();
        usuario_nuevo.telefono = $('#txt_telefono').val();
        usuario_nuevo.correo = $('#txt_correo').val();
        usuario_nuevo.password = $('#txt_password').val();
        usuario_nuevo.genero = $('input:radio[name=radio_genero]:checked').val();
        usuario_nuevo.nacimiento = $('#txt_nacimiento').val();
        usuario_nuevo.cui = $('#txt_cui').val();
        usuario_nuevo.municipio = $('#slc_municipio').val();
        usuario_nuevo.zona = $('#txt_zona').val();
        usuario_nuevo.institucion = $('#txt_institucion_educativa').val();
        usuario_nuevo.foto = url_img;
        usuario_nuevo.escolaridad = $('#slc_escolaridad').val();
        usuario_nuevo.estado = '1';
        Usuarios.push(usuario_nuevo);
        GuardarUsuario();
        alert('Cuenta creada con exito! Inicia sesion con tu nueva cuenta.');
        window.location.href = 'usuarios_login.html';
    } else {
        alert(mensaje);
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    // escape data:image prefix
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    // or just return dataURL
    // return dataURL
}

function getBase64ImageById(id) {
    return getBase64Image(document.getElementById(id));
}

$(function() {
    $('#btn_registrar').click(function() { //boton registrar que llama la funcion para validar registro
        ValidarRegistroNuevo();
    });
    $('#slc_departamento').on('change', function() { //funcion que se ejecuta en el evento change del select del departamento
        VerMunicipios(); //llama a la funcion ver municipios cada que el valor del select departamento cambia
    });
    $("#txt_correo").blur(function() {
        var correo = $('#txt_correo').val();
        if (CorreoDuplicado(correo)) alert('El correo ' + correo + ' ya esta registrada con otra cuenta');
    });
    $('#file_imagen').on('change', function(event) {
        var tmppath = URL.createObjectURL(event.target.files[0]);
        $('#img_foto').attr('src', tmppath);
        //url_img = btoa(this.files[0]);
        //url_img = "";
        url_img = getBase64ImageById('img_foto');
        console.log(url_img);
    });
});
