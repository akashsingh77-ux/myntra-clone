let bagItems;
let wishlistItems;
onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem("bagItems");
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  
  let wishlistItemsStr = localStorage.getItem("wishlistItems");
  wishlistItems = wishlistItemsStr ? JSON.parse(wishlistItemsStr) : [];

  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category");

  if (selectedCategory) {
    displayFilteredCategory(selectedCategory);
  } else {
    displayItemsOnHomePage(items);
  }

  displayBagIcon();
  displayWishlistIcon();
  setupSearch();
  injectModalStyles();
  setupHeaderActions();
}


function addToBag(itemId, event) {
  bagItems.push(String(itemId));
  localStorage.setItem("bagItems", JSON.stringify(bagItems));
  displayBagIcon();
 
  if (event && event.target) {
    const btn = event.target;
    const originalText = btn.innerText;
    
    btn.classList.add('btn-active-click');
    btn.innerText = "Added! ✓";
    btn.style.backgroundColor = "#03a685"; 

    
    setTimeout(() => {
      btn.classList.remove('btn-active-click');
      btn.innerText = originalText;
      btn.style.backgroundColor = "";
    }, 1000);
  }
  
  const itemObj = items.find(product => product.id === String(itemId));
  const brandName = itemObj ? itemObj.company : "Item";
  
  showToastNotification(`Successfully added ${brandName} to your bag!`);
}

