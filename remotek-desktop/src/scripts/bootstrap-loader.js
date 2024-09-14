window.onload = function() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    link.integrity = "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    var scriptJQuery = document.createElement("script");
    scriptJQuery.src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
    document.body.appendChild(scriptJQuery);

    var scriptBootstrap = document.createElement("script");
    scriptBootstrap.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    scriptBootstrap.integrity = "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz";
    document.body.appendChild(scriptBootstrap);
};
