(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/zone.js/dist/zone.js":
/*!*******************************************!*\
  !*** ./node_modules/zone.js/dist/zone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    var checkDuplicate = global[('__zone_symbol__forceDuplicateZoneCheck')] === true;
    if (global['Zone']) {
        // if global['Zone'] already exists (maybe zone.js was already loaded or
        // some other lib also registered a global object named Zone), we may need
        // to throw an error, but sometimes user may not want this error.
        // For example,
        // we have two web pages, page1 includes zone.js, page2 doesn't.
        // and the 1st time user load page1 and page2, everything work fine,
        // but when user load page2 again, error occurs because global['Zone'] already exists.
        // so we add a flag to let user choose whether to throw this error or not.
        // By default, if existing Zone is from zone.js, we will not throw the error.
        if (checkDuplicate || typeof global['Zone'].__symbol__ !== 'function') {
            throw new Error('Zone already loaded.');
        }
        else {
            return global['Zone'];
        }
    }
    var Zone = /** @class */ (function () {
        function Zone(parent, zoneSpec) {
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                if (checkDuplicate) {
                    throw Error('Already loaded patch: ' + name);
                }
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== 'function') {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = undefined;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this.name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, undefined));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        Zone.__symbol__ = __symbol__;
        return Zone;
    }());
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) { return delegate.hasTask(target, hasTaskState); },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) {
            return delegate.invokeTask(target, task, applyThis, applyArgs);
        },
        onCancelTask: function (delegate, _, target, task) { return delegate.cancelTask(target, task); }
    };
    var ZoneDelegate = /** @class */ (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt = zoneSpec &&
                (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = /** @class */ (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            // TODO: @JiaLiPassion options should have interface
            if (type === eventTask && options && options.useG) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.call(global, self, this, arguments);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ? ' or \'' + fromState2 + '\'' : '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId.toString();
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                var nativeThen = nativeMicroTaskQueuePromise[symbolThen];
                if (!nativeThen) {
                    // native Promise is not patchable, we need to use `then` directly
                    // issue 1078
                    nativeThen = nativeMicroTaskQueuePromise['then'];
                }
                nativeThen.call(nativeMicroTaskQueuePromise, drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        bindArguments: function () { return []; },
        patchThen: function () { return noop; },
        setNativePromise: function (NativePromise) {
            // sometimes NativePromise.resolve static function
            // is not ready yet, (such as core-js/es6.promise)
            // so we need to check here.
            if (NativePromise && typeof NativePromise.resolve === 'function') {
                nativeMicroTaskQueuePromise = NativePromise.resolve(0);
            }
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ?
                    [] :
                    [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var e_1, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise =  false || resolve(value));
            }
            function onReject(error) {
                promise && (promise =  false || reject(error));
            }
            try {
                for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                    var value = values_1_1.value;
                    if (!isThenable(value)) {
                        value = this.resolve(value);
                    }
                    value.then(onResolve, onReject);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var e_2, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            // Start at 2 to prevent prematurely resolving if .then is called immediately.
            var unresolvedCount = 2;
            var valueIndex = 0;
            var resolvedValues = [];
            var _loop_2 = function (value) {
                if (!isThenable(value)) {
                    value = this_1.resolve(value);
                }
                var curValueIndex = valueIndex;
                value.then(function (value) {
                    resolvedValues[curValueIndex] = value;
                    unresolvedCount--;
                    if (unresolvedCount === 0) {
                        resolve(resolvedValues);
                    }
                }, reject);
                unresolvedCount++;
                valueIndex++;
            };
            var this_1 = this;
            try {
                for (var values_2 = __values(values), values_2_1 = values_2.next(); !values_2_1.done; values_2_1 = values_2.next()) {
                    var value = values_2_1.value;
                    _loop_2(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (values_2_1 && !values_2_1.done && (_a = values_2.return)) _a.call(values_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Make the unresolvedCount zero-based again.
            unresolvedCount -= 2;
            if (unresolvedCount === 0) {
                resolve(resolvedValues);
            }
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    if (NativePromise) {
        patchThen(NativePromise);
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('fetch', function (global, Zone, api) {
    var fetch = global['fetch'];
    var ZoneAwarePromise = global.Promise;
    var symbolThenPatched = api.symbol('thenPatched');
    var fetchTaskScheduling = api.symbol('fetchTaskScheduling');
    var fetchTaskAborting = api.symbol('fetchTaskAborting');
    if (typeof fetch !== 'function') {
        return;
    }
    var OriginalAbortController = global['AbortController'];
    var supportAbort = typeof OriginalAbortController === 'function';
    var abortNative = null;
    if (supportAbort) {
        global['AbortController'] = function () {
            var abortController = new OriginalAbortController();
            var signal = abortController.signal;
            signal.abortController = abortController;
            return abortController;
        };
        abortNative = api.patchMethod(OriginalAbortController.prototype, 'abort', function (delegate) { return function (self, args) {
            if (self.task) {
                return self.task.zone.cancelTask(self.task);
            }
            return delegate.apply(self, args);
        }; });
    }
    var placeholder = function () { };
    global['fetch'] = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var options = args.length > 1 ? args[1] : null;
        var signal = options && options.signal;
        return new Promise(function (res, rej) {
            var task = Zone.current.scheduleMacroTask('fetch', placeholder, args, function () {
                var fetchPromise;
                var zone = Zone.current;
                try {
                    zone[fetchTaskScheduling] = true;
                    fetchPromise = fetch.apply(_this, args);
                }
                catch (error) {
                    rej(error);
                    return;
                }
                finally {
                    zone[fetchTaskScheduling] = false;
                }
                if (!(fetchPromise instanceof ZoneAwarePromise)) {
                    var ctor = fetchPromise.constructor;
                    if (!ctor[symbolThenPatched]) {
                        api.patchThen(ctor);
                    }
                }
                fetchPromise.then(function (resource) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    res(resource);
                }, function (error) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    rej(error);
                });
            }, function () {
                if (!supportAbort) {
                    rej('No AbortController supported, can not cancel fetch');
                    return;
                }
                if (signal && signal.abortController && !signal.aborted &&
                    typeof signal.abortController.abort === 'function' && abortNative) {
                    try {
                        Zone.current[fetchTaskAborting] = true;
                        abortNative.call(signal.abortController);
                    }
                    finally {
                        Zone.current[fetchTaskAborting] = false;
                    }
                }
                else {
                    rej('cancel fetch need a AbortController.signal');
                }
            });
            if (signal && signal.abortController) {
                signal.abortController.task = task;
            }
        });
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
var ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
var ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
var ObjectCreate = Object.create;
/** Array.prototype.slice */
var ArraySlice = Array.prototype.slice;
/** addEventListener string const */
var ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
var TRUE_STR = 'true';
/** false string const */
var FALSE_STR = 'false';
/** __zone_symbol__ string const */
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== 'undefined';
var internalWindow = isWindowExists ? window : undefined;
var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
var REMOVE_ATTRIBUTE = 'removeAttribute';
var NULL_ON_PROP_VALUE = [null];
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result;
    if (isBrowser && target === internalWindow && event.type === 'error') {
        // window.onerror have different signiture
        // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#window.onerror
        // and onerror callback will prevent default when callback return true
        var errorEvent = event;
        result = listener &&
            listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
        if (result === true) {
            event.preventDefault();
        }
    }
    else {
        result = listener && listener.apply(this, arguments);
        if (result != undefined && !result) {
            event.preventDefault();
        }
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    var onPropPatchedSymbol = zoneSymbol('on' + prop + 'patched');
    if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    var originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
    obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function copySymbolProperties(src, dest) {
    if (typeof Object.getOwnPropertySymbols !== 'function') {
        return;
    }
    var symbols = Object.getOwnPropertySymbols(src);
    symbols.forEach(function (symbol) {
        var desc = Object.getOwnPropertyDescriptor(src, symbol);
        Object.defineProperty(dest, symbol, {
            get: function () {
                return src[symbol];
            },
            set: function (value) {
                if (desc && (!desc.writable || typeof desc.set !== 'function')) {
                    // if src[symbol] is not writable or not have a setter, just return
                    return;
                }
                src[symbol] = value;
            },
            enumerable: desc ? desc.enumerable : true,
            configurable: desc ? desc.configurable : true
        });
    });
}
var shouldCopySymbolProperties = false;

function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate = null;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
            if (shouldCopySymbolProperties) {
                copySymbolProperties(delegate, proto[name]);
            }
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1) {
            return true;
        }
    }
    catch (error) {
    }
    return false;
}
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
            }
        });
        window.addEventListener('test', options, options);
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        var eventNameToString = patchOptions && patchOptions.eventNameToString;
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        function checkIsPassive(task) {
            if (!passiveSupported && typeof taskData.options !== 'boolean' &&
                typeof taskData.options !== 'undefined' && taskData.options !== null) {
                // options is a non-null non-undefined object
                // passive is not supported
                // don't pass options as object
                // just pass capture as a boolean
                task.options = !!taskData.options.capture;
                taskData.options = task.options;
            }
        }
        var customScheduleGlobal = function (task) {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var eventName = arguments[0];
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                if (isNode && eventName === 'uncaughtException') {
                    // don't patch uncaughtException of nodejs to prevent endless loop
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
                    var trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource +
                        (eventNameToString ? eventNameToString(eventName) : eventName);
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : undefined;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                if (!(!passiveSupported && typeof task.options === 'boolean')) {
                    // if not support passive, and we pass an option object
                    // to addEventListener, we should save the options to task
                    task.options = options;
                }
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 :
                        undefined,
                    args: args
                };
                var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (desc && isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties || ignoreProperties.length === 0) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global['__Zone_ignore_on_properties'];
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow = window;
            var ignoreErrorProperties = isIE ? [{ target: internalWindow, ignoreProperties: ['error'] }] : [];
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget_1 = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget_1) {
            patchFilteredProperties(XMLHttpRequestEventTarget_1 && XMLHttpRequestEventTarget_1.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function patchCallbacks(target, targetName, method, callbacks) {
    var symbol = Zone.__symbol__(method);
    if (target[symbol]) {
        return;
    }
    var nativeDelegate = target[symbol] = target[method];
    target[method] = function (name, opts, options) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = targetName + "." + method + "::" + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else if (prototype[callback]) {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    attachOriginToPatched(target[method], nativeDelegate);
}
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    patchCallbacks(document, 'Document', 'registerElement', callbacks);
}
function patchCustomElements(_global) {
    if ((!isBrowser && !isMix) || !('customElements' in _global)) {
        return;
    }
    var callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
    patchCallbacks(_global.customElements, 'customElements', 'define', callbacks);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
});
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    // load blackListEvents from global
    var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
    if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
    }
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
});
Zone.__load_patch('customElements', function (global, Zone, api) {
    registerElementPatch(global);
    patchCustomElements(global);
});
Zone.__load_patch('canvas', function (global) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, cbIdx: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone) {
    // Treat XMLHttpRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    var XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol('xhrErrorBeforeScheduled');
    function patchXHR(window) {
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        function findPendingTask(target) {
            return target[XHR_TASK];
        }
        var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget_1 = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget_1) {
                var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget_1.prototype;
                oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            var data = task.data;
            var target = data.target;
            target[XHR_SCHEDULED] = false;
            target[XHR_ERROR_BEFORE_SCHEDULED] = false;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
            if (listener) {
                oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        // check whether the xhr has registered onload listener
                        // if that is the case, the task should invoke after all
                        // onload listeners finish.
                        var loadTasks = target['__zone_symbol__loadfalse'];
                        if (loadTasks && loadTasks.length > 0) {
                            var oriInvoke_1 = task.invoke;
                            task.invoke = function () {
                                // need to load the tasks again, because in other
                                // load listener, they may remove themselves
                                var loadTasks = target['__zone_symbol__loadfalse'];
                                for (var i = 0; i < loadTasks.length; i++) {
                                    if (loadTasks[i] === task) {
                                        loadTasks.splice(i, 1);
                                    }
                                }
                                if (!data.aborted && task.state === SCHEDULED) {
                                    oriInvoke_1.call(task);
                                }
                            };
                            loadTasks.push(task);
                        }
                        else {
                            task.invoke();
                        }
                    }
                    else if (!data.aborted && target[XHR_SCHEDULED] === false) {
                        // error occurs when xhr.send()
                        target[XHR_ERROR_BEFORE_SCHEDULED] = true;
                    }
                }
            };
            oriAddListener.call(target, READY_STATE_CHANGE, newListener);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            target[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var fetchTaskAborting = zoneSymbol('fetchTaskAborting');
        var fetchTaskScheduling = zoneSymbol('fetchTaskScheduling');
        var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
            if (Zone.current[fetchTaskScheduling] === true) {
                // a fetch is scheduling, so we are using xhr to polyfill fetch
                // and because we already schedule macroTask for fetch, we should
                // not schedule a macroTask for xhr again
                return sendNative.apply(self, args);
            }
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = { target: self, url: self[XHR_URL], isPeriodic: false, args: args, aborted: false };
                var task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
                if (self && self[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted &&
                    task.state === SCHEDULED) {
                    // xhr request throw error when send
                    // we should invoke task instead of leaving a scheduled
                    // pending macroTask
                    task.invoke();
                }
            }
        }; });
        var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self, args) {
            var task = findPendingTask(self);
            if (task && typeof task.type == 'string') {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            else if (Zone.current[fetchTaskAborting] === true) {
                // the abort is called from fetch polyfill, we need to call native abort of XHR.
                return abortNative.apply(self, args);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/dashboard/dashboard.component */ "./src/app/components/dashboard/dashboard.component.ts");
/* harmony import */ var _components_annotation_view_annotation_view_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/annotation-view/annotation-view.component */ "./src/app/components/annotation-view/annotation-view.component.ts");
/* harmony import */ var _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/annotate/annotate.component */ "./src/app/components/annotate/annotate.component.ts");
/* harmony import */ var _components_create_class_create_class_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/create-class/create-class.component */ "./src/app/components/create-class/create-class.component.ts");
/* harmony import */ var _components_classroom_classroom_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/classroom/classroom.component */ "./src/app/components/classroom/classroom.component.ts");
/* harmony import */ var _components_activity_activity_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/activity/activity.component */ "./src/app/components/activity/activity.component.ts");
/* harmony import */ var _components_group_group_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/group/group.component */ "./src/app/components/group/group.component.ts");
/* harmony import */ var _guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./guards/auth.guards */ "./src/app/guards/auth.guards.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var routes = [
    { path: '', component: _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__["DashboardComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] },
    { path: 'login', component: _components_login_login_component__WEBPACK_IMPORTED_MODULE_2__["LoginComponent"] },
    { path: 'dashboard', component: _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__["DashboardComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] },
    { path: 'view/annotations/:email/:activityname/:taskname', component: _components_annotation_view_annotation_view_component__WEBPACK_IMPORTED_MODULE_4__["AnnotationViewComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] },
    { path: 'annotate/:activitytype/:activityname/:title', component: _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_5__["AnnotateComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] },
    { path: 'createclass', component: _components_create_class_create_class_component__WEBPACK_IMPORTED_MODULE_6__["CreateClassComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] },
    { path: 'classroom/:classname', component: _components_classroom_classroom_component__WEBPACK_IMPORTED_MODULE_7__["ClassroomComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] },
    { path: 'activity/:activityname', component: _components_activity_activity_component__WEBPACK_IMPORTED_MODULE_8__["ActivityComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] },
    { path: 'group/:activityname', component: _components_group_group_component__WEBPACK_IMPORTED_MODULE_9__["GroupComponent"], canActivate: [_guards_auth_guards__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"]] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, { onSameUrlNavigation: 'reload' })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-navbar>\t\r\n</app-navbar>\r\n<div>\r\n  \t<router-outlet>\r\n  \t\t<flash-messages></flash-messages>\r\n  \t</router-outlet>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'angular-src';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _components_navbar_navbar_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/navbar/navbar.component */ "./src/app/components/navbar/navbar.component.ts");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/dashboard/dashboard.component */ "./src/app/components/dashboard/dashboard.component.ts");
/* harmony import */ var _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/annotate/annotate.component */ "./src/app/components/annotate/annotate.component.ts");
/* harmony import */ var _components_create_class_create_class_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/create-class/create-class.component */ "./src/app/components/create-class/create-class.component.ts");
/* harmony import */ var _components_classroom_classroom_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/classroom/classroom.component */ "./src/app/components/classroom/classroom.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_validate_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./services/validate.service */ "./src/app/services/validate.service.ts");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! angular2-flash-messages */ "./node_modules/angular2-flash-messages/module/index.js");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(angular2_flash_messages__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_class_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./services/class.service */ "./src/app/services/class.service.ts");
/* harmony import */ var _services_task_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./services/task.service */ "./src/app/services/task.service.ts");
/* harmony import */ var _services_navbar_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./services/navbar.service */ "./src/app/services/navbar.service.ts");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _guards_auth_guards__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./guards/auth.guards */ "./src/app/guards/auth.guards.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material_tree__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/tree */ "./node_modules/@angular/material/esm5/tree.es5.js");
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/radio */ "./node_modules/@angular/material/esm5/radio.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _angular_material_stepper__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/stepper */ "./node_modules/@angular/material/esm5/stepper.es5.js");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/esm5/checkbox.es5.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm5/ngx-bootstrap-modal.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var ngx_file_drop__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ngx-file-drop */ "./node_modules/ngx-file-drop/fesm5/ngx-file-drop.js");
/* harmony import */ var ngx_flip__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ngx-flip */ "./node_modules/ngx-flip/fesm5/ngx-flip.js");
/* harmony import */ var ngx_bootstrap_popover__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ngx-bootstrap/popover */ "./node_modules/ngx-bootstrap/popover/fesm5/ngx-bootstrap-popover.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/esm5/tabs.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_36___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_36__);
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var _components_activity_activity_component__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./components/activity/activity.component */ "./src/app/components/activity/activity.component.ts");
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @angular/material/menu */ "./node_modules/@angular/material/esm5/menu.es5.js");
/* harmony import */ var ngx_editor__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ngx-editor */ "./node_modules/ngx-editor/fesm5/ngx-editor.js");
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! @angular/material/table */ "./node_modules/@angular/material/esm5/table.es5.js");
/* harmony import */ var _components_group_group_component__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./components/group/group.component */ "./src/app/components/group/group.component.ts");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var angular2_lightbox__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! angular2-lightbox */ "./node_modules/angular2-lightbox/index.js");
/* harmony import */ var angular2_lightbox__WEBPACK_IMPORTED_MODULE_44___default = /*#__PURE__*/__webpack_require__.n(angular2_lightbox__WEBPACK_IMPORTED_MODULE_44__);
/* harmony import */ var _components_annotation_view_annotation_view_component__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./components/annotation-view/annotation-view.component */ "./src/app/components/annotation-view/annotation-view.component.ts");
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! @angular/material/badge */ "./node_modules/@angular/material/esm5/badge.es5.js");
/* harmony import */ var _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! @angular/cdk/scrolling */ "./node_modules/@angular/cdk/esm5/scrolling.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


















































window['$'] = window['jQuery'] = jquery__WEBPACK_IMPORTED_MODULE_36__;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _components_navbar_navbar_component__WEBPACK_IMPORTED_MODULE_4__["NavbarComponent"],
                _components_login_login_component__WEBPACK_IMPORTED_MODULE_5__["LoginComponent"],
                _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__["DashboardComponent"],
                _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__["AnnotateComponent"],
                _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__["AnnotateTaskDialogComponent"],
                _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__["AnnotateConfirmDialogComponent"],
                _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__["AnnotateSubmittedDialogComponent"],
                _components_group_group_component__WEBPACK_IMPORTED_MODULE_42__["GroupImagePreviewComponent"],
                _components_create_class_create_class_component__WEBPACK_IMPORTED_MODULE_8__["CreateClassComponent"],
                _components_classroom_classroom_component__WEBPACK_IMPORTED_MODULE_9__["ClassroomComponent"],
                _components_activity_activity_component__WEBPACK_IMPORTED_MODULE_38__["ActivityComponent"],
                _components_activity_activity_component__WEBPACK_IMPORTED_MODULE_38__["ImagePreviewComponent"],
                _components_group_group_component__WEBPACK_IMPORTED_MODULE_42__["GroupComponent"],
                _components_annotation_view_annotation_view_component__WEBPACK_IMPORTED_MODULE_45__["AnnotationViewComponent"],
                _components_annotation_view_annotation_view_component__WEBPACK_IMPORTED_MODULE_45__["ViewTaskDialogComponent"],
                _components_group_group_component__WEBPACK_IMPORTED_MODULE_42__["ImageHelpDialogComponent"],
                _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__["HelpDialogComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_10__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ReactiveFormsModule"],
                angular2_flash_messages__WEBPACK_IMPORTED_MODULE_12__["FlashMessagesModule"].forRoot(),
                _angular_http__WEBPACK_IMPORTED_MODULE_17__["HttpModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_18__["HttpClientModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatExpansionModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_21__["BrowserAnimationsModule"],
                _angular_material_tree__WEBPACK_IMPORTED_MODULE_22__["MatTreeModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_27__["NgbModule"].forRoot(),
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDialogModule"],
                _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_37__["LayoutModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatListModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_29__["ModalModule"].forRoot(),
                ngx_file_drop__WEBPACK_IMPORTED_MODULE_30__["FileDropModule"],
                ngx_bootstrap_popover__WEBPACK_IMPORTED_MODULE_32__["PopoverModule"].forRoot(),
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatGridListModule"],
                _angular_material_radio__WEBPACK_IMPORTED_MODULE_23__["MatRadioModule"],
                _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_26__["MatCheckboxModule"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_24__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatInputModule"],
                _angular_material_stepper__WEBPACK_IMPORTED_MODULE_25__["MatStepperModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_33__["FlexLayoutModule"],
                _angular_material_tabs__WEBPACK_IMPORTED_MODULE_34__["MatTabsModule"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_35__["MatCardModule"],
                _angular_material_menu__WEBPACK_IMPORTED_MODULE_39__["MatMenuModule"],
                ngx_editor__WEBPACK_IMPORTED_MODULE_40__["NgxEditorModule"],
                _angular_material_table__WEBPACK_IMPORTED_MODULE_41__["MatTableModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_43__["MatTooltipModule"],
                angular2_lightbox__WEBPACK_IMPORTED_MODULE_44__["LightboxModule"],
                ngx_flip__WEBPACK_IMPORTED_MODULE_31__["FlipModule"],
                _angular_material_badge__WEBPACK_IMPORTED_MODULE_46__["MatBadgeModule"],
                _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_47__["ScrollDispatchModule"]
            ],
            entryComponents: [
                _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__["AnnotateTaskDialogComponent"],
                _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__["AnnotateConfirmDialogComponent"],
                _components_annotate_annotate_component__WEBPACK_IMPORTED_MODULE_7__["AnnotateSubmittedDialogComponent"],
                _components_activity_activity_component__WEBPACK_IMPORTED_MODULE_38__["ImagePreviewComponent"],
                _components_group_group_component__WEBPACK_IMPORTED_MODULE_42__["GroupImagePreviewComponent"],
                _components_annotation_view_annotation_view_component__WEBPACK_IMPORTED_MODULE_45__["ViewTaskDialogComponent"],
                _components_group_group_component__WEBPACK_IMPORTED_MODULE_42__["ImageHelpDialogComponent"],
                _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__["HelpDialogComponent"]
            ],
            providers: [
                _services_validate_service__WEBPACK_IMPORTED_MODULE_11__["ValidateService"],
                _services_auth_service__WEBPACK_IMPORTED_MODULE_13__["AuthService"],
                _services_class_service__WEBPACK_IMPORTED_MODULE_14__["ClassService"],
                _guards_auth_guards__WEBPACK_IMPORTED_MODULE_19__["AuthGuard"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_28__["BsModalService"],
                _services_task_service__WEBPACK_IMPORTED_MODULE_15__["TaskService"],
                _services_navbar_service__WEBPACK_IMPORTED_MODULE_16__["NavbarService"]
            ],
            schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["CUSTOM_ELEMENTS_SCHEMA"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/components/activity/activity.component.css":
/*!************************************************************!*\
  !*** ./src/app/components/activity/activity.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWN0aXZpdHkvYWN0aXZpdHkuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/components/activity/activity.component.html":
/*!*************************************************************!*\
  !*** ./src/app/components/activity/activity.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\r\n\r\n#flipCard{\r\n    height: 310px;\r\n    width: 500px;\r\n    margin-right: auto;\r\n    margin-left: auto;\r\n    margin-bottom: 20px;\r\n    overflow-x: hidden;\r\n    overflow-y: hidden;\r\n    margin-top: 10px;\r\n}\r\n#flipCardButtons .btn{\r\n  display: block;\r\n  width: 160px;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n#flipCardButtons{\r\n  position: absolute;\r\n  width: 100%;\r\n  bottom: 0;\r\n}\r\n.wrapper {\r\n   position: relative;\r\n}\r\n\r\n.wrapper .glyphicon {\r\n   position: absolute;\r\n   top: 20px;\r\n   left: 20px;\r\n}\r\ni:hover{\r\n  cursor: pointer;\r\n}\r\n\r\n.img-thumbnail , img :hover{\r\n  cursor: pointer;\r\n}\r\n.sidenav {\r\n  height: auto;\r\n  position: absolute;\r\n  z-index: 999;\r\n  top: 5;\r\n  right: 0;\r\n  background-color: white;\r\n  overflow-x: hidden;\r\n  padding-left: 30px;\r\n  border-style: inset;\r\n  margin: 20px;\r\n}\r\n.sidenav a {\r\n  padding: 6px 8px 6px 16px;\r\n  text-decoration: none;\r\n  font-size: 25px;\r\n  color: white;\r\n  display: block;\r\n}\r\n\r\n.sidenav a:hover {\r\n  color: grey;\r\n}\r\n\r\n.main {\r\n  margin: 20px;\r\n   /* Increased text to enable scrolling */\r\n  left: 0;\r\n  border-style: outset;\r\n  height: 100%;\r\n}\r\n#main{\r\n      position: absolute;\r\n    width: 60%;\r\n    height: auto;\r\n}\r\n\r\n\r\n@media screen and (max-height: 450px) {\r\n  .sidenav {padding-top: 15px;}\r\n  .sidenav a {font-size: 18px;}\r\n}\r\nbody{\r\n  font-size: 18px;\r\n  background-color: rgb(245,245,245)!important;\r\n}\r\n.mat-card {\r\n  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\r\n  transition: 0.3s;\r\n  width: 40%;\r\n  border-radius: 5px;\r\n  border-style: ridge;\r\n}\r\n\r\n.mat-card:hover {\r\n  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\r\n}\r\n\r\nimg {\r\n  border-radius: 5px 5px 0 0;\r\n  margin-left: 15%;\r\n}\r\n#sideListItem {\r\n    display: block;\r\n    height: auto;\r\n    min-height: 50px;\r\n    -webkit-tap-highlight-color: transparent;\r\n    width: 100%;\r\n    padding: 0;\r\n    border-bottom-width: 2px;\r\n    border-bottom-style: solid;\r\n    border-bottom-color: gainsboro;\r\n}\r\n</style>\r\n\r\n<body>\r\n\r\n<mat-card style=\"width: 35%; padding-left: 5px;\" id=\"side\" class=\"sidenav\">\r\n  <div>\r\n    <h4>Tasks\r\n      <div *ngIf=\"!teacher\" style=\"float: right;\">Completed: {{submissionArray.length}}/{{activity?.tasks.length}}</div>\r\n    </h4>\r\n</div>\r\n<mat-divider></mat-divider>\r\n  <mat-list role=\"list\" style=\"text-transform: capitalize; height: 100%; padding-top: 0;\">\r\n  <mat-list-item *ngFor=\"let task of activity?.tasks; let i = index;\" id=\"sideListItem\" style=\"padding-top: 6%;\" role=\"listitem\">\r\n    <div style=\"width: 100%;\">\r\n    {{task.task_name}}\r\n  </div>\r\n  <div *ngIf=\"!teacher\">\r\n    <i *ngIf=\"!checkSubmitted(task.task_name)\" class=\"glyphicon glyphicon-unchecked\"></i>\r\n    <i *ngIf=\"checkSubmitted(task.task_name)\" class=\"glyphicon glyphicon-check\" style=\"color: limegreen;\"></i>\r\n  </div>\r\n  </mat-list-item>\r\n</mat-list>\r\n</mat-card>\r\n\r\n\r\n  <mat-card  class=\"main\" id=\"main\">\r\n  <mat-tab-group (selectedTabChange)=\"tabChange($event)\">\r\n    <mat-tab *ngFor=\"let task of activity?.tasks; let i = index;\" label=\"{{task.task_name}}\">\r\n     <!--  <div style=\"float: right;\">Annotations Submitted: {{taskCompletedCount}}</div> -->\r\n      <br>\r\n\r\n      \r\n        <div class=\"card-body\" *ngIf=\"task.task_type == 'image'\">\r\n      <ngx-flip id=\"flipCard\" [flip]=\"flipDiv\">\r\n         <div class=\"wrapper\" front style=\"height: 310px; background-color: white; border-style: ridge; text-align: center;\">\r\n            <img style=\"width: 500px; height: 300px; margin-left: 0;\" src=\"/api/image/{{dynamicURL}}\" (click)=\"openPreviewDialog()\" class=\"img-thumbnail\">\r\n            <i matTooltip=\"Flip\" (click)=\"flipDivFunc()\" style=\"font-size: 25px; font-weight: bolder;\" class=\"glyphicon glyphicon-refresh\"></i>\r\n          </div>\r\n         <div class=\"wrapper\" style=\"height: 300px; background-color: whitesmoke; border-style: ridge; text-align: center;\" back>\r\n          <div id=\"taskInfoDiv\" style=\"text-align: left; font-size: 18px; margin-bottom: 10%;\">\r\n            <h3 style=\"margin-left: 5px;\">{{task.task_name}}</h3>\r\n            <mat-divider></mat-divider>\r\n          </div>\r\n          <div>\r\n            <blockquote style=\"margin-left: 10px; text-align: center; font-size: 28px;\"><i>{{task.task_desc}}</i></blockquote>\r\n          </div>\r\n        <div id=\"flipCardButtons\" >\r\n          <a class=\"btn btn-primary\" *ngIf=\"checkSubmitted(task.task_name) &&!teacher\" href=\"/view/annotations/{{email}}/{{activityname}}/{{task.task_name}}\">View Submission</a>\r\n        <a href=\"/annotate/{{activity.activityType}}/{{activityname}}/{{task.task_name}}\" class=\"btn btn-primary\" *ngIf=\"!checkSubmitted(task.task_name) && !teacher\">Annotate</a>\r\n        <div *ngIf=\"teacher\">\r\n        <button class=\"btn btn-primary\" [matMenuTriggerFor]=\"menu\">View Submissions</button>\r\n    <mat-menu #menu=\"matMenu\">\r\n      <div *ngIf=\"classSubmissionArray.length > 0\">\r\n      <a *ngFor=\"let submission of classSubmissionArray\" href=\"view/annotations/{{submission.email}}/{{activityname}}/{{task.task_name}}\" mat-menu-item>{{submission.name.first}} {{submission.name.last}}</a>\r\n    </div>\r\n    <p style=\"font-size: 20px; text-align: center;\" *ngIf=\"classSubmissionArray.length == 0\">No submissions have been made yet!</p>\r\n    </mat-menu>\r\n  </div>\r\n\r\n        <button class=\"btn btn-danger\" (click)=\"flipDivFunc()\">Back</button>\r\n        </div>\r\n      </div>\r\n       </ngx-flip>\r\n\r\n</div>\r\n\r\n  <div class=\"card\" *ngIf=\"task.task_type == 'text'\" style=\"border-style: none;\">\r\n  <div class=\"card-body\">\r\n    <blockquote class=\"blockquote mb-0\">\r\n      <p><i [innerHTML]=\"task.task_desc\"></i></p>\r\n    </blockquote>\r\n  </div>\r\n<div *ngIf=\"!checkSubmitted(task.task_name) && !teacher\" style=\"margin-top: 15%;\" >\r\n     <app-ngx-editor [config]=\"editorConfig\" height=\"100px\" minHeight=\"100px\" [placeholder]=\"placeholder\" [spellcheck]=\"true\" [(ngModel)]=\"htmlContent\" name=\"htmlContent\"></app-ngx-editor>\r\n     <div>\r\n   <button *ngIf=\"htmlContent\" type=\"button\" class=\"btn btn-primary\" style=\"float: right;\" (click)=\"onAnswerSubmit(task.task_name,htmlContent)\">Submit</button>\r\n   <button *ngIf=\"!htmlContent\" type=\"button\" class=\"btn btn-primary\" style=\"float: right;\" (click)=\"empty()\">Submit</button>\r\n   <button type=\"button\" class=\"btn btn-warning\" style=\"float: right;\" (click)=\"clear()\">Clear</button>\r\n  </div>\r\n   </div>\r\n   <div *ngIf=\"checkSubmitted(task.task_name) && !teacher\">\r\n    <blockquote class=\"blockquote mb-0\">\r\n      <p [innerHTML]=\"dynamicContent\"></p>\r\n    </blockquote>\r\n    <div style=\"text-align: center;\">\r\n     <p>You have already submitted this task</p>\r\n     <a type=\"button\" [routerLink]=\"['/classroom/',module]\" *ngIf=\"checkAllAns()\" class=\"btn btn primary\">Back to Classroom</a>\r\n   </div> \r\n </div>\r\n\r\n <div *ngIf=\"teacher\">\r\n    <blockquote class=\"blockquote mb-0\">\r\n      <p [innerHTML]=\"dynamicStudentSubmission\"></p>\r\n    </blockquote>\r\n </div>\r\n\r\n <div style=\"width: 100%; text-align: center;\">\r\n <button class=\"btn btn-primary\" [matMenuTriggerFor]=\"menu\" *ngIf=\"teacher\">View Submissions</button>\r\n    <mat-menu #menu=\"matMenu\">\r\n      <div *ngIf=\"classSubmissionArray.length > 0\">\r\n      <div *ngFor=\"let submission of classSubmissionArray\">\r\n      <button (click)=\"showStudentSubmission(submission.content)\" mat-menu-item *ngIf=\"submission.taskTitle == task.task_name\">{{submission.name.first}} {{submission.name.last}}</button>\r\n    </div>\r\n    </div>\r\n    <p style=\"font-size: 20px; text-align: center;\" *ngIf=\"classSubmissionArray.length == 0\">No submissions have been made yet!</p>\r\n    </mat-menu>\r\n  </div>\r\n</div>\r\n\r\n    </mat-tab>\r\n</mat-tab-group>\r\n  \r\n</mat-card>\r\n</body>"

/***/ }),

/***/ "./src/app/components/activity/activity.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/activity/activity.component.ts ***!
  \***********************************************************/
/*! exports provided: ActivityComponent, ImagePreviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivityComponent", function() { return ActivityComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImagePreviewComponent", function() { return ImagePreviewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_class_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/class.service */ "./src/app/services/class.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_task_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/task.service */ "./src/app/services/task.service.ts");
/* harmony import */ var _services_activity_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/activity.service */ "./src/app/services/activity.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var rxjs_Rx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/Rx */ "./node_modules/rxjs-compat/_esm5/Rx.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};











var ActivityComponent = /** @class */ (function () {
    function ActivityComponent(dialog, document, activityService, sanitize, route, router, taskService, authService, classService) {
        this.dialog = dialog;
        this.activityService = activityService;
        this.sanitize = sanitize;
        this.route = route;
        this.router = router;
        this.taskService = taskService;
        this.authService = authService;
        this.classService = classService;
        this.flipDiv = false;
        this.checked = false;
        this.teacher = false;
        this.tasks = [];
        this.userComments = [];
        this.answer = false;
        this.answerArray = [];
        this.images = [];
        this.testEmails = ["email1"];
        this.alreadySubmitted = false;
        this.submissionArray = [];
        this.classSubmissionArray = [];
        this.form = new _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormGroup"]({ email: new _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormControl"]() });
    }
    ActivityComponent_1 = ActivityComponent;
    ActivityComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.answer = null;
        this.editorConfig = {
            "editable": true,
            "spellcheck": true,
            "translate": "yes",
            "enableToolbar": true,
            "showToolbar": true,
            "placeholder": "Enter text here...",
            "imageEndPoint": "",
            "toolbar": [
                ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
                ["fontName", "fontSize", "color"],
                ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"]
            ]
        };
        //anno.makeAnnotatable(test);
        this.activityname = this.route.snapshot.paramMap.get('activityname');
        if (this.authService.isTeacher()) {
            this.teacher = true;
        }
        this.activityService.getActivityByTitle(this.activityname).subscribe(function (data) {
            _this.activity = data;
            _this.module = data.module_code;
            console.log(data);
            _this.tasks = _this.activity.tasks;
            _this.classSubmissionArray = data.submissions;
            console.log(_this.classSubmissionArray);
            console.log(_this.activity);
        }, function (err) {
            console.log(err);
        });
        this.taskService.getFilesByActName(this.activityname).subscribe(function (data) {
            _this.images = data;
            console.log(data);
        });
        this.authService.getProfile().subscribe(function (data) {
            console.log(data);
        });
        // suc=>{
        //     console.log("Success!");
        //    this.user = suc.user;
        //    this.email = suc.user.email;
        //    for(var i = 0; i< suc.user.submissions.length; i++){
        //      if(suc.user.submissions[i].activityName == this.activityname){
        //        this.submissionArray[i] = suc.user.submissions[i];
        //      }
        //    }
        //    console.log(this.submissionArray);
        // },
        // err=>{
        //   console.log("Something went wrong!");
        // });
    };
    ActivityComponent.prototype.checkSingleAns = function (index) {
        if (this.tasks[index] == null) {
            return false;
        }
        else if (this.tasks[index].submitted == true)
            return true;
    };
    ActivityComponent.prototype.checkAllAns = function () {
        if (this.tasks.length == this.answerArray.length) {
            return true;
        }
        else {
            return false;
        }
    };
    ActivityComponent.prototype.tabChange = function (event) {
        this.dynamicContent = null;
        this.dynamicStudentSubmission = null;
        // if(this.images[event.index] !=null){
        //   this.dynamicURL = this.images[event.index].originalname;
        // }
        for (var j = 0; j < this.images.length; j++) {
            if (this.images[j].task_title == event.tab.textLabel) {
                this.dynamicURL = this.images[j].originalname;
            }
        }
        for (var i = 0; i < this.submissionArray.length; i++) {
            if (this.submissionArray[i] != null) {
                if (this.submissionArray[i].taskName == event.tab.textLabel) {
                    this.dynamicContent = this.submissionArray[i].content;
                }
            }
        }
        this.clear();
        console.log(event);
        this.index = event.index;
        console.log(this.index);
        if (this.answerArray.length > 0) {
            if (this.answerArray[event.index] != null) {
                this.htmlContent = this.answerArray[event.index].content;
                this.answer = true;
                console.log("ANSWER!!: " + this.answerArray[event.index].content);
            }
            else {
                this.answer = false;
                console.log("no answer yet");
            }
        }
        else {
            this.answer = false;
            console.log("nothing in here");
        }
        //is it an image
        if (this.tasks[event.index].originalname) {
            console.log("YES");
        }
        else {
            console.log("Nah");
        }
    };
    ActivityComponent.prototype.flipDivFunc = function () {
        this.flipDiv = !this.flipDiv;
    };
    ActivityComponent.prototype.clear = function () {
        this.htmlContent = "";
    };
    ActivityComponent.prototype.getTextContent = function (index) {
        if (this.submissionArray[index] != null && this.submissionArray[index].task_type == 'text') {
            return this.submissionArray[index].content;
        }
    };
    ActivityComponent.prototype.onAnswerSubmit = function (title, thisString) {
        this.dynamicContent = thisString;
        this.taskCompletedCount++;
        console.log(this.index);
        this.answer = true;
        this.answerStr = thisString;
        this.statusStr = {
            name: {
                first: this.user.first,
                last: this.user.last,
            },
            taskTitle: title,
            content: thisString,
            email: this.email
        };
        this.userStatusStr = {
            activityName: this.activity.activityName,
            taskName: title,
            submitted: true,
            content: thisString,
            email: this.email
        };
        console.log(this.userStatusStr);
        this.submissionArray[this.index] = this.userStatusStr;
        console.log(this.submissionArray);
        this.activityService.updateSubmissions(this.activity.activityName, this.statusStr).subscribe(function (suc) {
            console.log("Success!");
        }, function (err) {
            console.log("Something went wrong! " + err);
        });
        this.activityService.updateUserSubmission(this.email, this.userStatusStr).subscribe(function (suc) {
            console.log("Success!");
        }, function (err) {
            console.log("Something went wrong!");
        });
        console.log(title);
        console.log(this.statusStr);
        // console.log(this.answerArray);
    };
    ActivityComponent.prototype.showStudentSubmission = function (content) {
        this.dynamicStudentSubmission = content;
    };
    ActivityComponent.prototype.empty = function () {
        alert("You have not typed anything to submit!");
    };
    ActivityComponent.prototype.checkSubmitted = function (taskName) {
        for (var i = 0; i < this.submissionArray.length; i++) {
            if (this.submissionArray[i] != null) {
                if (this.submissionArray[i].submitted == true &&
                    this.submissionArray[i].taskName == taskName &&
                    this.submissionArray[i].activityName == this.activityname) {
                    return true;
                }
            }
        }
        return false;
    };
    ActivityComponent.prototype.openPreviewDialog = function (index) {
        var dialogRef = this.dialog.open(ImagePreviewComponent, {
            data: {
                image: this.dynamicURL
            },
            panelClass: 'custom-dialog-container'
        });
    };
    var ActivityComponent_1;
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(ActivityComponent_1),
        __metadata("design:type", ActivityComponent)
    ], ActivityComponent.prototype, "pollComponent", void 0);
    ActivityComponent = ActivityComponent_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-activity',
            template: __webpack_require__(/*! ./activity.component.html */ "./src/app/components/activity/activity.component.html"),
            styles: [__webpack_require__(/*! ./activity.component.css */ "./src/app/components/activity/activity.component.css")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_common__WEBPACK_IMPORTED_MODULE_8__["DOCUMENT"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_10__["MatDialog"], Object, _services_activity_service__WEBPACK_IMPORTED_MODULE_4__["ActivityService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["DomSanitizer"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
            _services_task_service__WEBPACK_IMPORTED_MODULE_3__["TaskService"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _services_class_service__WEBPACK_IMPORTED_MODULE_1__["ClassService"]])
    ], ActivityComponent);
    return ActivityComponent;
}());

var ImagePreviewComponent = /** @class */ (function () {
    function ImagePreviewComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ImagePreviewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'preview-dialog',
            template: __webpack_require__(/*! ./image-preview-dialog.html */ "./src/app/components/activity/image-preview-dialog.html"),
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_10__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_10__["MatDialogRef"], Object])
    ], ImagePreviewComponent);
    return ImagePreviewComponent;
}());



