import { TipoRichiedente } from "./TipoRichiedente.js";

export class Richiedente {
  constructor(tipo=null,nettoMensile=0,dataNascita='',rataMensile=0,anniFinanziamento=0) {
    // ✅ Validazione: tipoRichiedente deve essere uno dei valori dell'enum
    if (!Object.values(TipoRichiedente).includes(tipo)) {
      throw new Error(
        `TipoRichiedente non valido. Valori ammessi: ${Object.values(TipoRichiedente).join(", ")}`
      );
    }
    this.tipo = tipo;
    this.nettoMensile = nettoMensile;
    this.dataNascita = dataNascita;
    this.rataMensile = rataMensile;
    this.anniFinanziamento = anniFinanziamento;
  }

  getRataMensile() {
    return this.rataMensile;
  }

  setRataMensile(rataMensile) {
    this.rataMensile=rataMensile;
  }

  getAnniFinanziamento() {
    return this.anniFinanziamento;
  }

  setAnniFinanziamento(anniFinanziamento) {
    this.anniFinanziamento=anniFinanziamento;
  }

  getDataNascita() {
    return this.dataNascita;
  }

  setDataNascita(dataNascita) {
    this.dataNascita=dataNascita;
  }

  getNettoMensile() {
    return this.nettoMensile;
  }

  setNettoMensile(nettoMensile) {
    this.nettoMensile=nettoMensile;
  }

  getTipo() {
    return this.tipo;
  }

  setTipo(nuovoTipo) {
    if (!Object.values(TipoRichiedente).includes(nuovoTipo)) {
      throw new Error(`Tipo richiedente non valido. Valori possibili: ${Object.values(TipoRichiedente).join(",")}`);
    }
    this.tipo = nuovoTipo;
  }
}