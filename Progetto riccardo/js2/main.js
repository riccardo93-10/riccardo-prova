
import { creaFormSimulazionePrestito } from "./gui.js";
import { gestisciSelezioneTipoDipendente, gestisciEventoCambioNettoMensile } from "./logic.js";

//funzione init() asincrona
//async function init()
//Rende la funzione asincrona, 
//cioè capace di usare await per aspettare funzioni che restituiscono Promise.
function init() {
  try {
    creaFormSimulazionePrestito();
    gestisciSelezioneTipoDipendente();
    gestisciEventoCambioNettoMensile();
  } 
  catch (err) {
    console.error("Errore in init:", err);
  }
}

/*
serve per garantire che il tuo codice JavaScript venga eseguito
solo dopo che l’intero documento HTML è stato caricato 
(cioè quando tutti gli elementi del DOM sono pronti per essere manipolati).
*/
document.addEventListener("DOMContentLoaded", init);
