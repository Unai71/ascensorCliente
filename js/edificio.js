class Edificio {
    constructor(ascensor) {
        this.ascensor = ascensor; // Utiliza la instancia específica del ascensor previamente creada.
        this.paquetes = []; // Lista para almacenar los paquetes en el edificio.
    }

    agregarPaquete(paquete) {
        // Añade un nuevo paquete al edificio. Podrías implementar lógica para decidir a qué piso va inicialmente el paquete.
        this.paquetes.push(paquete);
        console.log(`Paquete añadido: Peso ${paquete.peso}kg, destino piso ${paquete.destino}`);
    }

    distribuirPaquetes() {
        // Implementa la lógica para distribuir paquetes, por ejemplo, cargarlos en el ascensor si están en el piso actual del ascensor.
        this.paquetes.forEach(paquete => {
            if (this.ascensor.pisoActual === 0 && this.ascensor.cargaActual + paquete.peso <= this.ascensor.cargaMaxima) {
                this.ascensor.cargar(paquete);
                console.log(`Paquete cargado en el ascensor: Peso ${paquete.peso}kg, destino piso ${paquete.destino}`);
                // Aquí podrías implementar la lógica para eliminar el paquete de `this.paquetes` o marcarlo como cargado.
            }
        });
    }
}

export default Edificio;
