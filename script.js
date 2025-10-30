document.addEventListener('DOMContentLoaded', function () {
    // 🔑 Replace with your own GNews API key from https://gnews.io
    const API_KEY = "45a658bbb6d7b6c1f06fc9aa62586477";

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryBtns = document.querySelectorAll('.categoryBtn button');
    const newsContainer = document.getElementById('newsContainer');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const icon = hamburgerMenu.querySelector('i');

    let currentSearch = "india";

    initializeApp();

    function initializeApp() {
        getData(currentSearch);
        setupEventListeners();
    }

    function setupEventListeners() {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleSearch();
        });

        categoryBtns.forEach(button => {
            button.addEventListener('click', function () {
                currentSearch = this.value;
                getData(currentSearch);
            });
        });

        // 🍔 Hamburger toggle
        hamburgerMenu.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');

            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function (e) {
            if (!hamburgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    function handleSearch() {
        currentSearch = searchInput.value.trim() || "india";
        getData(currentSearch);
    }

    // 📰 Fetch news (using GNews API)
    async function getData(searchTerm) {
        showLoadingState();

        try {
            const response = await fetch(
                `https://api.allorigins.win/raw?url=${encodeURIComponent(
                    `https://gnews.io/api/v4/search?q=${searchTerm}&lang=en&country=in&max=12&apikey=${API_KEY}`
                )}`
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const jsonData = await response.json();

            if (jsonData.articles && jsonData.articles.length > 0) {
                displayNews(jsonData.articles);
            } else {
                showErrorState('No news found for your search.');
            }

        } catch (error) {
            console.error("Error fetching news:", error);
            showErrorState('Failed to fetch news. Please check your connection.');
        }
    }

    function showLoadingState() {
        newsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading news...</div>';
    }

    function showErrorState(message) {
        newsContainer.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
    }

    function displayNews(articles) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'cardContainer';

        articles.forEach(article => {
            const card = createNewsCard(article);
            cardContainer.appendChild(card);
        });

        newsContainer.innerHTML = '';
        newsContainer.appendChild(cardContainer);
    }

    function createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'card';

        const description = article.description
            ? (article.description.length > 120
                ? article.description.substring(0, 120) + '...'
                : article.description)
            : 'No description available.';

        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/320x180/cccccc/666666?text=No+Image+Available'}" 
                 alt="${article.title}">
            <div class="content">
                <a class="title" href="${article.url}" target="_blank">${article.title}</a>
                <p>${description}</p>
                <button onclick="window.open('${article.url}', '_blank')">Read More</button>
            </div>
        `;
        return card;
    }
});
