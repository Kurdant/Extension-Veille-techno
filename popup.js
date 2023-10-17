document.addEventListener('DOMContentLoaded', function () {
  var recordButton = document.getElementById('recordButton');
  var successMessage = document.getElementById('successMessage');
  var listButton = document.getElementById('listButton');
  var errorMessage = document.getElementById('errorMessage');

  recordButton.addEventListener('click', function () {
    // Obtenir l'URL du lien à partir de la page active
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      if (currentTab) {
        var url = currentTab.url;
        // Vérifier si le lien existe déjà avant de l'enregistrer
        chrome.storage.local.get({ links: [] }, function (data) {
          var links = data.links;
          var isLinkExists = links.some(function (link) {
            return link.url === url;
          });
          if (!isLinkExists) {
            links.push({ url: url }); // Enregistrez le lien en tant qu'objet
            chrome.storage.local.set({ links: links }, function() {
              console.log('Lien enregistré : ' + url);
              // Afficher le message de succès
              successMessage.style.display = 'block';
              // Masquer le message après quelques secondes (facultatif)
              setTimeout(function () {
                successMessage.style.display = 'none';
              }, 3000); // Masque après 3 secondes (ajustez selon vos besoins)
            });
          } else {
            // Le lien existe déjà dans la liste, afficher un message d'erreur
            errorMessage.textContent = 'Le lien a déjà été sauvegardé.';
            errorMessage.style.display = 'block';
            // Masquer le message d'erreur après quelques secondes (facultatif)
            setTimeout(function () {
              errorMessage.style.display = 'none';
            }, 3000); // Masque après 3 secondes (ajustez selon vos besoins)
          }
        });
      } else {
        console.log('Impossible de récupérer le lien.');
      }
    });
  });

  listButton.addEventListener('click', function () {
    // Ouvrir la page HTML de la liste des liens
    chrome.tabs.create({ url: 'list.html' });
  });
});
