// =======================================================
// logicaecontrolli.js
// - Regole di visibilità UI basate su "occupazione"
// - Validazioni (netto mensile, dati input)
// - Creazione oggetto "persona" a partire dal DOM
// - Calcoli di supporto (replica formule Excel) per il netto assistito
// NOTE:
// - Refactor MINIMO: commenti estesi, spaziatura, micro-guard,
//   helper di parsing numerico, selettori scopi/ARIA dove sensato.
// - Nessuna rinomina di ID/variabili/funzioni esistenti.
// =======================================================



/**
 * Helper: converte una stringa in numero gestendo formati "italiani" tipo "1.234,56".
 * Non modifica variabili esistenti: è solo un util locale per ridurre duplicazioni.
 * @param {string|number|null|undefined} value
 * @returns {number} NaN se non convertibile
 */
function parseEuroLikeNumber(value) {
  const raw = String(value ?? "").trim();
  if (raw === "") return NaN;
  // Esempi: "1.000,50" -> "1000.50"
  return Number(raw.replace(/\./g, "").replace(",", "."));
}



/**
 * ---------------------------------------------------
 * 🔄 LOGICA DI VISIBILITÀ BASATA SU OCCUPAZIONE
 * - "Dipendente pubblico" → nasconde solo la colonna riga3-col2 (Anzianità)
 * - "Pensionato"          → nasconde tutta la riga3
 * - "Dipendente privato"  → mostra tutto
 * ---------------------------------------------------
 */
export function logicavisibilita() {
  const selectOccupazione = document.getElementById("select-occupazione");
  const colAnzianita = document.getElementById("riga3-col2");
  const riga3Element = document.getElementById("riga3");

  // Se gli elementi non esistono ancora, esci senza rompere nulla
  if (!selectOccupazione || !colAnzianita || !riga3Element) {
    console.warn("[logicavisibilita] elementi DOM non trovati; hai chiamato logicavisibilita() prima di creasimulatore()?");
    return;
  }

  // Handler che applica le regole di visibilità in base al testo visibile dell'opzione selezionata
  const applyRules = () => {
    const selected = selectOccupazione.options[selectOccupazione.selectedIndex]?.text || "";

    // Reset: mostra tutto
    colAnzianita.style.display = "flex";
    riga3Element.style.display = "flex";

    if (selected === "Dipendente pubblico") {
      // Nascondi solo colonna anzianità
      colAnzianita.style.display = "none";
    } else if (selected === "Pensionato") {
      // Nascondi tutta riga 3
      riga3Element.style.display = "none";
    }
    // "Dipendente privato" → lascia tutto visibile
  };

  // Applica subito le regole allo stato corrente
  applyRules();

  // Evita di aggiungere listener multipli se la funzione viene richiamata più volte
  if (!selectOccupazione.dataset._logicavisibilitaBound) {
    selectOccupazione.addEventListener("change", applyRules);
    selectOccupazione.dataset._logicavisibilitaBound = "1";
  }
}



/**
 * 🔎 LOGICA DI VALIDAZIONE: controllo del netto mensile
 * - Se `requireNonEmpty` è true, il campo vuoto genera errore (es. al click su "Calcola")
 * - Controlla che il numero (normalizzato) sia ≥ 250
 *
 * @param {HTMLInputElement} [el] - input opzionale; se assente viene cercato nel DOM
 * @param {{requireNonEmpty?: boolean}} [options]
 * @returns {boolean} true se il valore è accettabile (o vuoto quando non richiesto), altrimenti false
 */
export function controllaValoreNetto(el, { requireNonEmpty = false } = {}) {
  const inputValore =
    el ||
    (document.getElementById("contenitore")?.querySelector("#input-valore")) ||
    document.getElementById("input-valore");

  if (!inputValore) {
    console.warn("[controllaValoreNetto] input #input-valore non trovato!");
    return false;
  }

  const raw = String(inputValore.value ?? "").trim();
  console.log("[controllaValoreNetto] valore letto:", `"${raw}"`);

  // Campo vuoto: alert SOLO se richiesto (es. al click del bottone)
  if (raw === "") {
    if (requireNonEmpty) {
      alert("❌ Inserisci il netto mensile!");
      inputValore.focus();
      return false;
    }
    // Su blur/non-strict non blocca
    return true;
  }

  // Normalizza e controlla > 250
  const numero = parseEuroLikeNumber(raw);
  if (!Number.isNaN(numero) && numero < 250) {
    alert("❌ Il netto mensile deve essere maggiore di 250!");
    inputValore.focus();
    return false;
  }

  return true;
}



