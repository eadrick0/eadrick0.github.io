document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector('main');
    const projectItems = Array.from(projectsContainer.querySelectorAll('.project'));
    const paginationContainer = document.getElementById('pagination-controls');
    const itemsPerPage = 3;
    const totalProjects = projectItems.length;
    const totalPages = Math.ceil(totalProjects / itemsPerPage);
    let currentPage = 1;

    function displayPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        projectItems.forEach(item => item.style.display = 'none');

        const projectsToShow = projectItems.slice(startIndex, endIndex);
        projectsToShow.forEach(item => item.style.display = 'block');

        setupPaginationControls();
    }

    function setupPaginationControls() {
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.innerText = 'Önceki';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                displayPage(currentPage - 1);
            }
        });
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
                pageButton.disabled = true;
            }
            pageButton.addEventListener('click', () => {
                displayPage(i);
            });
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.innerText = 'Sonraki';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                displayPage(currentPage + 1);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    if (totalProjects > 0) {
        displayPage(1);
    } else {
        paginationContainer.style.display = 'none';
    }
});
