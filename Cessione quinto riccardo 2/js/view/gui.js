const ALTRI_DATI_DIVS = ['altridati', 'lavoro10anni'];

export function creaFormSimulazionePrestito() {
  const container = document.getElementById('main');
  container.innerHTML = '';
  const form = document.createElement('form');
  form.id = 'prestito-form'; 

  // 👇 Hidden per salvare gli anni selezionati
  const anniHidden = document.createElement('input');
  anniHidden.type = 'hidden';
  anniHidden.id = 'anniSelezionati';
  form.appendChild(anniHidden);

  // ------------------ RIGA 1 ------------------
  const row1 = document.createElement('div');
  row1.className = 'row-3col';

  // group1
  const g1 = document.createElement('div');
  g1.className = 'form-group';
  const l1 = document.createElement('label');
  l1.textContent = 'Di cosa ti occupi?';
  const s1 = document.createElement('select');
  s1.id = 'tipodipendente';

  const opt1 = document.createElement('option'); 
  opt1.textContent = 'Dipendente pubblico';
  opt1.value="dip_pub";

  const opt2 = document.createElement('option'); 
  opt2.textContent = 'Dipendente privato';
  opt2.value="dip_pri";

  const opt3 = document.createElement('option'); 
  opt3.textContent = 'Pensionato';
  opt3.value="pens";

  s1.append(opt1, opt2, opt3);
  g1.append(l1, s1);

  // group2
  const g2 = document.createElement('div');
  g2.className = 'form-group';
  const l2 = document.createElement('label');
  l2.textContent = 'Qual è il tuo contratto?';
  const s2 = document.createElement('select');
  s2.id = 'tipocontratto';
  const opt4 = document.createElement('option'); 
  opt4.textContent = 'Indeterminato';
  opt4.value="indet";
  const opt5 = document.createElement('option'); 
  opt5.textContent = 'Determinato';
  opt5.value="det";

  s2.append(opt4, opt5);
  g2.append(l2, s2);

  // group3
  const g3 = document.createElement('div');
  g3.className = 'form-group';
  const l3 = document.createElement('label');
  l3.textContent = 'Indica il tuo netto mensile';

  const g41 = document.createElement('div');
  g41.className='badge my-2 mr-10';
  g41.id="nettotroppobasso";
  g41.textContent = 'VALORE TROPPO BASSO';
  g3.appendChild(g41);
  
  const i3 = document.createElement('input');
  i3.type = 'text';
  i3.id = 'nettomensile';
  i3.addEventListener("focus", function() {
    console.log("Il campo è stato selezionato!");
    nascondiPianoFinale();
  });
  
  i3.placeholder='es. 1500';
  g3.append(l3, i3,g41);

  row1.append(g1, g2, g3);
  form.appendChild(row1);

  // ------------------ RIGA 2 ------------------
  const row2 = document.createElement('div');
  row2.className = 'row-2col';

  // group4
  const g4 = document.createElement('div');
  g4.className = 'form-group';
  const l4 = document.createElement('label');
  l4.textContent = 'Che rata mensile vorresti?';
  const i4 = document.createElement('input');
  i4.type = 'text';
  i4.id = 'rataconsigliata';
  i4.className = 'inputMoney';
  i4.size = 20;
  i4.placeholder = '750 €';
 
  // ===== Seconda riga =====
  const rowMinMax = document.createElement('div');
  rowMinMax.className = 'minMax';
 
  const labelLeft = document.createElement('span');
  labelLeft.textContent = 'Rata Minima';
  
 
  const labelRight = document.createElement('span');
  labelRight.textContent = 'Rata Massima';
 
  rowMinMax.appendChild(labelLeft);
  rowMinMax.appendChild(labelRight);

  // ===== terza riga =====
  const rowMinMax1 = document.createElement('div');
  rowMinMax1.className="minMax";

  const labelLeft1 = document.createElement('span');
  labelLeft1.className="cifra";
  labelLeft1.id = 'minrata';
  labelLeft1.textContent = '50,00€';
  rowMinMax1.appendChild(labelLeft1);

  const labelLeft2 = document.createElement('span');
  labelLeft2.className="cifra";
  labelLeft2.id = 'maxrata';
  labelLeft2.textContent = '€';
  rowMinMax1.appendChild(labelLeft2);

  g4.append(l4, i4, rowMinMax,rowMinMax1);


  // group5 (anni)
  const g5 = document.createElement('div');
  g5.className = 'form-group';

  const l5 = document.createElement('label');
  l5.textContent = 'Quanto vorresti che durasse?';

  const ys = document.createElement('div');
  ys.className = 'years-selector';

  const anniOptions = ['3','4','5','6','7','8','9','10'];

  anniOptions.forEach( num => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = num + ' <br/>anni';

    btn.addEventListener('click', () => {
      // togli active a tutti
      ys.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      // metti active a questo
      btn.classList.add('active');
      // salva nel hidden
      anniHidden.value = num;
      // (facoltativo) evento per altri listener
      document.dispatchEvent(new CustomEvent('anni:selezionati', { detail: Number(num) }));
    });

    ys.appendChild(btn);
  });

  // ✅ Default senza .click(): imposto visivamente e salvo il valore
  const firstBtn = ys.querySelector('button');
  if (firstBtn) {
    firstBtn.classList.add('active');
    anniHidden.value = anniOptions[0]; // "3"
  }

  g5.append(l5, ys);
  row2.append(g4, g5);
  form.appendChild(row2);

  // ------------------ RIGA 3 ------------------
  document.getElementById('altridati')?.remove();

  const row3 = document.createElement('div');
  row3.className = 'row-3col';
  row3.id = 'altridati';

  // group7
  const g7 = document.createElement('div');
  g7.className = 'form-group';
  const l7 = document.createElement('label');
  l7.textContent = 'Anno di nascita';
  l7.id = 'label-anno'; 
  l7.htmlFor = 'annodinascita';
  const i7 = document.createElement('input');
  i7.type = 'date';
  i7.id = 'annodinascita';
  i7.name = 'annodinascita';
  g7.append(l7, i7);

  // group8
  const g8 = document.createElement('div');
  g8.className = 'form-group';
  g8.id = 'lavoro10anni';
  const l8 = document.createElement('label');
  l8.textContent = 'Lavori da almeno 10 anni presso l’attuale datore di lavoro?';
  const s8 = document.createElement('select');
  s8.id='lavoro10annivalue';
  ['No','Sì'].forEach(txt => {
    const opt = document.createElement('option');
    opt.value=txt;
    opt.textContent = txt;
    s8.appendChild(opt);
  });
  g8.append(l8, s8);

  // group9
  const g9 = document.createElement('div');
  g9.className = 'form-group';
  const l9 = document.createElement('label');
  l9.textContent = 'Sei interessato alla firma digitale per velocizzare la tua pratica?';
  const s9 = document.createElement('select');
  s9.id="firmadigitale";
  ['No','Sì'].forEach(txt => {
    const opt = document.createElement('option');
    opt.textContent = txt;
    opt.value=txt;
    s9.appendChild(opt);
  });
  g9.append(l9, s9);

  row3.append(g7, g8, g9);
  form.appendChild(row3);

  //quarta riga
  const row4 = document.createElement('div');
  row4.className = "row";

  // Creiamo il wrapper con data-id e classi
  const disclaimerWrapper = document.createElement("div");
  disclaimerWrapper.className = "col-12 info";
  disclaimerWrapper.setAttribute("data-id", "disclaimer-wrapper");

  // Container dei testi
  const textsContainer = document.createElement("div");
  textsContainer.className = "texts-container small-text";

  // Short text
  const shortText = document.createElement("div");
  shortText.className = "short-text";
  shortText.innerHTML = `Ti informiamo che questo è un messaggio pubblicitario con finalità promozionale e non costituisce offerta al pubblico vincolante. La concessione del finanziamento è soggetta alla valutazione e approvazione di Cap.Ital.Fin. S.p.A. Qui di seguito si riporta un esempio rappresentativo della simulazione: Importo totale del credito € <strong>8.777,61</strong>, importo totale dovuto dal consumatore (Montante) € <strong>9.540,00</strong>, salvo estinzione anticipata. Importo rata mensile €<span class="text-dots">...</span>`;

  // Long text (inizialmente nascosto)
  const longText = document.createElement("div");
  longText.className = "long-text";
  longText.style.display = "none";
  longText.innerHTML = `&nbsp;<strong>265,00. Durata 36 mesi.</strong> &nbsp;<strong>TAEG 5,63%</strong> comprensivo di: interessi&nbsp; al TAN fisso <strong>5,50% </strong>e&nbsp;oneri erariali € <strong>16,00.</strong> Le condizioni riportate sono puramente indicative e possono variare in funzione dell’età del cliente, della sua anzianità di servizio, della natura giuridica del datore di lavoro, dell’importo richiesto, della durata del finanziamento, delle commissioni di intermediazione applicate, della disponibilità a sottoscrivere con firma il digitale, etc…​ Al fine di gestire le tue spese in modo responsabile, Cap.Ital.Fin. S.p.A., ti ricorda, prima di sottoscrivere il contratto, di prendere visione di tutte le condizioni contrattuali consultando le Informazioni Europee di Base sul Credito ai Consumatori (IEBCC), asportabili presso la sede di Cap.Ital.Fin. S.p.A. e disponibili nella sezione <a href="https://www.bancaifis.it/trasparenza/prodotti-capitalfin/" target="_blank">Trasparenza</a> del sito.`;

  // Pulsante "Leggi tutto"
  const showMore = document.createElement("a");
  showMore.className = "show-more";
  showMore.href = "#";
  showMore.setAttribute("data-more", "0");
  showMore.textContent = "Leggi tutto";

  // Costruiamo la gerarchia
  textsContainer.appendChild(shortText);
  textsContainer.appendChild(longText);
  disclaimerWrapper.appendChild(textsContainer);
  disclaimerWrapper.appendChild(showMore);
  row4.appendChild(disclaimerWrapper);

  // Inseriamo nel DOM (ad esempio dentro body)
  form.appendChild(row4);


  // Monto tutto
  container.appendChild(form);
}

