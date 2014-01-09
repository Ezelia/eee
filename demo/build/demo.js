var CSkin = (function () {
    function CSkin(color) {
        if (typeof color === "undefined") { color = '#000'; }
        this.color = color;
    }
    CSkin.__label__ = 'skin';
    return CSkin;
})();
var CSize = (function () {
    function CSize(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this.width = width;
        this.height = height;
    }
    CSize.__label__ = 'size';
    return CSize;
})();
var util;
(function (util) {
    (function (DOM) {
        function select(el) {
            if (typeof (el) == 'string') {
                this.element = document.getElementById(el);
            } else {
                this.element = el;
            }

            this.css = function () {
                if (arguments.length == 2) {
                    this.element.style[arguments[0]] = arguments[1];
                } else {
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
        }
        DOM.select = select;
        ;

        function getNumericStyleProperty(style, prop) {
            return parseInt(style.getPropertyValue(prop), 10);
        }
        DOM.getNumericStyleProperty = getNumericStyleProperty;

        function element_position(e) {
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
            } while(e = e.offsetParent);
            return { x: x, y: y };
        }
        DOM.element_position = element_position;

        function triggerDomEvent(element, eventName, sender) {
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

            if (document.createEvent) {
                element.dispatchEvent(event);
            } else {
                element.fireEvent("on" + event.eventType, event);
            }
        }
        DOM.triggerDomEvent = triggerDomEvent;
        function AddEvent(element, event_name, event_function) {
            if (element.addEventListener)
                element.addEventListener(event_name, event_function, false);
else if (element.attachEvent)
                element.attachEvent("on" + event_name, function () {
                    event_function.call(element);
                });
        }
        DOM.AddEvent = AddEvent;

        function Ready(fn) {
            var win = window;

            if ((navigator).isCocoonJS) {
                fn.call(win);
                return;
            }

            var done = false, top = true, doc = win.document, root = doc.documentElement, add = doc.addEventListener ? 'addEventListener' : 'attachEvent', rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent', pre = doc.addEventListener ? '' : 'on', init = function (e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete')
                    return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true))
                    fn.call(win, e.type || e);
            }, poll = function () {
                try  {
                    root.doScroll('left');
                } catch (e) {
                    setTimeout(poll, 50);
                    return;
                }
                init('poll');
            };

            if (doc.readyState == 'complete')
                fn.call(win, 'lazy');
else {
                if (doc.createEventObject && root.doScroll) {
                    try  {
                        top = !win.frameElement;
                    } catch (e) {
                    }
                    if (top)
                        poll();
                }
                doc[add](pre + 'DOMContentLoaded', init, false);
                doc[add](pre + 'readystatechange', init, false);
                win[add](pre + 'load', init, false);
            }
        }
        DOM.Ready = Ready;
    })(util.DOM || (util.DOM = {}));
    var DOM = util.DOM;
})(util || (util = {}));
var CPhysicsBody = (function () {
    function CPhysicsBody(x1, y1, x2, y2, isground) {
        if (typeof x1 === "undefined") { x1 = 0; }
        if (typeof y1 === "undefined") { y1 = 0; }
        if (typeof x2 === "undefined") { x2 = 0; }
        if (typeof y2 === "undefined") { y2 = 0; }
        if (typeof isground === "undefined") { isground = false; }
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.isground = isground;
        this.jumping = false;
        this.grounded = false;
        this.wasleft = false;
        this.wasright = false;
        //velocity
        this.vx = 0;
        this.vy = 0;
        //
        this.speed = 12;
    }
    CPhysicsBody.__label__ = 'pbody';
    return CPhysicsBody;
})();
var CInput = (function () {
    function CInput() {
        //define mappable inputs
        this.keys = {
            UP: false,
            DOWN: false,
            LEFT: false,
            RIGHT: false
        };
    }
    CInput.__label__ = 'input';
    return CInput;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var modules;
(function (modules) {
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer(canvas) {
            _super.call(this, [], [CSkin]);
            this.canvas = canvas;
            this.viewport = { x1: 0, y1: 0, x2: 0, y2: 0 };
            this.ctx = canvas.getContext('2d');
            this.cWidth = canvas.width;
            this.cHeight = canvas.height;

            this.viewport.x2 = this.cWidth;
            this.viewport.y2 = this.cHeight;
        }
        Renderer.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
        };

        Renderer.prototype.isInViewPort = function (pos, size) {
            if (pos.x + size.width / 2 < this.viewport.x1 || pos.y + size.height < this.viewport.y1)
                return false;
            if (pos.x - size.width / 2 > this.viewport.x2 || pos.y - size.height > this.viewport.y2)
                return false;

            return true;
        };

        Renderer.prototype.drawEntity = function (entity) {
            var pos = entity.get(CPosition);
            var size = entity.get(CSize);

            if (!this.isInViewPort(pos, size))
                return;

            var skin = entity.get(CSkin);

            var x = pos.x - size.width / 2;
            var y = pos.y - size.height / 2;

            this.ctx.save();
            this.ctx.fillStyle = skin.color;
            this.ctx.fillRect(x, y, size.width, size.height);
            this.ctx.restore();
        };

        Renderer.prototype.update = function () {
            this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);

            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.drawEntity(entity);
            }
        };
        return Renderer;
    })(eee.TModule);
    modules.Renderer = Renderer;
})(modules || (modules = {}));
var CVelocity = (function () {
    function CVelocity(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
    }
    CVelocity.__label__ = 'velocity';
    return CVelocity;
})();
var modules;
(function (modules) {
    //this physics module is highly inspired from this tutorial
    //http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
    //the physics modele is not perfect for a real platformer game (it behaves differently depending on computer/browser perfs)
    // but it's simple and easy to understand.
    var Physics = (function (_super) {
        __extends(Physics, _super);
        function Physics(gravity) {
            if (typeof gravity === "undefined") { gravity = 10; }
            _super.call(this, [], [CPhysicsBody, CPosition]);
            this.gravity = gravity;
            this.friction = 0.8;
        }
        Physics.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            this.lastTime = eee.Engine.time;
        };

        Physics.prototype.updateEntity = function (entity) {
            var pbody = entity.get(CPhysicsBody);
            var pos = entity.get(CPosition);
            var size = entity.get(CSize);

            var input = entity.get(CInput);

            if (!pbody.isground) {
                if (input.keys.UP) {
                    if (!pbody.jumping && pbody.grounded) {
                        pbody.jumping = true;
                        pbody.grounded = false;

                        pbody.vy = -pbody.speed * 2;
                        pos.y -= 1;
                    }
                }
                if (input.keys.RIGHT) {
                    if (pbody.vx < pbody.speed) {
                        pbody.vx = pbody.jumping ? pbody.vx + 2 : pbody.vx + 1;
                    }
                }
                if (input.keys.LEFT) {
                    if (pbody.vx > -pbody.speed) {
                        pbody.vx = pbody.jumping ? pbody.vx - 2 : pbody.vx - 1;
                    }
                }

                pbody.vx *= this.friction;
                pbody.vy += (this.deltaTime * this.gravity) / (1000 / 60);

                pbody.grounded = false;

                var keys = this.entities;
                for (var i = 0; i < keys.length; i++) {
                    var entity2 = eee.Engine.data.entities.get(keys[i]);

                    //if (!entity2) continue;
                    //var pbody2: CPhysicsBody = entity2.get(CPhysicsBody);
                    var col = this.isColliding(entity, entity2);
                    if (!col)
                        continue;

                    var pbody2 = entity2.get(CPhysicsBody);
                    if (pbody2.isground) {
                        switch (col.dir) {
                            case 'l':
                                pos.x += col.cx;

                                pbody.vx = 0;
                                pbody.jumping = false;

                                break;
                            case 'r':
                                pos.x -= col.cx;

                                pbody.vx = 0;
                                pbody.jumping = false;

                                break;
                            case 'b':
                                pos.y -= col.cy;

                                pbody.grounded = true;
                                pbody.jumping = false;
                                break;
                            case 't':
                                pos.y += col.cy;

                                pbody.vy *= -1;
                                break;
                        }
                    }
                }

                if (pbody.grounded) {
                    pbody.vy = 0;
                }

                pos.x += pbody.vx;
                pos.y += pbody.vy;
            }
        };

        Physics.prototype.isColliding = function (entityA, entityB) {
            if (!entityA || !entityB)
                return null;
            var pbodyA = entityA.get(CPhysicsBody);
            var posA = entityA.get(CPosition);

            var pbodyB = entityB.get(CPhysicsBody);
            var posB = entityB.get(CPosition);

            // get the vectors to check against
            var vX = posA.x - posB.x;
            var vY = posA.y - posB.y;

            // add the half widths and half heights of the objects
            var hWidths = (pbodyA.x2 - pbodyA.x1 + pbodyB.x2 - pbodyB.x1) / 2;
            var hHeights = (pbodyA.y2 - pbodyA.y1 + pbodyB.y2 - pbodyB.y1) / 2;
            var colDir = '';

            if (Math.abs(vX) <= hWidths && Math.abs(vY) <= hHeights) {
                var oX = hWidths - Math.abs(vX), oY = hHeights - Math.abs(vY);
                if (oX >= oY) {
                    if (vY > 0) {
                        colDir = "t";
                    } else {
                        colDir = "b";
                    }
                } else {
                    if (vX > 0) {
                        colDir = "l";
                    } else {
                        colDir = "r";
                    }
                }
            }
            return { dir: colDir, cx: oX, cy: oY };
        };

        Physics.prototype.update = function () {
            this.deltaTime = eee.Engine.time - this.lastTime;

            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.updateEntity(entity);
            }

            this.lastTime = eee.Engine.time;
        };
        return Physics;
    })(eee.TModule);
    modules.Physics = Physics;
})(modules || (modules = {}));
var modules;
(function (modules) {
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input() {
            _super.call(this, [], [CInput]);
            this.keys = [];
            this.keyEventUpdate = false;

            this.registerEvent('keyUpdate');
        }
        Input.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);

            this.setupKeyboardEventsListener();
        };

        Input.prototype.setupKeyboardEventsListener = function () {
            var _this = this;
            document.body.addEventListener("keydown", function (e) {
                _this.keys[e.keyCode] = true;
                _this.keyEventUpdate = true;
            });

            document.body.addEventListener("keyup", function (e) {
                _this.keys[e.keyCode] = false;
                _this.keyEventUpdate = true;
            });
        };

        Input.prototype.updateEntity = function (entity) {
            if (this.keyEventUpdate) {
                var input = entity.get(CInput);

                //input.keys = this.keys; //TODO : update entity keys instead of referencing Module keys
                this.triggerBehaviour('keyUpdate', entity, this.keys);
            }
        };
        Input.prototype.update = function () {
            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.updateEntity(entity);
            }

            this.keyEventUpdate = false;
        };
        return Input;
    })(eee.TModule);
    modules.Input = Input;
})(modules || (modules = {}));
var RAFScheduler = (function () {
    function RAFScheduler() {
    }
    RAFScheduler.tick = function () {
        eee.Engine.dtime = Date.now() - eee.Engine.time;
        eee.Engine.time = Date.now();

        for (var i = 0; i < RAFScheduler.modules.length; i++) {
            var mod = RAFScheduler.modules[i];
            if (mod)
                mod.update();
        }

        requestAnimationFrame(function () {
            RAFScheduler.tick();
        });
    };

    RAFScheduler.updateModules = //Used by eee.Engine when registering the scheduler
    function (modules) {
        this.modules = modules;
    };
    RAFScheduler.modules = [];
    return RAFScheduler;
})();
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
((function (window) {
    'use strict';

    if ((navigator).isCocoonJS)
        return;

    var lastTime = 0, vendors = ['moz', 'webkit', 'o', 'ms'], x;

    for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.cancelAnimationFrame) {
        if (!window.requestAnimationFrame) {
            // No support, emulate standard
            window.requestAnimationFrame = function (callback) {
                var now = new Date().getTime(), nextTime = Math.max(lastTime + 16, now);

                return window.setTimeout(function () {
                    callback(lastTime = nextTime);
                }, nextTime - now);
            };

            window.cancelAnimationFrame = window.clearTimeout;
        } else {
            // Emulate cancel for browsers that don't support it
            var vendorsRAF = window.requestAnimationFrame;
            var lastTime = {};

            window.requestAnimationFrame = function (callback) {
                var id = x;
                x += 1;
                lastTime[id] = callback;

                // Call the vendors requestAnimationFrame implementation
                vendorsRAF(function (timestamp) {
                    if (lastTime.hasOwnProperty(id)) {
                        var error;
                        try  {
                            lastTime[id](timestamp);
                        } catch (e) {
                            error = e;
                        } finally {
                            delete lastTime[id];
                            if (error) {
                                throw error;
                            }
                        }
                    }
                });

                // return the id for cancellation capabilities
                return id;
            };

            window.cancelAnimationFrame = function (id) {
                delete lastTime[id];
            };
        }
    }
})(this));
var CPosition = (function () {
    function CPosition(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
    }
    CPosition.__label__ = 'pos';
    return CPosition;
})();
/// <reference path="eee/eee.d.ts" />
var canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
document.body.appendChild(canvas);

