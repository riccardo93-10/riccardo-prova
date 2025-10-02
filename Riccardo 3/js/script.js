const select = document.getElementById("colorSelect");
const result = document.getElementById("result");

select.addEventListener("change", () => {
  
  updateResult();
});

function updateResult() {
  const select = document.getElementById("colorSelect");
  const radios = document.querySelectorAll("input[name='sesso']");
  const checkboxes = document.querySelectorAll("input[name='sport']");
  const result = document.getElementById("result");

  const value = select.value;
  if (value) {
    result.textContent = `Hai Selezionato: ${value}`;
  } else {
    result.textContent = "Seleziona...";
  }

  // Colore
  const colore = select.value || "Nessuno";

  // Radio
  let sesso = "Nessuno";
  radios.forEach(radio => {
    if (radio.checked) sesso = radio.value;
  });

  // Checkbox multipli
  const sport = [];
  checkboxes.forEach(cb => {
    if (cb.checked) sport.push(cb.value);
  });
  const sportText = sport.length > 0 ? sport.join(", ") : "Nessuno";

  // Mostra risultato
  result.innerHTML = `
    <strong>Colore:</strong> ${colore}<br>
    <strong>Sesso:</strong> ${sesso}<br>
    <strong>Sport preferiti:</strong> ${sportText}
  `;
}