export function creaDivPianoFinale() {
  // Creazione del wrapper principale
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  
  // ===== HEADER =====
  const header = document.createElement("div");
  header.className = "header";
  
  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  subtitle.textContent = "Con i dati che hai inserito, ecco il riepilogo della tua simulazione";
  
  const link = document.createElement("a");
  link.href = "#";
  link.textContent = "Cambia i dati";
  
  // aggiungo al blocco header
  header.appendChild(subtitle);
  header.appendChild(link);
  
  // ===== CONTAINER =====
  const container = document.createElement("div");
  container.className = "container";
  
  // --- Sezione sinistra: info ---
  const info = document.createElement("div");
  info.className = "info";
  
  const data = [
    { label: "Importo rata", value: "",id:"piano_rata" },
    { label: "Numero rate", value: "" , id:"piano_numerorate"},
    { label: "Importo totale del credito", value: "",id:"piano_totalecredito" },
  ];
  
  data.forEach(item => {
    const infoItem = document.createElement("div");
    infoItem.className = "info-item";
  
    const lbl = document.createElement("div");
    lbl.className = "label";
    lbl.textContent = item.label;
  
    const val = document.createElement("div");
    val.className = "value";
    val.id=item.id;
    val.textContent = item.value;
  
    infoItem.appendChild(lbl);
    infoItem.appendChild(val);
    info.appendChild(infoItem);
  });
  
  // --- Sezione destra: tassi e bottone ---
  const right = document.createElement("div");
  right.className = "right";
  
  const rates = document.createElement("div");
  rates.className = "rates";
  rates.innerHTML = `
    <div><strong>TAN</strong> <span id="piano_tan"> </span></div>
    <div><strong>TAEG</strong> <span id="piano_taeg"> </span></div>
  `;
  
  const button = document.createElement("div");
  button.className = "button";
  button.textContent = "Compila la richiesta →";
  
  // aggiungo gli elementi al blocco di destra
  right.appendChild(rates);
  right.appendChild(button);
  
  // unisco info e right nel container
  container.appendChild(info);
  container.appendChild(right);
  
  // unisco header e container nel wrapper
  wrapper.appendChild(header);
  wrapper.appendChild(container);
  
  // infine aggiungo il wrapper al body
  document.getElementById("pianoFinaleDiv").appendChild(wrapper); 
}


