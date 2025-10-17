// =======================================================
// creasimulatore()
// Costruisce dinamicamente l'interfaccia del simulatore:
// - Riga 1: Occupazione, Contratto, Reddito netto
// - Riga 2: Rata desiderata, Durata (3–10 anni) con pulsanti esclusivi
// - Riga 3: Anno di nascita, Anzianità presso datore, Firma digitale
// NOTE:
// - Le funzioni importate sono definite in altri file (non svilupparle qui).
// - Refactor MINIMO: bugfix riga3 width, input numerici, ARIA radiogroup/aria-checked,
//   guard contro duplicazione UI, commenti dettagliati e spaziatura.
// =======================================================
import { controllaValoreNetto, verificadatiinput, creazioneOgettoPersona, elaboraNettoAssist,mostraRiepilogoSimulazione,calcolaFinanziamentoDaPersona,popolaRiepilogo } from "./logicaecontrolli.js";



export function creasimulatore() {
  // ---------------------------------------------------
  // GUARD: evita di creare duplicati se la funzione è richiamata più volte.
  // Se esiste già il contenitore, esci (refactor minimo: nessun reset/destroy).
  // ---------------------------------------------------
  if (document.getElementById("contenitore")) {
    return;
  }



  // ---------------------------------------------------
  // CONTENITORE PRINCIPALE
  // ---------------------------------------------------
  const contenitore = document.createElement("div");
  contenitore.id = "contenitore";
  document.body.appendChild(contenitore);



  // ---------------------------------------------------
  // RIGA 1 — Tre colonne:
  // 1) Occupazione (select)
  // 2) Contratto (select)
  // 3) Netto mensile (input)
  // ---------------------------------------------------
  const riga1 = document.createElement("div");
  riga1.id = "riga1";
  riga1.style.display = "flex";
  riga1.style.gap = "20px";
  riga1.style.marginTop = "20px";
  contenitore.appendChild(riga1);

  // Costruzione generica delle 3 colonne della riga 1
  for (let i = 0; i < 3; i++) {
    const cella = document.createElement("div");
    cella.id = `primarigadiv-${i + 1}`; // primarigadiv-1 / -2 / -3
    cella.style.display = "flex";
    cella.style.flexDirection = "column";
    cella.style.alignItems = "flex-start";
    cella.style.justifyContent = "flex-start";
    cella.style.flex = "1";

    // --- Colonna 1: Occupazione ---
    if (i === 0) {
      const label = document.createElement("label");
      label.textContent = "Di cosa ti occupi?";
      label.setAttribute("for", "select-occupazione");
      label.classList.add("label");

      const select = document.createElement("select");
      select.id = "select-occupazione";
      select.classList.add("select");

      // NOTE: refactor minimo → manteniamo la stessa lista e gli stessi id.
      const opzioni = [
        { text: "Dipendente privato", id: "opt-privato" },
        { text: "Dipendente pubblico", id: "opt-pubblico" },
        { text: "Pensionato", id: "opt-pensionato" },
      ];

      opzioni.forEach((o) => {
        const opt = document.createElement("option");
        opt.id = o.id; // opt-pubblico / opt-privato / opt-pensionato

        // Manteniamo la stessa logica, ma con sostituzione più robusta degli spazi
        // (senza cambiare il nome di variabili/id esistenti).
        opt.value = o.text.toLowerCase().replace(/\s+/g, "-");
        opt.textContent = o.text;

        select.appendChild(opt);
      });

      cella.appendChild(label);
      cella.appendChild(select);
    }

    // --- Colonna 2: Contratto ---
    else if (i === 1) {
      const label = document.createElement("label");
      label.textContent = "Qual è il tuo contratto?";
      label.classList.add("label");
      label.setAttribute("for", "select-contratto");

      const select = document.createElement("select");
      select.id = "select-contratto";
      select.classList.add("select");

      const opzioni = [
        { text: "Indeterminato", id: "opt-indeterminato" },
        { text: "Determinato", id: "opt-determinato" },
      ];

      opzioni.forEach((o) => {
        const opt = document.createElement("option");
        opt.id = o.id; // opt-indeterminato / opt-determinato
        opt.value = o.text.toLowerCase();
        opt.textContent = o.text;
        select.appendChild(opt);
      });

      cella.appendChild(label);
      cella.appendChild(select);
    }

    // --- Colonna 3: Reddito netto mensile ---
    else {
      const label = document.createElement("label");
      label.textContent = "Indica il tuo netto mensile:";
      label.classList.add("label");
      label.setAttribute("for", "input-valore");

      // Wrapper orizzontale per input + bottone assistenza
      const inputGroup = document.createElement("div");
      inputGroup.style.display = "flex";
      inputGroup.style.alignItems = "center";
      inputGroup.style.gap = "10px";
      inputGroup.style.marginTop = "5px";

      // Input netto mensile (refactor minimo: passaggio a input numerico per UX/validazione nativa)
      const input = document.createElement("input");
      input.type = "number";       // <— prima era "text"
      input.inputMode = "decimal";
      input.min = "0";
      input.step = "1";            // se servono i centesimi, usare "0.01"
      input.id = "input-valore";   // input del netto mensile
      input.placeholder = "Scrivi qui...";
      input.classList.add("input");

      // Tastino accanto all’input (usa funzione esterna elaboraNettoAssist)
      const btnNettoAssist = document.createElement("button");
      btnNettoAssist.type = "button";
      btnNettoAssist.id = "btn-netto-assist"; // 👈 id per eventi futuri
      btnNettoAssist.setAttribute("aria-label", "Assistenza netto mensile");
      btnNettoAssist.title = "Assistenza netto mensile";
      btnNettoAssist.textContent = ">";

      // Stile minimo inline (resta spostabile nel tuo CSS)
      btnNettoAssist.style.width = "25px";
      btnNettoAssist.style.height = "25px";
      btnNettoAssist.style.borderRadius = "50%";
      btnNettoAssist.style.border = "1px solid #999";
      btnNettoAssist.style.background = "#fff";
      btnNettoAssist.style.color = "#1e90ff";
      btnNettoAssist.style.cursor = "pointer";
      btnNettoAssist.style.fontWeight = "700";
      btnNettoAssist.style.lineHeight = "1";

      // Montaggio
      inputGroup.appendChild(input);
      inputGroup.appendChild(btnNettoAssist);
      cella.appendChild(label);
      cella.appendChild(inputGroup);

      // Validazione sul blur dell'input (funzione esterna)
      input.addEventListener("blur", controllaValoreNetto);

      // Click del pulsante di assistenza (funzione esterna)
      btnNettoAssist.addEventListener("click", () => {
        const risultato = elaboraNettoAssist(contenitore);
        // opzionale: usare 'risultato' qui se necessario
        // console.log("Oggetto restituito:", risultato);
      });
    }

    // Append della cella alla riga 1
    riga1.appendChild(cella);
  }



  // ---------------------------------------------------
  // RIGA 2 — Due colonne:
  // 1) Rata mensile desiderata (input)
  // 2) Durata (3–10 anni) tramite pulsanti circolari esclusivi
  // ---------------------------------------------------
  const riga2 = document.createElement("div");
  riga2.id = "riga2";
  riga2.style.display = "flex";
  riga2.style.gap = "210px";
  riga2.style.marginTop = "50px";
  riga2.style.width = "100%";
  riga2.style.justifyContent = "flex-start";
  riga2.style.alignItems = "flex-start";
  contenitore.appendChild(riga2);

  // --- riga2 / colonna 1: Rata mensile (input) ---
  const r2col1 = document.createElement("div");
  r2col1.id = "riga2-col1";
  r2col1.style.display = "flex";
  r2col1.style.flexDirection = "column";
  r2col1.style.alignItems = "flex-start";
  r2col1.style.justifyContent = "flex-start";
  r2col1.style.gap = "8px";
  r2col1.style.flex = "unset";

  const lblRata = document.createElement("label");
  lblRata.textContent = "Che rata mensile vorresti?";
  lblRata.classList.add("label");
  lblRata.setAttribute("for", "input-rata");

  // Input rata desiderata (refactor minimo: numerico)
  const inputRata = document.createElement("input");
  inputRata.type = "number";   // <— prima era "text"
  inputRata.inputMode = "numeric";
  inputRata.min = "0";
  inputRata.step = "1";
  inputRata.id = "input-rata"; // input rata desiderata
  inputRata.placeholder = "Es. 350";
  inputRata.classList.add("input");

  // Contenitore per i due span (disposti ai lati)
  const spanContainer = document.createElement("div");
  spanContainer.style.display = "flex";
  spanContainer.style.justifyContent = "space-between"; // estremi
  spanContainer.style.width = "100%";
  spanContainer.style.marginTop = "5px";

  // Span sinistro → rata minima (testo dinamico o provvisorio)
  const spanMin = document.createElement("span");
  spanMin.id = "rata-minima";
  spanMin.textContent = "Rata minima: ";
  spanMin.style.fontSize = "14px";
  spanMin.style.color = "#fffdfdff";

  // Span destro → rata massima (testo dinamico o provvisorio)
  const spanMax = document.createElement("span");
  spanMax.id = "rata-massima";
  spanMax.textContent = "Rata massima: ";
  spanMax.style.fontSize = "14px";
  spanMax.style.color = "#ffffffff";

  // Montaggio elementi colonna 1
  spanContainer.appendChild(spanMin);
  spanContainer.appendChild(spanMax);
  r2col1.appendChild(lblRata);
  r2col1.appendChild(inputRata);
  r2col1.appendChild(spanContainer);

  // --- riga2 / colonna 2: Durata (pulsanti 3–10 anni) ---
  const r2col2 = document.createElement("div");
  r2col2.id = "riga2-col2";
  r2col2.style.display = "flex";
  r2col2.style.flexDirection = "column";
  r2col2.style.alignItems = "flex-start";
  r2col2.style.justifyContent = "flex-start";
  r2col2.style.gap = "12px";
  r2col2.style.flex = "unset";

  const lblDurata = document.createElement("label");
  lblDurata.textContent = "Quanto vorresti che durasse?";
  lblDurata.classList.add("label");

  // Aggiungiamo un id all'etichetta per collegarla al radiogroup (a11y)
  const lblDurataId = "lbl-durata";
  lblDurata.id = lblDurataId;

  const btnWrap = document.createElement("div");
  btnWrap.id = "durata-buttons"; // wrapper dei bottoni anni

  // Layout pulsanti
  btnWrap.style.display = "flex";
  btnWrap.style.flexWrap = "wrap";
  btnWrap.style.gap = "34px";

  // Aggiunte ARIA per accessibilità: radiogroup collegato all'etichetta
  btnWrap.setAttribute("role", "radiogroup");
  btnWrap.setAttribute("aria-labelledby", lblDurataId);

  // Pulsanti anni 3–10 (mutuamente esclusivi)
  for (let year = 3; year <= 10; year++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = `btn-anni-${year}`; // es: btn-anni-3 ... btn-anni-10
    btn.className = "btn-year";

    // Stato ARIA per comportamento tipo radio
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-checked", "false");

    // Contenuto (manteniamo innerHTML come nel tuo codice originale)
    btn.innerHTML = `<span class="num">${year}</span><span class="unit">anni</span>`;

    // Click: reset di tutti i bottoni e attiva solo quello cliccato
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-year").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-checked", "true");
    });

    btnWrap.appendChild(btn);
  }

  // Montaggio colonna 2
  r2col2.appendChild(lblDurata);
  r2col2.appendChild(btnWrap);

  // Montaggio riga 2
  riga2.appendChild(r2col1);
  riga2.appendChild(r2col2);



  // ---------------------------------------------------
  // RIGA 3 — Tre colonne (30% ciascuna + 10% gap totale):
  // 1) Anno di nascita (select anni)
  // 2) Anzianità presso datore (select: Selezione / si / no)
  // 3) Firma digitale (select: Selezione / si / no)
  // ---------------------------------------------------
  const riga3 = document.createElement("div");
  riga3.id = "riga3";
  riga3.style.display = "flex";
  riga3.style.flexWrap = "nowrap";
  riga3.style.justifyContent = "flex-start"; // nessuno spazio extra "nascosto"
  riga3.style.alignItems = "flex-start";
  riga3.style.width = "100%";
  riga3.style.marginTop = "40px";
  riga3.style.gap = "5%"; // 2 gap da 5% = 10% totale
  contenitore.appendChild(riga3);

  // Utility per colonna 30% calcolata: (100% - 10%) / 3
  const creaColonna = (id) => {
    const col = document.createElement("div");
    col.id = id;
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "flex-start";
    col.style.justifyContent = "flex-start";
    col.style.gap = "8px";

    // FIX: 10% di gap totale (prima era 20%)
    const colWidth = "calc((100% - 10%) / 3)";
    col.style.flex = `0 0 ${colWidth}`; // base fissa, no grow / no shrink
    col.style.maxWidth = colWidth;
    col.style.boxSizing = "border-box";
    return col;
  };

  const r3col1 = creaColonna("riga3-col1");
  const r3col2 = creaColonna("riga3-col2");
  const r3col3 = creaColonna("riga3-col3");

  // --- riga3 / colonna 1: Anno di nascita (select) ---
  const lblAnno = document.createElement("label");
  lblAnno.innerHTML = "Anno di<br>nascita";
  lblAnno.classList.add("label");
  lblAnno.setAttribute("for", "select-anno-nascita");

  const selAnno = document.createElement("select");
  selAnno.id = "select-anno-nascita";
  selAnno.classList.add("select");

  const optAnnoPlaceholder = document.createElement("option");
  optAnnoPlaceholder.id = "opt-anno-selezione";
  optAnnoPlaceholder.value = "";
  optAnnoPlaceholder.textContent = "Seleziona";
  optAnnoPlaceholder.disabled = true;
  optAnnoPlaceholder.selected = true;
  selAnno.appendChild(optAnnoPlaceholder);

  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 18; y >= currentYear - 100; y--) {
    const opt = document.createElement("option");
    opt.id = `opt-anno-${y}`; // es: opt-anno-1990
    opt.value = String(y);
    opt.textContent = String(y);
    selAnno.appendChild(opt);
  }

  r3col1.appendChild(lblAnno);
  r3col1.appendChild(selAnno);

  // --- riga3 / colonna 2: Anzianità presso datore (select) ---
  const lblAnz = document.createElement("label");
  lblAnz.innerHTML = "Lavori da almeno 10 anni presso<br>l'attuale datore di lavoro?";
  lblAnz.classList.add("label");
  lblAnz.setAttribute("for", "select-anzianita-datore");

  const selAnz = document.createElement("select");
  selAnz.id = "select-anzianita-datore";
  selAnz.classList.add("select");

  const optAnzSel = document.createElement("option");
  optAnzSel.id = "opt-anzianita-selezione";
  optAnzSel.value = "";
  optAnzSel.textContent = "Selezione";
  optAnzSel.disabled = true;
  optAnzSel.selected = true;

  const optAnzSi = document.createElement("option");
  optAnzSi.id = "opt-anzianita-si";
  optAnzSi.value = "si";
  optAnzSi.textContent = "si";

  const optAnzNo = document.createElement("option");
  optAnzNo.id = "opt-anzianita-no";
  optAnzNo.value = "no";
  optAnzNo.textContent = "no";

  selAnz.append(optAnzSel, optAnzSi, optAnzNo);
  r3col2.appendChild(lblAnz);
  r3col2.appendChild(selAnz);

  // --- riga3 / colonna 3: Firma digitale (select) ---
  const lblFirma = document.createElement("label");
  lblFirma.innerHTML = "Sei interessato alla firma digitale<br> per velocizzare la tua pratica?";
  lblFirma.classList.add("label");
  lblFirma.setAttribute("for", "select-firma-digitale");

  const selFirma = document.createElement("select");
  selFirma.id = "select-firma-digitale";
  selFirma.classList.add("select");

  const optFirmaSel = document.createElement("option");
  optFirmaSel.id = "opt-firma-selezione";
  optFirmaSel.value = "";
  optFirmaSel.textContent = "Selezione";
  optFirmaSel.disabled = true;
  optFirmaSel.selected = true;

  const optFirmaSi = document.createElement("option");
  optFirmaSi.id = "opt-firma-si";
  optFirmaSi.value = "si";
  optFirmaSi.textContent = "si";

  const optFirmaNo = document.createElement("option");
  optFirmaNo.id = "opt-firma-no";
  optFirmaNo.value = "no";
  optFirmaNo.textContent = "no";

  selFirma.append(optFirmaSel, optFirmaSi, optFirmaNo);
  r3col3.appendChild(lblFirma);
  r3col3.appendChild(selFirma);

  // Montaggio riga 3
  riga3.appendChild(r3col1);
  riga3.appendChild(r3col2);
  riga3.appendChild(r3col3);



  // ---------------------------------------------------
  // PULSANTE "Calcola rata"
  // - Resta fuori da #contenitore come nel tuo codice originale (afterend)
  // - Al click: valida input, verifica dati, crea oggetto persona
  // ---------------------------------------------------
  const button = document.createElement("button");
  button.id = "btn-calcola-rata";
  button.textContent = "Calcola rata";
  button.type = "button";
  button.classList.add("btn-calcola");

  // Inserimento subito sotto al contenitore
  contenitore.insertAdjacentElement("afterend", button);

  // Click handler: usa funzioni esterne importate
  button.addEventListener("click", () => {
    // Validazione del netto: richiede non-vuoto al click
    const okNetto = controllaValoreNetto(
      contenitore.querySelector("#input-valore"),
      { requireNonEmpty: true }
    );
    if (!okNetto) return;

    // Verifica dati in base alla business rule (occupazione/contratto/anno/firma, ecc.)
    const ok = verificadatiinput(contenitore);
    if (!ok) return;

    // Costruzione dell'oggetto persona (funzione esterna)
    const persona = creazioneOgettoPersona();
    const finanziamento=calcolaFinanziamentoDaPersona(persona);
    mostraRiepilogoSimulazione(ok);
    popolaRiepilogo(finanziamento);
    
    console.log("🧾 Oggetto persona:", persona);

    // Prosecuzione: qui potrai eseguire il calcolo rata usando 'persona'
  });
}



