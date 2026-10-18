// ============================================================================
// REGRAS ESPECÍFICAS - FASE 4 (PORTAL DO PACIENTE)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#3949ab", // Índigo
        corEscura: "#283593", 
        corClara: "#e8eaf6"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        // introTitulo: "Fase 4: Portal do Paciente",
        introTitulo: "Fase 4: Prontuário Eletrônico",
        // introDesc: "Você está no atendimento do Portal, avaliando as solicitações que os pacientes fazem sobre os próprios dados.",
        introDesc: "Avalie as solicitações dos pacientes.",
        introDica: "Analise os pedidos. <strong>Atenda</strong> as solicitações que garantem os Direitos dos Titulares. <strong>Negue</strong> pedidos abusivos ou perigosos.",
        introMeta: "Meta de Aprovação: Analisar as solicitações com 75% de Precisão.",
        
        fimVitoriaTitulo: "Prontuário Concluído! ✅",
        fimVitoriaMsg: "Excelente! Garantir os direitos do paciente, como o acesso e a correção de dados, faz parte essencial da LGPD na saúde.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ❌",
        fimDerrotaTempoMsg: "O tempo acabou e os pacientes ficaram sem resposta. A lei exige prazos razoáveis para atender solicitações.",
        fimDerrotaMetaTitulo: "Direitos Violados ❌",
        fimDerrotaMetaMsg: "A sua precisão demonstra desconformidade. Você negou direitos garantidos ou aceitou pedidos inseguros.",
        
        baseLegal: "<strong>⚖️ Art. 18 da LGPD:</strong> O paciente tem direito a acesso (II), correção de dados inexatos (III) e anonimização/eliminação de dados excessivos (IV)."
    },

    textosFeedback: {
        acerto_acesso: "Correto. O titular tem direito de obter acesso aos seus dados pessoais. Base: art. 18, II.",
        erro_acesso: "Atenção. O paciente tem direito de acessar seus próprios dados pessoais, observado o procedimento adequado do serviço. Base: art. 18, II.",
        
        acerto_correcao: "Correto. O titular tem direito à correção de dados incompletos, inexatos ou desatualizados. Base: art. 18, III.",
        erro_correcao: "Atenção. Dados incorretos ou desatualizados devem ser corrigidos quando houver solicitação legítima do titular. Base: art. 18, III.",
        
        acerto_invalido: "Correto. Solicitações abusivas, inseguras ou que violam a retenção legal devem ser negadas. Base: art. 18, IV.",
        erro_invalido: "Atenção. Este pedido não deveria ser aceito, pois contraria normas de segurança, privacidade de terceiros ou retenção obrigatória. Base: art. 18, IV.",

        acerto_eliminacao: "Correto. Quando os dados forem desnecessários ou excessivos, o titular pode requerer eliminação ou bloqueio. Base: art. 18, IV.",
        erro_eliminacao: "Atenção. Quando os dados forem desnecessários ou excessivos, o titular tem direito de requerer a eliminação ou bloqueio dos mesmos. Base: art. 18, IV."
    },

    // bancoDeSituacoes: [
    //     {
    //         descricao: "Paciente está navegando no seu perfil e abre os seguintes chamados:",
    //         dados: [
    //             { nome: "Quero uma cópia integral do meu prontuário.", atende: true, tipo: "acesso" },
    //             { nome: "O meu número de telefone mudou, preciso corrigir no cadastro.", atende: true, tipo: "correcao" },
    //             { nome: "Apaguem todo o meu histórico de saúde. Não serei mais paciente.", atende: false, tipo: "invalido" }, // Deve reter por lei médica
    //             { nome: "Quero saber com quais laboratórios vocês compartilharam meus dados.", atende: true, tipo: "acesso" }
    //         ]
    //     },
    //     {
    //         descricao: "Solicitações recebidas através do e-mail do SAC:",
    //         dados: [
    //             { nome: "Meu endereço na receita está antigo, exijo a correção.", atende: true, tipo: "correcao" },
    //             { nome: "Quero que excluam o meu e-mail da lista de marketing da clínica.", atende: true, tipo: "eliminacao" },
    //             { nome: "Quero ver os exames do meu ex-marido para um processo.", atende: false, tipo: "invalido" },
    //             { nome: "Gostaria de acessar a data e hora em que meu exame foi agendado.", atende: true, tipo: "acesso" }
    //         ]
    //     },
    //     {
    //         descricao: "Chamados abertos diretamente pelo aplicativo da clínica:",
    //         dados: [
    //             { nome: "Erraram meu nome social na recepção. Corrijam imediatamente.", atende: true, tipo: "correcao" },
    //             { nome: "Quero a senha de administrador do sistema para eu mesmo arrumar.", atende: false, tipo: "invalido" },
    //             { nome: "Exijo o bloqueio de dados de pesquisas que eu não autorizei.", atende: true, tipo: "eliminacao" }
    //         ]
    //     }
    // ]

    // bancoDeSituacoes: [
    //     {
    //         descricao: "Solicitações dos pacientes:",
    //         dados: [
    //             { nome: "Quero ver meu prontuário.", atende: true, tipo: "acesso" },
    //             { nome: "Quero saber com quais laboratórios vocês compartilharam meus dados.", atende: true, tipo: "acesso" },
    //             { nome: "O meu número de telefone mudou, preciso corrigir no cadastro.", atende: true, tipo: "correcao" },
    //             { nome: "Erraram meu nome social na recepção. Corrijam imediatamente.", atende: true, tipo: "correcao" },
    //             { nome: "Quero que excluam o meu e-mail da lista de marketing da clínica.", atende: true, tipo: "eliminacao" },
    //             { nome: "Exijo o bloqueio de dados de pesquisas que eu não autorizei.", atende: true, tipo: "eliminacao" },
    //             { nome: "Apaguem todo o meu histórico de saúde. Não serei mais paciente.", atende: false, tipo: "invalido" }, // Deve reter por lei médica
    //             { nome: "Quero ver os exames do meu ex-marido para um processo.", atende: false, tipo: "invalido" },
    //             { nome: "Quero a senha de administrador do sistema para eu mesmo corrigir meu nome social.", atende: false, tipo: "invalido" }
    //         ]
    //     }
    // ]

    bancoDeSituacoes: [
        {
            descricao: "Solicitações dos pacientes:",
            dados: [
                { nome: "Quero ver meu prontuário.", atende: true, tipo: "acesso" },
                { nome: "O meu número de telefone mudou, preciso corrigir no cadastro.", atende: true, tipo: "correcao" },
                { nome: "Exijo o bloqueio de dados de pesquisas que eu não autorizei.", atende: true, tipo: "eliminacao" },
                { nome: "Apaguem todo o meu histórico de saúde. Não serei mais paciente.", atende: false, tipo: "invalido" }, // Deve reter por lei médica
                { nome: "Quero ver os exames do meu ex-marido para um processo.", atende: false, tipo: "invalido" },
            ]
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
// 2. ENGINE CENTRAL DO JOGO (Lógica de Decisão Linha a Linha)
// ============================================================================
const Engine = {
    ...GlobalEngine, // HERANÇA DO MOTOR GLOBAL

    situacoes: [], situacaoAtualIndice: 0, dadoAtualIndice: 0, totalCartoes: 0,
    pontuacao: 0, acertos: 0, totalJogados: 0,
    acertosSeguidos: 0, errosSeguidos: 0,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true,
    toastTimer: null,
    tempoToastRestante: 0, tempoAlertaRestante: 0, // NOVO: Relógios internos dos alertas

    iniciar: function() {
        // CHAMA O PAI (Ele resolve CSS, pausas, tempo, reset global)
        GlobalEngine.iniciar.call(this, 'flex');

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.situacoes = JSON.parse(JSON.stringify(DADOS_JOGO.bancoDeSituacoes));
        this.totalCartoes = this.situacoes.reduce((acc, sit) => acc + sit.dados.length, 0); 
        
        if (modoAleatorio) {
            this.situacoes.forEach(sit => sit.dados.sort(() => Math.random() - 0.5));
            this.situacoes.sort(() => Math.random() - 0.5);
        }

        this.situacaoAtualIndice = 0; this.dadoAtualIndice = 0;
        this.pontuacao = 0; this.acertos = 0; this.totalJogados = 0;
        this.errosSeguidos = 0; this.acertosSeguidos = 0;
        this.tempoToastRestante = 0; this.tempoAlertaRestante = 0; // Zera ao reiniciar

        document.getElementById('lista-dados').innerHTML = ''; 
        this.carregarNovaSituacao();
    },

    // =========================================================
    // HOOK DO PAI: Atualiza a info na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.totalJogados}/${this.totalCartoes}`;
    },

    // =========================================================
    // MECÂNICA EXCLUSIVA DA FASE 4
    // =========================================================
    carregarNovaSituacao: function() {
        // CONDIÇÃO DE TÉRMINO: Terminámos a lista a tempo
        if (this.situacaoAtualIndice >= this.situacoes.length) {
            this.encerrar(true); 
            return;
        }

        const sit = this.situacoes[this.situacaoAtualIndice];
        document.getElementById('texto-situacao').innerText = sit.descricao;
        document.getElementById('lista-dados').innerHTML = ''; 
        
        this.puxarNovoDado();
    },

    puxarNovoDado: function() {
        const sit = this.situacoes[this.situacaoAtualIndice];
        
        if (this.dadoAtualIndice >= sit.dados.length) {
            this.situacaoAtualIndice++;
            this.dadoAtualIndice = 0;
            this.jogoPausado = true;
            setTimeout(() => {
                this.jogoPausado = false;
                this.carregarNovaSituacao();
            }, 1000); 
            return;
        }

        const dadoObj = sit.dados[this.dadoAtualIndice];
        const lista = document.getElementById('lista-dados');
        
        const li = document.createElement('div');
        li.className = 'dado-linha ativo';
        li.id = 'linha-atual';
        // Adicionando um ícone de "chat" simulando o paciente
        li.innerHTML = `
            <div style="font-size: 20px; margin-right: 10px;">👤</div>
            <span class="nome-dado">"${dadoObj.nome}"</span>
            <span class="status-dado pulse-aguardando">A aguardar decisão...</span>
        `;
        
        lista.appendChild(li);
        // li.scrollIntoView({ behavior: 'smooth', block: 'end' });
        lista.scrollTo({ top: lista.scrollHeight, behavior: 'smooth' });
    },

    classificar: function(escolhaDoJogador) {
        if (this.jogoPausado || this.situacaoAtualIndice >= this.situacoes.length) return;
        
        // PADRÃO OURO: Limpa os alertas instantaneamente ao tomar uma nova decisão
        const toast = document.getElementById('toast-feedback');
        if (toast) toast.classList.remove('show');
        // if(this.toastTimer) clearTimeout(this.toastTimer);
        this.tempoToastRestante = 0;
        
        // PADRÃO OURO: Limpa os alertas instantaneamente ao tomar uma nova decisão
        const alertaCombo = document.getElementById('alerta-combo');
        if (alertaCombo) alertaCombo.classList.remove('show');
        // if(this.alertaTimer) clearTimeout(this.alertaTimer);
        this.tempoAlertaRestante = 0;

        const sit = this.situacoes[this.situacaoAtualIndice];
        const dadoObj = sit.dados[this.dadoAtualIndice];
        const acertou = (escolhaDoJogador === dadoObj.atende);
        
        this.totalJogados++;
        
        const li = document.getElementById('linha-atual');
        li.removeAttribute('id'); 
        li.classList.remove('ativo');
        li.classList.add(acertou ? 'acerto-jogador' : 'erro-jogador');
        
        const statusSpan = li.querySelector('.status-dado');
        statusSpan.classList.remove('pulse-aguardando');

        let iconeVerdade = dadoObj.atende ? '✅ Atendido' : '❌ Negado';
        let classeVerdade = dadoObj.atende ? 'sim-necessario' : 'nao-necessario';
        
        statusSpan.innerHTML = iconeVerdade;
        statusSpan.className = 'status-dado ' + classeVerdade;

        if (acertou) {
            this.acertos++; this.acertosSeguidos++; this.errosSeguidos = 0;
            let isCombo = this.acertosSeguidos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');
            
            this.mostrarToast(true, dadoObj);
        } else {
            this.acertosSeguidos = 0;
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true); // Visual vermelho na perda
            
            this.mostrarToast(false, dadoObj);

            this.errosSeguidos++;
            if (this.errosSeguidos >= 2) {
                this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
                this.dispararAlertaErros();
                this.errosSeguidos = 0; 
            }
        }

        this.atualizarHUD(true);
        
        this.dadoAtualIndice++;
        this.puxarNovoDado();
    },



    // =========================================================
    // POLIMORFISMO: Toast Dinâmico por Tipo de Direito
    // =========================================================
    mostrarToast: function(acertou, dadoObj) {
        // Pega os textos específicos no DADOS_JOGO baseado no tipo do direito
        let tipo = dadoObj.tipo; // "acesso", "correcao", "eliminacao", "invalido"
        let keyTexto = acertou ? `acerto_${tipo}` : `erro_${tipo}`;
        let mensagem = DADOS_JOGO.textosFeedback[keyTexto];
        
        const tipoStr = acertou ? 'sucesso' : 'erro';

        // Manda o PAI desenhar!
        GlobalEngine.mostrarToast.call(this, tipoStr, mensagem);
    },

    // dispararAlertaErros: function() {
    //     const alerta = document.getElementById('alerta-combo');
    //     alerta.classList.add('show');
    //     setTimeout(() => alerta.classList.remove('show'), 3500);
    // },

    dispararAlertaErros: function() {
        const alerta = document.getElementById('alerta-combo');
        if (alerta) alerta.classList.add('show');
        
        // // Limpa o timer anterior se houver
        // if(this.alertaTimer) clearTimeout(this.alertaTimer);
        
        // // PADRÃO OURO: 10 segundos
        // this.alertaTimer = setTimeout(() => { 
        //     alerta.classList.remove('show'); 
        // }, 10000);

        // PADRÃO OURO: Abastece 10 segundos sincronizados
        this.tempoAlertaRestante = 10;

        // Permite fechar a penalidade extra clicando nela mesma
        if (alerta) {
            alerta.onclick = () => {
                if (this.jogoPausado) return; // Impede fechar se estiver pausado

                alerta.classList.remove('show');
                // clearTimeout(this.alertaTimer);
                this.tempoAlertaRestante = 0;
            };
        }
    },
};
