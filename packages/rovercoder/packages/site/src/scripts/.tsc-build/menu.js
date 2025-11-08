"use strict";
var hamburgerElements = document.querySelectorAll('.hamburger');
hamburgerElements.forEach(function (hamburgerElement) {
    hamburgerElement.addEventListener('click', function () {
        var _a;
        (_a = document.querySelectorAll('header .nav-links')) === null || _a === void 0 ? void 0 : _a.forEach(function (x) { return x.classList.toggle('expanded'); });
    });
});
