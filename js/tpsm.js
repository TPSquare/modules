class Doc {
    /**
     * @param {Object} options
     * @returns {Node}
     */
    createElement(options) {
        if (options === undefined) return document.createElement('div');
        if (typeof options === 'string') return document.createElement(options);
        options = Object.assign({}, options);
        const element = document.createElement(options.tag || 'div');
        delete options.tag;
        return this.combine(element, options);
    }
    /**
     * @param {Node} element
     * @param {Object} options
     * @returns {Node}
     */
    combine(element, options) {
        options = Object.assign({}, options);

        if (options.innerHTML) element.innerHTML = options.innerHTML;
        else if (options.innerText) element.innerText = options.innerText;
        options.children?.forEach((child) => element.appendChild(child));
        delete options.innerHTML;
        delete options.innerText;
        delete options.children;

        if (typeof options.style === 'object') options.style = this.createStyleText(options.style);
        if (options.style) element.style = options.style;
        delete options.style;

        for (const key in options.attributes) element.setAttribute(key, options.attributes[key]);
        delete options.attributes;

        for (const key in options) element[key] = options[key];

        return element;
    }
    /**
     * @param {Object} options
     * @returns {Array}
     */
    createStyleList(options = {}) {
        const result = [];
        for (const key in options)
            if (key.indexOf('--') === 0) result.push([key, String(options[key])]);
            else {
                const value = String(options[key]);
                let rKey = '';
                for (const char of key)
                    if (char >= 'A' && char <= 'Z') rKey += '-' + char.toLowerCase();
                    else rKey += char;
                result.push([rKey, value]);
            }
        return result;
    }
    /**
     * @param {Object} options
     * @returns {String}
     */
    createStyleText(options = {}) {
        return this.createStyleList(options)
            .map((e) => `${e.join(':')};`)
            .join('');
    }
    /**
     * @param {Node} element
     * @param {Object} style
     */
    setStyle(element, style) {
        style = this.createStyleList(style);
        for (const [key, value] of style) element.style.setProperty(key, value);
    }
    /**
     * @param {Node} element
     */
    fromElement(element) {
        return {
            querySelector: (selector, options) =>
                this.combine(element.querySelector(selector), options)
        };
    }
    /**
     * @param {String} selector
     * @param {Object} options
     * @returns {Node}
     */
    querySelector(selector, options) {
        return this.combine(document.querySelector(selector), options);
    }
    /**
     * @param {Node} element
     */
    openFullScreen(element) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
    }
    closeFullScreen() {
        if (!document.fullscreenElement) return;
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }
    /**
     * @param {Node} element
     * @param {String} block
     */
    scrollToElement(element, block) {
        return new Promise((resolve) => {
            let isScrolling;
            function onScroll() {
                clearTimeout(isScrolling);
                isScrolling = setTimeout(() => {
                    window.removeEventListener('scroll', onScroll);
                    resolve();
                }, 100);
            }
            window.addEventListener('scroll', onScroll);
            window.dispatchEvent(new Event('scroll'));
            element.scrollIntoView({behavior: 'smooth', block});
        });
    }
}

window.TPSM = new (class {
    constructor() {
        this.doc = new Doc();
    }
    /**
     * @param {String} value
     * @param {Object} options
     * @returns {String}
     */
    removeExtraWhitespace(value, options) {
        value = value.split('\n').map((e) => {
            e = e.trim();
            while (e.includes('  ')) e = e.replaceAll('  ', ' ');
            return e;
        });
        value = value.join(options.onOneLine ? ' ' : '\n');
        return value;
    }
    /**
     * @param {Number} width
     * @param {Number} height
     * @param {Function} callback
     * @param {Node} element
     */
    setAspectRatio(width, height, callback, element) {
        if (typeof element === 'string') element = this.querySelector(element);
        if (!element) element = document.body;
        element.arCallback = callback;
        element.arResize = () => {
            if ((this.innerWidth * height) / width <= this.innerHeight)
                element.aspect.width = this.innerWidth;
            else element.aspect.width = (this.innerHeight * width) / height;
            element.aspect.height = (element.aspect.width * height) / width;
            element.arCallback(element.aspect.width, element.aspect.height);
        };
        element.aspect = {};
        this.addEventListener('resize', element.arResize);
        element.arResize();
    }
    /**
     * @param {Number} duration
     */
    delay(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }
})();
