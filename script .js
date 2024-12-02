let searchInput = document.getElementById("search");
let button = document.getElementById("button");
let cardBox = document.getElementById("card-box");
let products = [];
let loadingIndicator = document.createElement("div");
loadingIndicator.textContent = "Loading...";
loadingIndicator.style.display = "none";
loadingIndicator.style.textAlign = "center";
loadingIndicator.style.fontSize = "24px";
cardBox.appendChild(loadingIndicator);

async function fetchProducts() {
    loadingIndicator.style.display = "block"; // Show loading indicator while fetching
    try {
        let response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        products = await response.json(); // Store fetched data in products array
        renderProducts(products); // Render products once data is fetched
        loadingIndicator.style.display = "none"; // Hide loading indicator after fetching
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        cardBox.innerHTML = "<p style='text-align: center; color: red;'>Failed to load products. Please try again later.</p>";
        loadingIndicator.style.display = "none"; // Hide loading indicator if there's an error
    }
}

function renderProducts(productsToRender) {
    cardBox.innerHTML = ""; // Clear previous cards and loading indicator
    if (productsToRender.length === 0) {
        cardBox.innerHTML = "<p style='text-align: center;'>No products found.</p>";
    } else {
        productsToRender.forEach(product => {
            let card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <h3>${product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title}</h3>
            <img src="${product.image}" alt="${product.title}">
            <p>Price: $${product.price}</p>
        `;
        
            cardBox.appendChild(card);
        });
    }
}

function filterProducts(query) {
    return products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
}

searchInput.addEventListener("input", () => {
    let query = searchInput.value.toLowerCase();
    let filteredProducts = filterProducts(query);
    renderProducts(filteredProducts);
});

button.addEventListener("click", () => {
    let query = searchInput.value.toLowerCase();
    let filteredProducts = filterProducts(query);
    renderProducts(filteredProducts);
});

document.querySelectorAll('#category-list li').forEach(categoryItem => {
    categoryItem.addEventListener('click', () => {
        let category = categoryItem.getAttribute('data-category');
        let filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category.toLowerCase() === category);
        renderProducts(filteredProducts);
    });
});

// Fetch and display products on page load
fetchProducts();
 