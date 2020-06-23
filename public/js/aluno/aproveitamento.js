//Definição das datas
var dataAtualInicio = document.querySelector("#data-inicio");
var dataAtualFim = document.querySelector("#data-fim");

dataAtualInicio.value = new Date().toISOString().substr(0, 10);
dataAtualFim.value = new Date().toISOString().substr(0, 10);

function setTipo(valor) {
    var tipo = document.querySelector("#tipo_participacao");
    tipo.disabled = false;
    if (valor == "Evento científico ou em áreas afins") {
        tipo.innerHTML =
            "<option value=1>Coordenador</option> \
            <option value=2>Colaborador</option> \
            <option value=3>Oral</option> \
            <option value=4>Painel</option> \
            <option value=5>Participação</option>"
    } else if (valor == "Monitoria Extensão e/ou Ensino") {
        tipo.innerHTML =
            "<option value=6>-</option>"
    } else if (valor == "Projeto de Extensão") {
        tipo.innerHTML =
            "<option value=7>Coordenador</option> \
            <option value=8>Colaborador</option> \
            <option value=9>Instrutor</option> \
            <option value=10>Participante</option>"
    } else if (valor == "Projeto de Ensino") {
        tipo.innerHTML =
            "<option value=11>Coordenador</option> \
            <option value=12>Colaborador</option> \
            <option value=13>Instrutor</option> \
            <option value=14>Participante</option>"
    } else if (valor == "Projeto de Pesquisa") {
        tipo.innerHTML =
            "<option value=15>Coordenador</option> \
            <option value=16>Participante</option>"
    } else if (valor == "Iniciação Científica") {
        tipo.innerHTML =
            "<option value=17>-<\option>"
    } else if (valor == "Publicação de Trabalho Científico") {
        tipo.innerHTML =
            "<option value=18>Trabalho completo</option> \
            <option value=19>Resumo expandido</option> \
            <option value=20>Resumo simples</option>"
    } else if (valor == "Estágio não obrigatório") {
        tipo.innerHTML =
            "<option value=21>-</option>"
    } else if (valor == "Participação em Órgão Colegiado") {
        tipo.innerHTML =
            "<option value=22>-</option>"
    } else if (valor == "Curso pertinente à área") {
        tipo.innerHTML =
            "<option value=23>Curso Técnico em Áreas Afins</option> \
            <option value=24>Curso de Língua Estrangeira e/ou Informática</option> \
            <option value=25>Curso de Verão</option>"
    } else if (valor == "Disciplina cursada como enriquecimento curricular") {
        tipo.innerHTML =
            "<option value=26>-</option>"
    } else if (valor == "Participação em Comissão de Estágio do Curso") {
        tipo.innerHTML =
            "<option value=27>-</option>"
    } else if (valor == "Programa de Educação Tutorial (PET)") {
        tipo.innerHTML =
            "<option value=28>-</option>"
    } else if (valor == "Projeto de Intervenção Comunitária") {
        tipo.innerHTML =
            "<option value=29>-</option>"
    } else if (valor == "Presença em Defesa de Projeto Final") {
        tipo.innerHTML =
            "<option value=30>-</option>"
    } else if (valor == "Visitas Técnicas") {
        tipo.innerHTML =
            "<option value=31>-</option>"
    } else if (valor == "Palestra") {
        tipo.innerHTML =
            "<option value=32>Ouvinte</option> \
        <option value=33>Palestrante</option>"
    } else if (valor == "Serviços à Justiça Eleitoral") {
        tipo.innerHTML =
            "<option value=34>-</option>"
    }
}


