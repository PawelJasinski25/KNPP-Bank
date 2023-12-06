// na razie sa tu rzeczy aktualnie nieuzywane
$(document).ready(() => loadPage("content", " "));
let lastPage = "";
function loadPage(id, subpage) {
    $('#' + id).load(subpage, (response, status) => {
        if (status === "error") {
            console.error("Wystąpił błąd podczas wczytywania pliku.");
            $('#' + id).html('<div class="text-center">Nie udało się załadować zawartości.</div>');
        }
    });
}

function changePage(subpage, href) {
    try {
        if (lastPage !== subpage) {
            lastPage = subpage;
            loadPage("content", subpage);
        } else if (href !== undefined) location.href = href;
    } catch (e) {
        console.log(e);
        alert("Unexpected error occurred. Check the console for more information");
    }
}