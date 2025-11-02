document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelectorAll('header .nav-links')?.forEach(x => x.classList.toggle('expanded'));
});