/***/ }),

/***/ "./src/app/components/activity/image-preview-dialog.html":
/*!***************************************************************!*\
  !*** ./src/app/components/activity/image-preview-dialog.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-divider></mat-divider>\r\n<div *ngIf=\"data\" style=\"text-align: center; height: auto;\" mat-dialog-content>\r\n  <img style=\"width: 700px; height: 450px;\" src=\"/api/image/{{data.image}}\">\r\n</div>\r\n<!-- <div mat-dialog-actions>\r\n  <button mat-button-stroked mat-dialog-close cdkFocusInitial>Ok</button>\r\n</div>\r\n -->\r\n\r\n<style>\r\n\tdiv{\r\n\t\tmax-height: 75vh;\r\n\t\tpadding: 0px 0px 0px 0px;\r\n\t}\r\n\t.mat-dialog-container{\r\n\t\tpadding: 0px;\r\n\t}\r\n</style>"

/***/ }),

/***/ "./src/app/components/annotate/annotate-confirm-dialog.html":
/*!******************************************************************!*\
  !*** ./src/app/components/annotate/annotate-confirm-dialog.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title style=\"margin-bottom: 5px;\">Are you sure?</h1>\r\n<mat-divider></mat-divider>\r\n<div style=\"text-align: center; margin-top: 15px; height: 60%;\" mat-dialog-content>\r\n  <p class=\"lead\">Once you submit this task it cannot be resubmitted</p>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button-stroked cdkFocusInitial [mat-dialog-close]=\"true\" >Submit</button>\r\n  <button mat-button-stroked [mat-dialog-close]=\"false\" cdkFocusInitial>Cancel</button>\r\n</div>"

/***/ }),

/***/ "./src/app/components/annotate/annotate-submitted-dialog.html":
/*!********************************************************************!*\
  !*** ./src/app/components/annotate/annotate-submitted-dialog.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title style=\"margin-bottom: 5px;\">You have submitted this task!</h1>\r\n<mat-divider></mat-divider>\r\n<div style=\"text-align: center; margin-top: 15px; height: 60%;\" mat-dialog-content>\r\n\r\n  <p class=\"lead\">You will now be redirected back to the activity</p>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button-stroked mat-dialog-close cdkFocusInitial>Ok</button>\r\n</div>"

/***/ }),

