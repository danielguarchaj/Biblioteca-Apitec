var Administradores = []; //array Administradores que contendra todos los administradores ingresados por el usuario en localStorage

var administrador = { //Protoripo administrador que sirve para crear nuevos administradores
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
    municipio: ''
};

CargarDepartamentos(); //varga los departamentos al html
VerMunicipios(); //inserta los municipios del primer departamento al select de municipios
ObtenerAdministradores(); //se cargan administradores si hay

function ObtenerAdministradores() { //se cargan administradores desde localStorage
    var retrievedObject = localStorage.getItem('administradores');
    if (retrievedObject != null) {
        Administradores = JSON.parse(retrievedObject);
    }
}

function GuardarAdministrador() { //se guardan los administradores en el localStorage
    localStorage.setItem('administradores', JSON.stringify(Administradores));
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
    $.each(Administradores, function(index, valor) {
        if (valor.correo == _correo) encontrado = true;
    })
    return encontrado;
}

function ValidarRegistroNuevo() { //se validan los campos del nuevo registro y se inserta si no hay error si hay error se notifica al usuario
    var error = false;
    var mensaje = '';

    if ($('#txt_nombres').val() == '') {
        mensaje += '\n-Nombre invalido';
        error = true;
    }

    if ($('#txt_apellidos').val() == '') {
        mensaje += '\n-Apellido invalido';
        error = true;
    }

    if ($('#txt_direccion').val() == '') {
        mensaje += '\n-Direccion invalida';
        error = true;
    }

    if (!ValidarTelefono($('#txt_telefono').val())) {
        mensaje += '\n-Telefono invalido';
        error = true;
    }

    if (!ValidarCorreo($('#txt_correo').val())) {
        mensaje += '\n-Correo invalido';
        error = true;
    }

    if (CorreoDuplicado($('#txt_correo').val())) {
        mensaje += '\n-El correo ' + $('#txt_correo').val() + ' ya esta registrada con otra cuenta';
        error = true;
    }

    if (!ValidarPassword($('#txt_password').val())) {
        mensaje += '\n-La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula. Puede tener otros simbolos';
        error = true;
    }

    if ($('#txt_password').val() != $('#txt_confirmar_password').val()) {
        mensaje += '\n-Las contraseñas no coinciden';
        error = true;
    }

    if (!$('input:radio[name=radio_genero]:checked').val()) {
        mensaje += '\n-Seleccione su genero';
        error = true;
    }

    if (!ValidarFecha($('#txt_nacimiento').val())) {
        mensaje += '\n-Formato de fecha incorrecta';
        error = true;
    }

    if (!ValidarCui($('#txt_cui').val())) {
        mensaje += '\n-Cui invalido';
        error = true;
    }

    if (!$('input:radio[name=radio_autorizacion_menores]:checked').val() && !MayorEdad($('#txt_nacimiento').val())) {
        mensaje += '\n-Debes indicar que tienes autorizacion';
        error = true;
    }

    if (!$("#chk_terminos_condiciones").prop("checked")) {
        mensaje += '\n-Debes aceptar los terminos y condiciones de uso';
        error = true;
    }

    if (!error) {
        var nuevo_administrador = Object.create(administrador);
        nuevo_administrador.id = Administradores.length + 1;
        nuevo_administrador.nombres = $('#txt_nombres').val();
        nuevo_administrador.apellidos = $('#txt_apellidos').val();
        nuevo_administrador.direccion = $('#txt_direccion').val();
        nuevo_administrador.telefono = $('#txt_telefono').val();
        nuevo_administrador.correo = $('#txt_correo').val();
        nuevo_administrador.password = $('#txt_password').val();
        nuevo_administrador.genero = $('input:radio[name=radio_genero]:checked').val();
        nuevo_administrador.nacimiento = $('#txt_nacimiento').val();
        nuevo_administrador.cui = $('#txt_cui').val();
        nuevo_administrador.municipio = $('#slc_municipio').val();
        Administradores.push(nuevo_administrador);
        GuardarAdministrador();
        alert('Cuenta creada con exito! Inicia sesion con tu nueva cuenta.');
        window.location.href = 'login.html';
    } else {
        alert(mensaje);
    }
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
});
