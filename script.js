document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = "9c3ed8ee95884dec979460a60f96675b";
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryBtns = document.querySelectorAll('.categoryBtn button');
    const newsContainer = document.getElementById('newsContainer');
    
    let currentSearch = "india";
    
    // Initialize with default search
    getData(currentSearch);
    
    // Search button event
    searchBtn.addEventListener('click', function() {
        currentSearch = searchInput.value || "india";
        getData(currentSearch);
    });
    
    // Enter key in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            currentSearch = searchInput.value || "india";
            getData(currentSearch);
        }
    });
    
    // Category buttons events
    categoryBtns.forEach(button => {
        button.addEventListener('click', function() {
            currentSearch = this.value;
            getData(currentSearch);
        });
    });
    
    // Fetch news data
    async function getData(searchTerm) {
        newsContainer.innerHTML = '<div class="loading">Loading news...</div>';
        
        try {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${API_KEY}`);
            const jsonData = await response.json();
            
            if (jsonData.status === "ok") {
                let articles = jsonData.articles.slice(0, 10);
                displayNews(articles);
            } else {
                newsContainer.innerHTML = '<div class="error">Failed to fetch news. Please try again.</div>';
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            newsContainer.innerHTML = '<div class="error">Failed to fetch news. Please check your connection.</div>';
        }
    }
    
    // Display news cards
    function displayNews(articles) {
        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<div class="error">No news found for your search.</div>';
            return;
        }
        
        const cardContainer = document.createElement('div');
        cardContainer.className = 'cardContainer';
        
        articles.forEach(article => {
            if (!article.urlToImage) return;
            
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <img src="${article.urlToImage}" alt="${article.title}">
                <div class="content">
                    <a class="title" href="${article.url}" target="_blank">${article.title}</a>
                    <p>${article.description || 'No description available.'}</p>
                    <button onclick="window.open('${article.url}', '_blank')">Read More</button>
                </div>
            `;
            
            cardContainer.appendChild(card);
        });
        
        newsContainer.innerHTML = '';
        newsContainer.appendChild(cardContainer);
    }
});