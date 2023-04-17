//FUNCION genera interfaz de productos
function indumentariaHTML(indumentaria){
    //vacio lo anterior
    contenedorIndumentaria.innerHTML="";
    //recorro el array de indumentaria
    for (const producto of indumentaria) {
        //aplicando desestructuracion
        let nombreP = producto.nombre;
        let urlP = producto.url;
        let categoP = producto.categoria;
        //I crear elemento
        let divIndumentaria= document.createElement("div");
        divIndumentaria.classList.add("col");
        //II asignar valor al elemento creado
        divIndumentaria.innerHTML= `<div class="card style=" width: 18rem;">
                                    <img src="${urlP}" alt="Indumentaria">
                                    <div class="card-body">
                                    <h5 class="card-title">Producto: ${nombreP}</h5>
                                    <h5 class="card-title">Categoria: ${categoP}</h5>
                                    <p class="card-text">Precio: $ ${producto.precio}</p>
                                    <button id="${producto.id}" class="botonCompra btn btn-info">Comprar</button>
                                    </div>
                                    </div>`                        
        //III asignar padre
        contenedorIndumentaria.append(divIndumentaria);
    }
    //llamo a la función para agregar el boton evento al boton de compra
    eventoBoton();
}

//FUNCION para agregar evento al boton de compra
function eventoBoton(){
    //llamo los botones desde el dom por el nombre de la clase
    let botones= document.getElementsByClassName("botonCompra");
    //recorro los botones
    for (const boton of botones){
        //asigno una funcionalidad
        boton.addEventListener("click", function() {
            console.log(this.id);

            //busco el producto
            let eleccion= carrito.find(producto => producto.id==this.id);
            if(eleccion){
                eleccion.addCantidad();
            }else{
                eleccion = indumentaria.find(producto => producto.id==this.id);
                carrito.push(eleccion);
            }
            console.log(carrito);

            //lo muestro en el div de mensaje
            contenedorMensaje.innerHTML=(`Haz agregado el producto ${eleccion.nombre} al carrito, con un valor de $ ${eleccion.precio}.`);  
        
            //localStorage setItem
            localStorage.setItem("nombre", eleccion.nombre);
            localStorage.setItem("precio", eleccion.precio);
            carritoHTML(carrito);
            Toastify({
                text:`Se ha agregado el producto: ${eleccion.nombre} al carrito`,
                duration: 2500,
                style: {
                    background: "linear-gradient(to right,  #a7e3ff , #0088e1)",
                  },
                gravity: "bottom"  
                }).showToast();
        })
    }
}

//FUNCION funcionalidades del carrito
function carritoHTML(lista) {
    cantidadCarrito.innerHTML= lista.length;
    productoCarrito.innerHTML="";
    for (const producto of lista){
        let produ=document.createElement("div");
        produ.innerHTML= `${producto.nombre}
                            <span class="badge bg-danger">Precio: ${producto.precio}</span>
                            <span class="badge bg-warning text-dark">Cantidad: ${producto.cantidad}</span>
                            <span class="badge bg-secondary">Subtotal: $${producto.subTotal()}</span>
                            <a id="${producto.id}" class="btn-infobtn-check btn btn-outline-success btn-add">+</a>
                            <a id="${producto.id}" class="btn-infobtn-check btn btn-outline-primary btn-sub">-</a>
                            <a id="${producto.id}" class="btn-infobtn-check btn btn-outline-danger btn-delete">x</a>`
                            productoCarrito.append(produ);
        }
        document.querySelectorAll(".btn-add").forEach(boton=> boton.onclick= agregarCarrito);
        document.querySelectorAll(".btn-sub").forEach(boton=> boton.onclick= subtraerCarrito);
        document.querySelectorAll(".btn-delete").forEach(boton=> boton.onclick= eliminarCarrito);
        totalCarrito();
}

//FUNCION agregar al carrito
function agregarCarrito() {
    //busco a que producto quiero agregar cantidad
    let producto = carrito.find(p => p.id == this.id);
    //uso el metodo agregarCantidad para agregar
    producto.agregarCantidad(1);
    //modifico el dom subiendo al padre del boton(con parentNode) y obtengo sus hijos(children) para modificarlos
    this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
    this.parentNode.children[2].innerHTML = "Subtotal: " + producto.subTotal();
    //actualizo la interfaz del total
    totalCarrito();
    localStorage.setItem('Carrito', JSON.stringify(carrito));
}

