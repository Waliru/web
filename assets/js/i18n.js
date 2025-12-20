(function () {
    function getCurrentLang() {
        return window.location.pathname.startsWith('/en') ? 'en' : 'es';
    }

    function getValue(obj, path) {
        return path.split('.').reduce(function (acc, key) {
            return acc && acc[key] !== undefined ? acc[key] : null;
        }, obj);
    }

    function applyTranslations(dictionary) {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            var value = getValue(dictionary, key);
            if (value === null || value === undefined) {
                console.warn('Missing i18n key:', key);
                return;
            }
            el.textContent = value;
        });

        document.querySelectorAll('[data-i18n-list]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-list');
            var list = getValue(dictionary, key);
            if (!Array.isArray(list)) {
                console.warn('i18n list key must be an array:', key);
                return;
            }
            el.innerHTML = '';
            list.forEach(function (item) {
                var li = document.createElement('li');
                li.textContent = item;
                el.appendChild(li);
            });
        });
    }

    function init() {
        var lang = getCurrentLang();
        var url = '/assets/i18n/' + lang + '.json';
        fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load i18n file: ' + url);
                }
                return response.json();
            })
            .then(applyTranslations)
            .catch(function (error) {
                console.warn(error.message);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
