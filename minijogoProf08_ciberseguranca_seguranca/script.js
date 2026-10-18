// ============================================================================
// REGRAS ESPECÍFICAS - FASE 8 SIMPLIFICADA (AUDITORIA DE SEGURANÇA)
// ============================================================================

const DADOS_JOGO = {
    tema: {
        corPrincipal: "#512da8", // Roxo
        corEscura: "#311b92", 
        corClara: "#ede7f6"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosAcerto: 20,
    pontosCombo: 30,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 8: Auditoria de Segurança",
        introDesc: "Você está realizando uma auditoria nas práticas de segurança da informação da unidade de saúde.",
        introDefinCurta: "<strong>Conceito:</strong> Segurança Operacional e Cibernética.",
        introDefin: "A LGPD exige medidas técnicas e administrativas para proteger dados pessoais contra acessos não autorizados, vazamentos ou destruição. Práticas como uso de senhas fracas, falta de criptografia e compartilhamento indevido são falhas graves.",
        introDica: "Leia a situação e escolha a <strong>Conduta Correta de Segurança</strong> para proteger o sistema.",
        introMeta: "Meta de Aprovação: Responder as 5 questões com 75% de Precisão.",
        
        fimVitoriaTitulo: "Sistema Protegido! ✅",
        fimVitoriaMsg: "Excelente! Você implementou políticas sólidas de segurança, reduzindo drasticamente o risco de vazamentos.",
        fimDerrotaTempoTitulo: "Auditoria Incompleta ❌",
        fimDerrotaTempoMsg: "O tempo acabou. A demora na aplicação de segurança deixa o sistema vulnerável a ataques.",
        fimDerrotaMetaTitulo: "Falhas de Segurança ❌",
        fimDerrotaMetaMsg: "A sua precisão foi baixa. Você permitiu práticas que colocam os dados dos pacientes em risco.",
        
        baseLegal: "<strong>⚖️ Art. 46 da LGPD:</strong> Os agentes de tratamento devem adotar medidas de segurança, técnicas e administrativas para proteger os dados pessoais."
    },

    praticasBoas: [
        "Criptografar o banco de dados principal da unidade de saúde.", 
        "Exigir senhas fortes, exclusivas e trocadas periodicamente.", 
        "Treinar a equipe de recepção sobre proteção de dados.",
        "Restringir o acesso a dados sensíveis apenas aos profissionais de saúde responsáveis.", 
        "Fazer backups regulares criptografados em servidores externos.", 
        "Atualizar sistemas operacionais e antivírus constantemente.",
        "Descartar receitas e documentos físicos em fragmentadoras de papel.", 
        "Registrar logs (histórico) de quem acessa o sistema de prontuários."
    ],
    praticasMas: [
        "Compartilhar senhas de acesso entre todos os funcionários do turno.", 
        "Desativar o antivírus da máquina para o sistema ficar mais rápido.", 
        "Enviar resultados de exames de pacientes por grupos de WhatsApp abertos.",
        "Anotar a senha do sistema num post-it colado no monitor.", 
        "Permitir que qualquer funcionário tenha acesso de administrador ao sistema.", 
        "Salvar o backup do banco de dados no próprio computador da recepção.",
        "Usar a data de fundação da unidade de saúde como senha padrão para todos.",
        "Deixar o computador logado e desbloqueado ao sair para o intervalo."
    ]
};

document.documentElement.style.setProperty('--cor-tema', DADOS_JOGO.tema.corPrincipal);
document.documentElement.style.setProperty('--cor-tema-escuro', DADOS_JOGO.tema.corEscura);
document.documentElement.style.setProperty('--cor-tema-claro', DADOS_JOGO.tema.corClara);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('txt-intro-titulo').innerText = DADOS_JOGO.interface.introTitulo;
    document.getElementById('txt-intro-desc').innerText = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin + "<br><br>"; 
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});

