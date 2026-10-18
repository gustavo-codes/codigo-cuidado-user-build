// ============================================================================
// REGRAS ESPECÍFICAS - FASE 6 (PEDIATRIA)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#e91e63", // Rosa/Magenta
        corEscura: "#c2185b", 
        corClara: "#fce4ec"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosAcerto: 15,
    pontosCombo: 25,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 6: Pediatria",
        introDesc: "Em atendimentos pediátricos, é obrigatório avaliar a presença do responsável, salvo em situações de urgência.",
        introDica: "Avalie o estado da criança. Exija o responsável em consultas de rotina. Atenda imediatamente em caso de emergência.",
        introMeta: "Meta de Aprovação: Classificar corretamente 75% dos casos.",
        
        fimVitoriaTitulo: "Atendimento Excelente! ✅",
        fimVitoriaMsg: "Excelente! Você respeitou o melhor interesse das crianças, protegendo seus dados e garantindo assistência rápida nas urgências.",
        fimDerrotaTempoTitulo: "Fila de Espera ❌",
        fimDerrotaTempoMsg: "O tempo acabou. Lembre-se que em pediatria, agilidade na urgência e proteção de dados andam juntos.",
        fimDerrotaMetaTitulo: "Conduta Inadequada ❌",
        fimDerrotaMetaMsg: "A sua precisão foi baixa. Os dados de crianças exigem proteção reforçada e atenção obrigatória ao responsável legal.",
        
        baseLegal: "<strong>⚖️ Art. 14 da LGPD:</strong> O tratamento de dados de crianças deve ocorrer em seu melhor interesse, exigindo consentimento de um dos pais. Em urgências clínicas, a proteção à vida prevalece."
    },

    // textosFeedback: {
    //     acerto_responsavel: "Correto. No atendimento habitual de crianças, deve-se observar seu melhor interesse e a participação de um dos pais.",
    //     acerto_urgencia: "Correto. Em situação de urgência, a proteção da criança e a necessidade assistencial orientam a conduta.",
    //     erro: "Atenção. Dados de crianças exigem proteção especial. No atendimento habitual, exija o responsável. Não atenda sozinho sem urgência."
    // },

    // textosFeedback: {
    //     acerto_responsavel: "Correto. No atendimento habitual de crianças, deve-se observar seu melhor interesse e, em regra, a participação de pelo menos um dos pais ou responsável legal.\nBase: art. 14, caput e §1º.",
    //     acerto_urgencia: "Correto. Em situação de urgência, a proteção da criança e a necessidade assistencial devem orientar a conduta, sempre com atenção ao seu melhor interesse.\nBase: art. 14, caput.",
    //     erro: "Atenção. Dados de crianças exigem proteção especial. No atendimento habitual, deve-se observar o melhor interesse da criança e, em regra, a atuação de pelo menos um dos pais ou responsável legal.\nBase: art. 14, caput e §1º."
    // },

    textosFeedback: {
        acerto_responsavel: "Correto. No atendimento habitual de crianças, deve-se observar seu melhor interesse e, em regra, a participação de pelo menos um dos pais ou responsável legal. Base: art. 14, caput e §1º.",
        acerto_urgencia: "Correto. Em situação de urgência, a proteção da criança e a necessidade assistencial devem orientar a conduta, sempre com atenção ao seu melhor interesse. Base: art. 14, caput.",
        erro: "Atenção. Dados de crianças exigem proteção especial. No atendimento habitual, exija o responsável. Não atenda sozinho sem urgência. Base: art. 14, caput e §1º."
    },

    // bancoDeSituacoes: [
    //     { nome: "Lucas", idade: "8 anos", icone: "👦🏽", situacao: "Quer atualizar o endereço e o telefone no seu cadastro da clínica.", correto: "responsavel" },
    //     { nome: "Laura", idade: "13 anos", icone: "👧🏻", situacao: "Chega sozinha à recepção com febre muito alta e falta de ar.", correto: "urgencia" },
    //     { nome: "Mariana", idade: "12 anos", icone: "👧🏾", situacao: "Veio sozinha agendar um retorno com o dentista para a próxima semana.", correto: "responsavel" },
    //     { nome: "Pedro", idade: "6 anos", icone: "👦🏼", situacao: "Trazido por um vizinho após sofrer um corte profundo brincando na rua.", correto: "urgencia" },
    //     { nome: "Ana", idade: "14 anos", icone: "👧🏿", situacao: "Entra no consultório pedindo a renovação de uma receita médica de rotina.", correto: "responsavel" },
    //     { nome: "João", idade: "10 anos", icone: "👦🏾", situacao: "Chega chorando muito com suspeita de fratura no braço após queda de bicicleta.", correto: "urgencia" },
    //     { nome: "Tiago", idade: "9 anos", icone: "👦🏻", situacao: "Pede informações detalhadas sobre o resultado do seu exame de sangue.", correto: "responsavel" },
    //     { nome: "Sofia", idade: "11 anos", icone: "👧🏼", situacao: "Chega inconsciente trazida por pessoas que passavam no local.", correto: "urgencia" },
    //     { nome: "Beatriz", idade: "7 anos", icone: "👧🏽", situacao: "Veio apenas acompanhar o irmão mais velho que fará exames.", correto: "responsavel" },
    //     { nome: "Carlos", idade: "15 anos", icone: "👦🏿", situacao: "Chega ao balcão apresentando reação alérgica severa e inchaço no rosto.", correto: "urgencia" }
    // ]

    bancoDeSituacoes: [
        { 
            nome: "Lucas", 
            idade: "8 anos", 
            // icone: "👦🏽", 
            icone: "☹️", 
            // iconeImg: iconeTristeClaro, // Versão gerada
            situacao: "Chegou sozinho à UBS (Unidade Básica de Saúde), apresentando coceira entre os dedos.", 
            correto: "responsavel" 
        },
        {
            nome: "Mariana",
            idade: "9 anos",
            // icone: "👧🏼",
            icone: "🥺",
            // iconeImg: iconeTristeClaro, // Versão gerada
            situacao: "Chegou sozinha e quer atualizar o endereço e o telefone no seu cadastro da UBS (Unidade Básica de Saúde).",
            correto: "responsavel"
        },
        { 
            nome: "Laura", 
            idade: "7 anos", 
            // icone: "👧🏻", 
            icone: "🤒", 
            // iconeImg: iconeFebreEscuro, // Versão com febre
            situacao: "Saiu da escola e foi direto à UBS (Unidade Básica de Saúde), que fica ao lado, com falta de ar e febre.", 
            correto: "urgencia" 
        },
        {
            nome: "Tiago",
            idade: "8 anos",
            // icone: "👦🏻",
            icone: "😭",
            // iconeImg: iconeChorandoMedio,
            situacao: "Chegou chorando muito com suspeita de fratura no braço após queda de bicicleta.",
            correto: "urgencia"
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
    document.getElementById('txt-intro-desc').innerText = DADOS_JOGO.interface.introDesc;
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. ENGINE CENTRAL DO JOGO
// ============================================================================
const Engine = {
    ...GlobalEngine, // HERANÇA MASTER

    casos: [], casoAtualIndice: 0, 
    pontuacao: 0, acertos: 0, comboAcertos: 0, totalErros: 0,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true, toastTimer: null,
    tempoToastRestante: 0, // NOVO: Relógio interno do alerta

    iniciar: function() {
        // CHAMA O PAI (Ele resolve CSS, pausas, tempo, reset global)
        GlobalEngine.iniciar.call(this, 'flex');

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.casos = JSON.parse(JSON.stringify(DADOS_JOGO.bancoDeSituacoes));

        if (modoAleatorio) {
            this.casos.sort(() => Math.random() - 0.5);
        }

        this.casoAtualIndice = 0; this.pontuacao = 0;
        this.acertos = 0; this.comboAcertos = 0;
        this.totalErros = 0; // ADICIONE ESTA LINHA
        this.tempoToastRestante = 0; // Zera ao reiniciar

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
    // MECÂNICA EXCLUSIVA DA FASE 6
    // =========================================================
    carregarCaso: function() {
        // CONDIÇÃO DE VITÓRIA: Se esvaziou a fila de pacientes a tempo
        if (this.casoAtualIndice >= this.casos.length) {
            this.encerrar(true); 
            return;
        }

        const caso = this.casos[this.casoAtualIndice];
        document.getElementById('contador-tabelas').innerText = `Caso ${this.casoAtualIndice + 1} / ${this.casos.length}`;
        
        const uiIcone = document.getElementById('ui-icone');
        if (caso.iconeImg) {
            uiIcone.innerHTML = `<img src="${caso.iconeImg}" style="width: 100%; border-radius: 50%;">`;
        } else {
            uiIcone.innerText = caso.icone;
        }
        // document.getElementById('ui-icone').innerText = caso.icone;
        document.getElementById('ui-nome').innerText = caso.nome;
        document.getElementById('ui-idade').innerText = caso.idade;
        document.getElementById('ui-situacao').innerText = caso.situacao;

        const cartao = document.getElementById('cartao-ativo');
        cartao.classList.remove('anim-saida', 'tremor');
    },

    avaliar: function(escolha) {
        if (this.jogoPausado) return;

        // PADRÃO OURO: Limpa o alerta instantaneamente na nova tentativa
        const toast = document.getElementById('toast-feedback');
        if (toast) toast.classList.remove('show');
        this.tempoToastRestante = 0;

        if (typeof AudioSys !== 'undefined') AudioSys.tocar('click');
        const caso = this.casos[this.casoAtualIndice];
        const cartao = document.getElementById('cartao-ativo');
        
        // Avalia se o jogador escolheu o botão correto. 
        // "sozinho" nunca é correto nas situações programadas.
        const acertou = (escolha === caso.correto);

        if (acertou) {
            this.acertos++; this.comboAcertos++;
            let isCombo = this.comboAcertos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');
            
            // Texto específico para o tipo de acerto
            let msg = caso.correto === 'urgencia' ? DADOS_JOGO.textosFeedback.acerto_urgencia : DADOS_JOGO.textosFeedback.acerto_responsavel;
            this.mostrarToast('sucesso', msg);

            // Anima o cartão sumindo
            cartao.classList.add('anim-saida');
            this.jogoPausado = true;
            
            setTimeout(() => {
                this.casoAtualIndice++;
                this.carregarCaso();
                this.jogoPausado = false;
            }, 400);

        } else {
            this.totalErros++; // ADICIONE ESTA LINHA dentro do 'else'
            this.comboAcertos = 0;
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            cartao.classList.add('tremor');
            setTimeout(() => cartao.classList.remove('tremor'), 400);
            
            this.mostrarToast('erro', DADOS_JOGO.textosFeedback.erro);
        }

        if (this.atualizarHUD) this.atualizarHUD(true);
    }
};
