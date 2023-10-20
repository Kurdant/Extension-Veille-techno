document.addEventListener('DOMContentLoaded', function () {
  const recordButton = document.getElementById('recordButton');
  const modal = document.getElementById('modal');
  const saveLinkButton = document.getElementById('saveLink');
  const successMessage = document.getElementById('successMessage');
  const listButton = document.getElementById('listButton');
  const titleInput = document.getElementById('titleInput');
  const categorySelect = document.getElementById('category');
  const createCategoryInput = document.getElementById('createCategory');
  const createCategoryButton = document.getElementById('createCategoryButton');

  // Charger les catégories depuis le stockage local
  chrome.storage.local.get({ categories: [] }, function (data) {
    const categories = data.categories;
    categories.forEach(function (category) {
      const option = document.createElement('option');
      option.value = category;
      option.text = category;
      categorySelect.add(option);
    });
  });

  createCategoryButton.addEventListener('click', function () {
    const newCategory = createCategoryInput.value;
    if (newCategory) {
      const option = document.createElement('option');
      option.value = newCategory;
      option.text = newCategory;
      categorySelect.add(option);
      createCategoryInput.value = '';

      // Mettre à jour les catégories dans le stockage local
      chrome.storage.local.get({ categories: [] }, function (data) {
        const categories = data.categories;
        categories.push(newCategory);
        chrome.storage.local.set({ categories: categories });
      });
    }
  });

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
          chrome.storage.local.get({ links: [] }, function (data) {
            const links = data.links;
            const isLinkExists = links.some(function (link) {
              return link.url === url;
            });
            if (!isLinkExists) {
              const linkObject = { url: url, title: title, category: category };
              links.push(linkObject);
              chrome.storage.local.set({ links: links }, function() {
                console.log('Lien enregistré : ' + url);
                modal.close();
                titleInput.value = '';
                successMessage.style.display = 'block';
                setTimeout(function () {
                  successMessage.style.display = 'none';
                }, 3000);
              });
            } else {
              alert('Le lien a deja ete sauvegarde.');
            }
          });
        } else {
          console.log('Impossible de récupérer le lien.');
        }
      });
    } else {
      alert('Veuillez mettre un titre et une categorie.');
    }
  });

  listButton.addEventListener('click', function () {
    chrome.tabs.create({ url: 'list.html' });
  });
});