/* =======================================================
   🧭 RIEPILOGO ID E STRUTTURA
   -------------------------------------------------------
   #contenitore             → wrapper principale
   
   ├─ #riga1                → Di cosa ti occupi / Contratto / Netto mensile
   │   ├─ #primarigadiv-1   → "Di cosa ti occupi?" + #select-occupazione
   │   │    ├─ #opt-pubblico / #opt-privato / #opt-pensionato
   │   ├─ #primarigadiv-2   → "Qual è il tuo contratto?" + #select-contratto
   │   │    ├─ #opt-indeterminato / #opt-determinato
   │   └─ #primarigadiv-3   → "Indica il tuo netto mensile:" + #input-valore (+ #btn-netto-assist)

   ├─ #riga2                → Rata mensile / Durata anni
   │   ├─ #riga2-col1       → "Che rata mensile vorresti?"
   │   │    ├─ #input-rata       → campo input per la rata desiderata
   │   │    ├─ #rata-minima      → span sinistro (valore minimo)
   │   │    └─ #rata-massima     → span destro (valore massimo)
   │   └─ #riga2-col2       → "Quanto vorresti che durasse?"
   │        ├─ #durata-buttons   → contenitore pulsanti #btn-anni-3 … #btn-anni-10 (.btn-year)
   │        │    → pulsante attivo: .active + aria-pressed="true" + aria-checked="true"

   └─ #riga3                → Anno nascita / Anzianità / Firma digitale
        ├─ #riga3-col1      → #select-anno-nascita + #opt-anno-XXXX
        ├─ #riga3-col2      → #select-anzianita-datore + #opt-anzianita-(si/no)
        └─ #riga3-col3      → #select-firma-digitale + #opt-firma-(si/no)
   -------------------------------------------------------
   CLASSI COMUNI:
   .label     → etichette di testo
   .select    → menu a tendina
   .input     → campi input testo
   .btn-year  → pulsanti anni (solo uno attivo con .active)
   ======================================================= */