/***/ "./src/app/components/annotate/annotate-task-dialog.html":
/*!***************************************************************!*\
  !*** ./src/app/components/annotate/annotate-task-dialog.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<h1 mat-dialog-title style=\"margin-bottom: 5px;\">Your Task</h1>\r\n<mat-divider></mat-divider>\r\n<div style=\"text-align: center; margin-top: 15px; height: 60%;\" mat-dialog-content>\r\n\r\n  <div *ngIf=\"data\">\r\n  <p class=\"lead\">{{data.tasks}}</p>\r\n</div>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button-stroked mat-dialog-close cdkFocusInitial>Ok</button>\r\n</div>"

/***/ }),

/***/ "./src/app/components/annotate/annotate.component.css":
/*!************************************************************!*\
  !*** ./src/app/components/annotate/annotate.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n  body {\r\n    font-family: Georgia, Cambria, \"Times New Roman\", Times, serif;\r\n    letter-spacing: 0.01rem;\r\n    font-size: 22px;\r\n    line-height: 1.5;\r\n    text-rendering: optimizeLegibility;\r\n    -webkit-font-smoothing: antialiased;\r\n    height: 100%;\r\n  }\r\n  html{\r\n    height: 100%!important;\r\n  }\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9hbm5vdGF0ZS9hbm5vdGF0ZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7RUFDRTtJQUNFLDhEQUE4RDtJQUM5RCx1QkFBdUI7SUFDdkIsZUFBZTtJQUNmLGdCQUFnQjtJQUNoQixrQ0FBa0M7SUFDbEMsbUNBQW1DO0lBQ25DLFlBQVk7RUFDZDtFQUNBO0lBQ0Usc0JBQXNCO0VBQ3hCIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9hbm5vdGF0ZS9hbm5vdGF0ZS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgYm9keSB7XHJcbiAgICBmb250LWZhbWlseTogR2VvcmdpYSwgQ2FtYnJpYSwgXCJUaW1lcyBOZXcgUm9tYW5cIiwgVGltZXMsIHNlcmlmO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMDFyZW07XHJcbiAgICBmb250LXNpemU6IDIycHg7XHJcbiAgICBsaW5lLWhlaWdodDogMS41O1xyXG4gICAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcclxuICAgIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIH1cclxuICBodG1se1xyXG4gICAgaGVpZ2h0OiAxMDAlIWltcG9ydGFudDtcclxuICB9XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/components/annotate/annotate.component.html":
/*!*************************************************************!*\
  !*** ./src/app/components/annotate/annotate.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<html>\r\n   <body>\r\n <mat-drawer-container style=\"width: 100%; height: 100%;\" class=\"example-container\" autosize [hasBackdrop]=\"true\">\r\n  <mat-drawer style=\"width: 350px; overflow-y: hidden;\" #drawer class=\"example-sidenav\" mode=\"over\">\r\n    <h3 style=\"text-align: center;\">Feedback</h3>\r\n    <div style=\"padding-left: 10px; padding-right: 10px; border-style: ridge;\">\r\n      <p style=\"text-transform: capitalize;\">Student: {{studentString}}</p>\r\n  <p>Annotation: {{annoText}}</p>\r\n</div>\r\n<div *ngIf=\"!isFeedbackSubmitted\">\r\n  <app-ngx-editor [config]=\"editorConfig\" height=\"350px\" minHeight=\"100px\" [placeholder]=\"placeholder\" [spellcheck]=\"true\" [(ngModel)]=\"htmlContent\" name=\"htmlContent\"></app-ngx-editor>\r\n  <button *ngIf=\"htmlContent\" type=\"button\" class=\"btn btn-primary\" style=\"float: right;\" (click)=\"submitFeedback(htmlContent)\">Submit</button>\r\n   <button *ngIf=\"!htmlContent\" type=\"button\" class=\"btn btn-primary\" style=\"float: right;\" (click)=\"empty()\">Submit</button>\r\n   <button type=\"button\" class=\"btn btn-warning\" style=\"float: right;\" (click)=\"clear()\">Clear</button>\r\n </div>\r\n   <div *ngIf=\"isFeedbackSubmitted\" style=\"padding-right: 10px; padding-left: 10px;\">\r\n  <p style=\"text-transform: capitalize;\">{{user?.name.first}} {{user?.name.last}} says:</p>\r\n  <p>{{dynamicFeedbackStr}}</p>\r\n</div>\r\n  </mat-drawer> \r\n\r\n\r\n  <mat-drawer-content id=\"drawerContent\">\r\n   <div style=\"margin-top: 2%;\">\r\n  <div id=\"imageContainer\" style=\"text-align: center;\">\r\n    <div style=\"float: left;\">\r\n    <button matTooltip=\"Go Back\" (click)=\"backClicked()\" mat-stroked-button><i class=\"glyphicon glyphicon-arrow-left\"></i></button>\r\n    <button matTooltip=\"Lock Annotations\" *ngIf=\"!submitted\" mat-stroked-button (click)=\"lockWidget()\"><i class=\"glyphicon glyphicon-lock\"></i></button>\r\n    <!--  <button style=\"float: right;\" type=\"button\" mat-stroked-button (click)=\"toggleSideNav()\"><i class=\"glyphicon glyphicon-menu-hamburger\"></i></button> -->\r\n     <button matTooltip=\"Make Annotatable\" *ngIf=\"!submitted\" mat-stroked-button (click)=\"showWidget()\"><i class=\"fas fa-unlock\"></i></button>\r\n     <button matTooltip=\"Submit\" *ngIf=\"!submitted\" mat-stroked-button (click)=\"openConfirmDialog()\"><i class=\"glyphicon glyphicon-ok\"></i></button>\r\n     <button matTooltip=\"Task\" mat-stroked-button (click)=\"openTaskDialog()\"><i class=\"glyphicon glyphicon-question-sign\"></i></button>\r\n  </div>\r\n    <img style=\"width: 1000px; height: 600px; border-style: ridge; border-width: 2px;\" id=\"image\" src={{url}} attr.data-original=\"{{dataOriginal}}\" />\r\n  </div>\r\n</div>\r\n</mat-drawer-content>\r\n\r\n</mat-drawer-container>\r\n</body>\r\n  \r\n<style>\r\n#imageDiv{\r\n  width: 60%\r\n}\r\n\r\nbody{\r\n  background-color: rgb(245,245,245)!important;\r\n  height: 100vh;\r\n}\r\nhtml{\r\n  height: 100%;\r\n  overflow-y: hidden;\r\n}\r\n.example-container {\r\n  width: 100%;\r\n    height: 100%;\r\n    overflow-y: hidden;\r\n}\r\n\r\n.example-sidenav {\r\n     overflow-y: hidden;\r\n    padding-bottom: 20px;\r\n}\r\n#mainDiv{\r\n    height: 100%;\r\n    width: 100%;\r\n    padding-top: 20px;\r\n}\r\n.sidenav {\r\n  min-height: 90%;\r\n  width: 25%;\r\n  position: absolute;\r\n  z-index: 999;\r\n  top: 5;\r\n  left: 0;\r\n  background-color: white;\r\n  overflow-x: hidden;\r\n  padding-right: 0px;\r\n  border-style: inset;\r\n  margin: 20px;\r\n}\r\n\r\n@media screen and (max-height: 450px) {\r\n  .sidenav {padding-top: 15px;}\r\n  .sidenav a {font-size: 18px;}\r\n}\r\n.sidenav a {\r\n  padding: 6px 8px 6px 16px;\r\n  text-decoration: none;\r\n  font-size: 25px;\r\n  color: white;\r\n  display: block;\r\n}\r\n#drawerContent button{\r\n  width: 35px;\r\n  height: 35px;\r\n  margin-right: 5px;\r\n}\r\n#imageContainer{\r\n  position: fixed;\r\n    left: 50%;\r\n    width: 1000px;\r\n    margin-left: -500px;\r\n    height: 600px;\r\n}\r\ni{\r\n  font-size: 25px;\r\n}\r\np::first-letter {\r\n  text-transform: uppercase;\r\n}\r\n\r\n</style>"

/***/ }),

/***/ "./src/app/components/annotate/annotate.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/annotate/annotate.component.ts ***!
  \***********************************************************/
/*! exports provided: AnnotateComponent, AnnotateTaskDialogComponent, AnnotateConfirmDialogComponent, AnnotateSubmittedDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotateComponent", function() { return AnnotateComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotateTaskDialogComponent", function() { return AnnotateTaskDialogComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotateConfirmDialogComponent", function() { return AnnotateConfirmDialogComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotateSubmittedDialogComponent", function() { return AnnotateSubmittedDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_task_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/task.service */ "./src/app/services/task.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_activity_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/activity.service */ "./src/app/services/activity.service.ts");
/* harmony import */ var _services_navbar_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/navbar.service */ "./src/app/services/navbar.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};










var AnnotateComponent = /** @class */ (function () {
    function AnnotateComponent(dialog, nav, _formBuilder, route, router, taskService, activityService, authService, _location, document, renderer) {
        this.dialog = dialog;
        this.nav = nav;
        this._formBuilder = _formBuilder;
        this.route = route;
        this.router = router;
        this.taskService = taskService;
        this.activityService = activityService;
        this.authService = authService;
        this._location = _location;
        this.renderer = renderer;
        this.showFiller = false;
        this.annotations = [];
        this.update = false;
        this.subtasks = [];
        this.marked = false;
        this.index = 0;
        this.commentIndex = null;
        this.hidden = true;
        this.submitted = false;
        this.clickedIndex = -1;
        this.isFeedbackSubmitted = false;
    }
    AnnotateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.editorConfig = {
            "editable": true,
            "spellcheck": true,
            "translate": "yes",
            "enableToolbar": true,
            "showToolbar": true,
            "placeholder": "Enter text here...",
            "imageEndPoint": "",
            "toolbar": [
                ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
                ["fontName", "fontSize", "color"],
                ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"]
            ]
        };
        this.nav.hide();
        this.email = this.authService.loadEmail();
        console.log(this.email);
        //this.dataOriginal = "http://"+ this.email;
        this.dataOriginal = "http://test";
        console.log(this.dataOriginal);
        this.updateForm = this._formBuilder.group({
            updateCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]
        });
        this.title = this.route.snapshot.paramMap.get('title');
        this.activityType = this.route.snapshot.paramMap.get('activitytype');
        this.activityName = this.route.snapshot.paramMap.get('activityname');
        this.taskService.getTaskMultiple(this.title, this.activityName).subscribe(function (data) {
            console.log(data);
            _this.image = data[0].originalname;
            _this.url = '/api/image/' + _this.image;
            _this.subtasks.push(data[0].task_desc);
            var pic = document.getElementById("image");
            anno.makeAnnotatable(pic);
            anno.setProperties({
                outline: 'red'
            });
            _this.taskService.getAnnotationsByEmail(_this.email, _this.activityName, _this.title).subscribe(function (data) {
                _this.annotations = data;
                if (_this.annotations.length == 0) {
                    console.log("No submission yet!");
                    _this.submitted = false;
                }
                else {
                    for (var i = 0; i < _this.annotations.length; i++) {
                        anno.addAnnotation(_this.annotations[i]);
                    }
                    _this.submitted = true;
                    _this.lockWidget();
                }
            });
            _this.authService.getProfile().subscribe(function (data) {
                console.log(data);
                _this.user = {
                    name: {
                        first: data.user.first,
                        last: data.user.last
                    },
                    email: data.user.email,
                };
            });
        });
        /**Annotation handlers**/
        anno.addHandler('onAnnotationCreated', (function (data) {
            console.log(data);
            _this.annotation = {
                editable: false,
                src: data.src,
                text: data.text,
                shapes: [{
                        type: "rect",
                        geometry: {
                            x: data.shapes[0].geometry.x,
                            y: data.shapes[0].geometry.y,
                            height: data.shapes[0].geometry.height,
                            width: data.shapes[0].geometry.width
                        }
                    }],
                index: _this.index,
                context: data.context,
                name: _this.user.name,
                email: _this.user.email,
                feedback: null,
                activity: {
                    activityName: _this.activityName,
                    taskName: _this.title
                },
            };
            _this.index++;
            console.log(_this.annotation);
            _this.annotations.push(_this.annotation);
        }));
        anno.addHandler('onAnnotationClicked', (function (data) {
            _this.studentEmail = data.email;
            _this.studentString = data.name.first + " " + data.name.last;
            _this.studentContext = data.context;
            _this.clickedIndex = data.index;
            _this.lockWidget();
            _this.commentIndex = data.index;
            _this.annoText = data.text;
            _this.hidden = false;
            if (_this.feedbackSubmitted() == true) {
                _this.isFeedbackSubmitted = true;
                _this.dynamicFeedbackStr = _this.annotations[_this.clickedIndex].feedback;
            }
            else if (_this.feedbackSubmitted() == false) {
                _this.isFeedbackSubmitted = false;
            }
            _this.toggleSideNav();
        }));
        anno.addHandler('onAnnotationUpdated', (function (data) {
            //console.log(data.index);
            console.log(data.shapes[0].geometry);
            for (var i = 0; i < _this.annotations.length; i++) {
                if (_this.compareGeoms(_this.annotations[i].shapes[0].geometry, data.shapes[0].geometry)) {
                    //console.log("YES");
                    _this.annotations[i].text = data.text;
                    console.log(_this.annotations);
                    console.log("Successful");
                }
                else {
                    console.log("NO");
                }
            }
        }));
        anno.addHandler('onAnnotationRemoved', (function (data) {
            var text_ = data.text;
            _this.taskService.deleteAnnotation(text_).subscribe(function (data) {
                console.log(data);
            });
            _this.index--;
        }));
    };
    AnnotateComponent.prototype.checkMarked = function (title) {
        if (this.marked == false) {
            this.marked = true;
        }
        else {
            this.marked = false;
        }
    };
    AnnotateComponent.prototype.test = function () {
        //anno.hideAnnotations(this.annotations[1].src);
        var pic = document.getElementById("image").getAttribute("data-original");
        pic = "http://test@test.ie";
        //console.log( document.getElementById("image").getAttribute("data-original"));
        this.dataOriginal = pic;
        console.log(this.dataOriginal);
        anno.showAnnotations(this.dataOriginal);
    };
    AnnotateComponent.prototype.onUpdateSubmit = function (index) {
        this.tempAnnotation = this.annotations[index];
        // tempAnnotation.text = this.updateForm.get("updateCtrl").value;
        this.tempAnnotation.text = this.updateForm.get("updateCtrl").value;
        anno.addAnnotation(this.tempAnnotation, this.annotations[index]);
        this.annotations[index].update = false;
        console.log(this.annotations);
        this.updateForm.reset();
    };
    AnnotateComponent.prototype.submitFeedback = function (text) {
        var comment = { user: {
                first: this.user.name.first,
                last: this.user.name.last
            },
            index: this.clickedIndex,
            comment: text
        };
        this.activityService.updateFeedback(this.email, this.studentContext, comment, this.clickedIndex)
            .subscribe(function (data) {
            console.log(data);
        });
        this.annotations[this.clickedIndex].feedback = text;
        console.log(this.annotations[this.clickedIndex].feedback);
        this.clear();
        this.toggleSideNav();
    };
    AnnotateComponent.prototype.clear = function () {
        this.htmlContent = "";
    };
    AnnotateComponent.prototype.empty = function () {
        alert("You have not typed anything to submit!");
    };
    AnnotateComponent.prototype.feedbackSubmitted = function () {
        if (this.clickedIndex != null && this.annotations[this.clickedIndex].feedback != null) {
            return true;
        }
        else {
            return false;
        }
    };
    AnnotateComponent.prototype.submitAllAnnotations = function () {
        var _this = this;
        this.userStatus = {
            activityName: this.activityName,
            taskName: this.title,
            submitted: true,
            count: this.annotations.length,
            email: this.email
        };
        this.lockWidget();
        this.submitted = true;
        for (var i = 0; i < this.annotations.length; i++) {
            this.taskService.submitAnnotation(this.annotations[i]).subscribe(function (data) {
                console.log(data);
            });
        }
        this.activityService.updateUserSubmission(this.user.email, this.userStatus).subscribe(function (data) {
            console.log(data);
            if (_this.activityType == 'Group') {
                var groupUserStatus = {
                    taskName: _this.title,
                    first: _this.user.name.first,
                    last: _this.user.name.last,
                    email: _this.user.email
                };
                _this.activityService.updateSubmissions(_this.activityName, groupUserStatus).subscribe(function (data) {
                    console.log(data);
                });
            }
        });
    };
    AnnotateComponent.prototype.compareGeoms = function (geom1, geom2) {
        if (geom1.x == geom2.x && geom1.y == geom2.y && geom1.height == geom2.height && geom1.width == geom2.width) {
            return true;
        }
        else {
            return false;
        }
    };
    AnnotateComponent.prototype.lockWidget = function () {
        anno.hideSelectionWidget();
    };
    AnnotateComponent.prototype.showWidget = function () {
        anno.showSelectionWidget();
    };
    AnnotateComponent.prototype.toggleSideNav = function () {
        if (this.hidden) {
            this.hidden = false;
            this.drawer.toggle();
        }
        else if (!this.hidden) {
            this.hidden = true;
            this.drawer.toggle();
        }
    };
    AnnotateComponent.prototype.backClicked = function () {
        this._location.back();
        //this.nav.show();
    };
    /**Dialog code**/
    AnnotateComponent.prototype.openTaskDialog = function () {
        var dialogRef = this.dialog.open(AnnotateTaskDialogComponent, {
            data: {
                tasks: this.subtasks
            },
            width: "300px",
            height: "250px"
        });
    };
    AnnotateComponent.prototype.openConfirmDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AnnotateConfirmDialogComponent, {
            data: {
                annotations: this.annotations
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result == true) {
                _this.submitAllAnnotations();
                _this.openSubmittedDialog();
            }
            else {
                console.log("closing");
            }
        });
    };
    AnnotateComponent.prototype.openSubmittedDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AnnotateSubmittedDialogComponent, {});
        dialogRef.afterClosed().subscribe(function (result) {
            _this.nav.show();
            if (_this.activityType == 'Group') {
                _this.router.navigate(['group/', _this.activityName]);
            }
            else if (_this.activityType == 'Individual') {
                _this.router.navigate(['activity/', _this.activityName]);
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('drawer'),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSidenav"])
    ], AnnotateComponent.prototype, "drawer", void 0);
    AnnotateComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-annotate',
            template: __webpack_require__(/*! ./annotate.component.html */ "./src/app/components/annotate/annotate.component.html"),
            styles: [__webpack_require__(/*! ./annotate.component.css */ "./src/app/components/annotate/annotate.component.css")]
        }),
        __param(9, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_8__["MatDialog"],
            _services_navbar_service__WEBPACK_IMPORTED_MODULE_5__["NavbarService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _services_task_service__WEBPACK_IMPORTED_MODULE_2__["TaskService"],
            _services_activity_service__WEBPACK_IMPORTED_MODULE_4__["ActivityService"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"], Object, _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]])
    ], AnnotateComponent);
    return AnnotateComponent;
}());

var AnnotateTaskDialogComponent = /** @class */ (function () {
    function AnnotateTaskDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("annotate-Component"),
        __metadata("design:type", AnnotateComponent)
    ], AnnotateTaskDialogComponent.prototype, "annotateComponent", void 0);
    AnnotateTaskDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'annotate-dialog',
            template: __webpack_require__(/*! ./annotate-task-dialog.html */ "./src/app/components/annotate/annotate-task-dialog.html"),
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_8__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_8__["MatDialogRef"], Object])
    ], AnnotateTaskDialogComponent);
    return AnnotateTaskDialogComponent;
}());

var AnnotateConfirmDialogComponent = /** @class */ (function () {
    function AnnotateConfirmDialogComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    AnnotateConfirmDialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("annotate-Component"),
        __metadata("design:type", AnnotateComponent)
    ], AnnotateConfirmDialogComponent.prototype, "annotateComponent", void 0);
    AnnotateConfirmDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'annotate-dialog',
            template: __webpack_require__(/*! ./annotate-confirm-dialog.html */ "./src/app/components/annotate/annotate-confirm-dialog.html"),
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_8__["MatDialogRef"]])
    ], AnnotateConfirmDialogComponent);
    return AnnotateConfirmDialogComponent;
}());

var AnnotateSubmittedDialogComponent = /** @class */ (function () {
    function AnnotateSubmittedDialogComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    AnnotateSubmittedDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'annotate-dialog',
            template: __webpack_require__(/*! ./annotate-submitted-dialog.html */ "./src/app/components/annotate/annotate-submitted-dialog.html"),
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_8__["MatDialogRef"]])
    ], AnnotateSubmittedDialogComponent);
    return AnnotateSubmittedDialogComponent;
}());



/***/ }),

