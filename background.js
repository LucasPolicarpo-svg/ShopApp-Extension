// background.js (Service Worker)

// Listener para o clique no ícone da extensão
chrome.action.onClicked.addListener((tab) => {
  // Verifica se a URL da aba é um domínio do ShopApp
  if (tab.url && isShopAppUrl(tab.url)) {
    // Envia uma mensagem para o content.js para mostrar o painel
    chrome.tabs.sendMessage(tab.id, { action: 'show_panel' })
      .catch(error => {
        console.warn("Automação Shop App: Não foi possível enviar a mensagem 'show_panel'. O script de conteúdo pode não estar pronto ou a URL mudou.", error);
      });
  } else {
    console.log("Automação Shop App: A extensão só funciona em domínios ShopApp (opstools-p1).");
    // Opcional: Você pode adicionar uma notificação visual aqui para o usuário.
  }
});

// Função auxiliar para verificar se a URL é um domínio do ShopApp
function isShopAppUrl(url) {
  return url.startsWith("https://opstools-p1-br.ecom-qa.samsung.com/") ||
         url.startsWith("https://opstools-p1-pe.ecom-qa.samsung.com/") ||
         url.startsWith("https://opstools-p1-cl.ecom-qa.samsung.com/") ||
         url.startsWith("https://opstools-p1-co.ecom-qa.samsung.com/") ||
         url.startsWith("https://opstools-p1-mx.ecom-qa.samsung.com/");
}

// Listener para navegações completas (carregamento de página)
chrome.webNavigation.onCommitted.addListener(function(details) {
    if (details.frameId === 0) { // Garante que é o frame principal
        handleNavigation(details.url, details.tabId);
    }
});

// Listener para mudanças de histórico em SPAs (Single Page Applications)
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if (details.frameId === 0) { // Garante que é o frame principal
        handleNavigation(details.url, details.tabId);
    }
});

/**
 * Lida com eventos de navegação para ativar ou desativar as funcionalidades no content.js.
 * @param {string} url - A URL atual da aba.
 * @param {number} tabId - O ID da aba.
 */
function handleNavigation(url, tabId) {
    if (isShopAppUrl(url)) {
        console.log("Automação Shop App: Navegação em URL do ShopApp detectada:", url);
        // Não precisamos "ativar" explicitamente aqui, pois content.js sempre é injetado.
        // O content.js irá gerenciar suas funcionalidades internamente com base na URL e mensagens.
    } else {
        console.log("Automação Shop App: Navegação fora do ShopApp. Enviando mensagem para desativar funcionalidades.");
        // Envia mensagem para o content.js para desativar suas funcionalidades e remover o painel
        chrome.tabs.sendMessage(tabId, { action: "deactivateExtension" })
            .catch(error => {
                // Erro comum se o content.js já foi removido ou não estava injetado.
                console.warn("Automação Shop App: Não foi possível enviar mensagem de desativação (content.js pode já estar inativo):", error);
            });
    }
}