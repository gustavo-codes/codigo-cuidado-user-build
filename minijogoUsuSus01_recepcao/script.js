// ============================================================================
// REGRAS ESPECÍFICAS - FASE 1 USUÁRIO DO SUS (Recepção)
// ============================================================================

const DADOS_JOGO = {
    tema: {
        corPrincipal: "#00897b", 
        corEscura: "#00695c", 
        corClara: "#e0f2f1"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 70,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 1: Recepção da UBS",
        // introDesc: "Você chegou à Unidade Básica de Saúde e precisa informar alguns dados para o seu cadastro.",
        introDesc: "Você chegou à recepção da Unidade Básica de Saúde e precisa fornecer algumas informações para realizar seu cadastro.",
        introDefinCurta: "<strong>Dica:</strong> Identifique os dados que exigem mais sigilo.",
        introDefin: "<strong>Protegendo suas informações:</strong><br><br>Alguns dados podem ser informados normalmente, pois servem para contato (como E-mail). Outros revelam aspectos íntimos da sua vida e da sua saúde (como Exames e CPF), e exigem que a unidade de saúde tenha muito mais cuidado para protegê-los contra vazamentos.",
        introDica: "<strong>Arraste os cartões</strong> para a caixa correspondente.",
        // introMeta: "Meta: Classificar as informações corretamente.",
        introMeta: "Meta de Aprovação: Classificar TUDO com {META}% de Precisão.",

        fimVitoriaTitulo: "Tudo Certo! ✅",
        fimVitoriaMsg: "Excelente! Você compreende bem a importância de proteger as suas informações de saúde na recepção.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ⏳",
        fimDerrotaTempoMsg: "O tempo acabou antes que você terminasse o cadastro. Na recepção, a agilidade é importante, mas a segurança vem primeiro.",
        fimDerrotaMetaTitulo: "Atenção aos Riscos ⚠️",
        fimDerrotaMetaMsg: "Algumas dessas informações podem expor sua identidade ou dados íntimos. Nem todos os dados devem ser compartilhados sem cautela.",
        // baseLegal: "<strong>Na recepção</strong>, compartilhar informações é necessário, mas é importante reconhecer quais dados exigem maior proteção e não devem ser ditos em voz alta para todos ouvirem. (Base: Art. 6º da LGPD).",
        baseLegal: "<strong>⚖️ Art. 6º da LGPD:</strong> Na recepção, compartilhar informações é necessário, mas é importante reconhecer quais dados exigem maior proteção e não devem ser ditos em voz alta para todos ouvirem.",

        // MENSAGENS DIFERENCIADAS POR TIPO
        txtToastCorreto: {
            comum: "Correto! Dados como esse servem apenas para contato ou triagem simples, podendo ser fornecidos sem grande risco.",
            // protegido: "Perfeito! Este é um dado sensível ou de identificação direta e exige máxima proteção e sigilo no atendimento."
            protegido: "Correto. Informações que identificam diretamente o usuário ou revelam dados de saúde devem ser tratadas com maior proteção, mesmo em ambientes de atendimento."
        },
        txtToastErro: {
            comum: "Atenção! Este é um dado comum, não exigindo o mesmo grau rigoroso de sigilo que um dado de saúde.",
            // protegido: "Cuidado! Este dado é crítico. Ele revela detalhes íntimos ou de identificação e não deve ser exposto facilmente."
            protegido: "Atenção. Algumas dessas informações podem expor sua identidade ou dados de saúde. Nem todos os dados devem ser compartilhados sem cautela."
        }
    },

    bancoDeDados: [
        { texto: "Idade", tipo: "comum" },
        { texto: "E-mail", tipo: "comum" },
        { texto: "CPF", tipo: "protegido" },
        { texto: "Resultado de Exames", tipo: "protegido" },
        { texto: "Nº do Cartão do SUS", tipo: "protegido" },
        { texto: "Endereço Completo", tipo: "protegido" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('txt-intro-titulo').innerText = DADOS_JOGO.interface.introTitulo;
    document.getElementById('txt-intro-desc').innerText = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin + "<br><br>";
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    // Pega a frase, troca o marcador {META} pelo número, e injeta na tela
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
    ultimoToastAcerto: null,
    tempoToastRestante: 0, tempoAlertaRestante: 0,
    elCartao: null, cloneDrag: null, offsetX: 0, offsetY: 0,

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

        document.getElementById('mini-comum').innerHTML = '';
        document.getElementById('mini-protegido').innerHTML = '';

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.filaCartoes = [...DADOS_JOGO.bancoDeDados];
        if (modoAleatorio) this.filaCartoes.sort(() => Math.random() - 0.5);
        this.totalCartoesRodada = this.filaCartoes.length;

        this.acertos = 0; 
        this.totalJogados = 0;
        this.errosSeguidos = 0; 
        this.acertosSeguidos = 0; 
        // this.ultimoToastAcerto = null;
        this.ultimoToastMensagem = null; // Reseta a memória de mensagens

        this.puxarNovaCarta();
        this.ajustarEventosDoToast();
    },

    ajustarEventosDoToast: function() {
        // Intercepta o clique do Toast para ele não sumir se o VLibras estiver querendo traduzir
        const toast = document.getElementById('toast-feedback');
        if (toast) {
            toast.onclick = (e) => {
                if (this.jogoPausado) return; 
                
                // Se o VLibras está ativado na tela, o jogador clicou para traduzir, não para fechar!
                const vlibrasAtivo = document.getElementById('vlibras-cage');
                if (vlibrasAtivo && vlibrasAtivo.style.display === 'block') {
                    return; // Aborta o fechamento!
                }

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

    puxarNovaCarta: function() {
        const container = document.getElementById('container-cartao');
        if (this.elCartao) this.elCartao.remove();

        if (this.filaCartoes.length === 0) {
            this.encerrar(true); 
            return;
        }

        this.cartaAtual = this.filaCartoes.pop();
        
        this.elCartao = document.createElement('div');
        this.elCartao.className = 'cartao-dado';
        
        // Estrutura acessível para o cartão
        this.elCartao.innerHTML = `
            <span aria-hidden="true">${this.cartaAtual.texto}</span>
            <span class="sr-only">Cartão contendo o dado: ${this.cartaAtual.texto}</span>
        `;
        
        this.elCartao.addEventListener('pointerdown', (e) => this.iniciarArraste(e));
        container.appendChild(this.elCartao);
        
        this._arrastarBound = this.arrastar.bind(this);
        this._finalizarArrasteBound = this.finalizarArraste.bind(this);
        this._abortarArrasteBound = this.abortarArraste.bind(this);

        document.addEventListener('pointermove', this._arrastarBound);
        document.addEventListener('pointerup', this._finalizarArrasteBound);
        document.addEventListener('pointercancel', this._abortarArrasteBound);
    },

    iniciarArraste: function(e) {
        if (this.jogoPausado || (e.button !== 0 && e.type !== 'touchstart')) return; 
        e.preventDefault();
        
        const rect = this.elCartao.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        this.cloneDrag = this.elCartao.cloneNode(true);
        this.cloneDrag.className = 'cartao-dado cartao-dragging';
        this.cloneDrag.style.position = 'absolute';
        this.cloneDrag.style.left = rect.left + 'px';
        this.cloneDrag.style.top = rect.top + 'px';
        this.cloneDrag.style.width = rect.width + 'px';
        
        document.body.appendChild(this.cloneDrag);
        this.elCartao.style.opacity = '0'; 
    },

    arrastar: function(e) {
        if (!this.cloneDrag) return;
        e.preventDefault();
        this.cloneDrag.style.left = (e.clientX - this.offsetX) + 'px';
        this.cloneDrag.style.top = (e.clientY - this.offsetY) + 'px';
    },

    finalizarArraste: function(e) {
        if (!this.cloneDrag) return;

        const rectClone = this.cloneDrag.getBoundingClientRect();
        const centroX = rectClone.left + rectClone.width / 2;
        const centroY = rectClone.top + rectClone.height / 2;

        const alvos = [
            document.getElementById('alvo-comum'),
            document.getElementById('alvo-protegido')
        ];

        let alvoEncontrado = null;

        for (let alvo of alvos) {
            const rectAlvo = alvo.getBoundingClientRect();
            if (centroX >= rectAlvo.left && centroX <= rectAlvo.right && 
                centroY >= rectAlvo.top && centroY <= rectAlvo.bottom) {
                alvoEncontrado = alvo;
                break;
            }
        }

        if (alvoEncontrado) {
            this.processarSoltura(alvoEncontrado.dataset.tipo, alvoEncontrado);
        } else {
            this.abortarArraste();
        }
    },

    abortarArraste: function() {
        if (this.elCartao) this.elCartao.style.opacity = '1';
        if (this.cloneDrag) this.cloneDrag.remove();
        this.cloneDrag = null;
    },

    processarSoltura: function(tipoCaixa, divCaixa) {
        this.abortarArraste(); 

        const acertou = (tipoCaixa === this.cartaAtual.tipo);

        // Prepara a MENSAGEM EXATA que será exibida para comparar com o anti-spam
        const mensagemAtual = acertou ? DADOS_JOGO.interface.txtToastCorreto[this.cartaAtual.tipo] : DADOS_JOGO.interface.txtToastErro[this.cartaAtual.tipo];

        // Se a mensagem for diferente da que está na tela, recolhe a caixa imediatamente
        if (this.ultimoToastMensagem !== mensagemAtual) {
        // if ( (acertou && this.ultimoToastAcerto === false) || (!acertou && this.ultimoToastAcerto === true) ) {
            const toast = document.getElementById('toast-feedback');
            if (toast) toast.classList.remove('show');
            this.tempoToastRestante = 0;

            const alertaCombo = document.getElementById('alerta-combo');
            if (alertaCombo) alertaCombo.classList.remove('show');
            this.tempoAlertaRestante = 0;
        }

        this.totalJogados++;

        divCaixa.classList.add('flash');
        setTimeout(() => divCaixa.classList.remove('flash'), 250);

        const containerMiniaturas = divCaixa.querySelector('.miniaturas-container');
        const mini = document.createElement('div');
        mini.className = 'mini-card ' + (acertou ? 'sucesso' : 'erro');
        mini.innerText = this.cartaAtual.texto;
        containerMiniaturas.appendChild(mini);

        if (acertou) {
            this.acertos++; this.acertosSeguidos++; this.errosSeguidos = 0;
            let isCombo = this.acertosSeguidos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');

            // Passa a mensagem específica do Dicionário
            this.mostrarToast('sucesso', DADOS_JOGO.interface.txtToastCorreto[this.cartaAtual.tipo]);
        } else {
            this.acertosSeguidos = 0; this.errosSeguidos++;
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            if (this.errosSeguidos >= 3) this.dispararAlertaErros();
            
            // Passa a mensagem específica do Dicionário
            this.mostrarToast('erro', DADOS_JOGO.interface.txtToastErro[this.cartaAtual.tipo]);
        }

        this.atualizarHUD(true);
        this.elCartao.style.display = 'none'; 
        
        document.removeEventListener('pointermove', this._arrastarBound);
        document.removeEventListener('pointerup', this._finalizarArrasteBound);
        document.removeEventListener('pointercancel', this._abortarArrasteBound);

        setTimeout(() => this.puxarNovaCarta(), 100); 
    },

    mostrarToast: function(tipo, mensagem) {
        // const acertou = (tipo === 'sucesso');
        // if (this.ultimoToastAcerto === acertou) return;
        // this.ultimoToastAcerto = acertou;

        // O anti-spam agora checa a MENSAGEM exata, não apenas se foi "sucesso" ou "erro"
        if (this.ultimoToastMensagem === mensagem) return;
        this.ultimoToastMensagem = mensagem;

        GlobalEngine.mostrarToast.call(this, tipo, mensagem);
    },

    dispararAlertaErros: function() {
        const alerta = document.getElementById('alerta-combo');
        if (alerta) alerta.classList.add('show');
        this.errosSeguidos = 0; 
        // this.ultimoToastAcerto = null; 
        this.ultimoToastMensagem = null; // Libera o anti-spam para forçar o toast a aparecer novamente
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