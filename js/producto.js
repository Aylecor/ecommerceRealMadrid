//clase constructora
class Producto{
    constructor (id, nombre, categoria, genero, precio, url, cantidad){
        this.id= parseInt(id);
        this.nombre= nombre;
        this.categoria= categoria;
        this.genero= genero;
        this.precio= parseFloat(precio);
        this.url= url;
        this.cantidad = cantidad || 1; //uso de operador OR
    }

    //metodo cantidad (operador ++)
    addCantidad(){
        this.cantidad++;                
    } 

    subTotal(){
        return this.precio * this.cantidad;
    }
    
    agregarCantidad(valor){
        this.cantidad += valor;
    }
}