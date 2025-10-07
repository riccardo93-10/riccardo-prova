
export function creaFormSimulazionePrestito(){

  const container = document.getElementById('main');

  // creo tag <form>
  const form = document.createElement('form');

  // creo tag <div>
  const row1 = document.createElement('div');
  // cambio classe css al div(row1)
  row1.className = 'form-row';

  // creo tag <div>
  const g1 = document.createElement('div');
  // cambio classe css al div(row1)
  g1.className = 'form-group';
  // creo tag <label>
  const l1 = document.createElement('label');
  // cambio il testo della label
  l1.textContent = 'Di cosa ti occupi?';
  // creo tag <select>
  const s1 = document.createElement('select');
  // setto attributo id del tag select
  s1.id = 'tipodipendente';

  // ciclo per ogni elemento dell'array occupazioni
 
  const opt1 = document.createElement('option');
  opt1.textContent ="Dipendete pubblico";

  const opt2 = document.createElement('option');
  opt2.textContent ="Dipendete privato";

  const opt3 = document.createElement('option');
  opt3.textContent ="Pensionato";

  s1.appendChild(opt1);
  s1.appendChild(opt2);
  s1.appendChild(opt3);
  g1.append(l1,s1);

  // group2
  const g2 = document.createElement('div');
  g2.className = 'form-group';
  const l2 = document.createElement('label');
  l2.textContent = 'Qual è il tuo contratto?';
  const s2 = document.createElement('select');
  s2.id="tipocontratto";

  const opt4 = document.createElement('option');
  opt4.textContent ="Dipendete pubblico";

  const opt5 = document.createElement('option');
  opt5.textContent ="Dipendete privato";

  const opt6 = document.createElement('option');
  opt6.textContent ="Pensionato";

  s2.appendChild(opt4);
  s2.appendChild(opt5);
  s2.appendChild(opt6);

  g2.append(l2,s2);

  // group3
  const g3 = document.createElement('div');
  g3.className = 'form-group';
  const l3 = document.createElement('label');
  l3.textContent = 'Indica il tuo netto mensile';

  const i3 = document.createElement('input');
  i3.type = 'text';
  i3.id="nettomensile";
  i3.className='inputMoney';
  i3.value = '€';
  g3.append(l3,i3);

  row1.append(g1,g2,g3);

  form.appendChild(row1);


  // ------------------ SECONDA RIGA ------------------
  const row2 = document.createElement('div');
  row2.className = 'form-row';

  // group4
  const g4 = document.createElement('div');
  g4.className = 'form-group';
  const l4 = document.createElement('label');
  l4.textContent = 'Che rata mensile vorresti?';
  const i4 = document.createElement('input');
  i4.type = 'text';
  i4.id="rataconsigliata";
  i4.size = 20;
  i4.value = '175,00 €';
  const minmax = document.createElement('div');
  minmax.id = 'minmax';
  minmax.className = 'min-max';
  const sp1 = document.createElement('span');
  sp1.innerHTML = 'Rata Minima<br><strong>50,00 €</strong>';
  const sp2 = document.createElement('span');
  sp2.innerHTML = 'Rata Massima<br><strong>300,00 €</strong>';
  minmax.append(sp1,sp2);
  g4.append(l4,i4,minmax);

  // group5
  const g5 = document.createElement('div');
  g5.className = 'form-group';
  const l5 = document.createElement('label');
  l5.textContent = 'Quanto vorresti che durasse?';
  const ys = document.createElement('div');
  ys.className = 'years-selector';
  ['3','4','5','6','7','8','9','10'].forEach(num=>{
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = num + ' <br/>anni';
    if(num==='4') btn.className = 'active';
    ys.appendChild(btn);
  });
  g5.append(l5,ys);

  // group6 (vuoto)
  const g6 = document.createElement('div');
  g6.className = 'form-group';

  row2.append(g4,g5,g6);
  form.appendChild(row2);

  // ------------------ TERZA RIGA ------------------
  const row3 = document.createElement('div');
  row3.className = 'form-row';
  row3.id = 'terzo';

  // group7
  const g7 = document.createElement('div');
  g7.className = 'form-group';
  const l7 = document.createElement('label');
  l7.textContent = 'Anno di nascita';
  const s7 = document.createElement('select');
  ['1983','1984','1985'].forEach(txt=>{
    const opt = document.createElement('option');
    opt.textContent = txt;
    s7.appendChild(opt);
  });
  g7.append(l7,s7);

  // group8
  const g8 = document.createElement('div');
  g8.className = 'form-group';
  g8.id = 'lavoro10anni';
  const l8 = document.createElement('label');
  l8.textContent = 'Lavori da almeno 10 anni presso l’attuale datore di lavoro?';
  const s8 = document.createElement('select');
  ['No','Sì'].forEach(txt=>{
    const opt = document.createElement('option');
    opt.textContent = txt;
    s8.appendChild(opt);
  });
  g8.append(l8,s8);

  // group9
  const g9 = document.createElement('div');
  g9.className = 'form-group';
  const l9 = document.createElement('label');
  l9.textContent = 'Sei interessato alla firma digitale per velocizzare la tua pratica?';
  const s9 = document.createElement('select');
  ['No','Sì'].forEach(txt=>{
    const opt = document.createElement('option');
    opt.textContent = txt;
    s9.appendChild(opt);
  });
  g9.append(l9,s9);

  row3.append(g7,g8,g9);
  form.appendChild(row3);

  // ------------------ Monto tutto ------------------
  container.appendChild(form);
}