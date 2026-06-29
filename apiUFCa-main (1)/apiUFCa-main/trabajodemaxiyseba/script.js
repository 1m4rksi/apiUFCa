let peleadoresData = [];
let peleadorSeleccionado = null;

// Cargar el JSON al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    let fuse; // Variable global para el buscador inteligente

document.addEventListener("DOMContentLoaded", () => {
    fetch("peleadores.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            peleadoresData = datos;
            // Encendemos la lógica de la barra al cargar los datos
            inicializarBuscador(); 
        })
        .catch(error => console.error("Error cargando el archivo JSON:", error));
});

function inicializarBuscador() {
    const input = document.getElementById("input-buscador");
    const resultadosDiv = document.getElementById("resultados-buscador");

    input.addEventListener("input", (e) => {
        const query = e.target.value.trim();

        if (query.length < 2) {
            resultadosDiv.style.display = "none";
            return;
        }

        // Realizar la búsqueda tolerando errores
        const resultados = fuse.search(query);

        if (resultados.length === 0) {
            resultadosDiv.innerHTML = `<div class="search-item-result" style="color: #666;">NO SE ENCONTRARON PELEADORES</div>`;
            resultadosDiv.style.display = "block";
            return;
        }

        // Dibujar los nombres en la lista desplegable
        let html = "";
        resultados.forEach(item => {
            const peleador = item.item;
            html += `<div class="search-item-result" onclick="seleccionarDesdeBuscador(${peleador.id})">${peleador.nombre}</div>`;
        });

        resultadosDiv.innerHTML = html;
        resultadosDiv.style.display = "block";
    });

    // Ocultar lista si hacen click afuera
    document.addEventListener("click", (e) => {
        if (e.target !== input) {
            resultadosDiv.style.display = "none";
        }
    });
}

// Al clickear en un resultado, limpia el input y abre el perfil
function seleccionarDesdeBuscador(id) {
    document.getElementById("input-buscador").value = "";
    document.getElementById("resultados-buscador").style.display = "none";
    verPeleador(id); // Llama a tu función original que ya renderiza todo el perfil
}
    fetch("peleadores.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            peleadoresData = datos;
        })
        .catch(error => console.error("Error cargando el archivo JSON:", error));
});

// Renderizar la lista de peleadores en la pantalla de inicio con su foto de cara
function renderizarPeleadores() {
    let contenido = "";
    peleadoresData.forEach(peleador => {
        contenido += `
            <div class="peleador-card">
                <div class="peleador-info">
                    <img src="${peleador.foto}" class="peleador-cara-lista" alt="${peleador.nombre}">
                    <h3>${peleador.nombre}</h3>
                </div>
                <button onclick="verPeleador(${peleador.id})">Ver perfil</button>
            </div>
        `;
    });
    document.getElementById("peleadores").innerHTML = contenido;
}

// Cambiar de pantalla e inyectar los datos en el perfil estilo UFC
function verPeleador(id) {
    // 1. Buscar al peleador seleccionado en los datos del JSON
    let peleador = peleadoresData.find(p => p.id == id);
    if (!peleador) return;

    peleadorSeleccionado = peleador;
    
    // Limpiar el contenedor del historial inferior por si estaba abierto
    const contenedorHistorial = document.getElementById("historial");
    contenedorHistorial.innerHTML = "";
    contenedorHistorial.style.display = "none";

    // 2. Inyectar datos principales del perfil (Izquierda/Centro)
    document.getElementById("nombre").innerText = peleador.nombre;
    document.getElementById("foto").src = peleador.foto;
    document.getElementById("apodo").innerText = peleador.apodo ? `"${peleador.apodo}"` : "";
    document.getElementById("division").innerText = peleador.division;
    document.getElementById("record").innerText = peleador.record + " [W-L-D]";

    // 3. 🥊 INYECTAR COMBATES DESDE EL JSON (Columna Derecha)
    
    // Cargar Última Pelea dinámicamente
    if (peleador.ultima_pelea) {
        document.getElementById("last-fight-rival").innerText = peleador.ultima_pelea.rival;
        document.getElementById("last-fight-status").innerText = peleador.ultima_pelea.resultado.toUpperCase();
        document.getElementById("last-fight-date").innerText = peleador.ultima_pelea.fecha.toUpperCase();
    }

    // Cargar Próxima Pelea dinámicamente
    if (peleador.proxima_pelea) {
        document.getElementById("next-fight-rival").innerText = peleador.proxima_pelea.rival;
        document.getElementById("next-fight-status").innerText = peleador.proxima_pelea.resultado.toUpperCase();
        document.getElementById("next-fight-date").innerText = peleador.proxima_pelea.fecha.toUpperCase();
    }

    // 4. Mostrar la pantalla del perfil y ocultar la lista de inicio
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-perfil").style.display = "block";
}

