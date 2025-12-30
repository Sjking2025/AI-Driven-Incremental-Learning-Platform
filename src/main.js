// ========================================
// AI Career Path Builder - Main Application
// ========================================

import { Router } from './router.js';
import { Header } from './components/layout/Header.js';
import { Footer } from './components/layout/Footer.js';
import { renderHome } from './pages/Home.js';
import { renderCareerSelection } from './pages/CareerSelection.js';
import { renderRoadmap } from './pages/Roadmap.js';
import { renderConcept } from './pages/Concept.js';
import { renderDashboard } from './pages/Dashboard.js';
import { renderFoundation } from './pages/Foundation.js';
import { renderProjects } from './pages/Projects.js';
import { renderAskAnything, questionsData } from './pages/AskAnything.js';
import { renderProjectWorkspace } from './pages/ProjectWorkspace.js';

// Initialize application
class App {
    constructor() {
        this.router = new Router();
        this.currentPage = 'home';
        this.selectedCareer = null;
        this.userProgress = this.loadProgress();

        this.init();
    }

    init() {
        // Render layout
        this.renderHeader();
        this.renderFooter();

        // Setup routes
        this.setupRoutes();

        // Handle initial route
        this.router.handleRoute();

        console.log('🚀 CareerPath AI initialized');
    }

    renderHeader() {
        const headerEl = document.getElementById('header');
        if (headerEl) {
            headerEl.innerHTML = Header();
            this.setupNavigation();
        }
    }

    renderFooter() {
        const footerEl = document.getElementById('footer');
        if (footerEl) {
            footerEl.innerHTML = Footer();
        }
    }

