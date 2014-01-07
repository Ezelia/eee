module util.DOM {



    export function select(el): void {

        if (typeof (el) == 'string') {
            this.element = document.getElementById(el);
        }
        else {
            this.element = el;
        }

        this.css = function () {
            if (arguments.length == 2) {
                this.element.style[arguments[0]] = arguments[1];
            }
            else {
                if (arguments[0] instanceof Object) {
                    for (var p in arguments[0]) {
                        if (arguments[0][p] !== undefined) {
                            this.element.style[p] = arguments[0][p];
                        }
                    }

                }

            }

            return this;
        };

        if (this instanceof select) {
            return this.select;
        } else {
            return new select(el);
        }
    };

    export function getNumericStyleProperty(style, prop) {
        return parseInt(style.getPropertyValue(prop), 10);
    }

    export function element_position(e) {
        var x = 0, y = 0;
        var inner = true;
        do {
            x += e.offsetLeft;
            y += e.offsetTop;
            var style = getComputedStyle(e, null);
            var borderTop = getNumericStyleProperty(style, "border-top-width");
            var borderLeft = getNumericStyleProperty(style, "border-left-width");
            y += borderTop;
            x += borderLeft;
            if (inner) {
                var paddingTop = getNumericStyleProperty(style, "padding-top");
                var paddingLeft = getNumericStyleProperty(style, "padding-left");
                y += paddingTop;
                x += paddingLeft;
            }
            inner = false;
        } while (e = e.offsetParent);
        return { x: x, y: y };
    }

    export function triggerDomEvent(element, eventName, sender) {
        var event;
        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(eventName, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = eventName;
        }

        event.eventName = eventName;
        event.sender = sender;
        //event.memo = memo || { };

        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent("on" + event.eventType, event);
        }
    }
    export function AddEvent(element, event_name, event_function) {
        if (element.addEventListener) //Firefox & company
            element.addEventListener(event_name, event_function, false); //don't need the 'call' trick because in FF everything already works in the right way          
        else
            if (element.attachEvent) //Internet Explorer
                element.attachEvent("on" + event_name, function () { event_function.call(element); });
    }

    export function Ready(fn) {
        var win = window;

        if ((<any>navigator).isCocoonJS) {
            fn.call(win);
            return;
        }


        var done = false, top = true,

            doc: any = win.document, root: any = doc.documentElement,

            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',

            init = function (e: any) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function () {
                try { root.doScroll('left'); } catch (e) { setTimeout(poll, 50); return; }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !win.frameElement; } catch (e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }

    }

}