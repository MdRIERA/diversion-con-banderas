const list = document.getElementById("countries-list");
const url =
  "https://restcountries.com/v3.1/all?fields=name,flags,capital,population,car";

async function init() {
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo cargar la API");
  const data = await res.json();

  // Crea el overlay del modal (oculto al inicio)
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "showModal hidden"; // overlay centrado + oculto
  document.body.appendChild(modal);

  // Orden alfabético por nombre común
  data.sort((a, b) => a.name.common.localeCompare(b.name.common, "es", { sensitivity: "base" }));

  // Render de tarjetas/filas simples
  data.forEach((element) => {
    const card = document.createElement("div");
    const img = document.createElement("img");
    img.src = element.flags.svg;
    img.alt = element.flags.alt || `Bandera de ${element.name.common}`;

    const name = document.createElement("h1");
    name.textContent = element.name.common;

    card.appendChild(img);
    card.appendChild(name);
    list.appendChild(card);

    // Abrir modal al hacer click en la tarjeta
    card.addEventListener("click", () => {
      modal.innerHTML = "";           // limpiar contenido anterior
      modal.classList.remove("hidden");

      // Tarjeta del modal (dos columnas)
      const modalContent = document.createElement("div");
      modalContent.className = "modal-content";

      // Columna izquierda: bandera + botón
      const left = document.createElement("div");
      left.className = "modal-left";

      const bigImg = document.createElement("img");
      bigImg.src = element.flags.svg;
      bigImg.alt = element.flags.alt || `Bandera de ${element.name.common}`;
      left.appendChild(bigImg);

      const closeBtn = document.createElement("button");
      closeBtn.className = "close-btn";
      closeBtn.textContent = "Cerrar";
      closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
      left.appendChild(closeBtn);

      // Columna derecha: datos
      const info = document.createElement("div");
      info.className = "modal-info";

      const h1 = document.createElement("h1");
      h1.textContent = element.name.common;

      const capital = document.createElement("p");
      capital.innerHTML = `<strong>Capital:</strong> ${element.capital?.[0] ?? "—"}`;

      const poblacion = document.createElement("p");
      poblacion.innerHTML = `<strong>Población:</strong> ${Number(element.population).toLocaleString("es-ES")}`;

      const lado = document.createElement("p");
      const side = element.car?.side ?? "—";
      lado.innerHTML = `<strong>Lado de la carretera:</strong> ${side}`;

      info.appendChild(h1);
      info.appendChild(capital);
      info.appendChild(poblacion);
      info.appendChild(lado);

      // Montaje final
      modalContent.appendChild(left);
      modalContent.appendChild(info);
      modal.appendChild(modalContent);
    });
  });
}

init();
