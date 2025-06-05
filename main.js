// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQ-MS0oFBVRQHwfTqkxD907SG_MCYYMDA",
    authDomain: "warehouse-management-3731e.firebaseapp.com",
    projectId: "warehouse-management-3731e",
    storageBucket: "warehouse-management-3731e.firebasestorage.app",
    messagingSenderId: "769694856376",
    appId: "1:769694856376:web:c59c05318471ba3964b04d",
    measurementId: "G-X6QFQQZQ44"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // DOM Elements
  const searchInput = document.getElementById('searchInput');
  
  // Add item to Firebase
  function addItem() {
    const name = document.getElementById('itemName').value.trim();
    const qty = document.getElementById('itemQty').value.trim();
    const category = document.getElementById('itemCategory').value.trim();
  
    if (name && qty && category) {
      const itemRef = db.ref('inventory').push();
      itemRef.set({
        name: name,
        quantity: parseInt(qty),
        category: category,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      });
  
      // Clear inputs
      document.getElementById('itemName').value = '';
      document.getElementById('itemQty').value = '';
      document.getElementById('itemCategory').value = '';
      
      // Show success animation
      const btn = document.querySelector('.btn-primary');
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-save"></i> Add Item';
      }, 2000);
    } else {
      alert("Please fill in all fields.");
    }
  }
  
  // Load items from Firebase with search functionality
  function loadItems(searchTerm = '') {
    db.ref('inventory').on('value', snapshot => {
      const tbody = document.getElementById('tableBody');
      tbody.innerHTML = '';
  
      snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val();
        const itemId = childSnapshot.key;
        
        // Filter items based on search term
        if (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          const row = `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.category}</td>
              <td>
                <button class="action-btn" onclick="editItem('${itemId}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteItem('${itemId}')">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>`;
          tbody.innerHTML += row;
        }
      });
    });
  }
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    loadItems(e.target.value);
  });
  
  // Delete item
  function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
      db.ref(`inventory/${itemId}`).remove();
    }
  }
  
  // Edit item (placeholder - you can implement this)
  function editItem(itemId) {
    alert('Edit functionality coming soon!');
    // You would implement a modal or form to edit the item here
  }
  
  // Initial load
  loadItems();