// ============================================================================
// REGRAS ESPECÍFICAS - FASE 2 USUÁRIO DO SUS (Triagem)
// ============================================================================

const DADOS_JOGO = {
    tema: {
        corPrincipal: "#0277bd", 
        corEscura: "#01579b", 
        corClara: "#e1f5fe"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 70,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 2: Triagem",
        introDesc: "Durante a triagem, o profissional coleta informações sobre sua saúde.",
        introDefinCurta: "<strong>Dica:</strong> Saiba separar dados comuns de dados de saúde.",
        introDefin: "<strong>Protegendo suas informações:</strong><br><br>Na área da saúde, dados que revelam seu histórico médico, doenças ou exames são considerados <strong>Dados Sensíveis</strong>. Eles exigem um cuidado muito maior do que dados pessoais comuns (como Nome e E-mail), pois o vazamento deles pode gerar discriminação ou prejuízos ainda maiores à sua vida.",
        introDica: "<strong>Arraste os cartões</strong> para a categoria correta.",
        introMeta: "Meta de Aprovação: Classificar TUDO com {META}% de Precisão.",

        fimVitoriaTitulo: "Triagem Concluída! ✅",
        fimVitoriaMsg: "Excelente! Na área da saúde, nem todos os dados têm o mesmo nível de proteção e você soube diferenciá-los perfeitamente.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ⏳",
        fimDerrotaTempoMsg: "O tempo acabou. Na triagem, o atendimento precisa ser seguro e ágil.",
        fimDerrotaMetaTitulo: "Atenção aos Riscos ⚠️",
        fimDerrotaMetaMsg: "Você confundiu alguns dados sensíveis com dados comuns. Dados de saúde exigem rigor extremo para não expor a sua privacidade.",
        baseLegal: "<strong>⚖️ Art. 5º, II da LGPD:</strong> Dados sobre a saúde são classificados como 'dados pessoais sensíveis' e exigem o mais alto nível de segurança contra vazamentos.",

        // MENSAGENS DIFERENCIADAS POR TIPO
        txtToastCorreto: {
            pessoal: "Correto! Esse é apenas um dado pessoal que serve para identificar ou contatar você.",
            sensivel: "Correto! Dados relacionados à saúde são considerados sensíveis e exigem maior proteção."
        },
        txtToastErro: {
            pessoal: "Atenção. Esse dado apenas identifica você, não revela detalhes íntimos sobre sua saúde.",
            sensivel: "Atenção! Dados de saúde são classificados como sensíveis e requerem tratamento mais rigoroso."
        }
    },

    bancoDeDados: [
        { texto: "Nome", tipo: "pessoal" },
        { texto: "Idade", tipo: "pessoal" },
        { texto: "E-mail", tipo: "pessoal" },
        { texto: "Doenças", tipo: "sensivel" },
        { texto: "Exames", tipo: "sensivel" },
        { texto: "Histórico médico", tipo: "sensivel" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('txt-intro-titulo').innerText = DADOS_JOGO.interface.introTitulo;
    document.getElementById('txt-intro-desc').innerText = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin + "<br><br>";
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    
    // Substituição dinâmica da {META}
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

        document.getElementById('mini-pessoal').innerHTML = '';
        document.getElementById('mini-sensivel').innerHTML = '';

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.filaCartoes = [...DADOS_JOGO.bancoDeDados];
        if (modoAleatorio) this.filaCartoes.sort(() => Math.random() - 0.5);
        this.totalCartoesRodada = this.filaCartoes.length;

        this.acertos = 0; 
        this.totalJogados = 0;
        this.errosSeguidos = 0; 
        this.acertosSeguidos = 0; 
        this.ultimoToastMensagem = null;

        this.puxarNovaCarta();
        this.ajustarEventosDoToast();
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
            document.getElementById('alvo-pessoal'),
            document.getElementById('alvo-sensivel')
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
        const mensagemAtual = acertou ? DADOS_JOGO.interface.txtToastCorreto[this.cartaAtual.tipo] : DADOS_JOGO.interface.txtToastErro[this.cartaAtual.tipo];

        if (this.ultimoToastMensagem !== mensagemAtual) {
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

            this.mostrarToast('sucesso', DADOS_JOGO.interface.txtToastCorreto[this.cartaAtual.tipo]);
        } else {
            this.acertosSeguidos = 0; this.errosSeguidos++;
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            if (this.errosSeguidos >= 3) this.dispararAlertaErros();
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