const Engine = {
    ...GlobalEngine, 

    quizzes: [], perguntaAtualIndice: 0, 
    acertos: 0, totalJogados: 0, acertosSeguidos: 0, errosSeguidos: 0, 
    bloqueado: false, ultimoToastAcerto: null, modoEstudo: false, 
    timeoutProxima: null, aguardandoTransicao: false,

    // ADICIONE ESTAS DUAS VARIÁVEIS:
    tempoRestanteTransicao: 0, tempoInicioTransicao: 0,

    iniciar: function() {
        GlobalEngine.iniciar.call(this, 'flex');
        document.getElementById('area-jogo').classList.remove('bloqueado');
        
        // Assegura que o botão de pausa está visualmente ativado
        const btnPausa = document.getElementById('btn-pausa');
        if (btnPausa) btnPausa.classList.remove('desativado');

        const checkEstudo = document.getElementById('check-modo-estudo');
        this.modoEstudo = checkEstudo ? checkEstudo.checked : false;

        this.perguntaAtualIndice = 0;
        this.acertos = 0; this.totalJogados = 0;
        this.errosSeguidos = 0; this.acertosSeguidos = 0; 
        this.bloqueado = false; this.ultimoToastAcerto = null;
        this.aguardandoTransicao = false;

        // ADICIONE O RESET AQUI:
        this.tempoRestanteTransicao = 0; this.tempoInicioTransicao = 0;
        clearTimeout(this.timeoutProxima);

        const btnProx = document.getElementById('btn-proxima');
        if (btnProx) btnProx.style.display = 'none';

        this.gerarQuizzes();
        this.carregarPergunta();
    },

    descobrirSegredo: function(e) {
        e.preventDefault(); // Impede o link de saltar a página imediatamente

        if (typeof AudioSys !== 'undefined') AudioSys.init();
        if (typeof AudioSys !== 'undefined') AudioSys.tocar('segredo');

        // Aguarda 1600ms (o tempo exato do som terminar) antes de carregar o Tower Defense
        setTimeout(() => {
            window.location.href = "easteregg/index.html";
        }, 1600);
    },

    // Sobrescreve a Pausa Global para bloquear cliques durante a Transição Silenciosa
    // togglePausa: function() {
    //     if (this.aguardandoTransicao) return; 
    //     GlobalEngine.togglePausa.call(this);
    // },
    // =========================================================
    // CONTROLE DE PAUSA INTELIGENTE DURANTE A TRANSIÇÃO
    // =========================================================
    togglePausa: function() {
        if (this.aguardandoTransicao) return; // Trava se estiver no Modo Estudo aguardando clique

        const estavaPausado = this.jogoPausado;
        GlobalEngine.togglePausa.call(this);

        // Se pausou/despausou enquanto o temporizador automático de 1.2s estava a correr
        if (this.bloqueado && !this.modoEstudo) {
            if (this.jogoPausado && !estavaPausado) {
                // Pausou: Cancela o temporizador e guarda o tempo restante
                clearTimeout(this.timeoutProxima);
                let tempoPassado = Date.now() - this.tempoInicioTransicao;
                this.tempoRestanteTransicao = Math.max(0, this.tempoRestanteTransicao - tempoPassado);
            } else if (!this.jogoPausado && estavaPausado) {
                // Despausou: Retoma exatamente com os milissegundos que faltavam
                this.tempoInicioTransicao = Date.now();
                this.timeoutProxima = setTimeout(() => {
                    this.proximaPergunta();
                }, this.tempoRestanteTransicao);
            }
        }
    },

    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.acertos}/5`;
    },

    gerarQuizzes: function() {
        this.quizzes = [];
        
        const btnAleatorio = document.getElementById('toggle-dificuldade');
        const modoAleatorio = btnAleatorio ? btnAleatorio.checked : true;

        let boas = [...DADOS_JOGO.praticasBoas];
        let mas = [...DADOS_JOGO.praticasMas];

        for (let i = 0; i < 5; i++) {
            if (boas.length === 0) { boas = [...DADOS_JOGO.praticasBoas]; }
            if (mas.length < 2) {
                let restos = mas; 
                mas = [...DADOS_JOGO.praticasMas];
                mas = restos.concat(mas); 
            }

            let certa, errada1, errada2;

            if (modoAleatorio) {
                let idxCerta = Math.floor(Math.random() * boas.length);
                certa = boas.splice(idxCerta, 1)[0];

                let idxErrada1 = Math.floor(Math.random() * mas.length);
                errada1 = mas.splice(idxErrada1, 1)[0];

                let idxErrada2 = Math.floor(Math.random() * mas.length);
                errada2 = mas.splice(idxErrada2, 1)[0];
            } else {
                certa = boas.shift();
                errada1 = mas.shift();
                errada2 = mas.shift();
            }

            let objCerta = { texto: certa, correta: true };
            let objErrada1 = { texto: errada1, correta: false };
            let objErrada2 = { texto: errada2, correta: false };
            let opcoes = [];

            if (modoAleatorio) {
                let posicaoCerta = Math.floor(Math.random() * 3);
                if (posicaoCerta === 0) { opcoes = [objCerta, objErrada1, objErrada2]; }
                else if (posicaoCerta === 1) { opcoes = [objErrada1, objCerta, objErrada2]; }
                else { opcoes = [objErrada1, objErrada2, objCerta]; }
            } else {
                opcoes = [objCerta, objErrada1, objErrada2];
            }

            this.quizzes.push(opcoes);
        }
    },

    carregarPergunta: function() {
        if (this.perguntaAtualIndice >= this.quizzes.length) {
            this.encerrar(true); 
            return;
        }

        const opcoes = this.quizzes[this.perguntaAtualIndice];
        
        const contador = document.getElementById('contador-tickets');
        if (contador) contador.innerText = `Auditoria ${this.perguntaAtualIndice + 1} / 5`;
        
        const textoSolicitacao = document.getElementById('texto-solicitacao');
        if (textoSolicitacao) textoSolicitacao.innerHTML = "Qual destas condutas garante a segurança do sistema?";
        
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
        if (this.jogoPausado || this.bloqueado) return;
        
        this.bloqueado = true; 
        document.getElementById('area-jogo').classList.add('bloqueado');

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
            this.acertosSeguidos = 0; this.errosSeguidos++;
            
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true); 
            this.mostrarToast(false);
            
            const botoes = document.querySelectorAll('.btn-opcao');
            botoes.forEach((b, i) => {
                if (this.quizzes[this.perguntaAtualIndice][i].correta) {
                    b.classList.add('certo-sugerido'); 
                }
            });
        }

        if (this.modoEstudo) {
            this.mostrarBotaoProxima();
        } else {
            // this.timeoutProxima = setTimeout(() => {
            //     this.proximaPergunta();
            // }, 1200);

            // SUBSTITUA O setTimeout ANTIGO POR ESTE BLOCO:
            this.tempoRestanteTransicao = 1200;
            this.tempoInicioTransicao = Date.now();
            
            this.timeoutProxima = setTimeout(() => {
                this.proximaPergunta();
            }, this.tempoRestanteTransicao);
        }
    },

    // =========================================================
    // LÓGICA DO MODO ESTUDO EM TEMPO REAL
    // =========================================================
    toggleModoEstudo: function() {
        const checkEstudo = document.getElementById('check-modo-estudo');
        this.modoEstudo = checkEstudo ? checkEstudo.checked : false;

        // Se já está à espera do clique manual, não faz nada ao clicar no livro (só salva a preferência)
        if (this.aguardandoTransicao) return;

        // Se ativou o livro durante o tempo automático (1.2s), cancela e mostra o botão
        if (this.bloqueado && this.modoEstudo) {
            clearTimeout(this.timeoutProxima);
            this.mostrarBotaoProxima();
        }
    },

    mostrarBotaoProxima: function() {
        this.aguardandoTransicao = true;
        this.jogoPausado = true; // Pausa Silenciosa
        clearInterval(this.intervaloTempo);
        
        // Pinta o botão de pausa de cinzento
        const btnPausa = document.getElementById('btn-pausa');
        if (btnPausa) btnPausa.classList.add('desativado');

        const btnProx = document.getElementById('btn-proxima');
        if (btnProx) {
            btnProx.innerText = (this.perguntaAtualIndice === this.quizzes.length - 1) ? "Finalizar Auditoria ✅" : "Próxima ➔";
            btnProx.style.display = 'block';
        }
    },

    proximaPergunta: function() {
        // Remove a pausa silenciosa se existir (Avanço Manual do Modo Estudo)
        if (this.aguardandoTransicao) {
            this.aguardandoTransicao = false;
            this.jogoPausado = false;
            clearInterval(this.intervaloTempo);
            this.intervaloTempo = setInterval(() => this.tickTempo(), 1000);
            
            const btnPausa = document.getElementById('btn-pausa');
            if (btnPausa) btnPausa.classList.remove('desativado');
        }
        // REMOVIDO: A trava que matava a função se o menu de pausa estivesse aberto!
        // } else {
        //     if (this.jogoPausado) return; 
        // }

        clearTimeout(this.timeoutProxima);

        const btnProx = document.getElementById('btn-proxima');
        if (btnProx) btnProx.style.display = 'none';

        document.getElementById('area-jogo').classList.remove('bloqueado');
        
        this.perguntaAtualIndice++;
        this.bloqueado = false;
        this.carregarPergunta();
    },

    mostrarToast: function(acertou) {
        if (this.ultimoToastAcerto === acertou) return;
        this.ultimoToastAcerto = acertou;

        const tipoStr = acertou ? 'sucesso' : 'erro';
        const msg = acertou ? "Prática de segurança validada!" : "Alerta de vulnerabilidade! Essa prática coloca a unidade de saúde em risco.";
        
        GlobalEngine.mostrarToast.call(this, tipoStr, msg);
        
        const toast = document.getElementById('toast-feedback');
        if (toast) {
            toast.onclick = () => {
                if (this.jogoPausado && !this.aguardandoTransicao) return; // Permite fechar toast no modo estudo
                toast.classList.remove('show');
                this.tempoToastRestante = 0;
                this.ultimoToastAcerto = null; 
            };
        }
    }
};