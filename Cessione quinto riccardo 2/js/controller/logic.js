import { costruisciOggettoDatiForm,aggiornaSezioneTipoDipendente} from "../view/gui.js";
import { updateRataConsigliataeRataMassima } from "../view/gui.js";
import { mostraAvvisoNettoMensile } from "../view/gui.js";
import { nascondiAvvisoNettoMensile } from "../view/gui.js";
import { copiaDatiForm,updatePianoFinaleDiv} from "../view/gui.js";
import { mostraPianoFinale} from "../view/gui.js";
import { nascondiPianoFinale} from "../view/gui.js";
import { isFormCessioneQuintoValido} from "../service/simulatore.js";
import { MIN_NETTO,MIN_RATA} from "../service/simulatore.js";
import { calcolaRataConsigliataeRataMassima,calcolaPianoFinale } from "../service/simulatore.js";

// Controller
export function gestisciEventoSelezioneTipoDipendente() {
  const select = document.getElementById('tipodipendente');
  if(!select) return;

  select.addEventListener('change', () => {
    const tipo = select.value.toLowerCase();
    aggiornaSezioneTipoDipendente(tipo); // tutto il DOM va in View
    const datiForm = costruisciOggettoDatiForm();
    verificaCalcolaMostraPianoFinanziamento(datiForm);
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
      const rr=calcolaRataConsigliataeRataMassima(datiForm);
      updateRataConsigliataeRataMassima(datiForm);
      verificaCalcolaMostraPianoFinanziamento(datiForm);
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
      verificaCalcolaMostraPianoFinanziamento(datiForm);
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
    
    verificaCalcolaMostraPianoFinanziamento(datiForm);

  });
}

export function gestisciEventoCambioDataNascita() {
  const select = document.getElementById('annodinascita');

  if (!select) return;

  select.addEventListener('change', () => {
     const datiForm = costruisciOggettoDatiForm();
     verificaCalcolaMostraPianoFinanziamento(datiForm);
  });
}

function verificaCalcolaMostraPianoFinanziamento(datiForm){
  if(isFormCessioneQuintoValido(datiForm)){
    const richiestaFinanziamento=calcolaPianoFinale(datiForm);
    updatePianoFinaleDiv(richiestaFinanziamento);
    mostraPianoFinale();
  }
}