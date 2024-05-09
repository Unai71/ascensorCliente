import Ascensor from './ascensor.js';
import ControlAscensor from './controlAscensor.js';
import Edificio from './edificio.js';
import Paquete from './paquete.js';

document.addEventListener('DOMContentLoaded', () => {
    const ascensor_dom = document.querySelector('#ascensor');
    const ascensor = new Ascensor();
    const controlAscensor = new ControlAscensor(ascensor);
    const edificio = new Edificio(ascensor);
    var numPaquetesPB = 0;
    var numPaquetesAscensor = 0;
    let procesando = false;

    actualizarEstadoAscensor();

    // Eventos Botones
    document.getElementById('añadir-paquete-form').addEventListener('submit', manejarAgregarPaquete);

    document.querySelectorAll('.boton-piso').forEach(boton => {
        boton.addEventListener('click', async function () {
            const pisoDestino = parseInt(this.dataset.piso);
            moverAscensor(pisoDestino);
            if (ascensor.destinos.length >0){
                procesarMovimiento();
            }
        });
    });
    document.querySelectorAll('.boton-llamada').forEach(boton => {
        boton.addEventListener('click', async function () {
            const pisoDestino = parseInt(this.dataset.piso); //
            moverAscensor(pisoDestino);
            if (ascensor.destinos.length >0){
                procesarMovimiento();
            }
        });
    });

    document.getElementById('mostrarModalPaquetes').addEventListener('click', function() {
        if (ascensor.pisoActual === 0 && ascensor.estadoPuertas === "abiertas"){ 
        let interfaz = document.getElementById('modalPaquetes');
        let listaAdministrarPaquetes = document.getElementById('listaModalPaquetes');
        listaAdministrarPaquetes.innerHTML = '';
        const paquetes = document.querySelectorAll('#paquetes-pendientes li, #lista-paquetes li');

        paquetes.forEach(paquete => {
            const li = document.createElement('li');
            li.textContent = `ID: ${paquete.id}, Peso: ${paquete.dataset.peso}`;
            listaModalPaquetes.appendChild(li);
    
            // Botón para eliminar paquete
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = function() {
                paquete.remove();
                li.remove(); 
            };
            li.appendChild(btnEliminar);
        });
        interfaz.style.display = 'block';
        }else{
            alert("Baja al piso 0 para administrar los paquetes.");
        }
    });
    
    document.querySelector('.close').onclick = function() {
        document.getElementById('modalPaquetes').style.display = 'none';
    };
    document.getElementById('cerrarModal').onclick = function() {
        document.getElementById('modalPaquetes').style.display = 'none';
    };
    
    window.onclick = function(event) {
        var modal = document.getElementById('modalPaquetes');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    function manejarAgregarPaquete(event) {
        event.preventDefault();


        const peso = parseFloat(document.getElementById('peso').value);
        const dimensionesInput = document.getElementById('dimensiones').value;
        const [ancho, alto] = dimensionesInput.split('x').map(Number);
        const destino = parseInt(document.getElementById('destino').value);
        if (ancho >= 10 || alto >= 10 ){
            const paquete = new Paquete(peso, { ancho, alto }, destino);

            const listaPaquetes = document.getElementById('paquetes-pendientes');
            const elementoPaquete = document.createElement('li');
            elementoPaquete.id = `paquete-destino-${destino}-${Date.now()}`;
            elementoPaquete.setAttribute('data-peso', peso);
            elementoPaquete.setAttribute('data-ancho', ancho);
            elementoPaquete.setAttribute('data-alto', alto);
            elementoPaquete.textContent = `Peso: ${peso} kg, Dimensiones: ${ancho}x${alto} cm, Destino: Piso ${destino}`;
            listaPaquetes.appendChild(elementoPaquete);
    
            event.target.reset();
            mostrarPaquetesPB();
            actualizarEstadoAscensor();
        }else{
            alert("Las dimensiones mínimas del paquete son de 10x10 cm.")
        }

    }


    function descargarPaquete(pisoActual) {
        const paquetesParaDescargar = document.querySelectorAll(`#lista-paquetes > li[id*="paquete-destino-${pisoActual}-"]`);

        paquetesParaDescargar.forEach(paquete => {
            const pesoPaquete = parseFloat(paquete.getAttribute('data-peso'));
            ascensor.cargaActual -= pesoPaquete;
            const anchoPaquete = parseFloat(paquete.getAttribute('data-ancho'));
            ascensor.anchoActual -= anchoPaquete;
            const altoPaquete = parseFloat(paquete.getAttribute('data-alto'));
            ascensor.altoActual -= altoPaquete;
            paquete.remove();
        });

        console.log(`Paquetes descargados en el piso ${pisoActual}. Peso actual del ascensor actualizado.`);
    }

    function cargarPaquetes() {
        const listaPaquetes = document.getElementById('lista-paquetes');
        const paquetesParaCargar = document.querySelectorAll('#paquetes-pendientes > li[id^="paquete-destino"]');
        paquetesParaCargar.forEach(paquete => {
            const pesoPaquete = parseFloat(paquete.getAttribute('data-peso'));
            const alturaPaquete = parseFloat(paquete.getAttribute('data-alto'));
            const anchoPaquete = parseFloat(paquete.getAttribute('data-ancho'));
            if (ascensor.cargaActual + pesoPaquete <= ascensor.cargaMaxima && ascensor.anchoActual + anchoPaquete <= ascensor.anchoMaximo && ascensor.altoActual + alturaPaquete <= ascensor.altoMaximo) {
                ascensor.cargaActual += pesoPaquete;
                ascensor.altoActual += alturaPaquete;
                ascensor.anchoActual += anchoPaquete;
                const elementoPaquete = paquete.cloneNode(true);
                listaPaquetes.appendChild(elementoPaquete);
                paquete.remove();
                borrarPaquetePB();
            }
        });
    }


    function actualizarEstadoAscensor() {

        if (ascensor.pisoActual === 0) {
            console.log("Cargando paquetes en planta baja");
            cargarPaquetes();
        }
        // Actualizar el piso actual del ascensor
        document.getElementById('piso-actual').textContent = `Piso Actual: ${ascensor.pisoActual}`;
        //Actualizamos los indicadores
        actualizarIndicadores(ascensor.pisoActual);
        // Actualizar la carga actual dentro del ascensor
        document.getElementById('carga-actual').textContent = `Carga Actual: ${ascensor.cargaActual} kg`;

        // Actualizar el estado de las puertas del ascensor
        const estadoPuertasTexto = ascensor.estadoPuertas === "abiertas" ? "Abiertas" : "Cerradas";
        document.getElementById('estado-puertas').textContent = `Estado de las Puertas: ${estadoPuertasTexto}`;

        // Actualizar luces de estado basado en el estado del ascensor
        // Por simplicidad, asumimos que las luces se manejan con clases CSS: .luz-activa, .luz-inactiva
        document.querySelectorAll('.luz').forEach(luz => {
            luz.classList.add('luz-inactiva');
            luz.classList.remove('luz-activa');
        });





        // Ejemplo de cómo podrías usar las luces para indicar el estado
        if (ascensor.pisoActual === ascensor.destinoActual) {
            document.getElementById('luz-verde').classList.add('luz-activa');
            document.getElementById('luz-verde').classList.remove('luz-inactiva');
        } else {
            document.getElementById('luz-gris').classList.add('luz-activa');
            document.getElementById('luz-gris').classList.remove('luz-inactiva');
        }

        // Aquí podrías expandir la lógica para manejar otros indicadores, como sobrecarga o llegada.
    }

    async function moverAscensor(pisoDestino) {
        if (pisoDestino >= 0 && pisoDestino < ascensor.pisosTotales && pisoDestino !== ascensor.pisoActual) {
            console.log(`Añadiendo piso ${pisoDestino} a la cola de destinos.`);

            if (!ascensor.destinos.includes(pisoDestino)) {
                ascensor.destinos.push(pisoDestino);
            }

            // Intentar mover el ascensor si las puertas están cerradas y no está ya en movimiento hacia otro piso








            
        } else {
            console.log("Piso destino inválido o ya en el piso destino.");
        }
    }

    async function procesarMovimiento() {
        if (procesando) return;  // Asegurar que no se procese simultáneamente
        procesando = true;
        while (ascensor.destinos.length > 0) {
                ascensor.espera = 0;
                const siguientePiso = ascensor.destinos.shift(); // Obtiene y elimina el primer destino de la cola
        
                console.log("Cerrando puertas...");
                cerrarPuertas();
                ascensor.estadoPuertas = "cerradas";
                actualizarEstadoAscensor(); 
                console.log(`Moviendo el ascensor al piso ${siguientePiso}...`);
        
                // Esperar de manera asíncrona el tiempo necesario para moverse entre pisos
                await new Promise(resolve => setTimeout(resolve, 3000 * Math.abs(ascensor.pisoActual - siguientePiso)));
        
                ascensor.pisoActual = siguientePiso;
                console.log('Abriendo puertas...');
                abrirPuertas();
                ascensor.estadoPuertas = "abiertas";
                actualizarEstadoAscensor(); // Actualiza la interfaz de usuario con el nuevo estado del ascensor
                console.log(`Ascensor ha llegado al piso ${ascensor.pisoActual}.`);
        
                await delay(4000); // Espera con las puertas abiertas
        
                descargarPaquete(ascensor.pisoActual); // Descargar paquetes, si hay alguno para este piso
                actualizarEstadoAscensor(); // Actualiza la interfaz de usuario nuevamente
                ascensor.espera = 1;
        }
        procesando = false;
    }
    
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    
    

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function esperarCondicion(condicionFn, intervalo = 100) {
        return new Promise((resolve, reject) => {
            function intentar() {
                if (condicionFn()) {
                    // Si la condición se cumple, resuelve la promesa
                    resolve();
                } else {
                    // Si no, intenta de nuevo después de un breve retraso
                    setTimeout(intentar, intervalo);
                }
            }
            intentar();
        });
    }
    function mostrarPaquetesPB() {
        const packetContainer = document.getElementById("packet-container");

        packetContainer.innerHTML = "";
        const paquetesParaCargar = document.querySelectorAll('#paquetes-pendientes > li[id^="paquete-destino"]');
        paquetesParaCargar.forEach(paquete => {
            const alturaPaquete = parseFloat(paquete.getAttribute('data-alto'));
            const anchoPaquete = parseFloat(paquete.getAttribute('data-ancho'));

            const packet = document.createElement("div");
            packet.className = "packet";
            numPaquetesPB += 1;
            packet.id = `packet-${numPaquetesPB}`;
            packet.innerHTML = '<div class="decoracion-packet"></div>';
            //packet.style.width = width;
            //card.style.height = height;
            packetContainer.appendChild(packet);

        });
    }
    
    function borrarPaquetePB() {
        const packetContainer = document.querySelectorAll("#packet-container > li[id^=packet-]");
        console.log(`numero de paquetes en planta baja: ${numPaquetesPB}`);
        packetContainer.forEach(packet => {
            console.log(packet.id);
            if (packet.id = `packet-${numPaquetesPB}`) {
                packet.remove();
                numPaquetesPB -= 1;
            }
        });
    }

    function abrirPuertas() {
        ascensor_dom.classList.remove('cerrado');
        ascensor_dom.classList.add('abierto')
    }
    function cerrarPuertas() {
        ascensor_dom.classList.remove('abierto');
        ascensor_dom.classList.add('cerrado')
    }
    function actualizarIndicadores(floor) {
        // Reset all indicators
        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.classList.remove('activo');
        });
        // Light up indicators for current floor
        document.getElementById(`indicator-floor-${floor}`).classList.add('activo');

    }
    // Implementaciones adicionales según sea necesario...
});
