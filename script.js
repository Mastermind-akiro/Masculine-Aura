document.addEventListener("DOMContentLoaded", () => {
const products = [
{
    id: 1,
    name: "Classic Black Shirt",
    category: "SHIRTS",
    price: 2500,
    description: "A clean premium shirt designed for a sharp, confident look.",
    images: [
        "assets/product-01.jpg.jfif",
        "assets/black-shirt-1.jfif",
        "assets/black-shirt-2.jfif",
        "assets/black-shirt-3.jfif"
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 10
},
{
id: 2,
name: "Premium Casual Shirt",
category: "CASUAL WEAR",
price: 2800,
description: "A versatile casual shirt for a confident, modern look.",
images: ["assets/product-02.jpg.jfif"],
sizes: ["S", "M", "L", "XL"],
stock: 8
},
{
id: 3,
name: "Modern Trousers",
category: "TROUSERS",
price: 3500,
description: "Modern trousers designed for comfort and a clean fit.",
images: ["assets/product-03.jpg.jfif"],
sizes: ["30", "32", "34", "36", "38"],
stock: 6
},
{
    id: 4,
    name: "Premium Shoes",
    category: "SHOES",
    price: 4500,
    images: ["assets/Product-04.jpg.jfif"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 5
}


];


let cart = [];
let selectedSize = "";
let currentProduct = null;

const productContainer = document.querySelector(".products");
const productModal = document.getElementById("productModal");
const closeProduct = document.getElementById("closeProduct");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const addToCartButton = document.getElementById("addToCart");
const sizeOptions = document.getElementById("sizeOptions");

const formatPrice = amount =>
    "KSh " + amount.toLocaleString("en-KE");

function renderProducts() {
    if (!productContainer) return;

    productContainer.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.tabIndex = 0;

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.images[0]}"
                     alt="${product.name}"
                     loading="lazy">
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button type="button" class="view-product">
                    VIEW PRODUCT
                </button>
            </div>
        `;

        card.addEventListener("click", () => openProduct(product));

        card.addEventListener("keydown", event => {
            if (event.key === "Enter") openProduct(product);
        });

        productContainer.appendChild(card);
    });
}

function openProduct(product) {
    if (!productModal) return;

    closeCartPanel();
    currentProduct = product;
    selectedSize = "";

    const image = document.getElementById("mainProductImage");
    const category = document.getElementById("modalCategory");
    const name = document.getElementById("modalName");
    const price = document.getElementById("modalPrice");
    const description = document.getElementById("modalDescription");
    const stock = document.getElementById("modalStock");
    const whatsapp = document.getElementById("modalWhatsapp");

    if (image) {
        image.src = product.images[0];
        image.alt = product.name;
    }

    if (category) category.textContent = product.category;
    if (name) name.textContent = product.name;
    if (price) price.textContent = formatPrice(product.price);
    if (description) description.textContent = product.description;
    if (stock) stock.textContent = `Available: ${product.stock}`;

    if (sizeOptions) {
        sizeOptions.innerHTML = "";

        product.sizes.forEach(size => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "size-option";
            button.textContent = size;
            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", () => {
                selectedSize = size;

                sizeOptions.querySelectorAll("button").forEach(option => {
                    option.classList.remove("selected");
                    option.setAttribute("aria-pressed", "false");
                });

                button.classList.add("selected");
                button.setAttribute("aria-pressed", "true");
            });

            sizeOptions.appendChild(button);
        });
    }

    const thumbnails = document.getElementById("productThumbnails");
    if (thumbnails) {
        thumbnails.innerHTML = "";

        product.images.forEach(src => {
            const thumb = document.createElement("button");
            thumb.type = "button";
            thumb.className = "product-thumbnail";
            thumb.innerHTML = `<img src="${src}" alt="${product.name}">`;

            thumb.addEventListener("click", () => {
                if (image) image.src = src;
            });

            thumbnails.appendChild(thumb);
        });
    }

    if (whatsapp) {
        whatsapp.onclick = () => {
            const message = `Hello Masculine AURA, I'm interested in ${product.name}, size ${selectedSize || "not selected"}, priced at ${formatPrice(product.price)}.`;
            window.open(
                `https://wa.me/254797361481?text=${encodeURIComponent(message)}`,
                "_blank"
            );
        };
    }

    productModal.classList.add("active");
    productModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (!productModal) return;

    productModal.classList.remove("active");
    productModal.setAttribute("aria-hidden", "true");

    if (!cartPanel?.classList.contains("active")) {
        document.body.style.overflow = "";
    }
}

function openCart() {
    if (!cartPanel || !cartOverlay) return;

    closeModal();

    // Enable interaction with the cart panel.
    cartPanel.inert = false;
    cartPanel.removeAttribute("inert");
    cartPanel.setAttribute("aria-hidden", "false");
    cartOverlay.setAttribute("aria-hidden", "false");

    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    updateCart();
}

function closeCartPanel() {
    if (!cartPanel || !cartOverlay) return;

    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");

    cartPanel.setAttribute("aria-hidden", "true");
    cartOverlay.setAttribute("aria-hidden", "true");

    // Disable interaction only after the panel is closed.
    cartPanel.inert = true;

    if (!productModal?.classList.contains("active")) {
        document.body.style.overflow = "";
    }
}

function updateCart() {
    if (!cartItems || !cartCount || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;
    let quantityCount = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is currently empty.</p>
                <p>Explore our collection and find your style.</p>
            </div>
        `;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        quantityCount += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img class="cart-item-image"
                 src="${item.image}"
                 alt="${item.name}">

            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
                <p>${formatPrice(item.price)}</p>

                <div class="cart-quantity">
                    <button type="button"
                            class="minus"
                            aria-label="Decrease quantity">−</button>

                    <span class="quantity">${item.quantity}</span>

                    <button type="button"
                            class="plus"
                            aria-label="Increase quantity">+</button>
                </div>

                <button type="button" class="remove-item">
                    Remove
                </button>
            </div>
        `;

        cartItem.querySelector(".minus").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }

            updateCart();
        });

        cartItem.querySelector(".plus").addEventListener("click", () => {
            const product = products.find(p => p.id === item.id);
            const quantityInCart = cart
                .filter(cartProduct => cartProduct.id === item.id)
                .reduce((sum, cartProduct) => sum + cartProduct.quantity, 0);

            if (product && quantityInCart < product.stock) {
                item.quantity++;
                updateCart();
            } else {
                alert("Sorry, no more stock is available for this product.");
            }
        });

        cartItem.querySelector(".remove-item").addEventListener("click", () => {
            cart.splice(index, 1);
            updateCart();
        });

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = quantityCount;
    cartTotal.textContent = formatPrice(total);
}

