// reusable UI functions

function setupSlider(selector, options) {
    var parent = document.querySelector(selector);
    if (!parent) {
        return;
    }
    if (!options.name) {
        options.name = selector.substring(1);
    }
    return createSlider(parent, options);
}

function createSlider(parent, options) {
    const gopt = getQueryParams();

    var precision = options.precision || 0;
    var min = options.min || 0;
    var step = options.step || 1;
    var value = options.value || 0;
    var max = options.max || 1;
    var fn = options.slide;
    var name = gopt["ui-" + options.name] || options.name;
    var uiPrecision = options.uiPrecision === undefined ? precision : options.uiPrecision;
    var uiMult = options.uiMult || 1;

    min /= step;
    max /= step;
    value /= step;

    parent.innerHTML = ""
    parent.innerHTML += "<div class='gman-widget-outer'>\n"
    parent.innerHTML += "   <div class='gman-widget-label'>"+name.toString()+"</div>\n";
    parent.innerHTML += "   <div class='gman-widget-value'></div>\n"
    parent.innerHTML += "   <input class='gman-widget-slider' type='range' min='"+min.toString()+"' max='"+max.toString()+"' value='"+value.toString()+"' />\n";
    parent.innerHTML += "</div>";
    var valueElem = parent.querySelector(".gman-widget-value");
    var sliderElem = parent.querySelector(".gman-widget-slider");

    function updateValue(value) {
        valueElem.textContent = (value * step * uiMult).toFixed(uiPrecision)
    }

    updateValue(value);

    function handleChange(event) {
        var value = parseInt(event.target.value);
        updateValue(value);
        fn(event, { value: value * step });
    }

    sliderElem.addEventListener('input', handleChange);
    sliderElem.addEventListener('change', handleChange);

    return {
        elem: parent,
        updateValue: (v) => {
            v /= step;
            sliderElem.value = v;
            updateValue(v);
        },
    };
}

function getQueryParams() {
    var params = {};
    if (window.hackedParams) {
        Object.keys(window.hackedParams).forEach(function(key) {
            params[key] = window.hackedParams[key];
        });
    }
    if (window.location.search) {
        window.location.search.substring(1).split("&").forEach(function(pair) {
            var keyValue = pair.split("=").map(function(kv) {
                return decodeURIComponent(kv);
            });
            params[keyValue[0]] = keyValue[1];
        });
    }
    return params;
}