import {Dipendente} from "./Dipendente.js";
import {TipoRichiedente} from "./TipoRichiedente.js";

// Classe estesa per DipendentePrivato
export class DipendentePrivato extends Dipendente {
  constructor(nettoMensile, dataNascita, rataMensile, anniFinanziamento,firmaDigitale,lavoro10Anni) {
    super(TipoRichiedente.PRIVATO,nettoMensile, dataNascita, rataMensile, anniFinanziamento,firmaDigitale);
    this.setLavoro10Anni(lavoro10Anni);
  }

  getLavoro10anni() {
    return this.lavoro10Anni;
  }

  setLavoro10Anni(valore) {
    if (typeof valore !== "boolean") {
      throw new Error("Lavoro deve essere un valore booleano (true o false).");
    }
    this.lavoro10Anni = valore;
  }
}