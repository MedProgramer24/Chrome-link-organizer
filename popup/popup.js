document.addEventListener("DOMContentLoaded", function () {
  // Show the form page initially
  const formPage = document.getElementById("formPage");
  const savedLinksPage = document.getElementById("savedLinksPage");
  const backBtn = document.getElementById("backBtn");
  const saveBtn = document.getElementById("saveBtn");
  const linkNameInput = document.getElementById("linkName");
  const categorySelect = document.getElementById("category");
  const linksList = document.getElementById("linksList");
  const searchInput = document.getElementById("searchInput"); 
  const modal = document.getElementById("editModal");
  const editTitle = document.getElementById("editTitle");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const deleteLinkBtn = document.getElementById("deleteLinkBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");

  chrome.storage.local.get({ links: [] }, (result) => {
    if (result.links.length > 0) {
      showSavedLinksPage();
    }
  });

  
  saveBtn.addEventListener("click", () => {
    var name = linkNameInput.value.trim() || "Untitled";
    if (name.length > 9) {
      name = name.substring(0, 5) + "...";
    }
    const category = categorySelect.value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const favicon = tabs[0].favIconUrl;

      chrome.storage.local.get({ links: [] }, (result) => {
        const links = result.links;
        links.push({ name, url, category, favicon });
        chrome.storage.local.set({ links }, () => {
          showSavedLinksPage();
          renderLinks();
        });
      });
    });
  });

  function renderLinks(filterCategory = "") {
    chrome.storage.local.get({ links: [] }, (result) => {
      linksList.innerHTML = "";
  
      const filteredLinks = result.links.filter((link) =>
        link.category.toLowerCase().includes(filterCategory.toLowerCase())
      );
  
      filteredLinks.forEach((link, index) => {
        const item = document.createElement("li");
        item.classList.add("link-item");
        item.innerHTML = `
          <div class="link-info">
            <div class="image-fav">
              <a href="${link.url}" target="_blank" class="open-link">
                <img id="favicon-${index}" src="${link.favicon}" alt="Favicon" class="favicon" />
              </a>
              <span class="three-dots" data-index="${index}">...</span>
            </div>
            <div class="link-details">
              <strong>${link.name}</strong>
            </div>
          </div>
        `;
        linksList.appendChild(item);
  
        const img = document.getElementById(`favicon-${index}`);
        img.onerror = function () {
          this.src = "../icons/default-favicon.png"; 
        };
      });
    });
  }
  
  

  // Show modal for editing or deleting the link
  function showModal(index) {
    chrome.storage.local.get({ links: [] }, (result) => {
      const link = result.links[index];
      editTitle.value = link.name;
      modal.style.display = "flex";

      // Save changes
      saveEditBtn.onclick = () => {
        const newTitle = editTitle.value.trim();
        if (newTitle) {
          link.name = newTitle;
          chrome.storage.local.set({ links: result.links }, () => {
            renderLinks();
            modal.style.display = "none";
          });
        }
      };

      // Delete link
      deleteLinkBtn.onclick = () => {
        result.links.splice(index, 1);
        chrome.storage.local.set({ links: result.links }, () => {
          renderLinks();
          modal.style.display = "none";
        });
      };
    });
  }

  // Event Delegation for Dynamic Elements (CSP-safe)
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("three-dots")) {
      const index = event.target.dataset.index;
      showModal(index);
    }
  });

  // Search links by category
  searchInput.addEventListener("input", () => {
    const filterValue = searchInput.value.trim();
    renderLinks(filterValue);
  });

  // Close Modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Show saved links page
  function showSavedLinksPage() {
    formPage.style.display = "none";
    savedLinksPage.style.display = "block";
    renderLinks();
  }

  // Back button to return to form page
  backBtn.addEventListener("click", () => {
    savedLinksPage.style.display = "none";
    formPage.style.display = "block";
  });
});
