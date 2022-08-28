
let nome;
let idInterval;
let idIntervalChat;

function pegaNome(){
    nome = document.querySelector('.login input').value

    const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {
        name: nome
    })

    promisse.then(conexao)
    promisse.catch(novoNome)

}

function conexao(response){

    const login = document.querySelector('.login')

    login.classList.add('hide')

    const sala = document.querySelector('.sala')

    sala.classList.remove('hide')

    carregaChat()

   idInterval = setInterval(mantemConexao, 5000)
   idIntervalChat = setInterval(carregaChat, 3000)

}

function carregaChat(){

    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promisse.then(renderChat)
}

function renderChat(response){

    const chat = document.querySelector('.chat')
    chat.innerHTML = ""
    response.data.forEach(mensagem => {
        switch(mensagem.type){
            case 'status':
                chat.innerHTML += `<li class="status"><text class="time">(${mensagem.time})</text> <text class="nomes">${mensagem.from}</text> ${mensagem.text}</li>`;
                break;
            case 'message':
                chat.innerHTML += `<li class="message"><text class="time">(${mensagem.time})</text> <text class="nomes">${mensagem.from}</text> para <text class="nomes">${mensagem.to}</text>: ${mensagem.text}</li>`;
                break;
            case 'private_message':
                if(mensagem.from === nome)
                chat.innerHTML += `<li class="private_message"><text class="time">(${mensagem.time})</text> <text class="nomes">${mensagem.from}</text> reservadamente para <text class="nomes">${mensagem.to}</text>: ${mensagem.text}</li>`;
                break;
        }    
    });

    const ultimaMensagem = chat.lastElementChild
    ultimaMensagem.scrollIntoView();

}

function enviarMensagem(){
    const mensagem = document.querySelector('.mensagem input').value

    const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
        from: nome,
        to: 'Todos',
        text: mensagem,
        type: "message" 
    })

    promisse.then(carregaChat)
    promisse.catch(voltaLogin)

}

function voltaLogin(response){
    console.log(response)
    window.location.reload()
}

function mantemConexao(){
    const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',{
        name: nome
    })

    promisse.catch(saiDaSala)
}


function saiDaSala(response){
    alert('Saiu da sala')
    clearInterval(idInterval)
    clearInterval(idIntervalChat)

    const login = document.querySelector('.login')

    login.classList.remove('hide')

    const sala = document.querySelector('.sala')

    sala.classList.add('hide')
}

function novoNome(response){
    switch(response.response.status){
        case 400:
            return alert('Esse nome já existe, entre com outro.')
    }
}