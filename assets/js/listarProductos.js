const shopcontent = document.getElementById("shopcontent");
const vercarrito = document.getElementById("vercarrito");
const acciones = document.getElementById("acciones");

let carrito = [];

// Crear el botón "Agregar Producto"
const agregarProductoButton = document.createElement("button");
agregarProductoButton.className = "agregar btn btn-success";
agregarProductoButton.textContent = "Agregar Producto";
agregarProductoButton.style.marginBottom = "40px";
agregarProductoButton.style.marginLeft = "20px";

// Agregar el botón "Agregar Producto" al principio del body
const contentSection = document.querySelector(".content");
contentSection.insertBefore(
  agregarProductoButton,
  contentSection.querySelector(".card")
);
// document.body.insertBefore(agregarProductoButton, document.body.firstChild);

// Obtener referencia al formulario y sus elementos
const productFormContainer = document.getElementById("productFormContainer");
const productForm = document.getElementById("productForm");
const formTitle = document.getElementById("formTitle");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productDescription = document.getElementById("productDescription");
const cancelButton = document.getElementById("cancelButton");

// Función para mostrar el formulario
const showForm = (title, product = {}) => {
  formTitle.textContent = title;
  productName.value = product.nombre || "";
  productPrice.value = product.precio || "";
  productCategory.value = product.categoria || "";
  productDescription.value = product.descripcion || "";
  productFormContainer.style.display = "block";
};

// Función para ocultar el formulario
const hideForm = () => {
  productFormContainer.style.display = "none";
};

// Evento para el botón "Cancelar"
cancelButton.addEventListener("click", hideForm);

// Evento para el botón "Agregar Producto"
agregarProductoButton.addEventListener("click", () => {
  showForm("Agregar Producto");
  productForm.onsubmit = async (e) => {
    e.preventDefault();
    const nuevoProducto = {
      nombre: productName.value,
      precio: productPrice.value,
      categoria: productCategory.value,
      descripcion: productDescription.value,
    };
    try {
      const response = await fetch("http://localhost:5501/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
      });
      if (response.ok) {
        const data = await response.json();
        alert("Producto agregado correctamente");
        agregarProductoALaLista(data);
        hideForm();
      } else {
        const errorData = await response.json();
        alert(`Error al agregar el producto: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Error al agregar el producto");
    }
  };
});

// Función para agregar un producto a la lista en la página
const agregarProductoALaLista = (product) => {
  const content = document.createElement("tr");
  const editar = document.createElement("button");
  const eliminar = document.createElement("button");
  const accionesColumna = document.createElement("td");

  editar.className = "editar btn btn-primary";
  editar.textContent = "Editar";
  eliminar.className = "eliminar btn btn-danger";
  eliminar.textContent = "Eliminar";

  content.innerHTML = `
    <td><img src="${product.img}" style="width: 150px; display: block; margin: 0 auto;"></td>
    <td>${product.nombre}</td>
    <td>${product.categoria}</td>
    <td>${product.precio}</td>
    <td>${product.descripcion}</td>
  `;

  // Agregar el contenido de acciones a la columna de acciones
  accionesColumna.appendChild(editar);
  accionesColumna.appendChild(eliminar);

  // Agregar la columna de acciones a la fila de contenido
  content.appendChild(accionesColumna);

  // Insertar la fila de contenido al principio de shopcontent
  shopcontent.insertBefore(content, shopcontent.firstChild);

  // Evento para eliminar producto
  eliminar.addEventListener("click", async () => {
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:5501/productos/${product.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Producto eliminado correctamente");
          content.remove();
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  });

  // Evento para editar producto
  editar.addEventListener("click", () => {
    showForm("Editar Producto", product);
    productForm.onsubmit = async (e) => {
      e.preventDefault();
      const updatedProduct = {
        nombre: productName.value,
        precio: productPrice.value,
        categoria: productCategory.value,
        descripcion: productDescription.value,
      };
      try {
        const response = await fetch(
          `http://localhost:5501/productos/${product.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
          }
        );
        if (response.ok) {
          alert("Producto actualizado correctamente");
          product.nombre = updatedProduct.nombre;
          product.precio = updatedProduct.precio;
          product.categoria = updatedProduct.categoria;
          product.descripcion = updatedProduct.descripcion;

          // Actualizar el contenido de la fila con los datos actualizados del producto
          content.innerHTML = `
            <td><img src="${product.img}" style="width: 150px; display: block; margin: 0 auto;"></td>
            <td>${product.nombre}</td>
            <td>${product.categoria}</td>
            <td>${product.precio}</td>
            <td>${product.descripcion}</td>
          `;

          hideForm();
        } else {
          const errorData = await response.json();
          alert(`Error al actualizar el producto: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        alert("Error al actualizar el producto");
      }
    };
  });
};

// Función para obtener productos desde el servidor
const obtenerProductos = async () => {
  try {
    const response = await fetch("http://localhost:5501/productos");
    const productos = await response.json();

    productos.forEach((product) => {
      agregarProductoALaLista(product);
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};

// Función para cargar categorías en el formulario
const cargarCategorias = async () => {
  try {
    const response = await fetch("http://localhost:5501/categorias");
    const data = await response.json();
    const select = document.getElementById("productCategory");
    select.innerHTML = ""; // Limpiar opciones anteriores
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.idCategoria; // Guarda el ID de la categoría como valor del option
      option.text = item.descripcionCategoria; // Muestra la descripción de la categoría al usuario
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Cargar categorías al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  cargarCategorias();
  obtenerProductos();
});

// Evento para ocultar el formulario al hacer clic en el botón "Cancelar"
document.getElementById("cancelButton").addEventListener("click", function () {
  document.getElementById("productFormContainer").style.display = "none";
});
