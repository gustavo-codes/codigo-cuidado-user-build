// ============================================================================
// REGRAS ESPECÍFICAS - FASE 6 USUÁRIO DO SUS (Consentimento)
// ============================================================================

const DADOS_JOGO = {
    tema: {
        corPrincipal: "#f57c00", 
        corEscura: "#e65100", 
        corClara: "#fff3e0"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 70,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 6: Uso de Dados",
        introDesc: "Seus dados podem ser utilizados em diferentes situações dentro da unidade de saúde.",
        introDefinCurta: "<strong>Dica:</strong> Saiba quando a sua autorização é obrigatória.",
        introDefin: "<strong>Obrigatório vs Automático:</strong><br><br>Geralmente, o uso dos seus dados para o seu próprio tratamento não exige que a UBS peça sua permissão o tempo todo. Além disso, em casos de <strong>emergência</strong> para proteger a sua vida, a lei permite o uso imediato sem consentimento. Porém, para compartilhar seus dados fora da assistência ou em <strong>pesquisas</strong>, a sua autorização formal é obrigatória.",
        introDica: "<strong>Avalie a situação</strong> e indique se ela exige ou não exige o seu consentimento.",
        introMeta: "Meta de Aprovação: Avaliar TUDO com {META}% de Precisão.",

        fimVitoriaTitulo: "Jornada Concluída! 🌟",
        fimVitoriaMsg: "Excelente! Durante sua jornada na unidade de saúde, você aprendeu a identificar, proteger e compreender o uso dos seus dados pessoais.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ⏳",
        fimDerrotaTempoMsg: "O tempo acabou antes de você analisar todas as regras de consentimento.",
        fimDerrotaMetaTitulo: "Cuidado com os Direitos ⚠️",
        fimDerrotaMetaMsg: "Atenção. Você se confundiu em relação a quando a UBS é obrigada a pedir sua autorização formal.",
        baseLegal: "<strong>⚖️ Art. 7º e 11 da LGPD:</strong> O consentimento é importante, mas não é a única base legal para o uso de dados. Situações de emergência e proteção da vida dispensam essa exigência.",

        txtToastCorreto: {
            exige: "Correto! O uso de dados depende da finalidade e da base legal aplicável. Isso requer autorização.",
            nao_exige: "Correto! Situações de emergência, proteção da vida ou assistência médica direta não exigem consentimento prévio."
        },
        txtToastErro: {
            exige: "Atenção! Essa situação não faz parte do seu atendimento médico normal e, portanto, exige o seu consentimento prévio.",
            nao_exige: "Atenção! Nem todas as situações exigem consentimento, especialmente quando há risco à vida ou necessidade imediata de atendimento."
        }
    },

    bancoDeDados: [
        // NÃO EXIGE Consentimento (Emergência, Proteção da vida, Assistência direta)
        { texto: "Acesso ao meu tipo sanguíneo pelo médico socorrista durante um acidente grave.", tipo: "nao_exige" },
        { texto: "Consulta do meu histórico de alergias pela enfermeira antes de aplicar uma injeção.", tipo: "nao_exige" },
        { texto: "Abertura do meu prontuário pelo médico da UBS durante a minha própria consulta.", tipo: "nao_exige" },

        // EXIGE Consentimento (Pesquisas, compartilhamento externo)
        { texto: "Uso do meu prontuário para uma pesquisa científica de uma universidade externa.", tipo: "exige" },
        { texto: "Compartilhamento do meu diagnóstico com o dono de uma farmácia comercial, amigo do médico.", tipo: "exige" },
        // { texto: "Uso das minhas informações para envio de propagandas de planos de saúde.", tipo: "exige" },
        { texto: "Uso das minhas informações para envio de propagandas de remédio ou de exames.", tipo: "exige" }
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

    // mostrarTutorial: function() {
    //     this.iniciar(); 
    //     document.getElementById('tela-tutorial').classList.remove('oculto');
    //     this.jogoPausado = true; 

    //     const tratarPrimeiroToque = (e) => {
    //         if (e.target.closest('.btn-voltar')) return;
    //         document.getElementById('tela-tutorial').classList.add('oculto'); 
    //         this.jogoPausado = false; 
    //         document.removeEventListener('pointerdown', tratarPrimeiroToque, { capture: true });
    //     };
    //     document.addEventListener('pointerdown', tratarPrimeiroToque, { capture: true });
    // },

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
        const campoTexto = document.getElementById('texto-cenario');
        const cardSituacao = document.getElementById('card-situacao');

        if (this.filaCartoes.length === 0) {
            setTimeout(() => this.encerrar(true), 500); 
            return;
        }

        this.cartaAtual = this.filaCartoes.pop();
        
        cardSituacao.style.animation = 'none';
        void cardSituacao.offsetWidth;
        cardSituacao.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        campoTexto.innerHTML = `"${this.cartaAtual.texto}"`;
        campoTexto.setAttribute('aria-label', `Situação: ${this.cartaAtual.texto}`);
    },

    processarAcao: function(acaoEscolhida) {
        if (this.jogoPausado || !this.cartaAtual) return;
        
        const acertou = (acaoEscolhida === this.cartaAtual.tipo);
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
        setTimeout(() => this.puxarNovaCarta(), 200); 
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