/***/ "./src/app/components/annotation-view/annotation-view.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/components/annotation-view/annotation-view.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYW5ub3RhdGlvbi12aWV3L2Fubm90YXRpb24tdmlldy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/annotation-view/annotation-view.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/annotation-view/annotation-view.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<html>\r\n   <body>\r\n <mat-drawer-container style=\"width: 100%; height: 100%;\" autosize = true class=\"example-container\" autosize [hasBackdrop]=\"true\">\r\n  <mat-drawer style=\"width: 450px;\" #drawer class=\"example-sidenav\" mode=\"over\">\r\n    <h3 style=\"text-align: center;\">\r\n      <span matBadge=\"{{dynamicFeedBack?.length}}\" matBadgeOverlap=\"false\">Feedback</span>\r\n      <i *ngIf=\"!sameUser\" matTooltip = \"Add a comment\" style=\"float: right; padding-right: 5px;\" (click)=\"addComment()\" class=\"glyphicon glyphicon-plus\"></i></h3>\r\n    <div id=\"annoInfo\" style=\"padding-left: 10px; padding-right: 10px; border-style: ridge;background-color: whitesmoke;\">\r\n      <p style=\"text-transform: capitalize;\">Student: {{studentString}}</p>\r\n  <p>Annotation: {{annoText}}</p>\r\n</div>\r\n<div *ngIf=\"!sameUser\">\r\n  <mat-list id=\"commentDiv\" *ngIf=\"dynamicFeedBack.length>0\" style=\"padding-top: 0px;\">\r\n      <mat-list-item *ngFor=\"let comment of dynamicFeedBack; let i = index\" style=\"min-height: 100px; height: auto; border-bottom-style: ridge;\">\r\n        <div style=\"width: 100%;\">\r\n        <h4 style=\"text-transform: capitalize; font-weight: bold;\">{{comment.first}} {{comment.last}} says:</h4>\r\n        <div>\r\n        <p id=\"commentPTag\" [innerHTML]=\"comment.comment\">\r\n        </p>\r\n      </div>\r\n      </div>\r\n      </mat-list-item>\r\n    </mat-list>\r\n    <p style=\"text-align: center; padding-right: 10px; padding-left: 10px;\" *ngIf=\"feedBack.length == 0\"><i>Be the first to submit feedback on this annotation</i></p>\r\n    <div *ngIf=\"addingComment\">\r\n    <app-ngx-editor [config]=\"editorConfig\" height=\"100px\" minHeight=\"100px\" [placeholder]=\"placeholder\" [spellcheck]=\"true\" [(ngModel)]=\"htmlContent\" name=\"htmlContent\"></app-ngx-editor>\r\n  <button *ngIf=\"htmlContent\" type=\"button\" class=\"btn btn-primary\" style=\"float: right;\" (click)=\"submitFeedback(htmlContent)\">Submit</button>\r\n   <button *ngIf=\"!htmlContent\" type=\"button\" class=\"btn btn-primary\" style=\"float: right;\" (click)=\"empty()\">Submit</button>\r\n   <button type=\"button\" class=\"btn btn-warning\" style=\"float: right;\" (click)=\"clear()\">Clear</button>\r\n   <button type=\"button\" class=\"btn btn-danger\" style=\"float: right;\" (click)=\"close()\">Close</button>\r\n </div>\r\n</div>\r\n\r\n<div *ngIf=\"sameUser\">\r\n  <mat-list id=\"commentDiv\" *ngIf=\"dynamicFeedBack.length>0\" style=\"padding-top: 0px;\">\r\n      <mat-list-item *ngFor=\"let comment of dynamicFeedBack; let i = index\" style=\"min-height: 100px; height: auto; border-bottom-style: ridge;\">\r\n        <div style=\"width: 100%;\">\r\n        <h4 style=\"text-transform: capitalize; font-weight: bold;\">{{comment.first}} {{comment.last}} says:</h4>\r\n        <div>\r\n        <p id=\"commentPTag\" [innerHTML]=\"comment.comment\">\r\n        </p>\r\n      </div>\r\n      </div>\r\n      </mat-list-item>\r\n    </mat-list>\r\n    <p style=\"text-align: center; padding-right: 10px; padding-left: 10px;\" *ngIf=\"feedBack.length == 0\"><i>Be the first to submit feedback on this annotation</i></p>\r\n    </div>\r\n <div *ngIf=\"sameUser && dynamicFeedBack.length == 0\">\r\n  <p id=\"noFeedbackP\"><i>You have not received any feedback on this annotation yet</i></p>\r\n</div>\r\n  </mat-drawer> \r\n\r\n\r\n  <mat-drawer-content id=\"drawerContent\">\r\n   <div style=\"margin-top: 2%;\">\r\n  <div id=\"imageContainer\" style=\"text-align: center;\">\r\n    <div style=\"float: left;\">\r\n    <button matTooltip=\"Go Back\" (click)=\"backClicked()\" mat-stroked-button><i class=\"glyphicon glyphicon-arrow-left\"></i></button>\r\n     <button matTooltip=\"Task\" mat-stroked-button (click)=\"openTaskDialog()\"><i class=\"glyphicon glyphicon-question-sign\"></i></button>\r\n  </div>\r\n    <img style=\"width: 1000px; height: 600px; border-style: ridge; border-width: 2px;\" id=\"image\" src={{url}} attr.data-original=\"{{dataOriginal}}\" />\r\n  </div>\r\n</div>\r\n</mat-drawer-content>\r\n\r\n</mat-drawer-container>\r\n</body>\r\n  \r\n<style>\r\n#imageDiv{\r\n  width: 60%\r\n}\r\n\r\nbody{\r\n  background-color: rgb(245,245,245)!important;\r\n  height: 100vh;\r\n}\r\nhtml{\r\n  height: 100%;\r\n  overflow-y: hidden;\r\n}\r\n.example-container {\r\n  width: 100%;\r\n\r\n}\r\n\r\n.example-sidenav {\r\n     \r\n    padding-bottom: 20px;\r\n}\r\n#mainDiv{\r\n    height: 100%;\r\n    width: 100%;\r\n    padding-top: 20px;\r\n}\r\n.sidenav {\r\n  min-height: 90%;\r\n  width: 25%;\r\n  position: absolute;\r\n  z-index: 999;\r\n  top: 5;\r\n  left: 0;\r\n  background-color: white;\r\n  overflow-x: hidden;\r\n  padding-right: 0px;\r\n  border-style: inset;\r\n  margin: 20px;\r\n}\r\n\r\n@media screen and (max-height: 450px) {\r\n  .sidenav {padding-top: 15px;}\r\n  .sidenav a {font-size: 18px;}\r\n}\r\n.sidenav a {\r\n  padding: 6px 8px 6px 16px;\r\n  text-decoration: none;\r\n  font-size: 25px;\r\n  color: white;\r\n  display: block;\r\n}\r\n#drawerContent button{\r\n  width: 35px;\r\n  height: 35px;\r\n  margin-right: 5px;\r\n}\r\n#imageContainer{\r\n  position: fixed;\r\n    left: 50%;\r\n    width: 1000px;\r\n    margin-left: -500px;\r\n    height: 600px;\r\n}\r\n\r\np::first-letter {\r\n  text-transform: uppercase;\r\n}\r\n#noFeedbackP{\r\n    text-align: center;\r\n}\r\n p{\r\n  padding: 5px;\r\n  font-size: 20px;\r\n}\r\nbutton i{\r\n  font-size: 25px;\r\n}\r\n#commentPTag{\r\n  font-size: 20px;\r\n}\r\n.glyphicon:hover{\r\n  cursor: pointer;\r\n}\r\n</style>"

/***/ }),

/***/ "./src/app/components/annotation-view/annotation-view.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/annotation-view/annotation-view.component.ts ***!
  \*************************************************************************/
/*! exports provided: AnnotationViewComponent, ViewTaskDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotationViewComponent", function() { return AnnotationViewComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewTaskDialogComponent", function() { return ViewTaskDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_navbar_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/navbar.service */ "./src/app/services/navbar.service.ts");
/* harmony import */ var _services_task_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/task.service */ "./src/app/services/task.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_activity_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/activity.service */ "./src/app/services/activity.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};









var AnnotationViewComponent = /** @class */ (function () {
    function AnnotationViewComponent(dialog, route, nav, _location, router, taskService, activityService, authService, sanitizer) {
        this.dialog = dialog;
        this.route = route;
        this.nav = nav;
        this._location = _location;
        this.router = router;
        this.taskService = taskService;
        this.activityService = activityService;
        this.authService = authService;
        this.sanitizer = sanitizer;
        this.addingComment = false;
        this.hidden = true;
        this.subtasks = [];
        this.annotations = [];
        this.submitted = false;
        this.sameUser = false;
        this.feedBack = [];
        this.dynamicFeedBack = [];
    }
    AnnotationViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.nav.hide();
        this.editorConfig = {
            "editable": true,
            "spellcheck": true,
            "translate": "yes",
            "enableToolbar": true,
            "showToolbar": true,
            "placeholder": "Enter text here...",
            "imageEndPoint": "",
            "toolbar": [
                ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
                ["fontName", "fontSize", "color"],
                ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"]
            ]
        };
        this.dataOriginal = "http://test";
        this.email = this.route.snapshot.paramMap.get("email");
        this.taskName = this.route.snapshot.paramMap.get('taskname');
        this.activityName = this.route.snapshot.paramMap.get('activityname');
        console.log(this.activityName);
        console.log(this.taskName);
        this.taskService.getTaskMultiple(this.taskName, this.activityName).subscribe(function (data) {
            console.log(data);
            _this.image = data[0].originalname;
            _this.url = '/api/image/' + _this.image;
            _this.subtasks.push(data[0].task_desc);
            var pic = document.getElementById("image");
            anno.makeAnnotatable(pic);
            anno.hideSelectionWidget();
            anno.setProperties({
                outline: 'red'
            });
            _this.taskService.getAnnotationsByEmail(_this.email, _this.activityName, _this.taskName).subscribe(function (data) {
                _this.annotations = data;
                for (var i = 0; i < _this.annotations.length; i++) {
                    if (_this.annotations[i].feedback.length > 0) {
                        for (var j = 0; j < _this.annotations[i].feedback.length; j++) {
                            _this.feedBack.push(data[i].feedback[j]);
                        }
                    }
                }
                console.log(_this.feedBack);
                //this.feedBack = data.feedback;
                console.log(_this.feedBack);
                console.log(_this.annotations);
                if (_this.annotations.length == 0) {
                    console.log("No submission yet!");
                    _this.submitted = false;
                }
                else {
                    for (var i = 0; i < _this.annotations.length; i++) {
                        anno.addAnnotation(_this.annotations[i]);
                    }
                }
            });
            /**Get the user that is logged in currently**/
            _this.authService.getProfile().subscribe(function (data) {
                _this.user = {
                    name: {
                        first: data.user.first,
                        last: data.user.last
                    },
                    email: data.user.email,
                };
                if (_this.checkSame()) {
                    _this.sameUser = true;
                }
                else {
                    _this.sameUser = false;
                }
            });
        });
        anno.addHandler('onAnnotationClicked', (function (data) {
            _this.dynamicFeedBack = [];
            _this.studentString = data.name.first + " " + data.name.last;
            _this.studentContext = data.context;
            _this.clickedIndex = data.index;
            _this.annoText = data.text;
            for (var i = 0; i < _this.feedBack.length; i++) {
                if (_this.feedBack[i].index == _this.clickedIndex) {
                    _this.dynamicFeedBack.push(_this.feedBack[i]);
                }
            }
            _this.toggleSideNav();
            //setTimeout(() => this.toggleSideNav(), 1000)
            console.log(_this.clickedIndex);
        }));
    };
    AnnotationViewComponent.prototype.toggleSideNav = function () {
        if (this.hidden) {
            this.hidden = false;
            this.drawer.toggle();
        }
        else if (!this.hidden) {
            this.hidden = true;
            this.drawer.toggle();
        }
    };
    AnnotationViewComponent.prototype.backClicked = function () {
        this._location.back();
        //this.nav.show();
    };
    AnnotationViewComponent.prototype.submitFeedback = function (text) {
        var comment = {
            first: this.user.name.first,
            last: this.user.name.last,
            index: this.clickedIndex,
            comment: text
        };
        this.activityService.updateFeedback(this.email, this.studentContext, comment, this.clickedIndex)
            .subscribe(function (data) {
            console.log(data);
        });
        this.addingComment = false;
        text = this.clean(text);
        this.feedBack.push(comment);
        this.dynamicFeedBack.push(comment);
        console.log(this.feedBack);
        this.clear();
    };
    AnnotationViewComponent.prototype.clear = function () {
        this.htmlContent = "";
    };
    AnnotationViewComponent.prototype.empty = function () {
        alert("You have not typed anything to submit!");
    };
    AnnotationViewComponent.prototype.close = function () {
        this.toggleSideNav();
    };
    AnnotationViewComponent.prototype.clean = function (text) {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    };
    AnnotationViewComponent.prototype.addComment = function () {
        this.addingComment = true;
    };
    AnnotationViewComponent.prototype.checkSame = function () {
        if (this.email == this.user.email) {
            return true;
        }
        else {
            return false;
        }
    };
    AnnotationViewComponent.prototype.openTaskDialog = function () {
        var dialogRef = this.dialog.open(ViewTaskDialogComponent, {
            data: {
                tasks: this.subtasks
            },
            width: "300px",
            height: "250px"
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('drawer'),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSidenav"])
    ], AnnotationViewComponent.prototype, "drawer", void 0);
    AnnotationViewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-annotation-view',
            template: __webpack_require__(/*! ./annotation-view.component.html */ "./src/app/components/annotation-view/annotation-view.component.html"),
            styles: [__webpack_require__(/*! ./annotation-view.component.css */ "./src/app/components/annotation-view/annotation-view.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _services_navbar_service__WEBPACK_IMPORTED_MODULE_3__["NavbarService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_7__["Location"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _services_task_service__WEBPACK_IMPORTED_MODULE_4__["TaskService"],
            _services_activity_service__WEBPACK_IMPORTED_MODULE_6__["ActivityService"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__["DomSanitizer"]])
    ], AnnotationViewComponent);
    return AnnotationViewComponent;
}());

var ViewTaskDialogComponent = /** @class */ (function () {
    function ViewTaskDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ViewTaskDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'annotate-dialog',
            template: __webpack_require__(/*! ./view-task-dialog.html */ "./src/app/components/annotation-view/view-task-dialog.html"),
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"], Object])
    ], ViewTaskDialogComponent);
    return ViewTaskDialogComponent;
}());



/***/ }),

/***/ "./src/app/components/annotation-view/view-task-dialog.html":
/*!******************************************************************!*\
  !*** ./src/app/components/annotation-view/view-task-dialog.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<h1 mat-dialog-title style=\"margin-bottom: 5px;\">Your Task</h1>\r\n<mat-divider></mat-divider>\r\n<div style=\"text-align: center; margin-top: 15px; height: 60%;\" mat-dialog-content>\r\n  <div *ngIf=\"data\">\r\n  <p class=\"lead\">{{data.tasks}}</p>\r\n</div>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button-stroked mat-dialog-close cdkFocusInitial>Ok</button>\r\n</div>"

/***/ }),

