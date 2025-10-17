/**
 * Calcola l'importo totale del credito (capitale finanziato)
 * @param {number} tan - TAN annuo (es: 7.15 per 7,15%)
 * @param {number} taeg - TAEG annuo (es: 7.40 per 7,40%)
 * @param {number} redditoMensile - reddito mensile del richiedente
 * @param {number} anni - durata del finanziamento in anni
 * @param {number} rata - importo rata mensile
 * @returns {object} - oggetto con dettagli del calcolo
 */
import { RichiestaFinanziamento } from "../model/RichiestaFinanziamento.js";
import { TagTaeg} from "../model/TagTaeg.js";
import { TipoRichiedente} from "../model/TipoRichiedente.js";
import { DipendentePrivato} from "../model/DipendentePrivato.js";
import { DipendentePubblico} from "../model/DipendentePubblico.js";
import { Pensionato} from "../model/Pensionato.js";
 
export const ONERI_INIZIALI = 16; // Oneri iniziali (es. spese istruttoria)

export const MIN_NETTO=300;

export const MIN_RATA=50;


export function generaSimulazioneCredito(richiedente) {
    console.log("---GeneraSimulazioneCredito---");

    const ris=calcolaTanTaeg(richiedente);
    const tan=Number(ris.tan);
    const taeg=Number(ris.taeg);
    const rata=Number(richiedente.rataMensile);
    const numeroRate=richiedente.anniFinanziamento*12;

    console.log("Tan "+tan);
    console.log("Tan "+taeg);
    console.log("Rata: "+rata+" Numero Rate: "+numeroRate);

    // rata, numeroRate, tan, taeg
    // Tasso mensile effettivo
    const tanMensile = Math.pow(1 + tan / 100, 1 / 12) - 1;
    const taegMensile = Math.pow(1 + taeg / 100, 1 / 12) - 1;

    // Capitale finanziato (TAN)
    const capitale = rata * (1 - Math.pow(1 + tanMensile, -numeroRate)) / tanMensile;

    // Totale pagato
    const totalePagato = rata * numeroRate;

    // Interessi totali (senza costi accessori)
    const interessi = totalePagato - capitale;

    // Capitale calcolato con TAEG (per eventuali costi accessori)
    const capitaleTaeg = rata * (1 - Math.pow(1 + taegMensile, -numeroRate)) / taegMensile;
    const costiAccessori = capitaleTaeg - capitale; // positivo se il TAEG > TAN

    const obj= new RichiestaFinanziamento({
      rata: rata.toFixed(2),
      numeroRate: numeroRate,
      tan: tan.toFixed(2) + "%",
      taeg: taeg.toFixed(2) + "%",
      capitaleFinanziato: capitale.toFixed(2) - ONERI_INIZIALI,
      totalePagato: totalePagato.toFixed(2),
      interessiTotali: interessi.toFixed(2),
      costiAccessori: costiAccessori.toFixed(2)
    });

    return obj;
 }

function calcolaTanTaeg(richiedente) {
  // Validazione dei valori min/max
  const rata =richiedente.rataMensile;      // limita tra 50 e 10000
  const numeroAnni = richiedente.anniFinanziamento; // limita tra 3 e 10

  // TAN in base agli anni (esempio lineare)
  let tan = numeroAnni <= 4 ? 5.50 :
              numeroAnni <= 6 ? 5.60 :
              numeroAnni <= 8 ? 5.70 :
              5.80;

  // TAEG in base alla rata (più alta la rata, più alto il TAEG)
  let taeg = rata <= 200 ? tan + 0.05 :
               rata <= 1000 ? tan + 0.10 :
               rata <= 5000 ? tan + 0.15 :
               tan + 0.20;

  switch (richiedente.tipo) {
    case TipoRichiedente.PUBBLICO:
      console.log("Gestione per dipendente pubblico");
      break;

    case TipoRichiedente.PRIVATO:
      tan+=2;taeg+=2;
      break;

    case TipoRichiedente.PENSIONATO:
      tan+=3;taeg+=3;
      break;

    default:
      console.log("Tipo non riconosciuto");
  }
  return new TagTaeg(tan.toFixed(2), taeg.toFixed(2));
}

// Funzione che utilizzando i dati del form
// ricalcola la rata consigliata e la rata massima
export function calcolaRataConsigliataeRataMassima(datiForm) {
  const coeffSostenibilita=0.6;
  datiForm.maxrata=Number(datiForm.nettomensile/5);
  const rataC=(datiForm.maxrata*coeffSostenibilita).toFixed(0);
  datiForm.rataconsigliata=rataC;
  return {
    rataconsigliata: rataC,
    maxrata: datiForm.maxrata
  };
}

// Funzione che mette in un oggetto tutti i dati del form
function costruisciRichiedenteDaDatiForm(datiForm) {

  let richiedente=null;
  const valori = Object.values(TipoRichiedente);

  if(datiForm.tipodipendente==='dip_pub'){
    richiedente = 
    new DipendentePubblico(valori[0],
    datiForm.nettomensile,datiForm.rataconsigliata,datiForm.anniSelezionati,datiForm.firmadigitale);
  }
  if(datiForm.tipodipendente==='dip_pri'){
    richiedente = 
    new DipendentePrivato(valori[1],
    datiForm.nettomensile,datiForm.rataconsigliata,datiForm.anniSelezionati,
    datiForm.firmadigitale,datiForm.lavoro10anni);
  }
  if(datiForm.tipodipendente==='pens'){
    richiedente = 
    new Pensionato(valori[2],
    datiForm.nettomensile,datiForm.rataconsigliata,datiForm.anniSelezionati);
  }
  return richiedente;
}

// Funzione che calcola il piano finale e che quindi aggiorna la grafica
// del div relativo al piano finale
export function calcolaPianoFinale(datiForm) {
  console.log("CalcolaPianoFinale");
  if(!isFormCessioneQuintoValido(datiForm)){
    return;
  }
  console.log('Dati Form ' + JSON.stringify(datiForm));

  let richiedente=costruisciRichiedenteDaDatiForm(datiForm);

  const richiestaFinanziamento=generaSimulazioneCredito(richiedente);

  return  richiestaFinanziamento;
}


// Funzione che verifica se tutti i dati del form 
// sono validi restituendo un booleano
export function isFormCessioneQuintoValido(datiForm){
  let netto = Number(datiForm.nettomensile);
  let rata = Number(datiForm.rataconsigliata);
  console.log("Rata Consigliata: "+rata+" Netto: "+netto);

  if(datiForm.annodinascita===null || datiForm.annodinascita===''){
    console.log("anno di nascita non valido");
    return false;
  }

  if(netto >=MIN_NETTO && rata>=MIN_RATA){
    return true;
  }
  else{
    console.log("Ko1...");
    return false;
  }
}


