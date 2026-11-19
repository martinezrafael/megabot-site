(function () {
    var env = window.__ENV__ || {};
    var gtmId = (env.GTM_CONTAINER_ID || "").trim();
    var gaId = (env.GA_MEASUREMENT_ID || "").trim();

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    if (gtmId && gtmId !== "GTM-XXXXXXXX") {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(i) + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", gtmId);
    }

    if (gaId && gaId !== "G-XXXXXXXXXX") {
        var script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
        document.head.appendChild(script);
        gtag("js", new Date());
        gtag("config", gaId);
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("form[data-hubspot-form]").forEach(function (form) {
            form.addEventListener("submit", function () {
                var formType = form.getAttribute("data-hubspot-form") || "form";
                window.dataLayer.push({
                    event: formType === "contact" ? "contact_submit" : "generate_lead",
                    event_category: "hubspot_form",
                    event_label: formType
                });
            });
        });
    });
})();
