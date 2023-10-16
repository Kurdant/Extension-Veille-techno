document.addEventListener('DOMContentLoaded', function () {
  var linkList = document.getElementById('linkList');

  chrome.storage.local.get({ links: [] }, function (data) {
    var links = data.links;

    links.forEach(function (link) {
      var listItem = document.createElement('li');
      var linkElement = document.createElement('a');
      linkElement.textContent = link;
      linkElement.href = link;
      linkElement.target = '_blank';
      listItem.appendChild(linkElement);

      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', function () {
        links = links.filter(function (item) {
          return item !== link;
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
