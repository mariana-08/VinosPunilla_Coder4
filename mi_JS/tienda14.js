// Clase Tienda 
class Tienda {
    constructor(vinos) {
        this.vinos = vinos;
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.contadorCarrito = document.getElementById('carrito-contador');
        this.actualizarContadorCarrito();
        this.vinosFiltrados = [];

        // Inicializar eventos para los selectores de orden y filtro
        document.getElementById('ordenar-precios').addEventListener('change', (event) => {
            this.ordenarVinos(event.target.value);
        });

        document.getElementById('filtrar-bodega').addEventListener('change', (event) => {
            this.filtrarPorBodega(event.target.value);
        });
    }

    // Método para iniciar la tienda
    iniciarTienda() {
        // Verificar si ya se ha confirmado que el usuario es mayor de edad
        if (!localStorage.getItem('mayorDeEdad')) {
            Swal.fire({
                title: 'Bienvenidos a Vinos Punilla',
                text: 'Para visitar nuestro sitio web debes ser mayor de 18 años.',
                input: 'text',
                inputPlaceholder: 'Ingresa tu año de nacimiento',
                showCancelButton: true,
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debes ingresar un año de nacimiento';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const anioNacimientoIng = result.value;
                    if (this.validarEdad(anioNacimientoIng)) {
                        Swal.fire({
                            title: '¡Bien!',
                            text: 'Sos mayor de edad. Podrás visitar la página y comprar vinos.',
                        }).then(() => {
                            localStorage.setItem('mayorDeEdad', 'true');
                            this.mostrarVinos();
                        });
                    } else {
                        Swal.fire({
                            title: 'Acceso denegado',
                            text: 'Debes ser mayor de 18 años para ingresar a Vinos Punilla. Recarga la página.',
                            icon: 'error'
                        });
                    }
                }
            });
        } else {
            this.mostrarVinos();
        }
    }

    // Método para validar la edad del usuario
    validarEdad(anioNacimientoIng) {
        const anioNacimiento = parseInt(anioNacimientoIng);
        const anioActual = new Date().getFullYear();
        const edad = anioActual - anioNacimiento;

        return !isNaN(anioNacimiento) && edad >= 18;
    }

    // Método para mostrar los vinos en la página
    mostrarVinos(vinos = this.vinos) {
        const contenedor = document.querySelector('.contenedor-vinos');
        const plantilla = document.querySelector('.plantilla-vino');
        contenedor.innerHTML = ''; // Limpiar el contenedor antes de mostrar los vinos

        // Recorrer los vinos y agregar al contenedor
        vinos.forEach(vino => {
            const vinoDiv = plantilla.cloneNode(true);
            vinoDiv.classList.remove('d-none');
            vinoDiv.querySelector('.img-vinos').src = vino.imagen;
            vinoDiv.querySelector('.img-vinos').alt = vino.nombre;
            vinoDiv.querySelector('.tit-card').textContent = vino.nombre;
            vinoDiv.querySelector('.descripcion').textContent = vino.bajada;
            vinoDiv.querySelector('.anio-anios').innerHTML = `Año de Producción: ${vino.anioProduccion} <br> Maduración: ${vino.calcularAniosCosecha ? vino.calcularAniosCosecha() : '\n'} años`;
            vinoDiv.querySelector('.precio-vin').textContent = `Precio: $${vino.precio}`;
            vinoDiv.querySelector('.agregar').setAttribute('data-id', vino.id);

            contenedor.appendChild(vinoDiv);
        });

        // Agregar eventos a los botones
        this.agregarEventos();
    }

    agregarEventos() {
        document.querySelectorAll('.agregar').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const id = parseInt(event.target.getAttribute('data-id'));
                this.agregarAlCarrito(id);
            });
        });
    }

    // Método para agregar al carrito usando Toastify
    agregarAlCarrito(id) {
        const vino = this.vinos.find(v => v.id === id);
        if (vino) {
            const vinoEnCarrito = this.carrito.find(v => v.id === id);
            if (vinoEnCarrito) {
                vinoEnCarrito.cantidad++;
            } else {
                this.carrito.push({ ...vino });
            }

            // Mostrar notificación con Toastify
            Toastify({
                text: `${vino.nombre} ha sido agregado al carrito.`, // \nPrecio: $${vino.precio}`,
                duration: 2500,
                close: true,
                gravity: 'bottom', // `top` o `bottom`
                position: 'right', // `left`, `center` o `right`
                backgroundColor: '#374055',
                stopOnFocus: true,
            }).showToast();

            this.actualizarContadorCarrito();
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        }
    }

    // Método para actualizar el contador del carrito
    actualizarContadorCarrito() {
        this.contadorCarrito.textContent = this.carrito.reduce((acc, vino) => acc + vino.cantidad, 0);
    }

    // Método para ordenar los vinos por precio
    ordenarVinos(orden) {
        if (orden === 'asc') {
            this.filtrarPrecios(true);
        } else if (orden === 'desc') {
            this.filtrarPrecios(false);
        } else {
            this.mostrarVinos(this.vinos);
        }
    }

    // Método para filtrar los vinos por precio
    filtrarPrecios(ascendente) {
        let coleccion = this.vinosFiltrados.length > 0 ? this.vinosFiltrados : this.vinos;
        const preciosOrdenados = coleccion.sort((a, b) => {
            return ascendente ? a.precio - b.precio : b.precio - a.precio;
        });
        this.mostrarVinos(preciosOrdenados);
    }

    // Método para filtrar los vinos por bodega
    filtrarPorBodega(bodega) {
        if (bodega === "") {
            this.vinosFiltrados = [];
            this.mostrarVinos(this.vinos);
        } else {
            this.vinosFiltrados = this.vinos.filter(vino => vino.bodega === bodega);

            let orden = document.getElementById('ordenar-precios').value;
            this.ordenarVinos(orden);
        }
    }
}

// Crear una instancia de Tienda con los datos de vinos.js
const tienda = new Tienda(vinos);
document.addEventListener('DOMContentLoaded', () => {
    tienda.iniciarTienda();
});

//en tienda14 tengo la parte que recuerde que si el usuario es mayor de edad con local storage y no le vuelve a pedir la edad
//tambien tengo la parte de ordenar los vinos por precio y filtrar por bodega
//y tambien tengo la parte de agregar al carrito con toastify
//y tambien tengo la parte de contar los productos en el carrito
//y tambien tengo la parte de mostrar los vinos en la pagina
//y tambien tengo la parte de validar la edad del usuario
//y tambien tengo la parte de agregar eventos a los botones
//y tambien tengo la parte de agregar al carrito
//y tambien tengo la parte de actualizar el contador del carrito
//y tambien tengo la parte de ordenar los vinos por precio
//y tambien tengo la parte de filtrar los vinos por precio
//y tambien tengo la parte de filtrar los vinos por bodega
//y tambien tengo la parte de mostrar los vinos en la pagina
//y tambien tengo la parte de iniciar la tienda
//y tambien tengo la parte de validar la edad del usuario
//y tambien tengo la parte de mostrar los vinos en la pagina
//y tambien tengo la parte de agregar eventos a los botones
//y tambien tengo la parte de agregar al carrito
//y tambien tengo la parte de actualizar el contador del carrito
//y tambien tengo la parte de ordenar los vinos por precio
//y tambien tengo la parte de filtrar los vinos por precio