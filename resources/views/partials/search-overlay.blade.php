<div id="search-overlay" class="search-overlay">
    <div class="search-overlay-content">
        <div class="search-overlay-header">
            <h2>Search</h2>
            <button type="button" id="search-close" class="search-close">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
        <div class="search-overlay-form">
            <div class="search-input-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input type="text" 
                    id="dynamic-search-input" 
                    placeholder="Type to search..." 
                    autocomplete="off"
                    class="search-input-large">
            </div>
        </div>
        <div id="search-results" class="search-results-container">
            <!-- Dynamic results will appear here -->
            <div class="search-initial-state">
                <p>Start typing to see results...</p>
            </div>
        </div>
    </div>
</div>
