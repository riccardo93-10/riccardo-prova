import { costruisciOggettoDatiForm } from "./gui.js";
import { updateRataConsigliataeRataMassima } from "./gui.js";
import { mostraAvvisoNettoMensile } from "./gui.js";
import { nascondiAvvisoNettoMensile } from "./gui.js";
import { copiaDatiForm} from "./gui.js";
import { mostraPianoFinale} from "./gui.js";
import { nascondiPianoFinale} from "./gui.js";

const MIN_NETTO=300;

const MIN_RATA=50;

export function gestisciEventoSelezioneTipoDipendente() {
  const select = document.getElementById('tipodipendente');

  if (!select) return;

  select.addEventListener('change', () => {
    const value = select.value.toLowerCase().replace(/\s+/g, '');
    const divaltridati = document.getElementById('altridati');

    const div10anni = document.getElementById('lavoro10anni');

    if (!divaltridati || !div10anni) return;

      div10anni.style.display = 'block';
      divaltridati.style.display = 'block';

      if (value === 'pens') {
        divaltridati.style.display = 'none';
      }
      if (value === 'dip_pub') {
        div10anni.style.display = 'none';
        divaltridati.style.display='flex';
        divaltridati.style.flexDirection='row';
        divaltridati.style.justifyContent='centre';
        divaltridati.style.alignItems='centre';
        const v =document.getElementById('annodinascita');
        v.style.marginTop='0';
        v.style.paddingLeft='80px';
          v.style.paddingRight='80px'; 
          v.style.paddingTop='25px';
          v.style.paddingBottom='25px'; 
           const s =document.getElementById('label-anno');
           s.style.marginBottom='30px';
      }

      if (value === 'dip_pri') {
        divaltridati.style.display='flex';
        divaltridati.style.flexDirection='row';
        divaltridati.style.justifyContent='centre';
        divaltridati.style.alignItems='centre';
        const z =document.getElementById('label-anno');
        z.style.marginBottom='30';
        const v =document.getElementById('annodinascita');
        v.style.paddingLeft='80px';
          v.style.paddingRight='80px'; 
            v.style.paddingTop='25px';
          v.style.paddingBottom='25px';
          const s =document.getElementById('label-anno');
           s.style.marginBottom='90px';
        
      }
  });
}

export function gestisciEventoCambioNettoMensile() {
  const inputNettoMensile = document.getElementById('nettomensile');
  if (!inputNettoMensile) return;

  inputNettoMensile.addEventListener('change', () => {
    const datiForm = costruisciOggettoDatiForm();

    let netto = Number(datiForm.nettomensile);
    if(netto<MIN_NETTO){
      mostraAvvisoNettoMensile();
      nascondiPianoFinale();
    }
    else{
      nascondiAvvisoNettoMensile();
      calcolaRataConsigliataeRataMassima(datiForm);
      if(isFormCessioneQuintoValido(datiForm)){
        calcolaPianoFinale(datiForm);
        mostraPianoFinale(datiForm);
      }
    }

  });
}

export function gestisciEventoCambioRataConsigliata() {
  const input = document.getElementById('rataconsigliata');
  if (!input) return;

  input.addEventListener('change', () => {
    const oldRataConsigliata=copiaDatiForm.rataconsigliata;
    const datiForm = costruisciOggettoDatiForm();

    let rataconsigliata = Number(datiForm.rataconsigliata);
    if(rataconsigliata<MIN_RATA){
      document.getElementById('rataconsigliata').value=oldRataConsigliata;
      nascondiPianoFinale();
    }
    else{
      if(isFormCessioneQuintoValido(datiForm)){
        calcolaPianoFinale(datiForm);
        mostraPianoFinale(datiForm);
      }
    }

  });
}

// Funzione che gestisce l'evento "durata in anni" del finanziamento
export function gestisciEventoAnniSelezionati(){

  document.addEventListener('anni:selezionati', (event) => {
    // Recupero il valore passato in detail (cioè il numero)
    const anniSelezionati = event.detail;
    
    console.log('Anni selezionati:', anniSelezionati);

    const datiForm = costruisciOggettoDatiForm();
    mostraNascondiPianoFinale(datiForm);

  });
}

export function gestisciEventoCambioDataNascita() {
  const select = document.getElementById('annodinascita');

  if (!select) return;

  select.addEventListener('change', () => {
     const datiForm = costruisciOggettoDatiForm();
     if(isFormCessioneQuintoValido(datiForm)){
        calcolaPianoFinale(datiForm);
        mostraPianoFinale(datiForm);
     }
  });
}

// Funzione che utilizzando i dati del form
// ricalcola la rata consigliata e la rata massima
function calcolaRataConsigliataeRataMassima(datiForm) {
  const min = 100;
  const max = 10000;

  const netto = Number(datiForm.nettomensile);
  // usa netto se ti serve…

  const numeroCasuale = Math.floor(Math.random() * (max - min + 1)) + min;
  datiForm.maxrata=numeroCasuale/2;
  datiForm.rataconsigliata=numeroCasuale;
  updateRataConsigliataeRataMassima(datiForm);
}

// Funzione che calcola il piano finale e che quindi aggiorna la grafica
// del div relativo al piano finale
function calcolaPianoFinale(datiForm) {
  console.log("CalcolaPianoFinale");
  if(!isFormCessioneQuintoValido(datiForm)){
    return;
  }
  console.log('Dati Form ' + JSON.stringify(datiForm));
}

// Funzione che mostra o nasconde il div
// relativo al pinao finale a seconda 
// della validità o meno dei dati del form
function mostraNascondiPianoFinale(datiForm){
  if(isFormCessioneQuintoValido(datiForm)){
    mostraPianoFinale(datiForm);
  }
  else{
    nascondiPianoFinale(datiForm);
  }
}

// Funzione che verifica se tutti i dati del form 
// sono validi restituendo un booleano
function isFormCessioneQuintoValido(datiForm){
  let netto = Number(datiForm.nettomensile);
  let rata = Number(datiForm.rataconsigliata);
  console.log("Rata: "+rata+" Netto: "+netto);

  if(datiForm.annodinascita===null || datiForm.annodinascita===''){
    console.log("anno di nascita non valido");
    return false;
  }

  if(netto >=MIN_NETTO && rata>=MIN_RATA){
    return true;
  }
  else{
    return false;
  }
}