//Definição dos botões
function setRegras() {
    var tipo = document.getElementsByName("tipo_participacao")[0];
    var tipo = tipo.options[tipo.selectedIndex].value;

    var regras = document.querySelector('#tipo')
    var horas = document.getElementsByName("qtd_aproveitamento")[0];
    var aproveitamentos = document.getElementsByName("aproveitamento");
    var limite = document.getElementsByName("limite")[0];

    valor = regras.value
    if (valor == "Evento científico ou em áreas afins") {
        if (tipo == 'Coordenador') {
            horas.value = 24;
            aproveitamentos[0].checked = 'checked';
            limite.value = 48;
        } else if (tipo == 'Colaborador') {
            horas.value = 10;
            aproveitamentos[0].checked = 'checked';
            limite.value = 30;
        } else if (tipo == 'Oral') {
            horas.value = 12;
            aproveitamentos[1].checked = 'checked';
            limite.value = -1;
        } else if (tipo == 'Painel') {
            horas.value = 6;
            aproveitamentos[2].checked = 'checked';
            limite.value = 30;
        } else {
            horas.value = 1;
            aproveitamentos[4].checked = 'checked';
            limite.value = 15;
        }

    } else if (valor == "Monitoria Extensão e/ou Ensino") {
        horas.value = 15;
        aproveitamentos[2].checked = 'checked';
        limite.value = 68;
    } else if (valor == "Projeto de Extensão") {
        if (tipo == 'Coordenador') {
            horas.value = 100;
            aproveitamentos[2].checked = 'checked';
            limite.value = 68;
        } else if (tipo == 'Colaborador') {
            horas.value = 25;
            aproveitamentos[2].checked = 'checked';
            limite.value = 34;
        } else if (tipo == 'Instrutor') {
            horas.value = 100;
            aproveitamentos[1].checked = 'checked';
            limite.value = -1;
        } else if (tipo == 'Participante') {
            horas.value = 10;
            aproveitamentos[2].checked = 'checked';
            limite.value = 34;
        }
    } else if (valor == "Projeto de Ensino") {
        if (tipo == 'Coordenador') {
            horas.value = 100;
            aproveitamentos[2].checked = 'checked';
            limite.value = 68;
        } else if (tipo == 'Colaborador') {
            horas.value = 25;
            aproveitamentos[2].checked = 'checked';
            limite.value = 34;
        } else if (tipo == 'Instrutor') {
            horas.value = 100;
            aproveitamentos[1].checked = 'checked';
            limite.value = -1;
        } else if (tipo == 'Participante') {
            horas.value = 10;
            aproveitamentos[2].checked = 'checked';
            limite.value = 34;
        }
    } else if (valor == "Projeto de Pesquisa") {
        if (tipo == 'Coordenador') {
            horas.value = 100;
            aproveitamentos[2].checked = 'checked';
            limite.value = -1;
        } else if (tipo == 'Participante') {
            horas.value = 50;
            aproveitamentos[2].checked = 'checked';
            limite.value = 68;
        }
    } else if (valor == "Iniciação Científica") {
        horas.value = 68;
        aproveitamentos[0].checked = 'checked';
        limite.value = 68;
    } else if (valor == "Publicação de Trabalho Científico") {
        if (tipo == 'Trabalho completo') {
            horas.value = 34;
            aproveitamentos[0].checked = 'checked';
            limite.value = -1;
        } else if (tipo == 'Resumo expandido') {
            horas.value = 20;
            aproveitamentos[0].checked = 'checked';
            limite.value = 60;
        } else if (tipo == 'Resumo simples') {
            horas.value = 8;
            aproveitamentos[0].checked = 'checked';
            limite.value = 24;
        }
    } else if (valor == "Estágio não obrigatório") {
        horas.value = 100;
        aproveitamentos[2].checked = 'checked';
        limite.value = 68;
    } else if (valor == "Participação em Órgão Colegiado") {
        horas.value = 1;
        aproveitamentos[1].checked = 'checked';
        limite.value = 34;
    } else if (valor == "Curso pertinente à área") {
        if (tipo == 'Curso Técnico em Áreas Afins') {
            horas.value = 25;
            aproveitamentos[2].checked = 'checked';
            limite.value = 34;
        } else if (tipo == 'Curso de Língua Estrangeira e/ou Informática') {
            horas.value = 2;
            aproveitamentos[1].checked = 'checked';
            limite.value = 8;
        } else if (tipo == 'Curso de Verão') {
            horas.value = 100;
            aproveitamentos[2].checked = 'checked';
            limite.value = 68;
        }
    } else if (valor == "Disciplina cursada como enriquecimento curricular") {
        horas.value = 50;
        aproveitamentos[2].checked = 'checked';
        limite.value = 68;
    } else if (valor == "Participação em Comissão de Estágio do Curso") {
        horas.value = 1;
        aproveitamentos[1].checked = 'checked';
        limite.value = 34;
    } else if (valor == "Programa de Educação Tutorial (PET)") {
        horas.value = 34;
        aproveitamentos[3].checked = 'checked';
        limite.value = 68;
    } else if (valor == "Projeto de Intervenção Comunitária") {
        horas.value = 75;
        aproveitamentos[2].checked = 'checked';
        limite.value = 17;
    } else if (valor == "Presença em Defesa de Projeto Final") {
        horas.value = 1;
        aproveitamentos[2].checked = 'checked';
        limite.value = 10;
    } else if (valor == "Visitas Técnicas") {
        horas.value = 3;
        aproveitamentos[2].checked = 'checked';
        limite.value = 12;
    } else if (valor == "Palestra") {
        if (tipo == 'Ouvinte') {
            horas.value = 1;
            aproveitamentos[1].checked = 'checked';
            limite.value = 10;
        } else if (tipo == 'Palestrante') {
            horas.value = 2;
            aproveitamentos[1].checked = 'checked';
            limite.value = 10;
        }
    } else if (valor == "Serviços à Justiça Eleitoral") {
        horas.value = 200;
        aproveitamentos[2].checked = 'checked';
        limite.value = 34;
    }
}