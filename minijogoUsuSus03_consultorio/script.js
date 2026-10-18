// ============================================================================
// REGRAS ESPECÍFICAS - FASE 3 USUÁRIO DO SUS (Consultório)
// ============================================================================

const DADOS_JOGO = {
    tema: {
        corPrincipal: "#5e35b1", // Roxo Pesquisa
        corEscura: "#4527a0", 
        corClara: "#ede7f6"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 70,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 3: Consultório",
        introDesc: "Seus dados podem ser utilizados para estudos e pesquisas que ajudam a melhorar os tratamentos.",
        introDefinCurta: "<strong>Dica:</strong> Em pesquisas, sua identidade deve ser ocultada.",
        introDefin: "<strong>Protegendo suas informações:</strong><br><br>Quando seus dados são usados para pesquisa, a unidade de saúde deve <strong>anonimizá-los</strong>. Isso significa remover qualquer detalhe (como Nome, CPF e Endereço) que permita descobrir quem você é. Dados como Idade ou Doença, quando isolados, são seguros para estudos científicos.",
        introDica: "<strong>Arraste as fichas</strong> para a direita para aprovar dados anonimizados, ou para a esquerda para descartar dados que identificam você.",
        introMeta: "Meta de Aprovação: Avaliar TUDO com {META}% de Precisão.",

        fimVitoriaTitulo: "Pesquisa Segura! ✅",
        fimVitoriaMsg: "Excelente! Você entendeu que a proteção do paciente em estudos depende da retirada de identificadores.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ⏳",
        fimDerrotaTempoMsg: "O tempo acabou antes de você analisar todas as fichas de dados para a pesquisa.",
        fimDerrotaMetaTitulo: "Privacidade Exposta ⚠️",
        fimDerrotaMetaMsg: "Atenção. Alguns dados que você aprovou permitiam identificar você diretamente, comprometendo o sigilo.",
        baseLegal: "<strong>⚖️ Art. 5º, III da LGPD:</strong> A anonimização ocorre quando não há possibilidade de identificação do indivíduo a partir dos dados fornecidos.",

        // MENSAGENS DIFERENCIADAS POR AÇÃO (Aprovar/Descartar) e TIPO DE DADO
        txtToastCorreto: {
            aprovar_anonimo: "Correto! Esse dado isolado não permite descobrir quem você é. Seguro para pesquisa.",
            descartar_identifica: "Correto! Esse dado identifica você e deve ser excluído da base da pesquisa."
        },
        txtToastErro: {
            aprovar_identifica: "Atenção! Você aprovou um dado que expõe sua identidade. Ele deveria ser excluído do estudo.",
            descartar_anonimo: "Atenção! Esse dado é anônimo e essencial para a pesquisa. Não havia necessidade de descartá-lo."
        }
    },

    bancoDeDados: [
        // Mantêm anonimato (Devem ser Aprovados)
        { texto: "Idade", tipo: "anonimo" },
        { texto: "Sexo", tipo: "anonimo" },
        { texto: "Diagnóstico sem identificação", tipo: "anonimo" },
        
        // Identificam (Devem ser Descartados)
        { texto: "Nome Completo", tipo: "identifica" },
        { texto: "Foto de Rosto", tipo: "identifica" },
        { texto: "CPF", tipo: "identifica" },
        { texto: "Endereço Residencial", tipo: "identifica" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('txt-intro-titulo').innerText = DADOS_JOGO.interface.introTitulo;
    document.getElementById('txt-intro-desc').innerText = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin + "<br><br>";
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    
    const textoMetaDinamico = DADOS_JOGO.interface.introMeta.replace('{META}', DADOS_JOGO.metaAprovacao);
    document.getElementById('txt-intro-meta').innerText = textoMetaDinamico;
    
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});

const Engine = {
    ...GlobalEngine, 

    filaCartoes: [], cartaAtual: null, totalCartoesRodada: 0,
    pontuacao: 0, acertos: 0, totalJogados: 0,
    acertosSeguidos: 0, errosSeguidos: 0,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true,
    ultimoToastMensagem: null,
    tempoToastRestante: 0, tempoAlertaRestante: 0,
    
    // Controles de Swipe
    elCartao: null, startX: 0, startY: 0, isDragging: false, currentX: 0, threshold: 100,

    mostrarTutorial: function() {
        this.iniciar(); 
        document.getElementById('tela-tutorial').classList.remove('oculto');
        this.jogoPausado = true; 

        const tratarPrimeiroToque = (e) => {
            if (e.target.closest('.btn-voltar')) return;
            document.getElementById('tela-tutorial').classList.add('oculto'); 
            this.jogoPausado = false; 
            document.removeEventListener('pointerdown', tratarPrimeiroToque, { capture: true });
        };
        document.addEventListener('pointerdown', tratarPrimeiroToque, { capture: true });
    },

    iniciar: function() {
        GlobalEngine.iniciar.call(this, 'flex');

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.filaCartoes = [...DADOS_JOGO.bancoDeDados];
        if (modoAleatorio) this.filaCartoes.sort(() => Math.random() - 0.5);
        this.totalCartoesRodada = this.filaCartoes.length;

        this.acertos = 0; 
        this.totalJogados = 0;
        this.errosSeguidos = 0; 
        this.acertosSeguidos = 0; 
        this.ultimoToastMensagem = null;

        // this.montarPilhaVisual();
        this.puxarNovaCarta();
        this.ajustarEventosDoToast();
    },

    // montarPilhaVisual: function() {
    //     const container = document.getElementById('cartoes-pilha');
    //     container.innerHTML = '';
        
    //     // Desenha cartões falsos no fundo para dar sensação de volume
    //     const qtdVolume = Math.min(3, this.filaCartoes.length);
    //     for(let i=1; i<=qtdVolume; i++) {
    //         const fake = document.createElement('div');
    //         fake.className = 'ficha-dado';
    //         fake.style.transform = `translateY(${i * 6}px) scale(${1 - (i * 0.03)})`;
    //         fake.style.zIndex = -i;
    //         fake.style.opacity = 0.5;
    //         container.appendChild(fake);
    //     }
    // },
    montarPilhaVisual: function() {
        const container = document.getElementById('cartoes-pilha');
        container.innerHTML = '';
        
        const qtdVolume = Math.min(3, this.filaCartoes.length);
        
        for(let i = 1; i <= qtdVolume; i++) {
            const fake = document.createElement('div');
            fake.className = 'ficha-dado';
            
            // 1. Removemos a opacidade e usamos brightness para escurecer as cartas de trás
            fake.style.transform = `translateY(${i * 8}px) scale(${1 - (i * 0.04)})`;
            fake.style.zIndex = -i;
            fake.style.opacity = 1; // Sólido (não vazado)
            fake.style.filter = `brightness(${1 - (i * 0.08)})`; // Escurece 8% a cada carta
            
            // 2. Lógica para "espiar" qual é a verdadeira próxima carta da fila
            const indexCarta = this.filaCartoes.length - i;
            if (indexCarta >= 0) {
                const cartaBackground = this.filaCartoes[indexCarta];
                
                let iconeExtra = "📄";
                if (cartaBackground.texto === "Nome Completo" || cartaBackground.texto === "CPF") iconeExtra = "🪪";
                if (cartaBackground.texto === "Foto de Rosto") iconeExtra = "🖼️";
                if (cartaBackground.texto === "Endereço Residencial") iconeExtra = "🏠";
                if (cartaBackground.texto === "Idade") iconeExtra = "🎂";
                if (cartaBackground.texto === "Sexo") iconeExtra = "🚻";
                if (cartaBackground.texto === "Diagnóstico sem identificação" || cartaBackground.texto === "Exames" || cartaBackground.texto === "Histórico médico") iconeExtra = "🩺";

                fake.innerHTML = `
                    <div class="card-icone" aria-hidden="true">${iconeExtra}</div>
                    <div class="card-texto" aria-hidden="true">${cartaBackground.texto}</div>
                    <span class="subtexto" aria-hidden="true">Aguardando...</span>
                `;
            }
            
            container.appendChild(fake);
        }
    },

    ajustarEventosDoToast: function() {
        const toast = document.getElementById('toast-feedback');
        if (toast) {
            toast.onclick = (e) => {
                if (this.jogoPausado) return; 
                
                const vlibrasAtivo = document.getElementById('vlibras-cage');
                if (vlibrasAtivo && vlibrasAtivo.style.display === 'block') return;

                toast.classList.remove('show');
                this.tempoToastRestante = 0;

                const alertaCombo = document.getElementById('alerta-combo');
                if (alertaCombo) alertaCombo.classList.remove('show');
                this.tempoAlertaRestante = 0;
            };
        }
    },

    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.totalJogados}/${this.totalCartoesRodada}`;
    },

    // puxarNovaCarta: function() {
    //     if (this.filaCartoes.length === 0) {
    //         setTimeout(() => this.encerrar(true), 500); 
    //         return;
    //     }

    //     this.cartaAtual = this.filaCartoes.pop();
    //     const container = document.getElementById('cartoes-pilha');
        
    //     this.elCartao = document.createElement('div');
    //     this.elCartao.className = 'ficha-dado';
    //     this.elCartao.innerHTML = `
    //         <span aria-hidden="true">${this.cartaAtual.texto}</span>
    //         <span class="subtexto" aria-hidden="true">Avalie a ficha</span>
    //         <span class="sr-only">Ficha de paciente com o dado: ${this.cartaAtual.texto}</span>
    //     `;
        
    //     this.elCartao.addEventListener('pointerdown', (e) => this.iniciarSwipe(e));
    //     container.appendChild(this.elCartao);
        
    //     this._swipingBound = this.arrastarSwipe.bind(this);
    //     this._finalizarSwipeBound = this.finalizarSwipe.bind(this);
        
    //     document.addEventListener('pointermove', this._swipingBound);
    //     document.addEventListener('pointerup', this._finalizarSwipeBound);
    //     document.addEventListener('pointercancel', this._finalizarSwipeBound);
        
    //     this.montarPilhaVisual(); // Atualiza a sensação de volume atrás da carta atual
    // },

    puxarNovaCarta: function() {
        const container = document.getElementById('cartoes-pilha');
        // Não precisa mais do elCartao.remove() porque o montarPilhaVisual já zera tudo.

        if (this.filaCartoes.length === 0) {
            setTimeout(() => this.encerrar(true), 500); 
            return;
        }

        this.cartaAtual = this.filaCartoes.pop();
        
        // 1. MONTA O FUNDO PRIMEIRO (Isso limpa o container)
        this.montarPilhaVisual(); 
        
        // 2. CRIA A CARTA REAL E COLOCA POR CIMA
        this.elCartao = document.createElement('div');
        this.elCartao.className = 'ficha-dado';

        // Mapeamento dos Ícones Gigantes
        let iconeGrande = "📄";
        switch(this.cartaAtual.texto) {
            case "Nome Completo": iconeGrande = "🪪"; break;
            case "Foto de Rosto": iconeGrande = "🖼️"; break;
            case "CPF": iconeGrande = "🪪"; break;
            case "Endereço Residencial": iconeGrande = "🏠"; break;
            case "Idade": iconeGrande = "🎂"; break;
            case "Sexo": iconeGrande = "🚻"; break;
            case "Diagnóstico sem identificação": iconeGrande = "🩺"; break;
        }

        // Nova estrutura HTML interna do cartão
        this.elCartao.innerHTML = `
            <div class="card-icone" aria-hidden="true">${iconeGrande}</div>
            <div class="card-texto" aria-hidden="true">${this.cartaAtual.texto}</div>
            <span class="subtexto" aria-hidden="true">Avalie a ficha</span>
            <span class="sr-only">Ficha de paciente com o dado: ${this.cartaAtual.texto}</span>
        `;

        this.elCartao.addEventListener('pointerdown', (e) => this.iniciarSwipe(e));
        
        // Agora sim, adiciona a carta sem que ela seja apagada em seguida
        container.appendChild(this.elCartao);
        
        this._swipingBound = this.arrastarSwipe.bind(this);
        this._finalizarSwipeBound = this.finalizarSwipe.bind(this);

        document.addEventListener('pointermove', this._swipingBound);
        document.addEventListener('pointerup', this._finalizarSwipeBound);
        document.addEventListener('pointercancel', this._finalizarSwipeBound);
    },

    iniciarSwipe: function(e) {
        if (this.jogoPausado || (e.button !== 0 && e.type !== 'touchstart')) return; 
        e.preventDefault();
        
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.currentX = 0;
        
        this.elCartao.classList.add('dragging');
        document.getElementById('ind-descartar').style.opacity = '1';
        document.getElementById('ind-aprovar').style.opacity = '1';
    },

    arrastarSwipe: function(e) {
        if (!this.isDragging || !this.elCartao) return;
        e.preventDefault();
        
        this.currentX = e.clientX - this.startX;
        const rotateDeg = this.currentX * 0.05; // Gira levemente baseado no movimento X
        
        this.elCartao.style.transform = `translateX(${this.currentX}px) rotate(${rotateDeg}deg)`;
        
        // Efeito visual na carta dependendo do lado
        this.elCartao.classList.remove('hover-left', 'hover-right');
        if (this.currentX > 20) this.elCartao.classList.add('hover-right');
        if (this.currentX < -20) this.elCartao.classList.add('hover-left');
    },

    finalizarSwipe: function(e) {
        if (!this.isDragging || !this.elCartao) return;
        this.isDragging = false;
        
        document.getElementById('ind-descartar').style.opacity = '0';
        document.getElementById('ind-aprovar').style.opacity = '0';
        this.elCartao.classList.remove('dragging', 'hover-left', 'hover-right');
        
        if (this.currentX > this.threshold) {
            this.processarAcao('aprovar'); // Deslizou para Direita
        } else if (this.currentX < -this.threshold) {
            this.processarAcao('descartar'); // Deslizou para Esquerda
        } else {
            // Mola de volta ao centro
            this.elCartao.style.transform = `translateX(0px) rotate(0deg)`;
        }
    },

    // Esta função é chamada tanto pelo Swipe quanto pelos botões manuais na tela
    processarAcao: function(acao) {
        if (!this.elCartao || this.jogoPausado) return;
        
        document.removeEventListener('pointermove', this._swipingBound);
        document.removeEventListener('pointerup', this._finalizarSwipeBound);
        document.removeEventListener('pointercancel', this._finalizarSwipeBound);

        // Animação de saída da carta
        if (acao === 'aprovar') {
            this.elCartao.classList.add('anim-right');
        } else {
            this.elCartao.classList.add('anim-left');
        }

        // Lógica de Acerto: Aprovar exige dado "anonimo", Descartar exige "identifica"
        const acertou = (acao === 'aprovar' && this.cartaAtual.tipo === 'anonimo') || 
                        (acao === 'descartar' && this.cartaAtual.tipo === 'identifica');

        // Prepara a chave exata para buscar a mensagem do dicionário (ex: "aprovar_anonimo")
        const chaveMsg = `${acao}_${this.cartaAtual.tipo}`;
        const mensagemAtual = acertou ? DADOS_JOGO.interface.txtToastCorreto[chaveMsg] : DADOS_JOGO.interface.txtToastErro[chaveMsg];

        if (this.ultimoToastMensagem !== mensagemAtual) {
            const toast = document.getElementById('toast-feedback');
            if (toast) toast.classList.remove('show');
            this.tempoToastRestante = 0;

            const alertaCombo = document.getElementById('alerta-combo');
            if (alertaCombo) alertaCombo.classList.remove('show');
            this.tempoAlertaRestante = 0;
        }

        this.totalJogados++;

        if (acertou) {
            this.acertos++; this.acertosSeguidos++; this.errosSeguidos = 0;
            let isCombo = this.acertosSeguidos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');

            this.mostrarToast('sucesso', mensagemAtual);
        } else {
            this.acertosSeguidos = 0; this.errosSeguidos++;
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            if (this.errosSeguidos >= 3) this.dispararAlertaErros();
            this.mostrarToast('erro', mensagemAtual);
        }

        this.atualizarHUD(true);
        
        // Remove a carta velha do DOM após a animação de saída e puxa a próxima
        const oldCard = this.elCartao;
        setTimeout(() => {
            oldCard.remove();
            this.puxarNovaCarta();
        }, 300);
    },

    mostrarToast: function(tipo, mensagem) {
        if (this.ultimoToastMensagem === mensagem) return;
        this.ultimoToastMensagem = mensagem;
        GlobalEngine.mostrarToast.call(this, tipo, mensagem);
    },

    dispararAlertaErros: function() {
        const alerta = document.getElementById('alerta-combo');
        if (alerta) alerta.classList.add('show');
        this.errosSeguidos = 0; 
        this.ultimoToastMensagem = null; 
        this.tempoAlertaRestante = 10;

        if (alerta) {
            alerta.onclick = () => {
                if (this.jogoPausado) return; 
                alerta.classList.remove('show');
                this.tempoAlertaRestante = 0;
            };
        }
    }
};