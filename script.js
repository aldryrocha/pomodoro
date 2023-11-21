const html = document.querySelector('html');

const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const title = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPauseText = document.querySelector('#start-pause span');
const imgStartorPause = document.querySelector('.app__card-primary-butto-icon');
const timeOnScreen = document.querySelector('#timer');

const musicFocoInput = document.querySelector('#alternar-musica');
const music = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('/sons/play.wav');
const audioPausa = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3')

let tempoDecorridoemSegs = 1500;
let intervaloId = null;

music.loop = true; //vai ficar tocando em looping

//change é pra quando esta trabalhando com input checkbox true/false
musicFocoInput.addEventListener('change', () => {
    if(music.paused){ //paused é uma propriedade do objeto audio, é nativo do javascript
        //music.play() //ai tem os metodos play e pause
    }else{
        //music.pause()
    }
})

focoBt.addEventListener('click', () =>{
    tempoDecorridoemSegs = 1500;
    changeContext('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () =>{
    tempoDecorridoemSegs = 300;
    changeContext('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () =>{
    tempoDecorridoemSegs = 900;
    changeContext('descanso-longo');
    longoBt.classList.add('active');
})

function changeContext(contexto){
    ShowTime();
    botoes.forEach(function(contexto){
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch(contexto){
        case "foco":
            title.innerHTML = `Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
            case "descanso-curto":
                title.innerHTML = `Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>`
                break;
            case "descanso-curto":
                title.innerHTML = `Hora de voltar à superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>`
                break;
            default:
                break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoemSegs <= 0) {
        zerar()
        const focoAtivo = html.getAttribute('data-contexto') === 'foco'
        if (focoAtivo) {            
            var event = new CustomEvent("TarefaFinalizada", {
                detail: {
                    message: "A tarefa foi concluída com sucesso!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
            tempoDecorridoemSegs = 5
            ShowTime()
        }
        return
    }
    tempoDecorridoemSegs -= 1;
    ShowTime();
}

startPauseBt.addEventListener('click', iniciarOuPause);

function iniciarOuPause(){
    if(intervaloId){
        //audioPause.play();
        zerar();
        return;
    }
    //audioPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000); //executa alguma função em um determinado período de tempo
    iniciarOuPauseText.textContent = 'Pausar';
    imgStartorPause.setAttribute('src', 'imagens/pause.png');
}
function zerar(){
    clearInterval(intervaloId);
    iniciarOuPauseText.textContent = 'Começar';
    imgStartorPause.setAttribute('src', 'imagens/play_arrow.png');
    intervaloId = null;
}

function ShowTime(){
    const time = new Date(tempoDecorridoemSegs * 1000);
    const timeFormatado = time.toLocaleTimeString('pt-Br', {minute:'2-digit',second: '2-digit'});
    timeOnScreen.innerHTML = `${timeFormatado}`;
}
ShowTime();