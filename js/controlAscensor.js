class ControlAscensor {
    constructor(ascensor) {
        this.ascensor = ascensor; // La instancia del ascensor que se controlará.
        // Inicializar los botones exteriores e interiores como objetos vacíos.
        // Las claves serán los números de piso y los valores el estado del botón (true para activado, false para no activado).
        this.botonesExteriores = {};
        this.botonesInteriores = {};
        
        // Inicializar botones para cada piso basado en el número total de pisos del ascensor.
        for (let i = 0; i < ascensor.pisosTotales; i++) {
            this.botonesExteriores[i] = false;
            this.botonesInteriores[i] = false;
        }
    }

    pulsarBotonExterior(piso) {
        // Simula pulsar un botón exterior para llamar al ascensor al piso indicado.
        if (!this.botonesExteriores[piso]) {
            this.botonesExteriores[piso] = true;
            console.log(`Botón exterior del piso ${piso} pulsado.`);
            this.procesarSolicitud(piso);
        }
    }

    pulsarBotonInterior(piso) {
        // Simula pulsar un botón interior para indicar el destino dentro del ascensor.
        if (!this.botonesInteriores[piso]) {
            this.botonesInteriores[piso] = true;
            console.log(`Botón interior para el piso ${piso} pulsado.`);
            this.procesarSolicitud(piso);
        }
    }

    procesarSolicitud(piso) {
        // Añade el piso a la cola de destinos del ascensor y procesa la siguiente solicitud.
        if (!this.ascensor.destinos.includes(piso)) {
            this.ascensor.destinos.push(piso);
            // Aquí podrías implementar lógica para decidir cuándo mover el ascensor.
            this.moverAscensorSiEsNecesario();
        }
    }

    moverAscensorSiEsNecesario() {
        // Comprueba si el ascensor necesita moverse y ejecuta el movimiento si es así.
        if (this.ascensor.destinos.length > 0 && this.ascensor.estadoPuertas === "cerradas") {
            const siguientePiso = this.ascensor.destinos.shift(); // Obtiene y elimina el primer destino de la cola.
            this.ascensor.moverA(siguientePiso);
            // Después de mover, podrías implementar lógica para abrir puertas, etc.
        }
    }

    añadirDestino(piso) {
        this.procesarSolicitud(piso);
    }

    // Aquí podrías añadir más lógica para manejar la apertura/cierre de puertas, etc.
}

export default ControlAscensor;