/***/ "./src/app/components/classroom/classroom.component.css":
/*!**************************************************************!*\
  !*** ./src/app/components/classroom/classroom.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "  \n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvY2xhc3Nyb29tL2NsYXNzcm9vbS5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/classroom/classroom.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/classroom/classroom.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\r\n<head>\r\n\r\n</head>\r\n<body>\r\n<div>\r\n<mat-card style=\"position: absolute; width: 80%; border-width: 2px; height:auto; margin-top: 25px; overflow-y: auto;\" class=\"main\" id=\"main\" *ngIf=\"class\">\r\n\r\n  <a  *ngIf=\"isTeacher\" style=\"color: black; float: right; padding-right: 5px; font-size: 22px;\" (click)=\"openModal(newActivityModal)\"><i matTooltip=\"Create a New Activity\" class=\"glyphicon glyphicon-plus\"></i></a>\r\n\t<mat-card-title>Welcome to {{class.title}}</mat-card-title>\r\n\t<ul class=\"list-group\">\r\n    <br>\r\n\t\t<li *ngIf=\"user\" class=\"list-group-item\"><strong>Teacher:</strong> {{teacher}} </li>\r\n\t\t<li class=\"list-group-item\"><strong>Email:</strong> {{class.teacher.email}}</li>\r\n\t\t<li class=\"list-group-item\"><strong>Module:</strong> {{class.module_code}}</li>\r\n    <li class=\"list-group-item\"><strong>Active Class Activities:</strong> {{activities.length}}</li>\r\n    <li class=\"list-group-item\"><strong>Students:</strong> {{studentList?.length}}</li>\r\n  <mat-expansion-panel *ngFor=\"let act of activities\">\r\n    <mat-expansion-panel-header style=\"margin-left: auto; margin-right: auto;\">\r\n      <tr>\r\n        <th><strong>Activity Name:</strong>&nbsp;&nbsp; {{act.activityName}}\r\n      &nbsp;&nbsp;&nbsp;&nbsp;</th>\r\n        <th> <strong>Activity Type:</strong>&nbsp;&nbsp; {{act.activityType}}\r\n      &nbsp;&nbsp;&nbsp;&nbsp;</th>\r\n        <th><strong> Number of tasks</strong>&nbsp;&nbsp; {{act.tasks?.length}}</th>\r\n  </tr>\r\n\r\n    </mat-expansion-panel-header>\r\n<div style=\"width: 100%; text-align: -webkit-right;\">\r\n<a *ngIf=\"act.activityType=='Individual'\"  style=\"width: 10%; display: inline-block;\" [routerLink]=\"['/activity/',act.activityName]\"type=\"submit\" class=\"btn btn-primary btn-block mt-4\" >View</a>\r\n<a *ngIf=\"act.activityType=='Group'\"  style=\"width: 10%; display: inline-block;\" [routerLink]=\"['/group/',act.activityName]\" type=\"submit\" class=\"btn btn-primary btn-block mt-4\" >View</a>\r\n<button *ngIf=\"isTeacher\" class=\"btn btn-danger\" style=\"width: 10%; display: inline-block;\" (click)=\"deleteActivity(act.activityName)\">Delete</button>\r\n</div>\r\n\r\n<div class=\"example-container mat-elevation-z8\">\r\n  <table mat-table [dataSource]=\"act.tasks\">\r\n\r\n    <ng-container matColumnDef=\"name\">\r\n      <th mat-header-cell *matHeaderCellDef> Task Name </th>\r\n      <td style=\"padding-left: 0px;\" mat-cell *matCellDef=\"let task\" > {{task.task_name}} </td>\r\n    </ng-container>\r\n\r\n    <ng-container matColumnDef=\"type\">\r\n      <th mat-header-cell *matHeaderCellDef> Type </th>\r\n      <td mat-cell *matCellDef=\"let task\"> {{task.task_type}} </td>\r\n    </ng-container>\r\n    <ng-container matColumnDef=\"preview\">\r\n      <th mat-header-cell *matHeaderCellDef> Preview </th>\r\n      <td mat-cell *matCellDef=\"let task; let i = index \">\r\n        <i *ngIf=\"task.task_type=='image'\" (click)=\"openImagePreview(imageModal,act.activityName,task.task_name)\" class=\"glyphicon glyphicon-eye-open\"></i>\r\n        <i *ngIf=\"task.task_type=='text'\" (click)=\"openTextPreview(textModal,task.task_name, task.task_desc)\" class=\"glyphicon glyphicon-eye-open\"></i>\r\n      </td>\r\n    </ng-container>\r\n\r\n    <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n    <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\r\n  </table>\r\n</div>\r\n  </mat-expansion-panel>\r\n  </ul>\r\n\r\n</mat-card>\r\n</div>\r\n\r\n<ng-template #enrollTemp>\r\n  <div class=\"modal-header\">\r\n    <h4 class=\"modal-title pull-left\">Task Image</h4>\r\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\r\n      <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n  \t<img class=\"thumbnail\" src={{url}}>\r\n    <form>\r\n  <div class=\"form-group\">\r\n    <label>Task Description</label>\r\n    <input type=\"text\" class=\"form-control\" [(ngModel)]=\"task_description\" name=\"task_description\">\r\n  </div>\r\n  <button class=\"btn btn-primary\" type=\"submit\">Choose</button>\r\n</form>\r\n  </div>\r\n</ng-template>\r\n\r\n\r\n\r\n\r\n\r\n\r\n<ng-template #newActivityModal id=\"newActivityModal\" style=\"width: 700px; height: 50vh;\">\r\n\r\n<!--ACTIVITY STUFF-->\r\n<mat-horizontal-stepper labelPosition=\"bottom\" #stepper [linear]=\"isLinear\">\r\n  <mat-step [stepControl]=\"activityNameForm\">\r\n    <form [formGroup]=\"activityNameForm\" (ngSubmit)=\"onActivityNameSubmit()\">\r\n      <ng-template matStepLabel>Activity name</ng-template>\r\n      <mat-form-field>\r\n        <input matInput placeholder=\"Activity Name\" formControlName=\"activityNameCtrl\">\r\n      </mat-form-field>\r\n      <div>\r\n        <button type=\"submit\" mat-stroked-button mat-button matStepperNext>Next</button>\r\n      </div>\r\n    </form>\r\n  </mat-step>\r\n  <mat-step [stepControl]=\"activityTypeForm\">\r\n    <form [formGroup]=\"activityTypeForm\" (ngSubmit)=\"onActivityTypeSubmit()\" style=\"text-align: center; font-size: 18px;\">\r\n      <ng-template matStepLabel>Activity Type</ng-template>\r\n      <mat-radio-group formControlName=\"activityTypeCtrl\" required>\r\n    <mat-radio-button (click)=\"notGroup()\" class=\"example-margin\" value=\"Individual\">Individual </mat-radio-button>\r\n    <mat-radio-button (click)=\"group()\" class=\"example-margin\" value=\"Group\">Group </mat-radio-button>\r\n    </mat-radio-group>\r\n    <div *ngIf=\"isGroup\" style=\"margin-top: 15px;\">\r\n    <mat-form-field style=\"width: 30%; margin-left: auto; margin-right: auto; display: block;\">\r\n    <input formControlName=\"groupNameCtrl\" matInput placeholder=\"Group Name\" value=\"\">\r\n  </mat-form-field>\r\n    <mat-form-field style=\"width: 30%; margin-left: auto; margin-right: auto; display: block;\">\r\n  <mat-select placeholder=\"Students\"  [disableOptionCentering]=\"true\" formControlName=\"students\" multiple>\r\n    <mat-option *ngFor=\"let student of studentList\" [value]=\"student\">{{student.first}} {{student.last}}</mat-option>\r\n  </mat-select>\r\n</mat-form-field>\r\n</div>\r\n    <br>\r\n      <div style=\"margin-top: 20px; text-align: left;\">\r\n        <button mat-stroked-button matStepperPrevious>Back</button>\r\n        <button mat-stroked-button matStepperNext>Next</button>\r\n      </div>\r\n    </form>\r\n  </mat-step>\r\n\r\n  <!--TASK STUFF-->\r\n  <mat-step [stepControl]=\"taskForm\">\r\n    <form [formGroup]=\"taskForm\" (ngSubmit)=\"onTaskNameSubmit()\">\r\n      <ng-template matStepLabel>Tasks</ng-template>\r\n        <mat-list role=\"list\">\r\n          <mat-divider></mat-divider>\r\n          <mat-list-item role=\"listitem\">\r\n            <mat-list-item role=\"listitem\">\r\n            <strong>Task Type</strong>\r\n          </mat-list-item>\r\n          <mat-form-field>\r\n          <mat-select [(value)]=\"selected\" formControlName=\"taskTypeCtrl\" >\r\n            <mat-option>None</mat-option>\r\n            <mat-option value=\"image\" >Image</mat-option>\r\n            <mat-option value=\"text\">Text</mat-option>\r\n          </mat-select>\r\n        </mat-form-field>\r\n          <mat-divider></mat-divider>\r\n        </mat-list-item>\r\n        <div style=\"text-align: center;\" >\r\n          <div class=\"table-responsive\">\r\n    <table class=\"table table-striped table table-bordered\">\r\n    <thead class=\"thead-dark\">\r\n      <tr>\r\n        <th>No.</th>\r\n        <th>Name</th>\r\n        <th>Type</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngFor=\"let task of tasks; let i = index\">\r\n        <td>{{i + 1}}</td>\r\n        <td>{{task.task_name}}</td>\r\n        <!--<ng-template #popTemplate>\r\n        Email: {{class.teacher.email}}</ng-template> -->\r\n        <td>{{task.task_type}}</td>\r\n      </tr>\r\n      </tbody>\r\n  </table>\r\n</div>\r\n\r\n  <mat-card *ngIf=\"selected=='image' && url\" style=\"border-style: ridge; width: 80%;\">\r\n  <div style=\"text-align: center; height: auto;\">\r\n    <button style=\"float: right;\" class=\"btn btn-danger\" (click)=\"clearURL()\">Delete</button>\r\n        <img src={{url}} style=\"padding: 20px;\">\r\n    <mat-list style=\"text-align: left; margin-top: 5px; margin-top: 5px;\">\r\n      <h3 style=\"margin-top: 10px; margin-bottom: 0px; border-bottom-style: ridge; border-top-style: ridge; background-color: gainsboro; border-color: gainsboro; padding-bottom: 10px; padding-top: 10px;\">Tasks\r\n      <!-- <i (click)=\"submitTask()\" style=\"float: right;\" class=\"glyphicon glyphicon-ok\"></i> -->\r\n    </h3>\r\n\r\n      <div style=\"width: 100%; margin-top: 20px;\">\r\n        <mat-form-field *ngIf=\"!taskName\">\r\n      <input matInput placeholder=\"Task Name\" formControlName=\"taskNameCtrl\">\r\n    </mat-form-field>\r\n    <button matTooltip=\"Confirm Task Name\" type=\"button\" *ngIf=\"!taskName\" style=\"float: right;\" (click)=\"addTask()\" class=\"btn btn-primary\">OK</button>\r\n    <blockquote *ngIf=\"taskName\">\r\n      <p><i>{{taskName}}</i></p>\r\n    </blockquote>\r\n\r\n       <app-ngx-editor height=\"150px\" minHeight=\"150px\" [config]=\"editorConfig\"  [placeholder]=\"placeholder\" [spellcheck]=\"true\" [(ngModel)]=\"htmlContent\" [ngModelOptions]=\"{standalone: true}\" name=\"htmlContent\"></app-ngx-editor>\r\n        <div style=\"width: 100%; text-align: center;\" *ngIf=\"taskName && htmlContent\">\r\n        <button class=\"btn btn-primary\" (click)=\"submitTask()\" matTooltip=\"Submit Task\">Submit</button>\r\n      </div>\r\n    </div>\r\n    </mat-list>\r\n  </div> \r\n</mat-card>\r\n      </div>\r\n\r\n          <file-drop *ngIf=\"selected=='image' && !url\" headertext=\"Drop file here\" (onFileDrop)=\"dropped($event)\"\r\n    (onFileOver)=\"fileOver($event)\" (onFileLeave)=\"fileLeave($event)\">\r\n    </file-drop>\r\n\r\n\r\n\r\n\r\n\r\n    <!--Text task-->\r\n    <div *ngIf=\"selected=='text'\">\r\n  <div style=\"text-align: center;\">\r\n  <mat-card style=\"border-style: ridge; width: 80%;\">\r\n\r\n  <div style=\"text-align: center; height: auto;\">\r\n\r\n    <mat-list style=\"text-align: left; margin-top: 5px; margin-top: 5px;\">\r\n\r\n      <h3 style=\"margin-top: 10px; margin-bottom: 0px; border-bottom-style: ridge; border-top-style: ridge; background-color: gainsboro; border-color: gainsboro; padding-bottom: 10px; padding-top: 10px;\">Add a new task\r\n      <!-- <i (click)=\"submitTask()\" matTooltip=\"Submit Task\" style=\"float: right;\" class=\"glyphicon glyphicon-ok\"></i> -->\r\n    </h3>\r\n      <div style=\"width: 100%; margin-top: 20px;\">\r\n        <mat-form-field *ngIf=\"!taskName\">\r\n      <input matInput placeholder=\"Task Name\" formControlName=\"taskNameCtrl\">\r\n    </mat-form-field>\r\n    <button matTooltip=\"Confirm Task Name\" type=\"button\" *ngIf=\"!taskName\" style=\"float: right;\" (click)=\"addTask()\" class=\"btn btn-primary\">OK</button>\r\n    <blockquote *ngIf=\"taskName\">\r\n      <p><i>{{taskName}}</i></p>\r\n    </blockquote>\r\n\r\n       <app-ngx-editor height=\"150px\" minHeight=\"150px\" [config]=\"editorConfig\"  [placeholder]=\"placeholder\" [spellcheck]=\"true\" [(ngModel)]=\"htmlContent\" [ngModelOptions]=\"{standalone: true}\" name=\"htmlContent\"></app-ngx-editor>\r\n       <div style=\"width: 100%; text-align: center;\" *ngIf=\"taskName && htmlContent\">\r\n        <button class=\"btn btn-primary\" (click)=\"submitTask()\" matTooltip=\"Submit Task\">Submit</button>\r\n      </div>\r\n    </div>\r\n    </mat-list>\r\n  </div> \r\n</mat-card>\r\n      </div>\r\n   </div>\r\n\r\n        </mat-list>\r\n\r\n        <!--ACTIVITY DISPLAY STUFF-->\r\n      <div>\r\n        <button mat-stroked-button matStepperPrevious>Back</button>\r\n        <button *ngIf=\"tasks?.length > 0\" mat-stroked-button matStepperNext>Done</button>\r\n        <button *ngIf=\"taskDesc\" style=\"float: right;\" type=\"button\" (click)=\"submitTask()\" class=\"btn btn-primary\">Submit Task</button>\r\n      </div>\r\n    </form>\r\n  </mat-step>\r\n  <mat-step>\r\n    <ng-template matStepLabel>Done</ng-template>\r\n    Activity Created.\r\n    <mat-list role=\"list\">\r\n      <mat-list-item>\r\n      <mat-divider></mat-divider>\r\n      <mat-list-item role=\"listitem\"><strong>Activity Name: </strong>&nbsp;&nbsp;{{activityName}}</mat-list-item>\r\n      <mat-divider></mat-divider>\r\n      <mat-list-item role=\"listitem\"><strong>Activity Type: </strong>&nbsp;&nbsp;{{activityType}}</mat-list-item>\r\n      <mat-divider></mat-divider>\r\n      <mat-list-item role=\"listitem\"><strong>#Tasks: </strong>&nbsp;&nbsp;{{tasks?.length}}</mat-list-item>\r\n    </mat-list-item>\r\n\r\n  <h4><strong>Tasks: </strong></h4>\r\n  <mat-list-item *ngFor=\"let task of tasks\" role=\"listitem\">\r\n    <mat-list-item><strong>Name</strong>&nbsp;&nbsp;{{task?.task_name}}</mat-list-item>\r\n    <mat-list-item><strong>Type</strong>&nbsp;&nbsp;{{task?.task_type}}</mat-list-item>\r\n    <ng-template #popTemplate>\r\n      {{task?.task_desc}}\r\n  </ng-template>\r\n    <mat-list-item><a [popover]=\"popTemplate\" popoverTitle=\"Task Description\" triggers=\"mouseenter:mouseleave\">\r\n      Description\r\n    </a>\r\n    </mat-list-item>\r\n    <mat-divider ></mat-divider>\r\n  </mat-list-item>\r\n\r\n</mat-list>\r\n    <div>\r\n      <button mat-stroked-button matStepperPrevious>Back</button>\r\n      <button mat-stroked-button (click)=\"stepper.reset()\">Reset</button>\r\n      <button class=\"btn btn-primary\" (click)=\"submitActivity()\" (click)=\"modalRef.hide()\">Submit</button>\r\n    </div>\r\n  </mat-step>\r\n</mat-horizontal-stepper>\r\n</ng-template>\r\n\r\n\r\n<!--Image Modal-->\r\n<ng-template #imageModal>\r\n  <div style=\"text-transform: capitalize;\" class=\"modal-header\">\r\n     <h4 class=\"modal-title pull-left\"><strong>{{tempName}}</strong></h4>\r\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\r\n      <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\" style=\"padding-top: 0px; text-transform: capitalize;\">\r\n    <h4><blockquote><p><i>{{tempDesc}}</i></p></blockquote></h4>\r\n    <img  id=\"modalImage\" [src]=\"imageSrc\">\r\n    \r\n  </div>\r\n</ng-template>\r\n\r\n<!--Text Modal-->\r\n<ng-template #textModal>\r\n  <div style=\"text-transform: capitalize;\" class=\"modal-header\">\r\n     <h4 class=\"modal-title pull-left\"><strong>{{tempName}}</strong></h4>\r\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\r\n      <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\" style=\"padding-top: 0px; text-transform: capitalize;\">\r\n    <h4><blockquote><p><i>{{tempDesc}}</i></p></blockquote></h4>\r\n    \r\n  </div>\r\n</ng-template>\r\n\r\n</body>\r\n\r\n<style>\r\ni{\r\n  font-size: 22px;\r\n}\r\nimg{\r\n\twidth: 100%;\r\n  height: 400px;\r\n}\r\nli{\r\n\ttext-transform: capitalize;\r\n}\r\n.column {\r\n    float: left;\r\n    width: 33.33%;\r\n    padding: 5px;\r\n}\r\n.card {\r\n    border:1px solid black; \r\n    outline-style:solid;\r\n}\r\n.thumbnail {\r\n  border: 1px solid #ddd;\r\n  border-radius: 4px;\r\n  padding: 5px;\r\n  width: 150px;\r\n}\r\n.newActivity, #newtask{\r\n  float: right;\r\n}\r\n.example-margin {\r\n  margin: 0 10px;\r\n}\r\n.mat-list-item-content{\r\n      justify-content: flex-end;\r\n}\r\n.mat-list-item{\r\n  text-transform: capitalize;\r\n}\r\n#newActivityModal{\r\n  width: 700px;\r\n}\r\n.mat-card{\r\n  display: inline-block;\r\n  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\r\n  transition: 0.3s;\r\n  border-style: solid;\r\n  text-transform: capitalize;\r\n  border-width: 1px;\r\n}\r\n.mat-card:hover {\r\n  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\r\n}\r\n.example-container {\r\n  height: auto;\r\n  overflow: auto;\r\n}\r\n\r\ntable {\r\n  width: 100%;\r\n}\r\nth.mat-header-cell {\r\n    text-align: center;\r\n    width: 25%;\r\n    font-size: 16px;\r\n}\r\ntd.mat-cell, td.mat-footer-cell, th.mat-header-cell {\r\n    padding: 0;\r\n    border-bottom-width: 1px;\r\n    border-bottom-style: solid;\r\n    border-right-style: solid;\r\n    border-right-width: 1px;\r\n    border-right-color: rgba(0,0,0,.12);\r\n}\r\ntd{\r\n  text-align: center;\r\n}\r\n.mat-row:nth-child(odd){\r\n          background-color:white;\r\n          }\r\n.mat-row:nth-child(even){\r\n          background-color:honeydew;\r\n      }\r\n#main{\r\n  width: 85%;\r\nposition: fixed;\r\nleft: 50%;\r\nmargin-left: -42.5%;\r\n}\r\n\r\ni:hover {\r\n cursor:pointer;\r\n}\r\n\r\n#modalImage{\r\n  display: block;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n  height: 450px;\r\n}\r\n\r\n\r\n</style>\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/classroom/classroom.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/classroom/classroom.component.ts ***!
  \*************************************************************/
/*! exports provided: ClassroomComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClassroomComponent", function() { return ClassroomComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_class_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/class.service */ "./src/app/services/class.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_task_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/task.service */ "./src/app/services/task.service.ts");
/* harmony import */ var _services_activity_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/activity.service */ "./src/app/services/activity.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_Rx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/Rx */ "./node_modules/rxjs-compat/_esm5/Rx.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm5/ngx-bootstrap-modal.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular2_lightbox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! angular2-lightbox */ "./node_modules/angular2-lightbox/index.js");
/* harmony import */ var angular2_lightbox__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(angular2_lightbox__WEBPACK_IMPORTED_MODULE_10__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var ClassroomComponent = /** @class */ (function () {
    function ClassroomComponent(_lightbox, _formBuilder, modalService, taskService, classService, authService, activityService, route, router, http) {
        this._lightbox = _lightbox;
        this._formBuilder = _formBuilder;
        this.modalService = modalService;
        this.taskService = taskService;
        this.classService = classService;
        this.authService = authService;
        this.activityService = activityService;
        this.route = route;
        this.router = router;
        this.http = http;
        //students = new FormControl();
        //toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
        /*Task variables*/
        this.isMember = false;
        this.done = true;
        this.submitted = true;
        this.add = false;
        this.makingTask = false;
        this.submission = false;
        this.isGroup = false;
        this.displayedColumns = ['name', 'type', 'preview'];
        this.url = "";
        this.tasks = [];
        this.taskFiles = [];
        this.activities = [];
        this.studentGroup = [];
        /*File variables*/
        this.files2 = [];
        this.files1 = [];
        this.images = [];
        this.isTeacher = false;
        this.id = 1;
        this.config = {
            animated: true,
            keyboard: true,
            class: 'modal-lg'
        };
        this.config2 = {
            animated: true,
            keyboard: true,
            class: 'modal-dialog-centered'
        };
        this.panelOpenState = false;
        this.isLinear = true;
        this.status = false;
        this.studentList = [];
        this.editorConfig = {
            "editable": true,
            "spellcheck": true,
            "translate": "yes",
            "enableToolbar": true,
            "showToolbar": true,
            "placeholder": "Enter text here...",
            "imageEndPoint": "",
            "toolbar": [
                ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
                ["fontName", "fontSize", "color"],
                ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"]
            ]
        };
        this.selectedFile = null;
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }
    ClassroomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.email = this.authService.loadEmail();
        var module = this.route.snapshot.paramMap.get('classname');
        console.log(module);
        this.activities = [];
        this.taskIndex = this.tasks.length;
        this.activityNameForm = this._formBuilder.group({
            activityNameCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_9__["Validators"].required]
        });
        //this.taskName = this.activityNameForm.controls['activityNameCtrl'].value;
        this.activityTypeForm = this._formBuilder.group({
            activityTypeCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_9__["Validators"].required],
            students: [''],
            groupNameCtrl: ['']
        });
        this.taskForm = this._formBuilder.group({
            taskNameCtrl: [''],
            taskDescCtrl: [''],
            taskTypeCtrl: ['']
        });
        this.taskService.clearFile();
        if (this.authService.isTeacher()) {
            this.isTeacher = true;
        }
        this.classService.getClassByModule(module).subscribe(function (data) {
            console.log(data);
            _this.class = data;
            _this.title = data.title;
            _this.module_code = data.module_code;
            _this.teacherEmail = data.teacher.email;
            _this.classService.getTeacher(_this.teacherEmail).subscribe(function (data) {
                _this.first = data.first;
                _this.last = data.last;
                _this.role = data.role;
                _this.teacher = _this.first + " " + _this.last;
                _this.classService.getStudentsByModule(_this.module_code).subscribe(function (data) {
                    _this.studentList = data;
                });
            });
            _this.activityService.getActivitiesByModule(_this.module_code).subscribe(function (data) {
                if (!_this.isTeacher) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].activityType == 'Group') {
                            _this.checkGroup(data[i].group);
                            if (_this.isMember) {
                                _this.activities.push(data[i]);
                            }
                            else {
                                console.log("Not in group");
                            }
                        }
                        else if (data[i].activityType == 'Individual') {
                            _this.activities.push(data[i]);
                        }
                    }
                }
                else if (_this.isTeacher) {
                    _this.activities = data;
                }
                _this.taskService.getTaskByModule(_this.module_code).subscribe(function (data) {
                    _this.images = data;
                });
            });
            _this.authService.getProfile().subscribe(function (data) {
                _this.user = data.user;
                console.log(_this.user);
            });
        }, function (err) {
            console.log(err);
            return false;
        });
    };
    ClassroomComponent.prototype.dropped = function (event) {
        var _this = this;
        this.files2 = event.files;
        var _loop_1 = function (droppedFile) {
            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                var fileEntry = droppedFile.fileEntry;
                fileEntry.file(function (file) {
                    _this.file = file;
                    console.log(_this.file);
                    // Here you can access the real file
                    console.log(droppedFile.relativePath, file);
                    var reader = new FileReader();
                    reader.readAsDataURL(_this.file);
                    reader.onload = function (event) {
                        _this.url = event.target.result;
                    };
                    console.log(_this.url);
                });
            }
            else {
                var fileEntry = droppedFile.fileEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        };
        for (var _i = 0, _a = event.files; _i < _a.length; _i++) {
            var droppedFile = _a[_i];
            _loop_1(droppedFile);
        }
    };
    ClassroomComponent.prototype.fileOver = function (event) {
        console.log(event);
    };
    ClassroomComponent.prototype.fileLeave = function (event) {
        console.log(event);
    };
    ClassroomComponent.prototype.delete = function (thisId) {
        console.log(thisId);
        var url = 'http://localhost:3000/files/' + thisId;
        this.http.delete(url)
            .subscribe(function (res) {
            console.log(res);
        });
        location.reload();
    };
    ClassroomComponent.prototype.getTaskDesc = function (title, desc) {
        this.taskName = title;
        this.taskDesc = desc;
    };
    ClassroomComponent.prototype.openModal = function (template) {
        this.activityNameForm.reset();
        this.activityTypeForm.reset();
        this.taskForm.reset();
        this.tasks = [];
        this.modalRef = this.modalService.show(template, this.config);
    };
    ClassroomComponent.prototype.openImagePreview = function (template, actname, title) {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i].activity_name == actname && this.images[i].task_title == title) {
                this.imageSrc = "/api/image/" + this.images[i].originalname;
                this.tempDesc = this.images[i].task_desc;
                this.tempName = this.images[i].task_title;
            }
        }
        this.config.class = "modal-md";
        this.modalRef = this.modalService.show(template, this.config2);
    };
    ClassroomComponent.prototype.openTextPreview = function (template, title, desc) {
        this.tempName = title;
        this.tempDesc = desc;
        this.config.class = "modal-md";
        this.modalRef = this.modalService.show(template, this.config2);
    };
    ClassroomComponent.prototype.addTask = function () {
        this.taskName = this.taskForm.get('taskNameCtrl').value;
    };
    ClassroomComponent.prototype.submitTask = function () {
        this.taskDesc = this.htmlContent;
        console.log(this.taskForm.get('taskNameCtrl').value);
        this.taskType = this.taskForm.get("taskTypeCtrl").value;
        if (this.taskType == 'image') {
            this.taskStr = {
                task_name: this.taskName,
                task_type: "image",
                task_desc: this.taskDesc,
                index: this.taskIndex
            };
            this.tasks.push(this.taskStr);
            var formData = new FormData();
            formData.append('file', this.file);
            formData.append('activityName', this.activityName);
            formData.append('taskName', this.taskName);
            formData.append('taskDesc', this.taskDesc);
            formData.append('taskType', this.taskType);
            formData.append('index', this.taskIndex);
            this.http.post('http://localhost:3000/upload/image/' + this.module_code, formData)
                .subscribe(function (res) {
                console.log(res);
            });
        }
        if (this.taskType == 'text') {
            this.taskStr = { task_name: this.taskName, task_type: "text", task_desc: this.taskDesc, index: this.taskIndex };
            this.tasks.push(this.taskStr);
        }
        console.log(this.tasks);
        this.taskForm.reset();
        this.url = null;
        this.taskName = null;
        this.taskDesc = null;
        this.taskType = null;
        this.selected = null;
    };
    ClassroomComponent.prototype.deleteActivity = function (activityName) {
        this.activityService.deleteActivity(activityName).subscribe(function (data) {
            console.log(data);
        });
        this.taskService.deleteTasksByActivity(activityName).subscribe(function (data) {
            console.log(data);
        });
        location.reload();
    };
    ClassroomComponent.prototype.submitActivity = function () {
        var _this = this;
        this.activityCount++;
        this.activityStr = { activityName: this.activityName, activityType: this.activityType, group: this.studentGroup, module_code: this.module_code, tasks: this.tasks, comments: [], submissions: [] };
        this.activities.push(this.activityStr);
        console.log(this.activityStr);
        this.tasks = [];
        this.taskService.submitActivity(this.activityStr).subscribe(function (data) {
            console.log(data);
            _this.activityNameForm.reset();
            _this.activityTypeForm.reset();
            _this.taskForm.reset();
        }, function (err) {
            console.log(err);
        });
        location.reload();
    };
    ;
    ClassroomComponent.prototype.clearURL = function () {
        this.url = null;
    };
    ClassroomComponent.prototype.onActivityNameSubmit = function () {
        this.activityName = this.activityNameForm.get('activityNameCtrl').value;
        console.log(this.activityName);
    };
    ClassroomComponent.prototype.onActivityTypeSubmit = function () {
        this.groupname = this.activityTypeForm.get('groupNameCtrl').value;
        this.activityType = this.activityTypeForm.get('activityTypeCtrl').value;
        console.log(this.activityType);
        if (this.activityType == 'Group') {
            var studentList = this.activityTypeForm.get("students").value;
            for (var i = 0; i < studentList.length; i++) {
                this.studentGroup.push({
                    first: studentList[i].first,
                    last: studentList[i].last,
                    email: studentList[i].email,
                    groupname: this.groupname
                });
            }
        }
        else {
            console.log("Individual");
        }
    };
    ClassroomComponent.prototype.onTaskNameSubmit = function () {
        this.taskName = this.taskForm.get('taskNameCtrl').value;
        console.log(this.taskName);
        //this.tasks.push(this.task);
    };
    ClassroomComponent.prototype.onTaskTypeSubmit = function () {
        this.taskType = this.taskForm.get("taskTypeCtrl").value;
        console.log(this.taskType);
    };
    ClassroomComponent.prototype.checkGroup = function (group) {
        for (var i = 0; i < group.length; i++) {
            if (this.user.first == group[i].first && this.user.last == group[i].last || this.isTeacher) {
                this.isMember = true;
            }
            else {
                this.isMember = false;
            }
        }
    };
    ClassroomComponent.prototype.group = function () {
        this.isGroup = true;
    };
    ClassroomComponent.prototype.notGroup = function () {
        this.isGroup = false;
    };
    ClassroomComponent.prototype.checkSubmitted = function () {
        return false;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('text'),
        __metadata("design:type", Object)
    ], ClassroomComponent.prototype, "card", void 0);
    ClassroomComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-classroom',
            template: __webpack_require__(/*! ./classroom.component.html */ "./src/app/components/classroom/classroom.component.html"),
            styles: [__webpack_require__(/*! ./classroom.component.css */ "./src/app/components/classroom/classroom.component.css")]
        }),
        __metadata("design:paramtypes", [angular2_lightbox__WEBPACK_IMPORTED_MODULE_10__["Lightbox"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormBuilder"],
            ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_8__["BsModalService"],
            _services_task_service__WEBPACK_IMPORTED_MODULE_3__["TaskService"],
            _services_class_service__WEBPACK_IMPORTED_MODULE_1__["ClassService"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _services_activity_service__WEBPACK_IMPORTED_MODULE_4__["ActivityService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"], _angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClient"]])
    ], ClassroomComponent);
    return ClassroomComponent;
}());



