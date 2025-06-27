document.addEventListener('DOMContentLoaded', function () {
  const extBox = document.getElementById('ext-box');
  const posBtns = document.getElementById('pos-btns');
  const minimizeBtn = document.getElementById('minimizar');
  const executeBtn = document.getElementById('execute');
  const copyBtns = document.querySelectorAll('.copy-btn');

  // New feature buttons
  const addRedBordersBtn = document.getElementById('addRedBorders');
  const removeRedBordersBtn = document.getElementById('removeRedBorders');
  const injectTitlesBtn = document.getElementById('injectTitles');
  const removeTitlesBtn = document.getElementById('removeTitles');
  const injectShowExpiredBtn = document.getElementById('injectShowExpired');
  const injectHideExpiredBtn = document.getElementById('injectHideExpired');

  // Position buttons event listeners - SEND MESSAGE TO CONTENT.JS
  posBtns.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'BUTTON') {
      const pos = target.dataset.pos;
      // Send message to content.js to update iframe position
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let newPosStyle = {};
        switch (pos) {
          case 'top-left':
            newPosStyle = { top: '15px', left: '15px', right: '', bottom: '' };
            break;
          case 'top-right':
            newPosStyle = { top: '15px', right: '15px', left: '', bottom: '' };
            break;
          case 'bottom-left':
            newPosStyle = { bottom: '15px', left: '15px', top: '', right: '' };
            break;
          case 'bottom-right':
            newPosStyle = { bottom: '15px', right: '15px', top: '', left: '' };
            break;
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateIframePosition', value: newPosStyle });
      });
    }
  });

  // Minimize button event listener - SEND MESSAGE TO CONTENT.JS
  minimizeBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleMinimizeIframe' });
    });
  });

  // Copy buttons event listeners
  copyBtns.forEach((button) => {
    button.addEventListener('click', function () {
      const fieldId = this.dataset.copy;
      const field = document.getElementById(fieldId);
      if (field) {
        field.select();
        document.execCommand('copy');
        //alert(`Conteúdo de ${fieldId} copiado!`);
      }
    });
  });

  // Execute button event listener - SEND MESSAGE TO CONTENT.JS
  executeBtn.addEventListener('click', function () {
    const campo1Value = document.getElementById('campo1').value;
    const campo2Value = document.getElementById('campo2').value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'executeAutomation',
        data: { campo1: campo1Value, campo2: campo2Value },
      });
    });
  });

  // New feature button event listeners - send messages to content.js
  if (addRedBordersBtn) {
    addRedBordersBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'addRedBorders' });
      });
    });
  }

  if (removeRedBordersBtn) {
    removeRedBordersBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'removeRedBorders' });
      });
    });
  }

  if (injectTitlesBtn) {
    injectTitlesBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'addTitles' }); // Mapeado para 'addTitles'
      });
    });
  }

  if (removeTitlesBtn) {
    removeTitlesBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'removeTitles' });
      });
    });
  }

  if (injectShowExpiredBtn) {
    injectShowExpiredBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showExpired' }); // Mapeado para 'showExpired'
      });
    });
  }

  if (injectHideExpiredBtn) {
    injectHideExpiredBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'hideExpired' }); // Mapeado para 'hideExpired'
      });
    });
  }
});