    setupNavigation() {
        document.querySelectorAll('[data-nav]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-nav');
                this.router.navigate(route);
            });
        });
    }

    setupRoutes() {
        this.router.addRoute('', () => this.renderPage('home'));
        this.router.addRoute('home', () => this.renderPage('home'));
        this.router.addRoute('careers', () => this.renderPage('careers'));
        this.router.addRoute('roadmap', () => this.renderPage('roadmap'));
        this.router.addRoute('concept', () => this.renderPage('concept'));
        this.router.addRoute('dashboard', () => this.renderPage('dashboard'));
        this.router.addRoute('foundation', () => this.renderPage('foundation'));
        this.router.addRoute('projects', () => this.renderPage('projects'));
        this.router.addRoute('ask', () => this.renderPage('ask'));
        this.router.addRoute('workspace', () => this.renderPage('workspace'));
    }

    renderPage(page) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // Add page transition
        mainContent.classList.add('page-exit');

        setTimeout(() => {
            this.currentPage = page;
            this.updateActiveNav();

            switch (page) {
                case 'home':
                    mainContent.innerHTML = renderHome();
                    this.setupHomeActions();
                    break;
                case 'careers':
                    mainContent.innerHTML = renderCareerSelection();
                    this.setupCareerActions();
                    break;
                case 'roadmap':
                    mainContent.innerHTML = renderRoadmap(this.selectedCareer, this.userProgress);
                    this.setupRoadmapActions();
                    break;
                case 'concept':
                    mainContent.innerHTML = renderConcept();
                    this.setupConceptActions();
                    break;
                case 'dashboard':
                    mainContent.innerHTML = renderDashboard(this.userProgress);
                    break;
                case 'foundation':
                    mainContent.innerHTML = renderFoundation(this.selectedCareer);
                    this.setupFoundationActions();
                    break;
                case 'projects':
                    mainContent.innerHTML = renderProjects();
                    this.setupProjectActions();
                    break;
                case 'ask':
                    mainContent.innerHTML = renderAskAnything();
                    this.setupAskActions();
                    break;
                case 'workspace':
                    mainContent.innerHTML = renderProjectWorkspace();
                    break;
                default:
                    mainContent.innerHTML = renderHome();
            }

            mainContent.classList.remove('page-exit');
            mainContent.classList.add('page-enter-active');

            setTimeout(() => {
                mainContent.classList.remove('page-enter-active');
            }, 300);
        }, 200);
    }

    updateActiveNav() {
        document.querySelectorAll('[data-nav]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-nav') === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    setupHomeActions() {
        const ctaBtn = document.getElementById('start-journey-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                this.router.navigate('careers');
            });
        }
    }

    setupCareerActions() {
        document.querySelectorAll('.career-card').forEach(card => {
            card.addEventListener('click', () => {
                const careerId = card.getAttribute('data-career');
                this.selectedCareer = careerId;
                this.saveProgress();
                this.router.navigate('roadmap');
            });
        });
    }

    setupRoadmapActions() {
        document.querySelectorAll('.roadmap-phase').forEach(phase => {
            phase.addEventListener('click', () => {
                this.router.navigate('concept');
            });
        });
    }

    setupConceptActions() {
        document.querySelectorAll('.step-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const step = item.getAttribute('data-step');
                this.showStep(step);
            });
        });

        // Mark complete button
        const completeBtn = document.getElementById('mark-complete-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                this.markConceptComplete();
            });
        }
    }

    setupFoundationActions() {
        document.querySelectorAll('.foundation-module').forEach(module => {
            module.addEventListener('click', () => {
                const moduleId = module.getAttribute('data-module');
                this.showNotification(`Starting ${moduleId} module...`);
                // Future: navigate to detailed module view
            });
        });
    }

    setupProjectActions() {
        document.querySelectorAll('.project-card').forEach(card => {
            const btn = card.querySelector('.btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectId = card.getAttribute('data-project');
                    this.showNotification(`Starting project: ${projectId}...`);
                    // Future: navigate to project workspace
                });
            }
        });
    }

    setupAskActions() {
        // Question card clicks
        document.querySelectorAll('.question-card').forEach(card => {
            card.addEventListener('click', () => {
                const questionId = card.getAttribute('data-question');
                this.showAnswerModal(questionId);
            });
        });

        // Close modal
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('answer-modal').style.display = 'none';
            });
        }

        // Search input
        const searchInput = document.getElementById('ask-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterQuestions(e.target.value);
            });
        }
    }

    showAnswerModal(questionId) {
        const modal = document.getElementById('answer-modal');
        const content = document.getElementById('answer-content');

        // Find question data
        let question = null;
        for (const category of questionsData) {
            const found = category.questions.find(q => q.id === questionId);
            if (found) {
                question = found;
                break;
            }
        }

        if (question) {
            content.innerHTML = `
                <h2>${question.question}</h2>
                <div class="answer-detailed">${question.answer.detailed}</div>
                <div class="industry-context">
                    <strong>🏢 Industry Context:</strong> ${question.answer.industryContext}
                </div>
            `;
            modal.style.display = 'flex';
        }
    }

    filterQuestions(query) {
        const cards = document.querySelectorAll('.question-card');
        const lowerQuery = query.toLowerCase();

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(lowerQuery) ? 'block' : 'none';
        });
    }

    showStep(step) {
        // Update active nav
        document.querySelectorAll('.step-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-step') === step) {
                item.classList.add('active');
            }
        });

        // Show corresponding content
        document.querySelectorAll('.step-content').forEach(content => {
            content.style.display = 'none';
            if (content.getAttribute('data-step') === step) {
                content.style.display = 'block';
            }
        });
    }

    markConceptComplete() {
        if (!this.userProgress.completedConcepts) {
            this.userProgress.completedConcepts = [];
        }
        this.userProgress.completedConcepts.push('increment-operators');
        this.saveProgress();

        // Show completion notification
        this.showNotification('Concept completed! 🎉');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-pop';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: var(--accent-success);
            color: white;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    loadProgress() {
        const saved = localStorage.getItem('careerPathProgress');
        return saved ? JSON.parse(saved) : {
            selectedCareer: null,
            completedConcepts: [],
            currentPhase: 1,
            streak: 0
        };
    }

    saveProgress() {
        this.userProgress.selectedCareer = this.selectedCareer;
        localStorage.setItem('careerPathProgress', JSON.stringify(this.userProgress));
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