/***/ }),

/***/ "./src/app/components/create-class/create-class.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/create-class/create-class.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvY3JlYXRlLWNsYXNzL2NyZWF0ZS1jbGFzcy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/create-class/create-class.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/create-class/create-class.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 class=\"page-header\">Create a Class</h2>\r\n<form (submit)=\"onCreateSubmit()\">\r\n\t<div class=\"form-group\">\r\n\t\t<label>Title</label>\r\n\t\t<input type=\"text\" [(ngModel)]=\"title\" name=\"title\" class=\"form-control\">\r\n\t</div>\r\n\t<div class=\"form-group\">\r\n\t\t<label>Module Code</label>\r\n\t\t<input type=\"text\" [(ngModel)]=\"module_code\" name=\"module_code\" class=\"form-control\">\r\n\t</div>\r\n\t<div class=\"form-group\">\r\n\t\t<label>Email</label>\r\n\t\t<input type=\"text\" [(ngModel)]=\"email\" name=\"email\" class=\"form-control\">\r\n\t</div>\r\n\r\n<input type='submit' class=\"btn btn-primary\" value=\"Submit\">\r\n</form>"

/***/ }),

/***/ "./src/app/components/create-class/create-class.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/create-class/create-class.component.ts ***!
  \*******************************************************************/
/*! exports provided: CreateClassComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateClassComponent", function() { return CreateClassComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular2-flash-messages */ "./node_modules/angular2-flash-messages/module/index.js");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(angular2_flash_messages__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_class_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/class.service */ "./src/app/services/class.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_validate_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/validate.service */ "./src/app/services/validate.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CreateClassComponent = /** @class */ (function () {
    function CreateClassComponent(validateService, flashMessage, classService, router, zone) {
        this.validateService = validateService;
        this.flashMessage = flashMessage;
        this.classService = classService;
        this.router = router;
        this.zone = zone;
        this.isTeacher = false;
    }
    CreateClassComponent.prototype.ngOnInit = function () {
    };
    CreateClassComponent.prototype.onCreateSubmit = function () {
        var _this = this;
        var theStr = "";
        var theClass = {
            title: this.title,
            module_code: this.module_code,
            teacher: {
                title: this.title,
                email: this.email
            }
        };
        if (!this.validateService.validateClass(theClass)) {
            this.flashMessage.show("Fill in all fields", { cssClass: 'alert-danger', timeout: 3000 });
            return false;
        }
        else {
            console.log("ALL GOOD");
        }
        this.classService.createClass(theClass).subscribe(function (suc) {
            _this.classService.storeClassData(suc.module.module_code, suc.module.email);
            //console.log(suc.module);
            _this.flashMessage.show("Class Created", { cssClass: 'alert-success', timeout: 3000 });
            _this.router.navigate(['/dashboard']);
        }, function (err) {
            _this.flashMessage.show("Something went wrong", { cssClass: 'alert-danger', timeout: 3000 });
            //this.router.navigate(['/']);
            console.log(err);
        });
    };
    CreateClassComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                angular2_flash_messages__WEBPACK_IMPORTED_MODULE_1__["FlashMessagesModule"].forRoot()
            ]
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-create-class',
            template: __webpack_require__(/*! ./create-class.component.html */ "./src/app/components/create-class/create-class.component.html"),
            styles: [__webpack_require__(/*! ./create-class.component.css */ "./src/app/components/create-class/create-class.component.css")]
        }),
        __metadata("design:paramtypes", [_services_validate_service__WEBPACK_IMPORTED_MODULE_4__["ValidateService"],
            angular2_flash_messages__WEBPACK_IMPORTED_MODULE_1__["FlashMessagesService"],
            _services_class_service__WEBPACK_IMPORTED_MODULE_2__["ClassService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]])
    ], CreateClassComponent);
    return CreateClassComponent;
}());



/***/ }),

/***/ "./src/app/components/dashboard/dashboard.component.css":
/*!**************************************************************!*\
  !*** ./src/app/components/dashboard/dashboard.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/dashboard/dashboard.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/dashboard/dashboard.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n <mat-card id=\"sideNav\" style=\"border-top: 0px; position: fixed;\">\r\n    <div class=\"row profile\">\r\n      <div class=\"profile-sidebar\">\r\n        \r\n        <div class=\"profile-userpic\">\r\n          <img src=\"http://keenthemes.com/preview/metronic/theme/assets/admin/pages/media/profile/profile_user.jpg\" class=\"img-responsive\" alt=\"\">\r\n        </div>\r\n        \r\n        <div class=\"profile-usertitle\">\r\n          <div class=\"profile-usertitle-name\">\r\n            {{user?.first}} {{user?.last}}\r\n          </div>\r\n          <div class=\"profile-usertitle-job\">\r\n            {{user?.role}}\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"profile-usermenu\">\r\n          <ul class=\"nav\">\r\n            <li *ngIf=\"teacher\">\r\n              <a (click)=\"openModal(create_class)\">\r\n                <i class=\"glyphicon glyphicon-plus\"></i>\r\n                 Create a Class\r\n              </a>\r\n            </li>\r\n            <li *ngIf=\"!teacher\">\r\n              <a (click)=\"openModal(enrollTemp)\">\r\n              <i class=\"glyphicon glyphicon-user\"></i>\r\n              Enroll </a>\r\n            </li>\r\n            <li (click)=\"openHelpDialog()\">\r\n              <a>\r\n              <i class=\"glyphicon glyphicon-flag\"></i>\r\n              Help </a>\r\n            </li>\r\n            <li>\r\n              <a>\r\n                <i class=\"glyphicon glyphicon-cog\"></i>\r\n                Settings\r\n              </a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n  </div>\r\n   </mat-card>\r\n\r\n  <div style=\"height: 100%; position: fixed; margin-left: 22%; width: 78%; overflow-y: scroll;\">\r\n    <div style=\"height: auto;\">\r\n    <mat-card style=\"padding-top: 16px; margin-top: 3%; width: 100%;\" id=\"tab\" class=\"col-md-9\">\r\n    <h3>Your Classes\r\n  </h3>\r\n    <div class=\"table-responsive\">\r\n    <table class=\"table table-striped table table-bordered\" *ngIf=\"classes\">\r\n    <thead class=\"thead-dark\">\r\n      <tr>\r\n        <th>Class</th>\r\n        <th>Module Code</th>\r\n        <th>Teacher</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody *ngIf=\"classes.length > 0 && !renderer\">\r\n      <tr *ngFor=\"let class of classes\">\r\n        <td>{{class.title}}</td>\r\n        <td><a [routerLink]=\"['/classroom/',class.module_code]\" (click)=\"storeCode(class.module_code, class.teacher.email)\">{{class.module_code}}</a></td>\r\n        <ng-template #popTemplate>\r\n        Email: {{class.teacher.email}}</ng-template>\r\n        <td id=\"teacher\"><a [popover]=\"popTemplate\" popoverTitle=\"Teacher Info\" triggers=\"mouseenter:mouseleave\">{{class.teacher.first}} {{class.teacher.last}}</a></td>\r\n      </tr>\r\n      </tbody>\r\n  </table>\r\n  <h3 style=\"text-align: center;\" *ngIf=\"classes.length == 0\">You have no classses yet</h3>\r\n</div>\r\n  </mat-card>\r\n</div>\r\n\r\n<div class=\"columns\" id=\"cardContainer\" style=\"height: 100%; margin-top: 20px;\">\r\n<div *ngFor=\"let act of activityArray; let i = index\" class=\"card column is-one-third\" style=\"width: 23rem;\">\r\n  <img *ngIf=\"act.activityType=='Group'\" src=\"https://img.icons8.com/cotton/64/000000/groups.png\">\r\n  <img *ngIf=\"act.activityType=='Individual'\" src=\"https://img.icons8.com/cotton/64/000000/person-male.png\">\r\n  <div class=\"card-body\">\r\n    <h4 class=\"card-title\">{{act.activityName}}</h4>\r\n    <h4 style=\"height: auto;\" class=\"card-text\">{{act.activityType}}</h4>\r\n    <h4 style=\"height: auto;\" class=\"card-text\">{{act.module_code}}</h4>\r\n    <div>\r\n    <a *ngIf=\"act.activityType=='Individual'\" class=\"btn btn-primary\" [routerLinkActive]=\"['active']\" [routerLink]=\"['/activity/',act.activityName]\">Go to Activity</a>\r\n     <a *ngIf=\"act.activityType=='Group'\" class=\"btn btn-primary\" [routerLinkActive]=\"['active']\" [routerLink]=\"['/group/',act.activityName]\">Go to Activity</a>\r\n   </div>\r\n  </div>\r\n  <div class=\"is-clearfix\" *ngIf=\"i % 3 == 0\"></div>\r\n</div>\r\n\r\n</div>\r\n</div>\r\n\r\n<ng-template #create_class>\r\n  <div class=\"modal-header\">\r\n    <h4 class=\"modal-title pull-left\">New Class</h4>\r\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\r\n      <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <form (submit)=\"createClass()\">\r\n  <div class=\"form-group\">\r\n  <label>Title</label>\r\n  <input type=\"text\" class=\"form-control\" [(ngModel)]=\"newTitle\" name=\"newTitle\">\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label>Module Code</label>\r\n    <input type=\"text\" class=\"form-control\" [(ngModel)]=\"newModule_code\" name=\"newModule_code\">\r\n  </div>\r\n  <input type=\"submit\" (click)=\"modalRef.hide()\"  class=\"btn btn-primary\" value=\"Create Class\">\r\n</form>\r\n  </div>\r\n</ng-template>\r\n\r\n<ng-template #enrollTemp>\r\n  <div class=\"modal-header\">\r\n    <h4 class=\"modal-title pull-left\">Enroll</h4>\r\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\r\n      <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <form (submit)=\"enroll()\">\r\n  <div class=\"form-group\">\r\n    <label>Module Code</label>\r\n    <input type=\"text\" class=\"form-control\" [(ngModel)]=\"enrollCode\" name=\"enrollCode\">\r\n  </div>\r\n  <input type=\"submit\" (click)=\"modalRef.hide()\"  class=\"btn btn-primary\" value=\"Enroll\">\r\n</form>\r\n  </div>\r\n</ng-template>\r\n\r\n<style>\r\n/* Profile container */\r\n\r\n/* Profile sidebar */\r\n.profile-sidebar {\r\n  background: #fff;\r\n}\r\n\r\n.profile-userpic img {\r\n  float: none;\r\n  margin: 0 auto;\r\n  width: 50%;\r\n  height: 50%;\r\n  -webkit-border-radius: 50% !important;\r\n  -moz-border-radius: 50% !important;\r\n  border-radius: 50% !important;\r\n}\r\n\r\n.profile-usertitle {\r\n  text-align: center;\r\n  margin-top: 20px;\r\n}\r\n\r\n.profile-usertitle-name {\r\n  color: black;\r\n  font-size: 20px;\r\n  font-weight: 600;\r\n  margin-bottom: 7px;\r\n}\r\n\r\n.profile-usertitle-job {\r\n  text-transform: capitalize;\r\n  color: black;\r\n  font-size: 20px;\r\n  font-weight: 600;\r\n  margin-bottom: 15px;\r\n}\r\n\r\n.profile-userbuttons {\r\n  text-align: center;\r\n  margin-top: 10px;\r\n}\r\n\r\n.profile-userbuttons .btn {\r\n  text-transform: capitalize;\r\n  font-size: 20px;\r\n  font-weight: 600;\r\n  padding: 6px 15px;\r\n  margin-right: 5px;\r\n}\r\n\r\n.profile-userbuttons .btn:last-child {\r\n  margin-right: 0px;\r\n}\r\n    \r\n.profile-usermenu {\r\n  margin-top: 30px;\r\n}\r\n\r\n.profile-usermenu ul li {\r\n  border-bottom: 1px solid #f0f4f7;\r\n}\r\n\r\n.profile-usermenu ul li:last-child {\r\n  border-bottom: none;\r\n}\r\n\r\n.profile-usermenu ul li a {\r\n  color: black;\r\n  font-size: 20px;\r\n  font-weight: 400;\r\n}\r\n\r\n.profile-usermenu ul li a i {\r\n  margin-right: 8px;\r\n  font-size: 20px;\r\n}\r\n\r\n.profile-usermenu ul li a:hover {\r\n  background-color: #fafcfd;\r\n  color: black;\r\n}\r\n\r\n.profile-usermenu ul li.active {\r\n  border-bottom: none;\r\n}\r\n\r\n.profile-usermenu ul li.active a {\r\n  color: black;\r\n  background-color: #f6f9fb;\r\n  border-left: 2px solid black;\r\n  margin-left: -2px;\r\n}\r\n\r\n/* Profile Content */\r\n.profile-content {\r\n  padding: 5px;\r\n  background: #fff;\r\n  min-height: 460px;\r\n}\r\n.profile-usertitle-name{\r\ntext-transform: capitalize;\r\n}\r\nth, td{\r\n  color: black;\r\n  font-size: 20px;\r\n}\r\na{\r\n  color: blue;\r\n  cursor: pointer;\r\n}\r\n#tab{\r\n  padding-top: 50px;\r\n}\r\n#teacher{\r\n  text-transform: capitalize;\r\n}\r\n\r\n#sideNav{\r\n    width: 20%;\r\n    height: 90vh;\r\n    position: fixed;\r\n}\r\n#activityDiv{\r\n    height: 45vh;\r\n    position: fixed;\r\n    width: 135vh;\r\n    margin-top: 2%;\r\n  }\r\n#tableDiv{\r\n    width: 135vh;\r\n    height: 30%;\r\n}\r\nmat-card{\r\n  border-style: solid !important;\r\n  border-width: 2px;\r\n}\r\n.card{\r\n  border-style: solid;\r\n  margin-right: 20px;\r\n  display: inline-block;\r\n  text-align: center;\r\n  background-color: white;\r\n  width: 300px;\r\n  min-height: 250px;\r\n  height: auto;\r\n  margin-top: 20px;\r\n  \r\n}\r\n.card img{\r\n  height: 64px;\r\n  width: 65px;\r\n}\r\nbody{\r\n  height: 100%;\r\n  overflow-y: auto;\r\n  background-color: whitesmoke;\r\n}\r\n</style>"

/***/ }),

/***/ "./src/app/components/dashboard/dashboard.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/dashboard/dashboard.component.ts ***!
  \*************************************************************/
/*! exports provided: module_code, DashboardComponent, HelpDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "module_code", function() { return module_code; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HelpDialogComponent", function() { return HelpDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_class_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/class.service */ "./src/app/services/class.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm5/ngx-bootstrap-modal.js");
/* harmony import */ var _services_activity_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/activity.service */ "./src/app/services/activity.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var module_code = module_code;
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(_ngZone, dialog, activityService, modalService, classService, authService, router, _location) {
        this._ngZone = _ngZone;
        this.dialog = dialog;
        this.activityService = activityService;
        this.modalService = modalService;
        this.classService = classService;
        this.authService = authService;
        this.router = router;
        this._location = _location;
        this.flipDiv = false;
        this.renderer = false;
        this.classIds = [];
        this.classes = [];
        this.show = false;
        this.teacher = false;
        this.config = {
            animated: true,
            keyboard: true
        };
        this.students = [];
        this.activityArray = [];
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getProfile().subscribe(function (data) {
            console.log(data);
            _this.email = data.user.email;
            _this.user = data.user;
            _this.classes = data.user.classes;
            console.log(_this.classes);
            _this.first = data.user.first;
            _this.last = data.user.last;
            for (var i = 0; i < _this.classes.length; i++) {
                _this.activityService.getActivitiesByModule(_this.classes[i].module_code)
                    .subscribe(function (data) {
                    if (data.length == 0) {
                        console.log("empty");
                    }
                    else {
                        for (var j = 0; j < data.length; j++) {
                            _this.activityArray.push(data[j]);
                            console.log(_this.activityArray);
                        }
                    }
                });
            }
            if (_this.authService.isTeacher()) {
                _this.teacher = true;
            }
        }, function (err) {
            console.log(err);
            return false;
        });
        console.log(this.classes);
        this.classService.getStudents().subscribe(function (data) {
            _this.students = data;
        });
    };
    DashboardComponent.prototype.storeCode = function (module_code, email) {
        this.classService.storeClassData(module_code, email);
    };
    DashboardComponent.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template, this.config);
    };
    DashboardComponent.prototype.createClass = function () {
        var _this = this;
        this.class = {
            title: this.newTitle,
            module_code: this.newModule_code,
            teacher: {
                email: this.email,
                first: this.user.first,
                last: this.user.last
            }
        };
        this.classService.createClass(this.class).subscribe(function (data) {
            if (data.status == true) {
                console.log(data);
                _this.classes.push(_this.class);
            }
            else {
                console.log(data);
            }
        });
    };
    DashboardComponent.prototype.enroll = function () {
        var _this = this;
        window.location.reload();
        var user_ = {
            first: this.first,
            last: this.last,
            email: this.email,
            password: this.password
        };
        //console.log(this.enrollModuleCode);
        this.classService.enrollClass(this.enrollCode, user_).subscribe(function (data) {
            if (data.status == true) {
                console.log(data);
                _this.classService.getClassByModule(_this.enrollCode).subscribe(function (data) {
                    if (data.status == true) {
                        _this.classes.push(data);
                    }
                    else {
                        console.log(data);
                    }
                });
            }
            else {
                console.log(data);
            }
        }, function (err) {
            console.log(err);
        });
    };
    DashboardComponent.prototype.flipDivFunc = function () {
        if (this.flipDiv) {
            this.flipDiv = false;
        }
        else {
            this.flipDiv = true;
        }
    };
    DashboardComponent.prototype.openHelpDialog = function () {
        var dialogRef = this.dialog.open(HelpDialogComponent, {
            width: "350px"
        });
    };
    DashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/components/dashboard/dashboard.component.html"),
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/components/dashboard/dashboard.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"],
            _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatDialog"],
            _services_activity_service__WEBPACK_IMPORTED_MODULE_5__["ActivityService"],
            ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_4__["BsModalService"],
            _services_class_service__WEBPACK_IMPORTED_MODULE_2__["ClassService"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_common__WEBPACK_IMPORTED_MODULE_6__["Location"]])
    ], DashboardComponent);
    return DashboardComponent;
}());

var HelpDialogComponent = /** @class */ (function () {
    function HelpDialogComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    HelpDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'help-dialog',
            template: __webpack_require__(/*! ./help-dialog.html */ "./src/app/components/dashboard/help-dialog.html"),
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_7__["MatDialogRef"]])
    ], HelpDialogComponent);
    return HelpDialogComponent;
}());



/***/ }),

/***/ "./src/app/components/dashboard/help-dialog.html":
/*!*******************************************************!*\
  !*** ./src/app/components/dashboard/help-dialog.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title style=\"margin-bottom: 5px;\">Welcome to your Dashboard!</h1>\r\n<mat-divider></mat-divider>\r\n<div style=\"text-align: center; margin-top: 15px; height: 60%;\" mat-dialog-content>\r\n\r\n  <p class=\"lead\">Here you have direct access to all your classes and activities!\r\n  \t\t\t\t\tClick a module code in the table to navigate to that class or jump straight into an activity below!</p>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button-stroked mat-dialog-close cdkFocusInitial>Ok</button>\r\n</div>"

/***/ }),

/***/ "./src/app/components/group/group-image-preview-dialog.html":
/*!******************************************************************!*\
  !*** ./src/app/components/group/group-image-preview-dialog.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"data\" style=\"text-align: center; height: auto;\" mat-dialog-content>\r\n  <img style=\"width: 700px; height: 450px;\" src=\"/api/image/{{data.image}}\">\r\n</div>\r\n\r\n<style>\r\n\tdiv{\r\n\t\tmax-height: 75vh;\r\n\t\tpadding: 0px 0px 0px 0px;\r\n\t}\r\n\t.mat-dialog-container{\r\n\t\tpadding: 0px;\r\n\t}\r\n</style>"

/***/ }),