/**
 * Verifica i dati di input in base alle regole di business per "occupazione".
 * Regole:
 * - Privato      → Durata selezionata + tutte e 3 le select di riga3 valorizzate
 * - Pubblico     → Durata selezionata + anno di nascita + firma digitale
 * - Pensionato   → Solo durata selezionata
 *
 * @param {HTMLElement} [contenitore]
 * @returns {boolean}
 */
export function verificadatiinput(contenitore) {
  // 1) Risolvo il contenitore
  const root = contenitore || document.getElementById("contenitore");

  if (!root) {
    console.warn("[verificadatiinput] #contenitore non trovato.");
    alert("non hai compilato tutti i campi!!");
    return false;
  }

  // 2) Selettori utili (scopo: root)
  const selOccupazione = root.querySelector("#select-occupazione");
  const selAnno        = root.querySelector("#select-anno-nascita");
  const selAnz         = root.querySelector("#select-anzianita-datore");
  const selFirma       = root.querySelector("#select-firma-digitale");

  if (!selOccupazione) {
    console.warn("[verificadatiinput] #select-occupazione non trovato.");
    alert("non hai compilato tutti i campi!!");
    return false;
  }

  // 3) Helper: è stato selezionato un anno (3–10) in riga2?
  const isDurataSelezionata = () => {
    // Nota: limitiamo la ricerca a root per evitare conflitti con altri widget
    const attivo = root.querySelector('#durata-buttons .btn-year.active, #durata-buttons .btn-year[aria-pressed="true"]');
    return !!attivo;
  };

  // 4) Valori correnti
  const occupazione = (selOccupazione.value || "").trim(); // "dipendente-privato" | "dipendente-pubblico" | "pensionato"
  const annoVal  = selAnno  ? selAnno.value.trim()  : "";
  const anzVal   = selAnz   ? selAnz.value.trim()   : "";
  const firmaVal = selFirma ? selFirma.value.trim() : "";

  // 5) Logica richiesta
  if (occupazione === "dipendente-privato") {
    // Deve: (a) durata selezionata, (b) tutte e 3 le select di riga3 valorizzate
    const okDurata = isDurataSelezionata();
    const okRiga3  = (annoVal !== "" && anzVal !== "" && firmaVal !== "");
    if (!okDurata || !okRiga3) {
      alert("non hai compilato tutti i campi!!");
      return false;
    }
    return true;
  }

  if (occupazione === "dipendente-pubblico") {
    // Deve: (a) durata selezionata, (b) anno di nascita e firma digitale valorizzati
    const okDurata = isDurataSelezionata();
    const okRiga3  = (annoVal !== "" && firmaVal !== "");
    if (!okDurata || !okRiga3) {
      alert("non hai compilato tutti i campi!!");
      return false;
    }
    return true;
  }

  if (occupazione === "pensionato") {
    // Deve: solo durata selezionata
    const okDurata = isDurataSelezionata();
    if (!okDurata) {
      alert("non hai compilato tutti i campi!!");
      return false;
    }
    return true;
  }

  // Occupazione non prevista → per sicurezza richiedi compilazione
  alert("non hai compilato tutti i campi!!");
  return false;
}



/**
 * Estrae i valori dal DOM e costruisce l’oggetto persona.
 * Mantiene le stesse chiavi/nomi come da tua richiesta.
 *
 * @returns {Object} Oggetto con i campi richiesti
 */
