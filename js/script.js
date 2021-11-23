let usuarioAtivo = ""; 
let usuarioDestino = "Todos";
let privacidade = "message";
let info_msg = document.querySelector(".info-mensagem");
let participantList = [];

mostrarMensagensIniciais();
setInterval(mostrarMensagensIniciais, 3000);
mostrarListaParticipantes();
setInterval(mostrarListaParticipantes, 10000);

function horaAtual(){
    const today = new Date();
    const hora = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return hora;
}
function login(){
    const tela_login = document.querySelector(".tela-login");
    const user = document.querySelector(".caixa-envio-user").value;
    usuarioAtivo = user;
    const loginUser = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/participants",
    {
        name: usuarioAtivo
        }
      );
    loginUser.then(function(){tela_login.classList.add("desativado")});
    
    setInterval(function(){
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status",
        {
            name: usuarioAtivo
        }
        );}, 5000);
    loginUser.catch(function(){
        alert("Usuário Inválido ou nome já utilizado, por favor tente novamente");
        document.querySelector(".caixa-envio-user").value = "";
        window.location.reload();
    });
}
function mostrarMensagensIniciais(){
    const listaMensagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    listaMensagens.then(mensagensIniciais);
}
function mensagensIniciais(resposta){
    let messageList = resposta.data; 
    let caixaMensagens = document.querySelector(".caixa-mensagens");
    caixaMensagens.innerHTML = "";
    for (let i = 0; i < messageList.length; i++){
        if((messageList[i].type === "private_message" && messageList[i].to === usuarioAtivo) || messageList[i].to === "Todos" || messageList[i].from === usuarioAtivo){
            caixaMensagens.innerHTML += (formatarMensagem(messageList[i]));
            caixaMensagens.lastElementChild.scrollIntoView();
        }
    }
}
function mostrarMensagensNovas(){
    const listaMensagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    listaMensagens.then(mensagensNovas);
}
function mensagensNovas(resposta){
    const messageList = resposta.data;
    const ultimaMensagemServidorObj = messageList[messageList.length - 1];
    const ultimaMensagemServidor = formatarMensagem(ultimaMensagemServidorObj);
    let caixaMensagens = document.querySelector(".caixa-mensagens");
    const ultimaMensagemCliente = caixaMensagens.lastElementChild.outerHTML;  
    if (ultimaMensagemCliente !== ultimaMensagemServidor){
        if((ultimaMensagemServidorObj.type === "private_message" && ultimaMensagemServidorObj.to === usuarioAtivo) || ultimaMensagemServidorObj.to === "Todos" || ultimaMensagemServidorObj.from === usuarioAtivo){    
            caixaMensagens.innerHTML += ultimaMensagemServidor;
            caixaMensagens.lastElementChild.scrollIntoView();
        };
    };
}
function formatarMensagem(mensagem){
    const tipoMensagem = mensagem.type;
    
    const remMensagem = mensagem.from;
    const destMensagem = mensagem.to;
    const contMensagem = mensagem.text;
    const horaMensagem = mensagem.time;

    let formatMensagem = "";
    switch (tipoMensagem) {
        case 'status':
            formatMensagem = `<div class="message status" data-identifier="message">
            <span class="hora-envio">(${horaMensagem})</span>
            <span class="user">${remMensagem}</span>
            ${contMensagem}
            </div>`
            break;
        case 'message':
            formatMensagem = `<div class="message publica" data-identifier="message">
            <span class="hora-envio">(${horaMensagem})</span>
            <span class="user">${remMensagem}</span>
            para
            <span class="user">${destMensagem}</span>
            ${contMensagem}
            </div>`
            break;
        case 'private_message':
            formatMensagem = `<div class="message reservada" data-identifier="message">
            <span class="hora-envio">(${horaMensagem})</span>
            <span class="user"> ${remMensagem}</span>
            reservadamente para
            <span class="user">${destMensagem}</span>
            ${contMensagem}
            </div>`
            break;
        default:
            formatMensagem = `<div class="message publica" data-identifier="message">
            <span class="hora-envio">(00:00:00)</span>
            <span class="user">ERROR</span>
            para
            <span class="user">ERROR</span>
            ERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR
            </div>`
    }
    return formatMensagem;
}
function formatarEnvio(to, text, type){
    let resposta = {from: usuarioAtivo, to: to, text: text, type: type};
    return resposta
}
function enviarMensagem(){
    const mensagem = document.querySelector(".caixa-envio").value;
    let objetoMensagem = formatarEnvio(usuarioDestino, mensagem, privacidade);
    const mensagemUser = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages",
    objetoMensagem);
    mensagemUser.then();
    mensagemUser.catch(window.location.reload);
    document.querySelector(".caixa-envio").value = "";
}   
function desativarOverlay(overlay){
    overlay.style.display = "none";
    const menu = document.querySelector(".menu-participantes");
    menu.style.display = "none";
}
function mostrarMenuParticipantes(){
    const menu = document.querySelector(".menu-participantes");
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "flex";
    menu.style.display = "flex";
}
function mostrarListaParticipantes(){
    const listaParticipantes = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    listaParticipantes.then(participantesOnline);
}
function participantesOnline(resposta){
    participantList = resposta.data;
    let caixaParticipantes = document.querySelector(".lista-participantes");
    caixaParticipantes.innerHTML = `<button class="participante ${checarParticipante("Todos", usuarioDestino)} todos" data-identifier="participant" onclick="selecionarParticipante(this)"><ion-icon name="people"></ion-icon>Todos<ion-icon name="checkmark" class="check"></ion-icon></button>`;
    for (let i = 0; i < participantList.length; i++){
        if(participantList[i].name !== usuarioAtivo){
            caixaParticipantes.innerHTML += `<button class="participante ${checarParticipante(participantList[i].name, usuarioDestino)}"  data-identifier="participant" onclick="selecionarParticipante(this)"><ion-icon name="person-circle"></ion-icon>${participantList[i].name}
            <ion-icon name="checkmark" class="check"></ion-icon></button>`;
        }

    }
}
function checarParticipante(alvo, destino){
    if (alvo === destino){
        return "selecionado";
    }
    else if (alvo === "Todos" && !(participantList.some(e => e.name === destino))){ 
        usuarioDestino = "Todos";
        info_msg.innerHTML = `Enviando para ${usuarioDestino} (${(privacidade === "message") ? "Público" : "Reservadamente"})`
        return "selecionado";
    }
}
function selecionarParticipante(destinatario){
    let participanteSelecionado = document.querySelector(".participante.selecionado");

    if (participanteSelecionado !== null){
        if (participanteSelecionado !== destinatario){
            participanteSelecionado.classList.remove("selecionado");
        }
    }
    destinatario.classList.add("selecionado");
    usuarioDestino = destinatario.innerText; 
    info_msg.innerHTML = `Enviando para ${usuarioDestino} (${(privacidade === "message") ? "Público" : "Reservadamente"})`
}
function selecionarPrivacidade(modo_envio){
    let privacidade_selecionado = document.querySelector(".botao-privacidade.selecionado");
    if (privacidade_selecionado !== null){
        if(privacidade_selecionado !== modo_envio){
            privacidade_selecionado.classList.remove("selecionado");
        }
    }
    modo_envio.classList.add("selecionado");
    if (modo_envio.innerText === "Público"){
        privacidade = "message";
    }
    else if (modo_envio.innerText === "Reservadamente"){
        privacidade = "private_message";
    }
    info_msg.innerHTML = `Enviando para ${usuarioDestino} (${(privacidade === "message") ? "Público" : "Reservadamente"})`
}