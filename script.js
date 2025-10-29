document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = "9c3ed8ee95884dec979460a60f96675b";

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
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSearch();
        });

        categoryBtns.forEach(button => {
            button.addEventListener('click', function() {
                currentSearch = this.value;
                getData(currentSearch);
            });
        });

        // Hamburger toggle
        hamburgerMenu.addEventListener('click', function(e) {
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
        document.addEventListener('click', function(e) {
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

    // Fetch news
    async function getData(searchTerm) {
        showLoadingState();

        try {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${API_KEY}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const jsonData = await response.json();
            if (jsonData.status === "ok") {
                const articles = jsonData.articles.slice(0, 12);
                displayNews(articles);
            } else {
                showErrorState('Failed to fetch news. Please try again.');
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
        if (!articles || articles.length === 0) {
            showErrorState('No news found for your search.');
            return;
        }

        const validArticles = articles.filter(article => article.urlToImage && article.title && article.url);

        if (validArticles.length === 0) {
            showErrorState('No valid news articles found.');
            return;
        }

        const cardContainer = document.createElement('div');
        cardContainer.className = 'cardContainer';

        validArticles.forEach(article => {
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
            <img src="${article.urlToImage}" alt="${article.title}" 
                 onerror="this.src='https://via.placeholder.com/320x180/cccccc/666666?text=No+Image+Available'">
            <div class="content">
                <a class="title" href="${article.url}" target="_blank">${article.title}</a>
                <p>${description}</p>
                <button onclick="window.open('${article.url}', '_blank')">Read More</button>
            </div>
        `;
        return card;
    }
});
