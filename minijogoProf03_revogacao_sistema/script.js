// ============================================================================
// REGRAS ESPECÍFICAS - FASE 3 (Sistema)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#f57c00", // Laranja
        corEscura: "#e65100", 
        corClara: "#ffe0b2"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 3: Sistema",
        introDesc: "O paciente deseja revogar o consentimento para o uso dos seus dados no sistema clínico.",
        introDefinCurta: "<strong>Conceito:</strong> Revogação de Consentimento.",
        introDefin: "<strong>Conceito:</strong> Quando o tratamento de dados for baseado no consentimento do titular, este pode ser revogado a qualquer momento. A LGPD determina que o processo de revogação deve ser gratuito e facilitado, sendo proibido criar barreiras burocráticas ou exigir justificativas complexas.",
        introDica: "Leia as opções de conduta no Terminal. Selecione a ação que garante os direitos do paciente de forma simples e rápida.",
        introMeta: "Meta de Aprovação: Processar os chamados com 75% de Precisão.",
        
        fimVitoriaTitulo: "Turno Concluído! ✅",
        fimVitoriaMsg: "Excelente! Você processou as solicitações respeitando os direitos dos titulares de forma gratuita e facilitada.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ❌",
        fimDerrotaTempoMsg: "O tempo acabou e os chamados acumularam. Lembre-se de que a revogação de consentimento deve ser um processo ágil.",
        fimDerrotaMetaTitulo: "Conformidade Baixa ❌",
        fimDerrotaMetaMsg: "Sua precisão demonstra que você criou barreiras indevidas ou ignorou os direitos dos pacientes.",
        
        baseLegal: "<strong>⚖️ Art. 8º, § 5º da LGPD:</strong> A revogação do consentimento deve ser efetuada por procedimento gratuito e facilitado.",

        txtErroBarreira: "Atenção. Criar barreiras indevidas contraria a LGPD. A revogação deve ser simples, gratuita e facilitada. Base: art. 8º, §5º.",
        txtAcerto: "Correto. Quando o tratamento for baseado no consentimento, o titular pode revogá-lo a qualquer momento sem burocracia. Base: art. 8º, §5º."
    },

    bancoDeSituacoes: [
        {
            descricao: "O paciente deseja revogar o consentimento para uso dos seus dados no sistema.",
            correta: "Confirmar solicitação e processar a revogação imediatamente.",
            incorreta: "Pedir justificativa obrigatória e documentada para poder cancelar."
        },
        {
            descricao: "O titular solicitou o cancelamento do envio de comunicações de saúde.",
            correta: "Suspender o envio de mensagens assim que o paciente pedir.",
            incorreta: "Solicitar preenchimento de vários formulários físicos na unidade."
        },
        {
            descricao: "Paciente quer interromper o consentimento anteriormente dado na unidade.",
            correta: "Disponibilizar um botão de cancelamento com um clique no próprio portal.",
            incorreta: "Dizer que o consentimento é irrevogável pois o tratamento já começou."
        },
        // {
        //     descricao: "Titular pergunta sobre taxas para a exclusão do registro na base de pesquisa.",
        //     correta: "Realizar o procedimento de revogação de forma totalmente gratuita.",
        //     incorreta: "Cobrar uma taxa administrativa para processar o pedido no sistema."
        // },
        {
            descricao: "Usuário deseja anular o consentimento que foi assinado digitalmente.",
            correta: "Atender à solicitação de forma facilitada pelo mesmo canal digital.",
            incorreta: "Exigir que o paciente compareça presencialmente com firma reconhecida."
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
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin;
    document.getElementById('render-defin-longa').innerHTML += "<br><br>"; // Espaço extra
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. ENGINE CENTRAL DO JOGO (Terminal Binário)
// ============================================================================
const Engine = {
    ...GlobalEngine, // Herança Mestra!

    chamados: [], ticketAtualIndice: 0, 
    pontuacao: 0, acertos: 0, totalJogados: 0,
    acertosSeguidos: 0, errosSeguidos: 0, bloqueado: false,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true,
    tempoToastRestante: 0, tempoAlertaRestante: 0, 

    // ADICIONE ESTAS 3 VARIÁVEIS AQUI:
    timeoutProxima: null, tempoRestanteTransicao: 0, tempoInicioTransicao: 0,

    iniciar: function() {
        // CHAMA O PAI (Ele resolve CSS, pausas, tempo, reset global)
        GlobalEngine.iniciar.call(this, 'flex');

        // Garante que a tela começa destravada
        const areaJogo = document.getElementById('area-jogo');
        if (areaJogo) areaJogo.classList.remove('bloqueado');

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.chamados = JSON.parse(JSON.stringify(DADOS_JOGO.bancoDeSituacoes));
        
        if (modoAleatorio) {
            this.chamados.sort(() => Math.random() - 0.5);
        }

        this.ticketAtualIndice = 0; this.pontuacao = 0; this.acertos = 0; this.totalJogados = 0;
        this.errosSeguidos = 0; this.acertosSeguidos = 0; this.bloqueado = false; this.ultimoToastAcerto = null;
        this.tempoToastRestante = 0; this.tempoAlertaRestante = 0; 

        // ADICIONE O RESET AQUI:
        this.tempoRestanteTransicao = 0; this.tempoInicioTransicao = 0;
        clearTimeout(this.timeoutProxima);

        this.carregarTicket();
    },

    // =========================================================
    // CONTROLE DE PAUSA INTELIGENTE DURANTE A TRANSIÇÃO
    // =========================================================
    togglePausa: function() {
        const estavaPausado = this.jogoPausado;
        GlobalEngine.togglePausa.call(this);

        if (this.bloqueado) {
            if (this.jogoPausado && !estavaPausado) {
                // Pausou: Cancela o temporizador e guarda o tempo restante
                clearTimeout(this.timeoutProxima);
                let tempoPassado = Date.now() - this.tempoInicioTransicao;
                this.tempoRestanteTransicao = Math.max(0, this.tempoRestanteTransicao - tempoPassado);
            } else if (!this.jogoPausado && estavaPausado) {
                // Despausou: Retoma exatamente com os milissegundos que faltavam
                this.tempoInicioTransicao = Date.now();
                this.timeoutProxima = setTimeout(() => {
                    this.avancarTicket();
                }, this.tempoRestanteTransicao);
            }
        }
    },

    // =========================================================
    // HOOK DO PAI: Atualiza a info na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.totalJogados}/${this.chamados.length}`;
    },

    // =========================================================
    // MECÂNICA EXCLUSIVA DA FASE 3
    // =========================================================
    carregarTicket: function() {
        // Se a fila de chamados esvaziou, o jogador cumpriu a tarefa (Manda 'true' para o Pai avaliar!)
        if (this.ticketAtualIndice >= this.chamados.length) {
            this.encerrar(true); 
            return;
        }

        const chamado = this.chamados[this.ticketAtualIndice];
        document.getElementById('contador-tickets').innerText = `${this.ticketAtualIndice + 1}/${this.chamados.length}`;
        document.getElementById('texto-solicitacao').innerText = `"${chamado.descricao}"`;
        
        // Opções de botões (embaralha a correta e a incorreta)
        const opcoes = [
            { texto: chamado.correta, correta: true },
            { texto: chamado.incorreta, correta: false }
        ];
        
        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        if (modoAleatorio) opcoes.sort(() => Math.random() - 0.5);

        const container = document.getElementById('container-botoes');
        container.innerHTML = ''; 
        
        opcoes.forEach((op, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-opcao';
            btn.id = `btn-op-${index}`;
            btn.innerText = op.texto;
            btn.onpointerdown = () => this.classificar(op.correta, index);
            container.appendChild(btn);
        });
    },

    classificar: function(isCorrect, indexBtn) {
        if (this.jogoPausado || this.bloqueado || this.ticketAtualIndice >= this.chamados.length) return;

        this.bloqueado = true; // Impede duplo clique

        // NOVO: Trava também o CSS e o HTML (desliga o hover/active dos botões)
        const areaJogo = document.getElementById('area-jogo');
        if (areaJogo) areaJogo.classList.add('bloqueado');

        // const toast = document.getElementById('toast-feedback');
        // toast.classList.remove('show');
        // this.tempoToastRestante = 0;

        // const alertaCombo = document.getElementById('alerta-combo');
        // alertaCombo.classList.remove('show');
        // this.tempoAlertaRestante = 0;

        if ( (isCorrect && this.ultimoToastAcerto === false) || (!isCorrect && this.ultimoToastAcerto === true) ) {
            // PADRÃO OURO: Limpa os alertas instantaneamente ao soltar uma carta
            const toast = document.getElementById('toast-feedback');
            if (toast) toast.classList.remove('show');
            // if(this.toastTimer) clearTimeout(this.toastTimer);
            this.tempoToastRestante = 0;
            // this.ultimoToastAcerto = null;

            // PADRÃO OURO: Limpa os alertas instantaneamente ao soltar uma carta
            const alertaCombo = document.getElementById('alerta-combo');
            if (alertaCombo) alertaCombo.classList.remove('show');
            // if(this.alertaTimer) clearTimeout(this.alertaTimer);
            this.tempoAlertaRestante = 0;
        }

        const btn = document.getElementById(`btn-op-${indexBtn}`);
        this.totalJogados++;

        if (isCorrect) {
            btn.classList.add('certo');
            this.acertos++; this.acertosSeguidos++; this.errosSeguidos = 0;
            let isCombo = this.acertosSeguidos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');
            this.mostrarToast(true);
        } else {
            btn.classList.add('errado');
            this.acertosSeguidos = 0;
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true); 
            
            this.errosSeguidos++;
            if (this.errosSeguidos >= 2) { // Na Fase 3 o limite de combo de erros era 2
                this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
                this.dispararAlertaErros();
                // this.errosSeguidos = 0;
                // this.ultimoToastAcerto = null; // Reseta anti-spam
            }

            this.mostrarToast(false);
        }

        this.atualizarHUD(true);
        
        // Aguarda o feedback visual antes de puxar o próximo ticket
        // setTimeout(() => {
        //     this.ticketAtualIndice++;
        //     this.bloqueado = false;

        //     // NOVO: Destrava o CSS para a próxima pergunta
        //     if (areaJogo) areaJogo.classList.remove('bloqueado');

        //     this.carregarTicket();
        // }, 1200);

        // SUBSTITUA O setTimeout ANTIGO POR ISTO:
        this.tempoRestanteTransicao = 1200; // Tempo para mostrar o feedback visual
        this.tempoInicioTransicao = Date.now();
        
        this.timeoutProxima = setTimeout(() => {
            this.avancarTicket();
        }, this.tempoRestanteTransicao);
    },

    avancarTicket: function() {
        this.ticketAtualIndice++;
        this.bloqueado = false; 
        
        const areaJogo = document.getElementById('area-jogo');
        if (areaJogo) areaJogo.classList.remove('bloqueado');
        
        this.carregarTicket();
    },

    // =========================================================
    // POLIMORFISMO: Customização Visual dos Toasts + Anti-Spam
    // =========================================================
    mostrarToast: function(acertou) {
        // Anti-spam para não piscar o mesmo toast repetidamente
        if (this.ultimoToastAcerto === acertou) return;
        this.ultimoToastAcerto = acertou;

        const toast = document.getElementById('toast-feedback');
        const titulo = document.getElementById('toast-titulo');
        const texto = document.getElementById('toast-texto');
        if (!toast || !titulo || !texto) return;

        toast.className = '';
        
        if (acertou) {
            toast.classList.add('sucesso');
            titulo.innerText = "Conduta Aprovada ✅";
            texto.innerText = DADOS_JOGO.interface.txtAcerto;
        } else {
            toast.classList.add('erro');
            titulo.innerText = "Conduta Bloqueada 🛑";
            texto.innerText = DADOS_JOGO.interface.txtErroBarreira;
        }

        toast.classList.add('show');
        this.tempoToastRestante = 10;

        toast.onclick = () => {
            if (this.jogoPausado) return; 
            toast.classList.remove('show');
            this.tempoToastRestante = 0;
            // this.ultimoToastAcerto = null;

            const alertaCombo = document.getElementById('alerta-combo');
            if (alertaCombo) alertaCombo.classList.remove('show');
            this.tempoAlertaRestante = 0;
        };
    },

    dispararAlertaErros: function() {
        const alerta = document.getElementById('alerta-combo');
        if (alerta) alerta.classList.add('show');
        this.errosSeguidos = 0; // Zera a contagem para o próximo combo de erros
        this.ultimoToastAcerto = null; // Libera o anti-spam do toast para que ele possa aparecer novamente
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