//FUNCION subtraer al carrito
function subtraerCarrito() {
    //busco a que producto quiero quitar cantidad
    let producto = carrito.find(p => p.id == this.id);
    //verifico que no reste si es 1
    if (producto.cantidad > 1) {
            //uso el metodo agregarCantidad para restar con -1
            producto.agregarCantidad(-1);
            //modifico el dom subiendo al padre del boton(con parentNode) y obtengo sus hijos(children) para modificarlos
            this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
            this.parentNode.children[2].innerHTML = "Subtotal: " + producto.subTotal();
            //actualizo la interfaz del total
            totalCarrito();
            localStorage.setItem('Carrito', JSON.stringify(carrito));
    }
}

//FUNCION eliminar del carrito
function eliminarCarrito(e) {
    //busco el indice del producto que quiero eliminar con findIndex
    let posicion = carrito.findIndex(producto => producto.id == e.target.id);
    //lo elimino con splice
    carrito.splice(posicion, 1);
    //actualizo la interfaz
    carritoHTML(carrito);
    //guardo en el storage
    localStorage.setItem('Carrito', JSON.stringify(carrito));
}

//se obtiene los datos en el localStorage y se muestra el mensaje
contenedorMensaje.innerHTML=(`Haz agregado el producto ${localStorage.getItem("nombre")} al carrito, con un valor de $ ${localStorage.getItem("precio")}.`);

//FUNCION para generar filtros dinamicos
function filtroHTML(indumentaria){
    //vacio la informacion anterior
    contenedorFiltro.innerHTML="";
    //agrego titulo del filtro
    contenedorFiltro.append("Categorias: ");
    //obtengo la informacion de las categorias por un map
    const porCategorias= indumentaria.map(producto => producto.categoria);
    //llamo a la funcion crearLista para generar interfaz
    crearLista(arraySinDuplicarse(porCategorias), "categoria");
        
    //filtro por precio
    contenedorFiltro.append("Precio: ");
    const porPrecio= indumentaria.map(producto => producto.precio);
    crearLista(arraySinDuplicarse(porPrecio), "precio");
    
    //filtro por genero
    contenedorFiltro.append("Genero: ");
    const porGenero= indumentaria.map(productos => productos.genero);
    crearLista(arraySinDuplicarse(porGenero), "genero");
}

//FUNCION crearLista para generar la interfaz dinamica del select
function crearLista(lista, clave){
    //parte visual del generador de la interfaz
    //I creo elemento
    var newSeleccion= document.createElement("select","btn btn-secondary");
    newSeleccion.classList.add("flex");
    //II asigno valor<
    newSeleccion.innerHTML="<option>" +lista.join('</option><option>')+ "</option>";
    //III agrego padre a dom
    contenedorFiltro.append(newSeleccion);
    //parte funcional, manejador de evento change
    newSeleccion.addEventListener('change', function(){
        //realizo filtro
        const filtrados= indumentaria.filter(producto => producto[clave]==this.value);
        //llamo a la funcion para generar la interfaz de los filtrados
        indumentariaHTML(filtrados);
     })
}

//FUNCION que permite obtener un nuevo array sin datos duplicados
function arraySinDuplicarse(lista){
    //creo nuevo array para guardar los datos unicos
    var unicos=[];
    //ocupo forEach para recorrer y por cada indumentaria pregunto si ya existe en unico
    lista.forEach(producto=>{
        // operador AND
        !unicos.includes(producto) && unicos.push(producto);
    });
    return unicos;
}

//FUNCION promesa en compra
function promesaCompra(saldo){
    return new Promise(function(aceptado, rechazado){
        if(saldo > 0){
            aceptado("Compra realizada");
    
        }else{
            rechazado("Compra rechazada");
        }
    })
}

//FUNCION calcular total del carrito
function totalCarrito() {
    //realizo la suma total del carrito
    let total = carrito.reduce((totalCompra, actual) => totalCompra += actual.subTotal(), 0);
    totalCarritoInterfaz.innerHTML= "Total: $"+total;
    return total;
}

//FUNCION vaciar localstorage y array carrito
function vaciarCarrito() {
    //borro el localStorage
    localStorage.clear();
    //borro el array carrito con splice
    carrito.splice(0, carrito.length);
    //Llamo a la funcion para generar una interfaz vacia
    carritoHTML(carrito);
    totalCarritoInterfaz.innerHTML= "Total: $"+0;
}

//FUNCION generadora de alertas
function alertaEstado(mensaje, tipo) {
    Swal.fire(
        'Estado de compra',
        mensaje,
        tipo
    )
}