const fs = require('fs');

const FILE_ORIGINALE = 'gi_comuni.json';
const FILE_OUTPUT = 'comuni.json';

try {
    console.log(`Avvio elaborazione di ${FILE_ORIGINALE}...`);

    // 1. Legge il file
    const data = fs.readFileSync(FILE_ORIGINALE, 'utf8');
    const comuni = JSON.parse(data);

    // 2. Estrae solo Nome e Codice Belfiore e ordina per nome
    const ottimizzati = comuni
        .map(c => [
            c.denominazione_ita,
            c.codice_belfiore
        ])
        .sort((a, b) => a[0].localeCompare(b[0])); // Ordine alfabetico

    // 3. Salva il file minificato (senza spazi inutili)
    fs.writeFileSync(FILE_OUTPUT, JSON.stringify(ottimizzati));

    // Calcolo risparmio spazio
    const statOrig = fs.statSync(FILE_ORIGINALE).size;
    const statNuovo = fs.statSync(FILE_OUTPUT).size;
    
    console.log('--- RISULTATO ---');
    console.log(`Peso Originale: ${(statOrig / 1024).toFixed(2)} KB`);
    console.log(`Peso Ottimizzato: ${(statNuovo / 1024).toFixed(2)} KB`);
    console.log(`Riduzione del: ${(((statOrig - statNuovo) / statOrig) * 100).toFixed(1)}%`);
    console.log(`Creato il file: ${FILE_OUTPUT}`);

} catch (err) {
    if (err.code === 'ENOENT') {
        console.error(`Errore: Il file "${FILE_ORIGINALE}" non è stato trovato nella cartella.`);
    } else {
        console.error('Errore:', err.message);
    }
}