// ========================================
// Header Component (Updated)
// ========================================

export function Header() {
    return `
        <div class="header-content">
            <a href="#home" class="logo">
                <span>🚀</span>
                <span>CareerPath AI</span>
            </a>
            
            <nav class="nav">
                <a href="#home" class="nav-link active" data-nav="home">Home</a>
                <a href="#careers" class="nav-link" data-nav="careers">Career Paths</a>
                <a href="#foundation" class="nav-link" data-nav="foundation">Foundation</a>
                <a href="#projects" class="nav-link" data-nav="projects">Projects</a>
                <a href="#ask" class="nav-link" data-nav="ask">Ask Anything</a>
                <a href="#dashboard" class="nav-link" data-nav="dashboard">My Progress</a>
            </nav>
            
            <div class="header-actions">
                <button class="btn btn-primary btn-sm" onclick="window.location.hash='careers'">
                    Get Started
                </button>
            </div>
        </div>
    `;
}
