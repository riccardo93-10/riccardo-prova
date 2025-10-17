import {Richiedente} from "./Richiedente.js";
import {TipoRichiedente} from "./TipoRichiedente.js";

// Classe estesa per DipendentePrivato
export class Pensionato extends Richiedente {
  constructor(nettoMensile, dataNascita, rataMensile, anniFinanziamento) {
    super(TipoRichiedente.PENSIONATO, nettoMensile, dataNascita, rataMensile, anniFinanziamento);
  }
}