export let copiaDatiForm;

// Funzione che mette in un oggetto tutti i dati del form
export function costruisciOggettoDatiForm() {
  const form = document.getElementById('prestito-form');
  const datiForm = {
    tipodipendente : form?.querySelector('#tipodipendente')?.value || '',
    tipocontratto  : form?.querySelector('#tipocontratto')?.value  || '',
    lavoro10anni   : form?.querySelector('#lavoro10annivalue')?.value.toUpperCase() === "SI"   || false,
    firmadigitale  : form?.querySelector('#firmadigitale')?.value.toUpperCase() === "SI"   || false,
    annodinascita  : form?.querySelector('#annodinascita')?.value   || '',
    minrata  : form?.querySelector('#minrata')?.innerText   ||'',
    maxrata  : form?.querySelector('#maxrata')?.innerText  || '',
    nettomensile   : Number(form?.querySelector('#nettomensile')?.value)   || null,
    rataconsigliata :Number(form?.querySelector('#rataconsigliata')?.value )  || null,
    anniSelezionati: Number(form.querySelector('#anniSelezionati').value)|| null              
  };
  copiaDatiForm=datiForm;
  return datiForm;
}

// Funzione che aggiorna graficamente il form
// Riceve l'oggetto che contiene i dati del form
// e usa tale oggetto per aggiornare la gui del form
export function updateRataConsigliataeRataMassima(rr){
  document.getElementById('rataconsigliata').value = rr.rataconsigliata;
  document.getElementById('maxrata').innerText = rr.maxrata+"€";
}

