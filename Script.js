// ========== CART FUNCTIONS ==========

function getCart() {
    var cart = localStorage.getItem("ziksCart");
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem("ziksCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + cart[i].quantity;
    }
    var span = document.getElementById("cartCount");
    if (span) span.innerHTML = total;
}

function removeFromCart(id) {
    var cart = getCart();
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== id) {
            newCart.push(cart[i]);
        }
    }
    saveCart(newCart);
    renderCart();
}

function updateQuantity(id, newQty) {
    if (newQty < 1) {
        removeFromCart(id);
        return;
    }
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = parseInt(newQty);
            break;
        }
    }
    saveCart(cart);
    renderCart();
}

function calculateTotals() {
    var cart = getCart();
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
        subtotal = subtotal + (cart[i].price * cart[i].quantity);
    }
    var tax = subtotal * 0.075;
    var total = subtotal + tax;
    return { subtotal: subtotal, tax: tax, total: total };
}

function clearCart() {
    if (confirm("Remove all items?")) {
        localStorage.removeItem("ziksCart");
        updateCartCount();
        renderCart();
    }
}

function renderCart() {
    var container = document.getElementById("cartContainer");
    if (!container) return;
    
    var cart = getCart();
    var totals = calculateTotals();
    
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 3rem;"><p>Your cart is empty.</p><a href="products.html" class="btn">Start Shopping</a></div>';
        return;
    }
    
    var html = '<table style="width:100%; border-collapse: collapse;"><thead><tr style="background:#D4AF37;"><th>Product</th><th>Price (JMD)</th><th>Quantity</th><th>Subtotal (JMD)</th><th></th> </tr></thead><tbody>';
    
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var subtotal = item.price * item.quantity;
        html += '<tr style="border-bottom:1px solid #eee;">';
        html += '<td style="padding:12px;"><img src="' + item.image + '" width="50" style="border-radius:8px;"> ' + item.name + '</td>';
        html += '<td style="padding:12px;">J$' + item.price + '</td>';
        html += '<td style="padding:12px;"><input type="number" min="1" value="' + item.quantity + '" onchange="updateQuantity(' + item.id + ', this.value)" style="width:60px;"></td>';
        html += '<td style="padding:12px;">J$' + subtotal + '</td>';
        html += '<td style="padding:12px;"><button onclick="removeFromCart(' + item.id + ')" style="background:none; border:none; color:red;">Remove</button></td>';
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    html += '<div style="background:#f9f9f9; padding:20px; border-radius:12px; margin-top:20px; text-align:right;">';
    html += '<h3>Order Summary</h3>';
    html += '<p>Subtotal: J$' + totals.subtotal.toFixed(2) + '</p>';
    html += '<p>Tax (7.5%): J$' + totals.tax.toFixed(2) + '</p>';
    html += '<p><strong>Total: J$' + totals.total.toFixed(2) + '</strong></p>';
    html += '</div>';
    html += '<div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">';
    html += '<button onclick="clearCart()" class="btn">Clear All</button>';
    html += '<button onclick="window.location.href=\'checkout.html\'" class="btn">Checkout</button>';
    html += '</div>';
    
    container.innerHTML = html;
}