var hamburgerElements = document.querySelectorAll('.hamburger');
hamburgerElements.forEach(hamburgerElement => {
    hamburgerElement.addEventListener('click', () => {
        document.querySelectorAll('header .nav-links')?.forEach(x => x.classList.toggle('expanded'));
    });
});
