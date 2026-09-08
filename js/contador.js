// JavaScript Document

const fechaFiesta = new Date("2027-02-06T00:00:00").getTime();

const contador = setInterval(function() {

	const ahora = new Date().getTime();
	const diferencia = fechaFiesta - ahora;

	const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
	const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
	const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

	document.getElementById("dias").textContent = dias;
	document.getElementById("horas").textContent = horas;
	document.getElementById("minutos").textContent = minutos;
	document.getElementById("segundos").textContent = segundos;

	if (diferencia < 0) {

		clearInterval(contador);

		document.querySelector(".contador-contenedor").style.display = "none";
		document.getElementById("mensaje-final").style.display = "block";

	}

}, 1000);