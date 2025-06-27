(() => {
  // A extensão só deve proceder se a URL atual for um domínio do ShopApp
  const isShopAppToolDomain = location.href.startsWith("https://opstools-p1");
  if (!isShopAppToolDomain) {
    console.log("Automação Shop App: Não é uma URL do ShopApp. Script de conteúdo não ativo para features.");
    return; // Sai do script se não for uma URL alvo
  }

  console.log('Automação Shop App: Script de conteúdo iniciado para o domínio ShopApp.');

  // --- Criação e Gerenciamento do Iframe do Painel Flutuante ---
  const IFRAME_ID = 'automa-shop-app-iframe';
  const RESTORE_BTN_ID = 'automa-shop-app-restore-btn';

  let iframe = document.getElementById(IFRAME_ID);
  let btnRestore = document.getElementById(RESTORE_BTN_ID);

  // Garante que o iframe e o botão de restaurar sejam criados apenas uma vez
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = IFRAME_ID;
    iframe.src = chrome.runtime.getURL('floating.html');
    Object.assign(iframe.style, {
      position: 'fixed',
      width: '350px',
      height: '700px', // Altura aumentada para acomodar os novos botões
      zIndex: '9999',
      border: 'none',
      background: 'white',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
      borderRadius: '8px',
      // Posição padrão, será sobrescrita pela posição salva no storage
      top: '15px',
      left: '15px',
      display: 'block' // Garante que seja visível por padrão
    });
    document.body.appendChild(iframe);
    console.log('Automação Shop App: Iframe criado e adicionado ao DOM.');
  }

  if (!btnRestore) {
    btnRestore = document.createElement('button');
    btnRestore.id = RESTORE_BTN_ID;
    btnRestore.textContent = '🗗 Abrir Painel';
    Object.assign(btnRestore.style, {
      position: 'fixed',
      bottom: '15px',
      right: '15px',
      zIndex: 10000,
      padding: '12px 16px',
      fontSize: '10px',
      fontFamily: "'Press Start 2P', cursive",
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      borderRadius: '6px',
      cursor: 'pointer',
      border: '3px solid #007bff',
      background: 'linear-gradient(145deg, #007bff, #0056b3)',
      color: 'white',
      boxShadow: 'inset 0 0 8px #66aaff, 0 4px 0 #003d80',
      transition: 'all 0.3s ease',
      display: 'none', // Inicialmente oculto
    });
    document.body.appendChild(btnRestore);
    console.log('Automação Shop App: Botão de restaurar criado.');
  }

  // Listener para o botão de restaurar
  btnRestore.addEventListener('click', () => {
    iframe.style.display = 'block';
    btnRestore.style.display = 'none';
    chrome.storage.local.set({ isPanelMinimized: false });
    console.log('Automação Shop App: Painel restaurado.');
  });

  // Carrega o estado e a posição do painel do storage
  chrome.storage.local.get(['isPanelMinimized', 'extBoxPosition'], function (result) {
    if (result.isPanelMinimized) {
      iframe.style.display = 'none';
      btnRestore.style.display = 'block';
      console.log('Automação Shop App: Painel carregado como minimizado.');
    }
    if (result.extBoxPosition) {
      Object.assign(iframe.style, result.extBoxPosition);
      console.log('Automação Shop App: Posição do painel carregada.');
    }
  });

  // --- Funções das Novas Funcionalidades (ShopApp Helper) ---

  let cmsHelpertargetImages = null;
  let cmsHelperExpiredDivs = null;
  let expiredSpanTexts = null;

  function initializeCmsHelperElements() {
    cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');
    cmsHelperExpiredDivs = document.querySelectorAll('div.widget-card-expired');
    expiredSpanTexts = Array.from(cmsHelperExpiredDivs)
      .flatMap(div => Array.from(div.querySelectorAll('span')).map(span => span.innerText.trim()));
    // console.log('CMS Helper: Elementos inicializados/atualizados.');
  }

  function addRedBorders() {
    initializeCmsHelperElements();
    cmsHelpertargetImages.forEach((img) => {
      const titleText = img.getAttribute('title').trim();
      if (expiredSpanTexts.includes(titleText)) {
        img.parentNode.style.border = '4px solid red';
        img.parentNode.style.borderRadius = '5px';
      }
    });
    console.log('CMS Helper: Bordas vermelhas adicionadas.');
  }

  function removeRedBorders() {
    initializeCmsHelperElements();
    cmsHelpertargetImages.forEach((img) => {
      const titleText = img.getAttribute('title').trim();
      if (expiredSpanTexts.includes(titleText)) {
        img.parentNode.style.border = 'none';
        img.parentNode.style.borderRadius = ''; // Remove border-radius também
      }
    });
    console.log('CMS Helper: Bordas vermelhas removidas.');
  }

  function addTitles() {
    initializeCmsHelperElements();
    cmsHelpertargetImages.forEach((img) => {
      let titleSpan = img.parentNode.querySelector('.cms-helper-title');
      if (!titleSpan) {
        titleSpan = document.createElement('span');
        titleSpan.className = 'cms-helper-title';
        img.parentNode.insertBefore(titleSpan, img.nextSibling);
      }
      titleSpan.textContent = img.getAttribute('title').trim();
      titleSpan.style.display = 'block'; // Garante que o título esteja visível
      // Estilização básica para o span do título
      titleSpan.style.backgroundColor = '#ffeb3b';
      titleSpan.style.color = '#000';
      titleSpan.style.fontSize = '12px';
      titleSpan.style.padding = '2px 4px';
      titleSpan.style.marginTop = '4px';
      titleSpan.style.border = '1px solid #ccc';
      titleSpan.style.borderRadius = '3px';
    });
    console.log('CMS Helper: Títulos adicionados.');
  }

  function removeTitles() {
    document.querySelectorAll('.cms-helper-title').forEach(span => {
      span.style.display = 'none'; // Oculta em vez de remover para permitir fácil alternância
    });
    console.log('CMS Helper: Títulos removidos.');
  }

  function showExpired() {
    initializeCmsHelperElements();
    cmsHelpertargetImages.forEach((img) => {
      const titleText = img.getAttribute('title').trim();
      if (expiredSpanTexts.includes(titleText)) {
        img.parentNode.style.display = 'block'; // Garante que o widget em si esteja visível
      }
    });
    cmsHelperExpiredDivs.forEach(div => {
      div.style.display = 'block'; // Garante que a overlay "Expirado" esteja visível
    });
    console.log('CMS Helper: Expirados mostrados.');
  }

  function hideExpired() {
    initializeCmsHelperElements();
    cmsHelpertargetImages.forEach((img) => {
      const titleText = img.getAttribute('title').trim();
      if (expiredSpanTexts.includes(titleText)) {
        img.parentNode.style.display = 'none'; // Oculta o widget
      }
    });
    cmsHelperExpiredDivs.forEach(div => {
      div.style.display = 'none'; // Oculta a overlay "Expirado"
    });
    console.log('CMS Helper: Expirados ocultados.');
  }

  // --- Funções de Manipulação de Input ---
  function limparEspacosInput() {
    const inp = document.getElementById("_marketingData[0].deeplinkQuery");
    if (inp) {
      // 1. Remove todos os espaços (início, meio e fim)
      inp.value = inp.value.replace(/\s/g, "");
   
      // 2. Substitui 'http://' por 'https://'
      inp.value = inp.value.replace(/^http:\/\//, "https://");

      // 3. Se não começar com 'https://', adiciona 'https://'
      if (!inp.value.startsWith("https://")) {
        inp.value = "https://" + inp.value;
      }
    }
  }

  function atualizarDataNoTitulo() {
  const analyticsTitleInput = document.getElementById('_marketingData[0].analyticsTitle');

  if (analyticsTitleInput && analyticsTitleInput.value) {
    // Extrai a parte original do título (tudo antes de qualquer " | " existente)
    const originalTitle = analyticsTitleInput.value.split(' | ')[0];

    const today = new Date();
    const ano = today.getFullYear();
    // Garante que o mês e o dia tenham dois dígitos (ex: 01, 05)
    const mes = String(today.getMonth() + 1).padStart(2, '0');
    const dia = String(today.getDate()).padStart(2, '0');

    // Constrói a data no formato _YYYYMMDD
    const dataFormatada = `_${ano}${mes}${dia}`;

    // Atualiza o valor do input com o título original e a nova data formatada,
    // sem o " | " entre eles.
    analyticsTitleInput.value = `${originalTitle}${dataFormatada}`;
    console.log('Input Analytics Title: Data atualizada para _YYYYMMDD sem separador.');
  }
}

  // --- Lógica de Auto-clique no Carrossel ---
  // A variável global window._carouselInterval é usada para gerenciar o intervalo,
  // permitindo que ele seja limpo e reiniciado corretamente.
  if (!window._carouselInterval) {
      window._carouselInterval = null;
  }

  function runCarouselScript() {
  let attempts = 0;
  const maxAttempts = 10;

  const intervalId = setInterval(() => {
    attempts++;

    const carousels = document.querySelectorAll('.carousel.full-image-carousel');
    const widgetItems = Array.from(document.querySelectorAll('.widget-categories-list .overall-container'));

    if (carousels.length > 0 && widgetItems.length > 0) {
      carousels.forEach(carousel => {
        // Evita duplicar listeners
        if (carousel.dataset.listenerAttached === 'true') return;

        carousel.addEventListener('click', () => {
          const img = carousel.querySelector('img[title]');
          if (!img) return;

          const title = img.title.trim();

          const widgetItem = widgetItems.find(item => {
            const spanTitle = item.querySelector('span.widget-title');
            return spanTitle && spanTitle.textContent.trim() === title;
          });

          if (!widgetItem) {
            // console.log('Título não encontrado na lista de widgets:', title);
            return;
          }

          // console.log('Clicando no overall-container com título:', title);
          widgetItem.click();
        });

        carousel.dataset.listenerAttached = 'true';
      });

      // console.log('Auto click: listeners adicionados com sucesso.');
    }

    if (attempts >= maxAttempts) {
      clearInterval(intervalId);
      // console.log('Auto click: fim das tentativas.');
    }
  }, 1000);
}


  // --- Anexa Listeners de Input (para elementos dinâmicos) ---
  // A variável global window._inputObserver é usada para gerenciar o MutationObserver.
  if (!window._inputObserver) {
      window._inputObserver = null;
  }

  function attachInputListeners() {
      // Cria um único observer se ainda não foi criado
      if (!window._inputObserver) {
          window._inputObserver = new MutationObserver((mutationsList, observer) => {
              for (const mutation of mutationsList) {
                  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                      ['_marketingData[0].deeplinkQuery', '_marketingData[0].analyticsTitle'].forEach(id => {
                          const el = document.getElementById(id);
                          if (el && !el.dataset.listenerAttached) { // Verifica se o listener já foi anexado
                              const fn = id.includes('deeplink') ? limparEspacosInput : atualizarDataNoTitulo;
                              el.addEventListener('blur', fn);
                              el.dataset.listenerAttached = 'true'; // Marca como anexado
                              console.log(`Input Listener: Anexado para ${id}`);
                          }
                      });
                  }
              }
          });
          // Começa a observar o corpo do documento para mudanças na DOM
          window._inputObserver.observe(document.body, { childList: true, subtree: true });
          console.log('Input Listener: MutationObserver para inputs iniciado.');
      }

      // Anexa os listeners também para elementos já presentes no carregamento inicial
      ['_marketingData[0].deeplinkQuery', '_marketingData[0].analyticsTitle'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.dataset.listenerAttached) {
            const fn = id.includes('deeplink') ? limparEspacosInput : atualizarDataNoTitulo;
            el.addEventListener('blur', fn);
            el.dataset.listenerAttached = 'true';
            console.log(`Input Listener: Anexado para ${id} (no carregamento inicial).`);
        }
      });
  }

  // --- Detecção de Mudanças de URL (SPA) ---
  let lastUrl = location.href;
  const observerUrl = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log('URL Changed (SPA):', lastUrl);
      // Re-executa o script do carrossel e re-anexa os listeners de input em navegação SPA
      runCarouselScript();
      attachInputListeners();
      // Re-inicializa elementos CMS Helper, pois o DOM pode ter mudado
      initializeCmsHelperElements();
      // As funcionalidades do CMS Helper (bordas, títulos, expirados) NÃO re-aplicarão automaticamente
      // para dar ao usuário controle explícito via botões. Se a persistência for desejada,
      // precisaria de um mecanismo de salvamento/carregamento de estado no chrome.storage.local.
    }
  });
  observerUrl.observe(document.body, { childList: true, subtree: true });
  console.log('URL Observer: Iniciado para detectar mudanças SPA.');

  // --- Listener Unificado de Mensagens (do background.js e floating.js) ---
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // console.log('Automação Shop App: Mensagem recebida:', message.action);

    switch (message.action) {
      case 'show_panel':
        if (iframe && btnRestore) {
          iframe.style.display = 'block';
          btnRestore.style.display = 'none';
          chrome.storage.local.set({ isPanelMinimized: false });
          console.log('Automação Shop App: Comando show_panel recebido.');
        }
        break;
      case 'executeAutomation':
        console.log('Automação Shop App: Comando executeAutomation recebido.', message.data);
        // Implemente a lógica de automação aqui usando message.data.campo1 e message.data.campo2
        // Exemplo: document.getElementById('someField').value = message.data.campo1;
        break;
      case 'toggleMinimizeIframe':
        if (iframe && btnRestore) {
          const isCurrentlyMinimized = iframe.style.display === 'none';
          if (isCurrentlyMinimized) {
            iframe.style.display = 'block';
            btnRestore.style.display = 'none';
            chrome.storage.local.set({ isPanelMinimized: false });
            console.log('Automação Shop App: Iframe maximizado por toggle.');
          } else {
            iframe.style.display = 'none';
            btnRestore.style.display = 'block';
            chrome.storage.local.set({ isPanelMinimized: true });
            console.log('Automação Shop App: Iframe minimizado por toggle.');
          }
        }
        break;
      case 'updateIframePosition':
        if (iframe) {
          Object.assign(iframe.style, message.value);
          chrome.storage.local.set({ extBoxPosition: message.value });
          console.log('Automação Shop App: Posição do iframe atualizada para:', message.value);
        }
        break;
      case 'addRedBorders':
        addRedBorders();
        break;
      case 'removeRedBorders':
        removeRedBorders();
        break;
      case 'addTitles':
        addTitles();
        break;
      case 'removeTitles':
        removeTitles();
        break;
      case 'showExpired':
        showExpired();
        break;
      case 'hideExpired':
        hideExpired();
        break;
      case 'deactivateExtension':
        // Remove elementos da extensão e limpa listeners ao sair de uma URL do ShopApp
        console.log("Automação Shop App: Comando deactivateExtension recebido. Limpando elementos e listeners.");
        if (iframe && iframe.parentNode) {
            iframe.remove();
        }
        if (btnRestore && btnRestore.parentNode) {
            btnRestore.remove();
        }
        // Limpa funcionalidades do CMS Helper
        removeTitles();
        removeRedBorders();
        hideExpired();

        // Limpa intervalo do carrossel se ativo
        if (window._carouselInterval) {
            clearInterval(window._carouselInterval);
            window._carouselInterval = null;
        }

        // Desconecta e limpa o observer de input e listeners
        if (window._inputObserver) {
            window._inputObserver.disconnect();
            window._inputObserver = null;
            ['_marketingData[0].deeplinkQuery', '_marketingData[0].analyticsTitle'].forEach(id => {
                const el = document.getElementById(id);
                if (el && el.dataset.listenerAttached) {
                    const fn = id.includes('deeplink') ? limparEspacosInput : atualizarDataNoTitulo;
                    el.removeEventListener('blur', fn);
                    delete el.dataset.listenerAttached;
                }
            });
        }
        console.log("Automação Shop App: Extensão desativada e elementos limpos.");
        break;
    }
    sendResponse({ status: 'ok' }); // Confirma o recebimento da mensagem
  });

  // --- Execução Inicial do Script ao Carregar a Página ---
  // Garante que o DOM esteja totalmente carregado antes de interagir com ele.
  window.addEventListener('load', () => {
    console.log('Automação Shop App: window.load event disparado. Executando scripts iniciais.');
    runCarouselScript();
    attachInputListeners(); // Anexa listeners de input no carregamento inicial
    initializeCmsHelperElements(); // Varredura inicial de elementos para funcionalidades helper
  });

  // Verifica se o documento já está pronto (útil para desenvolvimento ou recargas rápidas)
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // console.log('Automação Shop App: document.readyState é completo/interativo, executando scripts iniciais.');
    runCarouselScript();
    attachInputListeners();
    initializeCmsHelperElements();
  }

})();