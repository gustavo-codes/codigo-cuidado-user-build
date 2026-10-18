// ============================================================================
// REGRAS ESPECÍFICAS - FASE 7 (GESTÃO)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#455a64", // Slate Metálico
        corEscura: "#263238", 
        corClara: "#cfd8dc"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosAcerto: 15,
    pontosCombo: 25,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 7: Gestão",
        introDesc: "Você está na sala da gestão. Nem todo compartilhamento de dados de saúde é permitido. Avalie a finalidade de cada solicitação.",
        introDefinCurta: "<strong>Conceito:</strong> Compartilhamento de Dados na Saúde.",
        introDefin: "<strong>Conceito:</strong> A LGPD estabelece regras rígidas para compartilhar dados de saúde. É proibido compartilhar dados para obter vantagem econômica (venda de dados). O compartilhamento pela administração pública deve focar na execução de políticas públicas. Além disso, a gestão deve sempre garantir ao paciente o direito de acesso ao próprio prontuário e saber quem o acessou.",
        // introDica: "Analise o pedido e decida se deve ser <strong>PERMITIDO</strong>, <strong>PROIBIDO</strong>, ou se <strong>EXIGE AVALIAÇÃO</strong> (como pedir anonimização ou aprovação do comitê de ética).",
        introDica: "Analise o pedido e decida se deve ser <strong>PERMITIDO</strong> ou <strong>PROIBIDO</strong>.",
        introMeta: "Meta de Aprovação: Classificar corretamente 75% dos casos.",

        fimVitoriaTitulo: "Gestão Eficiente! ✅",
        fimVitoriaMsg: "Excelente! Você demonstrou que entende como proteger a unidade de saúde e os pacientes, permitindo apenas os compartilhamentos legais e os direitos dos titulares.",
        fimDerrotaTempoTitulo: "Acúmulo de Processos ❌",
        fimDerrotaTempoMsg: "O tempo acabou. Lembre-se de que a gestão de dados exige análise ágil para não paralisar as atividades nem violar direitos.",
        fimDerrotaMetaTitulo: "Conformidade Comprometida ❌",
        fimDerrotaMetaMsg: "A sua precisão foi baixa. Você permitiu vazamentos ou bloqueou direitos legítimos dos pacientes.",
        
        baseLegal: "<strong>⚖️ Art. 7, 11 e 23 da LGPD:</strong> O tratamento pela administração foca em políticas públicas. É expressamente vedado o compartilhamento de dados de saúde para vantagem econômica."
    },

    textosFeedback: {
        // acerto: "Correto. O compartilhamento ou ação atende à finalidade legítima, base legal adequada e respeita os direitos do titular.",
        // erro: "Atenção. Dados não podem ser compartilhados de forma indiscriminada nem para lucro. Direitos dos pacientes (como acesso ao prontuário) não podem ser negados."
        acerto: "Correto. O compartilhamento de dados deve ter finalidade legítima, base legal adequada e proteção compatível com a natureza das informações, especialmente no contexto da administração pública e da saúde. Base: art. 7, III; art. 11, §4º; art. 23.",
        erro: "Atenção. Dados de saúde não podem ser compartilhados de forma indiscriminada e nem para finalidade econômica indevida. É necessário avaliar a base legal, a finalidade e os riscos ao titular. Base: art. 11, §4º; art. 23."
    },

    bancoDeSituacoes: [
        { 
            origem: "Ministério da Saúde", 
            tipo: "Política Pública", 
            icone: "🏛️", 
            texto: "Solicita dados epidemiológicos anonimizados para planejamento de política pública de vacinação.", 
            correto: "permitir" 
        },
        // { 
        //     origem: "Hospital de Referência", 
        //     tipo: "Urgência Médica", 
        //     icone: "🚑", 
        //     texto: "Solicita o prontuário para realizar a transferência de um paciente em estado grave.", 
        //     correto: "permitir" 
        // },
        { 
            origem: "Paciente da Unidade de Saúde", 
            tipo: "Direito de Acesso", 
            icone: "👤", 
            texto: "Solicita um relatório formal de quais profissionais de saúde acessaram o seu prontuário no último mês.", 
            correto: "permitir" // Feedback específico sugerido pelo grupo de saúde
        },
        { 
            origem: "Paciente da Unidade de Saúde", 
            tipo: "Atualização Cadastral", 
            icone: "📝", 
            texto: "Solicita a atualização do seu endereço residencial e acesso imediato ao seu prontuário.", 
            correto: "permitir" // Feedback específico sugerido pelo grupo de saúde
        },
        { 
            origem: "Farmácia Externa", 
            tipo: "Comercial / Lucro", 
            icone: "💊", 
            // texto: "Solicita a compra de dados dos pacientes da unidade de saúde para direcionar propagandas de remédios.",
            texto: "Solicita dados do paciente para venda de medicamentos.",
            correto: "proibir" 
        },
        { 
            origem: "Familiar do Paciente", 
            tipo: "Direito de Acesso", 
            icone: "👤", 
            texto: "Solicita ao profissional informações do prontuário sem autorização do paciente.",
            // Familiar solicita ao profissional informações sobre doenca e ou tratamento
            correto: "proibir" 
        },
        { 
            origem: "Universidade Estadual", 
            tipo: "Pesquisa Acadêmica", 
            icone: "🎓", 
            // texto: "Deseja acessar dados identificados dos pacientes para uma pesquisa acadêmica sem autorização do Comitê de Ética.",
            texto: "Deseja acessar dados dos pacientes para uma pesquisa acadêmica sem autorização do Comitê de Ética.",
            correto: "proibir" // Exige aprovação de comitê de ética e/ou anonimização
        }
    ]
};