export function creazioneOgettoPersona() {
  const root = document.getElementById("contenitore") || document;

  // 1) tipo dipendente (stringa): select prima riga, colonna 1
  const tipoDipendente = root.querySelector("#select-occupazione")?.value || "";

  // 2) tipo contratto (stringa): select prima riga, colonna 2
  const tipoContratto = root.querySelector("#select-contratto")?.value || "";

  // 3) Netto mensile (intero): input prima riga, colonna 3
  const nettoRaw = root.querySelector("#input-valore")?.value?.trim() ?? "";
  let nettoMensile = null;
  if (nettoRaw !== "") {
    const n = parseEuroLikeNumber(nettoRaw);
    nettoMensile = Number.isFinite(n) ? Math.trunc(n) : null; // intero
  }

  // 4) Numero anni (numero sopra al bottone attivo in riga 2)
  let numeroAnni = null;
  const btnAttivo = root.querySelector(
    '#durata-buttons .btn-year.active, #durata-buttons .btn-year[aria-pressed="true"]'
  );
  if (btnAttivo) {
    const txt = btnAttivo.querySelector(".num")?.textContent ?? btnAttivo.textContent;
    const n = parseInt(txt, 10);
    numeroAnni = Number.isFinite(n) ? n : null;
  }

  // 5) Anno di nascita (stringa)
  const annoNascita = root.querySelector("#select-anno-nascita")?.value || "";

  // 6) Lavori da almeno 10 anni (si/no)
  const lavori10Anni = root.querySelector("#select-anzianita-datore")?.value || "";

  // 7) Sei interessato alla firma digitale (si/no)
  const firmaDigitale = root.querySelector("#select-firma-digitale")?.value || "";

  // 🔁 Oggetto finale con i campi richiesti (nomi come da tua richiesta)
  return {
    "tipo dipendente": tipoDipendente,                   // stringa
    "tipo contratto": tipoContratto,                     // stringa
    "Netto mensile": nettoMensile,                       // intero (o null)
    "Numero anni": numeroAnni,                           // numero (o null)
    "anno di nascita": annoNascita,                      // stringa
    "Lavori da almeno 10 anni": lavori10Anni,            // "si" | "no" | ""
    "sei interessato alla firma digitale": firmaDigitale // "si" | "no" | ""
  };
}



/* ===============================
   Helpers finanziari (replica Excel)
   =============================== */

/**
 * pv (Present Value) in stile Excel.
 * rate: tasso per periodo
 * nper: numero periodi
 * pmt:  rata per periodo (flusso uscente, convenzione Excel)
 * fv:   valore futuro (default 0)
 * type: 0 = posticipata (default), 1 = anticipata
 *
 * @param {number} rate
 * @param {number} nper
 * @param {number} pmt
 * @param {number} [fv=0]
 * @param {0|1} [type=0]
 * @returns {number}
 */
function pv(rate, nper, pmt, fv = 0, type = 0) {
  if (rate === 0) return -(pmt * nper + fv);
  const r1 = Math.pow(1 + rate, nper);
  return - (pmt * (1 + rate * type) * (r1 - 1) / rate + fv) / r1;
}



/**
 * Funzione principale (versione con formule del SIMULATORE)
 * - Valida il netto mensile (>= 250)
 * - Calcola rata minima, massima ed effettiva secondo le specifiche progetto
 * - Applica un TAN per categoria e replica alcune formule Excel
 * - Aggiorna UI (input rata, span min/max) e ritorna un riepilogo dei calcoli
 *
 * @param {HTMLElement} [contenitore]
 * @returns {object|null} Oggetto risultato o null in caso di errore/invalidità
 */
