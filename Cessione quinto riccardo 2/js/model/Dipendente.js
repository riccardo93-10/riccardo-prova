import {Richiedente} from "./Richiedente.js";

export class Dipendente extends Richiedente{

  constructor(tipo,nettoMensile, dataNascita, rataMensile, anniFinanziamento,contratto,firmaDigitale) {
     super(tipo,nettoMensile, dataNascita, rataMensile, anniFinanziamento);
     this.contratto=contratto;
     this.firmaDigitale=firmaDigitale;
  }

  getFirmaDigitale() {
    return this.firmaDigitale;
  }

  setFirmaDigitale(firmaDigitale) {
    this.firmaDigitale=firmaDigitale;
  }

  getContratto() {
    return this.contratto;
  }

  setContratto(contratto) {
    this.contratto=contratto;
  }
}
