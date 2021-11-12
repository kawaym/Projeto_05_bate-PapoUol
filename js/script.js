function horaAtual(){
    const today = new Date();
    const hora = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return hora;
}
function login(){
    const user_raw = prompt("Insira seu nome de usuário");
    const requisicao = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/participants",
        {
          name: user_raw
        }
      );
    // requisicao.then(teste);
    // requisicao.catch(entradaInvalida);
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
    for (let i = 0; messageList.length; i++){
        caixaMensagens.innerHTML += (formatarMensagem(messageList[i]));
    }
}
function mostrarMensagensNovas(){
    const listaMensagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    listaMensagens.then(mensagensNovas);
}
function mensagensNovas(resposta){
    const messageList = resposta.data;
    const ultimaMensagemServidor = formatarMensagem(messageList[messageList.length - 1]);
    let caixaMensagens = document.querySelector(".caixa-mensagens");
    const ultimaMensagemCliente = caixaMensagens.lastElementChild.outerHTML;  
    if (ultimaMensagemCliente !== ultimaMensagemServidor){
        caixaMensagens.innerHTML += ultimaMensagemServidor;
        caixaMensagens.lastElementChild.scrollIntoView();
    }
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
            formatMensagem = `<div class="message reservada" data-identifier="message"
            <span class="hora-envio">(${horaMensagem})</span>
            <span class="user"> ${remMensagem}</span>
            reservadamente para
            <span class="user">${destMensagem}</span>
            ${contMensagem}
            </div>`
            break;
        default:
            formatMensagem = `<div class="message publica" data-identifier="message"
            <span class="hora-envio">(00:00:00)</span>
            <span class="user">ERROR</span>
            para
            <span class="user">ERROR</span>
            ERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR
            </div>`
    }
    return formatMensagem;
}