function mostrarHistorial() {
    const contenedorHistorial = document.getElementById("historial");

    // 1. SI YA TIENE CONTENIDO Y ESTÁ VISIBLE, LO OCULTAMOS Y SALIMOS
    if (contenedorHistorial.innerHTML !== "" && contenedorHistorial.style.display === "block") {
        contenedorHistorial.style.display = "none";
        return; // Detiene la función aquí para que no vuelva a pintar las peleas
    }

    // 2. SI ESTABA OCULTO (PERO YA TENÍA TARJETAS), LO VOLVEMOS A MOSTRAR
    if (contenedorHistorial.innerHTML !== "" && contenedorHistorial.style.display === "none") {
        contenedorHistorial.style.display = "block";
        return;
    }

    // 3. SI ES LA PRIMERA VEZ QUE SE TOCA, SE GENERAN LAS TARJETAS DESDE TU JSON
    contenedorHistorial.style.display = "block";
    let peleas = peleadorSeleccionado.historial || [];
    let html = "";

    peleas.forEach(pelea => {
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

    contenedorHistorial.innerHTML = html;
}

// Volver al listado principal
function volver() {
    document.getElementById("vista-perfil").style.display = "none";

    // Restaurar el display original
    document.getElementById("vista-lista").style.display = "flex";

    peleadorSeleccionado = null;
}
const peleadores = {
    "ilia-topuria": {
        nombre: "ILIA TOPURIA",
        // ... dejas lo que ya tenías ...
        
        // 🥊 AGREGA ESTO EXCLUSIVO DE ILIA:
        lastRival: "TOPURIA VS OLIVEIRA",
        lastStatus: "VICTORIA",
        lastDate: "JUN. 28, 2025",
        
        nextRival: "TOPURIA VS GAETHJE",
        nextStatus: "PRÓXIMA",
        nextDate: "JUN. 14, 2026"
    },
    "max-holloway": {
        nombre: "MAX HOLLOWAY",
        // ... dejas lo que ya tenías ...
        
        // 🥊 AGREGA ESTO EXCLUSIVO DE MAX:
        lastRival: "HOLLOWAY VS GAETHJE",
        lastStatus: "VICTORIA",
        lastDate: "APR. 13, 2024",
        
        nextRival: "HOLLOWAY VS TOPURIA",
        nextStatus: "PRÓXIMA",
        nextDate: "OCT. 26, 2026"
    }
};
function seleccionarPeleador(id) {
    const peleador = peleadores[id];

    // ... Aquí dejas tus líneas viejas (ej: document.getElementById('nombre').innerText = peleador.nombre ...)

    // 🎯 AGREGA ESTO PARA QUE SE ACTUALICE TU RECUADRO DERECHO:
    document.getElementById("last-fight-rival").innerText = peleador.lastRival;
    document.getElementById("last-fight-status").innerText = peleador.lastStatus;
    document.getElementById("last-fight-date").innerText = peleador.lastDate;

    document.getElementById("next-fight-rival").innerText = peleador.nextRival;
    document.getElementById("next-fight-status").innerText = peleador.nextStatus;
    document.getElementById("next-fight-date").innerText = peleador.nextDate;
}
function inicializarBuscador() {
    const input = document.getElementById("input-buscador");
    const resultadosDiv = document.getElementById("resultados-buscador");

    input.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            resultadosDiv.style.display = "none";
            return;
        }

        const filtrados = peleadoresData.filter(p => 
            p.nombre.toLowerCase().includes(query) || 
            (p.apodo && p.apodo.toLowerCase().includes(query))
        );

        if (filtrados.length === 0) {
            resultadosDiv.innerHTML = `<div class="search-item-result" style="color: #555;">SIN RESULTADOS</div>`;
            resultadosDiv.style.display = "block";
            return;
        }

        let html = "";
        filtrados.forEach(peleador => {
            html += `<div class="search-item-result" onclick="seleccionarDesdeBuscador(${peleador.id})">${peleador.nombre}</div>`;
        });

        resultadosDiv.innerHTML = html;
        resultadosDiv.style.display = "block";
    });

    document.addEventListener("click", (e) => {
        if (e.target !== input) resultadosDiv.style.display = "none";
    });
}

function seleccionarDesdeBuscador(id) {
    document.getElementById("input-buscador").value = "";
    document.getElementById("resultados-buscador").style.display = "none";
    verPeleador(id); // Abre el perfil automáticamente
}