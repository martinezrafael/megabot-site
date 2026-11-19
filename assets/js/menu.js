(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var bar = document.querySelector("header .bar");
        var nav = document.querySelector("header nav.menu");
        if (!bar || !nav) return;

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "menu-toggle";
        btn.setAttribute("aria-label", "Abrir menu");
        btn.setAttribute("aria-expanded", "false");
        btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

        bar.insertBefore(btn, nav);

        btn.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            btn.setAttribute("aria-expanded", open ? "true" : "false");
            btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("is-open");
                btn.setAttribute("aria-expanded", "false");
            });
        });
    });
})();
