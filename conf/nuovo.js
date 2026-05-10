(function() {
    let comuniDatabase = [];

    // Riferimenti agli elementi DOM
    const inputs = {
        name: document.getElementById('name'),
        surname: document.getElementById('surname'), // Nuovo campo separato
        dob: document.getElementById('date-of-birth'),
        gender: document.getElementById('gender'),
        place: document.getElementById('birthplace'),
        result: document.getElementById('codice-fiscale'),
        info: document.getElementById('cf-info'),
        datalist: document.getElementById('comuni-list')
    };

    const MONTH_LETTERS = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
    
    const ODD_MAP = {
        '0':1,'1':0,'2':5,'3':7,'4':9,'5':13,'6':15,'7':17,'8':19,'9':21,'A':1,'B':0,'C':5,'D':7,
        'E':9,'F':13,'G':15,'H':17,'I':19,'J':21,'K':2,'L':4,'M':18,'N':20,'O':11,'P':3,'Q':6,
        'R':8,'S':12,'T':14,'U':16,'V':10,'W':22,'X':25,'Y':24,'Z':23
    };

    const EVEN_MAP = {
        '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'A':0,'B':1,'C':2,'D':3,
        'E':4,'F':5,'G':6,'H':7,'I':8,'J':9,'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,
        'R':17,'S':18,'T':19,'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25
    };

    // Caricamento database comuni
    async function loadComuni() {
        try {
            const response = await fetch('comuni.json'); 
            comuniDatabase = await response.json();
            
            const fragment = document.createDocumentFragment();
            comuniDatabase.forEach(c => {
                const option = document.createElement('option');
                option.value = c[0]; 
                fragment.appendChild(option);
            });
            inputs.datalist.appendChild(fragment);
        } catch (error) {
            console.error("Errore caricamento database:", error);
        }
    }

    const normalize = (str) => str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '').trim() : '';

    const getChars = (str, type) => {
        const s = normalize(str);
        const vowels = s.match(/[AEIOU]/g) || [];
        const consonants = s.match(/[B-DF-HJ-NP-TV-Z]/g) || [];
        return type === 'consonants' ? consonants : vowels;
    };

    function codeSurname(surname) {
        const cons = getChars(surname, 'consonants');
        const vow = getChars(surname, 'vowels');
        const chars = [...cons, ...vow, 'X', 'X', 'X'];
        return chars.slice(0, 3).join('');
    }

    function codeName(name) {
        const cons = getChars(name, 'consonants');
        const vow = getChars(name, 'vowels');
        // Regola del nome: se ci sono 4 o più consonanti, si prendono la 1a, la 3a e la 4a
        if (cons.length >= 4) return cons[0] + cons[2] + cons[3];
        const chars = [...cons, ...vow, 'X', 'X', 'X'];
        return chars.slice(0, 3).join('');
    }

    function codeDate(dob, gender) {
        if (!dob) return '';
        const d = new Date(dob);
        const y = d.getFullYear().toString().slice(-2);
        const m = MONTH_LETTERS[d.getMonth()];
        let day = d.getDate();
        if (gender.toLowerCase() === 'female') day += 40;
        return `${y}${m}${day.toString().padStart(2, '0')}`;
    }

    function calculateCF() {
        const nameVal = inputs.name.value;
        const surnameVal = inputs.surname.value;
        const dobVal = inputs.dob.value;
        const genderVal = inputs.gender.value;
        const placeInput = inputs.place.value.toUpperCase().trim();

        // Controllo se i campi necessari sono compilati
        if (!nameVal || !surnameVal || !dobVal || !genderVal || !placeInput) {
            inputs.result.value = '';
            inputs.info.textContent = "Compila tutti i campi anagrafici per il calcolo.";
            inputs.info.style.color = "var(--text-gray)";
            return;
        }

        // Ricerca Comune
        const comune = comuniDatabase.find(c => c[0].toUpperCase() === placeInput);

        if (!comune) {
            inputs.result.value = '';
            inputs.info.textContent = "Comune non trovato nel database.";
            inputs.info.style.color = "#ff4d4d";
            return;
        }

        const belfioreCode = comune[1];
        const surnamePart = codeSurname(surnameVal);
        const namePart = codeName(nameVal);
        const datePart = codeDate(dobVal, genderVal);

        const partial = `${surnamePart}${namePart}${datePart}${belfioreCode}`;
        
        // Calcolo Carattere di Controllo
        let sum = 0;
        for (let i = 0; i < partial.length; i++) {
            const char = partial[i];
            // i=0 è la prima posizione (dispari per il fisco), i=1 è la seconda (pari)
            sum += (i % 2 === 0) ? ODD_MAP[char] : EVEN_MAP[char];
        }
        
        const checkChar = String.fromCharCode(65 + (sum % 26));
        
        inputs.result.value = partial + checkChar;
        inputs.info.textContent = "Codice Fiscale generato correttamente.";
        inputs.info.style.color = "var(--accent-gold)";
    }

    // Aggiunta eventi a tutti i campi
    [inputs.name, inputs.surname, inputs.dob, inputs.gender, inputs.place].forEach(el => {
        el.addEventListener('input', calculateCF);
        el.addEventListener('change', calculateCF);
    });

    // Avvio caricamento database
    loadComuni();
})();