/***/ "./src/app/components/group/group.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/group/group.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvZ3JvdXAvZ3JvdXAuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/components/group/group.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/group/group.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div id=\"mainDiv\">\r\n<mat-card class=\"main\" id=\"main\" >\r\n\t <mat-tab-group style=\"text-transform: capitalize; height: 100%;\" (selectedTabChange)=\"tabChange($event)\">\r\n \t<mat-tab *ngFor=\"let task of activity?.tasks; let i = index\" label='Task {{i + 1}}'>\r\n        <div class=\"card-body\" *ngIf=\"task.task_type == 'image'\">\r\n\r\n<ngx-flip id=\"flipCard\" [flip]=\"flipDiv\" >\r\n   <div class=\"wrapper\" front style=\"height: 310px; background-color: white; border-style: ridge; text-align: center;\">\r\n      <img style=\"width: 500px; height: 300px; margin-left: 0;\" src=\"/api/image/{{images[i]?.originalname}}\" (click)=\"openPreviewDialog(i)\" class=\"img-thumbnail\">\r\n      <i id=\"flipIcon\" matTooltip=\"Flip\" (click)=\"flipDivFunc()\" style=\"font-size: 25px; font-weight: bolder;\" class=\"glyphicon glyphicon-refresh\"></i>\r\n      <i id=\"helpIcon\" (click)=\"openImageHelpDialog()\" matTooltip=\"Help\" class=\"fa fa-question\" style=\"font-size: 25px; font-weight: bolder;\"></i>\r\n    </div>\r\n   <div class=\"wrapper\" style=\"height: 300px; background-color: whitesmoke; border-style: ridge; text-align: center;\" back>\r\n    <div id=\"taskInfoDiv\" style=\"text-align: left; font-size: 18px; margin-bottom: 22%;\">\r\n      <h3 style=\"margin-left: 5px;\">{{task.task_name}}</h3>\r\n      <mat-divider></mat-divider>\r\n      <blockquote style=\"margin-left: 10px;\" style=\"margin-top: 20px;\"><i>{{task.task_desc}}</i></blockquote>\r\n    </div>\r\n  <div id=\"flipCardButtons\">\r\n  <a href=\"/annotate/{{activity.activityType}}/{{activityName}}/{{task.task_name}}\" class=\"btn btn-primary\" *ngIf=\"!checkSubmitted(task.task_name) && !isTeacher\">Annotate</a>\r\n  <button class=\"btn btn-primary\" [matMenuTriggerFor]=\"menu\" *ngIf=\"checkSubmitted(task.task_name) || isTeacher\">View Submissions</button>\r\n    <mat-menu #menu=\"matMenu\">\r\n      <div *ngIf=\"submissionArray.length > 0\">\r\n      <a href=\"view/annotations/{{submission.email}}/{{activityName}}/{{task.task_name}}\" mat-menu-item *ngFor=\"let submission of submissionArray\">{{submission.first}} {{submission.last}}</a>\r\n    </div>\r\n    <p style=\"font-size: 20px; text-align: center;\" *ngIf=\"submissionArray.length == 0\">No submissions have been made yet!</p>\r\n    </mat-menu>\r\n  <button class=\"btn btn-danger\" (click)=\"flipDivFunc()\">Back</button>\r\n  </div>\r\n</div>\r\n </ngx-flip>\r\n\r\n</div>\r\n\r\n\t <div class=\"card\" *ngIf=\"task.task_type == 'text'\" style=\"border-style: none;\">\r\n  <div id=\"textCardBody\" class=\"card-body\" style=\"text-align: left; min-height: 200px;\">\r\n    <i style=\"float: right; font-size: 30px;\" matTooltip=\"Help\" class=\"fa fa-question\"></i>\r\n      <div style=\"background-color: white; padding-top: 0px; margin-bottom: 15px;\">\r\n  <div>\r\n    <h2 class=\"display-4\">{{task.task_name}}</h2>\r\n    <mat-divider></mat-divider>\r\n    <blockquote style=\"margin-top: 50px;\" class=\"lead\"[innerHtml]=\"task.task_desc\"></blockquote>\r\n  </div>\r\n</div>\r\n\r\n  </div>\r\n</div>\r\n\t</mat-tab>\r\n </mat-tab-group>\r\n\r\n<mat-card id=\"commentDiv\">\r\n  <div id=\"heading\" style=\"border-bottom-style: ridge; \">\r\n    <h3 style=\"padding-left: 16px; margin-top: 0px;\"> Comments&nbsp;&nbsp;<i class=\"fa fa-comments\"></i>&nbsp;{{comments?.length}}\r\n    <a style=\"color: black; float: right; padding-right: 5px;\"><i matTooltip=\"Add a Comment\" (click)=\"addComment()\" class=\"glyphicon glyphicon-plus\"></i></a>\r\n  </h3>\r\n  </div>\r\n  <div>\r\n    <p style=\"text-align: center; margin-top: 20px;\" *ngIf=\"comments.length == 0\"><i>No comments yet! Be the first to contribute...</i></p>\r\n    <mat-list style=\"min-height: 100px;\" *ngIf=\"comments.length > 0\">\r\n      <mat-list-item *ngFor=\"let comment of comments; let i = index\" style=\"height: 100px; height: auto; border-bottom-style: ridge;\">\r\n        <div style=\"width: 100%;\">\r\n        <h5 style=\"float: right;\"><i>{{ comment.time | date:'EEEE, MMMM d, h:mm:ss a' }} </i></h5>\r\n        <h4 style=\"text-transform: capitalize;\">{{comment.first}} {{comment.last}}</h4>\r\n        <div>\r\n          <a><i matTooltip=\"Delete Comment\" style=\"float: right; color: black; font-weight: bold;\" class=\"glyphicon glyphicon-trash\" (click)=\"delete(i)\"></i></a>\r\n        <p [innerHTML]=\"comment.comment\">\r\n        </p>\r\n      </div>\r\n      </div>\r\n      </mat-list-item>\r\n    </mat-list>\r\n  </div>\r\n  <div style=\"height: 200px;\" *ngIf=\"add\">\r\n   <app-ngx-editor [config]=\"editorConfig\" height=\"200px\" minHeight=\"200px\" [placeholder]=\"placeholder\" [spellcheck]=\"true\" [(ngModel)]=\"htmlContent\" name=\"htmlContent\"></app-ngx-editor>\r\n   <div>\r\n   <button type=\"button\" class=\"btn btn-primary\" style=\"float: right;\" (click)=\"submitComment(htmlContent)\">Submit</button>\r\n   <button type=\"button\" class=\"btn btn-warning\" style=\"float: right;\" (click)=\"clear()\">Clear</button>\r\n   <button type=\"button\" class=\"btn btn-danger\" style=\"float: right;\" (click)=\"cancel()\">Cancel</button>\r\n  </div>\r\n</div>\r\n</mat-card>\r\n\r\n</mat-card>\r\n\r\n<mat-card class=\"sidenav\" style=\"padding-top: 0px;\">\r\n\t<div style=\"border-bottom-style: ridge; padding-top: 20px; background-color: whitesmoke;\">\r\n\t<h4 style=\"padding-left: 16px; margin-top: 0px;\">Group Members</h4>\r\n\t</div>\r\n  <div>\r\n\t<mat-list style=\"padding-top: 0px;\">\r\n\t\t<mat-list-item *ngFor=\"let student of students\" style=\"border-bottom-style: ridge; text-transform: capitalize;\" >\r\n\t\t\t<div>\r\n\t\t\t{{student.first}} {{student.last}}\r\n\t\t</div>\r\n\t\t</mat-list-item>\r\n</mat-list>\r\n</div>\r\n</mat-card>\r\n\r\n\r\n\r\n\r\n\r\n<style>\r\n body{\r\n    background-color: rgb(245,245,245);\r\n  }\r\n\r\n\r\n.sidenav {\r\n  height: auto;\r\n  z-index: 999;\r\n  right: 0;\r\n  background-color: white;\r\n  overflow-x: hidden;\r\n  padding-left: 0px;\r\n  padding-right: 0px;\r\n  border-style: inset;\r\n  width: 25%;\r\n  float: right;\r\n  margin-top: 20px;\r\n  height: 85vh;\r\n  margin-right: 20px;\r\n}\r\n.sidenav a {\r\n  padding: 6px 8px 6px 16px;\r\n  text-decoration: none;\r\n  font-size: 25px;\r\n  color: white;\r\n  display: block;\r\n}\r\n\r\n.sidenav a:hover {\r\n  color: grey;\r\n} \r\n\r\n.main {\r\n   /* Increased text to enable scrolling */\r\n  left: 0;\r\n  border-style: outset;\r\n  height: 100%;\r\n}\r\n#main{\r\n    width: 65%;\r\n    position: absolute;\r\n    margin-top: 20px;\r\n    height: auto;\r\n    margin-left: 20px;\r\n}\r\n\r\n#mainDiv{\r\n\tbackground-color: rgb(245,245,245);\r\n\r\n}\r\n#commentDiv{\r\n    width: 100%%;\r\n    height: auto;\r\n    min-height: 22%;\r\n    padding-right: 0px;\r\n    padding-left: 0px;\r\n    padding-top: 0px;\r\n}\r\na:hover {\r\n cursor:pointer;\r\n}\r\n#delete: hover{\r\n\r\n}\r\nmat-card{\r\n\tborder-style: solid !important;\r\n\tborder-width: 2px;\r\n}\r\nimg:hover{\r\n  cursor: pointer;\r\n}\r\n.wrapper {\r\n   position: relative;\r\n}\r\n\r\n#flipIcon {\r\n   position: absolute;\r\n   top: 20px;\r\n   left: 20px;\r\n}\r\n#helpIcon{\r\n  position: absolute;\r\n   top: 20px;\r\n   right: 20px;\r\n}\r\ni:hover{\r\n  cursor: pointer;\r\n}\r\n#flipCardButtons .btn{\r\n  display: block;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n  width: 160px;\r\n}\r\n#taskInfoDiv p{\r\n  padding: 10px;\r\n}\r\n\r\n#flipCard{\r\n    height: 310px;\r\n    width: 500px;\r\n    margin-right: auto;\r\n    margin-left: auto;\r\n    margin-bottom: 20px;\r\n    overflow-x: hidden;\r\n    overflow-y: hidden;\r\n    margin-top: 10px;\r\n}\r\n#textCardBody{\r\n  background-color: white;\r\n}\r\n#heading{\r\n    border-bottom-style: ridge;\r\n    margin-top: 0px;\r\n    height: 100%;\r\n    padding-top: 20px;\r\n    background-color: whitesmoke;\r\n}\r\n\r\n</style>"

/***/ }),

/***/ "./src/app/components/group/group.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/group/group.component.ts ***!
  \*****************************************************/
/*! exports provided: GroupComponent, GroupImagePreviewComponent, ImageHelpDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupComponent", function() { return GroupComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupImagePreviewComponent", function() { return GroupImagePreviewComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageHelpDialogComponent", function() { return ImageHelpDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_class_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/class.service */ "./src/app/services/class.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_activity_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/activity.service */ "./src/app/services/activity.service.ts");
/* harmony import */ var _services_task_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/task.service */ "./src/app/services/task.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var GroupComponent = /** @class */ (function () {
    function GroupComponent(dialog, classService, authService, taskService, activityService, route, router) {
        this.dialog = dialog;
        this.classService = classService;
        this.authService = authService;
        this.taskService = taskService;
        this.activityService = activityService;
        this.route = route;
        this.router = router;
        this.currentTab = 0;
        this.addingComment = false;
        this.flipDiv = false;
        this.answer = false;
        this.add = false;
        this.students = [];
        this.comments = [];
        this.images = [];
        this.submissionArray = [];
        this.editorConfig = {
            "editable": true,
            "spellcheck": true,
            "translate": "yes",
            "enableToolbar": true,
            "showToolbar": true,
            "placeholder": "Enter text here...",
            "imageEndPoint": "",
            "toolbar": [
                ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
                ["fontName", "fontSize", "color"],
                ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"]
            ]
        };
    }
    GroupComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.authService.isTeacher()) {
            this.isTeacher = true;
        }
        else {
            this.isTeacher = false;
        }
        this.activityName = this.route.snapshot.paramMap.get('activityname');
        console.log(this.activityName);
        this.activityService.getComments(this.activityName).subscribe(function (data) {
            console.log(data);
            _this.comments = data;
        });
        this.authService.getProfile().subscribe(function (data) {
            _this.user = data.user;
            _this.email = data.user.email;
        });
        this.activityService.getActivityByTitle(this.activityName).subscribe(function (data) {
            console.log(data);
            _this.activity = data;
            _this.submissionArray = data.submissions;
            console.log(_this.submissionArray);
            _this.moduleCode = data.module_code;
            _this.students = data.group;
            _this.taskService.getFilesByActName(_this.activityName).subscribe(function (data) {
                _this.images = data;
                console.log(_this.images);
            });
            console.log(_this.activity);
            console.log(_this.students);
        });
    };
    GroupComponent.prototype.tabChange = function (event) {
        this.currentTab = event.index;
        console.log(this.currentTab);
    };
    GroupComponent.prototype.addComment = function () {
        this.add = true;
    };
    GroupComponent.prototype.submitComment = function (comment) {
        this.commentStr = { first: this.user.first, last: this.user.last, comment: comment, time: Date.now() };
        this.comments.push(this.commentStr);
        this.htmlContent = "";
        this.add = false;
        console.log(this.comments[0]);
        this.activityService.updateComments(this.activityName, this.commentStr).subscribe(function (data) {
            console.log(data);
        });
    };
    GroupComponent.prototype.cancel = function () {
        this.add = false;
    };
    GroupComponent.prototype.clear = function () {
        this.htmlContent = "";
    };
    GroupComponent.prototype.delete = function (key) {
        this.comments.splice(key, 1);
    };
    GroupComponent.prototype.checkSubmitted = function (taskName) {
        for (var i = 0; i < this.submissionArray.length; i++) {
            if (this.submissionArray[i] != null) {
                if (this.submissionArray[i].email == this.email && this.submissionArray[i].taskName == taskName) {
                    return true;
                }
            }
        }
        return false;
    };
    GroupComponent.prototype.flipDivFunc = function () {
        this.flipDiv = !this.flipDiv;
    };
    GroupComponent.prototype.openPreviewDialog = function (index) {
        var dialogRef = this.dialog.open(GroupImagePreviewComponent, {
            data: {
                image: this.images[index].originalname
            },
            panelClass: 'custom-dialog-container'
        });
    };
    GroupComponent.prototype.openImageHelpDialog = function () {
        var dialogRef = this.dialog.open(ImageHelpDialogComponent, {
            width: "300px"
        });
    };
    GroupComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-group',
            template: __webpack_require__(/*! ./group.component.html */ "./src/app/components/group/group.component.html"),
            styles: [__webpack_require__(/*! ./group.component.css */ "./src/app/components/group/group.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialog"],
            _services_class_service__WEBPACK_IMPORTED_MODULE_1__["ClassService"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _services_task_service__WEBPACK_IMPORTED_MODULE_4__["TaskService"],
            _services_activity_service__WEBPACK_IMPORTED_MODULE_3__["ActivityService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]])
    ], GroupComponent);
    return GroupComponent;
}());

var GroupImagePreviewComponent = /** @class */ (function () {
    function GroupImagePreviewComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    GroupImagePreviewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'preview-dialog',
            template: __webpack_require__(/*! ./group-image-preview-dialog.html */ "./src/app/components/group/group-image-preview-dialog.html"),
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_6__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialogRef"], Object])
    ], GroupImagePreviewComponent);
    return GroupImagePreviewComponent;
}());

var ImageHelpDialogComponent = /** @class */ (function () {
    function ImageHelpDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ImageHelpDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'preview-dialog',
            template: __webpack_require__(/*! ./image-help-dialog.html */ "./src/app/components/group/image-help-dialog.html"),
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_6__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialogRef"], Object])
    ], ImageHelpDialogComponent);
    return ImageHelpDialogComponent;
}());



/***/ }),

/***/ "./src/app/components/group/image-help-dialog.html":
/*!*********************************************************!*\
  !*** ./src/app/components/group/image-help-dialog.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div style=\"text-align: center; height: auto; \" mat-dialog-content>\r\n  <p style=\"font-size: 20px;\">This is an image task! Flip the card, complete the task, then come back here where you will be able to see what your fellow group members submitted!</p>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button-stroked mat-dialog-close cdkFocusInitial>Ok</button>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/login/login.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/login/login.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbG9naW4vbG9naW4uY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/components/login/login.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/login/login.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ngx-flip id=\"loginCard\"  [flip]=\"flipDiv\">\r\n   <div front style=\"background-color: white; height: 55vh; border-style: ridge; border-radius: 20px;\">\r\n   \t<div style=\"text-align: center; padding-top: 5%;\">\r\n    <h1 class=\"display-4\">Welcome to Classroom</h1>\r\n    <p style=\"margin-left: 10%; margin-right: 10%;\" class=\"lead\">Log in to resume your Classroom experience or register an account above!</p>\r\n  </div>\r\n  <div style=\"text-align: center;\">\r\n  \t<button style=\"margin-bottom: 2%;\" (click)=\"flipDivFunc()\" class=\"btn btn-primary btn-lg\">Log In</button>\r\n  \t<button class=\"btn btn-primary btn-lg\" (click)=\"openModal(register)\">Register</button>\r\n  </div>\r\n   </div>\r\n\r\n   <div back style=\"background-color: white; height: 55vh; border-style: ridge; border-radius: 20px;\">\r\n   \t<div style=\"text-align: center; padding-top: 5%;\">\r\n   \t<h1 class=\"display-4\">Log In</h1>\r\n   </div>\r\n<form style=\"margin-left: 10%; margin-right: 10%;\">\r\n\t<div class=\"form-group\">\r\n\t\t<label>Email</label>\r\n\t\t<input type=\"text\" class=\"form-control\" [(ngModel)]=\"email\" name=\"email\">\r\n\t</div>\r\n\t<div class=\"form-group\">\r\n\t\t<label>Password</label>\r\n\t\t<input type=\"password\" class=\"form-control\" [(ngModel)]=\"password\" name=\"password\">\r\n\t</div>\r\n\t<button type=\"button\" (click)=\"onLoginSubmit()\" style=\"margin-bottom: 2%;\" class=\"btn btn-primary\">Log In</button>\r\n\t<button class=\"btn btn-primary\" (click)=\"flipDivFunc()\">Back</button>\r\n</form>\r\n   \r\n\t</div>\r\n </ngx-flip>\r\n\r\n <ng-template #register style=\"background-color: whitesmoke;\">\r\n  <div class=\"modal-header\">\r\n    <h3 class=\"modal-title pull-left\">Register</h3>\r\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\r\n      <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div *ngIf=\"regError\" class=\"alert alert-danger\">\r\n  <strong>Couldn't create user!</strong> Something has gone wrong with the information you have given\r\n</div>\r\n  <div class=\"modal-body\">\r\n  \t<form>\r\n\t<mat-radio-group style=\"margin-left: 2%;\" (change)=\"onSelectionChange($event)\">\r\n  <mat-radio-button value=\"student\" >Student</mat-radio-button>\r\n  <mat-radio-button style=\"margin-left: 2%;\" value=\"teacher\">Teacher</mat-radio-button>\r\n</mat-radio-group>\r\n\t<div (click)=\"onClick()\" class=\"form-group\">\r\n\t\t<label>First Name</label>\r\n\t\t<div>\r\n\t\t<i *ngIf=\"isNull(first)\" class=\"glyphicon glyphicon-minus form-control-feedback\"></i>\r\n\t\t<i *ngIf=\"!isNull(first)\" style=\"color: green;\" class=\"glyphicon glyphicon-ok-circle form-control-feedback\"></i>\r\n\t\t<input autocomplete=\"off\" type=\"text\" [(ngModel)]=\"first\" name=\"first\" class=\"form-control normal\">\r\n\t\t</div>\r\n\t</div>\r\n\t<div (click)=\"onClick()\" class=\"form-group\">\r\n\t\t<label>Last Name</label>\r\n\t\t<div>\r\n\t\t<i *ngIf=\"isNull(last)\" class=\"glyphicon glyphicon-minus form-control-feedback\"></i>\r\n\t\t<i *ngIf=\"!isNull(last)\" style=\"color: green;\" class=\"glyphicon glyphicon-ok-circle form-control-feedback\"></i>\r\n\t\t<input autocomplete=\"off\" type=\"text\" [(ngModel)]=\"last\" name=\"last\" class=\"form-control normal\">\r\n\t\t</div>\r\n\t</div>\r\n\t<div (click)=\"onClick()\" class=\"form-group\">\r\n\t\t<label>Email</label>\r\n\t\t<div>\r\n\t\t<i *ngIf=\"!validateService.validateEmail(regEmail)\" class=\"glyphicon glyphicon-minus form-control-feedback\"></i>\r\n\t\t<i *ngIf=\"validateService.validateEmail(regEmail)\" style=\"color: green;\" class=\"glyphicon glyphicon-ok-circle form-control-feedback\"></i>\r\n\t\t<input autocomplete=\"off\" type=\"text\" [(ngModel)]=\"regEmail\" name=\"regEmail\" class=\"form-control normal\">\r\n\t\t</div>\r\n\t</div>\r\n\t<div (click)=\"onClick()\" class=\"form-group\">\r\n\t\t<label>Password</label>\r\n\t\t<div>\r\n\t\t<i *ngIf=\"regPassword?.length <= 3\" class=\"glyphicon glyphicon-minus form-control-feedback\"></i>\r\n\t\t<i *ngIf=\"regPassword?.length > 3\" style=\"color: green;\" class=\"glyphicon glyphicon-ok-circle form-control-feedback\"></i>\r\n\t\t<input autocomplete=\"off\"  type=\"password\" [(ngModel)]=\"regPassword\" name=\"regPassword\" class=\"form-control normal\" >\r\n\t\t</div>\r\n\t</div>\r\n\t<div (click)=\"onClick()\" class=\"form-group\">\r\n\t\t<label>University</label>\r\n\t\t<div>\r\n\t\t<i *ngIf=\"isNull(regUniversity)\" class=\"glyphicon glyphicon-minus form-control-feedback\"></i>\r\n\t\t<i *ngIf=\"!isNull(regUniversity)\" style=\"color: green;\" class=\"glyphicon glyphicon-ok-circle form-control-feedback\"></i>\r\n\t\t<input autocomplete=\"off\" type=\"text\" [(ngModel)]=\"regUniversity\" name=\"regUniversity\" class=\"form-control normal\">\r\n\t\t</div>\r\n\t</div>\r\n\r\n<button (click)=\"onRegisterSubmit()\" class=\"btn btn-primary\">Submit</button>\r\n</form>\r\n  </div>\r\n</ng-template>\r\n\r\n\r\n<style>\r\n#loginCard{\r\n\twidth: 50%;\r\n\tmargin-top: 5%;\r\n\tmargin-left: 25%;\r\n}\r\n.btn-primary {\r\n\tdisplay: block;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}\r\n.form-control{\r\n\twidth: 85%;\r\n}\r\ni{\r\n\tposition: relative;\r\n\tfloat: right;\r\n}\r\n\r\n.invalid{\r\n\tborder-color: red;\r\n}\r\n.valid{\r\n\tborder-color: green!important;\r\n}\r\n.normal{\r\n\tborder-color: black;\r\n}\r\n</style>"

/***/ }),