// Aplica o Tema CSS
// document.documentElement.style.setProperty('--cor-tema', DADOS_JOGO.tema.corPrincipal);
// document.documentElement.style.setProperty('--cor-tema-escuro', DADOS_JOGO.tema.corEscura);
// document.documentElement.style.setProperty('--cor-tema-claro', DADOS_JOGO.tema.corClara);

// ============================================================================
// CARREGAMENTO DO HTML (Textos)
// ============================================================================
// Aplica Textos na UI
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('txt-intro-titulo').innerText = DADOS_JOGO.interface.introTitulo;
    document.getElementById('txt-intro-desc').innerHTML = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin + "<br><br>";
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. ENGINE CENTRAL DO JOGO
// ============================================================================
const Engine = {
    ...GlobalEngine, // HERANÇA DO MOTOR GLOBAL

    casos: [], casoAtualIndice: 0, 
    pontuacao: 0, acertos: 0, comboAcertos: 0, totalErros: 0,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true,
    tempoToastRestante: 0, tempoAlertaRestante: 0, 

    iniciar: function() {
        // CHAMA O PAI (Ele resolve CSS, pausas, tempo, reset global)
        GlobalEngine.iniciar.call(this, 'flex');

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.casos = JSON.parse(JSON.stringify(DADOS_JOGO.bancoDeSituacoes));

        if (modoAleatorio) {
            this.casos.sort(() => Math.random() - 0.5);
        }

        this.casoAtualIndice = 0; this.pontuacao = 0;
        this.acertos = 0; this.comboAcertos = 0; this.totalErros = 0;
        this.tempoToastRestante = 0; this.tempoAlertaRestante = 0;

        this.carregarCaso();
    },

    // =========================================================
    // POLIMORFISMO: Cálculo de Precisão Específico (Acertos + Erros)
    // =========================================================
    calcularPrecisao: function() {
        const totalTentativas = this.acertos + this.totalErros;
        if (totalTentativas === 0) return 0;
        return Math.round((this.acertos / totalTentativas) * 100);
    },

    // =========================================================
    // HOOK DO PAI: Atualiza a info na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.acertos}/${this.casos.length}`;
    },

    // =========================================================
    // MECÂNICA EXCLUSIVA DA FASE 7
    // =========================================================
    carregarCaso: function() {
        // CONDIÇÃO DE VITÓRIA: Esvaziou a fila a tempo
        if (this.casoAtualIndice >= this.casos.length) {
            this.encerrar(true);
            return;
        }

        const caso = this.casos[this.casoAtualIndice];
        document.getElementById('contador-tabelas').innerText = `Solicitação ${this.casoAtualIndice + 1} / ${this.casos.length}`;
        
        document.getElementById('ui-icone').innerText = caso.icone;
        document.getElementById('ui-origem').innerText = caso.origem;
        document.getElementById('ui-tipo').innerText = caso.tipo;
        document.getElementById('ui-texto').innerText = `"${caso.texto}"`;

        const cartao = document.getElementById('cartao-ativo');
        cartao.classList.remove('anim-saida', 'tremor');
    },

    avaliar: function(escolha) {
        if (this.jogoPausado) return;

        const toast = document.getElementById('toast-feedback');
        if (toast) toast.classList.remove('show');
        this.tempoToastRestante = 0;
        
        const alertaCombo = document.getElementById('alerta-combo');
        if (alertaCombo) alertaCombo.classList.remove('show');
        this.tempoAlertaRestante = 0;

        if (typeof AudioSys !== 'undefined') AudioSys.tocar('click');
        const caso = this.casos[this.casoAtualIndice];
        const cartao = document.getElementById('cartao-ativo');
        
        const acertou = (escolha === caso.correto);

        if (acertou) {
            this.acertos++; this.comboAcertos++;
            let isCombo = this.comboAcertos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');
            
            this.mostrarToast('sucesso', DADOS_JOGO.textosFeedback.acerto);
            
            cartao.classList.add('anim-saida');
            this.jogoPausado = true;
            
            setTimeout(() => {
                this.casoAtualIndice++;
                this.carregarCaso();
                this.jogoPausado = false;
            }, 400);

        } else {
            this.totalErros++;
            this.comboAcertos = 0;
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            cartao.classList.add('tremor');
            setTimeout(() => cartao.classList.remove('tremor'), 400);
            
            this.mostrarToast('erro', DADOS_JOGO.textosFeedback.erro);

            if (this.totalErros >= 3 && this.totalErros % 2 !== 0) { // Dispara a cada 2 erros após o 3º
                this.dispararAlertaErros();
            }
        }

        if (this.atualizarHUD) this.atualizarHUD(true);
    },

    dispararAlertaErros: function() {
        const alerta = document.getElementById('alerta-combo');
        if (alerta) {
            alerta.classList.add('show');
            this.tempoAlertaRestante = 10;

            alerta.onclick = () => {
                if (this.jogoPausado) return; 
                alerta.classList.remove('show');
                this.tempoAlertaRestante = 0;
            };
        }
    }
};
