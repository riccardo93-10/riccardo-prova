export class RichiestaFinanziamento {
    /**
     * @param {number} rata - importo della rata mensile
     * @param {number} numeroRate - numero totale di rate
     * @param {number} tan - TAN (%)
     * @param {number} taeg - TAEG (%)
     * @param {number} capitaleFinanziato - capitale finanziato
     * @param {number} totalePagato - totale pagato
     * @param {number} interessiTotali - interessi totali
     * @param {number} costiAccessori - costi accessori
     * @param {number} oneriIniziali - eventuali oneri iniziali
     */
    constructor({
      rata,
      taeg,     
      numeroRate,
      tan,
      capitaleFinanziato,
      totalePagato,
      interessiTotali,
      costiAccessori,
      oneriIniziali = 0
    }) {
      this.rata = parseFloat(rata);
      this.numeroRate = numeroRate;
      this.tan = parseFloat(tan);
      this.taeg = parseFloat(taeg);
      this.capitaleFinanziato = parseFloat(capitaleFinanziato) - oneriIniziali;
      this.totalePagato = parseFloat(totalePagato);
      this.interessiTotali = parseFloat(interessiTotali);
      this.costiAccessori = parseFloat(costiAccessori);
      this.oneriIniziali = parseFloat(oneriIniziali);
    }
  
    // Metodi per ottenere valori formattati
    getRataFormattata() {
      return this.rata.toFixed(2);
    }
  
    getTanFormattato() {
      return this.tan.toFixed(2) + "%";
    }
  
    getTaegFormattato() {
      return this.taeg.toFixed(2) + "%";
    }
  
    getCapitaleFinanziatoFormattato() {
      return this.capitaleFinanziato.toFixed(2);
    }
  
    getTotalePagatoFormattato() {
      return this.totalePagato.toFixed(2);
    }
  
    getInteressiTotaliFormattati() {
      return this.interessiTotali.toFixed(2);
    }
  
    getCostiAccessoriFormattati() {
      return this.costiAccessori.toFixed(2);
    }
  
    // Rappresentazione completa dell'oggetto
    toObject() {
      return {
        rata: this.getRataFormattata(),
        numeroRate: this.numeroRate,
        tan: this.getTanFormattato(),
        taeg: this.getTaegFormattato(),
        capitaleFinanziato: this.getCapitaleFinanziatoFormattato(),
        totalePagato: this.getTotalePagatoFormattato(),
        interessiTotali: this.getInteressiTotaliFormattati(),
        costiAccessori: this.getCostiAccessoriFormattati()
      };
    }

     // 🔹 Metodo simile a toString() di Java
  toString() {
    return `RichiestaFinanziamento { ` +
           `rata: ${this.getRataFormattata()}, ` +
           `numeroRate: ${this.numeroRate}, ` +
           `TAN: ${this.getTanFormattato()}, ` +
           `TAEG: ${this.getTaegFormattato()}, ` +
           `capitaleFinanziato: ${this.getCapitaleFinanziatoFormattato()}, ` +
           `totalePagato: ${this.getTotalePagatoFormattato()}, ` +
           `interessiTotali: ${this.getInteressiTotaliFormattati()}, ` +
           `costiAccessori: ${this.getCostiAccessoriFormattati()} ` +
           `}`;
  }
  }