// Funzione che mostra div per netto mensile troppo
export function mostraAvvisoNettoMensile(){
  mostraDiv("nettotroppobasso");
  //document.getElementById("nettotroppobasso").style.display="inline-block";
}
// Funzione nasconde div per netto mensile troppo
export function nascondiAvvisoNettoMensile(){
  //document.getElementById("nettotroppobasso").style.display="none";
  nascondiDiv("nettotroppobasso");
}

// funzione che mostra il div del riepilogo finale
export function mostraPianoFinale(){
  const pianoFinaleDiv = document.getElementById('pianoFinaleDiv');
  if(!pianoFinaleDiv.classList.contains('show')){
    pianoFinaleDiv.classList.add('show');
  }
}

// funzione che nasconde il div del riepilogo finale
export function nascondiPianoFinale(){
  const pianoFinaleDiv = document.getElementById('pianoFinaleDiv');
  if(pianoFinaleDiv.classList.contains('show')){
    pianoFinaleDiv.classList.remove('show'); 
  }
}

// Funzione che aggiorna il div relativo
// al piano di finanziamento proposto
export function updatePianoFinaleDiv(pianoFinanziamento){
  document.getElementById('piano_rata').innerText  =pianoFinanziamento.rata+"€";
  document.getElementById('piano_numerorate').innerText = pianoFinanziamento.numeroRate+"€";
  document.getElementById('piano_totalecredito').innerText = pianoFinanziamento.capitaleFinanziato+"€";
  document.getElementById('piano_tan').innerText = pianoFinanziamento.tan;
  document.getElementById('piano_taeg').innerText = pianoFinanziamento.taeg;
}

// View
export function aggiornaSezioneTipoDipendente(tipo) {

  // Nascondo tutti i div prima di mostrarne quelli giusti
  nascondiDivMultipli(ALTRI_DATI_DIVS);

  switch (tipo) {
    case 'pens':
      // Solo div10anni mostrato
      mostraDiv('lavoro10anni');
      break;

    case 'dip_pub':
      // Solo divaltridati mostrato con stile flex
      mostraDivFlex('altridati', {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      });
      break;

    case 'dip_pri':
      mostraDivFlex('altridati', {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      });
      mostraDiv('lavoro10anni');
      break;

    default:
      break;
  }
}

// View: gestione div dipendente/pensionato
export function mostraDiv(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

export function nascondiDiv(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// Mostra div con stile flex configurabile
export function mostraDivFlex(id, options = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  el.style.display = 'flex';
  el.style.flexDirection = options.flexDirection || 'row';
  el.style.justifyContent = options.justifyContent || 'flex-start';
  el.style.alignItems = options.alignItems || 'stretch';
}

// Nasconde tutti i div della sezione "altri dati"
export function nascondiDivMultipli(ids = []) {
  ids.forEach(id => nascondiDiv(id));
}