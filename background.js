// // background.js (Service Worker)

// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
//   if (details.url.startsWith("https://opstools-p1")) {
//     console.log("URL de SPA mudou para:", details.url);
//     chrome.tabs.sendMessage(details.tabId, { action: "urlChanged", newUrl: details.url });
//   }
// });



// background.js (Service Worker)

// Escuta por eventos de navegação completos (quando uma página é carregada)
chrome.webNavigation.onCommitted.addListener(function(details) {
    // Garante que é o frame principal e que está no domínio correto
    if (details.frameId === 0 && details.url.startsWith("https://opstools-p1")) {
        handleUrlChange(details.url, details.tabId);
    }
});

// Escuta por mudanças de histórico em SPAs (Single Page Applications)
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    // Garante que é o frame principal e que está no domínio correto
    if (details.frameId === 0 && details.url.startsWith("https://opstools-p1")) {
        handleUrlChange(details.url, details.tabId);
    }
});

/**
 * Função para lidar com a mudança de URL e injetar/remover o content_script.
 * @param {string} currentUrl - A URL atual da aba.
 * @param {number} tabId - O ID da aba.
 */
function handleUrlChange(currentUrl, tabId) {
    console.log("URL detectada:", currentUrl);

    // Verifica se a URL contém "/offer"
    if (currentUrl.includes("Offerv2")) {
        console.log("URL contém 'Offerv2'. Injetando index.js...");
        // Injeta o content.js
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['index.js']
        }).then(() => {
            console.log("index.js injetado com sucesso!");
        }).catch(error => {
            console.error("Erro ao injetar index.js:", error);
        });
    } else {
        console.log("URL NÃO contém 'Offerv2'. Removendo/parando index.js...");
        // Se a URL não contém "/offer", tentamos remover o content.js.
        // A remoção direta do content_script não é tão simples quanto a injeção.
        // A melhor abordagem é fazer com que o próprio content.js se desative.
        // Vamos enviar uma mensagem para o content.js (se ele estiver ativo)
        // para que ele limpe seus elementos e listeners.
        chrome.tabs.sendMessage(tabId, { action: "deactivateExtension" })
            .then(() => {
                console.log("Mensagem de desativação enviada para index.js.");
            })
            .catch(error => {
                // Erro se o content.js não estiver mais ativo ou se a mensagem não puder ser entregue
                console.warn("Não foi possível enviar mensagem de desativação (content.js talvez já esteja inativo ou não injetado):", error.message);
            });
    }
}
