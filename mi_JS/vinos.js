
// Clase Vino
class Vino {
    constructor(id, nombre, precio, anioProduccion, bodega, bajada = "", imagen = "") {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.anioProduccion = anioProduccion;
        this.bodega = bodega;
        this.bajada = bajada;
        this.imagen = imagen;
        this.cantidad = 1;
    }

    // Método para calcular los años de añejamiento
    calcularAniosCosecha() {
        const anioActual = new Date().getFullYear();
        return anioActual - this.anioProduccion;
    }
}

// Cargar los datos de vinos desde el archivo .json
document.addEventListener('DOMContentLoaded', () => {
    fetch('mi_JS/vinos.json')
        .then(response => response.json())
        .then(data => {
            const vinos = data.map(vino => new Vino(vino.id, vino.nombre, vino.precio, vino.anioProduccion, vino.bodega, vino.bajada, vino.imagen));
            // Crear una instancia de Tienda con los datos de vinos
            const tienda = new Tienda(vinos);
            tienda.iniciarTienda();
        })
        .catch(error => console.error('Error al cargar los datos de vinos:', error));
});
