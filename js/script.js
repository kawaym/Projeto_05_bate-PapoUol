let usuarioAtivo = ""; 
function horaAtual(){
    const today = new Date();
    const hora = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return hora;
}
function login(){
    usuarioAtivo = prompt("Insira seu nome de usuário");
    const loginUser = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/participants",
    {
        name: usuarioAtivo
        }
      );
    loginUser.then();
    setInterval(function(){
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status",
        {
            name: usuarioAtivo
        }
        );}, 5000);
    loginUser.catch(function(){
        alert("Usuário Inválido ou nome já utilizado, por favor tente novamente");
        login();
    });
}
function entradaInvalida(){
    alert("Nome inválido, por favor tente novamente");
}
function mostrarMensagensIniciais(){
    const listaMensagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    listaMensagens.then(mensagensIniciais);
}
function mensagensIniciais(resposta){
    const messageList = resposta.data;   
    let caixaMensagens = document.querySelector(".caixa-mensagens");
    caixaMensagens.innerHTML = "";
    for (let i = 0; messageList.length; i++){
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
    let objetoMensagem = formatarEnvio("Todos", mensagem, "message");
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
    const participantList = resposta.data;
    let caixaParticipantes = document.querySelector(".lista-participantes");
    console.log(caixaParticipantes)
    caixaParticipantes.innerHTML = `<button class="participante" data-identifier="participant">Todos</button>`;
    for (let i = 0; participantList.length; i++){
        if(participantList[i].name !== usuarioAtivo){
            caixaParticipantes.innerHTML += `<button class="participante" data-identifier="participant"> ${participantList[i].name}</button>`;
    
        }

    }
}