/***/ "./src/app/components/login/login.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/login/login.component.ts ***!
  \*****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_validate_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/validate.service */ "./src/app/services/validate.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular2-flash-messages */ "./node_modules/angular2-flash-messages/module/index.js");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(angular2_flash_messages__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm5/ngx-bootstrap-modal.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, router, flashMessage, modalService, validateService, _formBuilder) {
        this.authService = authService;
        this.router = router;
        this.flashMessage = flashMessage;
        this.modalService = modalService;
        this.validateService = validateService;
        this._formBuilder = _formBuilder;
        this.regError = false;
        this.flipDiv = false;
        this.config = {
            animated: true,
            keyboard: true,
            class: "my-modal"
        };
        this.switch = {
            first_: false,
            last_: false,
            email_: false,
            password_: false,
            university_: false
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
        //this.authService.logOut();
        this.regForm = this._formBuilder.group({
            firstCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required],
            lastCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required],
            emailCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required],
            passwordCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required],
            universityCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required]
        });
    };
    LoginComponent.prototype.flipDivFunc = function () {
        this.flipDiv = !this.flipDiv;
    };
    LoginComponent.prototype.onLoginSubmit = function () {
        var _this = this;
        if (this.email == null || this.password == null) {
            this.email = null;
            this.password = null;
            this.flashMessage.show("Something went wrong, empty email or password", { cssClass: 'alert-danger', timeout: 5000 });
            this.router.navigate(['login']);
        }
        else if (this.email != null && this.password != null) {
            var user = {
                email: this.email,
                password: this.password
            };
            this.authService.authenticateUser(user).subscribe(function (data) {
                if (data.success) {
                    _this.authService.storeUserData(data.token, data.user);
                    _this.flashMessage.show("Logged in!", { cssClass: 'alert-success', timeout: 5000 });
                    _this.router.navigateByUrl('/dashboard');
                }
                else {
                    _this.email = null;
                    _this.password = null;
                    _this.flashMessage.show("Something went wrong, are you sure those credentials are correct?", { cssClass: 'alert-danger', timeout: 5000 });
                    _this.regError = true;
                    _this.router.navigate(['login']);
                }
            });
        }
    };
    LoginComponent.prototype.openModal = function (template) {
        this.regEmail = null;
        this.regPassword = null;
        this.regRole = null;
        this.regUniversity = null;
        this.first = null;
        this.last = null;
        this.modalRef = this.modalService.show(template, this.config);
    };
    LoginComponent.prototype.onRegisterSubmit = function () {
        var _this = this;
        console.log(this.value);
        //this.modalRef.hide();
        var user = {
            first: this.first,
            last: this.last,
            email: this.regEmail,
            password: this.regPassword,
            university: this.regUniversity
        };
        //Required Fields
        if (!this.validateService.validateRegister(user)) {
            //this.flashMessage.show("Fill in all fields", {cssClass: 'alert-danger', timeout: 3000});
            this.regError = true;
        }
        else {
            this.regError = false;
            this.modalRef.hide();
        }
        //Register User
        if (this.value == 'student') {
            this.authService.registerUser(user).subscribe(function (suc) {
                _this.flashMessage.show("Registration Successful", { cssClass: 'alert-success', timeout: 3000 });
            }, function (err) {
                _this.flashMessage.show("Something went wrong", { cssClass: 'alert-danger', timeout: 3000 });
                //this.router.navigate(['/register']);
                _this.regError = true;
                console.log(err);
            });
        }
        else if (this.value == 'teacher') {
            this.authService.registerTeacher(user).subscribe(function (suc) {
                _this.flashMessage.show("Registration Successful", { cssClass: 'alert-success', timeout: 3000 });
                _this.router.navigate(['/login']);
            }, function (err) {
                _this.flashMessage.show("Something went wrong", { cssClass: 'alert-danger', timeout: 3000 });
                _this.router.navigate(['/register']);
                console.log(err);
            });
        }
    };
    LoginComponent.prototype.onSelectionChange = function (event) {
        this.value = event.value;
    };
    LoginComponent.prototype.empty = function (event) {
        console.log(event);
    };
    LoginComponent.prototype.isNull = function (field) {
        if (field == null || field == "") {
            return true;
        }
        else {
            return false;
        }
    };
    LoginComponent.prototype.onClick = function () {
        this.regError = false;
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/components/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/components/login/login.component.css")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            angular2_flash_messages__WEBPACK_IMPORTED_MODULE_4__["FlashMessagesService"],
            ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__["BsModalService"],
            _services_validate_service__WEBPACK_IMPORTED_MODULE_1__["ValidateService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormBuilder"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/components/navbar/navbar.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/navbar/navbar.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav *ngIf=\"nav.visible\" style=\"background-color: #1C56F6;\" class=\"navbar navbar-inverse navbar-fixed-top\">\r\n      <div class=\"container\">\r\n        <div class=\"navbar-header\">\r\n          <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\r\n            <span class=\"sr-only\">Toggle navigation</span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n          </button>\r\n        </div>\r\n        <div id=\"navbar\" class=\"collapse navbar-collapse\">\r\n          <ul class=\"nav navbar-nav navbar-left\">\r\n            <li style=\"padding-top: 15px; font-family: EraserDust\"><a style=\"font-size: 30px;\" class=\"navbar-brand\">Classroom</a></li>\r\n          </ul>\r\n          <ul class=\"nav navbar-nav navbar-right\">\r\n            <li><a *ngIf=\"authService.loggedIn()\"[routerLinkActive]=\"['active']\" [routerLink]=\"['/dashboard']\" matTooltip=\"Dashboard\"><i class=\"glyphicon glyphicon-th-list\"></i></a></li>\r\n            <li>\r\n              <a *ngIf=\"authService.loggedIn()\" matTooltip=\"Classes\"  mat-button [matMenuTriggerFor]=\"classMenu\">\r\n              <i class=\"fa fa-mortar-board\"></i></a>\r\n              <mat-menu #classMenu=\"matMenu\">\r\n                <div *ngIf=\"classes.length > 0\">\r\n                <a style=\"color: black;\" mat-menu-item *ngFor=\"let class of classes\" [routerLinkActive]=\"['active']\" [routerLink]=\"['/classroom/',class.module_code]\" (click)=\"storeCode(class.module_code, class.teacher)\">{{class?.title}}</a></div>\r\n                <div style=\"text-align: center;\" *ngIf=\"classes.length == 0\">\r\n                  <h4>You are not enrolled in any classes!</h4>\r\n                </div>\r\n              </mat-menu>\r\n            </li>\r\n            <li *ngIf=\"authService.loggedIn()\" style=\" cursor: pointer;\">\r\n              <a mat-button [matMenuTriggerFor]=\"userMenu\" matTooltip=\"User Information\"><i class=\"glyphicon glyphicon-user\"></i></a>\r\n              <mat-menu (click)=\"$event.stopPropagation()\" #userMenu=\"matMenu\" style=\"height: 300px; max-width: 300px; overflow-x: hidden; overflow-y: hidden; padding-top: 0px;\">\r\n                <div style=\"height: 250px\">\r\n                <mat-list (click)=\"$event.stopPropagation()\" *ngIf=\"!isEditable\" style=\"height: 200px; width: 200px;\">\r\n                  <mat-list-item>\r\n                    <div style=\"width: 45%;\">\r\n                    First\r\n                    </div> \r\n                    <div style=\"width: 55%;\">\r\n                    {{first}}\r\n                  </div>\r\n                  </mat-list-item>\r\n                  <mat-list-item>\r\n                    <div style=\"width: 45%;\">\r\n                    last\r\n                    </div> \r\n                    <div style=\"width: 55%;\">\r\n                    {{last}}\r\n                  </div>\r\n                  </mat-list-item>\r\n                  <mat-list-item>\r\n                    <div style=\"width: 45%\">\r\n                    Email\r\n                    </div>\r\n                    <div style=\"width: 55%\">\r\n                     {{user?.email}}\r\n                   </div>\r\n                 </mat-list-item>\r\n                  <mat-list-item>\r\n                  <div style=\"width: 45%\">\r\n                  Role\r\n                  </div>\r\n                  <div style=\"width: 55%\">\r\n                   {{user?.role}}\r\n                 </div>\r\n                 </mat-list-item>\r\n                  <mat-list-item>\r\n                  <div style=\"width: 45%\">\r\n                  School\r\n                  </div>\r\n                  <div style=\"width: 55%\">\r\n                   {{user?.university}}\r\n                 </div>\r\n               </mat-list-item>\r\n              </mat-list>\r\n\r\n<!--TODO: Only use the users emails to get their info instead of their first and second names. \r\n  This code is for editing user details but if the users first/last name is altered this could cause problems in other parts of the application-->\r\n\r\n              <!-- <mat-list *ngIf=\"isEditable\" style=\"height: 200px; width: 200px;\">\r\n                <form [formGroup]=\"updateForm\" (click)=\"$event.stopPropagation()\" >\r\n                  <mat-list-item>\r\n                    <div style=\"width: 45%;\">\r\n                    First\r\n                    </div> \r\n                    <mat-form-field class=\"example-form-field\">\r\n                      <input matInput type=\"text\" placeholder=\"{{first}}\" formControlName=\"first\" (click)=\"$event.stopPropagation()\">\r\n                      <button mat-button *ngIf=\"value\" matSuffix mat-icon-button aria-label=\"Clear\" (click)=\"value=''\">\r\n                        <mat-icon>close</mat-icon>\r\n                      </button>\r\n                      </mat-form-field>\r\n                  </mat-list-item>\r\n                  <mat-list-item>\r\n                    <div style=\"width: 45%;\">\r\n                    Last\r\n                    </div> \r\n                    <mat-form-field class=\"example-form-field\">\r\n                      <input matInput type=\"text\" placeholder=\"{{last}}\" formControlName=\"last\" (click)=\"$event.stopPropagation()\">\r\n                      <button mat-button *ngIf=\"value\" matSuffix mat-icon-button aria-label=\"Clear\" (click)=\"value=''\">\r\n                        <mat-icon>close</mat-icon>\r\n                      </button>\r\n                      </mat-form-field>\r\n                  </mat-list-item>\r\n                  <mat-list-item>\r\n                    <div style=\"width: 45%\">\r\n                    Email\r\n                    </div>\r\n                   <div style=\"width: 55%\">\r\n                   {{user?.email}}\r\n                 </div>\r\n                 </mat-list-item>\r\n                  <mat-list-item>\r\n                  <div style=\"width: 45%\">\r\n                  Role\r\n                  </div>\r\n                  <div style=\"width: 55%\">\r\n                   {{user?.role}}\r\n                 </div>\r\n                 </mat-list-item>\r\n                  <mat-list-item>\r\n                  <div style=\"width: 45%\">\r\n                  School\r\n                  </div>\r\n                   <div style=\"width: 55%\">\r\n                   {{user?.university}}\r\n                 </div>\r\n               </mat-list-item>\r\n             </form>\r\n              </mat-list> -->\r\n\r\n            </div>\r\n           <!--  <div style=\"width: 100%; text-align: center;\">\r\n              <button class=\"btn btn-primary\" *ngIf=\"!isEditable\" (click)=\"edit(); $event.stopPropagation()\">Edit</button>\r\n               <button class=\"btn btn-primary\" *ngIf=\"isEditable\" (click)=\"edit(); $event.stopPropagation()\">Ok</button>\r\n              </div> -->\r\n              </mat-menu>\r\n            </li>\r\n             <li><a *ngIf=\"authService.loggedIn()\"(click)=\"onLogOutClick()\" href=\"#\" matTooltip=\"Log Out\"><i class=\"glyphicon glyphicon-log-out\"></i></a></li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </nav>\r\n <style>   \r\nnav{\r\n  position: static;\r\n  min-height: 70px;\r\n  margin: 0;\r\n}  \r\nli{\r\n  padding-top: 10px;\r\n  list-style: none;\r\n  margin-right: 5px;\r\n}\r\na{\r\n  font-size: 20px;\r\n  color: #ffffff;\r\n}\r\na:hover{\r\n  font-weight: bolder;\r\n  box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);\r\n}\r\nnav ul{\r\n  list-style: none;\r\n}\r\n.navbar-header a, .navbar-left a, .navbar-right a, li {\r\n  color: white;\r\n}\r\ni{\r\n  font-size: 30px;\r\n}\r\nmat-menu{\r\n  width: 450px !important;\r\n}\r\n.mat-list-item{\r\n  height: 45px !important;\r\n}\r\nmat-form-field{\r\n  margin-left: 10px;\r\n  padding-bottom: 0px;\r\n  width: 70%;\r\n}\r\n\r\n</style>\r\n"

/***/ }),

/***/ "./src/app/components/navbar/navbar.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.ts ***!
  \*******************************************************/
/*! exports provided: NavbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarComponent", function() { return NavbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_class_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/class.service */ "./src/app/services/class.service.ts");
/* harmony import */ var _services_navbar_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/navbar.service */ "./src/app/services/navbar.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-flash-messages */ "./node_modules/angular2-flash-messages/module/index.js");
/* harmony import */ var angular2_flash_messages__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(angular2_flash_messages__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(authService, classService, router, flashMessage, nav, _formBuilder) {
        this.authService = authService;
        this.classService = classService;
        this.router = router;
        this.flashMessage = flashMessage;
        this.nav = nav;
        this._formBuilder = _formBuilder;
        this.classes = [];
        this.classIDs = [];
        this.isEditable = false;
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.updateForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormGroup"]({
            first: new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](),
            last: new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]()
        });
        this.router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_4__["NavigationEnd"]) {
                _this.ngOnInit();
            }
        });
        if (this.authService.loggedIn()) {
            this.userSub = this.authService.getProfile().subscribe(function (data) {
                _this.classes = data.user.classes;
                _this.user = data.user;
                _this.first = data.user.first;
                _this.last = data.user.last;
            });
        }
    };
    NavbarComponent.prototype.ngOnDestroy = function () {
        this.userSub.unsubscribe();
    };
    NavbarComponent.prototype.onLogOutClick = function () {
        this.authService.logOut();
        this.flashMessage.show("Logged Out", { cssClass: 'alert-success', timeout: 3000 });
        this.ngOnInit();
        this.router.navigate(['/login']);
        return false;
    };
    NavbarComponent.prototype.storeCode = function (module_code, email) {
        this.classService.storeClassData(module_code, email);
    };
    NavbarComponent.prototype.edit = function () {
        if (this.isEditable == false) {
            this.isEditable = true;
        }
        else {
            this.isEditable = false;
            var updateObj = {
                first: this.updateForm.get('first').value,
                last: this.updateForm.get('last').value
            };
            this.authService.updateUser(this.user.email, updateObj).subscribe(function (data) {
                console.log(data);
            });
            if (this.updateForm.get('first').value != null) {
                this.first = this.updateForm.get('first').value;
            }
            if (this.updateForm.get('last').value != null) {
                this.last = this.updateForm.get('last').value;
            }
        }
    };
    NavbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-navbar',
            template: __webpack_require__(/*! ./navbar.component.html */ "./src/app/components/navbar/navbar.component.html"),
            styles: [__webpack_require__(/*! ./navbar.component.css */ "./src/app/components/navbar/navbar.component.css")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"],
            _services_class_service__WEBPACK_IMPORTED_MODULE_2__["ClassService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            angular2_flash_messages__WEBPACK_IMPORTED_MODULE_5__["FlashMessagesService"],
            _services_navbar_service__WEBPACK_IMPORTED_MODULE_3__["NavbarService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormBuilder"]])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "./src/app/guards/auth.guards.ts":
/*!***************************************!*\
  !*** ./src/app/guards/auth.guards.ts ***!
  \***************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/auth.service */ "./src/app/services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        if (this.authService.loggedIn()) {
            return true;
        }
        else {
            this.router.navigate(['/login']);
            return false;
        }
    };
    AuthGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/services/activity.service.ts":
/*!**********************************************!*\
  !*** ./src/app/services/activity.service.ts ***!
  \**********************************************/
/*! exports provided: ActivityService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivityService", function() { return ActivityService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ActivityService = /** @class */ (function () {
    function ActivityService(http) {
        this.http = http;
    }
    ActivityService.prototype.getActivities = function () {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('activities/all', { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.getActivityByTitle = function (title) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('activity/' + title, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.getActivitiesByModule = function (module) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('activity/module/' + module, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.updateComments = function (activity, comment) {
        var body = {
            activityName: activity,
            comment: comment
        };
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({
            'Content-Type': 'application/json'
        });
        return this.http.put('activity/comments/update', body, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.deleteActivity = function (activity) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.delete('activity/delete/' + activity, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.updateSubmissions = function (activity, sub) {
        var body = {
            activityname: activity,
            submission: sub
        };
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({
            'Content-Type': 'application/json'
        });
        return this.http.put('activity/submissions/update', body, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.updateUserSubmission = function (email, sub) {
        var body = {
            submission: sub
        };
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({
            'Content-Type': 'application/json'
        });
        return this.http.put('user/update/submission/' + email, body, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.updateFeedback = function (email, context, feedback, index) {
        var body = {
            email: email,
            feedback: feedback,
            context: context,
            index: index
        };
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({
            'Content-Type': 'application/json'
        });
        return this.http.put('annotation/feedback', body, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService.prototype.getComments = function (activityName) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('activity/group/' + activityName + '/comments', { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ActivityService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"]])
    ], ActivityService);
    return ActivityService;
}());



/***/ }),

/***/ "./src/app/services/auth.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/auth.service.ts ***!
  \******************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var angular2_jwt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular2-jwt */ "./node_modules/angular2-jwt/angular2-jwt.js");
/* harmony import */ var angular2_jwt__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(angular2_jwt__WEBPACK_IMPORTED_MODULE_3__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
    }
    AuthService.prototype.registerUser = function (user) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.post('users/createStud', user, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    AuthService.prototype.registerTeacher = function (teacher) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.post('users/createTeacher', teacher, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    AuthService.prototype.getUser = function (email) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('user/' + email, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    AuthService.prototype.authenticateUser = function (user) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/authenticate', user, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    AuthService.prototype.getProfile = function () {
        this.loadToken();
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({
            'Content-Type': 'application/json',
            'Authorization': this.auth_token
        });
        return this.http.get('/profile', { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    AuthService.prototype.storeUserData = function (token, user) {
        localStorage.setItem('_idtoken', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.auth_token = token;
        this.user = user;
    };
    AuthService.prototype.loadEmail = function () {
        return JSON.parse(localStorage.getItem("user")).email;
    };
    AuthService.prototype.loadToken = function () {
        var token = localStorage.getItem('_idtoken');
        this.auth_token = token;
    };
    AuthService.prototype.isTeacher = function () {
        var user = JSON.parse(localStorage.getItem("user"));
        if (user.role == "Teacher") {
            return true;
        }
        else if (user.role == "Student") {
            return false;
        }
    };
    AuthService.prototype.loggedIn = function () {
        return Object(angular2_jwt__WEBPACK_IMPORTED_MODULE_3__["tokenNotExpired"])('_idtoken');
    };
    AuthService.prototype.logOut = function () {
        this.auth_token = null;
        this.user = null;
        this.thisClass = null;
        localStorage.clear();
    };
    AuthService.prototype.updateUser = function (email, obj) {
        var body = {
            first: obj.first,
            last: obj.last
        };
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({
            'Content-Type': 'application/json'
        });
        return this.http.put('user/update/' + email, body, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    AuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/services/class.service.ts":
/*!*******************************************!*\
  !*** ./src/app/services/class.service.ts ***!
  \*******************************************/
/*! exports provided: ClassService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClassService", function() { return ClassService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ClassService = /** @class */ (function () {
    function ClassService(http) {
        this.http = http;
    }
    ClassService.prototype.getClasses = function () {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('classes', { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.getClassByModule = function (module) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('class/module=' + module, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.getClassById = function (id) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('class/id=' + id, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.getTeacher = function (email) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('user/' + email, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.createClass = function (thisClass) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.post('class/create', thisClass, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.enrollClass = function (module_code, user) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.post('class/enroll/' + module_code, user, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.storeClassData = function (thisModuleCode, email) {
        localStorage.setItem("Module", JSON.stringify({ module_code: thisModuleCode, email: email }));
        //localStorage.setItem("Email", JSON.stringify(email));
    };
    ClassService.prototype.loadModuleCode = function () {
        var storedModule = JSON.parse(localStorage.getItem("Module"));
        this.module_code = storedModule.module_code;
    };
    ClassService.prototype.loadEmail = function () {
        var storedEmail = JSON.parse(localStorage.getItem("Module"));
        this.email = storedEmail.email;
    };
    ClassService.prototype.clearClass = function () {
        localStorage.removeItem("Module");
    };
    ClassService.prototype.getfiles = function (module_code) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/module=' + module_code, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.getImages = function (file) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/file=' + file, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.getStudents = function () {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('users/students', { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService.prototype.getStudentsByModule = function (module) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('classes/students/' + module, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    ClassService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"]])
    ], ClassService);
    return ClassService;
}());



/***/ }),

/***/ "./src/app/services/navbar.service.ts":
/*!********************************************!*\
  !*** ./src/app/services/navbar.service.ts ***!
  \********************************************/
/*! exports provided: NavbarService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarService", function() { return NavbarService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NavbarService = /** @class */ (function () {
    function NavbarService() {
        this.visible = true;
    }
    NavbarService.prototype.hide = function () { this.visible = false; };
    NavbarService.prototype.show = function () { this.visible = true; };
    NavbarService.prototype.toggle = function () { this.visible = !this.visible; };
    NavbarService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], NavbarService);
    return NavbarService;
}());



/***/ }),

/***/ "./src/app/services/task.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/task.service.ts ***!
  \******************************************/
/*! exports provided: TaskService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaskService", function() { return TaskService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TaskService = /** @class */ (function () {
    function TaskService(http) {
        this.http = http;
    }
    TaskService.prototype.getTaskByFilename = function (filename) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/file=' + filename, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getTaskByTitle = function (title) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/title=' + title, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getTaskByModule = function (module) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/module=' + module, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getTaskMultiple = function (task, activity) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/' + activity + '/' + task, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.storeFileData = function (filename) {
        localStorage.setItem("Task", JSON.stringify({ file: filename }));
        //localStorage.setItem("Email", JSON.stringify(email));
    };
    TaskService.prototype.loadFile = function () {
        var file = JSON.parse(localStorage.getItem("Task"));
        return file.filename;
    };
    TaskService.prototype.clearFile = function () {
        localStorage.removeItem("Task");
    };
    TaskService.prototype.submitActivity = function (activity) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.post('activity/create', activity, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.submitAnnotation = function (annotation) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.post('annotation/create', annotation, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getActivityByTitle = function (title) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('activity/' + title, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getFilesByActName = function (actName) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/activityname=' + actName, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getFilesByModule = function (module) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('files/module=' + module, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getAnnotations = function () {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('annotations', { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.getAnnotationsByEmail = function (email, activityName, taskName) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.get('annotations/user=' + email + '/activity=' + activityName + '/task=' + taskName, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.deleteAnnotation = function (text) {
        var body = {
            text: text
        };
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.delete('annotations/delete', { headers: headers, body: body })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService.prototype.deleteTasksByActivity = function (activity) {
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        headers.append('Content-Type', 'application/json');
        return this.http.delete('tasks/delete/' + activity, { headers: headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }));
    };
    TaskService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"]])
    ], TaskService);
    return TaskService;
}());



/***/ }),

/***/ "./src/app/services/validate.service.ts":
/*!**********************************************!*\
  !*** ./src/app/services/validate.service.ts ***!
  \**********************************************/
/*! exports provided: ValidateService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValidateService", function() { return ValidateService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ValidateService = /** @class */ (function () {
    function ValidateService() {
    }
    ValidateService.prototype.validateRegister = function (user) {
        if (user.first == undefined || user.last == undefined || user.email == undefined || user.password == undefined || user.university == undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    ValidateService.prototype.validateField = function (field) {
        if (field == null || field == "") {
            return false;
        }
        else {
            return true;
        }
    };
    ValidateService.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    ValidateService.prototype.validateClass = function (theClass) {
        if (theClass.title == undefined || theClass.module_code == undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    ValidateService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], ValidateService);
    return ValidateService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _polyfills_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./polyfills.ts */ "./src/polyfills.ts");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zone.js/dist/zone */ "./node_modules/zone.js/dist/zone.js");
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__);
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';
/**
 * If the application will be indexed by Google Search, the following is required.
 * Googlebot uses a renderer based on Chrome 41.
 * https://developers.google.com/search/docs/guides/rendering
 **/
// import 'core-js/es6/array';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following for the Reflect API. */
// import 'core-js/es6/reflect';
/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */
// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
/*
* in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
* with the following flag, it will bypass `zone.js` patch for IE/Edge
*/
// (window as any).__Zone_enable_cross_context_check = true;
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
 // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\Sean Rooney\Documents\warm-journey-37709PROD\angular-src\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map