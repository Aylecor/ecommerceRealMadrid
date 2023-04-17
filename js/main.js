//llamada asincrona para obtener los datos de productos con fetch
fetch("datosProductos/productos.json")
  .then(respuesta => respuesta.json())
  .then(data =>{
    for (const literal of data){
      indumentaria.push(new Producto(literal.id, literal.nombre, literal.categoria, literal.genero, literal.precio, literal.url, literal.cantidad));
    }
    //generar interfaz de productos Y filtros con una función 
    indumentariaHTML(indumentaria, "contenedorIndumentaria");
    filtroHTML(indumentaria, "contenedorFiltro");
  }).catch(mensaje=> console.error(mensaje))

//obtener informacion desde el DOM para ver el array
const contenedorIndumentaria= document.getElementById("contenedorIndumentaria");
const contenedorMensaje= document.getElementById("contenedorMensaje");
const contenedorFiltro= document.getElementById("contenedorFiltro");

//boton confirmar carrito
confirmar.onclick = () => {
    let total = totalCarrito();
    saldoCliente -= total;
    //llamo la funcion creadora de promesas y defino un comportamiento para then(si es aceptada) y catch(si es rechazada)
    promesaCompra(saldoCliente).then((mensaje) => {
    
    //--envio del producto--//
    productoCarrito.innerHTML = `<div class="spinner-border text-primary" role="status">
                                  <span class="visually-hidden">Loading...</span>
                                </div>`
                     
    fetch('provincias/prov.json')
      .then((respuesta) => {
        return respuesta.json()
      }).then((datos) => {
        console.log(datos);

        productoCarrito.innerHTML = `<h3>Info del Envio</h3>
                                    <select id="provFiltro"></select> 
                                    <select id="munFiltro"></select>
                                    <button id="btnEnvio">Enviar</button>`;

        const provFiltro = document.getElementById('provFiltro');

        for (const provincia of datos.provincias) {
          provFiltro.innerHTML += `<option value="${provincia.id}">${provincia.nombre}</option>`;
        }

        provFiltro.onchange = () => {
          let idProvincia = provFiltro.value;
          console.log(idProvincia);
          
          let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`;
          fetch(rutaBusqueda)
            .then(respuesta => respuesta.json())
            .then(datos => {
              console.log(datos);
              let munFiltro = document.getElementById('munFiltro');
              for(const municipio of datos.municipios) {
                munFiltro.innerHTML += `<option value="${municipio.id}">${municipio.nombre}</option>`;
              }

              document.getElementById('btnEnvio').onclick = () => {
                console.log("Enviar a " + munFiltro.value + " en provincia ID " + idProvincia);

                fetch('https://jsonplaceholder.typicode.com/posts', {
                  method: 'POST',
                  body: JSON.stringify({
                    carrito: carrito,
                    idProvincia: idProvincia,
                    idMunicipio: munFiltro.value
                  }),
                  headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                  },

                }).then(respuesta => respuesta.json())
                  .then(data => {
                    Swal.fire(
                      'Compra Confirmada',
                      "PEDIDO Nº " + data.id + " EN CAMINO",
                      'success'
                    )
                  })
              }
            })
        }
      })
      .catch((mensaje) => { console.log(mensaje) })

  }).catch((mensaje) => {
    alertaEstado(mensaje, "error")
  })
}
