document.addEventListener('DOMContentLoaded', function() {
    const searchToggleBtn = document.querySelector('.search-toggle-btn');
    const searchContainer = document.getElementById('searchContainer');
    const searchForm = document.getElementById('searchForm');
    const searchInput = searchForm?.querySelector('.search-input');
    const searchResults = document.getElementById('searchResults');
    const searchClear = document.getElementById('searchClear');
    
    if (!searchToggleBtn || !searchContainer || !searchForm || !searchInput || !searchResults || !searchClear) return;
    
    const products = Object.values(window.products || {});
    
    searchToggleBtn.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && !searchToggleBtn.contains(e.target)) {
            searchContainer.classList.remove('active');
        }
    });

    searchContainer.addEventListener('click', (e) => e.stopPropagation());

    function normalizeArabic(text) {
        return text
            .replace(/[إأآا]/g, 'ا')
            .replace(/ى/g, 'ي')
            .replace(/ة/g, 'ه')
            .toLowerCase();
    }

    function fuzzyMatch(text, query) {
        text = normalizeArabic(text);
        query = normalizeArabic(query);
        
        let pattern = '';
        for (let char of query) {
            pattern += char + '.*';
        }
        
        return new RegExp(pattern).test(text);
    }

    function searchProducts(query) {
        if (!query) return [];
        
        return products
            .map(product => {
                let score = 0;
                
                if (fuzzyMatch(product.title, query)) score += 3;
                if (fuzzyMatch(product.category, query)) score += 2;
                if (fuzzyMatch(product.description, query)) score += 1;
                
                product.features.forEach(feature => {
                    if (fuzzyMatch(feature, query)) score += 1;
                });
                
                return { product, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.product)
            .slice(0, 6);
    }

    function highlightText(text, query) {
        if (!query) return text;
        
        const normalizedText = normalizeArabic(text);
        const normalizedQuery = normalizeArabic(query);
        
        let result = text;
        let startIndex = normalizedText.indexOf(normalizedQuery);
        
        if (startIndex !== -1) {
            const endIndex = startIndex + normalizedQuery.length;
            const prefix = text.slice(0, startIndex);
            const match = text.slice(startIndex, endIndex);
            const suffix = text.slice(endIndex);
            result = `${prefix}<mark>${match}</mark>${suffix}`;
        }
        
        return result;
    }

    function formatPrice(price) {
        return `${price.toLocaleString()} جنيه`;
    }

    function displayResults(results, query) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-results-header" role="status">
                    لا توجد نتائج للبحث
                </div>
            `;
            return;
        }

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
    }

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

    const debouncedSearch = debounce((query) => {
        const results = searchProducts(query);
        displayResults(results, query);
    }, 300);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        searchClear.style.display = query ? 'block' : 'none';
        debouncedSearch(query);
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchResults.innerHTML = '';
        searchInput.focus();
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const results = searchProducts(query);
            displayResults(results, query);
        }
    });
}); 