// Funciones para agregar tarjetas de productos y carrito
const shopcontent = document.getElementById("shopcontent");
const vercarrito = document.getElementById("vercarrito");

let carrito = [];

//Función para obtener productos desde el servidor - <img src="${product.img}"> - <p class="price">$${product.precio}</p>

const obtenerProductos = async () => {
  try {
    const response = await fetch("http://localhost:5501/productos");
    const productos = await response.json();

    // <td>${product.nombre}</td>
    productos.forEach((product) => {
      let content = document.createElement("div");
      content.className = "card";
      content.innerHTML = `
          <td><img src="${product.img}" style="width: 150px; display: block; margin: 0 auto;"></td>
          <td>Precio: ${product.precio}</h4>
          `;

      shopcontent.append(content);

      let comprar = document.createElement("button");
      comprar.className = "comprar";
      comprar.innerText = "comprar";

      content.append(comprar);

      comprar.addEventListener("click", () => {
        alert(
          "Se agregará el producto al carrito, para la segunda entrega se habilitará la 5ta sección en la que los productos se añadirán a la sección SHOP"
        );
        carrito.push({
          id: product.id,
          img: product.img,
          nombre: product.nombre,
          precio: product.precio,
        });
        console.log(carrito);
      });
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};

// Llama a la función para obtener los productos cuando la página se carga
obtenerProductos();

vercarrito.addEventListener("click", () => {
  // Lógica para ver el carrito
});
