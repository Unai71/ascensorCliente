class Ascensor {
    constructor() {
        this.pisoActual = 0; // Suponiendo que el piso más bajo es 0.
        this.pisosTotales = 4;
        this.estadoPuertas = "abiertas"; // Puede ser "abiertas" o "cerradas".
        this.cargaMaxima = 5000;
        this.anchoMaximo = 250;
        this.altoMaximo = 200;
        this.cargaActual = 0;
        this.anchoActual = 0;
        this.altoActual = 0;

        this.destinos = []; // Cola de destinos.
    }

    moverA(piso) {
        // Implementa la lógica para mover el ascensor al piso especificado.
        // Asegúrate de que el piso destino está dentro del rango válido.
        if (piso >= 0 && piso < this.pisosTotales) {
            console.log(`Moviendo el ascensor del piso ${this.pisoActual} al piso ${piso}`);
            this.pisoActual = piso;
            // Aquí podrías implementar la lógica para simular el movimiento.
        } else {
            console.log("Piso destino fuera de rango.");
        }
    }

    abrirPuertas() {
        if (this.estadoPuertas === "cerradas") {
            this.estadoPuertas = "abiertas";
            console.log("Las puertas se han abierto.");
        }
    }

    cerrarPuertas() {
        if (this.estadoPuertas === "abiertas") {
            this.estadoPuertas = "cerradas";
            console.log("Las puertas se han cerrado.");
        }
    }

    cargar(paquete) {
        // Asume que paquete tiene una propiedad 'peso'.
        if (this.estadoPuertas === "abiertas" && (this.cargaActual + paquete.peso) <= this.cargaMaxima && this.pisoActual === 0)
        {
            this.cargaActual += paquete.peso;
            console.log(`Paquete cargado. Carga actual: ${this.cargaActual}kg`);
        } else {
            console.log("No se puede cargar el paquete. Las puertas están cerradas o se excedería la carga máxima.");
        }
    }

    descargar(paquete) {
        // Similar a cargar, pero reduciendo la carga actual.
        if (this.estadoPuertas === "abiertas" && this.cargaActual >= paquete.peso) {
            this.cargaActual -= paquete.peso;
            console.log(`Paquete descargado. Carga actual: ${this.cargaActual}kg`);
        } else {
            console.log("No se puede descargar el paquete. Las puertas están cerradas o la carga es menor que el peso del paquete.");
        }
    }
}

export default Ascensor;