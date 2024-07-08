// Función para la validación de usuario y contraseña
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evitar envío automático del formulario
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:5501/usuarios");
      const usuarios = await response.json();
  
      const usuarioValido = usuarios.some(usuario => usuario.user === username && usuario.pass === password);
  
      if (usuarioValido) {
        alert("¿Seguro que quieres ingresar?");
        window.location.href = "cms.html"; // Redirigir a CMS después del login exitoso
      } else {
        alert("Contraseña o usuario incorrectos");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Error al validar el formulario. Por favor, inténtalo de nuevo.");
    }
  });
  