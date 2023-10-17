document.addEventListener('DOMContentLoaded', function () {
  var linkList = document.getElementById('linkList');

  function updateList() {
    linkList.innerHTML = ''; // Efface la liste existante

    chrome.storage.local.get({ links: [] }, function (data) {
      var links = data.links;

      links.forEach(function (link) {
        var listItem = document.createElement('li');

        var trashIcon = document.createElement('img');
        trashIcon.src = 'images/poubelle-de-recyclage.png';
        trashIcon.alt = 'Supprimer';
        trashIcon.className = 'trash-icon';

        trashIcon.addEventListener('click', function () {
          links = links.filter(function (item) {
            return item !== link;
          });
          chrome.storage.local.set({ links: links }, function () {
            updateList(); // Met à jour la liste après la suppression
          });
        });

        var linkElement = document.createElement('a');
        linkElement.textContent = link.title;
        linkElement.href = link.url;
        linkElement.target = '_blank';

        listItem.appendChild(trashIcon);
        listItem.appendChild(linkElement);

        linkList.appendChild(listItem);
      });
    });
  }

  // Met à jour la liste lors du chargement initial
  updateList();
});