export function elaboraNettoAssist(contenitore) {
  const root = contenitore || document.getElementById("contenitore") || document;

  // 1) Controllo input netto mensile (>= 250)
  const inputNetto = root.querySelector("#input-valore");
  if (!inputNetto) {
    console.warn("[elaboraNettoAssist] #input-valore non trovato.");
    alert("Campo del netto mensile non trovato!");
    return null;
  }

  const raw = String(inputNetto.value ?? "").trim();
  const nettoMensile = parseEuroLikeNumber(raw);

  if (!Number.isFinite(nettoMensile) || nettoMensile < 250) {
    alert("Inserisci un valore di 250 € o superiore!");
    inputNetto.focus();
    return null;
  }

  // 2) Lettura opzioni riga 1
  const tipoDipendente = (root.querySelector("#select-occupazione")?.value || "").trim(); // "dipendente-privato" | "dipendente-pubblico" | "pensionato"
  const tipoContratto  = (root.querySelector("#select-contratto")?.value || "").trim();   // "indeterminato" | "determinato"

  // 3) Calcolo rata minima/massima/effettiva (specifiche progetto)
  const RATA_MINIMA = 50;
  const rataMassima = nettoMensile * 0.20;

  let coefficiente = 1.0;
  if (tipoDipendente === "dipendente-privato") {
    coefficiente = (tipoContratto === "indeterminato") ? 1.0 : 0.8;
  } else if (tipoDipendente === "dipendente-pubblico") {
    coefficiente = 1.1;
  } else if (tipoDipendente === "pensionato") {
    coefficiente = 0.9;
  }

  const rataMensileEffettiva = Math.max(RATA_MINIMA, rataMassima * coefficiente);

  // 4) Parametri “alla Excel” (dal file): Durata e TAN per categoria
  const DURATA_MESI = 120; // C9 = 120 in tutti i fogli
  // TAN per categoria (C11). "Pensionato" non presente nel foglio: uso 9,90% come fallback.
  const tanPerCategoria = {
    "dipendente-privato": 0.1115,   // CQS DIPENDENTE PRIVATO!C11
    "dipendente-pubblico": 0.0715,  // CQS DIPENDENTE PUBBLICO-STATALE!C11
    "pensionato": 0.0990            // fallback (adatta se hai un TAN dedicato)
  };
  const tan = tanPerCategoria[tipoDipendente] ?? 0.0990;
  const rateMensile = tan / 12;

  // 5) Formule Excel replicate:
  //    C19 = -PV(C11/12, C9, C7, 0)
  const capitaleFinanziabile = -pv(rateMensile, DURATA_MESI, rataMensileEffettiva, 0, 0); // ≈ C19
  //    C15 = C7 * C9
  const totaleVersato = rataMensileEffettiva * DURATA_MESI;                                // ≈ C15
  //    C17 = C15 - C19
  const interessiTotali = totaleVersato - capitaleFinanziabile;                             // ≈ C17

  //    C23 = C19 - C21 (qui C21 sconosciuto -> assumo 0; collega quando lo avrai)
  const costiSpeseAssicurazione = 0; // TODO: sostituisci con valore reale (C21)
  const nettoRicavo = capitaleFinanziabile - costiSpeseAssicurazione;                       // ≈ C23

  // 6) Scrivi la rata nell’input riga2/col1
  const inputRata = root.querySelector("#riga2-col1 #input-rata");
  if (inputRata) inputRata.value = String(Math.round(rataMensileEffettiva));

  // 7) Aggiorna gli span con i valori a capo
  const spanMin = root.querySelector("#rata-minima");
  const spanMax = root.querySelector("#rata-massima");

  const fmtEUR = (n) =>
    Number(n).toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  if (spanMin) {
    spanMin.innerHTML = `Rata minima:<br>${fmtEUR(RATA_MINIMA)}`;
  }
  if (spanMax) {
    spanMax.innerHTML = `Rata massima:<br>${fmtEUR(Math.round(rataMassima))}`;
  }

  // 8) Oggetto risultato (input + output), arrotondo dove sensato
  const risultato = {
    // INPUT
    tipoDipendente,
    tipoContratto,
    nettoMensile: Math.trunc(nettoMensile),

    // PARAMETRI EXCEL
    durataMesi: DURATA_MESI,
    tanContratto: tan,

    // OUTPUT (progetto)
    rataMinima: RATA_MINIMA,
    rataMassima: Math.round(rataMassima),
    coefficiente,
    rataMensileEffettiva: Math.round(rataMensileEffettiva),

    // OUTPUT (formule Excel)
    capitaleFinanziabile: Math.round(capitaleFinanziabile),
    totaleVersato: Math.round(totaleVersato),
    interessiTotali: Math.round(interessiTotali),
    nettoRicavo: Math.round(nettoRicavo),
  };

  console.log("▶️ Risultato calcolo (formule Excel replicate):", risultato);
  return risultato;
}






