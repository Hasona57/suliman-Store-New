// Toggle search functionality
function toggleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
        searchContainer.querySelector('.search-input').focus();
    }
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Search functionality initialized');
    
    // Initialize search toggle
    const searchToggleBtn = document.querySelector('.search-toggle-btn');
    const searchContainer = document.getElementById('searchContainer');
    
    searchToggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchContainer.querySelector('.search-input').focus();
        }
    });
    
    // Wait for products.js to load
    setTimeout(() => {
        initializeSearch();
    }, 100);
});

function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = searchForm.querySelector('.search-input');
    const searchResults = document.getElementById('searchResults');
    const searchClear = document.getElementById('searchClear');
    const searchLoading = searchResults.querySelector('.search-loading');
    
    // Get products from the global products object
    const products = window.products || {};
    console.log('Available products:', Object.keys(products).length);

    // Normalize Arabic text for better matching
    function normalizeArabic(text) {
        return text
            .replace(/[يى]/g, 'ي')
            .replace(/[ةه]/g, 'ه')
            .replace(/[أإآا]/g, 'ا')
            .replace(/[ؤو]/g, 'و')
            .replace(/[ئى]/g, 'ي')
            .toLowerCase()
            .trim();
    }

    // Fuzzy search implementation
    function fuzzyMatch(text, query) {
        text = normalizeArabic(text);
        query = normalizeArabic(query);
        
        const pattern = query.split('').map(char => 
            char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        ).join('.*');
        const regex = new RegExp(pattern, 'i');
        return regex.test(text);
    }

    function getFuzzyScore(text, query) {
        if (!query) return 0;
        text = normalizeArabic(text);
        query = normalizeArabic(query);
        
        if (text === query) return 1;
        if (text.startsWith(query)) return 0.9;
        if (text.includes(query)) return 0.7;
        if (fuzzyMatch(text, query)) return 0.5;
        return 0;
    }

    function getRelevanceScore(product, query) {
        if (!query) return 0;
        const queryWords = normalizeArabic(query).split(' ').map(word => word.trim()).filter(Boolean);
        let score = 0;

        queryWords.forEach(word => {
            // Title match (highest priority)
            score += getFuzzyScore(product.title, word) * 10;
            
            // Category match
            score += getFuzzyScore(product.category, word) * 8;
            
            // Description match
            score += getFuzzyScore(product.description, word) * 6;
            
            // Features match
            const featureScore = product.features.reduce((acc, feature) => 
                acc + getFuzzyScore(feature, word), 0);
            score += featureScore * 4;
        });

        return score / queryWords.length;
    }

    function highlightText(text, query) {
        if (!query) return text;
        query = normalizeArabic(query);
        const words = query.split(' ').map(word => word.trim()).filter(Boolean);
        let highlightedText = text;
        words.forEach(word => {
            const pattern = `(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`;
            const regex = new RegExp(pattern, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        return highlightedText;
    }

    function formatPrice(price) {
        return `${price} جنيه`;
    }

    async function performSearch(query) {
        console.log('Performing search for:', query);
        query = query.trim();
        
        // Toggle clear button visibility
        searchClear.classList.toggle('visible', query.length > 0);
        
        if (query.length < 1) {
            searchResults.classList.remove('active');
            return;
        }

        try {
            // Show loading state
            searchResults.classList.add('active');
            searchLoading.classList.add('active');

            // Get search results
            const results = Object.values(products)
                .map(product => ({
                    ...product,
                    relevance: getRelevanceScore(product, query)
                }))
                .filter(product => product.relevance > 0)
                .sort((a, b) => b.relevance - a.relevance)
                .slice(0, 6); // Limit to 6 results

            console.log('Search results:', results.length);

            searchLoading.classList.remove('active');

            if (results.length > 0) {
                const resultsHTML = results.map((product, index) => `
                    <a href="product.html?id=${product.id}" 
                       class="search-result-item"
                       role="option"
                       aria-selected="false"
                       tabindex="-1"
                       data-index="${index}">
                        <img src="${product.images[0]}" 
                             alt="${product.title}" 
                             class="search-result-image"
                             loading="lazy"
                             onerror="this.src='images/products/classic/classic-1.jpg'">
                        <div class="search-result-info">
                            <div class="search-result-title">${highlightText(product.title, query)}</div>
                            <div class="search-result-category">${highlightText(product.category, query)}</div>
                            <div class="search-result-price">${formatPrice(product.price)}</div>
                            <div class="search-result-features">
                                ${product.features.slice(0, 2).map(feature => 
                                    `<span class="search-result-feature">${highlightText(feature, query)}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </a>
                `).join('');
                
                searchResults.innerHTML = `
                    <div class="search-results-header" role="status">
                        نتائج البحث (${results.length})
                    </div>
                    <div class="search-results-list" role="listbox">
                        ${resultsHTML}
                    </div>
                `;
            } else {
                searchResults.innerHTML = `
                    <div class="search-results-header" role="status">نتائج البحث</div>
                    <div class="search-no-results">
                        <i class="fas fa-search" aria-hidden="true"></i>
                        <p>لم يتم العثور على نتائج لـ "${query}"</p>
                    </div>
                `;
            }

        } catch (error) {
            console.error('Search error:', error);
            searchLoading.classList.remove('active');
            searchResults.innerHTML = `
                <div class="search-error">
                    <p>عذراً، حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.</p>
                </div>
            `;
        }
    }

    // Event Listeners
    const debouncedSearch = debounce((value) => {
        console.log('Debounced search for:', value);
        performSearch(value);
    }, 300);

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted with value:', searchInput.value);
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('input', (e) => {
        console.log('Input changed:', e.target.value);
        debouncedSearch(e.target.value);
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        searchResults.classList.remove('active');
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// Helper function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 