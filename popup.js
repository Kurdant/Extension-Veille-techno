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
  const FavLinks = document.getElementById('Fav_Links');
  const Save_Fav_Button = document.getElementById('saveFavLink');


  Save_Fav_Button.addEventListener('click', function () {
    const title = titleInput.value;
    const category = categorySelect.value;

    if (title && category) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab) {
          const url = currentTab.url;
          chrome.storage.local.get({ favLinks: [] }, function (data) {
            const favLinks = data.favLinks;
            const isLinkExists = favLinks.some(function (link) {
              return link.url === url;
            });
            if (!isLinkExists) {
              const linkObject = { url: url, title: title, category: category };
              favLinks.push(linkObject);

              // Limit the number of favorite links to 10
              if (favLinks.length > 10) {
                favLinks.shift();
              }

              chrome.storage.local.set({ favLinks: favLinks }, function () {
                console.log('Favorite Link saved: ' + url);
                modal.close();
                titleInput.value = '';
                successMessage.style.display = 'block';
                setTimeout(function () {
                  successMessage.style.display = 'none';
                }, 3000);
                updateFavLinksList();
              });
            } else {
              alert('Favorite Link already saved');
            }
          });
        } else {
          console.log('Impossible to save the link');
        }
      });
    } else {
      alert('Please choose a name and a category');
    }
  });
  
  
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

      chrome.storage.local.get({ categories: [] }, function (data) {
        const categories = data.categories;
        categories.push(newCategory);
        chrome.storage.local.set({ categories: categories });
      });
    }
  });

  const deleteCategoryElement = document.querySelector('.deleteCategory');
  const confirmationMessageElement = document.querySelector('.confirmationMessage');

  deleteCategoryElement.addEventListener('click', function () {
    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
      confirmationMessageElement.textContent = `Are you sure you want to delete "${selectedCategory}" ?`;
      confirmationMessageElement.style.display = 'block';

      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Confirm';
      confirmationMessageElement.appendChild(confirmButton);

      confirmButton.addEventListener('click', function () {
        const options = categorySelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === selectedCategory) {
            categorySelect.remove(i);
            break;
          }
        }

        chrome.storage.local.get({ categories: [] }, function (data) {
          const categories = data.categories;
          const categoryIndex = categories.indexOf(selectedCategory);
          if (categoryIndex !== -1) {
            categories.splice(categoryIndex, 1);
            chrome.storage.local.set({ categories: categories });

            chrome.storage.local.get({ links: [] }, function (data) {
              const links = data.links;
              const updatedLinks = links.filter(link => link.category !== selectedCategory);
              chrome.storage.local.set({ links: updatedLinks });
            });
          }
        });

        confirmationMessageElement.style.display = 'none';
      });
    }
  });

  recordButton.addEventListener('click', function () {
    modal.showModal();
  });

  const closeModalButton = document.getElementById('closeModal');

  closeModalButton.addEventListener('click', function () {
    modal.close();
  });

  saveLinkButton.addEventListener('click', function () {
    const title = titleInput.value;
    const category = categorySelect.value;

    if (title && category) {
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
              chrome.storage.local.set({ links: links }, function () {
                console.log('Link saved: ' + url);
                modal.close();
                titleInput.value = '';
                successMessage.style.display = 'block';
                setTimeout(function () {
                  successMessage.style.display = 'none';
                }, 3000);
              });
            } else {
              alert('Page already saved');
            }
          });
        } else {
          console.log('Impossible to save the link');
        }
      });
    } else {
      alert('Please chose a name and a category');
    }
  });

  listButton.addEventListener('click', function () {
    chrome.tabs.create({ url: 'list.html' });
  });

  function updateFavLinksList() {
    FavLinks.innerHTML = '';

    chrome.storage.local.get({ favLinks: [] }, function (data) {
      const favLinks = data.favLinks;
      favLinks.forEach(function (link) {
        const listItem = document.createElement('li');

        const trashIcon = document.createElement('img');
        trashIcon.src = 'images/poubelle-de-recyclage.png';
        trashIcon.alt = 'Delete';
        trashIcon.className = 'trash-icon';

        trashIcon.addEventListener('click', function () {
          const linkIndex = favLinks.indexOf(link);
          if (linkIndex !== -1) {
            favLinks.splice(linkIndex, 1);
            chrome.storage.local.set({ favLinks: favLinks }, function () {
              updateFavLinksList();
            });
          }
        });

        const linkElement = document.createElement('a');
        linkElement.textContent = link.title;
        linkElement.href = link.url;
        linkElement.target = '_blank';

        listItem.appendChild(trashIcon);
        listItem.appendChild(linkElement);

        FavLinks.appendChild(listItem);
      });
    });
  }

  updateFavLinksList(); // Initialize the list of favorite links

  document.getElementById("chatButton").addEventListener("click", function() {
    chrome.tabs.create({ url: "ChatGPT.html" });
  });
});
