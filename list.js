document.addEventListener('DOMContentLoaded', function () {
  var linkList = document.getElementById('linkList');

  chrome.storage.local.get({ links: [] }, function (data) {
    var links = data.links;

    links.forEach(function (link) {
      var listItem = document.createElement('li');
      var linkElement = document.createElement('a');
      linkElement.textContent = link.url; // Utilisez link.url pour afficher correctement l'URL
      linkElement.href = link.url; // Utilisez link.url pour l'URL
      linkElement.target = '_blank';
      listItem.appendChild(linkElement);

      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', function () {
        links = links.filter(function (item) {
          return item.url !== link.url; // Utilisez item.url pour la comparaison
        });
        chrome.storage.local.set({ links: links }, function () {
          listItem.remove();
        });
      });
      listItem.appendChild(deleteButton);

      linkList.appendChild(listItem);
    });
  });
});
