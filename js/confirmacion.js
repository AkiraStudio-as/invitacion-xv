// JavaScript Document
var boletosAsignados = 0;
var boletosSeleccionados = 0;

var nombreInput = document.getElementById("nombre");
var asistenciaSelect = document.getElementById("asistencia");
var seccionBoletos = document.getElementById("seccionBoletos");
var boletosContenedor = document.getElementById("boletos");
var contadorBoletos = document.getElementById("contadorBoletos");
var mensajeBoletos = document.getElementById("mensajeBoletos");
var mensajeResultado = document.getElementById("mensajeResultado");
var botonEnviar = document.getElementById("enviarConfirmacion");


function limpiarBoletos() {

    boletosAsignados = 0;
    boletosSeleccionados = 0;

    boletosContenedor.innerHTML = "";

    contadorBoletos.textContent =
        "0 boletos seleccionados";

    seccionBoletos.style.display = "none";

}


function buscarInvitado() {

    var nombre = nombreInput.value.trim();

    limpiarBoletos();

    if (nombre === "") {
        return;
    }

    fetch(
        "https://script.google.com/macros/s/AKfycbzdgnlKm6_u3dV6fdl1tb6Qz6ee5R97XDfkRIcsxA6gcC1mV94RVICObGeVZpAzyKkV/exec?nombre="
        + encodeURIComponent(nombre)
    )

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {

        if (data.encontrado) {

            boletosAsignados = Number(data.boletosAsignados);

            crearBoletos();

        } else {

            mensajeBoletos.textContent =
                "No encontramos ese nombre.";

            seccionBoletos.style.display = "block";

        }

    })

    .catch(function(error) {

        console.error(error);

        mensajeBoletos.textContent =
            "No se pudo consultar la información.";

        seccionBoletos.style.display = "block";

    });

}


function crearBoletos() {

    boletosContenedor.innerHTML = "";

    boletosSeleccionados = 0;

    mensajeBoletos.textContent =
        "Selecciona los boletos que utilizarás.";

    for (var i = 0; i < boletosAsignados; i++) {

        var boleto = document.createElement("button");

        boleto.type = "button";

        boleto.className = "boleto";


        boleto.addEventListener("click", function() {

            if (this.classList.contains("seleccionado")) {

                this.classList.remove("seleccionado");

                boletosSeleccionados--;

            } else {

                this.classList.add("seleccionado");

                boletosSeleccionados++;

            }

            contadorBoletos.textContent =
                boletosSeleccionados +
                " boletos seleccionados";

        });


        boletosContenedor.appendChild(boleto);

    }

    seccionBoletos.style.display = "block";

    contadorBoletos.textContent =
        "0 boletos seleccionados";

}


asistenciaSelect.addEventListener("change", function() {

    mensajeResultado.textContent = "";

    if (this.value === "Sí") {

        buscarInvitado();

    } else {

        limpiarBoletos();

    }

});


nombreInput.addEventListener("input", function() {

    if (asistenciaSelect.value === "Sí") {

        buscarInvitado();

    }

});


botonEnviar.addEventListener("click", function() {

    var nombre = nombreInput.value.trim();

    var asistencia = asistenciaSelect.value;


    if (nombre === "") {

        alert("Ingresa tu nombre.");

        return;

    }


    if (asistencia === "") {

        alert("Selecciona si asistirás.");

        return;

    }


    if (asistencia === "Sí" && boletosSeleccionados === 0) {

        alert("Selecciona al menos un boleto.");

        return;

    }


    var datos = {

        nombre: nombre,

        boletosAsignados:
            asistencia === "Sí" ? boletosAsignados : 0,

        boletosUtilizados:
            asistencia === "Sí" ? boletosSeleccionados : 0,

        asistencia: asistencia

    };


    botonEnviar.disabled = true;

    botonEnviar.textContent = "ENVIANDO...";


    fetch(
        "https://script.google.com/macros/s/AKfycbzdgnlKm6_u3dV6fdl1tb6Qz6ee5R97XDfkRIcsxA6gcC1mV94RVICObGeVZpAzyKkV/exec",
        {
            method: "POST",
            body: JSON.stringify(datos)
        }
    )

    .then(function(response) {

        return response.json();

    })

    .then(function(data) {

        console.log(data);


        if (data.estado === "ok") {

            mensajeResultado.textContent =
                "¡Tu confirmación fue enviada correctamente!";

            botonEnviar.textContent = "CONFIRMACIÓN ENVIADA";

        } else {

            mensajeResultado.textContent =
                "No se pudo guardar tu confirmación.";

            botonEnviar.disabled = false;

            botonEnviar.textContent =
                "CONFIRMAR ASISTENCIA";

        }

    })

    .catch(function(error) {

        console.error(error);

        mensajeResultado.textContent =
            "Ocurrió un error al enviar tu confirmación.";

        botonEnviar.disabled = false;

        botonEnviar.textContent =
            "CONFIRMAR ASISTENCIA";

    });

});