function showToastNotification(message) {
  let toast = document.getElementById("app-toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast-notice";
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color: #03a685; font-size: 20px;">check_circle</span>
    <span>${message}</span>
  `;
  
  setTimeout(() => {
    toast.className = "toast-notice active";
  }, 50);

  setTimeout(() => {
    toast.className = "toast-notice";
  }, 3000);
}

function toggleWishlist(itemId) {
  const itemStrId = String(itemId);
  const index = wishlistItems.indexOf(itemStrId);
  if (index > -1) {
    wishlistItems.splice(index, 1);
    showToastNotification("Removed from Wishlist");
  } else {
    wishlistItems.push(itemStrId);
    showToastNotification("Added to Wishlist!");
  }
  localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  displayWishlistIcon();
  
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category");
  if (selectedCategory) {
    displayFilteredCategory(selectedCategory);
  } else {
    displayItemsOnHomePage(items);
  }
}

function displayBagIcon() {
  let bagItemCountElement = document.querySelector(".bag-item-count");
  if (!bagItemCountElement) return;
  
  if (bagItems.length > 0) {
    bagItemCountElement.style.visibility = "visible";
    bagItemCountElement.innerText = bagItems.length;
  } else {
    bagItemCountElement.style.visibility = "hidden";
  }
}

function displayWishlistIcon() {
  let wishlistCountElement = document.querySelector(".wishlist-item-count");
  if (!wishlistCountElement) return;
  
  if (wishlistItems.length > 0) {
    wishlistCountElement.style.visibility = "visible";
    wishlistCountElement.innerText = wishlistItems.length;
  } else {
    wishlistCountElement.style.visibility = "hidden";
  }
}

function displayFilteredCategory(category) {
  let filtered = items.filter((item) => {
    let itemName = item.item_name.toLowerCase();
    if (category === "men") return itemName.includes("men") || itemName.includes("jersey") || itemName.includes("t-shirt");
    if (category === "women") return itemName.includes("women") || itemName.includes("studs") || itemName.includes("dress") || itemName.includes("skirts");
    if (category === "beauty") return itemName.includes("deodrant") || itemName.includes("studs");
    return false;
  });
  displayItemsOnHomePage(filtered);
}

function displayItemsOnHomePage(itemsToDisplay) {
  let itemsContainerElement = document.querySelector(".items-container");
  if (!itemsContainerElement) return;

  let innerHTML = "";
  itemsToDisplay.forEach((item) => {
    const isWishlisted = wishlistItems.includes(String(item.id));
    innerHTML += `
      <div class="item-container" style="position: relative;">
        <span class="material-symbols-outlined wishlist-heart ${isWishlisted ? 'active-heart' : ''}" onclick="toggleWishlist('${item.id}')">
          favorite
        </span>
        <img class="item-image" src="${item.image}" alt="item image" />
        <div class="rating">${item.rating.stars} ⭐ | ${item.rating.count}</div>
        <div class="company-name">${item.company}</div>
        <div class="item-name">${item.item_name}</div>
        <div class="price">
          <span class="current-price">Rs ${item.current_price}</span>
          <span class="original-price">Rs ${item.original_price}</span>
          <span class="discount-price">(${item.discount_percentage}% OFF)</span>
        </div>
        <!-- Notice we are passing 'event' here directly -->
        <button class="btn-add-bag" onclick="addToBag('${item.id}', event)">Add to Bag</button>
      </div>`;
  });
  itemsContainerElement.innerHTML = innerHTML || `<div style="padding: 40px; font-size: 20px; color: #535766; width:100%; text-align:center;">No products match your criteria.</div>`;
}

function setupSearch() {
  const searchInput = document.querySelector(".search_input");
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = items.filter(item => 
      item.company.toLowerCase().includes(query) || item.item_name.toLowerCase().includes(query)
    );
    displayItemsOnHomePage(filtered);
  });
}

function setupHeaderActions() {
  const profileBtn = document.querySelector(".profile-action-btn");
  const wishlistBtn = document.querySelector(".wishlist-action-btn");
  
  if (profileBtn) profileBtn.onclick = openProfileModal;
  if (wishlistBtn) wishlistBtn.onclick = openWishlistModal;
}

function openProfileModal() {
  let modal = document.getElementById("custom-app-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "custom-app-modal";
    document.body.appendChild(modal);
  }
  modal.className = "custom-modal active";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="closeCustomModal()">×</span>
      <div style="text-align: center; border-bottom: 1px solid #eaeaec; padding-bottom:15px; margin-bottom:15px;">
         <span class="material-symbols-outlined" style="font-size: 60px; color: #ff3f6c;">account_circle</span>
         <h2 style="margin-top:8px; color:#282c3f;">Akash Singh</h2>
         <p style="color:#696e79; font-size:14px;">Software Engineering Portfolio Student</p>
      </div>
      <div style="line-height: 1.8; color: #3e4152; font-size: 14px;">
         <div><strong>Institution:</strong> National Institute of Technology, Agartala (NIT Agartala)</div>
         <div><strong>Department:</strong> Computer Science & Engineering</div>
         <div><strong>Core Skills:</strong> Data Structures (C++), Web Development (HTML/CSS/JS Sandbox Architecture)</div>
      </div>
    </div>`;
}

function openWishlistModal() {
  let modal = document.getElementById("custom-app-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "custom-app-modal";
    document.body.appendChild(modal);
  }
  modal.className = "custom-modal active";
  
  let wishlistHTML = "";
  const wishlistedObjects = wishlistItems.map(id => items.find(p => p.id === String(id))).filter(Boolean);
  
  if (wishlistedObjects.length === 0) {
    wishlistHTML = `<p style="text-align:center; padding:20px; color:#7e818c;">Your wishlist is empty!</p>`;
  } else {
    wishlistedObjects.forEach(item => {
      wishlistHTML += `
        <div style="display:flex; align-items:center; justify-content:between; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #f5f5f6;">
          <img src="${item.image}" style="width:50px; height:65px; object-fit:cover; margin-right:12px; border-radius:2px;">
          <div style="flex-grow:1;">
            <div style="font-weight:700; font-size:13px; color:#282c3f;">${item.company}</div>
            <div style="font-size:12px; color:#535766; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">${item.item_name}</div>
            <div style="font-size:12px; font-weight:700; color:#282c3f;">Rs ${item.current_price}</div>
          </div>
          <button onclick="addToBag('${item.id}'); toggleWishlist('${item.id}'); openWishlistModal();" style="background:#ff3f6c; color:white; border:none; padding:6px 10px; font-size:11px; font-weight:600; border-radius:3px; cursor:pointer;">Move to Bag</button>
        </div>`;
    });
  }

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="closeCustomModal()">×</span>
      <h3 style="margin-bottom:15px; color:#282c3f; border-bottom:1px solid #eaeaec; padding-bottom:10px;">My Wishlist (${wishlistedObjects.length} Items)</h3>
      <div style="max-height: 350px; overflow-y:auto; padding-right:5px;">
        ${wishlistHTML}
      </div>
    </div>`;
}

function closeCustomModal() {
  const modal = document.getElementById("custom-app-modal");
  if (modal) modal.className = "custom-modal";
}

function injectModalStyles() {
  if (document.getElementById("modal-style-block")) return;
  const style = document.createElement("style");
  style.id = "modal-style-block";
  style.innerHTML = `
    .wishlist-heart { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.8); border-radius: 50%; padding: 6px; cursor: pointer; color: #7e818c; font-size: 20px; transition: all 0.2s ease; z-index:5; font-variation-settings: 'FILL' 0; }
    .wishlist-heart:hover { transform: scale(1.1); color: #ff3f6c; }
    .wishlist-heart.active-heart { color: #ff3f6c; font-variation-settings: 'FILL' 1; }
    .custom-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
    .custom-modal.active { opacity: 1; pointer-events: auto; }
    .modal-content { background: white; padding: 25px; border-radius: 8px; width: 400px; max-width: 90%; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.15); animation: slideDown 0.3s ease; }
    .close-modal { position: absolute; top: 10px; right: 15px; font-size: 28px; cursor: pointer; color: #3e4152; }
    .close-modal:hover { color: #ff3f6c; }
    @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .wishlist-item-count { background-color: #ff3f6c; text-align: center; line-height: 18px; padding: 0 6px; height: 18px; position: relative; border-radius: 50%; font-size: 12px; color: #fff; left: 18px; top: -44px; font-weight: 700; cursor: pointer; }
    
    /* Smooth transition framework for interactive action buttons */
    .btn-add-bag { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .btn-active-click { transform: scale(0.93); filter: brightness(0.95); }

    /* Updated Layout Configuration: Toast Drop-Down From Top Center */
    .toast-notice { 
      position: fixed; 
      top: -100px; 
      left: 50%;
      transform: translateX(-50%); 
      background: #282c3f; 
      color: white; 
      padding: 14px 24px; 
      border-radius: 4px; 
      font-size: 14px; 
      font-weight: 600; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.2); 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      z-index: 100000; 
      opacity: 0; 
      transition: top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease; 
    }
    .toast-notice.active { 
      top: 35px; 
      opacity: 1; 
    }
  `;
  document.head.appendChild(style);
}