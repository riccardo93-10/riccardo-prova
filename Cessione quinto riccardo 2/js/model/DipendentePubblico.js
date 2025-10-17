import {Dipendente} from "./Dipendente.js";
import {TipoRichiedente} from "./TipoRichiedente.js";

// Classe estesa per DipendentePubblico
export class DipendentePubblico extends Dipendente {
  constructor(nettoMensile, dataNascita, rataMensile, anniFinanziamento,firmaDigitale) {
    super(TipoRichiedente.PUBBLICO,nettoMensile, dataNascita, rataMensile, anniFinanziamento,firmaDigitale);
  }
}