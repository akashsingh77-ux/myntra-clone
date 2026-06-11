let bagItems;
let wishlistItems;
let bagItemObjects;
onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem("bagItems");
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  
  let wishlistItemsStr = localStorage.getItem("wishlistItems");
  wishlistItems = wishlistItemsStr ? JSON.parse(wishlistItemsStr) : [];

  loadBagItemsObjects();
  displayBagPage();
  injectModalStylesInBag();
  setupHeaderActions();
}

function loadBagItemsObjects() {
  bagItemObjects = bagItems.map((itemId) => {
    return items.find(product => product.id === String(itemId));
  }).filter(Boolean);
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

function displayBagPage() {
  displayBagIcon();
  displayWishlistIcon();
  
  let containerElement = document.querySelector(".bag-items-container");
  let summaryElement = document.querySelector(".bag-summary");
  
  if (bagItems.length === 0) {
    containerElement.innerHTML = `
      <div style="text-align: center; padding: 40px; font-size: 18px; width: 100%;">
        <h3>Your Shopping Bag is empty!</h3>
        <p style="color: #7e818c; margin-top: 8px;">Add items to get started.</p>
        <a href="../index.html" style="display: inline-block; margin-top: 20px; padding: 10px 30px; background: #ff3f6c; color: white; text-decoration: none; font-weight: 600; border-radius: 4px;">Shop Now</a>
      </div>`;
    summaryElement.innerHTML = "";
    return;
  }

  let innerHTML = "";
  bagItemObjects.forEach((bagItem) => {
    innerHTML += generateItemHTML(bagItem);
  });
  containerElement.innerHTML = innerHTML;
  displayBagSummary();
}

function displayBagSummary() {
  let bagSummaryElement = document.querySelector(".bag-summary");
  let totalItem = bagItemObjects.length;
  let totalMRP = 0;
  let totalDiscount = 0;
  let convenienceFee = 99;
  
  bagItemObjects.forEach(bagItem => {
    totalMRP += bagItem.original_price;
    totalDiscount += (bagItem.original_price - bagItem.current_price);
  });
  
  let finalPayment = totalMRP - totalDiscount + convenienceFee;

  bagSummaryElement.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItem} Items)</div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">₹ ${totalMRP}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value priceDetail-base-discount">-₹ ${totalDiscount}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">₹ ${convenienceFee}</span>
      </div>
      <hr style="border-top: 1px solid #eaeaec; margin: 12px 0;">
      <div class="price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">₹ ${finalPayment}</span>
      </div>
    </div>
    <button class="btn-place-order" onclick="alert('Order successfully placed simulation!')">
      <div>PLACE ORDER</div>
    </button>`;
}

function removeFromBag(itemId) {
  const index = bagItems.indexOf(String(itemId));
  if (index > -1) {
    bagItems.splice(index, 1);
  }
  localStorage.setItem("bagItems", JSON.stringify(bagItems));
  loadBagItemsObjects();
  displayBagPage();
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
      // Adjusted image source pathing context since we are nested inside /pages folder
      wishlistHTML += `
        <div style="display:flex; align-items:center; justify-content:between; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #f5f5f6;">
          <img src="../${item.image}" style="width:50px; height:65px; object-fit:cover; margin-right:12px; border-radius:2px;">
          <div style="flex-grow:1;">
            <div style="font-weight:700; font-size:13px; color:#282c3f;">${item.company}</div>
            <div style="font-size:12px; color:#535766; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">${item.item_name}</div>
            <div style="font-size:12px; font-weight:700; color:#282c3f;">Rs ${item.current_price}</div>
          </div>
          <button onclick="bagItems.push('${item.id}'); wishlistItems.splice(wishlistItems.indexOf('${item.id}'), 1); localStorage.setItem('bagItems', JSON.stringify(bagItems)); localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems)); loadBagItemsObjects(); displayBagPage(); openWishlistModal();" style="background:#ff3f6c; color:white; border:none; padding:6px 10px; font-size:11px; font-weight:600; border-radius:3px; cursor:pointer;">Move to Bag</button>
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

function injectModalStylesInBag() {
  if (document.getElementById("modal-style-block")) return;
  const style = document.createElement("style");
  style.id = "modal-style-block";
  style.innerHTML = `
    .custom-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
    .custom-modal.active { opacity: 1; pointer-events: auto; }
    .modal-content { background: white; padding: 25px; border-radius: 8px; width: 400px; max-width: 90%; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.15); animation: slideDown 0.3s ease; }
    .close-modal { position: absolute; top: 10px; right: 15px; font-size: 28px; cursor: pointer; color: #3e4152; }
    .close-modal:hover { color: #ff3f6c; }
    @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .wishlist-item-count { background-color: #ff3f6c; text-align: center; line-height: 18px; padding: 0 6px; height: 18px; position: relative; border-radius: 50%; font-size: 12px; color: #fff; left: 18px; top: -44px; font-weight: 700; cursor: pointer; }
  `;
  document.head.appendChild(style);
}

function generateItemHTML(item) {
  return `
    <div class="bag-item-container">
      <div class="item-left-part">
        <img class="bag-item-img" src="../${item.image}">
      </div>
      <div class="item-right-part">
        <div class="company" style="font-weight: 700; margin-top:0px;">${item.company}</div>
        <div class="item-name">${item.item_name}</div>
        <div class="price-container" style="margin-top: 5px;">
          <span class="current-price" style="font-weight:700;">Rs ${item.current_price}</span>
          <span class="original-price" style="text-decoration: line-through; color: #7e818c; margin-left:5px;">Rs ${item.original_price}</span>
          <span class="discount-percentage" style="color: #ff905a; margin-left:5px;">(${item.discount_percentage}% OFF)</span>
        </div>
        <div class="return-period" style="font-size:12px; color: #282c3f;">
          <span class="return-period-days" style="font-weight: 700;">${item.return_period || 14} days</span> return available
        </div>
        <div class="delivery-details" style="font-size:12px;">
          Delivery by <span class="delivery-details-days" style="color: #03a685; font-weight:600;">${item.delivery_date || 'Next Week'}</span>
        </div>
      </div>
      <div class="remove-from-cart" onclick="removeFromBag('${item.id}')">×</div>
    </div>`;
}