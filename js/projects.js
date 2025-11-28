/**
 * Projects Loader
 * Dynamically loads and renders projects from JSON data
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    let projectsLoaded = 0;
    const projectsPerLoad = 6;
    let allProjects = [];
    
    /**
     * Create project card HTML element
     * @param {Object} project - Project data object
     * @returns {HTMLElement} - Project card element
     */
    function createProjectCard(project) {
        // Create container element for the card (non-clickable)
        const cardContainer = document.createElement('div');
        cardContainer.className = 'project-card';
        cardContainer.style.cursor = 'default';
        
        // Create project image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'project-image';
        
        const image = document.createElement('img');
        image.src = project.image;
        image.alt = project.title;
        image.loading = 'lazy';
        
        imageContainer.appendChild(image);
        
        // Create project content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'project-content';
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = project.title;
        
        // Create description
        const description = document.createElement('p');
        description.textContent = project.description;
        
        // Create tech stack container
        const techContainer = document.createElement('div');
        techContainer.className = 'project-tech';
        
        // Add tech stack tags
        project.tech.forEach(tech => {
            const techSpan = document.createElement('span');
            techSpan.textContent = tech;
            techContainer.appendChild(techSpan);
        });
        
        // Create project links container
        const linksContainer = document.createElement('div');
        linksContainer.className = 'project-links';
        
        // Add Live Preview button if liveUrl exists and is not empty
        if (project.liveUrl && project.liveUrl.trim() !== '') {
            const liveLink = document.createElement('a');
            liveLink.href = project.liveUrl;
            liveLink.className = 'btn btn-primary btn-small live-btn';
            liveLink.innerHTML = '🔗 Live Preview';
            liveLink.target = '_blank';
            liveLink.rel = 'noopener noreferrer';
            
            // Prevent any event bubbling
            liveLink.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            linksContainer.appendChild(liveLink);
        }
        
        // Add GitHub link
        const githubLink = document.createElement('a');
        githubLink.href = project.githubUrl;
        githubLink.className = 'btn btn-outline btn-small github-btn';
        githubLink.innerHTML = '🐙 GitHub';
        githubLink.target = '_blank';
        githubLink.rel = 'noopener noreferrer';
        
        // Prevent any event bubbling
        githubLink.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        linksContainer.appendChild(githubLink);
        
        // Assemble content container
        contentContainer.appendChild(title);
        contentContainer.appendChild(description);
        contentContainer.appendChild(techContainer);
        contentContainer.appendChild(linksContainer);
        
        // Assemble card using the cardContainer directly
        cardContainer.appendChild(imageContainer);
        cardContainer.appendChild(contentContainer);
        
        return cardContainer;
    }
    
    /**
     * Load projects from JSON and render them
     * @param {number} count - Number of projects to load
     */
    async function loadProjects(count = projectsPerLoad) {
        const projectsGrid = document.getElementById('projects-grid');
        
        if (!projectsGrid) {
            console.error('Projects grid container not found');
            return;
        }
        
        try {
            // If first load, fetch all projects
            if (allProjects.length === 0) {
                // Show loading state
                projectsGrid.innerHTML = '<div class="loading-message">Loading projects...</div>';
                
                const response = await fetch('projects.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                allProjects = data.projects || [];
                
                // Reverse array to show newest projects first
                allProjects.reverse();
                
                // Clear loading message
                projectsGrid.innerHTML = '';
            }
            
            // Calculate slice of projects to load
            const endIndex = Math.min(projectsLoaded + count, allProjects.length);
            const projectsToLoad = allProjects.slice(projectsLoaded, endIndex);
            
            // Render each project
            projectsToLoad.forEach((project, index) => {
                const projectCard = createProjectCard(project);
                
                // Add initial visible state for immediate display
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
                
                projectsGrid.appendChild(projectCard);
                projectsLoaded++;
            });
            
            // Hide load more button if all projects are loaded
            if (projectsLoaded >= allProjects.length) {
                const loadMoreBtn = document.getElementById('load-more-projects');
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = 'none';
                }
            }
            
            console.log(`Loaded ${projectsToLoad.length} projects (${projectsLoaded}/${allProjects.length} total)`);
            
        } catch (error) {
            console.error('Error loading projects:', error);
            
            // Show error message
            projectsGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load projects. Please try again later.</p>
                    <button onclick="window.Projects.load()" class="btn btn-primary">Retry</button>
                </div>
            `;
        }
    }
    
    /**
     * Add error and loading message styles
     */
    function addProjectStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .loading-message,
            .error-message {
                text-align: center;
                padding: 3rem;
                color: var(--text-secondary);
                grid-column: 1 / -1;
            }
            
            .error-message {
                color: var(--error-color);
            }
            
            .error-message p {
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            /* Ensure project cards are visible */
            .project-card {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            /* GitHub button specific styles */
            .github-btn {
                padding: 6px 12px !important;
                font-size: 0.8rem !important;
                margin-top: 12px;
                margin-right: 8px;
            }
            
            /* Live Preview button specific styles */
            .live-btn {
                padding: 6px 12px !important;
                font-size: 0.8rem !important;
                margin-top: 12px;
                margin-right: 8px;
            }
            
            /* Project links container */
            .project-links {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: auto;
                flex-shrink: 0;
            }
            
            /* Ensure project card uses flexbox for proper alignment */
            .project-card {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            
            /* Ensure project content uses flexbox for proper alignment */
            .project-content {
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            
            /* Tech stack container */
            .project-tech {
                margin-bottom: auto;
            }
            
            /* Load more button container */
            .load-more-container {
                text-align: center;
                margin-top: 2rem;
            }
            
            #load-more-projects {
                margin: 0 auto;
            }
        `;
        document.head.appendChild(styles);
    }
    
    /**
     * Initialize projects functionality
     */
    function initProjects() {
        // Add custom styles
        addProjectStyles();
        
        // Load initial projects
        loadProjects();
        
        // Setup load more button
        const loadMoreBtn = document.getElementById('load-more-projects');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                loadProjects();
            });
        }
        
        console.log('Projects system initialized');
    }
    
    // Initialize projects when DOM is ready
    initProjects();
    
    // Expose functions for external use
    window.Projects = {
        load: loadProjects,
        loadMore: () => loadProjects(),
        createCard: createProjectCard,
        reload: () => {
            projectsLoaded = 0;
            allProjects = [];
            document.getElementById('projects-grid').innerHTML = '';
            loadProjects();
        }
    };
});
