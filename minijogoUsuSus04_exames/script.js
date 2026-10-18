// ============================================================================
// REGRAS ESPECÍFICAS - FASE 4 USUÁRIO DO SUS (Sala de Exames)
// ============================================================================

const DADOS_JOGO = {
    tema: {
        corPrincipal: "#00838f", 
        corEscura: "#005662", 
        corClara: "#e0f7fa"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 70,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 4: Sala de Exames",
        introDesc: "Após a realização dos exames, você precisa decidir como irá compartilhar os seus resultados.",
        introDefinCurta: "<strong>Dica:</strong> Escolha sempre meios oficiais.",
        introDefin: "<strong>Protegendo suas informações:</strong><br><br>Você é o dono dos seus dados, mas compartilhá-los de forma descuidada pode trazer riscos. O envio de resultados de exames deve ocorrer apenas através de sistemas protegidos ou diretamente com o profissional de saúde responsável, evitando exposição desnecessária na internet.",
        introDica: "<strong>Leia a intenção</strong> e decida se a atitude é <strong>Segura</strong> ou <strong>Insegura</strong>.",
        introMeta: "Meta de Aprovação: Avaliar TUDO com {META}% de Precisão.",

        fimVitoriaTitulo: "Compartilhamento Seguro! ✅",
        fimVitoriaMsg: "Excelente! Você entende que compartilhar dados de saúde exige cautela e responsabilidade na escolha dos canais.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ⏳",
        fimDerrotaTempoMsg: "O tempo acabou antes que você tomasse todas as decisões de compartilhamento.",
        fimDerrotaMetaTitulo: "Dados Expostos ⚠️",
        fimDerrotaMetaMsg: "Atenção. Você considerou seguras algumas atitudes que expõem fortemente sua privacidade a pessoas não autorizadas.",
        baseLegal: "<strong>⚖️ Art. 6º da LGPD:</strong> O compartilhamento deve seguir o princípio da segurança e prevenção, ocorrendo apenas por meios protegidos.",

        txtToastCorreto: {
            seguro: "Correto! Utilizar os canais oficiais ou falar direto com o médico garante a proteção do seu laudo.",
            inseguro: "Correto! Evitar redes sociais e grupos abertos previne que pessoas não autorizadas vejam seus dados médicos."
        },
        txtToastErro: {
            seguro: "Atenção! Essa atitude era segura. Utilizar canais institucionais e proteger com senha é a conduta correta.",
            inseguro: "Atenção! Compartilhar dessa forma é muito arriscado e expõe sua intimidade médica."
        }
    },

    bancoDeDados: [
        // Condutas INSEGURAS
        { texto: "Vou tirar uma foto do meu exame e postar no Instagram para ver se alguém sabe ler o resultado.", tipo: "inseguro" },
        { texto: "Vou mandar o laudo no grupo de WhatsApp do bairro para a minha vizinha enfermeira dar uma olhada.", tipo: "inseguro" },
        { texto: "Vou deixar o envelope com meu diagnóstico aberto em cima da mesa no meu trabalho.", tipo: "inseguro" },
        
        // Condutas SEGURAS
        // { texto: "Vou anexar o PDF do meu exame diretamente no portal oficial do paciente da UBS.", tipo: "seguro" },
        { texto: "Vou anexar o meu exame diretamente no portal oficial do paciente.", tipo: "seguro" },
        { texto: "Vou entregar os exames impressos em mãos apenas para o médico que solicitou.", tipo: "seguro" },
        { texto: "Vou enviar o resultado por e-mail apenas para a clínica, protegido por uma senha.", tipo: "seguro" }
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
        
        // Remove a animação e reativa num pequeno intervalo para fazer o card "piscar" e pular de novo
        cardSituacao.style.animation = 'none';
        void cardSituacao.offsetWidth; // Força o reflow
        cardSituacao.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        campoTexto.innerHTML = `"${this.cartaAtual.texto}"`;
        campoTexto.setAttribute('aria-label', `Situação: ${this.cartaAtual.texto}`);
    },

    processarAcao: function(acaoEscolhida) {
        if (this.jogoPausado || !this.cartaAtual) return;
        
        const acertou = (acaoEscolhida === this.cartaAtual.tipo);
        
        // Pega a mensagem baseada no tipo REAl da carta
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