// logic.js

//Funzione che mette in un oggetto tutti i dati del form
export function prendiDatiForm() {
  let dati=new Object();
  dati.tipodipendente = document.getElementById("tipodipendente")?.value || ""
  
  return {
    tipodipendente: document.getElementById("tipodipendente")?.value || "",
    tipocontratto: document.getElementById("tipocontratto")?.value || "",
    nettomensile: document.getElementById("nettomensile")?.value || ""
  };
}

export function gestisciSelezioneTipoDipendente() {
  const select = document.getElementById("tipodipendente");
  if (!select) return;

  select.addEventListener("change", () => {
    const value = select.value.toLowerCase().replace(/\s+/g, '');
    const divterzo = document.getElementById("terzo");
    const minmax = document.getElementById("minmax");
    const div10anni = document.getElementById("lavoro10anni");

    div10anni.style.display = "block";
    divterzo.style.display = "block";
    minmax.style.display = "block";

    if (value === "pensionato") {
      divterzo.style.display = "none";
      minmax.style.display = "none";
    }
    if (value === "dipendentepubblico") {
      div10anni.style.display = "none";
    }
  });
}

export function gestisciEventoCambioNettoMensile() {
  const input = document.getElementById("nettomensile");
  if (!input) return;

  input.addEventListener("change", () => 
    {
      const datiForm =  prendiDatiForm()
      console.log("Ricalc JS: "+datiForm);
      console.log("Ricalc JSON: "+JSON.stringify(datiForm));
      calcolaRataConsigliata(datiForm);
    }
  );
}

function calcolaRataConsigliata(datiForm){
  const min = 100;
  const max = 10000;

  const netto = Number(datiForm.nettomensile);

  const numeroCasuale = Math.floor(Math.random() * (max - min + 1)) + min;

  console.log(numeroCasuale);
  document.getElementById("rataconsigliata").value = numeroCasuale;
}