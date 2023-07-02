function novoElemento(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira');

    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');
    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`;

}

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras');

    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.getLargura = () => this.elemento.clientWidth;

    this.sortearAbertura();
    this.setX(x);

}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ];

    const deslocamento = 3;
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento);

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length);
                par.sortearAbertura();
            };

            const meio = largura / 2;
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio;
        });
    };
};


function Passaro(alturaJogo) {
    let voando = false;

    this.elemento = novoElemento('img', 'passaro');
    this.elemento.src = 'images/eggman.gif';

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
    this.setY = y => this.elemento.style.bottom = `${y}px`;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        const container =  document.getElementsByClassName('.conteudo');
        container.ontouchstart = () => voando = true;
        container.ontouchend = () => voando = false;
    } else {
        window.onkeydown = e => voando = true;
        window.onkeyup = e => voando = false;
    }

    this.animar = () => {
        const novoY = this.getY() + (voando ? 5 : -1);
        const alturaMaxima = alturaJogo - this.elemento.clientHeight;

        if (novoY <= 0) {
            this.setY(0);
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima);
        } else {
            this.setY(novoY);
        }
    }

    this.setY(alturaJogo / 2);

}

function flappyBird() {
    const areaDoJogo = document.querySelector('.flappy');
    const altura = areaDoJogo.clientHeight;
    const largura = areaDoJogo.clientWidth;

    const barreiras = new Barreiras(altura, largura, 400, 600);
    const passaro = new Passaro(altura);

    areaDoJogo.appendChild(passaro.elemento);
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));

    const music = novoElemento('audio', '');
    music.setAttribute('src', 'sound/marbleGardenZone2.mp3');
    music.setAttribute('autoplay', '');
    music.setAttribute('loop', '');
    areaDoJogo.appendChild(music);

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar();
            passaro.animar();
        }, 20);
    };
};

new flappyBird().start();