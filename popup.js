document.addEventListener('DOMContentLoaded', function () {
  const recordButton = document.getElementById('recordButton');
  const modal = document.getElementById('modal');
  const saveLinkButton = document.getElementById('saveLink');
  const successMessage = document.getElementById('successMessage');
  const listButton = document.getElementById('listButton');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');

  recordButton.addEventListener('click', function () {
    modal.showModal(); // Afficher la modal
  });

  const closeModalButton = document.getElementById('closeModal');

  closeModalButton.addEventListener('click', function () {
    modal.close(); // Fermer la modal
  });

  saveLinkButton.addEventListener('click', function () {
    const title = titleInput.value;
    const category = categorySelect.value;

    if (title && category) {
      // Obtenir l'URL du lien à partir de la page active
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab) {
          const url = currentTab.url;
          // Vérifier si le lien existe déjà avant de l'enregistrer
          chrome.storage.local.get({ links: [] }, function (data) {
            const links = data.links;
            const isLinkExists = links.some(function (link) {
              return link.url === url;
            });
            if (!isLinkExists) {
              const linkObject = { url: url, title: title, category: category };
              links.push(linkObject);
              chrome.storage.local.set({ links: links }, function() {
                console.log('Lien enregistre : ' + url);
                modal.close(); 
                titleInput.value = '';
                successMessage.style.display = 'block';
              });
            } else {
              // Le lien existe déjà dans la liste, afficher un message d'erreur
              alert('Le lien est deja sauvegarde.');
            }
          });
        } else {
          console.log('Impossible de récupérer le lien.');
        }
      });
    } else {
      alert('Veuillez remplir le titre et une categorie.');
    }
  });

  listButton.addEventListener('click', function () {
    // Ouvrir la page HTML de la liste des liens
    chrome.tabs.create({ url: 'list.html' });
  });
});
