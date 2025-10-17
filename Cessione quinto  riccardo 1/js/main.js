// =======================================================
// MAIN bootstrap
// - Importa le funzioni dal modulo UI e dal modulo di logica/controlli
// - Inizializza l'app al DOMContentLoaded
// - Gestisce eccezioni mostrando un messaggio d'errore visibile all'utente
// NOTE:
// - Non rinomino nulla: stessi nomi di funzioni, variabili e ID.
// - Le funzioni importate sono definite altrove (qui non si implementano).
// =======================================================
import { creasimulatore } from "./creazionesimulatore.js";
import { controllaValoreNetto, logicavisibilita } from "./logicaecontrolli.js";



/**
 * Punto di ingresso dell'applicazione lato client.
 * Attende che il DOM sia pronto, quindi:
 * 1) costruisce la UI del simulatore,
 * 2) applica la logica di visibilità,
 * 3) esegue il controllo sul valore netto (come previsto dalla tua API),
 * 4) logga a console l'esito.
 *
 * Tutto è racchiuso in un try/catch per intercettare eventuali errori
 * e mostrare un feedback chiaro all'utente.
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    // 1) Costruisce dinamicamente l'interfaccia del simulatore (DOM)
    creasimulatore();

    // 2) Applica regole di visibilità (es. mostra/nascondi riga3 o col2 in base all'occupazione)
    logicavisibilita();

    // 3) Esegue la validazione/aggancio controlli sul netto mensile
    //    (La firma della funzione è gestita dal tuo modulo: qui rispettiamo la tua API)
    controllaValoreNetto();

    // 4) Log di conferma in console per diagnosi rapida
    console.log("Tutte le funzioni sono state eseguite correttamente!");
  } catch (errore) {
    // In caso di qualsiasi eccezione, log tecnico + messaggio utente
    console.error("Si è verificato un errore durante l'esecuzione:", errore);
    mostraMessaggioErrore(errore);
  }
});



/**
 * Mostra un messaggio d'errore in pagina, in modo semplice e accessibile.
 * - Non modifica nomi/ID esistenti.
 * - Aggiunge attributi ARIA per screen reader.
 * - Include una guard per evitare di duplicare il banner se l'errore viene rilanciato.
 *
 * @param {Error} errore - Oggetto errore catturato dal catch.
 */
function mostraMessaggioErrore(errore) {
  // Guard: evita di aggiungere più volte lo stesso banner d'errore
  if (document.getElementById("banner-errore-main")) {
    return;
  }

  const divErrore = document.createElement("div");
  divErrore.id = "banner-errore-main";
  divErrore.textContent = "Errore: " + (errore && errore.message ? errore.message : "Si è verificato un problema inatteso.");

  // Stili minimi inline (puoi spostarli nel tuo CSS)
  divErrore.style.color = "red";
  divErrore.style.background = "#fff3f3";
  divErrore.style.border = "1px solid #ffcccc";
  divErrore.style.padding = "10px 12px";
  divErrore.style.margin = "12px";
  divErrore.style.borderRadius = "6px";

  // Accorgimenti di accessibilità: annuncia l'errore ai lettori di schermo
  divErrore.setAttribute("role", "alert");
  divErrore.setAttribute("aria-live", "assertive");

  document.body.appendChild(divErrore);
}
