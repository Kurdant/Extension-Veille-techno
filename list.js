
document.addEventListener('DOMContentLoaded', function () {
  const linkList = document.getElementById('linkList');

  function updateList() {
    linkList.innerHTML = ''; // Efface la liste existante

    chrome.storage.local.get({ links: [] }, function (data) {
      const links = data.links;

      const categorizedLinks = {};

      links.forEach(function (link) {
        const category = link.category || 'Sans catégorie';

        if (!categorizedLinks[category]) {
          categorizedLinks[category] = [];
        }

        categorizedLinks[category].push(link);
      });

      for (const category in categorizedLinks) {
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;

        linkList.appendChild(categoryTitle);

        categorizedLinks[category].forEach(function (link, linkIndex) {
          const listItem = document.createElement('li');

          const trashIcon = document.createElement('img');
          trashIcon.src = 'images/poubelle-de-recyclage.png';
          trashIcon.alt = 'Supprimer';
          trashIcon.className = 'trash-icon';

          trashIcon.addEventListener('click', function () {
            links.splice(linkIndex, 1); // Utiliser linkIndex au lieu de i
            chrome.storage.local.set({ links: links }, function () {
              updateList();
            });
          });

          const linkElement = document.createElement('a');
          linkElement.textContent = link.title;
          linkElement.href = link.url;
          linkElement.target = '_blank';

          listItem.appendChild(trashIcon);
          listItem.appendChild(linkElement);

          linkList.appendChild(listItem);
        });
      }
    });
  }

  updateList();
});
