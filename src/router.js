// ========================================
// Simple Hash-based Router
// ========================================

export class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.currentRoute = hash;

        const handler = this.routes[hash];
        if (handler) {
            handler();
        } else {
            // Default to home
            this.routes['home']?.();
        }
    }

    navigate(path) {
        window.location.hash = path;
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}