if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
        if (!currentProduct) return;

        if (!selectedSize) {
            alert("Please select a size before adding this product to your cart.");
            return;
        }

        const existingItem = cart.find(item =>
            item.id === currentProduct.id && item.size === selectedSize
        );

        const quantityInCart = cart
            .filter(item => item.id === currentProduct.id)
            .reduce((sum, item) => sum + item.quantity, 0);

        if (existingItem) {
            if (quantityInCart >= currentProduct.stock) {
                alert("Sorry, no more stock is available.");
                return;
            }

            existingItem.quantity++;
        } else {
            if (quantityInCart >= currentProduct.stock) {
                alert("Sorry, no more stock is available.");
                return;
            }

            cart.push({
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                size: selectedSize,
                image: currentProduct.images[0],
                quantity: 1
            });
        }

        updateCart();
        closeModal();
        openCart();
    });
}

if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (closeCart) {
    closeCart.addEventListener("click", closeCartPanel);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCartPanel);
}

if (closeProduct) {
    closeProduct.addEventListener("click", closeModal);
}

if (productModal) {
    productModal.addEventListener("click", event => {
        if (event.target === productModal) closeModal();
    });
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Add a product before checking out.");
            return;
        }

        const orderLines = cart.map(item =>
            `${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ${formatPrice(item.price * item.quantity)}`
        );

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const message = [
            "Hello Masculine AURA, I would like to place an order:",
            "",
            ...orderLines,
            "",
            `Total: ${formatPrice(total)}`,
            "",
            "Please confirm availability and delivery details."
        ].join("\n");

        window.open(
            `https://wa.me/254797361481?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
        closeCartPanel();
    }
});

const menuButton = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("active");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}

renderProducts();
updateCart();


});

