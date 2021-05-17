
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* src\core\CanvasItems\CanvasImage.svelte generated by Svelte v3.32.3 */

    const file = "src\\core\\CanvasItems\\CanvasImage.svelte";

    function create_fragment(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "this is an image element";
    			attr_dev(div, "class", "svelte-108a3i5");
    			add_location(div, file, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CanvasImage", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CanvasImage> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CanvasImage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CanvasImage",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const canvasTargetTranslation = writable({ x: 0, y: 0 });
    const canvasTargetScale = writable(1);
    const canvasCurrentScale = writable(1);
    const canvasCurrentTranslation = writable({ x: 0, y: 0 });
    class CanvasItem {
        constructor(id, position, scale, component) {
            this.id = ""; //this will be randomly generated on server or client side
            this.position = { x: 0, y: 0 };
            this.scale = { x: 10, y: 10 };
            this.component = CanvasImage;
            this.inSelectionRange = false;
            this.selected = false;
            this.id = id;
            this.position = position;
            this.scale = scale;
            this.component = component;
        }
    }
    const canvasItems = writable([
        new CanvasItem("asdfsjakldfldsa", { x: 0, y: 0 }, { x: 100, y: 100 }, CanvasImage),
        new CanvasItem("asdfsjakldflddsaf", { x: 200, y: 200 }, { x: 300, y: 300 }, CanvasImage),
        new CanvasItem("asdfsjakldfldsa", { x: 300, y: 0 }, { x: 100, y: 100 }, CanvasImage),
        new CanvasItem("asdfsjakldfldsa", { x: 400, y: 0 }, { x: 100, y: 100 }, CanvasImage),
        new CanvasItem("asdfsjakldfldsa", { x: 500, y: 0 }, { x: 100, y: 100 }, CanvasImage),
    ]);
    /*-----   Input System   -----*/
    let activeInput = [];
    const operations = {
        ITEM: {
            SELECT: "item.select",
            SELECT_ADDITIVE: "item.select_additive",
            MOVE: "item.move",
        },
        CANVAS: {
            BOX_SELECT: "canvas.box_select",
            BOX_SELECT_ADDITIVE: "canvas.box_select_additive",
            PAN: "canvas.pan",
            ZOOM_IN: "canvas.zoom_in",
            ZOOM_OUT: "canvas.zoom_out",
        },
        SHORTCUT: {
            SAVE: "shortcut.save",
            ALIGN_TOP: "shortcut.align_top",
        },
    };
    class Mapping {
        constructor(operation, input) {
            this.input = [];
            this.onDown = () => { };
            this.onUp = () => { };
            this.operation = operation;
            this.input = input;
        }
        setDown(func) {
            this.onDown = func;
            return this;
        }
        setUp(func) {
            this.onUp = func;
            return this;
        }
    }
    let mappings = [
        new Mapping(operations.SHORTCUT.ALIGN_TOP, ["control", "arrowup"]),
        new Mapping(operations.CANVAS.BOX_SELECT, ["leftMouse"]),
        new Mapping(operations.CANVAS.BOX_SELECT_ADDITIVE, ["shift", "leftMouse"]),
        new Mapping(operations.CANVAS.PAN, ["alt", "rightMouse"]),
        new Mapping(operations.CANVAS.PAN, ["middleMouse"]),
        new Mapping(operations.CANVAS.ZOOM_IN, ["scrollUp"]),
        new Mapping(operations.CANVAS.ZOOM_OUT, ["scrollDown"]),
        new Mapping(operations.ITEM.MOVE, ["leftMouse"]),
        new Mapping(operations.ITEM.SELECT, ["leftMouse"]),
        new Mapping(operations.ITEM.SELECT_ADDITIVE, ["shift", "leftMouse"]),
    ];

    function getCanvasValues() {
        let canvasTargetTranslationValue = { x: 0, y: 0 };
        let canvasTargetScaleValue = 1;
        canvasTargetTranslationValue = get_store_value(canvasTargetTranslation);
        canvasTargetScaleValue = get_store_value(canvasTargetScale);
        return { offset: canvasTargetTranslationValue, scale: canvasTargetScaleValue };
    }
    function screenToWorld(screenX, screenY, customX = null, customY = null, customScale = null) {
        let canvas = getCanvasValues();
        if (customX != null) {
            canvas.offset.x = customX;
        }
        if (customY != null) {
            canvas.offset.y = customY;
        }
        if (customScale != null) {
            canvas.scale = customScale;
        }
        return {
            x: (screenX - canvas.offset.x) / canvas.scale,
            y: (screenY - canvas.offset.y) / canvas.scale,
        };
    }
    function worldToScreen(screenX, screenY, customX = null, customY = null, customScale = null) {
        let canvas;
        canvas = { offset: { x: 0, y: 0 }, scale: 1 };
        if (customX != null) {
            canvas.offset.x = customX;
        }
        if (customY != null) {
            canvas.offset.y = customY;
        }
        if (customScale != null) {
            canvas.scale = customScale;
        }
        return {
            x: screenX * canvas.scale + canvas.offset.x,
            y: screenY * canvas.scale + canvas.offset.y,
        };
    }
    class Vector {
        static addEach(vector1, vector2) {
            if (vector1 == null || vector2 == null)
                return;
            return { x: vector1.x + vector2.x, y: vector1.y + vector2.y };
        }
        static subtractEach(vector1, vector2) {
            if (vector1 == null || vector2 == null)
                return;
            return { x: vector1.x - vector2.x, y: vector1.y - vector2.y };
        }
        static multiplyBoth(vector, multiplier) {
            if (vector == null || multiplier == null)
                return;
            return { x: vector.x * multiplier, y: vector.y * multiplier };
        }
        static multiplyEach(vector, multiplier) {
            if (vector == null || multiplier == null)
                return;
            return { x: vector.x * multiplier.x, y: vector.y * multiplier.y };
        }
        static getLength(vector) {
            if (vector == null)
                return;
            return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        }
    }
    function overlappingRect(rect1, rect2) {
        let overlap = false;
        if (rect1 && rect2) {
            overlap = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
        }
        return overlap;
    }
    function squareNormalization(corner1, corner2) {
        let position = { x: 0, y: 0 };
        let scale = { x: 0.0, y: 0.0 };
        if (corner1.x > corner2.x) {
            position.x = corner2.x;
            scale.x = corner1.x - corner2.x;
        }
        else {
            position.x = corner1.x;
            scale.x = corner2.x - corner1.x;
        }
        if (corner1.y > corner2.y) {
            position.y = corner2.y;
            scale.y = corner1.y - corner2.y;
        }
        else {
            position.y = corner1.y;
            scale.y = corner2.y - corner1.y;
        }
        return { x: position.x, y: position.y, width: scale.x, height: scale.y };
    }
    function clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    const mouseButtonMap = ["leftMouse", "middleMouse", "rightMouse"];
    function pushInput(input, e) {
        if (activeInput.includes(input)) {
            return;
        }
        activeInput.push(input);
        return;
    }
    function spliceInput(input) {
        if (!activeInput.includes(input)) {
            return;
        }
        activeInput.splice(activeInput.indexOf(input), 1);
    }
    function compareInput(operation, input = activeInput) {
        let operationMappings = mappings.filter((element) => element.operation == operation);
        for (let mapping of operationMappings) {
            if (input.toString() == mapping.input.toString()) {
                return true;
            }
            for (let mapping of mappings.filter((element) => element.operation != operation)) {
                if (input.toString().includes(mapping.input.toString())) {
                    return false;
                }
            }
            if (input.toString().includes(mapping.input.toString())) {
                return true;
            }
        }
    }
    function preventDefault(input, e) {
        if (mappings.find((element) => element.input.toString() == activeInput.toString())) {
            try {
                e.preventDefault();
            }
            catch (error) {
                console.warn('Error preventing default for input "', mappings.find((element) => element.input.toString() == activeInput.toString()).operation, '" this may be a bug, or may be fine', "\n", error);
            }
        }
    }
    function shortcutDown(e) {
        let shortcuts = mappings.filter((element) => element.operation.startsWith("shortcut"));
        for (let i = 0; i < shortcuts.length; i++) {
            if (shortcuts[i].input.toString() == activeInput.toString()) {
                try {
                    shortcuts[i].onDown();
                }
                catch (_a) {
                    console.error(activeInput);
                }
                preventDefault(activeInput, e);
            }
        }
    }
    function shortcutUp(e) {
        let shortcuts = mappings.filter((element) => element.operation.startsWith("shortcut"));
        for (let i = 0; i < shortcuts.length; i++) {
            if (shortcuts[i].input.toString() == activeInput.toString()) {
                shortcuts[i].onUp();
                preventDefault(activeInput, e);
            }
        }
    }
    //Processes key inputs to remove duplicate keys-- Watch for errors with toLowercase, may need to only apply it to certain key ranges
    function processKey(key) {
        let processedKey = key;
        processedKey = processedKey.toLowerCase();
        return processedKey;
    }

    function clearSelection() {
        for (let item of get_store_value(canvasItems).filter((item) => item.selected)) {
            item.selected = false; //TODO: Split element deselection into a separate function
        }
        canvasItems.update((u) => u);
    }

    /* src\Core\BoxSelection.svelte generated by Svelte v3.32.3 */

    const file$1 = "src\\Core\\BoxSelection.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let defs;
    	let filter;
    	let feGaussianBlur;
    	let feBlend;
    	let rect;
    	let rect_width_value;
    	let rect_height_value;
    	let svg_width_value;
    	let svg_height_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			filter = svg_element("filter");
    			feGaussianBlur = svg_element("feGaussianBlur");
    			feBlend = svg_element("feBlend");
    			rect = svg_element("rect");
    			attr_dev(feGaussianBlur, "result", "blurOut");
    			attr_dev(feGaussianBlur, "stdDeviation", "10");
    			add_location(feGaussianBlur, file$1, 97, 6, 3554);
    			attr_dev(feBlend, "in", "SourceGraphic");
    			attr_dev(feBlend, "in2", "blurOut");
    			attr_dev(feBlend, "mode", "normal");
    			add_location(feBlend, file$1, 98, 6, 3615);
    			attr_dev(filter, "id", "selection-glow");
    			attr_dev(filter, "x", "-10");
    			attr_dev(filter, "y", "-10");
    			attr_dev(filter, "width", "200");
    			attr_dev(filter, "height", "200");
    			add_location(filter, file$1, 96, 4, 3477);
    			add_location(defs, file$1, 95, 2, 3465);
    			attr_dev(rect, "id", "selection-box");
    			attr_dev(rect, "x", "3");
    			attr_dev(rect, "y", "3");
    			attr_dev(rect, "width", rect_width_value = Math.max(3, /*scaleScreen*/ ctx[1].x - 6));
    			attr_dev(rect, "height", rect_height_value = Math.max(3, /*scaleScreen*/ ctx[1].y - 6));
    			attr_dev(rect, "rx", "5");
    			attr_dev(rect, "filter", "url(#selection-glow)");
    			attr_dev(rect, "class", "svelte-vbnion");
    			add_location(rect, file$1, 101, 2, 3703);
    			attr_dev(svg, "id", "selection");
    			attr_dev(svg, "width", svg_width_value = Math.max(6, /*scaleScreen*/ ctx[1].x));
    			attr_dev(svg, "height", svg_height_value = Math.max(6, /*scaleScreen*/ ctx[1].y));
    			set_style(svg, "transform", "translate(" + /*positionScreen*/ ctx[2].x + "px, " + /*positionScreen*/ ctx[2].y + "px)");
    			set_style(svg, "visibility", /*visibility*/ ctx[0]);
    			attr_dev(svg, "class", "svelte-vbnion");
    			add_location(svg, file$1, 86, 0, 3243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, filter);
    			append_dev(filter, feGaussianBlur);
    			append_dev(filter, feBlend);
    			append_dev(svg, rect);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousemove", /*windowMouseMove*/ ctx[3], false, false, false),
    					listen_dev(window, "mouseup", /*windowMouseUp*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scaleScreen*/ 2 && rect_width_value !== (rect_width_value = Math.max(3, /*scaleScreen*/ ctx[1].x - 6))) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*scaleScreen*/ 2 && rect_height_value !== (rect_height_value = Math.max(3, /*scaleScreen*/ ctx[1].y - 6))) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*scaleScreen*/ 2 && svg_width_value !== (svg_width_value = Math.max(6, /*scaleScreen*/ ctx[1].x))) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty & /*scaleScreen*/ 2 && svg_height_value !== (svg_height_value = Math.max(6, /*scaleScreen*/ ctx[1].y))) {
    				attr_dev(svg, "height", svg_height_value);
    			}

    			if (dirty & /*positionScreen*/ 4) {
    				set_style(svg, "transform", "translate(" + /*positionScreen*/ ctx[2].x + "px, " + /*positionScreen*/ ctx[2].y + "px)");
    			}

    			if (dirty & /*visibility*/ 1) {
    				set_style(svg, "visibility", /*visibility*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let positionScreen;
    	let $canvasItems;
    	let $canvasCurrentTranslation;
    	let $canvasCurrentScale;
    	validate_store(canvasItems, "canvasItems");
    	component_subscribe($$self, canvasItems, $$value => $$invalidate(12, $canvasItems = $$value));
    	validate_store(canvasCurrentTranslation, "canvasCurrentTranslation");
    	component_subscribe($$self, canvasCurrentTranslation, $$value => $$invalidate(8, $canvasCurrentTranslation = $$value));
    	validate_store(canvasCurrentScale, "canvasCurrentScale");
    	component_subscribe($$self, canvasCurrentScale, $$value => $$invalidate(9, $canvasCurrentScale = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BoxSelection", slots, []);
    	let { visibility = "hidden" } = $$props;
    	let start = { x: 0, y: 0 };
    	let scale = { x: 0, y: 0 };
    	let position = { x: 0, y: 0 };
    	let selecting = false;
    	const backgroundStartBoxSelection = (x, y, additive) => startBoxSelection(x, y, additive);

    	function windowMouseMove(e) {
    		boxSelectMouseMove(e);
    	}

    	function windowMouseUp(e) {
    		boxSelectMouseUp();
    	}

    	function boxSelectMouseMove(e) {
    		if (selecting) {
    			if (compareInput(operations.CANVAS.BOX_SELECT)) {
    				dragBoxSelection(e.clientX, e.clientY);
    			} else if (compareInput(operations.CANVAS.BOX_SELECT_ADDITIVE)) {
    				dragBoxSelection(e.clientX, e.clientY);
    			} else {
    				endBoxSelection();
    			}
    		}
    	}

    	function boxSelectMouseUp(e) {
    		if (selecting && activeInput.toString() != mappings.find(element => element.operation == operations.CANVAS.BOX_SELECT || operations.CANVAS.BOX_SELECT_ADDITIVE).input.toString()) {
    			endBoxSelection();
    		}
    	}

    	function startBoxSelection(x, y, additive) {
    		selecting = true;
    		start = screenToWorld(x, y);
    		$$invalidate(6, scale = { x: 0, y: 0 });
    		$$invalidate(7, position = { x: 0, y: 0 });
    		$$invalidate(0, visibility = "hidden");

    		if (!additive) {
    			clearSelection();
    		}
    	}

    	function dragBoxSelection(cx, cy, additive) {
    		let currentToWorld = screenToWorld(cx, cy);
    		let square = squareNormalization(start, currentToWorld);
    		$$invalidate(6, scale = { x: square.width, y: square.height });
    		$$invalidate(7, position = { x: square.x, y: square.y });
    		$$invalidate(0, visibility = "visible");
    		compareSelection();
    	}

    	function endBoxSelection() {
    		for (let item of $canvasItems) {
    			if (item.inSelectionRange) {
    				item.selected = true;
    				item.inSelectionRange = false;
    			}
    		}

    		canvasItems.update(u => u);
    		selecting = false;
    		$$invalidate(0, visibility = "hidden");
    	}

    	let scaleScreen = { x: 0, y: 0 };

    	//Function that compares elements to the boxSelection box.
    	function compareSelection(additive) {
    		for (let item of $canvasItems) {
    			if (overlappingRect(new DOMRect(position.x, position.y, scale.x, scale.y), new DOMRect(item.position.x, item.position.y, item.scale.x, item.scale.y))) {
    				//TODO: split element boxSelection into a separate function that could be called by a mouse events.
    				item.inSelectionRange = true;
    			} else {
    				item.inSelectionRange = false;
    			}
    		}

    		canvasItems.update(u => u);
    	}

    	const writable_props = ["visibility"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BoxSelection> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("visibility" in $$props) $$invalidate(0, visibility = $$props.visibility);
    	};

    	$$self.$capture_state = () => ({
    		overlappingRect,
    		screenToWorld,
    		squareNormalization,
    		Vector,
    		worldToScreen,
    		compareInput,
    		clearSelection,
    		activeInput,
    		canvasCurrentScale,
    		canvasCurrentTranslation,
    		canvasItems,
    		mappings,
    		operations,
    		visibility,
    		start,
    		scale,
    		position,
    		selecting,
    		backgroundStartBoxSelection,
    		windowMouseMove,
    		windowMouseUp,
    		boxSelectMouseMove,
    		boxSelectMouseUp,
    		startBoxSelection,
    		dragBoxSelection,
    		endBoxSelection,
    		scaleScreen,
    		compareSelection,
    		$canvasItems,
    		positionScreen,
    		$canvasCurrentTranslation,
    		$canvasCurrentScale
    	});

    	$$self.$inject_state = $$props => {
    		if ("visibility" in $$props) $$invalidate(0, visibility = $$props.visibility);
    		if ("start" in $$props) start = $$props.start;
    		if ("scale" in $$props) $$invalidate(6, scale = $$props.scale);
    		if ("position" in $$props) $$invalidate(7, position = $$props.position);
    		if ("selecting" in $$props) selecting = $$props.selecting;
    		if ("scaleScreen" in $$props) $$invalidate(1, scaleScreen = $$props.scaleScreen);
    		if ("positionScreen" in $$props) $$invalidate(2, positionScreen = $$props.positionScreen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*position, $canvasCurrentTranslation, $canvasCurrentScale*/ 896) {
    			$$invalidate(2, positionScreen = worldToScreen(position.x, position.y, $canvasCurrentTranslation.x, $canvasCurrentTranslation.y, $canvasCurrentScale));
    		}

    		if ($$self.$$.dirty & /*scale, $canvasCurrentScale*/ 576) {
    			$$invalidate(1, scaleScreen = Vector.multiplyBoth(scale, $canvasCurrentScale));
    		}
    	};

    	return [
    		visibility,
    		scaleScreen,
    		positionScreen,
    		windowMouseMove,
    		windowMouseUp,
    		backgroundStartBoxSelection,
    		scale,
    		position,
    		$canvasCurrentTranslation,
    		$canvasCurrentScale
    	];
    }

    class BoxSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			visibility: 0,
    			backgroundStartBoxSelection: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoxSelection",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get visibility() {
    		throw new Error("<BoxSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visibility(value) {
    		throw new Error("<BoxSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundStartBoxSelection() {
    		return this.$$.ctx[5];
    	}

    	set backgroundStartBoxSelection(value) {
    		throw new Error("<BoxSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Core\Selection.svelte generated by Svelte v3.32.3 */

    const file$2 = "src\\Core\\Selection.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let svg;
    	let rect;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			attr_dev(rect, "x", /*position*/ ctx[1].x);
    			attr_dev(rect, "y", /*position*/ ctx[1].y);
    			attr_dev(rect, "width", "" + (/*scale*/ ctx[2].x + "px"));
    			attr_dev(rect, "height", "" + (/*scale*/ ctx[2].y + "px"));
    			add_location(rect, file$2, 14, 4, 304);
    			add_location(svg, file$2, 13, 2, 293);
    			attr_dev(div, "id", "selection");
    			set_style(div, "--visibility", /*visibility*/ ctx[0]);
    			attr_dev(div, "class", "svelte-1t41f08");
    			add_location(div, file$2, 12, 0, 234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, rect);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visibility*/ 1) {
    				set_style(div, "--visibility", /*visibility*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Selection", slots, []);
    	let position = { x: 0, y: 0 };
    	let scale = { x: 100, y: 50 };
    	let visible = true;
    	let visibility = "hidden";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Selection> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ position, scale, visible, visibility });

    	$$self.$inject_state = $$props => {
    		if ("position" in $$props) $$invalidate(1, position = $$props.position);
    		if ("scale" in $$props) $$invalidate(2, scale = $$props.scale);
    		if ("visible" in $$props) $$invalidate(3, visible = $$props.visible);
    		if ("visibility" in $$props) $$invalidate(0, visibility = $$props.visibility);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	if (visible) {
    		$$invalidate(0, visibility = "visible");
    	} else {
    		$$invalidate(0, visibility = "hidden");
    	}

    	return [visibility, position, scale];
    }

    class Selection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selection",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Core\CanvasItem.svelte generated by Svelte v3.32.3 */

    const { console: console_1 } = globals;
    const file$3 = "src\\Core\\CanvasItem.svelte";

    const get_default_slot_changes = dirty => ({
    	itemId: dirty & /*itemId*/ 1,
    	position: dirty & /*position*/ 4,
    	scale: dirty & /*scale*/ 8
    });

    const get_default_slot_context = ctx => ({
    	class: "slot",
    	itemId: /*itemId*/ ctx[0],
    	position: /*position*/ ctx[2],
    	scale: /*scale*/ ctx[3]
    });

    // (109:49) This item has no type
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("This item has no type");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(109:49) This item has no type",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(div, "id", "root");
    			set_style(div, "--positionX", /*position*/ ctx[2].x + "px");
    			set_style(div, "--positionY", /*position*/ ctx[2].y + "px");
    			set_style(div, "--scaleX", /*scale*/ ctx[3].x + "px");
    			set_style(div, "--scaleY", /*scale*/ ctx[3].y + "px");
    			set_style(div, "--canvasZoom", /*canvasZoom*/ ctx[4]);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*divclass*/ ctx[1]) + " svelte-jp2xja"));
    			add_location(div, file$3, 102, 0, 3498);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousemove", /*windowMouseMove*/ ctx[6], false, false, false),
    					listen_dev(window, "mouseup", /*windowMouseUp*/ ctx[7], false, false, false),
    					listen_dev(div, "mousedown", /*mouseDown*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, itemId, position, scale*/ 16397) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[14], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}

    			if (!current || dirty & /*position*/ 4) {
    				set_style(div, "--positionX", /*position*/ ctx[2].x + "px");
    			}

    			if (!current || dirty & /*position*/ 4) {
    				set_style(div, "--positionY", /*position*/ ctx[2].y + "px");
    			}

    			if (!current || dirty & /*scale*/ 8) {
    				set_style(div, "--scaleX", /*scale*/ ctx[3].x + "px");
    			}

    			if (!current || dirty & /*scale*/ 8) {
    				set_style(div, "--scaleY", /*scale*/ ctx[3].y + "px");
    			}

    			if (!current || dirty & /*canvasZoom*/ 16) {
    				set_style(div, "--canvasZoom", /*canvasZoom*/ ctx[4]);
    			}

    			if (!current || dirty & /*divclass*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*divclass*/ ctx[1]) + " svelte-jp2xja"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const DRAG_THRESHOLD = 20; //TODO: Build out a settings store (maybe multiple stores for different things)

    function instance$3($$self, $$props, $$invalidate) {
    	let canvasItem;
    	let selected;
    	let inSelectionRange;
    	let $canvasCurrentScale;
    	let $canvasItems;
    	validate_store(canvasCurrentScale, "canvasCurrentScale");
    	component_subscribe($$self, canvasCurrentScale, $$value => $$invalidate(9, $canvasCurrentScale = $$value));
    	validate_store(canvasItems, "canvasItems");
    	component_subscribe($$self, canvasItems, $$value => $$invalidate(11, $canvasItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CanvasItem", slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { itemId = "" } = $$props;
    	let { itemIndex = 0 } = $$props;
    	let divclass = "";
    	let position = { x: 0, y: 0 };
    	let scale = { x: 1, y: 1 };
    	let canvasZoom = 1;
    	let selectPressed = false;
    	let selectAdditivePressed = false;
    	let movePressed = false;
    	let dragging = false;
    	let dragStart = { x: 0, y: 0 };

    	function mouseDown(e) {
    		pushInput(mouseButtonMap[e.button]);

    		if (compareInput(operations.ITEM.SELECT)) {
    			selectPressed = true;
    		}

    		if (compareInput(operations.ITEM.SELECT_ADDITIVE)) {
    			selectAdditivePressed = true;
    		}

    		if (compareInput(operations.ITEM.MOVE)) {
    			movePressed = true;
    			dragStart = { x: e.clientX, y: e.clientY };
    		}
    	}

    	function windowMouseMove(e) {
    		if (!dragging) {
    			let difference = Vector.subtractEach({ x: e.clientX, y: e.clientY }, dragStart);
    			let distance = Vector.getLength(difference);

    			if (distance > DRAG_THRESHOLD) {
    				dragging = true;
    			}
    		}

    		if (compareInput(operations.ITEM.MOVE) && movePressed && dragging) {
    			if (!selected) {
    				clearSelection();
    				$$invalidate(10, canvasItem.selected = true, canvasItem);
    			}

    			dragItems(e.movementX / devicePixelRatio, e.movementY / devicePixelRatio);
    			selectPressed = false;
    			selectAdditivePressed = false;
    		}
    	}

    	function windowMouseUp(e) {
    		if (!compareInput(operations.ITEM.MOVE)) {
    			movePressed = false;
    			dragging = false;
    		}

    		if (!compareInput(operations.ITEM.SELECT) && selectPressed) {
    			selectInputUp(false);
    		}

    		if (!compareInput(operations.ITEM.SELECT_ADDITIVE) && selectAdditivePressed) {
    			selectInputUp(true);
    		}
    	}

    	function selectInputUp(additive = false) {
    		console.log(additive);
    		console.log("selected ", canvasItem.selected);

    		if (selectPressed || selectAdditivePressed) {
    			if (additive) {
    				$$invalidate(10, canvasItem.selected = !canvasItem.selected, canvasItem);
    			} else {
    				clearSelection();
    				$$invalidate(10, canvasItem.selected = true, canvasItem);
    			}

    			canvasItems.update(u => u);
    		}

    		selectPressed = false;
    		selectAdditivePressed = false;
    	}

    	function dragItems(dx, dy) {
    		for (let item of $canvasItems.filter(item => item.selected == true)) {
    			let transformVector = Vector.multiplyBoth({ x: dx, y: dy }, 1 / $canvasCurrentScale);
    			item.position = Vector.addEach(item.position, transformVector);
    		}

    		canvasItems.update(u => u);
    	}

    	const writable_props = ["itemId", "itemIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<CanvasItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("itemId" in $$props) $$invalidate(0, itemId = $$props.itemId);
    		if ("itemIndex" in $$props) $$invalidate(8, itemIndex = $$props.itemIndex);
    		if ("$$scope" in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		activeInput,
    		canvasCurrentScale,
    		canvasItems,
    		operations,
    		createEventDispatcher,
    		compareInput,
    		mouseButtonMap,
    		pushInput,
    		Vector,
    		clearSelection,
    		dispatch,
    		DRAG_THRESHOLD,
    		itemId,
    		itemIndex,
    		divclass,
    		position,
    		scale,
    		canvasZoom,
    		selectPressed,
    		selectAdditivePressed,
    		movePressed,
    		dragging,
    		dragStart,
    		mouseDown,
    		windowMouseMove,
    		windowMouseUp,
    		selectInputUp,
    		dragItems,
    		$canvasCurrentScale,
    		canvasItem,
    		$canvasItems,
    		selected,
    		inSelectionRange
    	});

    	$$self.$inject_state = $$props => {
    		if ("itemId" in $$props) $$invalidate(0, itemId = $$props.itemId);
    		if ("itemIndex" in $$props) $$invalidate(8, itemIndex = $$props.itemIndex);
    		if ("divclass" in $$props) $$invalidate(1, divclass = $$props.divclass);
    		if ("position" in $$props) $$invalidate(2, position = $$props.position);
    		if ("scale" in $$props) $$invalidate(3, scale = $$props.scale);
    		if ("canvasZoom" in $$props) $$invalidate(4, canvasZoom = $$props.canvasZoom);
    		if ("selectPressed" in $$props) selectPressed = $$props.selectPressed;
    		if ("selectAdditivePressed" in $$props) selectAdditivePressed = $$props.selectAdditivePressed;
    		if ("movePressed" in $$props) movePressed = $$props.movePressed;
    		if ("dragging" in $$props) dragging = $$props.dragging;
    		if ("dragStart" in $$props) dragStart = $$props.dragStart;
    		if ("canvasItem" in $$props) $$invalidate(10, canvasItem = $$props.canvasItem);
    		if ("selected" in $$props) $$invalidate(12, selected = $$props.selected);
    		if ("inSelectionRange" in $$props) $$invalidate(13, inSelectionRange = $$props.inSelectionRange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$canvasCurrentScale*/ 512) {
    			$$invalidate(4, canvasZoom = $canvasCurrentScale);
    		}

    		if ($$self.$$.dirty & /*$canvasItems, itemIndex*/ 2304) {
    			$$invalidate(10, canvasItem = $canvasItems[itemIndex]);
    		}

    		if ($$self.$$.dirty & /*canvasItem*/ 1024) {
    			$$invalidate(2, position = canvasItem.position);
    		}

    		if ($$self.$$.dirty & /*canvasItem*/ 1024) {
    			$$invalidate(3, scale = canvasItem.scale);
    		}

    		if ($$self.$$.dirty & /*canvasItem*/ 1024) {
    			$$invalidate(12, selected = canvasItem.selected);
    		}

    		if ($$self.$$.dirty & /*canvasItem*/ 1024) {
    			$$invalidate(13, inSelectionRange = canvasItem.inSelectionRange);
    		}

    		if ($$self.$$.dirty & /*selected, inSelectionRange*/ 12288) {
    			if (selected) {
    				$$invalidate(1, divclass = "root selected");
    			} else if (inSelectionRange) {
    				$$invalidate(1, divclass = "root test");
    			} else {
    				$$invalidate(1, divclass = "root selectable");
    			}
    		}
    	};

    	return [
    		itemId,
    		divclass,
    		position,
    		scale,
    		canvasZoom,
    		mouseDown,
    		windowMouseMove,
    		windowMouseUp,
    		itemIndex,
    		$canvasCurrentScale,
    		canvasItem,
    		$canvasItems,
    		selected,
    		inSelectionRange,
    		$$scope,
    		slots
    	];
    }

    class CanvasItem$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { itemId: 0, itemIndex: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CanvasItem",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get itemId() {
    		throw new Error("<CanvasItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemId(value) {
    		throw new Error("<CanvasItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemIndex() {
    		throw new Error("<CanvasItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemIndex(value) {
    		throw new Error("<CanvasItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\core\Canvas.svelte generated by Svelte v3.32.3 */

    const { console: console_1$1 } = globals;
    const file$4 = "src\\core\\Canvas.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	child_ctx[36] = i;
    	return child_ctx;
    }

    // (177:6) <CanvasItem itemId={item.id} itemIndex={index} on:clearselection={clearSelection}>
    function create_default_slot(ctx) {
    	let switch_instance;
    	let t;
    	let current;
    	var switch_value = /*item*/ ctx[34].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*item*/ ctx[34].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(177:6) <CanvasItem itemId={item.id} itemIndex={index} on:clearselection={clearSelection}>",
    		ctx
    	});

    	return block;
    }

    // (176:4) {#each $canvasItems as item, index}
    function create_each_block(ctx) {
    	let canvasitem;
    	let current;

    	canvasitem = new CanvasItem$1({
    			props: {
    				itemId: /*item*/ ctx[34].id,
    				itemIndex: /*index*/ ctx[36],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	canvasitem.$on("clearselection", clearSelection);

    	const block = {
    		c: function create() {
    			create_component(canvasitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(canvasitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const canvasitem_changes = {};
    			if (dirty[0] & /*$canvasItems*/ 8) canvasitem_changes.itemId = /*item*/ ctx[34].id;

    			if (dirty[0] & /*$canvasItems*/ 8 | dirty[1] & /*$$scope*/ 64) {
    				canvasitem_changes.$$scope = { dirty, ctx };
    			}

    			canvasitem.$set(canvasitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvasitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(canvasitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(canvasitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(176:4) {#each $canvasItems as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let boxselection;
    	let t1;
    	let selection;
    	let t2;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	let boxselection_props = {};

    	boxselection = new BoxSelection({
    			props: boxselection_props,
    			$$inline: true
    		});

    	/*boxselection_binding*/ ctx[13](boxselection);
    	selection = new Selection({ $$inline: true });
    	let each_value = /*$canvasItems*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			create_component(boxselection.$$.fragment);
    			t1 = space();
    			create_component(selection.$$.fragment);
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "id", "background");
    			attr_dev(div0, "class", "svelte-19f4qs0");
    			add_location(div0, file$4, 165, 2, 5611);
    			attr_dev(div1, "id", "contents");
    			set_style(div1, "transform", "translate(" + /*canvasTranslation*/ ctx[0].x + "px," + /*canvasTranslation*/ ctx[0].y + "px)scale(" + /*canvasZoom*/ ctx[1] + "," + /*canvasZoom*/ ctx[1] + ")");
    			attr_dev(div1, "class", "svelte-19f4qs0");
    			add_location(div1, file$4, 171, 2, 5741);
    			attr_dev(div2, "id", "canvas");
    			attr_dev(div2, "class", "svelte-19f4qs0");
    			add_location(div2, file$4, 164, 0, 5531);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			mount_component(boxselection, div2, null);
    			append_dev(div2, t1);
    			mount_component(selection, div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "mousedown", /*backgroundMouseDown*/ ctx[4], false, false, false),
    					listen_dev(div2, "mousedown", /*canvasMouseDown*/ ctx[5], false, false, false),
    					listen_dev(div2, "wheel", /*canvasMouseWheel*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const boxselection_changes = {};
    			boxselection.$set(boxselection_changes);

    			if (dirty[0] & /*$canvasItems*/ 8) {
    				each_value = /*$canvasItems*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*canvasTranslation, canvasZoom*/ 3) {
    				set_style(div1, "transform", "translate(" + /*canvasTranslation*/ ctx[0].x + "px," + /*canvasTranslation*/ ctx[0].y + "px)scale(" + /*canvasZoom*/ ctx[1] + "," + /*canvasZoom*/ ctx[1] + ")");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boxselection.$$.fragment, local);
    			transition_in(selection.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boxselection.$$.fragment, local);
    			transition_out(selection.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*boxselection_binding*/ ctx[13](null);
    			destroy_component(boxselection);
    			destroy_component(selection);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const PAN_STIFFNESS = 1;
    const PAN_DAMPING = 1;
    const ZOOM_STIFFNESS = 0.2;
    const ZOOM_DAMPING = 1;
    const KEY_PAN_AMMOUNT = 100;
    const SCROLL_ZOOM_MULTIPLIER = 2;

    function windowFocus() {
    	
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let canvasZoom;
    	let $canvasTargetTranslation;
    	let $canvasTargetScale;
    	let $panSpring;
    	let $zoomSpring;
    	let $canvasCurrentScale;
    	let $canvasCurrentTranslation;
    	let $canvasItems;
    	validate_store(canvasTargetTranslation, "canvasTargetTranslation");
    	component_subscribe($$self, canvasTargetTranslation, $$value => $$invalidate(15, $canvasTargetTranslation = $$value));
    	validate_store(canvasTargetScale, "canvasTargetScale");
    	component_subscribe($$self, canvasTargetScale, $$value => $$invalidate(16, $canvasTargetScale = $$value));
    	validate_store(canvasCurrentScale, "canvasCurrentScale");
    	component_subscribe($$self, canvasCurrentScale, $$value => $$invalidate(17, $canvasCurrentScale = $$value));
    	validate_store(canvasCurrentTranslation, "canvasCurrentTranslation");
    	component_subscribe($$self, canvasCurrentTranslation, $$value => $$invalidate(18, $canvasCurrentTranslation = $$value));
    	validate_store(canvasItems, "canvasItems");
    	component_subscribe($$self, canvasItems, $$value => $$invalidate(3, $canvasItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Canvas", slots, []);
    	let boxSelection;

    	/*   Keyboard Input   */
    	document.addEventListener("keydown", keyDown);

    	function keyDown(e) {
    		let processedKey = processKey(e.key);

    		if (e.repeat) {
    			return;
    		}

    		pushInput(processedKey);
    		shortcutDown(e);
    		panInputStart(e);
    	}

    	document.addEventListener("keyup", keyUp);

    	function keyUp(e) {
    		e.preventDefault();
    		let processedKey = processKey(e.key);
    		shortcutUp(e);
    		spliceInput(processedKey);
    		panInputEnd();
    	}

    	/*   Window Focus   */
    	window.addEventListener("focus", windowFocus);

    	window.addEventListener("blur", windowBlur);

    	function windowBlur() {
    		shortcutUp(null); //runs the keyup event for any given shortcut, watch for bugs with this!
    		activeInput.splice(0, activeInput.length);
    	}

    	document.addEventListener("mousedown", mouseDown);

    	function mouseDown(e) {
    		pushInput(mouseButtonMap[e.button]);
    	}

    	document.addEventListener("mouseup", mouseUp);

    	function mouseUp(e) {
    		spliceInput(mouseButtonMap[e.button]);
    		panInputEnd();
    	}

    	document.addEventListener("mousemove", mouseMove);

    	function mouseMove(e) {
    		panMouseMove(e);
    	}

    	function backgroundMouseDown(e) {
    		pushInput(mouseButtonMap[e.button]);

    		if (compareInput(operations.CANVAS.BOX_SELECT)) {
    			boxSelection.backgroundStartBoxSelection(e.clientX, e.clientY, false);
    		}

    		if (compareInput(operations.CANVAS.BOX_SELECT_ADDITIVE)) {
    			boxSelection.backgroundStartBoxSelection(e.clientX, e.clientY, true);
    		}
    	}

    	function canvasMouseDown(e) {
    		pushInput(mouseButtonMap[e.button]);
    		panInputStart(e);
    	}

    	function canvasMouseWheel(e) {
    		switch (clamp(e.deltaY, -1, 1) * -1) {
    			case -1:
    				pushInput("scrollDown");
    				break;
    			case 1:
    				pushInput("scrollUp");
    				break;
    		}

    		const clientInit = screenToWorld(e.clientX, e.clientY);
    		zoomInput();
    		spliceInput("scrollDown");
    		spliceInput("scrollUp");
    		const clientNow = screenToWorld(e.clientX, e.clientY, null, null, zoomTarget.s);
    		let change = Vector.multiplyBoth(Vector.subtractEach(clientNow, clientInit), zoomTarget.s);
    		offsetZoom(change.x, change.y);
    	}

    	function panMouseMove(e) {
    		if (panning) {
    			if (compareInput(operations.CANVAS.PAN)) {
    				pan(e.movementX, e.movementY);
    			}
    		}
    	}

    	function panInputStart(e) {
    		if (compareInput(operations.CANVAS.PAN)) {
    			panStart(e.clientX, e.clientY);
    			console.log("panstart");
    		}
    	}

    	function panInputEnd() {
    		if (panning) {
    			if (compareInput(operations.CANVAS.PAN)) {
    				panEnd();
    			}
    		}
    	}

    	function zoomInput() {
    		if (compareInput(operations.CANVAS.ZOOM_IN)) {
    			zoom(SCROLL_ZOOM_MULTIPLIER);
    		}

    		if (compareInput(operations.CANVAS.ZOOM_OUT)) {
    			zoom(-SCROLL_ZOOM_MULTIPLIER);
    		}
    	}

    	//Define the target and spring for panning
    	let panTarget = { x: 0, y: 0 };

    	const panSpring = spring({ x: 0, y: 0 }, {
    		stiffness: PAN_STIFFNESS,
    		damping: PAN_DAMPING,
    		precision: 0.0001
    	});

    	validate_store(panSpring, "panSpring");
    	component_subscribe($$self, panSpring, value => $$invalidate(11, $panSpring = value));

    	//Define the target and spring for zooming (including offset in the target)
    	let zoomTarget = { x: 0, y: 0, s: 1 };

    	const zoomSpring = spring({ x: 0, y: 0, s: 1 }, {
    		stiffness: ZOOM_STIFFNESS,
    		damping: ZOOM_DAMPING,
    		precision: 0.0001
    	});

    	validate_store(zoomSpring, "zoomSpring");
    	component_subscribe($$self, zoomSpring, value => $$invalidate(12, $zoomSpring = value));

    	//Define the combined spring coordinates to be used by the canvas component's transform property
    	let canvasTranslation = { x: 0, y: 0 };

    	//Movement Functions
    	let panning = false;

    	function pan(dx, dy) {
    		$$invalidate(9, panTarget.x = panTarget.x + dx / devicePixelRatio, panTarget);
    		$$invalidate(9, panTarget.y = panTarget.y + dy / devicePixelRatio, panTarget);
    		panSpring.update($panSpring => panTarget);
    	}

    	function panStart(cx, cy) {
    		panning = true;
    	}

    	function panEnd() {
    		panning = false;
    	}

    	function offsetZoom(dx, dy) {
    		$$invalidate(10, zoomTarget.x = zoomTarget.x + dx, zoomTarget);
    		$$invalidate(10, zoomTarget.y = zoomTarget.y + dy, zoomTarget);
    		zoomSpring.update($zoomSpring => zoomTarget);
    	}

    	function zoom(ds) {
    		$$invalidate(10, zoomTarget.s = zoomTarget.s + ds * zoomTarget.s * 0.1, zoomTarget);
    		zoomSpring.update($zoomSpring => zoomTarget);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	function boxselection_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			boxSelection = $$value;
    			$$invalidate(2, boxSelection);
    		});
    	}

    	$$self.$capture_state = () => ({
    		spring,
    		screenToWorld,
    		Vector,
    		squareNormalization,
    		worldToScreen,
    		overlappingRect,
    		clamp,
    		canvasTargetTranslation,
    		canvasTargetScale,
    		canvasCurrentScale,
    		canvasCurrentTranslation,
    		canvasItems,
    		activeInput,
    		operations,
    		mappings,
    		BoxSelection,
    		Selection,
    		CanvasItem: CanvasItem$1,
    		compareInput,
    		mouseButtonMap,
    		processKey,
    		pushInput,
    		shortcutDown,
    		shortcutUp,
    		spliceInput,
    		clearSelection,
    		PAN_STIFFNESS,
    		PAN_DAMPING,
    		ZOOM_STIFFNESS,
    		ZOOM_DAMPING,
    		KEY_PAN_AMMOUNT,
    		SCROLL_ZOOM_MULTIPLIER,
    		boxSelection,
    		keyDown,
    		keyUp,
    		windowFocus,
    		windowBlur,
    		mouseDown,
    		mouseUp,
    		mouseMove,
    		backgroundMouseDown,
    		canvasMouseDown,
    		canvasMouseWheel,
    		panMouseMove,
    		panInputStart,
    		panInputEnd,
    		zoomInput,
    		panTarget,
    		panSpring,
    		zoomTarget,
    		zoomSpring,
    		canvasTranslation,
    		panning,
    		pan,
    		panStart,
    		panEnd,
    		offsetZoom,
    		zoom,
    		$canvasTargetTranslation,
    		$canvasTargetScale,
    		$panSpring,
    		$zoomSpring,
    		canvasZoom,
    		$canvasCurrentScale,
    		$canvasCurrentTranslation,
    		$canvasItems
    	});

    	$$self.$inject_state = $$props => {
    		if ("boxSelection" in $$props) $$invalidate(2, boxSelection = $$props.boxSelection);
    		if ("panTarget" in $$props) $$invalidate(9, panTarget = $$props.panTarget);
    		if ("zoomTarget" in $$props) $$invalidate(10, zoomTarget = $$props.zoomTarget);
    		if ("canvasTranslation" in $$props) $$invalidate(0, canvasTranslation = $$props.canvasTranslation);
    		if ("panning" in $$props) panning = $$props.panning;
    		if ("canvasZoom" in $$props) $$invalidate(1, canvasZoom = $$props.canvasZoom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*panTarget, zoomTarget*/ 1536) {
    			/*   Canvas Transformations   */
    			//Send to the Store the combined spring target values for world space calculations.
    			set_store_value(canvasTargetTranslation, $canvasTargetTranslation = Vector.addEach(panTarget, { x: zoomTarget.x, y: zoomTarget.y }), $canvasTargetTranslation);
    		}

    		if ($$self.$$.dirty[0] & /*zoomTarget*/ 1024) {
    			set_store_value(canvasTargetScale, $canvasTargetScale = zoomTarget.s, $canvasTargetScale);
    		}

    		if ($$self.$$.dirty[0] & /*$panSpring, $zoomSpring*/ 6144) {
    			$$invalidate(0, canvasTranslation = {
    				x: $panSpring.x + $zoomSpring.x,
    				y: $panSpring.y + $zoomSpring.y
    			});
    		}

    		if ($$self.$$.dirty[0] & /*$zoomSpring*/ 4096) {
    			$$invalidate(1, canvasZoom = $zoomSpring.s);
    		}

    		if ($$self.$$.dirty[0] & /*canvasZoom*/ 2) {
    			set_store_value(canvasCurrentScale, $canvasCurrentScale = canvasZoom, $canvasCurrentScale);
    		}

    		if ($$self.$$.dirty[0] & /*canvasTranslation*/ 1) {
    			set_store_value(canvasCurrentTranslation, $canvasCurrentTranslation = canvasTranslation, $canvasCurrentTranslation);
    		}
    	};

    	return [
    		canvasTranslation,
    		canvasZoom,
    		boxSelection,
    		$canvasItems,
    		backgroundMouseDown,
    		canvasMouseDown,
    		canvasMouseWheel,
    		panSpring,
    		zoomSpring,
    		panTarget,
    		zoomTarget,
    		$panSpring,
    		$zoomSpring,
    		boxselection_binding
    	];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.32.3 */
    const file$5 = "src\\App.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let canvas;
    	let current;
    	let mounted;
    	let dispose;
    	canvas = new Canvas({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(canvas.$$.fragment);
    			add_location(main, file$5, 3, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(canvas, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(main, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[0]), false, true, false),
    					listen_dev(main, "drag", prevent_default(/*drag_handler*/ ctx[1]), false, true, false),
    					listen_dev(main, "dragstart", prevent_default(/*dragstart_handler*/ ctx[2]), false, true, false),
    					listen_dev(main, "dragenter", prevent_default(/*dragenter_handler*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(canvas);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function contextmenu_handler(event) {
    		bubble($$self, event);
    	}

    	function drag_handler(event) {
    		bubble($$self, event);
    	}

    	function dragstart_handler(event) {
    		bubble($$self, event);
    	}

    	function dragenter_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$capture_state = () => ({ Canvas });
    	return [contextmenu_handler, drag_handler, dragstart_handler, dragenter_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
