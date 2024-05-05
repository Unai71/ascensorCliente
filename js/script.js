import Ascensor from './ascensor.js';
import ControlAscensor from './controlAscensor.js';
import Edificio from './edificio.js';
import Paquete from './paquete.js';

document.addEventListener('DOMContentLoaded', () => {
    const ascensor = new Ascensor();
    const controlAscensor = new ControlAscensor(ascensor);
    const edificio = new Edificio(ascensor);

    // Actualiza la UI para reflejar el estado inicial del ascensor
    actualizarEstadoAscensor();

    // Agregar evento al formulario para añadir paquetes

    document.getElementById('añadir-paquete-form').addEventListener('submit', manejarAgregarPaquete);

    // Agregar eventos a los botones de piso
    document.querySelectorAll('.boton-piso').forEach(boton => {
        boton.addEventListener('click', async function () {
            const pisoDestino = parseInt(this.dataset.piso); // Usamos dataset para acceder al atributo data-piso
            //console.log(`Moviendo al piso ${pisoDestino}`);
            controlAscensor.añadirDestino(pisoDestino); // Asegúrate de que este método esté correctamente definido en ControlAscensor
            // Nota: Puede que necesites invocar aquí un método para procesar el movimiento o ajustar la cola de destinos según tu lógica específica.
            await esperarCondicion(() => ascensor.estadoPuertas === "abiertas");
            console.log("Cerrando puertas...");
            ascensor.estadoPuertas = "cerradas";
            actualizarEstadoAscensor();
            moverAscensor(pisoDestino);
            const pisoActual = pisoDestino;
            descargarPaquete(pisoActual);
        });
    });
    document.querySelectorAll('.boton-llamada').forEach(boton => {
        boton.addEventListener('click', async function () {
            const pisoDestino = parseInt(this.dataset.piso); // Usamos dataset para acceder al atributo data-piso
            //console.log(`Moviendo al piso ${pisoDestino}`);
            controlAscensor.añadirDestino(pisoDestino); // Asegúrate de que este método esté correctamente definido en ControlAscensor
            // Nota: Puede que necesites invocar aquí un método para procesar el movimiento o ajustar la cola de destinos según tu lógica específica.
            await esperarCondicion(() => ascensor.estadoPuertas === "abiertas");
            console.log("Cerrando puertas...");
            ascensor.estadoPuertas = "cerradas";
            actualizarEstadoAscensor();
            moverAscensor(pisoDestino);
            const pisoActual = pisoDestino;
            descargarPaquete(pisoActual);
        });
    });

    function manejarAgregarPaquete(event) {
        event.preventDefault();


        const peso = parseFloat(document.getElementById('peso').value);
        const dimensionesInput = document.getElementById('dimensiones').value;
        const [ancho, alto] = dimensionesInput.split('x').map(Number);
        const destino = parseInt(document.getElementById('destino').value);

        const paquete = new Paquete(peso, { ancho, alto }, destino);
        ascensor.cargar(paquete); // Asegúrate de que esta función actualiza el peso total en el ascensor.

        const listaPaquetes = document.getElementById('paquetes-pendientes');
        const elementoPaquete = document.createElement('li');
        elementoPaquete.id = `paquete-destino-${destino}-${Date.now()}`;
        elementoPaquete.setAttribute('data-peso', peso);
        elementoPaquete.setAttribute('data-ancho', ancho);
        elementoPaquete.setAttribute('data-alto', alto);
        elementoPaquete.textContent = `Peso: ${peso} kg, Dimensiones: ${ancho}x${alto} cm, Destino: Piso ${destino}`;
        listaPaquetes.appendChild(elementoPaquete);

        event.target.reset();
        actualizarEstadoAscensor();

    }


    function descargarPaquete(pisoActual) {
        const paquetesParaDescargar = document.querySelectorAll(`#lista-paquetes > li[id*="paquete-destino-${pisoActual}-"]`);

        paquetesParaDescargar.forEach(paquete => {
            const pesoPaquete = parseFloat(paquete.getAttribute('data-peso'));
            ascensor.cargaActual -= pesoPaquete;
            const anchoPaquete = parseFloat(paquete.getAttribute('data-ancho'));
            ascensor.anchoActual -= anchoPaquete;
            const altoPaquete = parseFloat(paquete.getAttribute('data-alto'));
            ascensor.altoActual -= altoPaquete; // Actualiza el peso total en el ascensor
            paquete.remove(); // Elimina el elemento del DOM
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
            }
        });
    }


    function actualizarEstadoAscensor() {
        // Actualizar el piso actual del ascensor
        document.getElementById('piso-actual').textContent = `Piso Actual: ${ascensor.pisoActual}`;

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


        if (ascensor.pisoActual === 0) {
            console.log("Cargando paquetes en planta baja");
            cargarPaquetes();
        }

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
        // Primero, verifica si el piso destino es válido y diferente del piso actual
        if (pisoDestino >= 0 && pisoDestino < ascensor.pisosTotales && pisoDestino !== ascensor.pisoActual) {
            console.log(`Añadiendo piso ${pisoDestino} a la cola de destinos.`);

            // Añadir el piso destino a la cola si aún no está en ella
            if (!ascensor.destinos.includes(pisoDestino)) {
                ascensor.destinos.push(pisoDestino);
            }

            // Intentar mover el ascensor si las puertas están cerradas y no está ya en movimiento hacia otro piso
            if (ascensor.estadoPuertas === "cerradas" && ascensor.destinos.length === 1) {
                // Aquí podrías implementar una lógica más sofisticada para determinar cuál destino procesar primero
                procesarMovimiento();
            }
        } else {
            console.log("Piso destino inválido o ya en el piso destino.");
        }
    }

    function procesarMovimiento() {
        if (ascensor.destinos.length > 0) {
            const siguientePiso = ascensor.destinos.shift(); // Obtiene y elimina el primer destino de la cola
            console.log(`Moviendo el ascensor al piso ${siguientePiso}...`);

            // Simular el movimiento del ascensor con un retraso
            setTimeout(async () => {
                ascensor.pisoActual = siguientePiso;
                console.log('Abriendo puertas...');
                ascensor.estadoPuertas = "abiertas"; // Supongamos que las puertas se abren automáticamente al llegar
                console.log(`Ascensor ha llegado al piso ${ascensor.pisoActual}.`);
                actualizarEstadoAscensor(); // Actualiza la interfaz de usuario con el nuevo estado del ascensor
            }, 1000 * Math.abs(ascensor.pisoActual - siguientePiso)) // Simula el tiempo que toma moverse entre pisos
        }
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
    /* 
        function actualizarContenido()
        {
            // Actualizar la lista de paquetes pendientes
            document.getElementById('paquetes-pendientes').
        
            // Actualizar la carga actual dentro del ascensor
            document.getElementById('carga-actual').textContent = `Carga Actual: ${ascensor.cargaActual} kg`;
        
            // Actualizar el estado de las puertas del ascensor
            const estadoPuertasTexto = ascensor.estadoPuertas === "abiertas" ? "Abiertas" : "Cerradas";
            document.getElementById('estado-puertas').textContent = `Estado de las Puertas: ${estadoPuertasTexto}`;
        } */
    // Implementaciones adicionales según sea necesario...
});
