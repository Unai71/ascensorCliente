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


}

export default Ascensor;