// riepilogoSimulazione.js
// Funzione adeguata al progetto "creasimulatore" (usa #contenitore se presente)
// - base: display none
// - se visible=false → esce
// - se visible=true → inietta stili, crea struttura 6 colonne, rende visibile
export function mostraRiepilogoSimulazione(
  visible,
  mount = (document.getElementById("contenitore") || document.body)
) {
  if (!visible) return;

  // Inietta dinamicamente gli stili (una sola volta)
  const styleId = "riepilogo-simulazione-styles";
  if (!document.getElementById(styleId)) {
    const css = `
      /* Container con gradiente coerente col progetto */
      #riepilogo-simulazione {
        display: none; /* base nascosto */
        width: 100%;
        box-sizing: border-box;
        padding: 28px;
        border-radius: 12px;
        color: #fff;
        margin-top: 50px;
        background: linear-gradient(90deg, #2fb3c6 0%, #2d69a6 45%, #3a4b8d 70%, #56357b 100%);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans';
      }
      #riepilogo-simulazione .row {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 28px;
        flex-wrap: wrap;
      }
      #riepilogo-simulazione .col {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 160px;
        box-sizing: border-box;
      }
      /* Coerenza visiva con .label del progetto */
      #riepilogo-simulazione .lbl-top {
        font-size: 14px;
        opacity: .9;
      }
      #riepilogo-simulazione .lbl-bottom {
        font-size: 32px;
        font-weight: 700;
        line-height: 1.1;
      }
      @media (max-width: 900px){
        #riepilogo-simulazione .lbl-bottom { font-size: 26px; }
        #riepilogo-simulazione .col { min-width: 45%; }
      }
      @media (max-width: 560px){
        #riepilogo-simulazione .col { min-width: 100%; }
      }
    `;
    const style = document.createElement("style");
    style.id = styleId;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // Crea o recupera il container
  let container = document.getElementById("riepilogo-simulazione");
  if (!container) {
    container = document.createElement("div");
    container.id = "riepilogo-simulazione";
    container.style.display = "none"; // base: hidden
    mount.appendChild(container);

    const row = document.createElement("div");
    row.className = "row";
    container.appendChild(row);

    // Helper: colonna con due label (titolo + valore con id)
    const makeCol = (title, valueId, valueText = "") => {
      const col = document.createElement("div");
      col.className = "col";

      const top = document.createElement("label");
      top.className = "lbl-top";
      top.textContent = title;

      const bottom = document.createElement("label");
      bottom.className = "lbl-bottom";
      bottom.id = valueId;
      bottom.textContent = valueText;

      col.appendChild(top);
      col.appendChild(bottom);
      return col;
    };

    // 1) Importo rata (numero + €)
    row.appendChild(makeCol("Importo rata", "val-importo-rata", "0 €"));
    // 2) Numero rate (numero)
    row.appendChild(makeCol("Numero rate", "val-numero-rate", "0"));
    // 3) Importo totale del credito (numero + €)
    row.appendChild(makeCol("Importo totale del credito", "val-importo-totale", "0 €"));
    // 4) TAN (numero + %)
    row.appendChild(makeCol("TAN", "val-tan", "0%"));
    // 5) TAEG (numero + %)
    row.appendChild(makeCol("TAEG", "val-taeg", "0%"));
    // 6) Div aggiuntivo vuoto (come richiesto)
    const emptyCol = document.createElement("div");
    emptyCol.className = "col";
    row.appendChild(emptyCol);
  }

  // Rendi visibile il riepilogo
  container.style.display = "block";
}









// calcoloFinanziamento.js
// Calcola i valori di riepilogo a partire dall'oggetto persona del progetto "creasimulatore".
export function calcolaFinanziamentoDaPersona(persona) {
  // ---- Lettura campi dall'oggetto persona (nomi/chiavi come da tua struttura) ----
  const tipoDipendente = (persona?.["tipo dipendente"] || "").trim();      // "dipendente-privato" | "dipendente-pubblico" | "pensionato"
  const tipoContratto  = (persona?.["tipo contratto"] || "").trim();       // "indeterminato" | "determinato"
  const nettoMensile   = Number(persona?.["Netto mensile"] ?? NaN);        // intero o NaN
  const anni           = Number(persona?.["Numero anni"] ?? NaN);          // es. 3..10

  // ---- Validazioni minime coerenti col progetto ----
  if (!Number.isFinite(nettoMensile) || nettoMensile < 250) {
    console.warn("[calcolaFinanziamentoDaPersona] Valore netto non valido:", nettoMensile);
    return null;
  }

  // ---- Parametri di progetto ----
  const RATA_MINIMA = 50;
  const coefficiente = (() => {
    if (tipoDipendente === "dipendente-privato") {
      return (tipoContratto === "indeterminato") ? 1.0 : 0.8;
    }
    if (tipoDipendente === "dipendente-pubblico") return 1.1;
    if (tipoDipendente === "pensionato") return 0.9;
    return 1.0; // fallback neutro
  })();

  // Durata: usa gli anni scelti, altrimenti default 120 mesi (10 anni)
  const numeroRate = Number.isFinite(anni) ? Math.max(1, Math.trunc(anni * 12)) : 120;

  // TAN per categoria (nominale annuo)
  const tanMap = {
    "dipendente-privato": 0.1115,
    "dipendente-pubblico": 0.0715,
    "pensionato": 0.0990,
  };
  const tan = tanMap[tipoDipendente] ?? 0.0990; // fallback pensionato
  const rateMensile = tan / 12;

  // ---- Calcoli progetto ----
  const rataMassima = nettoMensile * 0.20;
  const rataEffettiva = Math.max(RATA_MINIMA, rataMassima * coefficiente);

  // Capitale finanziabile (PV di una rendita a rata costante, FV=0, pagamento a fine periodo)
  const capitaleFinanziabile = Math.max(0, Math.round(-pv(rateMensile, numeroRate, rataEffettiva, 0, 0)));

  // Importo totale versato (sommatoria rate)
  const totaleVersato = Math.round(rataEffettiva * numeroRate);

  // TAEG (APR effettivo annuo) senza costi
  const taeg = Math.pow(1 + rateMensile, 12) - 1;

  // ---- Oggetto risultato richiesto ----
  const finanziamento = {
    "importo rata": Math.round(rataEffettiva),                 // € / mese
    "numero rate": numeroRate,                                 // mesi
    "importo totale del credito": capitaleFinanziabile,        // € (capitale)
    "tan": +(tan * 100).toFixed(2),                            // % nominale annua
    "taeg": +(taeg * 100).toFixed(2),                          // % effettiva annua
  };

  // 🔍 Stampa in console per debug / verifica
  console.log("💰 Oggetto finanziamento creato:", finanziamento);

  return finanziamento;

  // ---------- Helper finanziario: PV ----------
  // Coerente con Excel: PV(rate, nper, pmt, fv = 0, type = 0)
  function pv(rate, nper, pmt, fv = 0, type = 0) {
    if (rate === 0) {
      return -(pmt * nper + fv);
    }
    const factor = Math.pow(1 + rate, nper);
    return -(
      (pmt * (1 + rate * type) * (1 - 1 / factor)) / rate +
      fv / factor
    );
  }
}



// riepilogoBinding.js
// Popola i campi del riepilogo con i valori dell'oggetto finanziamento
export function popolaRiepilogo(finanziamento, root = document) {
  if (!finanziamento || typeof finanziamento !== "object") {
    console.warn("[popolaRiepilogo] Oggetto finanziamento non valido:", finanziamento);
    return;
  }

  // Verifica che il riepilogo esista
  const container = root.getElementById("riepilogo-simulazione");
  if (!container) {
    console.warn("[popolaRiepilogo] #riepilogo-simulazione non trovato. Crea prima il riepilogo con mostraRiepilogoSimulazione(true).");
    return;
  }

  // Helper di formattazione
  const fmtEUR0 = (n) =>
    Number(n).toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const fmtPCT = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return "";
    return `${num.toFixed(2)}%`;
  };

  // Estrai i campi dall'oggetto finanziamento (con fallback sicuri)
  const importoRata = finanziamento["importo rata"];
  const numeroRate = finanziamento["numero rate"];
  const importoTotale = finanziamento["importo totale del credito"];
  const tan = finanziamento["tan"];   // già percentuale (es. 11.15)
  const taeg = finanziamento["taeg"]; // già percentuale (es. 11.80)

  // Aggiorna i nodi (label in basso con id)
  const setText = (id, value) => {
    const el = root.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("val-importo-rata", Number.isFinite(+importoRata) ? fmtEUR0(importoRata) : "");
  setText("val-numero-rate", Number.isFinite(+numeroRate) ? String(Math.trunc(numeroRate)) : "");
  setText("val-importo-totale", Number.isFinite(+importoTotale) ? fmtEUR0(importoTotale) : "");
  setText("val-tan", Number.isFinite(+tan) ? fmtPCT(tan) : "");
  setText("val-taeg", Number.isFinite(+taeg) ? fmtPCT(taeg) : "");
}


