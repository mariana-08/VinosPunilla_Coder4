document.addEventListener('DOMContentLoaded', () => {
    const carritoItems = document.getElementById('carrito-items');
    const sumaCarrito = document.querySelector('.suma-carrito');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    const menuCarritoBtn = document.getElementById('menu-carrito');

    // Cargar el carrito desde el localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para mostrar los productos en el carrito
    function mostrarCarrito() {
        carritoItems.innerHTML = ''; // Limpiar el contenedor del carrito.
        let total = 0;

        carrito.forEach(vino => {
            const row = document.createElement('tr');

            const imgCell = document.createElement('th');
            imgCell.scope = 'row';
            const img = document.createElement('img');
            img.src = vino.imagen;
            img.alt = vino.nombre;
            img.width = 50;
            imgCell.appendChild(img);

            const nameCell = document.createElement('td');
            nameCell.textContent = vino.nombre;

            const priceCell = document.createElement('td');
            priceCell.textContent = `$${vino.precio}`;

            const quantityCell = document.createElement('td');
            const quantityWrapper = document.createElement('div');
            quantityWrapper.classList.add('d-flex', 'align-items-center');

            const decrementBtn = document.createElement('button');
            decrementBtn.textContent = '-';
            decrementBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'me-2');
            decrementBtn.addEventListener('click', () => {
                Swal.fire({
                    title: 'Estas por eliminar un vino',
                    text: '¿Está seguro de eliminar este vino?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        decrementarCantidad(vino.id);
                    }
                });
            });

            const quantityText = document.createElement('span');
            quantityText.textContent = vino.cantidad;
            quantityText.classList.add('me-2');

            const incrementBtn = document.createElement('button');
            incrementBtn.textContent = '+';
            incrementBtn.classList.add('btn', 'btn-success', 'btn-sm');
            incrementBtn.addEventListener('click', () => {
                Swal.fire({
                    title: 'Sumaste un vino.',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                });
                incrementarCantidad(vino.id);
            });

            quantityWrapper.appendChild(decrementBtn);
            quantityWrapper.appendChild(quantityText);
            quantityWrapper.appendChild(incrementBtn);
            quantityCell.appendChild(quantityWrapper);

            const totalCell = document.createElement('td');
            totalCell.textContent = `$${vino.precio * vino.cantidad}`;

            row.appendChild(imgCell);
            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(totalCell);

            carritoItems.appendChild(row);
            total += vino.precio * vino.cantidad;
        });

        sumaCarrito.textContent = `Total: $${total}`;
    }

    // Función para incrementar la cantidad de un vino
    function incrementarCantidad(id) {
        const vino = carrito.find(v => v.id === id);
        if (vino) {
            vino.cantidad++;
            actualizarCarrito();
        }
    }

    // Función para decrementar la cantidad de un vino
    function decrementarCantidad(id) {
        const vino = carrito.find(v => v.id === id);
        if (vino && vino.cantidad > 1) {
            vino.cantidad--;
            actualizarCarrito();
        } else if (vino && vino.cantidad === 1) {
            const index = carrito.indexOf(vino);
            carrito.splice(index, 1);
            actualizarCarrito();
        }
    }

    // Función para actualizar el carrito en el localStorage y en la interfaz
    function actualizarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }

    // Función para finalizar la compra
    function finalizarCompra() {
        if (carrito.length === 0) {
            Swal.fire({
                title: 'No tienes productos en el carrito.',
                icon: 'warning'
            });
            return;
        }

        let listaVinos = '';
        let sumaCarrito = 0;
        carrito.forEach(vino => {
            listaVinos += `<p>${vino.nombre} - $${vino.precio} x ${vino.cantidad}</p>`;
            sumaCarrito += vino.precio * vino.cantidad;
        });
        listaVinos += `<p><strong>Total: $${sumaCarrito}</strong></p>`;

        Swal.fire({
            title: 'Compraste los vinos:',
            html: `${listaVinos}<h4>¡Gracias por tu compra!</h4>`,
            icon: 'success'
        }).then(() => {
            localStorage.removeItem('carrito');
            carritoItems.innerHTML = '';
            document.querySelector('.suma-carrito').textContent = 'Total: $0';
            carrito.length = 0;
            // Redirigir a la página de inicio después de 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 2000);
        });
    }

    // Mostrar el carrito
    mostrarCarrito();
   finalizarCompraBtn.addEventListener('click', finalizarCompra);

});
