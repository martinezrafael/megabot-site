(function () {
    var env = window.__ENV__ || {};
    var DEFAULT_PORTAL_ID = env.HUBSPOT_PORTAL_ID || "52340814";

    function resolveFormId(form) {
        var explicit = form.getAttribute("data-form-id");
        if (explicit) return explicit;

        var key = form.getAttribute("data-hubspot-form");
        if (key === "contact") return env.HUBSPOT_FORM_CONTACT_ID || "33eec9a8-8d00-4ec1-ad97-4f0df859ef22";
        return env.HUBSPOT_FORM_HOME_ID || "bc425d5f-8c89-483e-a45b-dd92a9262cd0";
    }

    function getHubspotCookie() {
        var match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
        return match ? match[1] : null;
    }

    document.querySelectorAll("form[data-hubspot-form]").forEach(function (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            var btn = form.querySelector("button[type='submit']");
            var statusEl = form.querySelector(".hs-status");
            var originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = "Enviando...";
            statusEl.className = "hs-status";
            statusEl.textContent = "";

            var fields = [];
            new FormData(form).forEach(function (value, key) {
                if (value && value.toString().trim() !== "") {
                    fields.push({ name: key, value: value.toString().trim() });
                }
            });

            var payload = {
                fields: fields,
                context: {
                    pageUri: window.location.href,
                    pageName: document.title
                }
            };

            var hutk = getHubspotCookie();
            if (hutk) {
                payload.context.hutk = hutk;
            }

            var portalId = form.getAttribute("data-portal-id") || DEFAULT_PORTAL_ID;
            var formId = resolveFormId(form);

            try {
                var res = await fetch(
                    "https://api.hsforms.com/submissions/v3/integration/submit/" + portalId + "/" + formId,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    }
                );

                if (res.ok) {
                    statusEl.className = "hs-status ok";
                    statusEl.textContent = form.getAttribute("data-success-msg") || "Recebemos seus dados! Nossa equipe entrará em contato em breve.";
                    form.reset();
                } else {
                    throw new Error("Erro na API HubSpot: " + res.status);
                }
            } catch (err) {
                statusEl.className = "hs-status err";
                statusEl.textContent = "Não foi possível enviar agora. Verifique as credenciais da HubSpot ou tente novamente.";
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    });
})();
