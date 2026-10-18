// ============================================================================
// REGRAS ESPECÍFICAS - FASE 5 USUÁRIO DO SUS (Administração)
// ============================================================================

const DADOS_JOGO = {
    tema: {
        corPrincipal: "#3949ab", 
        corEscura: "#283593", 
        corClara: "#e8eaf6"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 70,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 5: Central de Privacidade",
        introDesc: "Enquanto aguarda o atendimento, você pensa: 'Será que meus dados estão seguros? E o que eu posso fazer para protegê-los?'",
        introDefinCurta: "<strong>Dica:</strong> O titular dos dados tem o dever e o direito de cuidar de suas informações.",
        introDefin: "<strong>Direitos e Deveres:</strong><br><br>Você tem o direito de acessar, corrigir e acompanhar o uso dos seus dados dentro da UBS. É fundamental adotar uma atitude proativa: não compartilhe suas senhas com terceiros, leia os avisos de privacidade e questione sempre que tiver dúvidas sobre como sua saúde está sendo registrada.",
        introDica: "<strong>Leia a atitude</strong> e decida se é uma postura <strong>Arriscada</strong> ou <strong>Segura</strong> para os seus dados.",
        introMeta: "Meta de Aprovação: Avaliar TUDO com {META}% de Precisão.",

        fimVitoriaTitulo: "Controle Total! ✅",
        fimVitoriaMsg: "Excelente! Você entende que tem o direito de acessar, corrigir e acompanhar o uso dos seus dados de forma ativa.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ⏳",
        fimDerrotaTempoMsg: "O tempo acabou antes que você tomasse todas as decisões na Central de Privacidade.",
        fimDerrotaMetaTitulo: "Privacidade em Risco ⚠️",
        fimDerrotaMetaMsg: "Atenção. Você aprovou atitudes que colocam seus dados em perigo. É seu direito saber como suas informações são usadas e controlá-las.",
        baseLegal: "<strong>⚖️ Art. 18 da LGPD:</strong> O titular tem o direito de obter informações, acessar e corrigir seus dados a qualquer momento, garantindo o controle sobre sua privacidade.",

        txtToastCorreto: {
            segura: "Correto! O titular dos dados tem o direito de acessar e acompanhar o uso de suas informações.",
            insegura: "Correto! Evitar essas atitudes protege a sua privacidade e garante o controle sobre seus dados."
        },
        txtToastErro: {
            segura: "Atenção! Você tem direito de saber como seus dados estão sendo utilizados e de exercer controle sobre eles.",
            insegura: "Atenção! Essa atitude é perigosa. Cuidar das suas senhas e ler os termos evita problemas futuros."
        }
    },

    bancoDeDados: [
        // Condutas INSEGURAS (Arriscadas)
        { texto: "Vou ignorar completamente os avisos sobre o uso dos meus dados.", tipo: "insegura" },
        { texto: "Vou compartilhar meu login e senha do SUS com meus familiares.", tipo: "insegura" },
        { texto: "Vou aceitar qualquer termo de uso de dados no aplicativo sem ler.", tipo: "insegura" },
        { texto: "Não vou buscar informações sobre os meus direitos, pois não importa.", tipo: "insegura" },
        
        // Condutas SEGURAS
        { texto: "Vou procurar informações sobre como meus dados são usados na UBS.", tipo: "segura" },
        { texto: "Vou perguntar ao profissional sobre a finalidade do uso dos meus dados.", tipo: "segura" },
        { texto: "Vou evitar compartilhar minhas senhas do portal com outras pessoas.", tipo: "segura" },
        { texto: "Vou conferir e atualizar onde meus dados estão sendo registrados.", tipo: "segura" }
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
        campoTexto.setAttribute('aria-label', `Sua Atitude: ${this.cartaAtual.texto}`);
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