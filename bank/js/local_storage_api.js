const ACCOUNT_NAME = 'account name';
const ACCOUNT_NUMBER = 'account number';
const AVAILABLE_FUNDS = 'available funds';
const TRANSACTIONS = 'transactions';
const PENDING_BANK_TRANSFER = 'pending-bank-transfer';

const NAN = 'nan';
const TOO_MUCH = 'too much';
const OK = 'ok';

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
}

function initializeLocalStorage() {
    const accountName = 'Konto dla młodych';
    const accountNumber = '12 2817 5019 2380 0000 0003 3456';
    const availableFunds = '425.34';

    const transactionTop = new Transaction('Kebab', '08.12.2023', '25');
    const transactionMiddle = new Transaction('Mandat', '06.12.2023', '150');
    const transactionBottom = new Transaction('Frytki', '01.12.2023', '8.50');
    const transactions = [transactionBottom, transactionMiddle, transactionTop];

    localStorage.setItem(ACCOUNT_NAME, accountName);
    localStorage.setItem(ACCOUNT_NUMBER, accountNumber);
    localStorage.setItem(AVAILABLE_FUNDS, availableFunds);
    localStorage.setItem(TRANSACTIONS, JSON.stringify(transactions));
}

function clearLocalStorage() {
    localStorage.clear();
}

function removePendingBankTransfer() {
    localStorage.removeItem(PENDING_BANK_TRANSFER);
}

function formatAccountNumber(accountNumber) {
    const firstTwoDigits = accountNumber.substring(0, 2);
    const lastFourDigits = accountNumber.slice(-4);

    const formattedOutput = `${firstTwoDigits} (...) ${lastFourDigits}`;

    return formattedOutput;
}

function replaceDotsWithCommas(money) {
    return money.replace(/\./g, ',');
}

function formatMoney(money) {
    return `${replaceDotsWithCommas(money)} zł`;
}

function handleInputMoney(money) {
    money = money.replace(/\s/g, '').replace(/,/g, '.');
    let msg = undefined

    if (isNaN(money) || money === '') {
        msg = NAN;
    }
    else if (parseFloat(money) > parseFloat(localStorage.getItem(AVAILABLE_FUNDS))) {
        msg = TOO_MUCH;
    }
    else {
        if (money.includes('.')) {
            money = parseFloat(money).toFixed(2);
        }

        msg = OK;
    }

    return {'msg': msg, 'value': money};
}

function isInputNumberCorrect(number) {
    number = number.replace(/\s/g, '');
    areThereOnlyDigits = /^\d+$/.test(number);

    if (areThereOnlyDigits) {
        return true;
    }
    else {
        return false;
    }
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
