const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 5501;

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost", // Cambia a tu host de MySQL
  user: "root", // Cambia a tu usuario de MySQL
  password: "", // Cambia a tu contraseña de MySQL
  database: "altagammabd", // Cambia al nombre de tu base de datos
  port: 3308, // Puerto por defecto de MySQL es 3306
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

app.use("/assets", express.static(path.join(__dirname, "assets")));
// Ruta para obtener los productos
app.get("/productos", (req, res) => {
  connection.query(
    "SELECT * FROM `productos` INNER JOIN `categoria` ON categoria.idCategoria = productos.idCategoria;",
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta:", err.stack);
        res.status(500).send("Error al obtener los datos");
        return;
      }

      // Mapear los resultados de la base de datos al formato esperado en el frontend
      const productos = results.map((producto) => ({
        id: producto.idProducto,
        nombre: producto.nombreProducto,
        precio: producto.precioUnitario,
        categoria: producto.descripcionCategoria,
        descripcion: producto.descripcionProducto,
        // img: `./assets/img/${producto.idProducto}.png`,
        img: `./assets/img/${producto.idProducto}.png`,
      }));

      res.json(productos); // Envía los datos mapeados como respuesta en formato JSON
    }
  );
});

// Ruta para obtener las categorías
app.get("/categorias", (req, res) => {
  connection.query("SELECT * FROM categoria", (err, results) => {
    if (err) {
      console.error("Error al obtener las categorías:", err);
      res.status(500).send("Error al obtener las categorías");
      return;
    }
    console.log("Resultados de la consulta de categorías:", results);
    res.json(results);
  });
});

// Ruta para eliminar un producto
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM productos WHERE idProducto = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el producto:", err.stack);
        res.status(500).send("Error al eliminar el producto");
        return;
      }
      res.send("Producto eliminado correctamente");
    }
  );
});

// Ruta para actualizar un producto
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria, descripcion } = req.body;
  connection.query(
    "UPDATE productos SET nombreProducto = ?, precioUnitario = ?, idCategoria = ?, descripcionProducto = ? WHERE idProducto = ?",
    [nombre, precio, categoria, descripcion, id],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el producto:", err.stack);
        res.status(500).send("Error al actualizar el producto");
        return;
      }
      res.send("Producto actualizado correctamente");
    }
  );
});

// Ruta para crear un nuevo producto
app.post("/productos", (req, res) => {
  const { nombre, precio, categoria, descripcion } = req.body;
  const sql =
    "INSERT INTO productos (nombreProducto, precioUnitario, idCategoria, descripcionProducto) VALUES (?, ?, ?, ?)";
  //INSERT INTO `productos` (`idProducto`, `nombreProducto`, `precioUnitario`, `idCategoria`, `descripcionProducto`, `fechaCompraStock`) VALUES (NULL, 'manyin', '500', NULL, '', current_timestamp());

  connection.query(
    sql,
    [nombre, precio, categoria, descripcion],
    (err, results) => {
      if (err) {
        console.error("Error al crear el nuevo producto:", err); // Muestra el error en la consola
        return res.status(500).send("Error al crear el nuevo producto"); // Devuelve un mensaje de error al cliente
      }

      // Obtener el ID del producto creado
      const nuevoId = results.insertId;

      // Formar el objeto del nuevo producto con el ID generado
      const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        descripcion: descripcion,
        img: `./assets/img/${nuevoId}.png`, // Ajusta la ruta de la imagen según tu estructura de archivos
      };

      res.status(201).json(nuevoProducto); // Devolver el nuevo producto creado como respuesta
    }
  );
});

// Configurar Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/img/"); // Ruta donde se guardarán las imágenes src="./assets/img/3.png"
  },
  filename: (req, file, cb) => {
    // Se utilizará el nuevoId para nombrar el archivo
    const nuevoId = req.nuevoId;
    cb(null, `${nuevoId}.png`);
  },
});

const upload = multer({ storage: storage });

// CONFIGURACION DEL ACCES CMS PARA INGRESAR AL GESTOR DE BASE DE DATOS

//funcion get

// Ruta para obtener usuarios con el JSON nombrado como resultadousuario
app.get("/usuarios", (req, res) => {
  connection.query(
    "SELECT nombre_usuario AS user, contraseña AS pass FROM usuarios",
    (err, results) => {
      if (err) {
        console.error("Error al obtener usuarios:", err);
        return res.status(500).send("Error al obtener usuarios");
      }
      const resultadousuario = results.map((usuario) => ({
        user: usuario.user,
        pass: usuario.pass,
      }));
      res.json(resultadousuario); // Envía los usuarios como respuesta en formato JSON con el nombre resultadousuario
    }
  );
});

// INICIAMOS EL SERVIDOR EXPRESS
app.listen(port, () => {
  console.log(`Servidor web en línea en el puerto ${port}`);
});