var mPhysics = new modules.Physics(2);
var mRenderer = new modules.Renderer(canvas);
var mInput = new modules.Input();

eee.Engine.insertModule(mInput);
eee.Engine.insertModule(mPhysics);
eee.Engine.insertModule(mRenderer);
eee.Engine.start(RAFScheduler);

var playerBhv = (function (_super) {
    __extends(playerBhv, _super);
    function playerBhv() {
        _super.apply(this, arguments);
    }
    playerBhv.prototype.keyUpdate = function (keys) {
        var input = this.entity.get(CInput);
        var pbody = this.entity.get(CPhysicsBody);

        input.keys.UP = keys[38];
        input.keys.LEFT = keys[37];
        input.keys.RIGHT = keys[39];
    };
    return playerBhv;
})(eee.TBehaviour);

var player = new eee.Entity().add(new CPosition(100, 500)).add(new CSize(20, 20)).add(new CPhysicsBody(-10, -10, 10, 10, false)).add(new CSkin('#f00')).add(new CInput()).add(new eee.CBehaviour(playerBhv));

//here we define another object keeping a reference to it (ground) so we can add components later
var ground = new eee.Entity().add(new CPosition(0, 550)).add(new CSize(400, 40)).add(new CSkin());

//we can add/remove components at any time :)
ground.add(new CPhysicsBody(-200, -20, 200, 20, true));

//if we only need to instantiate an entity with some component, we don't need to keep a reference
// this is another ground
new eee.Entity().add(new CPosition(300, 450)).add(new CSize(500, 40)).add(new CSkin('#009')).add(new CPhysicsBody(-250, -20, 250, 20, true));
var Ezelia;
(function (Ezelia) {
    (function (Germiz) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine(settings) {
                _super.call(this);
                this.settings = settings;
            }
            return GameEngine;
        })(eee.EventHandler);
        Germiz.GameEngine = GameEngine;
    })(Ezelia.Germiz || (Ezelia.Germiz = {}));
    var Germiz = Ezelia.Germiz;
})(Ezelia || (Ezelia = {}));
//# sourceMappingURL=demo.js.map
