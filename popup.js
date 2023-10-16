document.addEventListener('DOMContentLoaded', function () {
  var recordButton = document.getElementById('recordButton');
  var listButton = document.getElementById('listButton'); // Bouton pour afficher la liste

  // Fonction pour enregistrer un lien dans le stockage local
  function saveLink(url) {
    if (url) {
      chrome.storage.local.get({ links: [] }, function (data) {
        var links = data.links;
        // Vérifier si le lien existe déjà
        if (!links.includes(url)) {
          links.push(url);
          chrome.storage.local.set({ links: links }, function() {
            console.log('Lien enregistré : ' + url);
            successMessage.style.display = 'block';
          });
        } else {
          alert('Le lien existe déjà dans la liste.');
        }
      });
    } else {
      alert('Impossible de récupérer le lien.');
    }
  }

  recordButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      var url = currentTab ? currentTab.url : null; 
      saveLink(url);
    });
  });

  listButton.addEventListener('click', function () {
    chrome.tabs.create({ url: chrome.runtime.getURL('list.html') });
  });
});
