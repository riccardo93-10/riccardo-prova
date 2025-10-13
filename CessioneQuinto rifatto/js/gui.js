
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

  // Monto tutto
  container.appendChild(form);
}

export let copiaDatiForm;

// Funzione che mette in un oggetto tutti i dati del form
export function costruisciOggettoDatiForm() {
  const form = document.getElementById('prestito-form');
  const datiForm = {
    tipodipendente : form?.querySelector('#tipodipendente')?.value || '',
    tipocontratto  : form?.querySelector('#tipocontratto')?.value  || '',
    lavoro10anni   : form?.querySelector('#lavoro10annivalue')?.value   || '',
    annodinascita  : form?.querySelector('#annodinascita')?.value   || '',
    firmadigitale  : form?.querySelector('#firmadigitale')?.value   || '',
    minrata  : form?.querySelector('#minrata')?.innerText   || '',
    maxrata  : form?.querySelector('#maxrata')?.innerText  || '',
    nettomensile   : form?.querySelector('#nettomensile')?.value   || '',
    rataconsigliata   : form?.querySelector('#rataconsigliata')?.value   || '',
    anniSelezionati: form?.querySelector('#anniSelezionati')?.value
                      ? Number(form.querySelector('#anniSelezionati').value)
                      : null
                      
  };
  copiaDatiForm=datiForm;
  return datiForm;
}

// Funzione che aggiorna graficamente il form
// Riceve l'oggetto che contiene i dati del form
// e usa tale oggetto per aggiornare la gui del form
export function updateRataConsigliataeRataMassima(datiForm){
  document.getElementById('rataconsigliata').value = datiForm.rataconsigliata;
  document.getElementById('maxrata').innerText = datiForm.maxrata+"€";
}

// Funzione che mostra div per netto mensile troppo
export function mostraAvvisoNettoMensile(datiForm){
  document.getElementById("nettotroppobasso").style.display="inline-block";
}
// Funzione nasconde div per netto mensile troppo
export function nascondiAvvisoNettoMensile(datiForm){
  document.getElementById("nettotroppobasso").style.display="none";
}

// funzione che mostra il div del riepilogo finale
export function mostraPianoFinale(datiForm){
  const pianoFinaleDiv = document.getElementById('pianoFinaleDiv');
  if(!pianoFinaleDiv.classList.contains('show')){
    pianoFinaleDiv.classList.add('show');
  }
}

// funzione che nasconde il div del riepilogo finale
export function nascondiPianoFinale(datiForm){
  const pianoFinaleDiv = document.getElementById('pianoFinaleDiv');
  if(pianoFinaleDiv.classList.contains('show')){
    pianoFinaleDiv.classList.remove('show'); 
  }
}