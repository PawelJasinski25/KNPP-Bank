/*

Idea:
- wszystkie dane potrzebne do działania aplikacji przechowujemy w localStorage
- localStorage to takie miejsce do przechowywania danych, która jest w przeglądarce
- localStorage pozwala przechowywać w przeglądarce pary klucz-wartość
- pary te przeżywają nawet gdy się zamknie okno przeglądarki
- w localStorage można przechowywać niewiele danych, około 5-10 MB
- w localStorage można przechowywać tylko dane typu string

Metody:
localStorage.setItem('key', 'item')
localStorage.getItem('key')
localStorage.removeItem('key')
localStorage.clear()

Ponieważ localStorage może przechowywać tylko dane typu string, 
to aby zapisać tam jakieś bardziej skomplikowane obiekty, 
na przykład jakąś tablicę, 
to musimy je najpierw zamienić na string za pomocą JSON.stringify()

localStorage.setItem('key', JSON.stringify(item))

Aby potem odczytać taki obiekt z local storage, 
musimy zamienić stringową reprezentację tego obiektu, na ten właśnie obiekt, 
robimy to za pomocą metody JSON.parse()

JSON.parse(localStorage.getItem('key'))

*/



/*

W localStorage możemy przechowywać wszystkie dane banku, 
na przykład numer konta, albo wszystkie wykonane transakcje

Pomysł jest taki, że inicjalizujemy localStorage, gdy wchodzimy po raz pierwszy na stronę główną, 
od tego czasu zaczyna się sesja na stronie banku

Sesja trwa do momentu, gdy klikniemy na przycisk "Wyloguj", 
wtedy localStorage jest czyszczone, 
czyli usuwane są np. dane o wszystkich przelewach wykonanych podczas sesji

*/

// Klucze
const ACCOUNT_NAME = 'account name';
const ACCOUNT_NUMBER = 'account number';
const AVAILABLE_FUNDS = 'available funds';
const TRANSACTIONS = 'transactions';
const PENDING_BANK_TRANSFER = 'pending-bank-transfer';

// Pomocnicze stałe
const NAN = 'nan';
const TOO_MUCH = 'too much';
const OK = 'ok';

// Klasy

class Transaction {
    constructor(title, date, amount) {
        this.title = title;
        this.date = date;
        this.amount = amount;
    }
}

class BankTransfer extends Transaction {
    constructor(fromAccount, fromNumber, beneficiary, toNumber, title, date, amount) {
        super(title, date, amount);
        this.fromAccount = fromAccount;
        this.fromNumber = fromNumber;
        this.beneficiary = beneficiary;
        this.toNumber = toNumber;
    }

    // Funkcja pomocnicza do sprawdzania czy pole w formularzu jest poprawnie wypełnione
    // Zakładamy, że jest poprawnie wypełnione, gdy zawiera same cyfry (i ewentualnie białe znaki, np. spacje)
    static isToNumberCorrect(toNumber) {
        toNumber = toNumber.replace(/\s/g, '');
        const areThereOnlyDigits = /^\d+$/.test(toNumber);
    
        if (areThereOnlyDigits) {
            return true;
        }
        else {
            return false;
        }
    }
}

class BankStorage {
    static initialize() {
        const accountName = 'Konto dla młodych';
        const accountNumber = '12 2817 5019 2380 0000 0003 3456';
        const availableFunds = '425.34';
    
        const transactionTop = new Transaction('Kebab', '08.12.2023', '25');
        const transactionMiddle = new Transaction('Mandat', '06.12.2023', '150');
        const transactionBottom = new Transaction('Frytki', '01.12.2023', '8.50');

        // Wszystkie transakcje będą przechowywane w tablicy
        // Nowe transakcje będą dodawane na koniec tablicy
        // transactionTop jest najnowszą transakcją, więc idzie na koniec tablicy
        const transactions = [transactionBottom, transactionMiddle, transactionTop];
    
        localStorage.setItem(ACCOUNT_NAME, accountName);
        localStorage.setItem(ACCOUNT_NUMBER, accountNumber);
        localStorage.setItem(AVAILABLE_FUNDS, availableFunds);
        localStorage.setItem(TRANSACTIONS, JSON.stringify(transactions));
    }

    static clear() {
        localStorage.clear();
    }

    static getAccountName() {
        return localStorage.getItem(ACCOUNT_NAME);
    }

    static setAccountName(accountName) {
        localStorage.setItem(ACCOUNT_NAME, accountName);
    }

    static removeAccountName() {
        localStorage.removeItem(ACCOUNT_NAME);
    }

    static getAccountNumber() {
        return localStorage.getItem(ACCOUNT_NUMBER);
    }

    static setAccountNumber(accountNumber) {
        localStorage.setItem(ACCOUNT_NUMBER, accountNumber);
    }

    static removeAccountNumber() {
        localStorage.removeItem(ACCOUNT_NUMBER);
    }

    static getAvailableFunds() {
        return localStorage.getItem(AVAILABLE_FUNDS);
    }

    static setAvailableFunds(availableFunds) {
        localStorage.setItem(AVAILABLE_FUNDS, availableFunds);
    }

    static removeAvailableFunds() {
        localStorage.removeItem(AVAILABLE_FUNDS);
    }

    static getTransactions() {
        return JSON.parse(localStorage.getItem(TRANSACTIONS));
    }

    static setTransactions(transactions) {
        localStorage.setItem(TRANSACTIONS, JSON.stringify(transactions));
    }

    static removeTransactions() {
        localStorage.removeItem(TRANSACTIONS);
    }

    static getPendingBankTransfer() {
        return JSON.parse(localStorage.getItem(PENDING_BANK_TRANSFER));
    }

    static setPendingBankTransfer(pendingBankTransfer) {
        localStorage.setItem(PENDING_BANK_TRANSFER, JSON.stringify(pendingBankTransfer));
    }

    static removePendingBankTransfer() {
        localStorage.removeItem(PENDING_BANK_TRANSFER);
    }

    // Funkcja pomocnicza do sprawdzania czy pole w formularzu jest poprawnie wypełnione
    static handleMoneyInput(moneyInput) {
        // pierwsza linijka usuwa białe znaki i zamienia przecinki na kropki
        // zamieniamy przecinki na kropki, ponieważ zakładamy, że 
        // użytkownik może wpisać liczby typu float i z kropką i z przecinkiem, ale 
        // żeby JavaScript poprawnie porównała liczby typu float, musimy mieć kropkę
        moneyInput = moneyInput.replace(/\s/g, '').replace(/,/g, '.');

        let msg = undefined
    
        if (isNaN(moneyInput) || moneyInput === '') {
            msg = NAN;
        }
        else if (parseFloat(moneyInput) > parseFloat(this.getAvailableFunds())) {
            msg = TOO_MUCH;
        }
        else {
            if (moneyInput.includes('.')) {
                moneyInput = parseFloat(moneyInput).toFixed(2);
            }
    
            msg = OK;
        }
    
        return {'msg': msg, 'value': moneyInput};
    }
}

// Metody pomocnicze

function formatAccountNumber(accountNumber) {
    const firstTwoDigits = accountNumber.substring(0, 2);
    const lastFourDigits = accountNumber.slice(-4);

    return `${firstTwoDigits} (...) ${lastFourDigits}`;
}

function replaceDotWithComma(money) {
    return money.replace(/\./g, ',');
}

function formatMoney(money) {
    return `${replaceDotWithComma(money)} zł`;
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
