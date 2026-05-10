document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.fa-bars'); 
    const sidebar = document.querySelector('.sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', (e) => {
            sidebar.classList.toggle('mobile-open');
            e.stopPropagation();
        });

        // Chiudi se clicchi ovunque nel resto della pagina
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }
});