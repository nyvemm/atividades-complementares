$(document).ready(function (e) {
    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
});

function aprovado(n) {
    let alunos = document.querySelectorAll(".aluno-row");
    alunos.forEach((currentRow) => {
        console.log(currentRow.childNodes)
        if ('Aprovado' == currentRow.childNodes[n].textContent.trim()) {
            currentRow.style.display = 'table-row';
        } else {
            currentRow.style.display = 'none';
        }
    })
}

function reprovado(n) {
    let alunos = document.querySelectorAll(".aluno-row");
    alunos.forEach((currentRow) => {
        if ('Reprovado' == currentRow.childNodes[n].textContent.trim()) {
            currentRow.style.display = 'table-row';
        } else {
            currentRow.style.display = 'none';
        }
    })
}

function matriculado(n) {
    let alunos = document.querySelectorAll(".aluno-row");
    alunos.forEach((currentRow) => {
        if ('Matriculado' == currentRow.childNodes[n].textContent.trim()) {
            currentRow.style.display = 'table-row';
        } else {
            currentRow.style.display = 'none';
        }
    })
}


function analise() {
    let alunos = document.querySelectorAll(".aluno-row");
    alunos.forEach((currentRow) => {
        if ('Em análise' == currentRow.childNodes[9].textContent.trim()) {
            currentRow.style.display = 'table-row';
        } else {
            currentRow.style.display = 'none';
        }
    })
}

function todos() {
    let alunos = document.querySelectorAll(".aluno-row");
    alunos.forEach((currentRow) => {
        currentRow.style.display = 'table-row';
    })
}

/*-------------------------*/