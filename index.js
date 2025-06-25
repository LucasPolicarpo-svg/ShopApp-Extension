const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
document.head.appendChild(link);

function applyChanges() {
  // Função que aplica as bordas
  function applyBorders() {
    const cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');
    const cmsHelperExpiredDivs = document.querySelectorAll('div.widget-card-expired');

    const expiredSpanTexts = Array.from(cmsHelperExpiredDivs)
      .flatMap(div => Array.from(div.querySelectorAll('span')).map(span => span.innerText.trim()));

    cmsHelpertargetImages.forEach((img) => {
      const titleText = img.getAttribute('title').trim();
      const hasMatch = expiredSpanTexts.includes(titleText);

      if (hasMatch) {
        img.parentNode.style.border = '4px solid red';
      }
    });
  }

  function addTitles() {
    if (!cmsHelpertargetImages) {
        var cmsHelpertargetImages = null;
        }
        cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');

        // Agora, só um loop pelas imagens
        cmsHelpertargetImages.forEach((img) => {
          
        const titleText = img.getAttribute('title').trimEnd();

        // Adiciona o span com o título, se ainda não tiver
        if (titleText && !img.nextSibling?.classList?.contains('cms-helper-title')) {
            const span = document.createElement('span');
            span.className = 'cms-helper-title';
            span.style.background = "#e3e3e3"
            span.style.display = "flex";
            span.style.flexDirection = "column";
            span.style.fontSize = "15px";
            span.style.fontWeight = "bold";
            span.style.textWrap = "wrap";
            span.style.fontFamily = "Poppins";
            span.style.color = "#454545";
            span.style.maxWidth = "270px";
            span.innerText = titleText;
            img.parentNode.appendChild(span);
            
            const paste = document.createElement('img');
            paste.style.width = "15px";
            paste.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABOZJREFUeJztmk9sFGUYxp/n2y3F2D9bY7REbPyDXuofYjW2BGPo7sdQE/BgSnpSNCYePJAYDp400UBiol5EvKCVm3a5aI11u7NaaWy5KClRFIGEBA7GqAVbpG5n5vVAabZL7c7Mzs63hP6SJjuz7/s97/fsfNt3vh0iQrTWaQAvAtgMoB3A3yIyRXJodnb20OTk5OUo9aKAUQyyY8eO5rm5uUEReWaFsFNKqYFcLvdDFJpRUbUBPT09NzU1NX0D4PFKsSIyA+BJ27aPVasbFaraAZqbm/fBx+QBgGQzyaG+vr7GanWjoioDLMtaJyIvl54jeRxAJplMtnqe1wng47K0DY7j7KpGN0oCLQHLsrZ4nvcsgJsBgOR6EekpCTknIg/atn2xNE9rPQhgV2kcgKMLr10RmWhrazuQzWbdwDOokqTfwG3btt3luu4IgMXLV0SWxIjIh+WTBwCl1Nue5+0qOXXnwh8AgOTA9PQ0ALznu/KI8L0EHMd5BCWTX3Ywpb5f7nxLS8svAC6tlEtyk99aomTJEujv719z4cKFF0RkJ8lOALcFGOvE2rVrHxseHv5nuTe11u8AeCXAeJdInhGRkWQyuX9kZOR8gFzfLBqgtd5I8rCI3Osz9yiAdwGA5CyAI6Ojoyt+yplMppvk1Uu/G/4NuUxyz+jo6AGf8b4hcGXyAMYBNAXIzebz+Z1hhbXW/QCGAqa9ms/n3wqruRyqr6+vkeRhBJu8Kfal0+meymH+UY7jPB/gsl+E5JpqhEPmq0Qi8UY1utfUkclkvia5JUTuvyS/EpFiSO1ulPwrDIA7Pz/fPjY29kdI3SUkST4UMrdRRJ6OooiAJBoaGjoBfBvFYArALVEMFCcicmtUYylEdEscJySrvom7SmQDXa+sGmC6ANOsGmC6ANP43g+oNSIyo5T6EcDvlZorETkXlW49GDABYG9bW5udzWbDdpWhMWnAvIjstm37A4M1GDPAE5F+27Y/M6S/iBEDSL6Zz+evmbxlWZ2u626o9k7z/xCRooicKhQKJ66eM2HA+ZmZmSWbGul0+n6l1CHP87rJ2nXmJEESWusJpdRzuVzutAkDPir9jbC3t/cOpdQRALfHWMMmERnXWnfF3geQ/LL0OJlMvo54Jw8AEJF2AK/FboDruqfLTm2Pu4ZS7dgNKBQKf5Uei0jsn34J60y0wlJ2bHI/IrqNheuVVQNMF2CaVQNMF2CaVQNMF2CaG96AetgRWpGF3x8/RYUnTMpyEiLyKIDdqDDHujaA5Jlisbh9bGzMCZH+idaaqPAQRl0vARE5GXLyAACSP1WKqWsDAGzeunXr3WESu7q6GkRkoFJcXS8BAC0ickxr/R0CfAcASADYCOCeSoH1bgAAtAJ4qlaD1/sSqDkK196f31AkAfwJILInLqImjj7gOIDeqqqsEXH1AUEfVoyNWPqAVCo1CKB8p7ZeqHkfQACwLOth13XHSTaHEQtCPp9fsgmqta70JXwRQG37gFwuN2VZ1hOe52UB3BdAKA7i6QNyudxUKpV6gORLJG2Sv9VKtJ4w/oygjyVQU1Y7QdMFmKYeDJg3qF2sBwN+Nah90rgBInLQlDbJg8YNcBxnv4h8YUD689bW1vcTBoSXcPbsWa+joyOrlJomuR5AClc6uVpQBPAzyb2pVGpPNpt1/wPemZztwPuj8gAAAABJRU5ErkJggg==';
            span.appendChild(paste);
            paste.style.position = "absolute";
            paste.style.right = "10px";
            paste.style.marginTop = "2px";
            paste.style.cursor = "pointer";
            paste.style.zIndex = "10000";

            async function pasteToClipboard() {
              await navigator.clipboard.writeText(titleText);
            }

            paste.addEventListener('click', pasteToClipboard);
        }
        });

  }

//   function clearBorders() {
//     document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]').forEach((img) => {
//       img.parentNode.style.border = '';
//     });
//   }

  // Verifica o estado salvo (se deve aplicar ou não)
  function checkAndApply() {
    const active = localStorage.getItem('cmsHelperActive');
    if (active === 'true') {
      addTitles();
      applyBorders();
    }
  }

  // Observar mudanças na DOM (para reaplicar caso recarregue via Ajax)
  const observer = new MutationObserver(() => {
    checkAndApply();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Ativa o recurso assim que o script rodar
  localStorage.setItem('cmsHelperActive', 'true');
  checkAndApply();

  // Expõe a função de limpar (o seu CTA pode chamar isso depois)
  window.cmsHelperStop = function() {
    localStorage.setItem('cmsHelperActive', 'false');
    clearBorders();
  };

};

function removeChanges() {
  const spans = document.querySelectorAll('.cms-helper-title');
  spans.forEach((span) => {
    span.style.display = "none";
  })

  cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');
  cmsHelperExpiredDivs = document.querySelectorAll('div.widget-card-expired');

  // Primeiro, cria um array com TODOS os textos de spans dentro das divs expiradas
  expiredSpanTexts = Array.from(cmsHelperExpiredDivs)
    .flatMap(div => Array.from(div.querySelectorAll('span')).map(span => span.innerText));

  // Agora, só um loop pelas imagens
  cmsHelpertargetImages.forEach((img) => {
    const titleText = img.getAttribute('title').trimEnd();

    const hasMatch = expiredSpanTexts.includes(titleText);

    if (hasMatch) {
      img.parentNode.style.border = 'none';
    }
  });
}

let isExtensionActive = false;

function activateExtension() {
    if (isExtensionActive) {
        console.log("Extensão ativada para URL com '/offer'!");
        applyChanges();
    }
}

function deactivateExtension() {
    console.log("Desativando a extensão (URL não contém '/offer').");
    isExtensionActive = false; // Define o estado como inativo

    removeChanges();
}

// Escutar mensagens do Service Worker (background.js)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "deactivateExtension") {
        deactivateExtension();
    }
    // Você pode adicionar outras ações aqui se precisar
});


isExtensionActive = true;
activateExtension();



