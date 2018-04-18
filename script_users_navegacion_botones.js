/*
    Eventos de botones de navegacion que redirigen a sus respectivas pantallas y modificar el valor de variables en localStorage
*/
$('.btn_regresar_libros').click(function() {
    window.location.href = 'usuarios_libros.html';
    localStorage.setItem('libro_prestar', null);
});

$('.btn_salir').click(function() {
    window.location.href = 'usuarios_login.html';
    localStorage.setItem('sesion_user', 0);
    localStorage.setItem('user_logeado', null);
    localStorage.setItem('libro_prestar', null);
});

$('.btn_autores').click(function() {
    window.location.href = 'usuarios_autores.html';
});

$('.btn_temas').click(function() {
    window.location.href = 'usuarios_temas.html';
});

$('.btn_libros').click(function() {
    window.location.href = 'usuarios_libros.html';
});

$('.btn_perfil').click(function() {
    window.location.href = 'usuarios_editar_perfil.html';
});

$('.tabla_button').click(function() {
    window.location.href = 'usuarios_prestar_libro.html';
});

$('#btn_aceptar_prestamo_libro').click(function() {
    VerificarPrestamo();
});

$('.btn_prestamos').click(function () {
    window.location.href = 'usuarios_libros_prestados.html';
});
