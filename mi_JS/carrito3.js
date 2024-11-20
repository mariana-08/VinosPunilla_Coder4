function mostrarCarrito() {
    carritoItems.innerHTML = ''; // Limpiar el contenedor del carrito.

    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<tr><td colspan="5" class="text-center">Tu carrito está vacío</td></tr>';
        sumaCarrito.textContent = 'Total: $0'; // Asegurar que el total también se actualice
        return; // Salir de la función, ya que no hay productos para mostrar
    }

    let total = 0;

    // Recorrer los productos del carrito y mostrarlos
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

    sumaCarrito.textContent = `Total: $${total}`; // Mostrar el total al final
}
