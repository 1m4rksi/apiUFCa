let peleadoresData = [];
let peleadorSeleccionado = null;

// Cargar el JSON al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    fetch("peleadores.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            peleadoresData = datos;
        })
        .catch(error => console.error("Error cargando el archivo JSON:", error));
});

// Renderizar la lista de peleadores en la pantalla de inicio
function renderizarPeleadores() {
    let contenido = "";
    peleadoresData.forEach(peleador => {
        contenido += `
            <div class="peleador-card">
                <h3>${peleador.nombre}</h3>
                <button onclick="verPeleador(${peleador.id})">Ver perfil</button>
            </div>
        `;
    });
    document.getElementById("peleadores").innerHTML = contenido;
}

// Cambiar de pantalla e inyectar los datos en el perfil estilo UFC
function verPeleador(id) {
    let peleador = peleadoresData.find(p => p.id == id);
    if (!peleador) return;

    peleadorSeleccionado = peleador;
    
    // Limpiar el contenedor del historial desplegable anterior
    document.getElementById("historial").innerHTML = "";

    // Inyectar datos en los IDs correspondientes sin romper la estructura HTML
    document.getElementById("nombre").innerText = peleador.nombre;
    document.getElementById("foto").src = peleador.foto;
    document.getElementById("apodo").innerText = peleador.apodo ? `"${peleador.apodo}"` : "";
    document.getElementById("division").innerText = peleador.division;
    document.getElementById("record").innerText = peleador.record + " [W-L-D]";

    // Ocultar inicio y mostrar perfil
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-perfil").style.display = "block";
}

// Desplegar el historial dinámico debajo del botón "VIEW FIGHT HISTORY"
function mostrarHistorial() {

    let listaPeleas = peleadorSeleccionado.historial;

    let html = "";

    listaPeleas.forEach(pelea => {

        html += `
        <div class="fight-card">

            <div class="fight-left">

                <div class="victoria-badge">
                    VICTORIA
                </div>

                <img src="${pelea.img1}" class="fighter-img">
                <img src="${pelea.img2}" class="fighter-img">

            </div>

            <div class="fight-right">

                <h2>${pelea.rival}</h2>

                <div class="fight-date">
                    ${pelea.fecha}
                </div>

                <div class="fight-stats">

                    <div>
                        <span>ASALTO</span>
                        <strong>${pelea.asalto}</strong>
                    </div>

                    <div>
                        <span>HORA</span>
                        <strong>${pelea.hora}</strong>
                    </div>

                    <div>
                        <span>MÉTODO</span>
                        <strong>${pelea.metodo}</strong>
                    </div>

                </div>

            </div>

        </div>
        `;
    });

    document.getElementById("historial").innerHTML = html;
}

// Volver al listado principal
function volver() {
    document.getElementById("vista-perfil").style.display = "none";
    document.getElementById("vista-lista").style.display = "block";
    peleadorSeleccionado = null;
}