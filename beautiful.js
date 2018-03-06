var _gsScope = "undefined" != typeof module && (module.exports && "undefined" != typeof global) ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (Animation, dataAndEvents, TweenLite) {
            /**
             * @param {Array} obj
             * @return {?}
             */
            var toArray = function (obj) {
                var tag;
                /** @type {Array} */
                var ret = [];
                var ol = obj.length;
                /** @type {number} */
                tag = 0;
                for (; tag !== ol; ret.push(obj[tag++])) {}
                return ret;
            };
            /**
             * @param {Object} data
             * @param {Array} obj
             * @param {number} key
             * @return {undefined}
             */
            var serialize = function (data, obj, key) {
                var type;
                var fn;
                var types = data.cycle;
                for (type in types) {
                    fn = types[type];
                    data[type] = "function" == typeof fn ? fn.call(obj[key], key) : fn[key % fn.length];
                }
                delete data.cycle;
            };
            /**
             * @param {Object} duration
             * @param {?} vars
             * @param {?} target
             * @return {undefined}
             */
            var TweenMax = function (duration, vars, target) {
                TweenLite.call(this, duration, vars, target);
                /** @type {number} */
                this._cycle = 0;
                /** @type {boolean} */
                this._yoyo = this.vars.yoyo === true;
                this._repeat = this.vars.repeat || 0;
                this._repeatDelay = this.vars.repeatDelay || 0;
                /** @type {boolean} */
                this._dirty = true;
                this.render = TweenMax.prototype.render;
            };
            /** @type {number} */
            var _tinyNum = 1E-10;
            var self = TweenLite._internals;
            var _isSelector = self.isSelector;
            var isArray = self.isArray;
            var p = TweenMax.prototype = TweenLite.to({}, 0.1, {});
            /** @type {Array} */
            var _blankArray = [];
            /** @type {string} */
            TweenMax.version = "1.18.4";
            /** @type {function (Object, ?, ?): undefined} */
            p.constructor = TweenMax;
            /** @type {boolean} */
            p.kill()._gc = false;
            TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
            TweenMax.getTweensOf = TweenLite.getTweensOf;
            TweenMax.lagSmoothing = TweenLite.lagSmoothing;
            TweenMax.ticker = TweenLite.ticker;
            TweenMax.render = TweenLite.render;
            /**
             * @return {?}
             */
            p.invalidate = function () {
                return this._yoyo = this.vars.yoyo === true, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(true), TweenLite.prototype.invalidate.call(this);
            };
            /**
             * @param {Object} vars
             * @param {?} chains
             * @return {?}
             */
            p.updateTo = function (vars, chains) {
                var p;
                var ratio = this.ratio;
                var _initted = this.vars.immediateRender || vars.immediateRender;
                if (chains) {
                    if (this._startTime < this._timeline._time) {
                        this._startTime = this._timeline._time;
                        this._uncache(false);
                        if (this._gc) {
                            this._enabled(true, false);
                        } else {
                            this._timeline.insert(this, this._startTime - this._delay);
                        }
                    }
                }
                for (p in vars) {
                    this.vars[p] = vars[p];
                }
                if (this._initted || _initted) {
                    if (chains) {
                        /** @type {boolean} */
                        this._initted = false;
                        if (_initted) {
                            this.render(0, true, true);
                        }
                    } else {
                        if (this._gc && this._enabled(true, false), this._notifyPluginsOfEnabled && (this._firstPT && TweenLite._onPluginEvent("_onDisable", this)), this._time / this._duration > 0.998) {
                            var new_t = this._totalTime;
                            this.render(0, true, false);
                            /** @type {boolean} */
                            this._initted = false;
                            this.render(new_t, true, false);
                        } else {
                            if (this._initted = false, this._init(), this._time > 0 || _initted) {
                                var size;
                                /** @type {number} */
                                var locScaleX = 1 / (1 - ratio);
                                var self = this._firstPT;
                                for (; self;) {
                                    size = self.s + self.c;
                                    self.c *= locScaleX;
                                    /** @type {number} */
                                    self.s = size - self.c;
                                    self = self._next;
                                }
                            }
                        }
                    }
                }
                return this;
            };
            /**
             * @param {number} time
             * @param {boolean} recurring
             * @param {boolean} opt_isDefault
             * @return {?}
             */
            p.render = function (time, recurring, opt_isDefault) {
                if (!this._initted) {
                    if (0 === this._duration) {
                        if (this.vars.repeat) {
                            this.invalidate();
                        }
                    }
                }
                var isComplete;
                var callback;
                var pt;
                var cycleDuration;
                var r;
                var e;
                var pow;
                var rawPrevTime;
                var totalDur = this._dirty ? this.totalDuration() : this._totalDuration;
                var prevTime = this._time;
                var prevTotalTime = this._totalTime;
                var prevCycle = this._cycle;
                var dur = this._duration;
                var prevRawPrevTime = this._rawPrevTime;
                if (time >= totalDur - 1E-7 ? (this._totalTime = totalDur, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = dur, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (isComplete = true, callback = "onComplete", opt_isDefault = opt_isDefault || this._timeline.autoRemoveChildren), 0 === dur && ((this._initted || (!this.vars.lazy || opt_isDefault)) &&
                        (this._startTime === this._timeline._duration && (time = 0), (0 > prevRawPrevTime || (0 >= time && time >= -1E-7 || prevRawPrevTime === _tinyNum && "isPause" !== this.data)) && (prevRawPrevTime !== time && (opt_isDefault = true, prevRawPrevTime > _tinyNum && (callback = "onReverseComplete"))), this._rawPrevTime = rawPrevTime = !recurring || (time || prevRawPrevTime === time) ? time : _tinyNum))) : 1E-7 > time ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ?
                        this._ease.getRatio(0) : 0, (0 !== prevTotalTime || 0 === dur && prevRawPrevTime > 0) && (callback = "onReverseComplete", isComplete = this._reversed), 0 > time && (this._active = false, 0 === dur && ((this._initted || (!this.vars.lazy || opt_isDefault)) && (prevRawPrevTime >= 0 && (opt_isDefault = true), this._rawPrevTime = rawPrevTime = !recurring || (time || prevRawPrevTime === time) ? time : _tinyNum))), this._initted || (opt_isDefault = true)) : (this._totalTime = this._time = time, 0 !==
                        this._repeat && (cycleDuration = dur + this._repeatDelay, this._cycle = this._totalTime / cycleDuration >> 0, 0 !== this._cycle && (this._cycle === this._totalTime / cycleDuration && (time >= prevTotalTime && this._cycle--)), this._time = this._totalTime - this._cycle * cycleDuration, this._yoyo && (0 !== (1 & this._cycle) && (this._time = dur - this._time)), this._time > dur ? this._time = dur : this._time < 0 && (this._time = 0)), this._easeType ? (r = this._time / dur, e = this._easeType,
                            pow = this._easePower, (1 === e || 3 === e && r >= 0.5) && (r = 1 - r), 3 === e && (r *= 2), 1 === pow ? r *= r : 2 === pow ? r *= r * r : 3 === pow ? r *= r * r * r : 4 === pow && (r *= r * r * r * r), 1 === e ? this.ratio = 1 - r : 2 === e ? this.ratio = r : this._time / dur < 0.5 ? this.ratio = r / 2 : this.ratio = 1 - r / 2) : this.ratio = this._ease.getRatio(this._time / dur)), prevTime === this._time && (!opt_isDefault && prevCycle === this._cycle)) {
                    return void(prevTotalTime !== this._totalTime && (this._onUpdate && (recurring || this._callback("onUpdate"))));
                }
                if (!this._initted) {
                    if (this._init(), !this._initted || this._gc) {
                        return;
                    }
                    if (!opt_isDefault && (this._firstPT && (this.vars.lazy !== false && this._duration || this.vars.lazy && !this._duration))) {
                        return this._time = prevTime, this._totalTime = prevTotalTime, this._rawPrevTime = prevRawPrevTime, this._cycle = prevCycle, self.lazyTweens.push(this), void(this._lazy = [time, recurring]);
                    }
                    if (this._time && !isComplete) {
                        this.ratio = this._ease.getRatio(this._time / dur);
                    } else {
                        if (isComplete) {
                            if (this._ease._calcEnd) {
                                this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1);
                            }
                        }
                    }
                }
                if (this._lazy !== false) {
                    /** @type {boolean} */
                    this._lazy = false;
                }
                if (!this._active) {
                    if (!this._paused) {
                        if (this._time !== prevTime) {
                            if (time >= 0) {
                                /** @type {boolean} */
                                this._active = true;
                            }
                        }
                    }
                }
                if (0 === prevTotalTime) {
                    if (2 === this._initted) {
                        if (time > 0) {
                            this._init();
                        }
                    }
                    if (this._startAt) {
                        if (time >= 0) {
                            this._startAt.render(time, recurring, opt_isDefault);
                        } else {
                            if (!callback) {
                                /** @type {string} */
                                callback = "_dummyGS";
                            }
                        }
                    }
                    if (this.vars.onStart) {
                        if (0 !== this._totalTime || 0 === dur) {
                            if (!recurring) {
                                this._callback("onStart");
                            }
                        }
                    }
                }
                pt = this._firstPT;
                for (; pt;) {
                    if (pt.f) {
                        pt.t[pt.p](pt.c * this.ratio + pt.s);
                    } else {
                        pt.t[pt.p] = pt.c * this.ratio + pt.s;
                    }
                    pt = pt._next;
                }
                if (this._onUpdate) {
                    if (0 > time) {
                        if (this._startAt) {
                            if (this._startTime) {
                                this._startAt.render(time, recurring, opt_isDefault);
                            }
                        }
                    }
                    if (!recurring) {
                        if (this._totalTime !== prevTotalTime || callback) {
                            this._callback("onUpdate");
                        }
                    }
                }
                if (this._cycle !== prevCycle) {
                    if (!recurring) {
                        if (!this._gc) {
                            if (this.vars.onRepeat) {
                                this._callback("onRepeat");
                            }
                        }
                    }
                }
                if (callback) {
                    if (!this._gc || opt_isDefault) {
                        if (0 > time) {
                            if (this._startAt) {
                                if (!this._onUpdate) {
                                    if (this._startTime) {
                                        this._startAt.render(time, recurring, opt_isDefault);
                                    }
                                }
                            }
                        }
                        if (isComplete) {
                            if (this._timeline.autoRemoveChildren) {
                                this._enabled(false, false);
                            }
                            /** @type {boolean} */
                            this._active = false;
                        }
                        if (!recurring) {
                            if (this.vars[callback]) {
                                this._callback(callback);
                            }
                        }
                        if (0 === dur) {
                            if (this._rawPrevTime === _tinyNum) {
                                if (rawPrevTime !== _tinyNum) {
                                    /** @type {number} */
                                    this._rawPrevTime = 0;
                                }
                            }
                        }
                    }
                }
            };
            /**
             * @param {Object} target
             * @param {number} duration
             * @param {number} vars
             * @return {?}
             */
            TweenMax.to = function (target, duration, vars) {
                return new TweenMax(target, duration, vars);
            };
            /**
             * @param {string} target
             * @param {string} duration
             * @param {Object} vars
             * @return {?}
             */
            TweenMax.from = function (target, duration, vars) {
                return vars.runBackwards = true, vars.immediateRender = 0 != vars.immediateRender, new TweenMax(target, duration, vars);
            };
            /**
             * @param {ArrayBuffer} target
             * @param {number} duration
             * @param {?} fromVars
             * @param {number} toVars
             * @return {?}
             */
            TweenMax.fromTo = function (target, duration, fromVars, toVars) {
                return toVars.startAt = fromVars, toVars.immediateRender = 0 != toVars.immediateRender && 0 != fromVars.immediateRender, new TweenMax(target, duration, toVars);
            };
            /** @type {function (Array, number, Object, number, Function, Object, (number|string)): ?} */
            TweenMax.staggerTo = TweenMax.allTo = function (targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
                stagger = stagger || 0;
                var segments;
                var copy;
                var i;
                var key;
                /** @type {number} */
                var delay = 0;
                /** @type {Array} */
                var a = [];
                /**
                 * @return {undefined}
                 */
                var finalComplete = function () {
                    if (vars.onComplete) {
                        vars.onComplete.apply(vars.onCompleteScope || this, arguments);
                    }
                    onCompleteAll.apply(onCompleteAllScope || (vars.callbackScope || this), onCompleteAllParams || _blankArray);
                };
                var cycle = vars.cycle;
                var internalValues = vars.startAt && vars.startAt.cycle;
                if (!isArray(targets)) {
                    if ("string" == typeof targets) {
                        targets = TweenLite.selector(targets) || targets;
                    }
                    if (_isSelector(targets)) {
                        targets = toArray(targets);
                    }
                }
                targets = targets || [];
                if (0 > stagger) {
                    targets = toArray(targets);
                    targets.reverse();
                    stagger *= -1;
                }
                /** @type {number} */
                segments = targets.length - 1;
                /** @type {number} */
                i = 0;
                for (; segments >= i; i++) {
                    copy = {};
                    for (key in vars) {
                        copy[key] = vars[key];
                    }
                    if (cycle && serialize(copy, targets, i), internalValues) {
                        internalValues = copy.startAt = {};
                        for (key in vars.startAt) {
                            internalValues[key] = vars.startAt[key];
                        }
                        serialize(copy.startAt, targets, i);
                    }
                    copy.delay = delay + (copy.delay || 0);
                    if (i === segments) {
                        if (onCompleteAll) {
                            /** @type {function (): undefined} */
                            copy.onComplete = finalComplete;
                        }
                    }
                    a[i] = new TweenMax(targets[i], duration, copy);
                    delay += stagger;
                }
                return a;
            };
            /** @type {function (Object, number, Object, number, ?, string, string): ?} */
            TweenMax.staggerFrom = TweenMax.allFrom = function (targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
                return vars.runBackwards = true, vars.immediateRender = 0 != vars.immediateRender, TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
            };
            /** @type {function (Object, number, ?, Object, number, ?, string, string): ?} */
            TweenMax.staggerFromTo = TweenMax.allFromTo = function (targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
                return toVars.startAt = fromVars, toVars.immediateRender = 0 != toVars.immediateRender && 0 != fromVars.immediateRender, TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
            };
            /**
             * @param {number} min1
             * @param {string} callback
             * @param {Object} params
             * @param {?} evt
             * @param {?} useFrames
             * @return {?}
             */
            TweenMax.delayedCall = function (min1, callback, params, evt, useFrames) {
                return new TweenMax(callback, 0, {
                    delay: min1,
                    onComplete: callback,
                    onCompleteParams: params,
                    callbackScope: evt,
                    onReverseComplete: callback,
                    onReverseCompleteParams: params,
                    immediateRender: false,
                    useFrames: useFrames,
                    overwrite: 0
                });
            };
            /**
             * @param {ArrayBuffer} target
             * @param {number} vars
             * @return {?}
             */
            TweenMax.set = function (target, vars) {
                return new TweenMax(target, 0, vars);
            };
            /**
             * @param {?} target
             * @return {?}
             */
            TweenMax.isTweening = function (target) {
                return TweenLite.getTweensOf(target, true).length > 0;
            };
            /**
             * @param {?} first
             * @param {boolean} path
             * @return {?}
             */
            var getPath = function (first, path) {
                /** @type {Array} */
                var items = [];
                /** @type {number} */
                var index = 0;
                var i = first._first;
                for (; i;) {
                    if (i instanceof TweenLite) {
                        items[index++] = i;
                    } else {
                        if (path) {
                            items[index++] = i;
                        }
                        /** @type {Array} */
                        items = items.concat(getPath(i, path));
                        /** @type {number} */
                        index = items.length;
                    }
                    i = i._next;
                }
                return items;
            };
            /** @type {function (boolean): ?} */
            var assert = TweenMax.getAllTweens = function (index) {
                return getPath(Animation._rootTimeline, index).concat(getPath(Animation._rootFramesTimeline, index));
            };
            /**
             * @param {?} allJobsAreDead
             * @param {boolean} callback
             * @param {boolean} a
             * @param {boolean} b
             * @return {undefined}
             */
            TweenMax.killAll = function (allJobsAreDead, callback, a, b) {
                if (null == callback) {
                    /** @type {boolean} */
                    callback = true;
                }
                if (null == a) {
                    /** @type {boolean} */
                    a = true;
                }
                var callbackCalled;
                var tween;
                var i;
                var employees = assert(0 != b);
                var l = employees.length;
                var callbackValid = callback && (a && b);
                /** @type {number} */
                i = 0;
                for (; l > i; i++) {
                    tween = employees[i];
                    if (callbackValid || (tween instanceof dataAndEvents || ((callbackCalled = tween.target === tween.vars.onComplete) && a || callback && !callbackCalled))) {
                        if (allJobsAreDead) {
                            tween.totalTime(tween._reversed ? 0 : tween.totalDuration());
                        } else {
                            tween._enabled(false, false);
                        }
                    }
                }
            };
            /**
             * @param {Object} value
             * @param {?} deepDataAndEvents
             * @return {undefined}
             */
            TweenMax.killChildTweensOf = function (value, deepDataAndEvents) {
                if (null != value) {
                    var tweens;
                    var tapElement;
                    var key;
                    var id;
                    var i;
                    var messages = self.tweenLookup;
                    if ("string" == typeof value && (value = TweenLite.selector(value) || value), _isSelector(value) && (value = toArray(value)), isArray(value)) {
                        id = value.length;
                        for (; --id > -1;) {
                            TweenMax.killChildTweensOf(value[id], deepDataAndEvents);
                        }
                    } else {
                        /** @type {Array} */
                        tweens = [];
                        for (key in messages) {
                            tapElement = messages[key].target.parentNode;
                            for (; tapElement;) {
                                if (tapElement === value) {
                                    /** @type {Array} */
                                    tweens = tweens.concat(messages[key].tweens);
                                }
                                tapElement = tapElement.parentNode;
                            }
                        }
                        /** @type {number} */
                        i = tweens.length;
                        /** @type {number} */
                        id = 0;
                        for (; i > id; id++) {
                            if (deepDataAndEvents) {
                                tweens[id].totalTime(tweens[id].totalDuration());
                            }
                            tweens[id]._enabled(false, false);
                        }
                    }
                }
            };
            /**
             * @param {boolean} recurring
             * @param {boolean} event
             * @param {boolean} add
             * @param {boolean} dir
             * @return {undefined}
             */
            var getNext = function (recurring, event, add, dir) {
                /** @type {boolean} */
                event = event !== false;
                /** @type {boolean} */
                add = add !== false;
                /** @type {boolean} */
                dir = dir !== false;
                var f;
                var tween;
                var tokenized = assert(dir);
                /** @type {boolean} */
                var eventType = event && (add && dir);
                var index = tokenized.length;
                for (; --index > -1;) {
                    tween = tokenized[index];
                    if (eventType || (tween instanceof dataAndEvents || ((f = tween.target === tween.vars.onComplete) && add || event && !f))) {
                        tween.paused(recurring);
                    }
                }
            };
            return TweenMax.pauseAll = function (qualifier, add, previousSibling) {
                getNext(true, qualifier, add, previousSibling);
            }, TweenMax.resumeAll = function (qualifier, add, previousSibling) {
                getNext(false, qualifier, add, previousSibling);
            }, TweenMax.globalTimeScale = function (value) {
                var self = Animation._rootTimeline;
                var time = TweenLite.ticker.time;
                return arguments.length ? (value = value || _tinyNum, self._startTime = time - (time - self._startTime) * self._timeScale / value, self = Animation._rootFramesTimeline, time = TweenLite.ticker.frame, self._startTime = time - (time - self._startTime) * self._timeScale / value, self._timeScale = Animation._rootTimeline._timeScale = value, value) : self._timeScale;
            }, p.progress = function (value, dataAndEvents) {
                return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - value : value) + this._cycle * (this._duration + this._repeatDelay), dataAndEvents) : this._time / this.duration();
            }, p.totalProgress = function (value, dataAndEvents) {
                return arguments.length ? this.totalTime(this.totalDuration() * value, dataAndEvents) : this._totalTime / this.totalDuration();
            }, p.time = function (value, node) {
                return arguments.length ? (this._dirty && this.totalDuration(), value > this._duration && (value = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? value = this._duration - value + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (value += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(value, node)) : this._time;
            }, p.duration = function (value) {
                return arguments.length ? Animation.prototype.duration.call(this, value) : this._duration;
            }, p.totalDuration = function (value) {
                return arguments.length ? -1 === this._repeat ? this : this.duration((value - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = false), this._totalDuration);
            }, p.repeat = function (value) {
                return arguments.length ? (this._repeat = value, this._uncache(true)) : this._repeat;
            }, p.repeatDelay = function (value) {
                return arguments.length ? (this._repeatDelay = value, this._uncache(true)) : this._repeatDelay;
            }, p.yoyo = function (value) {
                return arguments.length ? (this._yoyo = value, this) : this._yoyo;
            }, TweenMax;
        }, true);
        _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (Animation, SimpleTimeline, TweenLite) {
            /**
             * @param {Object} vars
             * @return {undefined}
             */
            var TimelineLite = function (vars) {
                SimpleTimeline.call(this, vars);
                this._labels = {};
                /** @type {boolean} */
                this.autoRemoveChildren = this.vars.autoRemoveChildren === true;
                /** @type {boolean} */
                this.smoothChildTiming = this.vars.smoothChildTiming === true;
                /** @type {boolean} */
                this._sortChildren = true;
                this._onUpdate = this.vars.onUpdate;
                var val;
                var p;
                var v = this.vars;
                for (p in v) {
                    val = v[p];
                    if (_isArray(val)) {
                        if (-1 !== val.join("").indexOf("{self}")) {
                            v[p] = this._swapSelfInParams(val);
                        }
                    }
                }
                if (_isArray(v.tweens)) {
                    this.add(v.tweens, 0, v.align, v.stagger);
                }
            };
            /** @type {number} */
            var _tinyNum = 1E-10;
            var _ = TweenLite._internals;
            var options = TimelineLite._internals = {};
            var _isSelector = _.isSelector;
            var _isArray = _.isArray;
            var codeSegments = _.lazyTweens;
            var _isFunction = _.lazyRender;
            var globals = _gsScope._gsDefine.globals;
            /**
             * @param {Object} iterable
             * @return {?}
             */
            var _copy = function (iterable) {
                var key;
                var object = {};
                for (key in iterable) {
                    object[key] = iterable[key];
                }
                return object;
            };
            /**
             * @param {Object} obj
             * @param {Array} object
             * @param {number} key
             * @return {undefined}
             */
            var serialize = function (obj, object, key) {
                var name;
                var callback;
                var handlers = obj.cycle;
                for (name in handlers) {
                    callback = handlers[name];
                    obj[name] = "function" == typeof callback ? callback.call(object[key], key) : callback[key % callback.length];
                }
                delete obj.cycle;
            };
            /** @type {function (): undefined} */
            var restoreScript = options.pauseCallback = function () {};
            /**
             * @param {Array} object
             * @return {?}
             */
            var getEnumerableProperties = function (object) {
                var i;
                /** @type {Array} */
                var result = [];
                var len = object.length;
                /** @type {number} */
                i = 0;
                for (; i !== len; result.push(object[i++])) {}
                return result;
            };
            var p = TimelineLite.prototype = new SimpleTimeline;
            return TimelineLite.version = "1.18.4", p.constructor = TimelineLite, p.kill()._gc = p._forcingPlayhead = p._hasPause = false, p.to = function (target, duration, vars, position) {
                var Tween = vars.repeat && globals.TweenMax || TweenLite;
                return duration ? this.add(new Tween(target, duration, vars), position) : this.set(target, vars, position);
            }, p.from = function (target, duration, vars, position) {
                return this.add((vars.repeat && globals.TweenMax || TweenLite).from(target, duration, vars), position);
            }, p.fromTo = function (target, duration, fromVars, toVars, position) {
                var Tween = toVars.repeat && globals.TweenMax || TweenLite;
                return duration ? this.add(Tween.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
            }, p.staggerTo = function (targets, duration, obj, stagger, position, onCompleteAllParams, onCompleteAllScope, onCompleteAll) {
                var vars;
                var i;
                var tl = new TimelineLite({
                    onComplete: onCompleteAllParams,
                    onCompleteParams: onCompleteAllScope,
                    callbackScope: onCompleteAll,
                    smoothChildTiming: this.smoothChildTiming
                });
                var terse = obj.cycle;
                if ("string" == typeof targets) {
                    targets = TweenLite.selector(targets) || targets;
                }
                targets = targets || [];
                if (_isSelector(targets)) {
                    targets = getEnumerableProperties(targets);
                }
                stagger = stagger || 0;
                if (0 > stagger) {
                    targets = getEnumerableProperties(targets);
                    targets.reverse();
                    stagger *= -1;
                }
                /** @type {number} */
                i = 0;
                for (; i < targets.length; i++) {
                    vars = _copy(obj);
                    if (vars.startAt) {
                        vars.startAt = _copy(vars.startAt);
                        if (vars.startAt.cycle) {
                            serialize(vars.startAt, targets, i);
                        }
                    }
                    if (terse) {
                        serialize(vars, targets, i);
                    }
                    tl.to(targets[i], duration, vars, i * stagger);
                }
                return this.add(tl, position);
            }, p.staggerFrom = function (targets, duration, vars, stagger, position, onCompleteAllParams, onCompleteAllScope, onCompleteAll) {
                return vars.immediateRender = 0 != vars.immediateRender, vars.runBackwards = true, this.staggerTo(targets, duration, vars, stagger, position, onCompleteAllParams, onCompleteAllScope, onCompleteAll);
            }, p.staggerFromTo = function (targets, duration, fromVars, toVars, stagger, position, onCompleteAllParams, onCompleteAllScope, onCompleteAll) {
                return toVars.startAt = fromVars, toVars.immediateRender = 0 != toVars.immediateRender && 0 != fromVars.immediateRender, this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAllParams, onCompleteAllScope, onCompleteAll);
            }, p.call = function (callback, params, scope, value) {
                return this.add(TweenLite.delayedCall(0, callback, params, scope), value);
            }, p.set = function (target, vars, position) {
                return position = this._parseTimeOrLabel(position, 0, true), null == vars.immediateRender && (vars.immediateRender = position === this._time && !this._paused), this.add(new TweenLite(target, 0, vars), position);
            }, TimelineLite.exportRoot = function (vars, ignoreDelayedCalls) {
                vars = vars || {};
                if (null == vars.smoothChildTiming) {
                    /** @type {boolean} */
                    vars.smoothChildTiming = true;
                }
                var tween;
                var next;
                var tl = new TimelineLite(vars);
                var root = tl._timeline;
                if (null == ignoreDelayedCalls) {
                    /** @type {boolean} */
                    ignoreDelayedCalls = true;
                }
                root._remove(tl, true);
                /** @type {number} */
                tl._startTime = 0;
                tl._rawPrevTime = tl._time = tl._totalTime = root._time;
                tween = root._first;
                for (; tween;) {
                    next = tween._next;
                    if (!(ignoreDelayedCalls && (tween instanceof TweenLite && tween.target === tween.vars.onComplete))) {
                        tl.add(tween, tween._startTime - tween._delay);
                    }
                    tween = next;
                }
                return root.add(tl, 0), tl;
            }, p.add = function (value, position, align, stagger) {
                var curTime;
                var ln;
                var _j;
                var child;
                var tl;
                var smoothChildTiming;
                if ("number" != typeof position && (position = this._parseTimeOrLabel(position, 0, true, value)), !(value instanceof Animation)) {
                    if (value instanceof Array || value && (value.push && _isArray(value))) {
                        align = align || "normal";
                        stagger = stagger || 0;
                        /** @type {number} */
                        curTime = position;
                        ln = value.length;
                        /** @type {number} */
                        _j = 0;
                        for (; ln > _j; _j++) {
                            if (_isArray(child = value[_j])) {
                                child = new TimelineLite({
                                    tweens: child
                                });
                            }
                            this.add(child, curTime);
                            if ("string" != typeof child) {
                                if ("function" != typeof child) {
                                    if ("sequence" === align) {
                                        curTime = child._startTime + child.totalDuration() / child._timeScale;
                                    } else {
                                        if ("start" === align) {
                                            child._startTime -= child.delay();
                                        }
                                    }
                                }
                            }
                            curTime += stagger;
                        }
                        return this._uncache(true);
                    }
                    if ("string" == typeof value) {
                        return this.addLabel(value, position);
                    }
                    if ("function" != typeof value) {
                        throw "Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.";
                    }
                    value = TweenLite.delayedCall(0, value);
                }
                if (SimpleTimeline.prototype.add.call(this, value, position), (this._gc || this._time === this._duration) && (!this._paused && this._duration < this.duration())) {
                    tl = this;
                    /** @type {boolean} */
                    smoothChildTiming = tl.rawTime() > value._startTime;
                    for (; tl._timeline;) {
                        if (smoothChildTiming && tl._timeline.smoothChildTiming) {
                            tl.totalTime(tl._totalTime, true);
                        } else {
                            if (tl._gc) {
                                tl._enabled(true, false);
                            }
                        }
                        tl = tl._timeline;
                    }
                }
                return this;
            }, p.remove = function (value) {
                if (value instanceof Animation) {
                    this._remove(value, false);
                    var req = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline;
                    return value._startTime = (value._paused ? value._pauseTime : req._time) - (value._reversed ? value.totalDuration() - value._totalTime : value._totalTime) / value._timeScale, this;
                }
                if (value instanceof Array || value && (value.push && _isArray(value))) {
                    var i = value.length;
                    for (; --i > -1;) {
                        this.remove(value[i]);
                    }
                    return this;
                }
                return "string" == typeof value ? this.removeLabel(value) : this.kill(null, value);
            }, p._remove = function (tween, skipDisable) {
                SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
                var last = this._last;
                return last ? this._time > last._startTime + last._totalDuration / last._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this;
            }, p.append = function (value, offsetOrLabel) {
                return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
            }, p.insert = p.insertMultiple = function (value, position, align, stagger) {
                return this.add(value, position || 0, align, stagger);
            }, p.appendMultiple = function (tweens, offsetOrLabel, align, stagger) {
                return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
            }, p.addLabel = function (label, position) {
                return this._labels[label] = this._parseTimeOrLabel(position), this;
            }, p.addPause = function (position, dataAndEvents, params, p) {
                var options = TweenLite.delayedCall(0, restoreScript, params, p || this);
                return options.vars.onComplete = options.vars.onReverseComplete = dataAndEvents, options.data = "isPause", this._hasPause = true, this.add(options, position);
            }, p.removeLabel = function (label) {
                return delete this._labels[label], this;
            }, p.getLabelTime = function (label) {
                return null != this._labels[label] ? this._labels[label] : -1;
            }, p._parseTimeOrLabel = function (timeOrLabel, offsetOrLabel, deepDataAndEvents, ignore) {
                var i;
                if (ignore instanceof Animation && ignore.timeline === this) {
                    this.remove(ignore);
                } else {
                    if (ignore && (ignore instanceof Array || ignore.push && _isArray(ignore))) {
                        i = ignore.length;
                        for (; --i > -1;) {
                            if (ignore[i] instanceof Animation) {
                                if (ignore[i].timeline === this) {
                                    this.remove(ignore[i]);
                                }
                            }
                        }
                    }
                }
                if ("string" == typeof offsetOrLabel) {
                    return this._parseTimeOrLabel(offsetOrLabel, deepDataAndEvents && ("number" == typeof timeOrLabel && null == this._labels[offsetOrLabel]) ? timeOrLabel - this.duration() : 0, deepDataAndEvents);
                }
                if (offsetOrLabel = offsetOrLabel || 0, "string" != typeof timeOrLabel || !isNaN(timeOrLabel) && null == this._labels[timeOrLabel]) {
                    if (null == timeOrLabel) {
                        timeOrLabel = this.duration();
                    }
                } else {
                    if (i = timeOrLabel.indexOf("="), -1 === i) {
                        return null == this._labels[timeOrLabel] ? deepDataAndEvents ? this._labels[timeOrLabel] = this.duration() + offsetOrLabel : offsetOrLabel : this._labels[timeOrLabel] + offsetOrLabel;
                    }
                    /** @type {number} */
                    offsetOrLabel = parseInt(timeOrLabel.charAt(i - 1) + "1", 10) * Number(timeOrLabel.substr(i + 1));
                    timeOrLabel = i > 1 ? this._parseTimeOrLabel(timeOrLabel.substr(0, i - 1), 0, deepDataAndEvents) : this.duration();
                }
                return Number(timeOrLabel) + offsetOrLabel;
            }, p.seek = function (position, suppressEvents) {
                return this.totalTime("number" == typeof position ? position : this._parseTimeOrLabel(position), suppressEvents !== false);
            }, p.stop = function () {
                return this.paused(true);
            }, p.gotoAndPlay = function (position, suppressEvents) {
                return this.play(position, suppressEvents);
            }, p.gotoAndStop = function (position, suppressEvents) {
                return this.pause(position, suppressEvents);
            }, p.render = function (time, recurring, opt_isDefault) {
                if (this._gc) {
                    this._enabled(true, false);
                }
                var tween;
                var selector;
                var next;
                var callback;
                var data;
                var self;
                var position;
                var totalDur = this._dirty ? this.totalDuration() : this._totalDuration;
                var prevTime = this._time;
                var prevStart = this._startTime;
                var prevTimeScale = this._timeScale;
                var previousState = this._paused;
                if (time >= totalDur - 1E-7) {
                    this._totalTime = this._time = totalDur;
                    if (!this._reversed) {
                        if (!this._hasPausedChild()) {
                            /** @type {boolean} */
                            selector = true;
                            /** @type {string} */
                            callback = "onComplete";
                            /** @type {boolean} */
                            data = !!this._timeline.autoRemoveChildren;
                            if (0 === this._duration) {
                                if (0 >= time && time >= -1E-7 || (this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum)) {
                                    if (this._rawPrevTime !== time) {
                                        if (this._first) {
                                            /** @type {boolean} */
                                            data = true;
                                            if (this._rawPrevTime > _tinyNum) {
                                                /** @type {string} */
                                                callback = "onReverseComplete";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this._rawPrevTime = this._duration || (!recurring || (time || this._rawPrevTime === time)) ? time : _tinyNum;
                    time = totalDur + 1E-4;
                } else {
                    if (1E-7 > time) {
                        if (this._totalTime = this._time = 0, (0 !== prevTime || 0 === this._duration && (this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || 0 > time && this._rawPrevTime >= 0))) && (callback = "onReverseComplete", selector = this._reversed), 0 > time) {
                            /** @type {boolean} */
                            this._active = false;
                            if (this._timeline.autoRemoveChildren && this._reversed) {
                                /** @type {boolean} */
                                data = selector = true;
                                /** @type {string} */
                                callback = "onReverseComplete";
                            } else {
                                if (this._rawPrevTime >= 0) {
                                    if (this._first) {
                                        /** @type {boolean} */
                                        data = true;
                                    }
                                }
                            }
                            /** @type {number} */
                            this._rawPrevTime = time;
                        } else {
                            if (this._rawPrevTime = this._duration || (!recurring || (time || this._rawPrevTime === time)) ? time : _tinyNum, 0 === time && selector) {
                                tween = this._first;
                                for (; tween && 0 === tween._startTime;) {
                                    if (!tween._duration) {
                                        /** @type {boolean} */
                                        selector = false;
                                    }
                                    tween = tween._next;
                                }
                            }
                            /** @type {number} */
                            time = 0;
                            if (!this._initted) {
                                /** @type {boolean} */
                                data = true;
                            }
                        }
                    } else {
                        if (this._hasPause && (!this._forcingPlayhead && !recurring)) {
                            if (time >= prevTime) {
                                tween = this._first;
                                for (; tween && (tween._startTime <= time && !self);) {
                                    if (!tween._duration) {
                                        if (!("isPause" !== tween.data)) {
                                            if (!tween.ratio) {
                                                if (!(0 === tween._startTime && 0 === this._rawPrevTime)) {
                                                    self = tween;
                                                }
                                            }
                                        }
                                    }
                                    tween = tween._next;
                                }
                            } else {
                                tween = this._last;
                                for (; tween && (tween._startTime >= time && !self);) {
                                    if (!tween._duration) {
                                        if ("isPause" === tween.data) {
                                            if (tween._rawPrevTime > 0) {
                                                self = tween;
                                            }
                                        }
                                    }
                                    tween = tween._prev;
                                }
                            }
                            if (self) {
                                this._time = time = self._startTime;
                                this._totalTime = time + this._cycle * (this._totalDuration + this._repeatDelay);
                            }
                        }
                        this._totalTime = this._time = this._rawPrevTime = time;
                    }
                }
                if (this._time !== prevTime && this._first || (opt_isDefault || (data || self))) {
                    if (this._initted || (this._initted = true), this._active || !this._paused && (this._time !== prevTime && (time > 0 && (this._active = true))), 0 === prevTime && (this.vars.onStart && (0 !== this._time && (recurring || this._callback("onStart")))), position = this._time, position >= prevTime) {
                        tween = this._first;
                        for (; tween && (next = tween._next, position === this._time && (!this._paused || previousState));) {
                            if (tween._active || tween._startTime <= position && (!tween._paused && !tween._gc)) {
                                if (self === tween) {
                                    this.pause();
                                }
                                if (tween._reversed) {
                                    tween.render((tween._dirty ? tween.totalDuration() : tween._totalDuration) - (time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                                } else {
                                    tween.render((time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                                }
                            }
                            tween = next;
                        }
                    } else {
                        tween = this._last;
                        for (; tween && (next = tween._prev, position === this._time && (!this._paused || previousState));) {
                            if (tween._active || tween._startTime <= prevTime && (!tween._paused && !tween._gc)) {
                                if (self === tween) {
                                    self = tween._prev;
                                    for (; self && self.endTime() > this._time;) {
                                        self.render(self._reversed ? self.totalDuration() - (time - self._startTime) * self._timeScale : (time - self._startTime) * self._timeScale, recurring, opt_isDefault);
                                        self = self._prev;
                                    }
                                    /** @type {null} */
                                    self = null;
                                    this.pause();
                                }
                                if (tween._reversed) {
                                    tween.render((tween._dirty ? tween.totalDuration() : tween._totalDuration) - (time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                                } else {
                                    tween.render((time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                                }
                            }
                            tween = next;
                        }
                    }
                    if (this._onUpdate) {
                        if (!recurring) {
                            if (codeSegments.length) {
                                _isFunction();
                            }
                            this._callback("onUpdate");
                        }
                    }
                    if (callback) {
                        if (!this._gc) {
                            if (prevStart === this._startTime || prevTimeScale !== this._timeScale) {
                                if (0 === this._time || totalDur >= this.totalDuration()) {
                                    if (selector) {
                                        if (codeSegments.length) {
                                            _isFunction();
                                        }
                                        if (this._timeline.autoRemoveChildren) {
                                            this._enabled(false, false);
                                        }
                                        /** @type {boolean} */
                                        this._active = false;
                                    }
                                    if (!recurring) {
                                        if (this.vars[callback]) {
                                            this._callback(callback);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, p._hasPausedChild = function () {
                var tween = this._first;
                for (; tween;) {
                    if (tween._paused || tween instanceof TimelineLite && tween._hasPausedChild()) {
                        return true;
                    }
                    tween = tween._next;
                }
                return false;
            }, p.getChildren = function (nested, tweens, timelines, ignoreBeforeTime) {
                ignoreBeforeTime = ignoreBeforeTime || -9999999999;
                /** @type {Array} */
                var a = [];
                var tween = this._first;
                /** @type {number} */
                var cnt = 0;
                for (; tween;) {
                    if (!(tween._startTime < ignoreBeforeTime)) {
                        if (tween instanceof TweenLite) {
                            if (tweens !== false) {
                                a[cnt++] = tween;
                            }
                        } else {
                            if (timelines !== false) {
                                a[cnt++] = tween;
                            }
                            if (nested !== false) {
                                /** @type {Array} */
                                a = a.concat(tween.getChildren(true, tweens, timelines));
                                /** @type {number} */
                                cnt = a.length;
                            }
                        }
                    }
                    tween = tween._next;
                }
                return a;
            }, p.getTweensOf = function (target, nested) {
                var tweens;
                var i;
                var _enabled = this._gc;
                /** @type {Array} */
                var a = [];
                /** @type {number} */
                var ia = 0;
                if (_enabled) {
                    this._enabled(true, true);
                }
                tweens = TweenLite.getTweensOf(target);
                i = tweens.length;
                for (; --i > -1;) {
                    if (tweens[i].timeline === this || nested && this._contains(tweens[i])) {
                        a[ia++] = tweens[i];
                    }
                }
                return _enabled && this._enabled(false, true), a;
            }, p.recent = function () {
                return this._recent;
            }, p._contains = function (tween) {
                var tl = tween.timeline;
                for (; tl;) {
                    if (tl === this) {
                        return true;
                    }
                    tl = tl.timeline;
                }
                return false;
            }, p.shiftChildren = function (amount, recurring, ignoreBeforeTime) {
                ignoreBeforeTime = ignoreBeforeTime || 0;
                var p;
                var tween = this._first;
                var labels = this._labels;
                for (; tween;) {
                    if (tween._startTime >= ignoreBeforeTime) {
                        tween._startTime += amount;
                    }
                    tween = tween._next;
                }
                if (recurring) {
                    for (p in labels) {
                        if (labels[p] >= ignoreBeforeTime) {
                            labels[p] += amount;
                        }
                    }
                }
                return this._uncache(true);
            }, p._kill = function (vars, target) {
                if (!vars && !target) {
                    return this._enabled(false, false);
                }
                var tokenized = target ? this.getTweensOf(target) : this.getChildren(true, true, false);
                var index = tokenized.length;
                /** @type {boolean} */
                var changed = false;
                for (; --index > -1;) {
                    if (tokenized[index]._kill(vars, target)) {
                        /** @type {boolean} */
                        changed = true;
                    }
                }
                return changed;
            }, p.clear = function (arr) {
                var tweens = this.getChildren(false, true, true);
                var i = tweens.length;
                /** @type {number} */
                this._time = this._totalTime = 0;
                for (; --i > -1;) {
                    tweens[i]._enabled(false, false);
                }
                return arr !== false && (this._labels = {}), this._uncache(true);
            }, p.invalidate = function () {
                var tween = this._first;
                for (; tween;) {
                    tween.invalidate();
                    tween = tween._next;
                }
                return Animation.prototype.invalidate.call(this);
            }, p._enabled = function (recurring, opt_isDefault) {
                if (recurring === this._gc) {
                    var tween = this._first;
                    for (; tween;) {
                        tween._enabled(recurring, true);
                        tween = tween._next;
                    }
                }
                return SimpleTimeline.prototype._enabled.call(this, recurring, opt_isDefault);
            }, p.totalTime = function (putativeSpy, dataAndEvents, deepDataAndEvents) {
                /** @type {boolean} */
                this._forcingPlayhead = true;
                var props = Animation.prototype.totalTime.apply(this, arguments);
                return this._forcingPlayhead = false, props;
            }, p.duration = function (value) {
                return arguments.length ? (0 !== this.duration() && (0 !== value && this.timeScale(this._duration / value)), this) : (this._dirty && this.totalDuration(), this._duration);
            }, p.totalDuration = function (value) {
                if (!arguments.length) {
                    if (this._dirty) {
                        var prev;
                        var ms;
                        /** @type {number} */
                        var max = 0;
                        var tween = this._last;
                        /** @type {number} */
                        var prevStart = 999999999999;
                        for (; tween;) {
                            prev = tween._prev;
                            if (tween._dirty) {
                                tween.totalDuration();
                            }
                            if (tween._startTime > prevStart && (this._sortChildren && !tween._paused)) {
                                this.add(tween, tween._startTime - tween._delay);
                            } else {
                                prevStart = tween._startTime;
                            }
                            if (tween._startTime < 0) {
                                if (!tween._paused) {
                                    max -= tween._startTime;
                                    if (this._timeline.smoothChildTiming) {
                                        this._startTime += tween._startTime / this._timeScale;
                                    }
                                    this.shiftChildren(-tween._startTime, false, -9999999999);
                                    /** @type {number} */
                                    prevStart = 0;
                                }
                            }
                            ms = tween._startTime + tween._totalDuration / tween._timeScale;
                            if (ms > max) {
                                max = ms;
                            }
                            tween = prev;
                        }
                        this._duration = this._totalDuration = max;
                        /** @type {boolean} */
                        this._dirty = false;
                    }
                    return this._totalDuration;
                }
                return value && this.totalDuration() ? this.timeScale(this._totalDuration / value) : this;
            }, p.paused = function (recurring) {
                if (!recurring) {
                    var child = this._first;
                    var elType = this._time;
                    for (; child;) {
                        if (child._startTime === elType) {
                            if ("isPause" === child.data) {
                                /** @type {number} */
                                child._rawPrevTime = 0;
                            }
                        }
                        child = child._next;
                    }
                }
                return Animation.prototype.paused.apply(this, arguments);
            }, p.usesFrames = function () {
                var tl = this._timeline;
                for (; tl._timeline;) {
                    tl = tl._timeline;
                }
                return tl === Animation._rootFramesTimeline;
            }, p.rawTime = function () {
                return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
            }, TimelineLite;
        }, true);
        _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (TimelineLite, TweenLite, dataAndEvents) {
            /**
             * @param {Object} vars
             * @return {undefined}
             */
            var TimelineMax = function (vars) {
                TimelineLite.call(this, vars);
                this._repeat = this.vars.repeat || 0;
                this._repeatDelay = this.vars.repeatDelay || 0;
                /** @type {number} */
                this._cycle = 0;
                /** @type {boolean} */
                this._yoyo = this.vars.yoyo === true;
                /** @type {boolean} */
                this._dirty = true;
            };
            /** @type {number} */
            var b = 1E-10;
            var inputs = TweenLite._internals;
            var ii = inputs.lazyTweens;
            var length = inputs.lazyRender;
            var ease = new dataAndEvents(null, null, 1, 0);
            var p = TimelineMax.prototype = new TimelineLite;
            return p.constructor = TimelineMax, p.kill()._gc = false, TimelineMax.version = "1.18.4", p.invalidate = function () {
                return this._yoyo = this.vars.yoyo === true, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(true), TimelineLite.prototype.invalidate.call(this);
            }, p.addCallback = function (callback, position, params, scope) {
                return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
            }, p.removeCallback = function (target, position) {
                if (target) {
                    if (null == position) {
                        this._kill(null, target);
                    } else {
                        var a = this.getTweensOf(target, false);
                        var i = a.length;
                        var time = this._parseTimeOrLabel(position);
                        for (; --i > -1;) {
                            if (a[i]._startTime === time) {
                                a[i]._enabled(false, false);
                            }
                        }
                    }
                }
                return this;
            }, p.removePause = function (positionError) {
                return this.removeCallback(TimelineLite._internals.pauseCallback, positionError);
            }, p.tweenTo = function (position, vars) {
                vars = vars || {};
                var duration;
                var p;
                var t;
                var copy = {
                    ease: ease,
                    useFrames: this.usesFrames(),
                    immediateRender: false
                };
                for (p in vars) {
                    copy[p] = vars[p];
                }
                return copy.time = this._parseTimeOrLabel(position), duration = Math.abs(Number(copy.time) - this._time) / this._timeScale || 0.001, t = new TweenLite(this, duration, copy), copy.onStart = function () {
                    t.target.paused(true);
                    if (t.vars.time !== t.target.time()) {
                        if (duration === t.duration()) {
                            t.duration(Math.abs(t.vars.time - t.target.time()) / t.target._timeScale);
                        }
                    }
                    if (vars.onStart) {
                        t._callback("onStart");
                    }
                }, t;
            }, p.tweenFromTo = function (fromPosition, toPosition, vars) {
                vars = vars || {};
                fromPosition = this._parseTimeOrLabel(fromPosition);
                vars.startAt = {
                    onComplete: this.seek,
                    onCompleteParams: [fromPosition],
                    callbackScope: this
                };
                /** @type {boolean} */
                vars.immediateRender = vars.immediateRender !== false;
                var t = this.tweenTo(toPosition, vars);
                return t.duration(Math.abs(t.vars.time - fromPosition) / this._timeScale || 0.001);
            }, p.render = function (time, recurring, opt_isDefault) {
                if (this._gc) {
                    this._enabled(true, false);
                }
                var tween;
                var selector;
                var next;
                var callback;
                var data;
                var cycleDuration;
                var self;
                var position;
                var totalDur = this._dirty ? this.totalDuration() : this._totalDuration;
                var dur = this._duration;
                var prevTime = this._time;
                var prevTotalTime = this._totalTime;
                var prevStart = this._startTime;
                var prevTimeScale = this._timeScale;
                var a = this._rawPrevTime;
                var prevPaused = this._paused;
                var prevCycle = this._cycle;
                if (time >= totalDur - 1E-7) {
                    if (!this._locked) {
                        this._totalTime = totalDur;
                        this._cycle = this._repeat;
                    }
                    if (!this._reversed) {
                        if (!this._hasPausedChild()) {
                            /** @type {boolean} */
                            selector = true;
                            /** @type {string} */
                            callback = "onComplete";
                            /** @type {boolean} */
                            data = !!this._timeline.autoRemoveChildren;
                            if (0 === this._duration) {
                                if (0 >= time && time >= -1E-7 || (0 > a || a === b)) {
                                    if (a !== time) {
                                        if (this._first) {
                                            /** @type {boolean} */
                                            data = true;
                                            if (a > b) {
                                                /** @type {string} */
                                                callback = "onReverseComplete";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this._rawPrevTime = this._duration || (!recurring || (time || this._rawPrevTime === time)) ? time : b;
                    if (this._yoyo && 0 !== (1 & this._cycle)) {
                        /** @type {number} */
                        this._time = time = 0;
                    } else {
                        this._time = dur;
                        time = dur + 1E-4;
                    }
                } else {
                    if (1E-7 > time) {
                        if (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== prevTime || 0 === dur && (a !== b && ((a > 0 || 0 > time && a >= 0) && !this._locked))) && (callback = "onReverseComplete", selector = this._reversed), 0 > time) {
                            /** @type {boolean} */
                            this._active = false;
                            if (this._timeline.autoRemoveChildren && this._reversed) {
                                /** @type {boolean} */
                                data = selector = true;
                                /** @type {string} */
                                callback = "onReverseComplete";
                            } else {
                                if (a >= 0) {
                                    if (this._first) {
                                        /** @type {boolean} */
                                        data = true;
                                    }
                                }
                            }
                            /** @type {number} */
                            this._rawPrevTime = time;
                        } else {
                            if (this._rawPrevTime = dur || (!recurring || (time || this._rawPrevTime === time)) ? time : b, 0 === time && selector) {
                                tween = this._first;
                                for (; tween && 0 === tween._startTime;) {
                                    if (!tween._duration) {
                                        /** @type {boolean} */
                                        selector = false;
                                    }
                                    tween = tween._next;
                                }
                            }
                            /** @type {number} */
                            time = 0;
                            if (!this._initted) {
                                /** @type {boolean} */
                                data = true;
                            }
                        }
                    } else {
                        if (0 === dur && (0 > a && (data = true)), this._time = this._rawPrevTime = time, this._locked || (this._totalTime = time, 0 !== this._repeat && (cycleDuration = dur + this._repeatDelay, this._cycle = this._totalTime / cycleDuration >> 0, 0 !== this._cycle && (this._cycle === this._totalTime / cycleDuration && (time >= prevTotalTime && this._cycle--)), this._time = this._totalTime - this._cycle * cycleDuration, this._yoyo && (0 !== (1 & this._cycle) && (this._time = dur - this._time)),
                                this._time > dur ? (this._time = dur, time = dur + 1E-4) : this._time < 0 ? this._time = time = 0 : time = this._time)), this._hasPause && (!this._forcingPlayhead && !recurring)) {
                            if (time = this._time, time >= prevTime) {
                                tween = this._first;
                                for (; tween && (tween._startTime <= time && !self);) {
                                    if (!tween._duration) {
                                        if (!("isPause" !== tween.data)) {
                                            if (!tween.ratio) {
                                                if (!(0 === tween._startTime && 0 === this._rawPrevTime)) {
                                                    self = tween;
                                                }
                                            }
                                        }
                                    }
                                    tween = tween._next;
                                }
                            } else {
                                tween = this._last;
                                for (; tween && (tween._startTime >= time && !self);) {
                                    if (!tween._duration) {
                                        if ("isPause" === tween.data) {
                                            if (tween._rawPrevTime > 0) {
                                                self = tween;
                                            }
                                        }
                                    }
                                    tween = tween._prev;
                                }
                            }
                            if (self) {
                                this._time = time = self._startTime;
                                this._totalTime = time + this._cycle * (this._totalDuration + this._repeatDelay);
                            }
                        }
                    }
                }
                if (this._cycle !== prevCycle && !this._locked) {
                    var backwards = this._yoyo && 0 !== (1 & prevCycle);
                    /** @type {boolean} */
                    var wrap = backwards === (this._yoyo && 0 !== (1 & this._cycle));
                    var recTotalTime = this._totalTime;
                    var recCycle = this._cycle;
                    var recRawPrevTime = this._rawPrevTime;
                    var recTime = this._time;
                    if (this._totalTime = prevCycle * dur, this._cycle < prevCycle ? backwards = !backwards : this._totalTime += dur, this._time = prevTime, this._rawPrevTime = 0 === dur ? a - 1E-4 : a, this._cycle = prevCycle, this._locked = true, prevTime = backwards ? 0 : dur, this.render(prevTime, recurring, 0 === dur), recurring || (this._gc || this.vars.onRepeat && this._callback("onRepeat")), prevTime !== this._time) {
                        return;
                    }
                    if (wrap && (prevTime = backwards ? dur + 1E-4 : -1E-4, this.render(prevTime, true, false)), this._locked = false, this._paused && !prevPaused) {
                        return;
                    }
                    this._time = recTime;
                    this._totalTime = recTotalTime;
                    this._cycle = recCycle;
                    this._rawPrevTime = recRawPrevTime;
                }
                if (!(this._time !== prevTime && this._first || (opt_isDefault || (data || self)))) {
                    return void(prevTotalTime !== this._totalTime && (this._onUpdate && (recurring || this._callback("onUpdate"))));
                }
                if (this._initted || (this._initted = true), this._active || !this._paused && (this._totalTime !== prevTotalTime && (time > 0 && (this._active = true))), 0 === prevTotalTime && (this.vars.onStart && (0 !== this._totalTime && (recurring || this._callback("onStart")))), position = this._time, position >= prevTime) {
                    tween = this._first;
                    for (; tween && (next = tween._next, position === this._time && (!this._paused || prevPaused));) {
                        if (tween._active || tween._startTime <= this._time && (!tween._paused && !tween._gc)) {
                            if (self === tween) {
                                this.pause();
                            }
                            if (tween._reversed) {
                                tween.render((tween._dirty ? tween.totalDuration() : tween._totalDuration) - (time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                            } else {
                                tween.render((time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                            }
                        }
                        tween = next;
                    }
                } else {
                    tween = this._last;
                    for (; tween && (next = tween._prev, position === this._time && (!this._paused || prevPaused));) {
                        if (tween._active || tween._startTime <= prevTime && (!tween._paused && !tween._gc)) {
                            if (self === tween) {
                                self = tween._prev;
                                for (; self && self.endTime() > this._time;) {
                                    self.render(self._reversed ? self.totalDuration() - (time - self._startTime) * self._timeScale : (time - self._startTime) * self._timeScale, recurring, opt_isDefault);
                                    self = self._prev;
                                }
                                /** @type {null} */
                                self = null;
                                this.pause();
                            }
                            if (tween._reversed) {
                                tween.render((tween._dirty ? tween.totalDuration() : tween._totalDuration) - (time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                            } else {
                                tween.render((time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                            }
                        }
                        tween = next;
                    }
                }
                if (this._onUpdate) {
                    if (!recurring) {
                        if (ii.length) {
                            length();
                        }
                        this._callback("onUpdate");
                    }
                }
                if (callback) {
                    if (!this._locked) {
                        if (!this._gc) {
                            if (prevStart === this._startTime || prevTimeScale !== this._timeScale) {
                                if (0 === this._time || totalDur >= this.totalDuration()) {
                                    if (selector) {
                                        if (ii.length) {
                                            length();
                                        }
                                        if (this._timeline.autoRemoveChildren) {
                                            this._enabled(false, false);
                                        }
                                        /** @type {boolean} */
                                        this._active = false;
                                    }
                                    if (!recurring) {
                                        if (this.vars[callback]) {
                                            this._callback(callback);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, p.getActive = function (nested, tweens, timelines) {
                if (null == nested) {
                    /** @type {boolean} */
                    nested = true;
                }
                if (null == tweens) {
                    /** @type {boolean} */
                    tweens = true;
                }
                if (null == timelines) {
                    /** @type {boolean} */
                    timelines = false;
                }
                var i;
                var el;
                /** @type {Array} */
                var arrayLike = [];
                var all = this.getChildren(nested, tweens, timelines);
                /** @type {number} */
                var len = 0;
                var l = all.length;
                /** @type {number} */
                i = 0;
                for (; l > i; i++) {
                    el = all[i];
                    if (el.isActive()) {
                        arrayLike[len++] = el;
                    }
                }
                return arrayLike;
            }, p.getLabelAfter = function (time) {
                if (!time) {
                    if (0 !== time) {
                        time = this._time;
                    }
                }
                var i;
                var labels = this.getLabelsArray();
                var l = labels.length;
                /** @type {number} */
                i = 0;
                for (; l > i; i++) {
                    if (labels[i].time > time) {
                        return labels[i].name;
                    }
                }
                return null;
            }, p.getLabelBefore = function (time) {
                if (null == time) {
                    time = this._time;
                }
                var labels = this.getLabelsArray();
                var i = labels.length;
                for (; --i > -1;) {
                    if (labels[i].time < time) {
                        return labels[i].name;
                    }
                }
                return null;
            }, p.getLabelsArray = function () {
                var p;
                /** @type {Array} */
                var result = [];
                /** @type {number} */
                var ri = 0;
                for (p in this._labels) {
                    result[ri++] = {
                        time: this._labels[p],
                        name: p
                    };
                }
                return result.sort(function (a, b) {
                    return a.time - b.time;
                }), result;
            }, p.progress = function (value, dataAndEvents) {
                return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - value : value) + this._cycle * (this._duration + this._repeatDelay), dataAndEvents) : this._time / this.duration();
            }, p.totalProgress = function (value, dataAndEvents) {
                return arguments.length ? this.totalTime(this.totalDuration() * value, dataAndEvents) : this._totalTime / this.totalDuration();
            }, p.totalDuration = function (value) {
                return arguments.length ? -1 !== this._repeat && value ? this.timeScale(this.totalDuration() / value) : this : (this._dirty && (TimelineLite.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration);
            }, p.time = function (value, node) {
                return arguments.length ? (this._dirty && this.totalDuration(), value > this._duration && (value = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? value = this._duration - value + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (value += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(value, node)) : this._time;
            }, p.repeat = function (value) {
                return arguments.length ? (this._repeat = value, this._uncache(true)) : this._repeat;
            }, p.repeatDelay = function (value) {
                return arguments.length ? (this._repeatDelay = value, this._uncache(true)) : this._repeatDelay;
            }, p.yoyo = function (value) {
                return arguments.length ? (this._yoyo = value, this) : this._yoyo;
            }, p.currentLabel = function (value) {
                return arguments.length ? this.seek(value, true) : this.getLabelBefore(this._time + 1E-8);
            }, TimelineMax;
        }, true);
        (function () {
            /** @type {number} */
            var u = 180 / Math.PI;
            /** @type {Array} */
            var stack = [];
            /** @type {Array} */
            var codeSegments = [];
            /** @type {Array} */
            var offsets = [];
            var cn = {};
            var collection = _gsScope._gsDefine.globals;
            /**
             * @param {number} b
             * @param {number} a
             * @param {number} c
             * @param {number} d
             * @return {undefined}
             */
            var Node = function (b, a, c, d) {
                /** @type {number} */
                this.a = b;
                /** @type {number} */
                this.b = a;
                /** @type {number} */
                this.c = c;
                /** @type {number} */
                this.d = d;
                /** @type {number} */
                this.da = d - b;
                /** @type {number} */
                this.ca = c - b;
                /** @type {number} */
                this.ba = a - b;
            };
            /** @type {string} */
            var value = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,";
            /**
             * @param {number} x
             * @param {number} name
             * @param {number} url
             * @param {number} index
             * @return {?}
             */
            var get = function (x, name, url, index) {
                var record = {
                    a: x
                };
                var rgb = {};
                var b = {};
                var c = {
                    c: index
                };
                /** @type {number} */
                var delta = (x + name) / 2;
                /** @type {number} */
                var sum = (name + url) / 2;
                /** @type {number} */
                var n = (url + index) / 2;
                /** @type {number} */
                var t2 = (delta + sum) / 2;
                /** @type {number} */
                var t1 = (sum + n) / 2;
                /** @type {number} */
                var t3 = (t1 - t2) / 8;
                return record.b = delta + (x - delta) / 4, rgb.b = t2 + t3, record.c = rgb.a = (record.b + rgb.b) / 2, rgb.c = b.a = (t2 + t1) / 2, b.b = t1 - t3, c.b = n + (index - n) / 4, b.c = c.a = (b.b + c.b) / 2, [record, rgb, b, c];
            };
            /**
             * @param {Array} path
             * @param {number} index
             * @param {boolean} z
             * @param {boolean} deepDataAndEvents
             * @param {?} place
             * @return {undefined}
             */
            var go = function (path, index, z, deepDataAndEvents, place) {
                var offset;
                var b;
                var i;
                var stop;
                var that;
                var start;
                var end;
                var len;
                var x;
                var v;
                var primeCount;
                var compositeCount;
                var a;
                /** @type {number} */
                var distanceX = path.length - 1;
                /** @type {number} */
                var position = 0;
                var y = path[0].a;
                /** @type {number} */
                offset = 0;
                for (; distanceX > offset; offset++) {
                    that = path[position];
                    b = that.a;
                    i = that.d;
                    stop = path[position + 1].d;
                    if (place) {
                        primeCount = stack[offset];
                        compositeCount = codeSegments[offset];
                        /** @type {number} */
                        a = (compositeCount + primeCount) * index * 0.25 / (deepDataAndEvents ? 0.5 : offsets[offset] || 0.5);
                        /** @type {number} */
                        start = i - (i - b) * (deepDataAndEvents ? 0.5 * index : 0 !== primeCount ? a / primeCount : 0);
                        end = i + (stop - i) * (deepDataAndEvents ? 0.5 * index : 0 !== compositeCount ? a / compositeCount : 0);
                        /** @type {number} */
                        len = i - (start + ((end - start) * (3 * primeCount / (primeCount + compositeCount) + 0.5) / 4 || 0));
                    } else {
                        /** @type {number} */
                        start = i - (i - b) * index * 0.5;
                        end = i + (stop - i) * index * 0.5;
                        /** @type {number} */
                        len = i - (start + end) / 2;
                    }
                    start += len;
                    end += len;
                    /** @type {number} */
                    that.c = x = start;
                    if (0 !== offset) {
                        that.b = y;
                    } else {
                        that.b = y = that.a + 0.6 * (that.c - that.a);
                    }
                    /** @type {number} */
                    that.da = i - b;
                    /** @type {number} */
                    that.ca = x - b;
                    /** @type {number} */
                    that.ba = y - b;
                    if (z) {
                        v = get(b, y, x, i);
                        path.splice(position, 1, v[0], v[1], v[2], v[3]);
                        position += 4;
                    } else {
                        position++;
                    }
                    /** @type {number} */
                    y = end;
                }
                that = path[position];
                that.b = y;
                that.c = y + 0.4 * (that.d - y);
                /** @type {number} */
                that.da = that.d - that.a;
                /** @type {number} */
                that.ca = that.c - that.a;
                /** @type {number} */
                that.ba = y - that.a;
                if (z) {
                    v = get(that.a, y, that.c, that.d);
                    path.splice(position, 1, v[0], v[1], v[2], v[3]);
                }
            };
            /**
             * @param {Array} arr
             * @param {string} j
             * @param {?} rest_items
             * @param {Object} index
             * @return {?}
             */
            var insert = function (arr, j, rest_items, index) {
                var l;
                var i;
                var y;
                var prevY;
                var z;
                var part;
                /** @type {Array} */
                var nodes = [];
                if (index) {
                    /** @type {Array} */
                    arr = [index].concat(arr);
                    /** @type {number} */
                    i = arr.length;
                    for (; --i > -1;) {
                        if ("string" == typeof (part = arr[i][j])) {
                            if ("=" === part.charAt(1)) {
                                arr[i][j] = index[j] + Number(part.charAt(0) + part.substr(2));
                            }
                        }
                    }
                }
                if (l = arr.length - 2, 0 > l) {
                    return nodes[0] = new Node(arr[0][j], 0, 0, arr[-1 > l ? 0 : 1][j]), nodes;
                }
                /** @type {number} */
                i = 0;
                for (; l > i; i++) {
                    y = arr[i][j];
                    prevY = arr[i + 1][j];
                    nodes[i] = new Node(y, 0, 0, prevY);
                    if (rest_items) {
                        z = arr[i + 2][j];
                        stack[i] = (stack[i] || 0) + (prevY - y) * (prevY - y);
                        codeSegments[i] = (codeSegments[i] || 0) + (z - prevY) * (z - prevY);
                    }
                }
                return nodes[i] = new Node(arr[i][j], 0, 0, arr[i + 1][j]), nodes;
            };
            /**
             * @param {Array} nodes
             * @param {number} options
             * @param {boolean} z
             * @param {boolean} deepDataAndEvents
             * @param {string} val
             * @param {Object} node
             * @return {?}
             */
            var update = function (nodes, options, z, deepDataAndEvents, val, node) {
                var i;
                var x;
                var out;
                var offset;
                var dz;
                var distanceX;
                var t;
                var p1;
                var ret = {};
                /** @type {Array} */
                var a = [];
                var p2 = node || nodes[0];
                /** @type {string} */
                val = "string" == typeof val ? "," + val + "," : value;
                if (null == options) {
                    /** @type {number} */
                    options = 1;
                }
                for (x in nodes[0]) {
                    a.push(x);
                }
                if (nodes.length > 1) {
                    p1 = nodes[nodes.length - 1];
                    /** @type {boolean} */
                    t = true;
                    /** @type {number} */
                    i = a.length;
                    for (; --i > -1;) {
                        if (x = a[i], Math.abs(p2[x] - p1[x]) > 0.05) {
                            /** @type {boolean} */
                            t = false;
                            break;
                        }
                    }
                    if (t) {
                        nodes = nodes.concat();
                        if (node) {
                            nodes.unshift(node);
                        }
                        nodes.push(nodes[1]);
                        node = nodes[nodes.length - 3];
                    }
                }
                /** @type {number} */
                stack.length = codeSegments.length = offsets.length = 0;
                /** @type {number} */
                i = a.length;
                for (; --i > -1;) {
                    x = a[i];
                    /** @type {boolean} */
                    cn[x] = -1 !== val.indexOf("," + x + ",");
                    ret[x] = insert(nodes, x, cn[x], node);
                }
                /** @type {number} */
                i = stack.length;
                for (; --i > -1;) {
                    /** @type {number} */
                    stack[i] = Math.sqrt(stack[i]);
                    /** @type {number} */
                    codeSegments[i] = Math.sqrt(codeSegments[i]);
                }
                if (!deepDataAndEvents) {
                    /** @type {number} */
                    i = a.length;
                    for (; --i > -1;) {
                        if (cn[x]) {
                            out = ret[a[i]];
                            /** @type {number} */
                            distanceX = out.length - 1;
                            /** @type {number} */
                            offset = 0;
                            for (; distanceX > offset; offset++) {
                                /** @type {number} */
                                dz = out[offset + 1].da / codeSegments[offset] + out[offset].da / stack[offset] || 0;
                                offsets[offset] = (offsets[offset] || 0) + dz * dz;
                            }
                        }
                    }
                    /** @type {number} */
                    i = offsets.length;
                    for (; --i > -1;) {
                        /** @type {number} */
                        offsets[i] = Math.sqrt(offsets[i]);
                    }
                }
                /** @type {number} */
                i = a.length;
                /** @type {number} */
                offset = z ? 4 : 1;
                for (; --i > -1;) {
                    x = a[i];
                    out = ret[x];
                    go(out, options, z, deepDataAndEvents, cn[x]);
                    if (t) {
                        out.splice(0, offset);
                        out.splice(out.length - offset, offset);
                    }
                }
                return ret;
            };
            /**
             * @param {Object} args
             * @param {string} details
             * @param {Object} obj
             * @return {?}
             */
            var add = function (args, details, obj) {
                details = details || "soft";
                var text;
                var diff;
                var firstNum;
                var se;
                var st;
                var idx;
                var i;
                var l;
                var key;
                var pos;
                var val;
                var acc = {};
                /** @type {number} */
                var length = "cubic" === details ? 3 : 2;
                /** @type {boolean} */
                var div = "soft" === details;
                /** @type {Array} */
                var keys = [];
                if (div && (obj && (args = [obj].concat(args))), null == args || args.length < length + 1) {
                    throw "invalid Bezier data";
                }
                for (key in args[0]) {
                    keys.push(key);
                }
                /** @type {number} */
                idx = keys.length;
                for (; --idx > -1;) {
                    key = keys[idx];
                    /** @type {Array} */
                    acc[key] = st = [];
                    /** @type {number} */
                    pos = 0;
                    l = args.length;
                    /** @type {number} */
                    i = 0;
                    for (; l > i; i++) {
                        text = null == obj ? args[i][key] : "string" == typeof (val = args[i][key]) && "=" === val.charAt(1) ? obj[key] + Number(val.charAt(0) + val.substr(2)) : Number(val);
                        if (div) {
                            if (i > 1) {
                                if (l - 1 > i) {
                                    /** @type {number} */
                                    st[pos++] = (text + st[pos - 2]) / 2;
                                }
                            }
                        }
                        st[pos++] = text;
                    }
                    /** @type {number} */
                    l = pos - length + 1;
                    /** @type {number} */
                    pos = 0;
                    /** @type {number} */
                    i = 0;
                    for (; l > i; i += length) {
                        text = st[i];
                        diff = st[i + 1];
                        firstNum = st[i + 2];
                        se = 2 === length ? 0 : st[i + 3];
                        st[pos++] = val = 3 === length ? new Node(text, diff, firstNum, se) : new Node(text, (2 * diff + text) / 3, (2 * diff + firstNum) / 3, firstNum);
                    }
                    /** @type {number} */
                    st.length = pos;
                }
                return acc;
            };
            /**
             * @param {Arguments} tokenized
             * @param {Array} dev
             * @param {number} size
             * @return {undefined}
             */
            var parseModel = function (tokenized, dev, size) {
                var g;
                var b;
                var h;
                var t;
                var a00;
                var a10;
                var x;
                var s;
                var y;
                var e;
                var i;
                /** @type {number} */
                var radius = 1 / size;
                var index = tokenized.length;
                for (; --index > -1;) {
                    e = tokenized[index];
                    h = e.a;
                    /** @type {number} */
                    t = e.d - h;
                    /** @type {number} */
                    a00 = e.c - h;
                    /** @type {number} */
                    a10 = e.b - h;
                    /** @type {number} */
                    g = b = 0;
                    /** @type {number} */
                    s = 1;
                    for (; size >= s; s++) {
                        /** @type {number} */
                        x = radius * s;
                        /** @type {number} */
                        y = 1 - x;
                        /** @type {number} */
                        g = b - (b = (x * x * t + 3 * y * (x * a00 + y * a10)) * x);
                        /** @type {number} */
                        i = index * size + s - 1;
                        dev[i] = (dev[i] || 0) + g * g;
                    }
                }
            };
            /**
             * @param {Object} map
             * @param {number} len
             * @return {?}
             */
            var shuffle = function (map, len) {
                /** @type {number} */
                len = len >> 0 || 6;
                var letter;
                var i;
                var ilen;
                var j;
                /** @type {Array} */
                var dev = [];
                /** @type {Array} */
                var mat = [];
                /** @type {number} */
                var value = 0;
                /** @type {number} */
                var x = 0;
                /** @type {number} */
                var last = len - 1;
                /** @type {Array} */
                var state = [];
                /** @type {Array} */
                var tmp = [];
                for (letter in map) {
                    parseModel(map[letter], dev, len);
                }
                /** @type {number} */
                ilen = dev.length;
                /** @type {number} */
                i = 0;
                for (; ilen > i; i++) {
                    value += Math.sqrt(dev[i]);
                    /** @type {number} */
                    j = i % len;
                    /** @type {number} */
                    tmp[j] = value;
                    if (j === last) {
                        x += value;
                        /** @type {number} */
                        j = i / len >> 0;
                        /** @type {Array} */
                        state[j] = tmp;
                        /** @type {number} */
                        mat[j] = x;
                        /** @type {number} */
                        value = 0;
                        /** @type {Array} */
                        tmp = [];
                    }
                }
                return {
                    length: x,
                    lengths: mat,
                    segments: state
                };
            };
            var self = _gsScope._gsDefine.plugin({
                propName: "bezier",
                priority: -1,
                version: "1.3.5",
                API: 2,
                global: true,
                /**
                 * @param {number} target
                 * @param {Object} options
                 * @param {?} tween
                 * @return {?}
                 */
                init: function (target, options, tween) {
                    /** @type {number} */
                    this._target = target;
                    if (options instanceof Array) {
                        options = {
                            values: options
                        };
                    }
                    this._func = {};
                    this._round = {};
                    /** @type {Array} */
                    this._props = [];
                    /** @type {number} */
                    this._timeRes = null == options.timeResolution ? 6 : parseInt(options.timeResolution, 10);
                    var name;
                    var transform;
                    var y;
                    var x;
                    var vvar;
                    /** @type {Array} */
                    var args = options.values || [];
                    var ref = {};
                    var arg = args[0];
                    var data = options.autoRotate || tween.vars.orientToBezier;
                    /** @type {(Array|null)} */
                    this._autoRotate = data ? data instanceof Array ? data : [
                        ["x", "y", "rotation", data === true ? 0 : Number(data) || 0]
                    ] : null;
                    for (name in arg) {
                        this._props.push(name);
                    }
                    /** @type {number} */
                    y = this._props.length;
                    for (; --y > -1;) {
                        name = this._props[y];
                        this._overwriteProps.push(name);
                        /** @type {boolean} */
                        transform = this._func[name] = "function" == typeof target[name];
                        ref[name] = transform ? target[name.indexOf("set") || "function" != typeof target["get" + name.substr(3)] ? name : "get" + name.substr(3)]() : parseFloat(target[name]);
                        if (!vvar) {
                            if (ref[name] !== args[0][name]) {
                                vvar = ref;
                            }
                        }
                    }
                    if (this._beziers = "cubic" !== options.type && ("quadratic" !== options.type && "soft" !== options.type) ? update(args, isNaN(options.curviness) ? 1 : options.curviness, false, "thruBasic" === options.type, options.correlate, vvar) : add(args, options.type, ref), this._segCount = this._beziers[name].length, this._timeRes) {
                        var atoms = shuffle(this._beziers, this._timeRes);
                        this._length = atoms.length;
                        this._lengths = atoms.lengths;
                        this._segments = atoms.segments;
                        /** @type {number} */
                        this._l1 = this._li = this._s1 = this._si = 0;
                        this._l2 = this._lengths[0];
                        this._curSeg = this._segments[0];
                        this._s2 = this._curSeg[0];
                        /** @type {number} */
                        this._prec = 1 / this._curSeg.length;
                    }
                    if (data = this._autoRotate) {
                        /** @type {Array} */
                        this._initialRotations = [];
                        if (!(data[0] instanceof Array)) {
                            /** @type {Array} */
                            this._autoRotate = data = [data];
                        }
                        /** @type {number} */
                        y = data.length;
                        for (; --y > -1;) {
                            /** @type {number} */
                            x = 0;
                            for (; 3 > x; x++) {
                                name = data[y][x];
                                this._func[name] = "function" == typeof target[name] ? target[name.indexOf("set") || "function" != typeof target["get" + name.substr(3)] ? name : "get" + name.substr(3)] : false;
                            }
                            name = data[y][2];
                            this._initialRotations[y] = (this._func[name] ? this._func[name].call(this._target) : this._target[name]) || 0;
                        }
                    }
                    return this._startRatio = tween.vars.runBackwards ? 1 : 0, true;
                },
                /**
                 * @param {?} parent
                 * @return {undefined}
                 */
                set: function (parent) {
                    var prop;
                    var row;
                    var index;
                    var key;
                    var a;
                    var k;
                    var value;
                    var start;
                    var items;
                    var buffer;
                    var size = this._segCount;
                    var $cookies = this._func;
                    var target = this._target;
                    /** @type {boolean} */
                    var charIndexBuggy = parent !== this._startRatio;
                    if (this._timeRes) {
                        if (items = this._lengths, buffer = this._curSeg, parent *= this._length, index = this._li, parent > this._l2 && size - 1 > index) {
                            /** @type {number} */
                            start = size - 1;
                            for (; start > index && (this._l2 = items[++index]) <= parent;) {}
                            this._l1 = items[index - 1];
                            this._li = index;
                            this._curSeg = buffer = this._segments[index];
                            this._s2 = buffer[this._s1 = this._si = 0];
                        } else {
                            if (parent < this._l1 && index > 0) {
                                for (; index > 0 && (this._l1 = items[--index]) >= parent;) {}
                                if (0 === index && parent < this._l1) {
                                    /** @type {number} */
                                    this._l1 = 0;
                                } else {
                                    index++;
                                }
                                this._l2 = items[index];
                                this._li = index;
                                this._curSeg = buffer = this._segments[index];
                                this._s1 = buffer[(this._si = buffer.length - 1) - 1] || 0;
                                this._s2 = buffer[this._si];
                            }
                        }
                        if (prop = index, parent -= this._l1, index = this._si, parent > this._s2 && index < buffer.length - 1) {
                            /** @type {number} */
                            start = buffer.length - 1;
                            for (; start > index && (this._s2 = buffer[++index]) <= parent;) {}
                            this._s1 = buffer[index - 1];
                            this._si = index;
                        } else {
                            if (parent < this._s1 && index > 0) {
                                for (; index > 0 && (this._s1 = buffer[--index]) >= parent;) {}
                                if (0 === index && parent < this._s1) {
                                    /** @type {number} */
                                    this._s1 = 0;
                                } else {
                                    index++;
                                }
                                this._s2 = buffer[index];
                                this._si = index;
                            }
                        }
                        /** @type {number} */
                        k = (index + (parent - this._s1) / (this._s2 - this._s1)) * this._prec || 0;
                    } else {
                        /** @type {number} */
                        prop = 0 > parent ? 0 : parent >= 1 ? size - 1 : size * parent >> 0;
                        /** @type {number} */
                        k = (parent - prop * (1 / size)) * size;
                    }
                    /** @type {number} */
                    row = 1 - k;
                    index = this._props.length;
                    for (; --index > -1;) {
                        key = this._props[index];
                        a = this._beziers[key][prop];
                        value = (k * k * a.da + 3 * row * (k * a.ca + row * a.ba)) * k + a.a;
                        if (this._round[key]) {
                            /** @type {number} */
                            value = Math.round(value);
                        }
                        if ($cookies[key]) {
                            target[key](value);
                        } else {
                            target[key] = value;
                        }
                    }
                    if (this._autoRotate) {
                        var b;
                        var x1;
                        var y1;
                        var x2;
                        var y2;
                        var unit;
                        var r;
                        var rules = this._autoRotate;
                        index = rules.length;
                        for (; --index > -1;) {
                            key = rules[index][2];
                            unit = rules[index][3] || 0;
                            /** @type {number} */
                            r = rules[index][4] === true ? 1 : u;
                            a = this._beziers[rules[index][0]];
                            b = this._beziers[rules[index][1]];
                            if (a) {
                                if (b) {
                                    a = a[prop];
                                    b = b[prop];
                                    x1 = a.a + (a.b - a.a) * k;
                                    x2 = a.b + (a.c - a.b) * k;
                                    x1 += (x2 - x1) * k;
                                    x2 += (a.c + (a.d - a.c) * k - x2) * k;
                                    y1 = b.a + (b.b - b.a) * k;
                                    y2 = b.b + (b.c - b.b) * k;
                                    y1 += (y2 - y1) * k;
                                    y2 += (b.c + (b.d - b.c) * k - y2) * k;
                                    value = charIndexBuggy ? Math.atan2(y2 - y1, x2 - x1) * r + unit : this._initialRotations[index];
                                    if ($cookies[key]) {
                                        target[key](value);
                                    } else {
                                        target[key] = value;
                                    }
                                }
                            }
                        }
                    }
                }
            });
            var p = self.prototype;
            /** @type {function (Array, number, boolean, boolean, string, Object): ?} */
            self.bezierThrough = update;
            /** @type {function (number, number, number, number): ?} */
            self.cubicToQuadratic = get;
            /** @type {boolean} */
            self._autoCSS = true;
            /**
             * @param {(Object|number)} argument
             * @param {number} diff
             * @param {number} firstNum
             * @return {?}
             */
            self.quadraticToCubic = function (argument, diff, firstNum) {
                return new Node(argument, (2 * diff + argument) / 3, (2 * diff + firstNum) / 3, firstNum);
            };
            /**
             * @return {undefined}
             */
            self._cssRegister = function () {
                var e = collection.CSSPlugin;
                if (e) {
                    var options = e._internals;
                    var callback = options._parseToProxy;
                    var port = options._setPluginRatio;
                    var RegExp = options.CSSPropTween;
                    options._registerComplexSpecialProp("bezier", {
                        /**
                         * @param {Object} body
                         * @param {Object} data
                         * @param {string} name
                         * @param {number} object
                         * @param {Object} s
                         * @param {number} recurring
                         * @return {?}
                         */
                        parser: function (body, data, name, object, s, recurring) {
                            if (data instanceof Array) {
                                data = {
                                    values: data
                                };
                            }
                            recurring = new self;
                            var i;
                            var prop;
                            var obj;
                            /** @type {Array} */
                            var values = data.values;
                            /** @type {number} */
                            var min = values.length - 1;
                            /** @type {Array} */
                            var e = [];
                            var a = {};
                            if (0 > min) {
                                return s;
                            }
                            /** @type {number} */
                            i = 0;
                            for (; min >= i; i++) {
                                obj = callback(body, values[i], object, s, recurring, min !== i);
                                e[i] = obj.end;
                            }
                            for (prop in data) {
                                a[prop] = data[prop];
                            }
                            return a.values = e, s = new RegExp(body, "bezier", 0, 0, obj.pt, 2), s.data = obj, s.plugin = recurring, s.setRatio = port, 0 === a.autoRotate && (a.autoRotate = true), !a.autoRotate || (a.autoRotate instanceof Array || (i = a.autoRotate === true ? 0 : Number(a.autoRotate), a.autoRotate = null != obj.end.left ? [
                                ["left", "top", "rotation", i, false]
                            ] : null != obj.end.x ? [
                                ["x", "y", "rotation", i, false]
                            ] : false)), a.autoRotate && (object._transform || object._enableTransforms(false),
                                obj.autoRotate = object._target._gsTransform), recurring._onInitTween(obj.proxy, a, object._tween), s;
                        }
                    });
                }
            };
            /**
             * @param {?} value
             * @param {boolean} dataAndEvents
             * @return {undefined}
             */
            p._roundProps = function (value, dataAndEvents) {
                var tokenized = this._overwriteProps;
                var index = tokenized.length;
                for (; --index > -1;) {
                    if (value[tokenized[index]] || (value.bezier || value.bezierThrough)) {
                        /** @type {boolean} */
                        this._round[tokenized[index]] = dataAndEvents;
                    }
                }
            };
            /**
             * @param {Object} vars
             * @return {?}
             */
            p._kill = function (vars) {
                var search;
                var i;
                var arr = this._props;
                for (search in this._beziers) {
                    if (search in vars) {
                        delete this._beziers[search];
                        delete this._func[search];
                        i = arr.length;
                        for (; --i > -1;) {
                            if (arr[i] === search) {
                                arr.splice(i, 1);
                            }
                        }
                    }
                }
                return this._super._kill.call(this, vars);
            };
        })();
        _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (Sprite, TweenLite) {
            var c;
            var classCache;
            var arg;
            var eventPath;
            /**
             * @return {undefined}
             */
            var self = function () {
                Sprite.call(this, "css");
                /** @type {number} */
                this._overwriteProps.length = 0;
                this.setRatio = self.prototype.setRatio;
            };
            var globals = _gsScope._gsDefine.globals;
            var old = {};
            var p = self.prototype = new Sprite("css");
            /** @type {function (): undefined} */
            p.constructor = self;
            /** @type {string} */
            self.version = "1.18.4";
            /** @type {number} */
            self.API = 2;
            /** @type {number} */
            self.defaultTransformPerspective = 0;
            /** @type {string} */
            self.defaultSkewType = "compensated";
            /** @type {boolean} */
            self.defaultSmoothOrigin = true;
            /** @type {string} */
            p = "px";
            self.suffixMap = {
                top: p,
                right: p,
                bottom: p,
                left: p,
                width: p,
                height: p,
                fontSize: p,
                padding: p,
                margin: p,
                perspective: p,
                lineHeight: ""
            };
            var until;
            var l;
            var error;
            var result;
            var stub;
            var start;
            /** @type {RegExp} */
            var core_rnotwhite = /(?:\-|\.|\b)(\d|\.|e\-)+/g;
            /** @type {RegExp} */
            var rclass = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g;
            /** @type {RegExp} */
            var urlRegEx = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi;
            /** @type {RegExp} */
            var r20 = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g;
            /** @type {RegExp} */
            var cx = /(?:\d|\-|\+|=|#|\.)*/g;
            /** @type {RegExp} */
            var rCurrLoc = /opacity *= *([^)]*)/i;
            /** @type {RegExp} */
            var rchecked = /opacity:([^;]*)/i;
            /** @type {RegExp} */
            var rSlash = /alpha\(opacity *=.+?\)/i;
            /** @type {RegExp} */
            var rbrace = /^(rgb|hsl)/;
            /** @type {RegExp} */
            var rmultiDash = /([A-Z])/g;
            /** @type {RegExp} */
            var rreturn = /-([a-z])/gi;
            /** @type {RegExp} */
            var emptyParagraphRegexp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi;
            /**
             * @param {?} utf8
             * @param {string} s
             * @return {?}
             */
            var rstr = function (utf8, s) {
                return s.toUpperCase();
            };
            /** @type {RegExp} */
            var exclude = /(?:Left|Right|Width)/i;
            /** @type {RegExp} */
            var rxhtmlTag = /(M11|M12|M21|M22)=[\d\-\.e]+/gi;
            /** @type {RegExp} */
            var rfilters = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i;
            /** @type {RegExp} */
            var re = /,(?=[^\)]*(?:\(|$))/gi;
            /** @type {RegExp} */
            var rsingleTag = /[\s,\(]/i;
            /** @type {number} */
            var rad = Math.PI / 180;
            /** @type {number} */
            var step = 180 / Math.PI;
            var pos = {};
            /** @type {HTMLDocument} */
            var doc = document;
            /**
             * @param {string} tag
             * @return {?}
             */
            var $ = function (tag) {
                return doc.createElementNS ? doc.createElementNS("http://www.w3.org/1999/xhtml", tag) : doc.createElement(tag);
            };
            var container = $("div");
            var img = $("img");
            var body = self._internals = {
                _specialProps: old
            };
            /** @type {string} */
            var userAgent = navigator.userAgent;
            var events = function () {
                /** @type {number} */
                var index = userAgent.indexOf("Android");
                var el = $("a");
                return error = -1 !== userAgent.indexOf("Safari") && (-1 === userAgent.indexOf("Chrome") && (-1 === index || Number(userAgent.substr(index + 8, 1)) > 3)), stub = error && Number(userAgent.substr(userAgent.indexOf("Version/") + 8, 1)) < 6, result = -1 !== userAgent.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(userAgent) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(userAgent)) && (start = parseFloat(RegExp.$1)), el ? (el.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(el.style.opacity)) :
                    false;
            }();
            /**
             * @param {number} e
             * @return {?}
             */
            var css = function (e) {
                return rCurrLoc.test("string" == typeof e ? e : (e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1;
            };
            /**
             * @param {string} fmt
             * @return {undefined}
             */
            var debug = function (fmt) {
                if (window.console) {
                    console.log(fmt);
                }
            };
            /** @type {string} */
            var prefix = "";
            /** @type {string} */
            var s = "";
            /**
             * @param {string} prop
             * @param {Element} layer
             * @return {?}
             */
            var getVendorPropertyName = function (prop, layer) {
                layer = layer || container;
                var a;
                var i;
                var styles = layer.style;
                if (void 0 !== styles[prop]) {
                    return prop;
                }
                prop = prop.charAt(0).toUpperCase() + prop.substr(1);
                /** @type {Array} */
                a = ["O", "Moz", "ms", "Ms", "Webkit"];
                /** @type {number} */
                i = 5;
                for (; --i > -1 && void 0 === styles[a[i] + prop];) {}
                return i >= 0 ? (s = 3 === i ? "ms" : a[i], prefix = "-" + s.toLowerCase() + "-", s + prop) : null;
            };
            var test = doc.defaultView ? doc.defaultView.getComputedStyle : function () {};
            /** @type {function (Object, string, Object, boolean, string): ?} */
            var getStyle = self.getStyle = function (el, key, target, recurring, defaultValue) {
                var val;
                return events || "opacity" !== key ? (!recurring && el.style[key] ? val = el.style[key] : (target = target || test(el)) ? val = target[key] || (target.getPropertyValue(key) || target.getPropertyValue(key.replace(rmultiDash, "-$1").toLowerCase())) : el.currentStyle && (val = el.currentStyle[key]), null == defaultValue || val && ("none" !== val && ("auto" !== val && "auto auto" !== val)) ? val : defaultValue) : css(el);
            };
            /** @type {function (HTMLElement, string, number, string, boolean): ?} */
            var get = body.convertToPixels = function (el, prop, value, type, dataAndEvents) {
                if ("px" === type || !type) {
                    return value;
                }
                if ("auto" === type || !value) {
                    return 0;
                }
                var val;
                var s;
                var time;
                /** @type {boolean} */
                var isHorizontal = exclude.test(prop);
                /** @type {HTMLElement} */
                var d = el;
                var element = container.style;
                /** @type {boolean} */
                var inv = 0 > value;
                if (inv && (value = -value), "%" === type && -1 !== prop.indexOf("border")) {
                    /** @type {number} */
                    val = value / 100 * (isHorizontal ? el.clientWidth : el.clientHeight);
                } else {
                    if (element.cssText = "border:0 solid red;position:" + getStyle(el, "position") + ";line-height:0;", "%" !== type && (d.appendChild && ("v" !== type.charAt(0) && "rem" !== type))) {
                        element[isHorizontal ? "borderLeftWidth" : "borderTopWidth"] = value + type;
                    } else {
                        if (d = el.parentNode || doc.body, s = d._gsCache, time = TweenLite.ticker.frame, s && (isHorizontal && s.time === time)) {
                            return s.width * value / 100;
                        }
                        element[isHorizontal ? "width" : "height"] = value + type;
                    }
                    d.appendChild(container);
                    /** @type {number} */
                    val = parseFloat(container[isHorizontal ? "offsetWidth" : "offsetHeight"]);
                    d.removeChild(container);
                    if (isHorizontal) {
                        if ("%" === type) {
                            if (self.cacheWidths !== false) {
                                s = d._gsCache = d._gsCache || {};
                                s.time = time;
                                /** @type {number} */
                                s.width = val / value * 100;
                            }
                        }
                    }
                    if (!(0 !== val)) {
                        if (!dataAndEvents) {
                            val = get(el, prop, value, type, true);
                        }
                    }
                }
                return inv ? -val : val;
            };
            /** @type {function (Object, string, Object): ?} */
            var callback = body.calculateOffset = function (el, prop, value) {
                if ("absolute" !== getStyle(el, "position", value)) {
                    return 0;
                }
                /** @type {string} */
                var e = "left" === prop ? "Left" : "Top";
                var val = getStyle(el, "margin" + e, value);
                return el["offset" + e] - (get(el, prop, parseFloat(val), val.replace(cx, "")) || 0);
            };
            /**
             * @param {Object} node
             * @param {Object} options
             * @return {?}
             */
            var render = function (node, options) {
                var i;
                var o;
                var val;
                var obj = {};
                if (options = options || test(node, null)) {
                    if (i = options.length) {
                        for (; --i > -1;) {
                            val = options[i];
                            if (-1 === val.indexOf("-transform") || key === val) {
                                obj[val.replace(rreturn, rstr)] = options.getPropertyValue(val);
                            }
                        }
                    } else {
                        for (i in options) {
                            if (-1 === i.indexOf("Transform") || prop === i) {
                                obj[i] = options[i];
                            }
                        }
                    }
                } else {
                    if (options = node.currentStyle || node.style) {
                        for (i in options) {
                            if ("string" == typeof i) {
                                if (void 0 === obj[i]) {
                                    obj[i.replace(rreturn, rstr)] = options[i];
                                }
                            }
                        }
                    }
                }
                return events || (obj.opacity = css(node)), o = merge(node, options, false), obj.rotation = o.rotation, obj.skewX = o.skewX, obj.scaleX = o.scaleX, obj.scaleY = o.scaleY, obj.x = o.x, obj.y = o.y, showMessage && (obj.z = o.z, obj.rotationX = o.rotationX, obj.rotationY = o.rotationY, obj.scaleZ = o.scaleZ), obj.filters && delete obj.filters, obj;
            };
            /**
             * @param {Object} n
             * @param {Object} str
             * @param {Object} map
             * @param {Object} options
             * @param {Object} obj
             * @return {?}
             */
            var f = function (n, str, map, options, obj) {
                var val;
                var key;
                var record;
                var internalValues = {};
                var data = n.style;
                for (key in map) {
                    if ("cssText" !== key) {
                        if ("length" !== key) {
                            if (isNaN(key)) {
                                if (str[key] !== (val = map[key]) || obj && obj[key]) {
                                    if (-1 === key.indexOf("Origin")) {
                                        if ("number" == typeof val || "string" == typeof val) {
                                            internalValues[key] = "auto" !== val || "left" !== key && "top" !== key ? "" !== val && ("auto" !== val && "none" !== val) || ("string" != typeof str[key] || "" === str[key].replace(r20, "")) ? val : 0 : callback(n, key);
                                            if (void 0 !== data[key]) {
                                                record = new Model(data, key, data[key], record);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (options) {
                    for (key in options) {
                        if ("className" !== key) {
                            internalValues[key] = options[key];
                        }
                    }
                }
                return {
                    difs: internalValues,
                    firstMPT: record
                };
            };
            var params = {
                width: ["Left", "Right"],
                height: ["Top", "Bottom"]
            };
            /** @type {Array} */
            var tmp_keys = ["marginLeft", "marginRight", "marginTop", "marginBottom"];
            /**
             * @param {Object} el
             * @param {string} k
             * @param {?} target
             * @return {?}
             */
            var check = function (el, k, target) {
                if ("svg" === (el.nodeName + "").toLowerCase()) {
                    return (target || test(el))[k] || 0;
                }
                if (el.getBBox && success(el)) {
                    return el.getBBox()[k] || 0;
                }
                /** @type {number} */
                var match = parseFloat("width" === k ? el.offsetWidth : el.offsetHeight);
                var sides = params[k];
                var i = sides.length;
                target = target || test(el, null);
                for (; --i > -1;) {
                    match -= parseFloat(getStyle(el, "padding" + sides[i], target, true)) || 0;
                    match -= parseFloat(getStyle(el, "border" + sides[i] + "Width", target, true)) || 0;
                }
                return match;
            };
            /**
             * @param {string} v
             * @param {string} options
             * @return {?}
             */
            var parse = function (v, options) {
                if ("contain" === v || ("auto" === v || "auto auto" === v)) {
                    return v + " ";
                }
                if (null == v || "" === v) {
                    /** @type {string} */
                    v = "0 0";
                }
                var i;
                var codeSegments = v.split(" ");
                var value = -1 !== v.indexOf("left") ? "0%" : -1 !== v.indexOf("right") ? "100%" : codeSegments[0];
                var name = -1 !== v.indexOf("top") ? "0%" : -1 !== v.indexOf("bottom") ? "100%" : codeSegments[1];
                if (codeSegments.length > 3 && !options) {
                    codeSegments = v.split(", ").join(",").split(",");
                    /** @type {Array} */
                    v = [];
                    /** @type {number} */
                    i = 0;
                    for (; i < codeSegments.length; i++) {
                        v.push(parse(codeSegments[i]));
                    }
                    return v.join(",");
                }
                return null == name ? name = "center" === value ? "50%" : "0" : "center" === name && (name = "50%"), ("center" === value || isNaN(parseFloat(value)) && -1 === (value + "").indexOf("=")) && (value = "50%"), v = value + " " + name + (codeSegments.length > 2 ? " " + codeSegments[2] : ""), options && (options.oxp = -1 !== value.indexOf("%"), options.oyp = -1 !== name.indexOf("%"), options.oxr = "=" === value.charAt(1), options.oyr = "=" === name.charAt(1), options.ox = parseFloat(value.replace(r20,
                    "")), options.oy = parseFloat(name.replace(r20, "")), options.v = v), options || v;
            };
            /**
             * @param {string} a
             * @param {?} b
             * @return {?}
             */
            var select = function (a, b) {
                return "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b) || 0;
            };
            /**
             * @param {string} str
             * @param {number} xdate
             * @return {?}
             */
            var valid = function (str, xdate) {
                return null == str ? xdate : "string" == typeof str && "=" === str.charAt(1) ? parseInt(str.charAt(0) + "1", 10) * parseFloat(str.substr(2)) + xdate : parseFloat(str) || 0;
            };
            /**
             * @param {number} v
             * @param {number} _
             * @param {string} x
             * @param {Object} object
             * @return {?}
             */
            var interpolate = function (v, _, x, object) {
                var b;
                var parts;
                var a;
                var s;
                var capture;
                /** @type {number} */
                var ms = 1E-6;
                return null == v ? s = _ : "number" == typeof v ? s = v : (b = 360, parts = v.split("_"), capture = "=" === v.charAt(1), a = (capture ? parseInt(v.charAt(0) + "1", 10) * parseFloat(parts[0].substr(2)) : parseFloat(parts[0])) * (-1 === v.indexOf("rad") ? 1 : step) - (capture ? 0 : _), parts.length && (object && (object[x] = _ + a), -1 !== v.indexOf("short") && (a %= b, a !== a % (b / 2) && (a = 0 > a ? a + b : a - b)), -1 !== v.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * b) % b - (a / b |
                    0) * b : -1 !== v.indexOf("ccw") && (a > 0 && (a = (a - 9999999999 * b) % b - (a / b | 0) * b))), s = _ + a), ms > s && (s > -ms && (s = 0)), s;
            };
            var _colorLookup = {
                aqua: [0, 255, 255],
                lime: [0, 255, 0],
                silver: [192, 192, 192],
                black: [0, 0, 0],
                maroon: [128, 0, 0],
                teal: [0, 128, 128],
                blue: [0, 0, 255],
                navy: [0, 0, 128],
                white: [255, 255, 255],
                fuchsia: [255, 0, 255],
                olive: [128, 128, 0],
                yellow: [255, 255, 0],
                orange: [255, 165, 0],
                gray: [128, 128, 128],
                purple: [128, 0, 128],
                green: [0, 128, 0],
                red: [255, 0, 0],
                pink: [255, 192, 203],
                cyan: [0, 255, 255],
                transparent: [255, 255, 255, 0]
            };
            /**
             * @param {number} h
             * @param {number} m1
             * @param {number} m2
             * @return {?}
             */
            var hue = function (h, m1, m2) {
                return h = 0 > h ? h + 1 : h > 1 ? h - 1 : h, 255 * (1 > 6 * h ? m1 + (m2 - m1) * h * 6 : 0.5 > h ? m2 : 2 > 3 * h ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) + 0.5 | 0;
            };
            /** @type {function (string, boolean): ?} */
            var trim = self.parseColor = function (value, keepData) {
                var data;
                var r;
                var g;
                var b;
                var h;
                var s;
                var l;
                var max;
                var min;
                var d;
                var selector;
                if (value) {
                    if ("number" == typeof value) {
                        /** @type {Array} */
                        data = [value >> 16, value >> 8 & 255, 255 & value];
                    } else {
                        if ("," === value.charAt(value.length - 1) && (value = value.substr(0, value.length - 1)), _colorLookup[value]) {
                            data = _colorLookup[value];
                        } else {
                            if ("#" === value.charAt(0)) {
                                if (4 === value.length) {
                                    r = value.charAt(1);
                                    g = value.charAt(2);
                                    b = value.charAt(3);
                                    /** @type {string} */
                                    value = "#" + r + r + g + g + b + b;
                                }
                                /** @type {number} */
                                value = parseInt(value.substr(1), 16);
                                /** @type {Array} */
                                data = [value >> 16, value >> 8 & 255, 255 & value];
                            } else {
                                if ("hsl" === value.substr(0, 3)) {
                                    if (data = selector = value.match(core_rnotwhite), keepData) {
                                        if (-1 !== value.indexOf("=")) {
                                            return value.match(rclass);
                                        }
                                    } else {
                                        /** @type {number} */
                                        h = Number(data[0]) % 360 / 360;
                                        /** @type {number} */
                                        s = Number(data[1]) / 100;
                                        /** @type {number} */
                                        l = Number(data[2]) / 100;
                                        /** @type {number} */
                                        g = 0.5 >= l ? l * (s + 1) : l + s - l * s;
                                        /** @type {number} */
                                        r = 2 * l - g;
                                        if (data.length > 3) {
                                            /** @type {number} */
                                            data[3] = Number(value[3]);
                                        }
                                        data[0] = hue(h + 1 / 3, r, g);
                                        data[1] = hue(h, r, g);
                                        data[2] = hue(h - 1 / 3, r, g);
                                    }
                                } else {
                                    data = value.match(core_rnotwhite) || _colorLookup.transparent;
                                }
                            }
                        }
                        /** @type {number} */
                        data[0] = Number(data[0]);
                        /** @type {number} */
                        data[1] = Number(data[1]);
                        /** @type {number} */
                        data[2] = Number(data[2]);
                        if (data.length > 3) {
                            /** @type {number} */
                            data[3] = Number(data[3]);
                        }
                    }
                } else {
                    /** @type {Array} */
                    data = _colorLookup.black;
                }
                return keepData && (!selector && (r = data[0] / 255, g = data[1] / 255, b = data[2] / 255, max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, max === min ? h = s = 0 : (d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min), h = max === r ? (g - b) / d + (b > g ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4, h *= 60), data[0] = h + 0.5 | 0, data[1] = 100 * s + 0.5 | 0, data[2] = 100 * l + 0.5 | 0)), data;
            };
            /**
             * @param {string} html
             * @param {Object} keepData
             * @return {?}
             */
            var remove = function (html, keepData) {
                var i;
                var header;
                var chunk;
                var codeSegments = html.match(regex) || [];
                /** @type {number} */
                var index = 0;
                var val = codeSegments.length ? "" : html;
                /** @type {number} */
                i = 0;
                for (; i < codeSegments.length; i++) {
                    header = codeSegments[i];
                    chunk = html.substr(index, html.indexOf(header, index) - index);
                    index += chunk.length + header.length;
                    header = trim(header, keepData);
                    if (3 === header.length) {
                        header.push(1);
                    }
                    val += chunk + (keepData ? "hsla(" + header[0] + "," + header[1] + "%," + header[2] + "%," + header[3] : "rgba(" + header.join(",")) + ")";
                }
                return val + html.substr(index);
            };
            /** @type {string} */
            var regex = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
            for (p in _colorLookup) {
                regex += "|" + p + "\\b";
            }
            /** @type {RegExp} */
            regex = new RegExp(regex + ")", "gi");
            /**
             * @param {Array} settings
             * @return {undefined}
             */
            self.colorStringFilter = function (settings) {
                var type;
                var cssText = settings[0] + settings[1];
                if (regex.test(cssText)) {
                    /** @type {boolean} */
                    type = -1 !== cssText.indexOf("hsl(") || -1 !== cssText.indexOf("hsla(");
                    settings[0] = remove(settings[0], type);
                    settings[1] = remove(settings[1], type);
                }
                /** @type {number} */
                regex.lastIndex = 0;
            };
            if (!TweenLite.defaultStringFilter) {
                /** @type {function (Array): undefined} */
                TweenLite.defaultStringFilter = self.colorStringFilter;
            }
            /**
             * @param {string} template
             * @param {boolean} callback
             * @param {boolean} match
             * @param {Function} param
             * @return {?}
             */
            var compile = function (template, callback, match, param) {
                if (null == template) {
                    return function ($template) {
                        return $template;
                    };
                }
                var fn;
                var body = callback ? (template.match(regex) || [""])[0] : "";
                var list = template.split(body).join("").match(urlRegEx) || [];
                var _ = template.substr(0, template.indexOf(list[0]));
                /** @type {string} */
                var b = ")" === template.charAt(template.length - 1) ? ")" : "";
                /** @type {string} */
                var end = -1 !== template.indexOf(" ") ? " " : ",";
                var len = list.length;
                var qs = len > 0 ? list[0].replace(core_rnotwhite, "") : "";
                return len ? fn = callback ? function (url) {
                    var a;
                    var result;
                    var i;
                    var array;
                    if ("number" == typeof url) {
                        url += qs;
                    } else {
                        if (param && re.test(url)) {
                            array = url.replace(re, "|").split("|");
                            /** @type {number} */
                            i = 0;
                            for (; i < array.length; i++) {
                                array[i] = fn(array[i]);
                            }
                            return array.join(",");
                        }
                    }
                    if (a = (url.match(regex) || [body])[0], result = url.split(a).join("").match(urlRegEx) || [], i = result.length, len > i--) {
                        for (; ++i < len;) {
                            result[i] = match ? result[(i - 1) / 2 | 0] : list[i];
                        }
                    }
                    return _ + result.join(end) + end + a + b + (-1 !== url.indexOf("inset") ? " inset" : "");
                } : function (url) {
                    var result;
                    var array;
                    var i;
                    if ("number" == typeof url) {
                        url += qs;
                    } else {
                        if (param && re.test(url)) {
                            array = url.replace(re, "|").split("|");
                            /** @type {number} */
                            i = 0;
                            for (; i < array.length; i++) {
                                array[i] = fn(array[i]);
                            }
                            return array.join(",");
                        }
                    }
                    if (result = url.match(urlRegEx) || [], i = result.length, len > i--) {
                        for (; ++i < len;) {
                            result[i] = match ? result[(i - 1) / 2 | 0] : list[i];
                        }
                    }
                    return _ + result.join(end) + b;
                } : function ($template) {
                    return $template;
                };
            };
            /**
             * @param {string} path
             * @return {?}
             */
            var stream = function (path) {
                return path = path.split(","),
                    function (val, aKeyPath, dataAndEvents, me, header, which, jsonString) {
                        var i;
                        /** @type {Array.<string>} */
                        var css = (aKeyPath + "").split(" ");
                        jsonString = {};
                        /** @type {number} */
                        i = 0;
                        for (; 4 > i; i++) {
                            /** @type {string} */
                            jsonString[path[i]] = css[i] = css[i] || css[(i - 1) / 2 >> 0];
                        }
                        return me.parse(val, jsonString, header, which);
                    };
            };
            /** @type {function (Object, string, string, ?, number): undefined} */
            var Model = (body._setPluginRatio = function (event) {
                this.plugin.setRatio(event);
                var val;
                var t;
                var _notify;
                var d;
                var a;
                var c = this.data;
                var o = c.proxy;
                var p = c.firstMPT;
                /** @type {number} */
                var min = 1E-6;
                for (; p;) {
                    val = o[p.v];
                    if (p.r) {
                        /** @type {number} */
                        val = Math.round(val);
                    } else {
                        if (min > val) {
                            if (val > -min) {
                                /** @type {number} */
                                val = 0;
                            }
                        }
                    }
                    p.t[p.p] = val;
                    p = p._next;
                }
                if (c.autoRotate && (c.autoRotate.rotation = o.rotation), 1 === event || 0 === event) {
                    p = c.firstMPT;
                    /** @type {string} */
                    a = 1 === event ? "e" : "b";
                    for (; p;) {
                        if (t = p.t, t.type) {
                            if (1 === t.type) {
                                d = t.xs0 + t.s + t.xs1;
                                /** @type {number} */
                                _notify = 1;
                                for (; _notify < t.l; _notify++) {
                                    d += t["xn" + _notify] + t["xs" + (_notify + 1)];
                                }
                                t[a] = d;
                            }
                        } else {
                            t[a] = t.s + t.xs0;
                        }
                        p = p._next;
                    }
                }
            }, function (t, p, val, next, renderFunc) {
                /** @type {Object} */
                this.t = t;
                /** @type {string} */
                this.p = p;
                /** @type {string} */
                this.v = val;
                /** @type {number} */
                this.r = renderFunc;
                if (next) {
                    next._prev = this;
                    this._next = next;
                }
            });
            /** @type {function (Object, string, number, number, ?, number, (Document|string), number, number, number, number): undefined} */
            var Parser = (body._parseToProxy = function (val, jsonString, self, data, which, dataAndEvents) {
                var offset;
                var id;
                var i;
                var obj;
                var selector;
                /** @type {number} */
                var current = data;
                var cache = {};
                var hash = {};
                var len = self._transform;
                var savedPos4 = pos;
                /** @type {null} */
                self._transform = null;
                /** @type {string} */
                pos = jsonString;
                data = selector = self.parse(val, jsonString, data, which);
                pos = savedPos4;
                if (dataAndEvents) {
                    self._transform = len;
                    if (current) {
                        /** @type {null} */
                        current._prev = null;
                        if (current._prev) {
                            /** @type {null} */
                            current._prev._next = null;
                        }
                    }
                }
                for (; data && data !== current;) {
                    if (data.type <= 1 && (id = data.p, hash[id] = data.s + data.c, cache[id] = data.s, dataAndEvents || (obj = new Model(data, "s", id, obj, data.r), data.c = 0), 1 === data.type)) {
                        offset = data.l;
                        for (; --offset > 0;) {
                            /** @type {string} */
                            i = "xn" + offset;
                            /** @type {string} */
                            id = data.p + "_" + i;
                            hash[id] = data.data[i];
                            cache[id] = data[i];
                            if (!dataAndEvents) {
                                obj = new Model(data, i, id, obj, data.rxp[i]);
                            }
                        }
                    }
                    data = data._next;
                }
                return {
                    proxy: cache,
                    end: hash,
                    firstMPT: obj,
                    pt: selector
                };
            }, body.CSSPropTween = function (t, n, b, compiler, next, type, dataAndEvents, renderFunc, deepDataAndEvents, a, e) {
                /** @type {Object} */
                this.t = t;
                /** @type {string} */
                this.p = n;
                /** @type {number} */
                this.s = b;
                /** @type {number} */
                this.c = compiler;
                this.n = dataAndEvents || n;
                if (!(t instanceof Parser)) {
                    eventPath.push(this.n);
                }
                /** @type {number} */
                this.r = renderFunc;
                this.type = type || 0;
                if (deepDataAndEvents) {
                    /** @type {number} */
                    this.pr = deepDataAndEvents;
                    /** @type {boolean} */
                    c = true;
                }
                this.b = void 0 === a ? b : a;
                this.e = void 0 === e ? b + compiler : e;
                if (next) {
                    this._next = next;
                    next._prev = this;
                }
            });
            /**
             * @param {string} obj
             * @param {string} offset
             * @param {number} b
             * @param {number} a
             * @param {string} protoProps
             * @param {string} value
             * @return {?}
             */
            var extend = function (obj, offset, b, a, protoProps, value) {
                var data = new Parser(obj, offset, b, a - b, protoProps, -1, value);
                return data.b = b, data.e = data.xs0 = a, data;
            };
            /** @type {function (Object, string, string, string, Object, (number|string), Object, number, number, Function): ?} */
            var normalize = self.parseComplex = function (link, options, input, s, recurring, c, node, mayParseLabeledStatementInstead, k, deepDataAndEvents) {
                input = input || (c || "");
                node = new Parser(link, options, 0, 0, node, deepDataAndEvents ? 2 : 1, null, false, mayParseLabeledStatementInstead, input, s);
                s += "";
                if (recurring) {
                    if (regex.test(s + input)) {
                        /** @type {Array} */
                        s = [input, s];
                        self.colorStringFilter(s);
                        input = s[0];
                        s = s[1];
                    }
                }
                var key;
                var i;
                var index;
                var value;
                var selector;
                var codeSegments;
                var resultItems;
                var newValue;
                var require;
                var idx;
                var r;
                var path;
                var type;
                var object = input.split(", ").join(",").split(" ");
                var parts = s.split(", ").join(",").split(" ");
                var length = object.length;
                /** @type {boolean} */
                var truncate = until !== false;
                if (-1 !== s.indexOf(",") || -1 !== input.indexOf(",")) {
                    object = object.join(" ").replace(re, ", ").split(" ");
                    parts = parts.join(" ").replace(re, ", ").split(" ");
                    length = object.length;
                }
                if (length !== parts.length) {
                    object = (c || "").split(" ");
                    length = object.length;
                }
                /** @type {number} */
                node.plugin = k;
                /** @type {Function} */
                node.setRatio = deepDataAndEvents;
                /** @type {number} */
                regex.lastIndex = 0;
                /** @type {number} */
                key = 0;
                for (; length > key; key++) {
                    if (value = object[key], selector = parts[key], newValue = parseFloat(value), newValue || 0 === newValue) {
                        node.appendXtra("", newValue, select(selector, newValue), selector.replace(rclass, ""), truncate && -1 !== selector.indexOf("px"), true);
                    } else {
                        if (recurring && regex.test(value)) {
                            path = selector.indexOf(")") + 1;
                            path = ")" + (path ? selector.substr(path) : "");
                            type = -1 !== selector.indexOf("hsl") && events;
                            value = trim(value, type);
                            selector = trim(selector, type);
                            /** @type {boolean} */
                            require = value.length + selector.length > 6;
                            if (require && (!events && 0 === selector[3])) {
                                node["xs" + node.l] += node.l ? " transparent" : "transparent";
                                node.e = node.e.split(parts[key]).join("transparent");
                            } else {
                                if (!events) {
                                    /** @type {boolean} */
                                    require = false;
                                }
                                if (type) {
                                    node.appendXtra(require ? "hsla(" : "hsl(", value[0], select(selector[0], value[0]), ",", false, true).appendXtra("", value[1], select(selector[1], value[1]), "%,", false).appendXtra("", value[2], select(selector[2], value[2]), require ? "%," : "%" + path, false);
                                } else {
                                    node.appendXtra(require ? "rgba(" : "rgb(", value[0], selector[0] - value[0], ",", true, true).appendXtra("", value[1], selector[1] - value[1], ",", true).appendXtra("", value[2], selector[2] - value[2], require ? "," : path, true);
                                }
                                if (require) {
                                    value = value.length < 4 ? 1 : value[3];
                                    node.appendXtra("", value, (selector.length < 4 ? 1 : selector[3]) - value, path, false);
                                }
                            }
                            /** @type {number} */
                            regex.lastIndex = 0;
                        } else {
                            if (codeSegments = value.match(core_rnotwhite)) {
                                if (resultItems = selector.match(rclass), !resultItems || resultItems.length !== codeSegments.length) {
                                    return node;
                                }
                                /** @type {number} */
                                index = 0;
                                /** @type {number} */
                                i = 0;
                                for (; i < codeSegments.length; i++) {
                                    r = codeSegments[i];
                                    idx = value.indexOf(r, index);
                                    node.appendXtra(value.substr(index, idx - index), Number(r), select(resultItems[i], r), "", truncate && "px" === value.substr(idx + r.length, 2), 0 === i);
                                    index = idx + r.length;
                                }
                                node["xs" + node.l] += value.substr(index);
                            } else {
                                node["xs" + node.l] += node.l || node["xs" + node.l] ? " " + selector : selector;
                            }
                        }
                    }
                }
                if (-1 !== s.indexOf("=") && node.data) {
                    path = node.xs0 + node.data.s;
                    /** @type {number} */
                    key = 1;
                    for (; key < node.l; key++) {
                        path += node["xs" + key] + node.data["xn" + key];
                    }
                    node.e = path + node["xs" + key];
                }
                return node.l || (node.type = -1, node.xs0 = node.e), node.xfirst || node;
            };
            /** @type {number} */
            var i = 9;
            p = Parser.prototype;
            /** @type {number} */
            p.l = p.pr = 0;
            for (; --i > 0;) {
                /** @type {number} */
                p["xn" + i] = 0;
                /** @type {string} */
                p["xs" + i] = "";
            }
            /** @type {string} */
            p.xs0 = "";
            /** @type {null} */
            p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;
            /**
             * @param {string} reason
             * @param {number} value
             * @param {number} c
             * @param {string} prefix
             * @param {boolean} recurring
             * @param {number} dataAndEvents
             * @return {?}
             */
            p.appendXtra = function (reason, value, c, prefix, recurring, dataAndEvents) {
                var data = this;
                var pos = data.l;
                return data["xs" + pos] += dataAndEvents && (pos || data["xs" + pos]) ? " " + reason : reason || "", c || (0 === pos || data.plugin) ? (data.l++, data.type = data.setRatio ? 2 : 1, data["xs" + data.l] = prefix || "", pos > 0 ? (data.data["xn" + pos] = value + c, data.rxp["xn" + pos] = recurring, data["xn" + pos] = value, data.plugin || (data.xfirst = new Parser(data, "xn" + pos, value, c, data.xfirst || data, 0, data.n, recurring, data.pr), data.xfirst.xs0 = 0), data) : (data.data = {
                    s: value + c
                }, data.rxp = {}, data.s = value, data.c = c, data.r = recurring, data)) : (data["xs" + pos] += value + (prefix || ""), data);
            };
            /**
             * @param {string} name
             * @param {Object} options
             * @return {undefined}
             */
            var create = function (name, options) {
                options = options || {};
                this.p = options.prefix ? getVendorPropertyName(name) || name : name;
                old[name] = old[this.p] = this;
                this.format = options.formatter || compile(options.defaultValue, options.color, options.collapsible, options.multi);
                if (options.parser) {
                    this.parse = options.parser;
                }
                this.clrs = options.color;
                this.multi = options.multi;
                this.keyword = options.keyword;
                this.dflt = options.defaultValue;
                this.pr = options.priority || 0;
            };
            /** @type {function (string, ?, Function): undefined} */
            var testAllProps = body._registerComplexSpecialProp = function (prop, opt_attributes, parser) {
                if ("object" != typeof opt_attributes) {
                    opt_attributes = {
                        /** @type {Function} */
                        parser: parser
                    };
                }
                var i;
                var e;
                var codeSegments = prop.split(",");
                var defaultValue = opt_attributes.defaultValue;
                parser = parser || [defaultValue];
                /** @type {number} */
                i = 0;
                for (; i < codeSegments.length; i++) {
                    opt_attributes.prefix = 0 === i && opt_attributes.prefix;
                    opt_attributes.defaultValue = parser[i] || defaultValue;
                    e = new create(codeSegments[i], opt_attributes);
                }
            };
            /**
             * @param {string} name
             * @return {undefined}
             */
            var func = function (name) {
                if (!old[name]) {
                    /** @type {string} */
                    var i = name.charAt(0).toUpperCase() + name.substr(1) + "Plugin";
                    testAllProps(name, {
                        /**
                         * @param {Object} val
                         * @param {string} jsonString
                         * @param {string} name
                         * @param {number} which
                         * @param {string} body
                         * @param {number} recurring
                         * @param {Object} str
                         * @return {?}
                         */
                        parser: function (val, jsonString, name, which, body, recurring, str) {
                            var seg = globals.com.greensock.plugins[i];
                            return seg ? (seg._cssRegister(), old[name].parse(val, jsonString, name, which, body, recurring, str)) : (debug("Error: " + i + " js file not loaded."), body);
                        }
                    });
                }
            };
            p = create.prototype;
            /**
             * @param {?} style
             * @param {string} data
             * @param {string} name
             * @param {string} s
             * @param {number} recurring
             * @param {Function} deepDataAndEvents
             * @return {?}
             */
            p.parseComplex = function (style, data, name, s, recurring, deepDataAndEvents) {
                var y;
                var options;
                var text;
                var x;
                var n;
                var elem;
                var i = this.keyword;
                if (this.multi && (re.test(name) || re.test(data) ? (options = data.replace(re, "|").split("|"), text = name.replace(re, "|").split("|")) : i && (options = [data], text = [name])), text) {
                    x = text.length > options.length ? text.length : options.length;
                    /** @type {number} */
                    y = 0;
                    for (; x > y; y++) {
                        data = options[y] = options[y] || this.dflt;
                        name = text[y] = text[y] || this.dflt;
                        if (i) {
                            n = data.indexOf(i);
                            elem = name.indexOf(i);
                            if (n !== elem) {
                                if (-1 === elem) {
                                    options[y] = options[y].split(i).join("");
                                } else {
                                    if (-1 === n) {
                                        options[y] += " " + i;
                                    }
                                }
                            }
                        }
                    }
                    data = options.join(", ");
                    name = text.join(", ");
                }
                return normalize(style, this.p, data, name, this.clrs, this.dflt, s, this.pr, recurring, deepDataAndEvents);
            };
            /**
             * @param {Object} parent
             * @param {string} s
             * @param {string} value
             * @param {number} callback
             * @param {string} selector
             * @param {number} recurring
             * @param {Object} str
             * @return {?}
             */
            p.parse = function (parent, s, value, callback, selector, recurring, str) {
                return this.parseComplex(parent.style, this.format(getStyle(parent, this.p, arg, false, this.dflt)), this.format(s), selector, recurring);
            };
            /**
             * @param {string} transition
             * @param {?} format
             * @param {number} priority
             * @return {undefined}
             */
            self.registerSpecialProp = function (transition, format, priority) {
                testAllProps(transition, {
                    /**
                     * @param {string} html
                     * @param {string} data
                     * @param {string} name
                     * @param {number} callback
                     * @param {string} s
                     * @param {number} recurring
                     * @param {Object} str
                     * @return {?}
                     */
                    parser: function (html, data, name, callback, s, recurring, str) {
                        var p = new Parser(html, name, 0, 0, s, 2, name, false, priority);
                        return p.plugin = recurring, p.setRatio = format(html, data, callback._tween, name), p;
                    },
                    priority: priority
                });
            };
            self.useSVGTransformAttr = error || result;
            var object;
            /** @type {Array.<string>} */
            var tokenized = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(",");
            var prop = getVendorPropertyName("transform");
            var key = prefix + "transform";
            var property = getVendorPropertyName("transformOrigin");
            /** @type {boolean} */
            var showMessage = null !== getVendorPropertyName("perspective");
            /** @type {function (): undefined} */
            var Properties = body.Transform = function () {
                /** @type {number} */
                this.perspective = parseFloat(self.defaultTransformPerspective) || 0;
                this.force3D = self.defaultForce3D !== false && showMessage ? self.defaultForce3D || "auto" : false;
            };
            var SVGElement = window.SVGElement;
            /**
             * @param {string} name
             * @param {Element} parent
             * @param {Object} attributes
             * @return {?}
             */
            var createElement = function (name, parent, attributes) {
                var key;
                /** @type {Element} */
                var elem = doc.createElementNS("http://www.w3.org/2000/svg", name);
                /** @type {RegExp} */
                var r20 = /([a-z])([A-Z])/g;
                for (key in attributes) {
                    elem.setAttributeNS(null, key.replace(r20, "$1-$2").toLowerCase(), attributes[key]);
                }
                return parent.appendChild(elem), elem;
            };
            /** @type {Element} */
            var root = doc.documentElement;
            var defaultObject = function () {
                var parent;
                var node;
                var width;
                var i = start || /Android/i.test(userAgent) && !window.chrome;
                return doc.createElementNS && (!i && (parent = createElement("svg", root), node = createElement("rect", parent, {
                    width: 100,
                    height: 50,
                    x: 100
                }), width = node.getBoundingClientRect().width, node.style[property] = "50% 50%", node.style[prop] = "scaleX(0.5)", i = width === node.getBoundingClientRect().width && !(result && showMessage), root.removeChild(parent))), i;
            }();
            /**
             * @param {Object} elem
             * @param {string} v
             * @param {boolean} data
             * @param {string} token
             * @param {boolean} execAsap
             * @param {boolean} dataAndEvents
             * @return {undefined}
             */
            var handler = function (elem, v, data, token, execAsap, dataAndEvents) {
                var coords;
                var x;
                var y;
                var width;
                var height;
                var a0;
                var a1;
                var m11;
                var m21;
                var b4;
                var b5;
                var imageW;
                var size;
                var offsetY;
                var options = elem._gsTransform;
                var a = fn(elem, true);
                if (options) {
                    size = options.xOrigin;
                    offsetY = options.yOrigin;
                }
                if (!token || (coords = token.split(" ")).length < 2) {
                    a1 = elem.getBBox();
                    v = parse(v).split(" ");
                    /** @type {Array} */
                    coords = [(-1 !== v[0].indexOf("%") ? parseFloat(v[0]) / 100 * a1.width : parseFloat(v[0])) + a1.x, (-1 !== v[1].indexOf("%") ? parseFloat(v[1]) / 100 * a1.height : parseFloat(v[1])) + a1.y];
                }
                /** @type {number} */
                data.xOrigin = width = parseFloat(coords[0]);
                /** @type {number} */
                data.yOrigin = height = parseFloat(coords[1]);
                if (token) {
                    if (a !== out) {
                        a0 = a[0];
                        a1 = a[1];
                        m11 = a[2];
                        m21 = a[3];
                        b4 = a[4];
                        b5 = a[5];
                        /** @type {number} */
                        imageW = a0 * m21 - a1 * m11;
                        /** @type {number} */
                        x = width * (m21 / imageW) + height * (-m11 / imageW) + (m11 * b5 - m21 * b4) / imageW;
                        /** @type {number} */
                        y = width * (-a1 / imageW) + height * (a0 / imageW) - (a0 * b5 - a1 * b4) / imageW;
                        /** @type {number} */
                        width = data.xOrigin = coords[0] = x;
                        /** @type {number} */
                        height = data.yOrigin = coords[1] = y;
                    }
                }
                if (options) {
                    if (dataAndEvents) {
                        data.xOffset = options.xOffset;
                        data.yOffset = options.yOffset;
                        /** @type {boolean} */
                        options = data;
                    }
                    if (execAsap || execAsap !== false && self.defaultSmoothOrigin !== false) {
                        /** @type {number} */
                        x = width - size;
                        /** @type {number} */
                        y = height - offsetY;
                        options.xOffset += x * a[0] + y * a[2] - x;
                        options.yOffset += x * a[1] + y * a[3] - y;
                    } else {
                        /** @type {number} */
                        options.xOffset = options.yOffset = 0;
                    }
                }
                if (!dataAndEvents) {
                    elem.setAttribute("data-svg-origin", coords.join(" "));
                }
            };
            /**
             * @param {Object} element
             * @return {?}
             */
            var setAttributes = function (element) {
                try {
                    return element.getBBox();
                } catch (a) {}
            };
            /**
             * @param {Object} elem
             * @return {?}
             */
            var success = function (elem) {
                return !!(SVGElement && (elem.getBBox && (elem.getCTM && (setAttributes(elem) && (!elem.parentNode || elem.parentNode.getBBox && elem.parentNode.getCTM)))));
            };
            /** @type {Array} */
            var out = [1, 0, 0, 1, 0, 0];
            /**
             * @param {Object} el
             * @param {boolean} dataAndEvents
             * @return {?}
             */
            var fn = function (el, dataAndEvents) {
                var deep;
                var value;
                var copy;
                var n1;
                var a1;
                var vars = el._gsTransform || new Properties;
                /** @type {number} */
                var b4 = 1E5;
                if (prop ? value = getStyle(el, key, null, true) : el.currentStyle && (value = el.currentStyle.filter.match(rxhtmlTag), value = value && 4 === value.length ? [value[0].substr(4), Number(value[2].substr(4)), Number(value[1].substr(4)), value[3].substr(4), vars.x || 0, vars.y || 0].join(",") : ""), deep = !value || ("none" === value || "matrix(1, 0, 0, 1, 0, 0)" === value), (vars.svg || el.getBBox && success(el)) && (deep && (-1 !== (el.style[prop] + "").indexOf("matrix") && (value = el.style[prop],
                        deep = 0)), copy = el.getAttribute("transform"), deep && (copy && (-1 !== copy.indexOf("matrix") ? (value = copy, deep = 0) : -1 !== copy.indexOf("translate") && (value = "matrix(1,0,0,1," + copy.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")", deep = 0)))), deep) {
                    return out;
                }
                copy = (value || "").match(core_rnotwhite) || [];
                i = copy.length;
                for (; --i > -1;) {
                    /** @type {number} */
                    n1 = Number(copy[i]);
                    /** @type {number} */
                    copy[i] = (a1 = n1 - (n1 |= 0)) ? (a1 * b4 + (0 > a1 ? -0.5 : 0.5) | 0) / b4 + n1 : n1;
                }
                return dataAndEvents && copy.length > 6 ? [copy[0], copy[1], copy[4], copy[5], copy[12], copy[13]] : copy;
            };
            /** @type {function (Object, Object, boolean, boolean): ?} */
            var merge = body.getTransform = function (el, value, recurring, item) {
                if (el._gsTransform && (recurring && !item)) {
                    return el._gsTransform;
                }
                var a;
                var index;
                var type;
                var userid;
                var angle;
                var offset;
                var data = recurring ? el._gsTransform || new Properties : new Properties;
                /** @type {boolean} */
                var o = data.scaleX < 0;
                /** @type {number} */
                var result = 2E-5;
                /** @type {number} */
                var rad = 1E5;
                var body = showMessage ? parseFloat(getStyle(el, property, value, false, "0 0 0").split(" ")[2]) || (data.zOrigin || 0) : 0;
                /** @type {number} */
                var key = parseFloat(self.defaultTransformPerspective) || 0;
                if (data.svg = !(!el.getBBox || !success(el)), data.svg && (handler(el, getStyle(el, property, arg, false, "50% 50%") + "", data, el.getAttribute("data-svg-origin")), object = self.useSVGTransformAttr || defaultObject), a = fn(el), a !== out) {
                    if (16 === a.length) {
                        var subdir;
                        var newX;
                        var txn;
                        var cos;
                        var sin;
                        var x0 = a[0];
                        var x1 = a[1];
                        var a01 = a[2];
                        var a20 = a[3];
                        var a00 = a[4];
                        var x = a[5];
                        var tx = a[6];
                        var a11 = a[7];
                        var a10 = a[8];
                        var y = a[9];
                        var ty = a[10];
                        var b = a[12];
                        var next = a[13];
                        var z = a[14];
                        var a21 = a[11];
                        /** @type {number} */
                        var tile = Math.atan2(tx, ty);
                        if (data.zOrigin) {
                            /** @type {number} */
                            z = -data.zOrigin;
                            /** @type {number} */
                            b = a10 * z - a[12];
                            /** @type {number} */
                            next = y * z - a[13];
                            /** @type {number} */
                            z = ty * z + data.zOrigin - a[14];
                        }
                        /** @type {number} */
                        data.rotationX = tile * step;
                        if (tile) {
                            /** @type {number} */
                            cos = Math.cos(-tile);
                            /** @type {number} */
                            sin = Math.sin(-tile);
                            /** @type {number} */
                            subdir = a00 * cos + a10 * sin;
                            /** @type {number} */
                            newX = x * cos + y * sin;
                            /** @type {number} */
                            txn = tx * cos + ty * sin;
                            /** @type {number} */
                            a10 = a00 * -sin + a10 * cos;
                            /** @type {number} */
                            y = x * -sin + y * cos;
                            /** @type {number} */
                            ty = tx * -sin + ty * cos;
                            /** @type {number} */
                            a21 = a11 * -sin + a21 * cos;
                            /** @type {number} */
                            a00 = subdir;
                            /** @type {number} */
                            x = newX;
                            /** @type {number} */
                            tx = txn;
                        }
                        /** @type {number} */
                        tile = Math.atan2(-a01, ty);
                        /** @type {number} */
                        data.rotationY = tile * step;
                        if (tile) {
                            /** @type {number} */
                            cos = Math.cos(-tile);
                            /** @type {number} */
                            sin = Math.sin(-tile);
                            /** @type {number} */
                            subdir = x0 * cos - a10 * sin;
                            /** @type {number} */
                            newX = x1 * cos - y * sin;
                            /** @type {number} */
                            txn = a01 * cos - ty * sin;
                            /** @type {number} */
                            y = x1 * sin + y * cos;
                            /** @type {number} */
                            ty = a01 * sin + ty * cos;
                            /** @type {number} */
                            a21 = a20 * sin + a21 * cos;
                            /** @type {number} */
                            x0 = subdir;
                            /** @type {number} */
                            x1 = newX;
                            /** @type {number} */
                            a01 = txn;
                        }
                        /** @type {number} */
                        tile = Math.atan2(x1, x0);
                        /** @type {number} */
                        data.rotation = tile * step;
                        if (tile) {
                            /** @type {number} */
                            cos = Math.cos(-tile);
                            /** @type {number} */
                            sin = Math.sin(-tile);
                            /** @type {number} */
                            x0 = x0 * cos + a00 * sin;
                            /** @type {number} */
                            newX = x1 * cos + x * sin;
                            /** @type {number} */
                            x = x1 * -sin + x * cos;
                            /** @type {number} */
                            tx = a01 * -sin + tx * cos;
                            /** @type {number} */
                            x1 = newX;
                        }
                        if (data.rotationX) {
                            if (Math.abs(data.rotationX) + Math.abs(data.rotation) > 359.9) {
                                /** @type {number} */
                                data.rotationX = data.rotation = 0;
                                /** @type {number} */
                                data.rotationY = 180 - data.rotationY;
                            }
                        }
                        /** @type {number} */
                        data.scaleX = (Math.sqrt(x0 * x0 + x1 * x1) * rad + 0.5 | 0) / rad;
                        /** @type {number} */
                        data.scaleY = (Math.sqrt(x * x + y * y) * rad + 0.5 | 0) / rad;
                        /** @type {number} */
                        data.scaleZ = (Math.sqrt(tx * tx + ty * ty) * rad + 0.5 | 0) / rad;
                        data.skewX = a00 || x ? Math.atan2(a00, x) * step + data.rotation : data.skewX || 0;
                        if (Math.abs(data.skewX) > 90) {
                            if (Math.abs(data.skewX) < 270) {
                                if (o) {
                                    data.scaleX *= -1;
                                    data.skewX += data.rotation <= 0 ? 180 : -180;
                                    data.rotation += data.rotation <= 0 ? 180 : -180;
                                } else {
                                    data.scaleY *= -1;
                                    data.skewX += data.skewX <= 0 ? 180 : -180;
                                }
                            }
                        }
                        /** @type {number} */
                        data.perspective = a21 ? 1 / (0 > a21 ? -a21 : a21) : 0;
                        data.x = b;
                        data.y = next;
                        data.z = z;
                        if (data.svg) {
                            data.x -= data.xOrigin - (data.xOrigin * x0 - data.yOrigin * a00);
                            data.y -= data.yOrigin - (data.yOrigin * x1 - data.xOrigin * x);
                        }
                    } else {
                        if ((!showMessage || (item || (!a.length || (data.x !== a[4] || (data.y !== a[5] || !data.rotationX && !data.rotationY))))) && (void 0 === data.x || "none" !== getStyle(el, "display", value))) {
                            /** @type {boolean} */
                            var solo = a.length >= 6;
                            var originalX = solo ? a[0] : 1;
                            var originalY = a[1] || 0;
                            var dY = a[2] || 0;
                            var dX = solo ? a[3] : 1;
                            data.x = a[4] || 0;
                            data.y = a[5] || 0;
                            /** @type {number} */
                            type = Math.sqrt(originalX * originalX + originalY * originalY);
                            /** @type {number} */
                            userid = Math.sqrt(dX * dX + dY * dY);
                            angle = originalX || originalY ? Math.atan2(originalY, originalX) * step : data.rotation || 0;
                            offset = dY || dX ? Math.atan2(dY, dX) * step + angle : data.skewX || 0;
                            if (Math.abs(offset) > 90) {
                                if (Math.abs(offset) < 270) {
                                    if (o) {
                                        type *= -1;
                                        offset += 0 >= angle ? 180 : -180;
                                        angle += 0 >= angle ? 180 : -180;
                                    } else {
                                        userid *= -1;
                                        offset += 0 >= offset ? 180 : -180;
                                    }
                                }
                            }
                            /** @type {number} */
                            data.scaleX = type;
                            /** @type {number} */
                            data.scaleY = userid;
                            data.rotation = angle;
                            data.skewX = offset;
                            if (showMessage) {
                                /** @type {number} */
                                data.rotationX = data.rotationY = data.z = 0;
                                /** @type {number} */
                                data.perspective = key;
                                /** @type {number} */
                                data.scaleZ = 1;
                            }
                            if (data.svg) {
                                data.x -= data.xOrigin - (data.xOrigin * originalX + data.yOrigin * dY);
                                data.y -= data.yOrigin - (data.xOrigin * originalY + data.yOrigin * dX);
                            }
                        }
                    }
                    data.zOrigin = body;
                    for (index in data) {
                        if (data[index] < result) {
                            if (data[index] > -result) {
                                /** @type {number} */
                                data[index] = 0;
                            }
                        }
                    }
                }
                return recurring && (el._gsTransform = data, data.svg && (object && el.style[prop] ? TweenLite.delayedCall(0.001, function () {
                    set(el.style, prop);
                }) : !object && (el.getAttribute("transform") && TweenLite.delayedCall(0.001, function () {
                    el.removeAttribute("transform");
                })))), data;
            };
            /**
             * @param {number} event
             * @return {undefined}
             */
            var update = function (event) {
                var requestUrl;
                var value;
                var data = this.data;
                /** @type {number} */
                var theta1 = -data.rotation * rad;
                /** @type {number} */
                var theta2 = theta1 + data.skewX * rad;
                /** @type {number} */
                var Vd = 1E5;
                /** @type {number} */
                var b00 = (Math.cos(theta1) * data.scaleX * Vd | 0) / Vd;
                /** @type {number} */
                var b10 = (Math.sin(theta1) * data.scaleX * Vd | 0) / Vd;
                /** @type {number} */
                var b01 = (Math.sin(theta2) * -data.scaleY * Vd | 0) / Vd;
                /** @type {number} */
                var b11 = (Math.cos(theta2) * data.scaleY * Vd | 0) / Vd;
                var style = this.t.style;
                var css = this.t.currentStyle;
                if (css) {
                    /** @type {number} */
                    value = b10;
                    /** @type {number} */
                    b10 = -b01;
                    /** @type {number} */
                    b01 = -value;
                    requestUrl = css.filter;
                    /** @type {string} */
                    style.filter = "";
                    var a20;
                    var a21;
                    var x = this.t.offsetWidth;
                    var y = this.t.offsetHeight;
                    /** @type {boolean} */
                    var s = "absolute" !== css.position;
                    /** @type {string} */
                    var fileName = "progid:DXImageTransform.Microsoft.Matrix(M11=" + b00 + ", M12=" + b10 + ", M21=" + b01 + ", M22=" + b11;
                    var sMin = data.x + x * data.xPercent / 100;
                    var lMin = data.y + y * data.yPercent / 100;
                    if (null != data.ox && (a20 = (data.oxp ? x * data.ox * 0.01 : data.ox) - x / 2, a21 = (data.oyp ? y * data.oy * 0.01 : data.oy) - y / 2, sMin += a20 - (a20 * b00 + a21 * b10), lMin += a21 - (a20 * b01 + a21 * b11)), s ? (a20 = x / 2, a21 = y / 2, fileName += ", Dx=" + (a20 - (a20 * b00 + a21 * b10) + sMin) + ", Dy=" + (a21 - (a20 * b01 + a21 * b11) + lMin) + ")") : fileName += ", sizingMethod='auto expand')", -1 !== requestUrl.indexOf("DXImageTransform.Microsoft.Matrix(") ? style.filter =
                        requestUrl.replace(rfilters, fileName) : style.filter = fileName + " " + requestUrl, (0 === event || 1 === event) && (1 === b00 && (0 === b10 && (0 === b01 && (1 === b11 && (s && -1 === fileName.indexOf("Dx=0, Dy=0") || (rCurrLoc.test(requestUrl) && 100 !== parseFloat(RegExp.$1) || -1 === requestUrl.indexOf(requestUrl.indexOf("Alpha")) && style.removeAttribute("filter"))))))), !s) {
                        var val;
                        var key;
                        var multiplier;
                        /** @type {number} */
                        var diff = 8 > start ? 1 : -1;
                        a20 = data.ieOffsetX || 0;
                        a21 = data.ieOffsetY || 0;
                        /** @type {number} */
                        data.ieOffsetX = Math.round((x - ((0 > b00 ? -b00 : b00) * x + (0 > b10 ? -b10 : b10) * y)) / 2 + sMin);
                        /** @type {number} */
                        data.ieOffsetY = Math.round((y - ((0 > b11 ? -b11 : b11) * y + (0 > b01 ? -b01 : b01) * x)) / 2 + lMin);
                        /** @type {number} */
                        i = 0;
                        for (; 4 > i; i++) {
                            key = tmp_keys[i];
                            val = css[key];
                            value = -1 !== val.indexOf("px") ? parseFloat(val) : get(this.t, key, parseFloat(val), val.replace(cx, "")) || 0;
                            /** @type {number} */
                            multiplier = value !== data[key] ? 2 > i ? -data.ieOffsetX : -data.ieOffsetY : 2 > i ? a20 - data.ieOffsetX : a21 - data.ieOffsetY;
                            /** @type {string} */
                            style[key] = (data[key] = Math.round(value - multiplier * (0 === i || 2 === i ? 1 : diff))) + "px";
                        }
                    }
                }
            };
            /** @type {function (number): ?} */
            var point = body.set3DTransformRatio = body.setTransformRatio = function (dataAndEvents) {
                var a10;
                var a20;
                var a21;
                var a01;
                var a30;
                var a31;
                var h;
                var b;
                var m01;
                var origCount;
                var j;
                var distance;
                var s;
                var w;
                var b01;
                var b11;
                var a;
                var length2;
                var v;
                var _;
                var value;
                var alpha;
                var b00;
                var data = this.data;
                var cache = this.t.style;
                var angle = data.rotation;
                var i = data.rotationX;
                var d = data.rotationY;
                var dx = data.scaleX;
                var list = data.scaleY;
                var stack = data.scaleZ;
                var x = data.x;
                var width = data.y;
                var time = data.z;
                var type = data.svg;
                var module = data.perspective;
                var method = data.force3D;
                if (((1 === dataAndEvents || 0 === dataAndEvents) && ("auto" === method && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime)) || !method) && (!time && (!module && (!d && (!i && 1 === stack)))) || (object && type || !showMessage)) {
                    return void(angle || (data.skewX || type) ? (angle *= rad, alpha = data.skewX * rad, b00 = 1E5, a10 = Math.cos(angle) * dx, a01 = Math.sin(angle) * dx, a20 = Math.sin(angle - alpha) * -list, a30 = Math.cos(angle - alpha) * list, alpha && ("simple" === data.skewType && (a = Math.tan(alpha), a = Math.sqrt(1 + a * a), a20 *= a, a30 *= a, data.skewY && (a10 *= a, a01 *= a))), type && (x += data.xOrigin - (data.xOrigin * a10 + data.yOrigin * a20) + data.xOffset, width += data.yOrigin - (data.xOrigin *
                            a01 + data.yOrigin * a30) + data.yOffset, object && ((data.xPercent || data.yPercent) && (w = this.t.getBBox(), x += 0.01 * data.xPercent * w.width, width += 0.01 * data.yPercent * w.height)), w = 1E-6, w > x && (x > -w && (x = 0)), w > width && (width > -w && (width = 0))), v = (a10 * b00 | 0) / b00 + "," + (a01 * b00 | 0) / b00 + "," + (a20 * b00 | 0) / b00 + "," + (a30 * b00 | 0) / b00 + "," + x + "," + width + ")", type && object ? this.t.setAttribute("transform", "matrix(" + v) : cache[prop] =
                        (data.xPercent || data.yPercent ? "translate(" + data.xPercent + "%," + data.yPercent + "%) matrix(" : "matrix(") + v) : cache[prop] = (data.xPercent || data.yPercent ? "translate(" + data.xPercent + "%," + data.yPercent + "%) matrix(" : "matrix(") + dx + ",0,0," + list + "," + x + "," + width + ")");
                }
                if (result && (w = 1E-4, w > dx && (dx > -w && (dx = stack = 2E-5)), w > list && (list > -w && (list = stack = 2E-5)), !module || (data.z || (data.rotationX || (data.rotationY || (module = 0))))), angle || data.skewX) {
                    angle *= rad;
                    /** @type {number} */
                    b01 = a10 = Math.cos(angle);
                    /** @type {number} */
                    b11 = a01 = Math.sin(angle);
                    if (data.skewX) {
                        angle -= data.skewX * rad;
                        /** @type {number} */
                        b01 = Math.cos(angle);
                        /** @type {number} */
                        b11 = Math.sin(angle);
                        if ("simple" === data.skewType) {
                            /** @type {number} */
                            a = Math.tan(data.skewX * rad);
                            /** @type {number} */
                            a = Math.sqrt(1 + a * a);
                            b01 *= a;
                            b11 *= a;
                            if (data.skewY) {
                                a10 *= a;
                                a01 *= a;
                            }
                        }
                    }
                    /** @type {number} */
                    a20 = -b11;
                    /** @type {number} */
                    a30 = b01;
                } else {
                    if (!(d || (i || (1 !== stack || (module || type))))) {
                        return void(cache[prop] = (data.xPercent || data.yPercent ? "translate(" + data.xPercent + "%," + data.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + width + "px," + time + "px)" + (1 !== dx || 1 !== list ? " scale(" + dx + "," + list + ")" : ""));
                    }
                    /** @type {number} */
                    a10 = a30 = 1;
                    /** @type {number} */
                    a20 = a01 = 0;
                }
                /** @type {number} */
                m01 = 1;
                /** @type {number} */
                a21 = a31 = h = b = origCount = j = 0;
                /** @type {number} */
                distance = module ? -1 / module : 0;
                s = data.zOrigin;
                /** @type {number} */
                w = 1E-6;
                /** @type {string} */
                _ = ",";
                /** @type {string} */
                value = "0";
                /** @type {number} */
                angle = d * rad;
                if (angle) {
                    /** @type {number} */
                    b01 = Math.cos(angle);
                    /** @type {number} */
                    b11 = Math.sin(angle);
                    /** @type {number} */
                    h = -b11;
                    /** @type {number} */
                    origCount = distance * -b11;
                    /** @type {number} */
                    a21 = a10 * b11;
                    /** @type {number} */
                    a31 = a01 * b11;
                    /** @type {number} */
                    m01 = b01;
                    distance *= b01;
                    a10 *= b01;
                    a01 *= b01;
                }
                /** @type {number} */
                angle = i * rad;
                if (angle) {
                    /** @type {number} */
                    b01 = Math.cos(angle);
                    /** @type {number} */
                    b11 = Math.sin(angle);
                    /** @type {number} */
                    a = a20 * b01 + a21 * b11;
                    /** @type {number} */
                    length2 = a30 * b01 + a31 * b11;
                    /** @type {number} */
                    b = m01 * b11;
                    /** @type {number} */
                    j = distance * b11;
                    /** @type {number} */
                    a21 = a20 * -b11 + a21 * b01;
                    /** @type {number} */
                    a31 = a30 * -b11 + a31 * b01;
                    m01 *= b01;
                    distance *= b01;
                    /** @type {number} */
                    a20 = a;
                    /** @type {number} */
                    a30 = length2;
                }
                if (1 !== stack) {
                    a21 *= stack;
                    a31 *= stack;
                    m01 *= stack;
                    distance *= stack;
                }
                if (1 !== list) {
                    a20 *= list;
                    a30 *= list;
                    b *= list;
                    j *= list;
                }
                if (1 !== dx) {
                    a10 *= dx;
                    a01 *= dx;
                    h *= dx;
                    origCount *= dx;
                }
                if (s || type) {
                    if (s) {
                        x += a21 * -s;
                        width += a31 * -s;
                        time += m01 * -s + s;
                    }
                    if (type) {
                        x += data.xOrigin - (data.xOrigin * a10 + data.yOrigin * a20) + data.xOffset;
                        width += data.yOrigin - (data.xOrigin * a01 + data.yOrigin * a30) + data.yOffset;
                    }
                    if (w > x) {
                        if (x > -w) {
                            /** @type {string} */
                            x = value;
                        }
                    }
                    if (w > width) {
                        if (width > -w) {
                            /** @type {string} */
                            width = value;
                        }
                    }
                    if (w > time) {
                        if (time > -w) {
                            /** @type {number} */
                            time = 0;
                        }
                    }
                }
                /** @type {string} */
                v = data.xPercent || data.yPercent ? "translate(" + data.xPercent + "%," + data.yPercent + "%) matrix3d(" : "matrix3d(";
                v += (w > a10 && a10 > -w ? value : a10) + _ + (w > a01 && a01 > -w ? value : a01) + _ + (w > h && h > -w ? value : h);
                v += _ + (w > origCount && origCount > -w ? value : origCount) + _ + (w > a20 && a20 > -w ? value : a20) + _ + (w > a30 && a30 > -w ? value : a30);
                if (i || (d || 1 !== stack)) {
                    v += _ + (w > b && b > -w ? value : b) + _ + (w > j && j > -w ? value : j) + _ + (w > a21 && a21 > -w ? value : a21);
                    v += _ + (w > a31 && a31 > -w ? value : a31) + _ + (w > m01 && m01 > -w ? value : m01) + _ + (w > distance && distance > -w ? value : distance) + _;
                } else {
                    v += ",0,0,0,0,1,0,";
                }
                v += x + _ + width + _ + time + _ + (module ? 1 + -time / module : 1) + ")";
                /** @type {string} */
                cache[prop] = v;
            };
            p = Properties.prototype;
            /** @type {number} */
            p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
            /** @type {number} */
            p.scaleX = p.scaleY = p.scaleZ = 1;
            testAllProps("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
                /**
                 * @param {Object} el
                 * @param {string} s
                 * @param {string} key
                 * @param {number} callback
                 * @param {string} params
                 * @param {number} recurring
                 * @param {string} element
                 * @return {?}
                 */
                parser: function (el, s, key, callback, params, recurring, element) {
                    if (callback._lastParsedTransform === element) {
                        return params;
                    }
                    /** @type {string} */
                    callback._lastParsedTransform = element;
                    var options;
                    var target;
                    var style;
                    var args;
                    var attrs;
                    var o;
                    var name;
                    var x;
                    var y;
                    var a;
                    var horizontal = el._gsTransform;
                    var css = el.style;
                    /** @type {number} */
                    var v = 1E-6;
                    /** @type {number} */
                    var index = tokenized.length;
                    /** @type {string} */
                    var data = element;
                    var seen = {};
                    /** @type {string} */
                    var udataCur = "transformOrigin";
                    if (element.display ? (style = getStyle(el, "display"), css.display = "block", options = merge(el, arg, true, element.parseTransform), css.display = style) : options = merge(el, arg, true, element.parseTransform), callback._transform = options, "string" == typeof data.transform && prop) {
                        style = container.style;
                        style[prop] = data.transform;
                        /** @type {string} */
                        style.display = "block";
                        /** @type {string} */
                        style.position = "absolute";
                        doc.body.appendChild(container);
                        target = merge(container, null, false);
                        if (options.svg) {
                            x = options.xOrigin;
                            y = options.yOrigin;
                            target.x -= options.xOffset;
                            target.y -= options.yOffset;
                            if (data.transformOrigin || data.svgOrigin) {
                                args = {};
                                handler(el, parse(data.transformOrigin), args, data.svgOrigin, data.smoothOrigin, true);
                                x = args.xOrigin;
                                y = args.yOrigin;
                                target.x -= args.xOffset - options.xOffset;
                                target.y -= args.yOffset - options.yOffset;
                            }
                            if (x || y) {
                                a = fn(container);
                                target.x -= x - (x * a[0] + y * a[2]);
                                target.y -= y - (x * a[1] + y * a[3]);
                            }
                        }
                        doc.body.removeChild(container);
                        if (!target.perspective) {
                            target.perspective = options.perspective;
                        }
                        if (null != data.xPercent) {
                            target.xPercent = valid(data.xPercent, options.xPercent);
                        }
                        if (null != data.yPercent) {
                            target.yPercent = valid(data.yPercent, options.yPercent);
                        }
                    } else {
                        if ("object" == typeof data) {
                            if (target = {
                                    scaleX: valid(null != data.scaleX ? data.scaleX : data.scale, options.scaleX),
                                    scaleY: valid(null != data.scaleY ? data.scaleY : data.scale, options.scaleY),
                                    scaleZ: valid(data.scaleZ, options.scaleZ),
                                    x: valid(data.x, options.x),
                                    y: valid(data.y, options.y),
                                    z: valid(data.z, options.z),
                                    xPercent: valid(data.xPercent, options.xPercent),
                                    yPercent: valid(data.yPercent, options.yPercent),
                                    perspective: valid(data.transformPerspective, options.perspective)
                                }, name = data.directionalRotation, null != name) {
                                if ("object" == typeof name) {
                                    for (style in name) {
                                        data[style] = name[style];
                                    }
                                } else {
                                    data.rotation = name;
                                }
                            }
                            if ("string" == typeof data.x) {
                                if (-1 !== data.x.indexOf("%")) {
                                    /** @type {number} */
                                    target.x = 0;
                                    target.xPercent = valid(data.x, options.xPercent);
                                }
                            }
                            if ("string" == typeof data.y) {
                                if (-1 !== data.y.indexOf("%")) {
                                    /** @type {number} */
                                    target.y = 0;
                                    target.yPercent = valid(data.y, options.yPercent);
                                }
                            }
                            target.rotation = interpolate("rotation" in data ? data.rotation : "shortRotation" in data ? data.shortRotation + "_short" : "rotationZ" in data ? data.rotationZ : options.rotation - options.skewY, options.rotation - options.skewY, "rotation", seen);
                            if (showMessage) {
                                target.rotationX = interpolate("rotationX" in data ? data.rotationX : "shortRotationX" in data ? data.shortRotationX + "_short" : options.rotationX || 0, options.rotationX, "rotationX", seen);
                                target.rotationY = interpolate("rotationY" in data ? data.rotationY : "shortRotationY" in data ? data.shortRotationY + "_short" : options.rotationY || 0, options.rotationY, "rotationY", seen);
                            }
                            target.skewX = interpolate(data.skewX, options.skewX - options.skewY);
                            if (target.skewY = interpolate(data.skewY, options.skewY)) {
                                target.skewX += target.skewY;
                                target.rotation += target.skewY;
                            }
                        }
                    }
                    if (showMessage) {
                        if (null != data.force3D) {
                            options.force3D = data.force3D;
                            /** @type {boolean} */
                            o = true;
                        }
                    }
                    options.skewType = data.skewType || (options.skewType || self.defaultSkewType);
                    attrs = options.force3D || (options.z || (options.rotationX || (options.rotationY || (target.z || (target.rotationX || (target.rotationY || target.perspective))))));
                    if (!attrs) {
                        if (!(null == data.scale)) {
                            /** @type {number} */
                            target.scaleZ = 1;
                        }
                    }
                    for (; --index > -1;) {
                        /** @type {string} */
                        key = tokenized[index];
                        /** @type {number} */
                        args = target[key] - options[key];
                        if (args > v || (-v > args || (null != data[key] || null != pos[key]))) {
                            /** @type {boolean} */
                            o = true;
                            params = new Parser(options, key, options[key], args, params);
                            if (key in seen) {
                                params.e = seen[key];
                            }
                            /** @type {number} */
                            params.xs0 = 0;
                            /** @type {number} */
                            params.plugin = recurring;
                            callback._overwriteProps.push(params.n);
                        }
                    }
                    return args = data.transformOrigin, options.svg && ((args || data.svgOrigin) && (x = options.xOffset, y = options.yOffset, handler(el, parse(args), target, data.svgOrigin, data.smoothOrigin), params = extend(options, "xOrigin", (horizontal ? options : target).xOrigin, target.xOrigin, params, udataCur), params = extend(options, "yOrigin", (horizontal ? options : target).yOrigin, target.yOrigin, params, udataCur), (x !== options.xOffset || y !== options.yOffset) && (params = extend(options,
                        "xOffset", horizontal ? x : options.xOffset, options.xOffset, params, udataCur), params = extend(options, "yOffset", horizontal ? y : options.yOffset, options.yOffset, params, udataCur)), args = object ? null : "0px 0px")), (args || showMessage && (attrs && options.zOrigin)) && (prop ? (o = true, key = property, args = (args || getStyle(el, key, arg, false, "50% 50%")) + "", params = new Parser(css, key, 0, 0, params, -1, udataCur), params.b = css[key], params.plugin = recurring, showMessage ?
                        (style = options.zOrigin, args = args.split(" "), options.zOrigin = (args.length > 2 && (0 === style || "0px" !== args[2]) ? parseFloat(args[2]) : style) || 0, params.xs0 = params.e = args[0] + " " + (args[1] || "50%") + " 0px", params = new Parser(options, "zOrigin", 0, 0, params, -1, params.n), params.b = style, params.xs0 = params.e = options.zOrigin) : params.xs0 = params.e = args) : parse(args + "", options)), o && (callback._transformType = options.svg && object || !attrs && 3 !== this._transformType ?
                        2 : 3), params;
                },
                prefix: true
            });
            testAllProps("boxShadow", {
                defaultValue: "0px 0px 0px 0px #999",
                prefix: true,
                color: true,
                multi: true,
                keyword: "inset"
            });
            testAllProps("borderRadius", {
                defaultValue: "0px",
                /**
                 * @param {Object} el
                 * @param {string} s
                 * @param {string} name
                 * @param {number} callback
                 * @param {string} data
                 * @param {number} recurring
                 * @return {?}
                 */
                parser: function (el, s, name, callback, data, recurring) {
                    s = this.format(s);
                    var map;
                    var i;
                    var val;
                    var value;
                    var size;
                    var key;
                    var number;
                    var step;
                    var h;
                    var scale;
                    var end;
                    var start;
                    var u;
                    var v;
                    var n;
                    var m;
                    /** @type {Array} */
                    var codeSegments = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"];
                    var style = el.style;
                    /** @type {number} */
                    h = parseFloat(el.offsetWidth);
                    /** @type {number} */
                    scale = parseFloat(el.offsetHeight);
                    map = s.split(" ");
                    /** @type {number} */
                    i = 0;
                    for (; i < codeSegments.length; i++) {
                        if (this.p.indexOf("border")) {
                            codeSegments[i] = getVendorPropertyName(codeSegments[i]);
                        }
                        size = value = getStyle(el, codeSegments[i], arg, false, "0px");
                        if (-1 !== size.indexOf(" ")) {
                            value = size.split(" ");
                            size = value[0];
                            value = value[1];
                        }
                        key = val = map[i];
                        /** @type {number} */
                        number = parseFloat(size);
                        start = size.substr((number + "").length);
                        /** @type {boolean} */
                        u = "=" === key.charAt(1);
                        if (u) {
                            /** @type {number} */
                            step = parseInt(key.charAt(0) + "1", 10);
                            key = key.substr(2);
                            step *= parseFloat(key);
                            end = key.substr((step + "").length - (0 > step ? 1 : 0)) || "";
                        } else {
                            /** @type {number} */
                            step = parseFloat(key);
                            end = key.substr((step + "").length);
                        }
                        if ("" === end) {
                            end = classCache[name] || start;
                        }
                        if (end !== start) {
                            v = get(el, "borderLeft", number, start);
                            n = get(el, "borderTop", number, start);
                            if ("%" === end) {
                                /** @type {string} */
                                size = v / h * 100 + "%";
                                /** @type {string} */
                                value = n / scale * 100 + "%";
                            } else {
                                if ("em" === end) {
                                    m = get(el, "borderLeft", 1, "em");
                                    /** @type {string} */
                                    size = v / m + "em";
                                    /** @type {string} */
                                    value = n / m + "em";
                                } else {
                                    /** @type {string} */
                                    size = v + "px";
                                    /** @type {string} */
                                    value = n + "px";
                                }
                            }
                            if (u) {
                                key = parseFloat(size) + step + end;
                                val = parseFloat(value) + step + end;
                            }
                        }
                        data = normalize(style, codeSegments[i], size + " " + value, key + " " + val, false, "0px", data);
                    }
                    return data;
                },
                prefix: true,
                formatter: compile("0px 0px 0px 0px", false, true)
            });
            testAllProps("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
                defaultValue: "0px",
                /**
                 * @param {Object} el
                 * @param {string} s
                 * @param {string} name
                 * @param {number} callback
                 * @param {string} body
                 * @param {number} recurring
                 * @return {?}
                 */
                parser: function (el, s, name, callback, body, recurring) {
                    return normalize(el.style, name, this.format(getStyle(el, name, arg, false, "0px 0px")), this.format(s), false, "0px", body);
                },
                prefix: true,
                formatter: compile("0px 0px", false, true)
            });
            testAllProps("backgroundPosition", {
                defaultValue: "0 0",
                /**
                 * @param {Object} el
                 * @param {string} s
                 * @param {string} name
                 * @param {number} callback
                 * @param {string} body
                 * @param {number} recurring
                 * @return {?}
                 */
                parser: function (el, s, name, callback, body, recurring) {
                    var buffer;
                    var dirs;
                    var key;
                    var value;
                    var scale;
                    var title;
                    /** @type {string} */
                    var prop = "background-position";
                    var style = arg || test(el, null);
                    var data = this.format((style ? start ? style.getPropertyValue(prop + "-x") + " " + style.getPropertyValue(prop + "-y") : style.getPropertyValue(prop) : el.currentStyle.backgroundPositionX + " " + el.currentStyle.backgroundPositionY) || "0 0");
                    var f = this.format(s);
                    if (-1 !== data.indexOf("%") != (-1 !== f.indexOf("%")) && (f.split(",").length < 2 && (title = getStyle(el, "backgroundImage").replace(emptyParagraphRegexp, ""), title && "none" !== title))) {
                        buffer = data.split(" ");
                        dirs = f.split(" ");
                        img.setAttribute("src", title);
                        /** @type {number} */
                        key = 2;
                        for (; --key > -1;) {
                            data = buffer[key];
                            /** @type {boolean} */
                            value = -1 !== data.indexOf("%");
                            if (value !== (-1 !== dirs[key].indexOf("%"))) {
                                /** @type {number} */
                                scale = 0 === key ? el.offsetWidth - img.width : el.offsetHeight - img.height;
                                /** @type {string} */
                                buffer[key] = value ? parseFloat(data) / 100 * scale + "px" : parseFloat(data) / scale * 100 + "%";
                            }
                        }
                        data = buffer.join(" ");
                    }
                    return this.parseComplex(el.style, data, f, body, recurring);
                },
                /** @type {function (string, string): ?} */
                formatter: parse
            });
            testAllProps("backgroundSize", {
                defaultValue: "0 0",
                /** @type {function (string, string): ?} */
                formatter: parse
            });
            testAllProps("perspective", {
                defaultValue: "0px",
                prefix: true
            });
            testAllProps("perspectiveOrigin", {
                defaultValue: "50% 50%",
                prefix: true
            });
            testAllProps("transformStyle", {
                prefix: true
            });
            testAllProps("backfaceVisibility", {
                prefix: true
            });
            testAllProps("userSelect", {
                prefix: true
            });
            testAllProps("margin", {
                parser: stream("marginTop,marginRight,marginBottom,marginLeft")
            });
            testAllProps("padding", {
                parser: stream("paddingTop,paddingRight,paddingBottom,paddingLeft")
            });
            testAllProps("clip", {
                defaultValue: "rect(0px,0px,0px,0px)",
                /**
                 * @param {Object} body
                 * @param {string} value
                 * @param {string} name
                 * @param {number} callback
                 * @param {string} s
                 * @param {number} recurring
                 * @return {?}
                 */
                parser: function (body, value, name, callback, s, recurring) {
                    var memory;
                    var cs;
                    var field;
                    return 9 > start ? (cs = body.currentStyle, field = 8 > start ? " " : ",", memory = "rect(" + cs.clipTop + field + cs.clipRight + field + cs.clipBottom + field + cs.clipLeft + ")", value = this.format(value).split(",").join(field)) : (memory = this.format(getStyle(body, this.p, arg, false, this.dflt)), value = this.format(value)), this.parseComplex(body.style, memory, value, s, recurring);
                }
            });
            testAllProps("textShadow", {
                defaultValue: "0px 0px 0px #999",
                color: true,
                multi: true
            });
            testAllProps("autoRound,strictUnits", {
                /**
                 * @param {Object} body
                 * @param {string} s
                 * @param {string} name
                 * @param {number} callback
                 * @param {string} data
                 * @return {?}
                 */
                parser: function (body, s, name, callback, data) {
                    return data;
                }
            });
            testAllProps("border", {
                defaultValue: "0px solid #000",
                /**
                 * @param {Object} body
                 * @param {string} s
                 * @param {string} value
                 * @param {number} callback
                 * @param {string} name
                 * @param {number} recurring
                 * @return {?}
                 */
                parser: function (body, s, value, callback, name, recurring) {
                    return this.parseComplex(body.style, this.format(getStyle(body, "borderTopWidth", arg, false, "0px") + " " + getStyle(body, "borderTopStyle", arg, false, "solid") + " " + getStyle(body, "borderTopColor", arg, false, "#000")), this.format(s), name, recurring);
                },
                color: true,
                /**
                 * @param {string} v
                 * @return {?}
                 */
                formatter: function (v) {
                    var solid = v.split(" ");
                    return solid[0] + " " + (solid[1] || "solid") + " " + (v.match(regex) || ["#000"])[0];
                }
            });
            testAllProps("borderWidth", {
                parser: stream("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
            });
            testAllProps("float,cssFloat,styleFloat", {
                /**
                 * @param {Object} html
                 * @param {string} s
                 * @param {string} name
                 * @param {number} callback
                 * @param {string} body
                 * @param {number} recurring
                 * @return {?}
                 */
                parser: function (html, s, name, callback, body, recurring) {
                    var workerStyle = html.style;
                    /** @type {string} */
                    var floatAttr = "cssFloat" in workerStyle ? "cssFloat" : "styleFloat";
                    return new Parser(workerStyle, floatAttr, 0, 0, body, -1, name, false, 0, workerStyle[floatAttr], s);
                }
            });
            /**
             * @param {number} val
             * @return {undefined}
             */
            var format = function (val) {
                var b;
                var elem = this.t;
                var s = elem.filter || (getStyle(this.data, "filter") || "");
                /** @type {number} */
                var i = this.s + this.c * val | 0;
                if (100 === i) {
                    if (-1 === s.indexOf("atrix(") && (-1 === s.indexOf("radient(") && -1 === s.indexOf("oader("))) {
                        elem.removeAttribute("filter");
                        /** @type {boolean} */
                        b = !getStyle(this.data, "filter");
                    } else {
                        elem.filter = s.replace(rSlash, "");
                        /** @type {boolean} */
                        b = true;
                    }
                }
                if (!b) {
                    if (this.xn1) {
                        elem.filter = s = s || "alpha(opacity=" + i + ")";
                    }
                    if (-1 === s.indexOf("pacity")) {
                        if (!(0 === i && this.xn1)) {
                            /** @type {string} */
                            elem.filter = s + " alpha(opacity=" + i + ")";
                        }
                    } else {
                        elem.filter = s.replace(rCurrLoc, "opacity=" + i);
                    }
                }
            };
            testAllProps("opacity,alpha,autoAlpha", {
                defaultValue: "1",
                /**
                 * @param {Object} body
                 * @param {string} str
                 * @param {string} name
                 * @param {number} callback
                 * @param {Object} data
                 * @param {number} recurring
                 * @return {?}
                 */
                parser: function (body, str, name, callback, data, recurring) {
                    /** @type {number} */
                    var last = parseFloat(getStyle(body, "opacity", arg, false, "1"));
                    var style = body.style;
                    /** @type {boolean} */
                    var config = "autoAlpha" === name;
                    return "string" == typeof str && ("=" === str.charAt(1) && (str = ("-" === str.charAt(0) ? -1 : 1) * parseFloat(str.substr(2)) + last)), config && (1 === last && ("hidden" === getStyle(body, "visibility", arg) && (0 !== str && (last = 0)))), events ? data = new Parser(style, "opacity", last, str - last, data) : (data = new Parser(style, "opacity", 100 * last, 100 * (str - last), data), data.xn1 = config ? 1 : 0, style.zoom = 1, data.type = 2, data.b = "alpha(opacity=" + data.s + ")", data.e =
                        "alpha(opacity=" + (data.s + data.c) + ")", data.data = body, data.plugin = recurring, data.setRatio = format), config && (data = new Parser(style, "visibility", 0, 0, data, -1, null, false, 0, 0 !== last ? "inherit" : "hidden", 0 === str ? "hidden" : "inherit"), data.xs0 = "inherit", callback._overwriteProps.push(data.n), callback._overwriteProps.push(name)), data;
                }
            });
            /**
             * @param {?} s
             * @param {string} key
             * @return {undefined}
             */
            var set = function (s, key) {
                if (key) {
                    if (s.removeProperty) {
                        if ("ms" === key.substr(0, 2) || "webkit" === key.substr(0, 6)) {
                            /** @type {string} */
                            key = "-" + key;
                        }
                        s.removeProperty(key.replace(rmultiDash, "-$1").toLowerCase());
                    } else {
                        s.removeAttribute(key);
                    }
                }
            };
            /**
             * @param {number} event
             * @return {undefined}
             */
            var next = function (event) {
                if (this.t._gsClassPT = this, 1 === event || 0 === event) {
                    this.t.setAttribute("class", 0 === event ? this.b : this.e);
                    var current = this.data;
                    var tmp = this.t.style;
                    for (; current;) {
                        if (current.v) {
                            tmp[current.p] = current.v;
                        } else {
                            set(tmp, current.p);
                        }
                        current = current._next;
                    }
                    if (1 === event) {
                        if (this.t._gsClassPT === this) {
                            /** @type {null} */
                            this.t._gsClassPT = null;
                        }
                    }
                } else {
                    if (this.t.getAttribute("class") !== this.e) {
                        this.t.setAttribute("class", this.e);
                    }
                }
            };
            testAllProps("className", {
                /**
                 * @param {Object} val
                 * @param {string} s
                 * @param {number} value
                 * @param {number} callback
                 * @param {string} data
                 * @param {number} which
                 * @param {Object} name
                 * @return {?}
                 */
                parser: function (val, s, value, callback, data, which, name) {
                    var node;
                    var text;
                    var i;
                    var suiteView;
                    var state;
                    var p = val.getAttribute("class") || "";
                    var oldCSS = val.style.cssText;
                    if (data = callback._classNamePT = new Parser(val, value, 0, 0, data, 2), data.setRatio = next, data.pr = -11, c = true, data.b = p, text = render(val, arg), i = val._gsClassPT) {
                        suiteView = {};
                        state = i.data;
                        for (; state;) {
                            /** @type {number} */
                            suiteView[state.p] = 1;
                            state = state._next;
                        }
                        i.setRatio(1);
                    }
                    return val._gsClassPT = data, data.e = "=" !== s.charAt(1) ? s : p.replace(new RegExp("(?:\\s|^)" + s.substr(2) + "(?![\\w-])"), "") + ("+" === s.charAt(0) ? " " + s.substr(2) : ""), val.setAttribute("class", data.e), node = f(val, text, render(val), name, suiteView), val.setAttribute("class", p), data.data = node.firstMPT, val.style.cssText = oldCSS, data = data.xfirst = callback.parse(val, node.difs, data, which);
                }
            });
            /**
             * @param {number} state
             * @return {undefined}
             */
            var init = function (state) {
                if ((1 === state || 0 === state) && (this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data)) {
                    var keys;
                    var key;
                    var idx;
                    var e;
                    var t;
                    var c = this.t.style;
                    var parse = old.transform.parse;
                    if ("all" === this.e) {
                        /** @type {string} */
                        c.cssText = "";
                        /** @type {boolean} */
                        e = true;
                    } else {
                        keys = this.e.split(" ").join("").split(",");
                        idx = keys.length;
                        for (; --idx > -1;) {
                            key = keys[idx];
                            if (old[key]) {
                                if (old[key].parse === parse) {
                                    /** @type {boolean} */
                                    e = true;
                                } else {
                                    key = "transformOrigin" === key ? property : old[key].p;
                                }
                            }
                            set(c, key);
                        }
                    }
                    if (e) {
                        set(c, prop);
                        t = this.t._gsTransform;
                        if (t) {
                            if (t.svg) {
                                this.t.removeAttribute("data-svg-origin");
                                this.t.removeAttribute("transform");
                            }
                            delete this.t._gsTransform;
                        }
                    }
                }
            };
            testAllProps("clearProps", {
                /**
                 * @param {Object} html
                 * @param {string} s
                 * @param {string} name
                 * @param {number} callback
                 * @param {string} node
                 * @return {?}
                 */
                parser: function (html, s, name, callback, node) {
                    return node = new Parser(html, name, 0, 0, node, 2), node.setRatio = init, node.e = s, node.pr = -10, node.data = callback._tween, c = true, node;
                }
            });
            /** @type {Array.<string>} */
            p = "bezier,throwProps,physicsProps,physics2D".split(",");
            /** @type {number} */
            i = p.length;
            for (; i--;) {
                func(p[i]);
            }
            p = self.prototype;
            /** @type {null} */
            p._firstPT = p._lastParsedTransform = p._transform = null;
            /**
             * @param {Object} val
             * @param {string} value
             * @param {?} tween
             * @return {?}
             */
            p._onInitTween = function (val, value, tween) {
                if (!val.nodeType) {
                    return false;
                }
                /** @type {Object} */
                this._target = val;
                this._tween = tween;
                /** @type {string} */
                this._vars = value;
                until = value.autoRound;
                /** @type {boolean} */
                c = false;
                classCache = value.suffixMap || self.suffixMap;
                arg = test(val, "");
                eventPath = this._overwriteProps;
                var result;
                var pt;
                var pt2;
                var name;
                var last;
                var next;
                var inputStr;
                var p;
                var isVisible;
                var elem = val.style;
                if (l && ("" === elem.zIndex && (result = getStyle(val, "zIndex", arg), ("auto" === result || "" === result) && this._addLazySet(elem, "zIndex", 0))), "string" == typeof value && (name = elem.cssText, result = render(val, arg), elem.cssText = name + ";" + value, result = f(val, result, render(val)).difs, !events && (rchecked.test(value) && (result.opacity = parseFloat(RegExp.$1))), value = result, elem.cssText = name), value.className ? this._firstPT = pt = old.className.parse(val, value.className,
                        "className", this, null, null, value) : this._firstPT = pt = this.parse(val, value, null), this._transformType) {
                    /** @type {boolean} */
                    isVisible = 3 === this._transformType;
                    if (prop) {
                        if (error) {
                            /** @type {boolean} */
                            l = true;
                            if ("" === elem.zIndex) {
                                inputStr = getStyle(val, "zIndex", arg);
                                if ("auto" === inputStr || "" === inputStr) {
                                    this._addLazySet(elem, "zIndex", 0);
                                }
                            }
                            if (stub) {
                                this._addLazySet(elem, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (isVisible ? "visible" : "hidden"));
                            }
                        }
                    } else {
                        /** @type {number} */
                        elem.zoom = 1;
                    }
                    pt2 = pt;
                    for (; pt2 && pt2._next;) {
                        pt2 = pt2._next;
                    }
                    p = new Parser(val, "transform", 0, 0, null, 2);
                    this._linkCSSP(p, null, pt2);
                    /** @type {Function} */
                    p.setRatio = prop ? point : update;
                    p.data = this._transform || merge(val, arg, true);
                    p.tween = tween;
                    /** @type {number} */
                    p.pr = -1;
                    eventPath.pop();
                }
                if (c) {
                    for (; pt;) {
                        next = pt._next;
                        pt2 = name;
                        for (; pt2 && pt2.pr > pt.pr;) {
                            pt2 = pt2._next;
                        }
                        if (pt._prev = pt2 ? pt2._prev : last) {
                            pt._prev._next = pt;
                        } else {
                            name = pt;
                        }
                        if (pt._next = pt2) {
                            pt2._prev = pt;
                        } else {
                            last = pt;
                        }
                        pt = next;
                    }
                    this._firstPT = name;
                }
                return true;
            };
            /**
             * @param {Object} body
             * @param {Object} s
             * @param {string} node
             * @param {number} recurring
             * @return {?}
             */
            p.parse = function (body, s, node, recurring) {
                var name;
                var jQuery;
                var val;
                var i;
                var value;
                var data;
                var type;
                var text;
                var result;
                var prefix;
                var style = body.style;
                for (name in s) {
                    data = s[name];
                    jQuery = old[name];
                    if (jQuery) {
                        node = jQuery.parse(body, data, name, this, node, recurring, s);
                    } else {
                        /** @type {string} */
                        value = getStyle(body, name, arg) + "";
                        /** @type {boolean} */
                        result = "string" == typeof data;
                        if ("color" === name || ("fill" === name || ("stroke" === name || (-1 !== name.indexOf("Color") || result && rbrace.test(data))))) {
                            if (!result) {
                                data = trim(data);
                                /** @type {string} */
                                data = (data.length > 3 ? "rgba(" : "rgb(") + data.join(",") + ")";
                            }
                            node = normalize(style, name, value, data, true, "transparent", node, 0, recurring);
                        } else {
                            if (result && rsingleTag.test(data)) {
                                node = normalize(style, name, value, data, true, null, node, 0, recurring);
                            } else {
                                /** @type {number} */
                                val = parseFloat(value);
                                /** @type {string} */
                                type = val || 0 === val ? value.substr((val + "").length) : "";
                                if ("" === value || "auto" === value) {
                                    if ("width" === name || "height" === name) {
                                        val = check(body, name, arg);
                                        /** @type {string} */
                                        type = "px";
                                    } else {
                                        if ("left" === name || "top" === name) {
                                            val = callback(body, name, arg);
                                            /** @type {string} */
                                            type = "px";
                                        } else {
                                            /** @type {number} */
                                            val = "opacity" !== name ? 0 : 1;
                                            /** @type {string} */
                                            type = "";
                                        }
                                    }
                                }
                                /** @type {boolean} */
                                prefix = result && "=" === data.charAt(1);
                                if (prefix) {
                                    /** @type {number} */
                                    i = parseInt(data.charAt(0) + "1", 10);
                                    data = data.substr(2);
                                    i *= parseFloat(data);
                                    text = data.replace(cx, "");
                                } else {
                                    /** @type {number} */
                                    i = parseFloat(data);
                                    text = result ? data.replace(cx, "") : "";
                                }
                                if ("" === text) {
                                    text = name in classCache ? classCache[name] : type;
                                }
                                data = i || 0 === i ? (prefix ? i + val : i) + text : s[name];
                                if (type !== text) {
                                    if ("" !== text) {
                                        if (i || 0 === i) {
                                            if (val) {
                                                val = get(body, name, val, type);
                                                if ("%" === text) {
                                                    val /= get(body, name, 100, "%") / 100;
                                                    if (s.strictUnits !== true) {
                                                        /** @type {string} */
                                                        value = val + "%";
                                                    }
                                                } else {
                                                    if ("em" === text || ("rem" === text || ("vw" === text || "vh" === text))) {
                                                        val /= get(body, name, 1, text);
                                                    } else {
                                                        if ("px" !== text) {
                                                            i = get(body, name, i, text);
                                                            /** @type {string} */
                                                            text = "px";
                                                        }
                                                    }
                                                }
                                                if (prefix) {
                                                    if (i || 0 === i) {
                                                        /** @type {string} */
                                                        data = i + val + text;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (prefix) {
                                    i += val;
                                }
                                if (!val && 0 !== val || !i && 0 !== i) {
                                    if (void 0 !== style[name] && (data || data + "" != "NaN" && null != data)) {
                                        node = new Parser(style, name, i || (val || 0), 0, node, -1, name, false, 0, value, data);
                                        node.xs0 = "none" !== data || "display" !== name && -1 === name.indexOf("Style") ? data : value;
                                    } else {
                                        debug("invalid " + name + " tween value: " + s[name]);
                                    }
                                } else {
                                    node = new Parser(style, name, val, i - val, node, 0, name, until !== false && ("px" === text || "zIndex" === name), 0, value, data);
                                    node.xs0 = text;
                                }
                            }
                        }
                    }
                    if (recurring) {
                        if (node) {
                            if (!node.plugin) {
                                /** @type {number} */
                                node.plugin = recurring;
                            }
                        }
                    }
                }
                return node;
            };
            /**
             * @param {number} v
             * @return {undefined}
             */
            p.setRatio = function (v) {
                var y;
                var c;
                var left;
                var p = this._firstPT;
                /** @type {number} */
                var x = 1E-6;
                if (1 !== v || this._tween._time !== this._tween._duration && 0 !== this._tween._time) {
                    if (v || (this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1E-6)) {
                        for (; p;) {
                            if (y = p.c * v + p.s, p.r ? y = Math.round(y) : x > y && (y > -x && (y = 0)), p.type) {
                                if (1 === p.type) {
                                    if (left = p.l, 2 === left) {
                                        p.t[p.p] = p.xs0 + y + p.xs1 + p.xn1 + p.xs2;
                                    } else {
                                        if (3 === left) {
                                            p.t[p.p] = p.xs0 + y + p.xs1 + p.xn1 + p.xs2 + p.xn2 + p.xs3;
                                        } else {
                                            if (4 === left) {
                                                p.t[p.p] = p.xs0 + y + p.xs1 + p.xn1 + p.xs2 + p.xn2 + p.xs3 + p.xn3 + p.xs4;
                                            } else {
                                                if (5 === left) {
                                                    p.t[p.p] = p.xs0 + y + p.xs1 + p.xn1 + p.xs2 + p.xn2 + p.xs3 + p.xn3 + p.xs4 + p.xn4 + p.xs5;
                                                } else {
                                                    c = p.xs0 + y + p.xs1;
                                                    /** @type {number} */
                                                    left = 1;
                                                    for (; left < p.l; left++) {
                                                        c += p["xn" + left] + p["xs" + (left + 1)];
                                                    }
                                                    p.t[p.p] = c;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (-1 === p.type) {
                                        p.t[p.p] = p.xs0;
                                    } else {
                                        if (p.setRatio) {
                                            p.setRatio(v);
                                        }
                                    }
                                }
                            } else {
                                p.t[p.p] = y + p.xs0;
                            }
                            p = p._next;
                        }
                    } else {
                        for (; p;) {
                            if (2 !== p.type) {
                                p.t[p.p] = p.b;
                            } else {
                                p.setRatio(v);
                            }
                            p = p._next;
                        }
                    }
                } else {
                    for (; p;) {
                        if (2 !== p.type) {
                            if (p.r && -1 !== p.type) {
                                if (y = Math.round(p.s + p.c), p.type) {
                                    if (1 === p.type) {
                                        left = p.l;
                                        c = p.xs0 + y + p.xs1;
                                        /** @type {number} */
                                        left = 1;
                                        for (; left < p.l; left++) {
                                            c += p["xn" + left] + p["xs" + (left + 1)];
                                        }
                                        p.t[p.p] = c;
                                    }
                                } else {
                                    p.t[p.p] = y + p.xs0;
                                }
                            } else {
                                p.t[p.p] = p.e;
                            }
                        } else {
                            p.setRatio(v);
                        }
                        p = p._next;
                    }
                }
            };
            /**
             * @param {boolean} recurring
             * @return {undefined}
             */
            p._enableTransforms = function (recurring) {
                this._transform = this._transform || merge(this._target, arg, true);
                /** @type {number} */
                this._transformType = this._transform.svg && object || !recurring && 3 !== this._transformType ? 2 : 3;
            };
            /**
             * @param {number} attr
             * @return {undefined}
             */
            var animation = function (attr) {
                this.t[this.p] = this.e;
                this.data._linkCSSP(this, this._next, null, true);
            };
            /**
             * @param {number} handler
             * @param {number} zIndex
             * @param {number} e
             * @return {undefined}
             */
            p._addLazySet = function (handler, zIndex, e) {
                var t = this._firstPT = new Parser(handler, zIndex, 0, 0, this._firstPT, 2);
                /** @type {number} */
                t.e = e;
                /** @type {function (number): undefined} */
                t.setRatio = animation;
                t.data = this;
            };
            /**
             * @param {?} pt
             * @param {Object} pt2
             * @param {Function} value
             * @param {boolean} dataAndEvents
             * @return {?}
             */
            p._linkCSSP = function (pt, pt2, value, dataAndEvents) {
                return pt && (pt2 && (pt2._prev = pt), pt._next && (pt._next._prev = pt._prev), pt._prev ? pt._prev._next = pt._next : this._firstPT === pt && (this._firstPT = pt._next, dataAndEvents = true), value ? value._next = pt : dataAndEvents || (null !== this._firstPT || (this._firstPT = pt)), pt._next = pt2, pt._prev = value), pt;
            };
            /**
             * @param {Object} vars
             * @return {?}
             */
            p._kill = function (vars) {
                var tween;
                var i;
                var pt;
                /** @type {Object} */
                var view = vars;
                if (vars.autoAlpha || vars.alpha) {
                    view = {};
                    for (i in vars) {
                        view[i] = vars[i];
                    }
                    /** @type {number} */
                    view.opacity = 1;
                    if (view.autoAlpha) {
                        /** @type {number} */
                        view.visibility = 1;
                    }
                }
                return vars.className && ((tween = this._classNamePT) && (pt = tween.xfirst, pt && pt._prev ? this._linkCSSP(pt._prev, tween._next, pt._prev._prev) : pt === this._firstPT && (this._firstPT = tween._next), tween._next && this._linkCSSP(tween._next, tween._next._next, pt._prev), this._classNamePT = null)), Sprite.prototype._kill.call(this, view);
            };
            /**
             * @param {Object} object
             * @param {Array} format
             * @param {Array} elems
             * @return {undefined}
             */
            var toString = function (object, format, elems) {
                var nodes;
                var i;
                var node;
                var type;
                if (object.slice) {
                    i = object.length;
                    for (; --i > -1;) {
                        toString(object[i], format, elems);
                    }
                } else {
                    nodes = object.childNodes;
                    i = nodes.length;
                    for (; --i > -1;) {
                        node = nodes[i];
                        type = node.type;
                        if (node.style) {
                            format.push(render(node));
                            if (elems) {
                                elems.push(node);
                            }
                        }
                        if (!(1 !== type && (9 !== type && 11 !== type))) {
                            if (!!node.childNodes.length) {
                                toString(node, format, elems);
                            }
                        }
                    }
                }
            };
            return self.cascadeTo = function (obj, duration, vars) {
                var i;
                var toVars;
                var key;
                var fromVars;
                var p = TweenLite.to(obj, duration, vars);
                /** @type {Array} */
                var listenArgs = [p];
                /** @type {Array} */
                var value = [];
                /** @type {Array} */
                var format = [];
                /** @type {Array} */
                var destElements = [];
                var $cookies = TweenLite._internals.reservedProps;
                obj = p._targets || p.target;
                toString(obj, value, destElements);
                p.render(duration, true, true);
                toString(obj, format);
                p.render(0, true, true);
                p._enabled(true);
                /** @type {number} */
                i = destElements.length;
                for (; --i > -1;) {
                    if (toVars = f(destElements[i], value[i], format[i]), toVars.firstMPT) {
                        toVars = toVars.difs;
                        for (key in vars) {
                            if ($cookies[key]) {
                                toVars[key] = vars[key];
                            }
                        }
                        fromVars = {};
                        for (key in toVars) {
                            fromVars[key] = value[i][key];
                        }
                        listenArgs.push(TweenLite.fromTo(destElements[i], duration, fromVars, toVars));
                    }
                }
                return listenArgs;
            }, Sprite.activate([self]), self;
        }, true);
        (function () {
            var origclass = _gsScope._gsDefine.plugin({
                propName: "roundProps",
                version: "1.5",
                priority: -1,
                API: 2,
                /**
                 * @param {?} allBindingsAccessor
                 * @param {?} depMaps
                 * @param {?} tween
                 * @return {?}
                 */
                init: function (allBindingsAccessor, depMaps, tween) {
                    return this._tween = tween, true;
                }
            });
            /**
             * @param {Object} s
             * @return {undefined}
             */
            var val = function (s) {
                for (; s;) {
                    if (!s.f) {
                        if (!s.blob) {
                            /** @type {number} */
                            s.r = 1;
                        }
                    }
                    s = s._next;
                }
            };
            var p = origclass.prototype;
            /**
             * @return {?}
             */
            p._onInitAllProps = function () {
                var prop;
                var pt;
                var next;
                var tween = this._tween;
                var props = tween.vars.roundProps.join ? tween.vars.roundProps : tween.vars.roundProps.split(",");
                var i = props.length;
                var pdataCur = {};
                var rpt = tween._propLookup.roundProps;
                for (; --i > -1;) {
                    /** @type {number} */
                    pdataCur[props[i]] = 1;
                }
                i = props.length;
                for (; --i > -1;) {
                    prop = props[i];
                    pt = tween._firstPT;
                    for (; pt;) {
                        next = pt._next;
                        if (pt.pg) {
                            pt.t._roundProps(pdataCur, true);
                        } else {
                            if (pt.n === prop) {
                                if (2 === pt.f && pt.t) {
                                    val(pt.t._firstPT);
                                } else {
                                    this._add(pt.t, prop, pt.s, pt.c);
                                    if (next) {
                                        next._prev = pt._prev;
                                    }
                                    if (pt._prev) {
                                        pt._prev._next = next;
                                    } else {
                                        if (tween._firstPT === pt) {
                                            tween._firstPT = next;
                                        }
                                    }
                                    /** @type {null} */
                                    pt._next = pt._prev = null;
                                    tween._propLookup[prop] = rpt;
                                }
                            }
                        }
                        pt = next;
                    }
                }
                return false;
            };
            /**
             * @param {Object} target
             * @param {string} p
             * @param {string} s
             * @param {string} c
             * @return {undefined}
             */
            p._add = function (target, p, s, c) {
                this._addTween(target, p, s, s + c, p, true);
                this._overwriteProps.push(p);
            };
        })();
        (function () {
            _gsScope._gsDefine.plugin({
                propName: "attr",
                API: 2,
                version: "0.5.0",
                /**
                 * @param {HTMLElement} target
                 * @param {Object} paths
                 * @param {?} allBindingsAccessor
                 * @return {?}
                 */
                init: function (target, paths, allBindingsAccessor) {
                    var p;
                    if ("function" != typeof target.setAttribute) {
                        return false;
                    }
                    for (p in paths) {
                        this._addTween(target, "setAttribute", target.getAttribute(p) + "", paths[p] + "", p, false, p);
                        this._overwriteProps.push(p);
                    }
                    return true;
                }
            });
        })();
        /** @type {boolean} */
        _gsScope._gsDefine.plugin({
            propName: "directionalRotation",
            version: "0.2.1",
            API: 2,
            /**
             * @param {Object} target
             * @param {Object} value
             * @param {?} allBindingsAccessor
             * @return {?}
             */
            init: function (target, value, allBindingsAccessor) {
                if ("object" != typeof value) {
                    value = {
                        rotation: value
                    };
                }
                this.finals = {};
                var p;
                var v;
                var start;
                var end;
                var dif;
                var parts;
                /** @type {number} */
                var cap = value.useRadians === true ? 2 * Math.PI : 360;
                /** @type {number} */
                var min = 1E-6;
                for (p in value) {
                    if ("useRadians" !== p) {
                        parts = (value[p] + "").split("_");
                        v = parts[0];
                        /** @type {number} */
                        start = parseFloat("function" != typeof target[p] ? target[p] : target[p.indexOf("set") || "function" != typeof target["get" + p.substr(3)] ? p : "get" + p.substr(3)]());
                        /** @type {number} */
                        end = this.finals[p] = "string" == typeof v && "=" === v.charAt(1) ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
                        /** @type {number} */
                        dif = end - start;
                        if (parts.length) {
                            v = parts.join("_");
                            if (-1 !== v.indexOf("short")) {
                                dif %= cap;
                                if (dif !== dif % (cap / 2)) {
                                    /** @type {number} */
                                    dif = 0 > dif ? dif + cap : dif - cap;
                                }
                            }
                            if (-1 !== v.indexOf("_cw") && 0 > dif) {
                                /** @type {number} */
                                dif = (dif + 9999999999 * cap) % cap - (dif / cap | 0) * cap;
                            } else {
                                if (-1 !== v.indexOf("ccw")) {
                                    if (dif > 0) {
                                        /** @type {number} */
                                        dif = (dif - 9999999999 * cap) % cap - (dif / cap | 0) * cap;
                                    }
                                }
                            }
                        }
                        if (dif > min || -min > dif) {
                            this._addTween(target, p, start, start + dif, p);
                            this._overwriteProps.push(p);
                        }
                    }
                }
                return true;
            },
            /**
             * @param {Object} v
             * @return {undefined}
             */
            set: function (v) {
                var pt;
                if (1 !== v) {
                    this._super.setRatio.call(this, v);
                } else {
                    pt = this._firstPT;
                    for (; pt;) {
                        if (pt.f) {
                            pt.t[pt.p](this.finals[pt.p]);
                        } else {
                            pt.t[pt.p] = this.finals[pt.p];
                        }
                        pt = pt._next;
                    }
                }
            }
        })._autoCSS = true;
        _gsScope._gsDefine("easing.Back", ["easing.Ease"], function (Ease) {
            var SteppedEase;
            var RoughEase;
            var _createElastic;
            var w = _gsScope.GreenSockGlobals || _gsScope;
            var gs = w.com.greensock;
            /** @type {number} */
            var _p2 = 2 * Math.PI;
            /** @type {number} */
            var HALF_PI = Math.PI / 2;
            var _class = gs._class;
            /**
             * @param {string} n
             * @param {Function} f
             * @return {?}
             */
            var _create = function (n, f) {
                var C = _class("easing." + n, function () {}, true);
                var p = C.prototype = new Ease;
                return p.constructor = C, p.getRatio = f, C;
            };
            var _easeReg = Ease.register || function () {};
            /**
             * @param {string} name
             * @param {?} EaseOut
             * @param {?} EaseIn
             * @param {?} EaseInOut
             * @param {?} s
             * @return {?}
             */
            var _wrap = function (name, EaseOut, EaseIn, EaseInOut, s) {
                var C = _class("easing." + name, {
                    easeOut: new EaseOut,
                    easeIn: new EaseIn,
                    easeInOut: new EaseInOut
                }, true);
                return _easeReg(C, name), C;
            };
            /**
             * @param {Object} time
             * @param {string} value
             * @param {Object} next
             * @return {undefined}
             */
            var EasePoint = function (time, value, next) {
                /** @type {Object} */
                this.t = time;
                /** @type {string} */
                this.v = value;
                if (next) {
                    /** @type {Object} */
                    this.next = next;
                    next.prev = this;
                    /** @type {number} */
                    this.c = next.v - value;
                    /** @type {number} */
                    this.gap = next.t - time;
                }
            };
            /**
             * @param {string} n
             * @param {Function} f
             * @return {?}
             */
            var _createBack = function (n, f) {
                var C = _class("easing." + n, function (overshoot) {
                    this._p1 = overshoot || 0 === overshoot ? overshoot : 1.70158;
                    /** @type {number} */
                    this._p2 = 1.525 * this._p1;
                }, true);
                var p = C.prototype = new Ease;
                return p.constructor = C, p.getRatio = f, p.config = function (cfg) {
                    return new C(cfg);
                }, C;
            };
            var Back = _wrap("Back", _createBack("BackOut", function (p) {
                return (p -= 1) * p * ((this._p1 + 1) * p + this._p1) + 1;
            }), _createBack("BackIn", function (p) {
                return p * p * ((this._p1 + 1) * p - this._p1);
            }), _createBack("BackInOut", function (p) {
                return (p *= 2) < 1 ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
            }));
            var SlowMo = _class("easing.SlowMo", function (linearRatio, power, yoyoMode) {
                power = power || 0 === power ? power : 0.7;
                if (null == linearRatio) {
                    /** @type {number} */
                    linearRatio = 0.7;
                } else {
                    if (linearRatio > 1) {
                        /** @type {number} */
                        linearRatio = 1;
                    }
                }
                this._p = 1 !== linearRatio ? power : 0;
                /** @type {number} */
                this._p1 = (1 - linearRatio) / 2;
                /** @type {number} */
                this._p2 = linearRatio;
                this._p3 = this._p1 + this._p2;
                /** @type {boolean} */
                this._calcEnd = yoyoMode === true;
            }, true);
            var p = SlowMo.prototype = new Ease;
            return p.constructor = SlowMo, p.getRatio = function (p) {
                var r = p + (0.5 - p) * this._p;
                return p < this._p1 ? this._calcEnd ? 1 - (p = 1 - p / this._p1) * p : r - (p = 1 - p / this._p1) * p * p * p * r : p > this._p3 ? this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + (p - r) * (p = (p - this._p3) / this._p1) * p * p * p : this._calcEnd ? 1 : r;
            }, SlowMo.ease = new SlowMo(0.7, 0.7), p.config = SlowMo.config = function (linearRatio, power, yoyoMode) {
                return new SlowMo(linearRatio, power, yoyoMode);
            }, SteppedEase = _class("easing.SteppedEase", function (steps) {
                steps = steps || 1;
                /** @type {number} */
                this._p1 = 1 / steps;
                this._p2 = steps + 1;
            }, true), p = SteppedEase.prototype = new Ease, p.constructor = SteppedEase, p.getRatio = function (recurring) {
                return 0 > recurring ? recurring = 0 : recurring >= 1 && (recurring = 0.999999999), (this._p2 * recurring >> 0) * this._p1;
            }, p.config = SteppedEase.config = function (steps) {
                return new SteppedEase(steps);
            }, RoughEase = _class("easing.RoughEase", function (vars) {
                vars = vars || {};
                var x;
                var y;
                var scale;
                var z;
                var obj;
                var pnt;
                var a = vars.taper || "none";
                /** @type {Array} */
                var res = [];
                /** @type {number} */
                var resLength = 0;
                /** @type {number} */
                var len = 0 | (vars.points || 20);
                /** @type {number} */
                var i = len;
                /** @type {boolean} */
                var randomize = vars.randomize !== false;
                /** @type {boolean} */
                var p = vars.clamp === true;
                var template = vars.template instanceof Ease ? vars.template : null;
                /** @type {number} */
                var diffCosAngle = "number" == typeof vars.strength ? 0.4 * vars.strength : 0.4;
                for (; --i > -1;) {
                    /** @type {number} */
                    x = randomize ? Math.random() : 1 / len * i;
                    y = template ? template.getRatio(x) : x;
                    if ("none" === a) {
                        /** @type {number} */
                        scale = diffCosAngle;
                    } else {
                        if ("out" === a) {
                            /** @type {number} */
                            z = 1 - x;
                            /** @type {number} */
                            scale = z * z * diffCosAngle;
                        } else {
                            if ("in" === a) {
                                /** @type {number} */
                                scale = x * x * diffCosAngle;
                            } else {
                                if (0.5 > x) {
                                    /** @type {number} */
                                    z = 2 * x;
                                    /** @type {number} */
                                    scale = z * z * 0.5 * diffCosAngle;
                                } else {
                                    /** @type {number} */
                                    z = 2 * (1 - x);
                                    /** @type {number} */
                                    scale = z * z * 0.5 * diffCosAngle;
                                }
                            }
                        }
                    }
                    if (randomize) {
                        y += Math.random() * scale - 0.5 * scale;
                    } else {
                        if (i % 2) {
                            y += 0.5 * scale;
                        } else {
                            y -= 0.5 * scale;
                        }
                    }
                    if (p) {
                        if (y > 1) {
                            /** @type {number} */
                            y = 1;
                        } else {
                            if (0 > y) {
                                /** @type {number} */
                                y = 0;
                            }
                        }
                    }
                    res[resLength++] = {
                        x: x,
                        y: y
                    };
                }
                res.sort(function (a, b) {
                    return a.x - b.x;
                });
                pnt = new EasePoint(1, 1, null);
                /** @type {number} */
                i = len;
                for (; --i > -1;) {
                    obj = res[i];
                    pnt = new EasePoint(obj.x, obj.y, pnt);
                }
                this._prev = new EasePoint(0, 0, 0 !== pnt.t ? pnt : pnt.next);
            }, true), p = RoughEase.prototype = new Ease, p.constructor = RoughEase, p.getRatio = function (p) {
                var pnt = this._prev;
                if (p > pnt.t) {
                    for (; pnt.next && p >= pnt.t;) {
                        pnt = pnt.next;
                    }
                    pnt = pnt.prev;
                } else {
                    for (; pnt.prev && p <= pnt.t;) {
                        pnt = pnt.prev;
                    }
                }
                return this._prev = pnt, pnt.v + (p - pnt.t) / pnt.gap * pnt.c;
            }, p.config = function (vars) {
                return new RoughEase(vars);
            }, RoughEase.ease = new RoughEase, _wrap("Bounce", _create("BounceOut", function (dataAndEvents) {
                return 1 / 2.75 > dataAndEvents ? 7.5625 * dataAndEvents * dataAndEvents : 2 / 2.75 > dataAndEvents ? 7.5625 * (dataAndEvents -= 1.5 / 2.75) * dataAndEvents + 0.75 : 2.5 / 2.75 > dataAndEvents ? 7.5625 * (dataAndEvents -= 2.25 / 2.75) * dataAndEvents + 0.9375 : 7.5625 * (dataAndEvents -= 2.625 / 2.75) * dataAndEvents + 0.984375;
            }), _create("BounceIn", function (ratio) {
                return (ratio = 1 - ratio) < 1 / 2.75 ? 1 - 7.5625 * ratio * ratio : 2 / 2.75 > ratio ? 1 - (7.5625 * (ratio -= 1.5 / 2.75) * ratio + 0.75) : 2.5 / 2.75 > ratio ? 1 - (7.5625 * (ratio -= 2.25 / 2.75) * ratio + 0.9375) : 1 - (7.5625 * (ratio -= 2.625 / 2.75) * ratio + 0.984375);
            }), _create("BounceInOut", function (value) {
                /** @type {boolean} */
                var ctrl = 0.5 > value;
                return value = ctrl ? 1 - 2 * value : 2 * value - 1, value = 1 / 2.75 > value ? 7.5625 * value * value : 2 / 2.75 > value ? 7.5625 * (value -= 1.5 / 2.75) * value + 0.75 : 2.5 / 2.75 > value ? 7.5625 * (value -= 2.25 / 2.75) * value + 0.9375 : 7.5625 * (value -= 2.625 / 2.75) * value + 0.984375, ctrl ? 0.5 * (1 - value) : 0.5 * value + 0.5;
            })), _wrap("Circ", _create("CircOut", function (dataAndEvents) {
                return Math.sqrt(1 - (dataAndEvents -= 1) * dataAndEvents);
            }), _create("CircIn", function (m3) {
                return -(Math.sqrt(1 - m3 * m3) - 1);
            }), _create("CircInOut", function (durationFraction) {
                return (durationFraction *= 2) < 1 ? -0.5 * (Math.sqrt(1 - durationFraction * durationFraction) - 1) : 0.5 * (Math.sqrt(1 - (durationFraction -= 2) * durationFraction) + 1);
            })), _createElastic = function (n, f, opt_attributes) {
                var C = _class("easing." + n, function (value, dataAndEvents) {
                    this._p1 = value >= 1 ? value : 1;
                    /** @type {number} */
                    this._p2 = (dataAndEvents || opt_attributes) / (1 > value ? value : 1);
                    /** @type {number} */
                    this._p3 = this._p2 / _p2 * (Math.asin(1 / this._p1) || 0);
                    /** @type {number} */
                    this._p2 = _p2 / this._p2;
                }, true);
                var p = C.prototype = new Ease;
                return p.constructor = C, p.getRatio = f, p.config = function (cfg, opt) {
                    return new C(cfg, opt);
                }, C;
            }, _wrap("Elastic", _createElastic("ElasticOut", function (p) {
                return this._p1 * Math.pow(2, -10 * p) * Math.sin((p - this._p3) * this._p2) + 1;
            }, 0.3), _createElastic("ElasticIn", function (dataAndEvents) {
                return -(this._p1 * Math.pow(2, 10 * (dataAndEvents -= 1)) * Math.sin((dataAndEvents - this._p3) * this._p2));
            }, 0.3), _createElastic("ElasticInOut", function (dataAndEvents) {
                return (dataAndEvents *= 2) < 1 ? -0.5 * (this._p1 * Math.pow(2, 10 * (dataAndEvents -= 1)) * Math.sin((dataAndEvents - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (dataAndEvents -= 1)) * Math.sin((dataAndEvents - this._p3) * this._p2) * 0.5 + 1;
            }, 0.45)), _wrap("Expo", _create("ExpoOut", function (k) {
                return 1 - Math.pow(2, -10 * k);
            }), _create("ExpoIn", function (dataAndEvents) {
                return Math.pow(2, 10 * (dataAndEvents - 1)) - 0.001;
            }), _create("ExpoInOut", function (dataAndEvents) {
                return (dataAndEvents *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (dataAndEvents - 1)) : 0.5 * (2 - Math.pow(2, -10 * (dataAndEvents - 1)));
            })), _wrap("Sine", _create("SineOut", function (t) {
                return Math.sin(t * HALF_PI);
            }), _create("SineIn", function (t) {
                return -Math.cos(t * HALF_PI) + 1;
            }), _create("SineInOut", function (p) {
                return -0.5 * (Math.cos(Math.PI * p) - 1);
            })), _class("easing.EaseLookup", {
                /**
                 * @param {?} s
                 * @return {?}
                 */
                find: function (s) {
                    return Ease.map[s];
                }
            }, true), _easeReg(w.SlowMo, "SlowMo", "ease,"), _easeReg(RoughEase, "RoughEase", "ease,"), _easeReg(SteppedEase, "SteppedEase", "ease,"), Back;
        }, true);
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function (win, _undefined_) {
        var _globals = win.GreenSockGlobals = win.GreenSockGlobals || win;
        if (!_globals.TweenLite) {
            var a;
            var i;
            var p;
            var _ticker;
            var h;
            /**
             * @param {string} ns
             * @return {?}
             */
            var _namespace = function (ns) {
                var i;
                var codeSegments = ns.split(".");
                var p = _globals;
                /** @type {number} */
                i = 0;
                for (; i < codeSegments.length; i++) {
                    p[codeSegments[i]] = p = p[codeSegments[i]] || {};
                }
                return p;
            };
            var gs = _namespace("com.greensock");
            /** @type {number} */
            var _tinyNum = 1E-10;
            /**
             * @param {string} target
             * @return {?}
             */
            var toArray = function (target) {
                var i;
                /** @type {Array} */
                var ret = [];
                var len = target.length;
                /** @type {number} */
                i = 0;
                for (; i !== len; ret.push(target[i++])) {}
                return ret;
            };
            /**
             * @return {undefined}
             */
            var action = function () {};
            var _isArray = function () {
                /** @type {function (this:*): string} */
                var toStr = Object.prototype.toString;
                /** @type {string} */
                var object = toStr.call([]);
                return function (arg) {
                    return null != arg && (arg instanceof Array || "object" == typeof arg && (!!arg.push && toStr.call(arg) === object));
                };
            }();
            var _defLookup = {};
            /**
             * @param {string} ns
             * @param {Arguments} dependencies
             * @param {Function} func
             * @param {?} global
             * @return {undefined}
             */
            var Definition = function (ns, dependencies, func, global) {
                this.sc = _defLookup[ns] ? _defLookup[ns].sc : [];
                _defLookup[ns] = this;
                /** @type {null} */
                this.gsClass = null;
                /** @type {Function} */
                this.func = func;
                /** @type {Array} */
                var _classes = [];
                /**
                 * @param {boolean} dataAndEvents
                 * @return {undefined}
                 */
                this.check = function (dataAndEvents) {
                    var cur;
                    var namespaces;
                    var n;
                    var cl;
                    var q;
                    var i = dependencies.length;
                    var j = i;
                    for (; --i > -1;) {
                        if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
                            _classes[i] = cur.gsClass;
                            j--;
                        } else {
                            if (dataAndEvents) {
                                cur.sc.push(this);
                            }
                        }
                    }
                    if (0 === j && func) {
                        /** @type {Array.<string>} */
                        namespaces = ("com.greensock." + ns).split(".");
                        /** @type {string} */
                        n = namespaces.pop();
                        cl = _namespace(namespaces.join("."))[n] = this.gsClass = func.apply(func, _classes);
                        if (global) {
                            _globals[n] = cl;
                            q = "undefined" != typeof module && module.exports;
                            if (!q && ("function" == typeof define && define.amd)) {
                                define((win.GreenSockAMDPath ? win.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function () {
                                    return cl;
                                });
                            } else {
                                if (ns === _undefined_) {
                                    if (q) {
                                        module.exports = cl;
                                    }
                                }
                            }
                        }
                        /** @type {number} */
                        i = 0;
                        for (; i < this.sc.length; i++) {
                            this.sc[i].check();
                        }
                    }
                };
                this.check(true);
            };
            /** @type {function (string, Array, Function, boolean): ?} */
            var _gsDefine = win._gsDefine = function (ns, opt_attributes, func, deepDataAndEvents) {
                return new Definition(ns, opt_attributes, func, deepDataAndEvents);
            };
            /** @type {function (string, Function, boolean): ?} */
            var _class = gs._class = function (ns, func, deepDataAndEvents) {
                return func = func || function () {}, _gsDefine(ns, [], function () {
                    return func;
                }, deepDataAndEvents), func;
            };
            _gsDefine.globals = _globals;
            /** @type {Array} */
            var _baseParams = [0, 0, 1, 1];
            /** @type {Array} */
            var noArgs = [];
            var Ease = _class("easing.Ease", function (func, extraParams, dataAndEvents, power) {
                /** @type {Function} */
                this._func = func;
                this._type = dataAndEvents || 0;
                this._power = power || 0;
                /** @type {Array} */
                this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
            }, true);
            var _easeMap = Ease.map = {};
            /** @type {function (Element, string, string, boolean): undefined} */
            var _easeReg = Ease.register = function (ease, names, types, create) {
                var e;
                var name;
                var j;
                var type;
                var tokenized = names.split(",");
                var index = tokenized.length;
                var events = (types || "easeIn,easeOut,easeInOut").split(",");
                for (; --index > -1;) {
                    name = tokenized[index];
                    e = create ? _class("easing." + name, null, true) : gs.easing[name] || {};
                    j = events.length;
                    for (; --j > -1;) {
                        type = events[j];
                        _easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease;
                    }
                }
            };
            p = Ease.prototype;
            /** @type {boolean} */
            p._calcEnd = false;
            /**
             * @param {number} recurring
             * @return {?}
             */
            p.getRatio = function (recurring) {
                if (this._func) {
                    return this._params[0] = recurring, this._func.apply(null, this._params);
                }
                var x = this._type;
                var pw = this._power;
                var r = 1 === x ? 1 - recurring : 2 === x ? recurring : 0.5 > recurring ? 2 * recurring : 2 * (1 - recurring);
                return 1 === pw ? r *= r : 2 === pw ? r *= r * r : 3 === pw ? r *= r * r * r : 4 === pw && (r *= r * r * r * r), 1 === x ? 1 - r : 2 === x ? r : 0.5 > recurring ? r / 2 : 1 - r / 2;
            };
            /** @type {Array} */
            a = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"];
            /** @type {number} */
            i = a.length;
            for (; --i > -1;) {
                p = a[i] + ",Power" + i;
                _easeReg(new Ease(null, null, 1, i), p, "easeOut", true);
                _easeReg(new Ease(null, null, 2, i), p, "easeIn" + (0 === i ? ",easeNone" : ""));
                _easeReg(new Ease(null, null, 3, i), p, "easeInOut");
            }
            _easeMap.linear = gs.easing.Linear.easeIn;
            _easeMap.swing = gs.easing.Quad.easeInOut;
            var EventDispatcher = _class("events.EventDispatcher", function (dataAndEvents) {
                this._listeners = {};
                this._eventTarget = dataAndEvents || this;
            });
            p = EventDispatcher.prototype;
            /**
             * @param {string} type
             * @param {boolean} callback
             * @param {number} scope
             * @param {?} useParam
             * @param {number} priority
             * @return {undefined}
             */
            p.addEventListener = function (type, callback, scope, useParam, priority) {
                priority = priority || 0;
                var listener;
                var i;
                var list = this._listeners[type];
                /** @type {number} */
                var pos = 0;
                if (null == list) {
                    /** @type {Array} */
                    this._listeners[type] = list = [];
                }
                i = list.length;
                for (; --i > -1;) {
                    listener = list[i];
                    if (listener.c === callback && listener.s === scope) {
                        list.splice(i, 1);
                    } else {
                        if (0 === pos) {
                            if (listener.pr < priority) {
                                pos = i + 1;
                            }
                        }
                    }
                }
                list.splice(pos, 0, {
                    c: callback,
                    s: scope,
                    up: useParam,
                    pr: priority
                });
                if (!(this !== _ticker)) {
                    if (!h) {
                        _ticker.wake();
                    }
                }
            };
            /**
             * @param {?} eventType
             * @param {?} callback
             * @return {?}
             */
            p.removeEventListener = function (eventType, callback) {
                var i;
                var list = this._listeners[eventType];
                if (list) {
                    i = list.length;
                    for (; --i > -1;) {
                        if (list[i].c === callback) {
                            return void list.splice(i, 1);
                        }
                    }
                }
            };
            /**
             * @param {number} eventName
             * @return {undefined}
             */
            p.dispatchEvent = function (eventName) {
                var i;
                var t;
                var listener;
                var listeners = this._listeners[eventName];
                if (listeners) {
                    i = listeners.length;
                    t = this._eventTarget;
                    for (; --i > -1;) {
                        listener = listeners[i];
                        if (listener) {
                            if (listener.up) {
                                listener.c.call(listener.s || t, {
                                    type: eventName,
                                    target: t
                                });
                            } else {
                                listener.c.call(listener.s || t);
                            }
                        }
                    }
                }
            };
            var raf = win.requestAnimationFrame;
            var _cancelAnimFrame = win.cancelAnimationFrame;
            /** @type {function (): number} */
            var parseInt = Date.now || function () {
                return (new Date).getTime();
            };
            /** @type {number} */
            var t = parseInt();
            /** @type {Array} */
            a = ["ms", "moz", "webkit", "o"];
            /** @type {number} */
            i = a.length;
            for (; --i > -1 && !raf;) {
                raf = win[a[i] + "RequestAnimationFrame"];
                _cancelAnimFrame = win[a[i] + "CancelAnimationFrame"] || win[a[i] + "CancelRequestAnimationFrame"];
            }
            _class("Ticker", function (result, dataAndEvents) {
                var list;
                var fn;
                var pdataOld;
                var _gap;
                var _nextTime;
                var _self = this;
                /** @type {number} */
                var n = parseInt();
                /** @type {(boolean|string)} */
                var array = dataAndEvents !== false && raf ? "auto" : false;
                /** @type {number} */
                var height = 500;
                /** @type {number} */
                var y = 33;
                /** @type {string} */
                var ev = "tick";
                /**
                 * @param {boolean} expectedNumberOfNonCommentArgs
                 * @return {undefined}
                 */
                var run = function (expectedNumberOfNonCommentArgs) {
                    var overlap;
                    var g;
                    /** @type {number} */
                    var h = parseInt() - t;
                    if (h > height) {
                        n += h - y;
                    }
                    t += h;
                    /** @type {number} */
                    _self.time = (t - n) / 1E3;
                    /** @type {number} */
                    overlap = _self.time - _nextTime;
                    if (!list || (overlap > 0 || expectedNumberOfNonCommentArgs === true)) {
                        _self.frame++;
                        _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
                        /** @type {boolean} */
                        g = true;
                    }
                    if (expectedNumberOfNonCommentArgs !== true) {
                        pdataOld = fn(run);
                    }
                    if (g) {
                        _self.dispatchEvent(ev);
                    }
                };
                EventDispatcher.call(_self);
                /** @type {number} */
                _self.time = _self.frame = 0;
                /**
                 * @return {undefined}
                 */
                _self.tick = function () {
                    run(true);
                };
                /**
                 * @param {number} dataAndEvents
                 * @param {?} time
                 * @return {undefined}
                 */
                _self.lagSmoothing = function (dataAndEvents, time) {
                    height = dataAndEvents || 1 / _tinyNum;
                    /** @type {number} */
                    y = Math.min(time, height, 0);
                };
                /**
                 * @return {undefined}
                 */
                _self.sleep = function () {
                    if (null != pdataOld) {
                        if (array && _cancelAnimFrame) {
                            _cancelAnimFrame(pdataOld);
                        } else {
                            clearTimeout(pdataOld);
                        }
                        /** @type {function (): undefined} */
                        fn = action;
                        /** @type {null} */
                        pdataOld = null;
                        if (_self === _ticker) {
                            /** @type {boolean} */
                            h = false;
                        }
                    }
                };
                /**
                 * @param {?} data
                 * @return {undefined}
                 */
                _self.wake = function (data) {
                    if (null !== pdataOld) {
                        _self.sleep();
                    } else {
                        if (data) {
                            n += -t + (t = parseInt());
                        } else {
                            if (_self.frame > 10) {
                                /** @type {number} */
                                t = parseInt() - height + 5;
                            }
                        }
                    }
                    fn = 0 === list ? action : array && raf ? raf : function (value) {
                        return setTimeout(value, 1E3 * (_nextTime - _self.time) + 1 | 0);
                    };
                    if (_self === _ticker) {
                        /** @type {boolean} */
                        h = true;
                    }
                    run(2);
                };
                /**
                 * @param {number} items
                 * @return {?}
                 */
                _self.fps = function (items) {
                    return arguments.length ? (list = items, _gap = 1 / (list || 60), _nextTime = this.time + _gap, void _self.wake()) : list;
                };
                /**
                 * @param {(boolean|string)} value
                 * @return {?}
                 */
                _self.useRAF = function (value) {
                    return arguments.length ? (_self.sleep(), array = value, void _self.fps(list)) : array;
                };
                _self.fps(result);
                setTimeout(function () {
                    if ("auto" === array) {
                        if (_self.frame < 5) {
                            if ("hidden" !== document.visibilityState) {
                                _self.useRAF(false);
                            }
                        }
                    }
                }, 1500);
            });
            p = gs.Ticker.prototype = new gs.events.EventDispatcher;
            p.constructor = gs.Ticker;
            var Animation = _class("core.Animation", function (dataAndEvents, vars) {
                if (this.vars = vars = vars || {}, this._duration = this._totalDuration = dataAndEvents || 0, this._delay = Number(vars.delay) || 0, this._timeScale = 1, this._active = vars.immediateRender === true, this.data = vars.data, this._reversed = vars.reversed === true, _rootTimeline) {
                    if (!h) {
                        _ticker.wake();
                    }
                    var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
                    tl.add(this, tl._time);
                    if (this.vars.paused) {
                        this.paused(true);
                    }
                }
            });
            _ticker = Animation.ticker = new gs.Ticker;
            p = Animation.prototype;
            /** @type {boolean} */
            p._dirty = p._gc = p._initted = p._paused = false;
            /** @type {number} */
            p._totalTime = p._time = 0;
            /** @type {number} */
            p._rawPrevTime = -1;
            /** @type {null} */
            p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
            /** @type {boolean} */
            p._paused = false;
            /**
             * @return {undefined}
             */
            var process = function () {
                if (h) {
                    if (parseInt() - t > 2E3) {
                        _ticker.wake();
                    }
                }
                setTimeout(process, 2E3);
            };
            process();
            /**
             * @param {string} position
             * @param {boolean} suppressEvents
             * @return {?}
             */
            p.play = function (position, suppressEvents) {
                return null != position && this.seek(position, suppressEvents), this.reversed(false).paused(false);
            };
            /**
             * @param {string} position
             * @param {boolean} suppressEvents
             * @return {?}
             */
            p.pause = function (position, suppressEvents) {
                return null != position && this.seek(position, suppressEvents), this.paused(true);
            };
            /**
             * @param {string} position
             * @param {boolean} suppressEvents
             * @return {?}
             */
            p.resume = function (position, suppressEvents) {
                return null != position && this.seek(position, suppressEvents), this.paused(false);
            };
            /**
             * @param {string} position
             * @param {boolean} suppressEvents
             * @return {?}
             */
            p.seek = function (position, suppressEvents) {
                return this.totalTime(Number(position), suppressEvents !== false);
            };
            /**
             * @param {boolean} includeDelay
             * @param {boolean} suppressEvents
             * @return {?}
             */
            p.restart = function (includeDelay, suppressEvents) {
                return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, suppressEvents !== false, true);
            };
            /**
             * @param {string} from
             * @param {boolean} suppressEvents
             * @return {?}
             */
            p.reverse = function (from, suppressEvents) {
                return null != from && this.seek(from || this.totalDuration(), suppressEvents), this.reversed(true).paused(false);
            };
            /**
             * @param {number} time
             * @param {boolean} recurring
             * @param {boolean} opt_isDefault
             * @return {undefined}
             */
            p.render = function (time, recurring, opt_isDefault) {};
            /**
             * @return {?}
             */
            p.invalidate = function () {
                return this._time = this._totalTime = 0, this._initted = this._gc = false, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(true), this;
            };
            /**
             * @return {?}
             */
            p.isActive = function () {
                var rawTime;
                var tl = this._timeline;
                var startTime = this._startTime;
                return !tl || !this._gc && (!this._paused && (tl.isActive() && ((rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale)));
            };
            /**
             * @param {boolean} recurring
             * @param {boolean} mayParseLabeledStatementInstead
             * @return {?}
             */
            p._enabled = function (recurring, mayParseLabeledStatementInstead) {
                return h || _ticker.wake(), this._gc = !recurring, this._active = this.isActive(), mayParseLabeledStatementInstead !== true && (recurring && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !recurring && (this.timeline && this._timeline._remove(this, true))), false;
            };
            /**
             * @param {Object} vars
             * @param {?} thisObj
             * @return {?}
             */
            p._kill = function (vars, thisObj) {
                return this._enabled(false, false);
            };
            /**
             * @param {Object} vars
             * @param {?} target
             * @return {?}
             */
            p.kill = function (vars, target) {
                return this._kill(vars, target), this;
            };
            /**
             * @param {boolean} recurring
             * @return {?}
             */
            p._uncache = function (recurring) {
                var tween = recurring ? this : this.timeline;
                for (; tween;) {
                    /** @type {boolean} */
                    tween._dirty = true;
                    tween = tween.timeline;
                }
                return this;
            };
            /**
             * @param {Arguments} params
             * @return {?}
             */
            p._swapSelfInParams = function (params) {
                var i = params.length;
                var copy = params.concat();
                for (; --i > -1;) {
                    if ("{self}" === params[i]) {
                        copy[i] = this;
                    }
                }
                return copy;
            };
            /**
             * @param {string} callback
             * @return {undefined}
             */
            p._callback = function (callback) {
                var v = this.vars;
                v[callback].apply(v[callback + "Scope"] || (v.callbackScope || this), v[callback + "Params"] || noArgs);
            };
            /**
             * @param {string} type
             * @param {boolean} callback
             * @param {Array} params
             * @param {?} scope
             * @return {?}
             */
            p.eventCallback = function (type, callback, params, scope) {
                if ("on" === (type || "").substr(0, 2)) {
                    var v = this.vars;
                    if (1 === arguments.length) {
                        return v[type];
                    }
                    if (null == callback) {
                        delete v[type];
                    } else {
                        /** @type {boolean} */
                        v[type] = callback;
                        v[type + "Params"] = _isArray(params) && -1 !== params.join("").indexOf("{self}") ? this._swapSelfInParams(params) : params;
                        v[type + "Scope"] = scope;
                    }
                    if ("onUpdate" === type) {
                        /** @type {boolean} */
                        this._onUpdate = callback;
                    }
                }
                return this;
            };
            /**
             * @param {number} value
             * @return {?}
             */
            p.delay = function (value) {
                return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + value - this._delay), this._delay = value, this) : this._delay;
            };
            /**
             * @param {number} value
             * @return {?}
             */
            p.duration = function (value) {
                return arguments.length ? (this._duration = this._totalDuration = value, this._uncache(true), this._timeline.smoothChildTiming && (this._time > 0 && (this._time < this._duration && (0 !== value && this.totalTime(this._totalTime * (value / this._duration), true)))), this) : (this._dirty = false, this._duration);
            };
            /**
             * @param {number} value
             * @return {?}
             */
            p.totalDuration = function (value) {
                return this._dirty = false, arguments.length ? this.duration(value) : this._totalDuration;
            };
            /**
             * @param {?} value
             * @param {boolean} node
             * @return {?}
             */
            p.time = function (value, node) {
                return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(value > this._duration ? this._duration : value, node)) : this._time;
            };
            /**
             * @param {number} time
             * @param {boolean} recurring
             * @param {boolean} dataAndEvents
             * @return {?}
             */
            p.totalTime = function (time, recurring, dataAndEvents) {
                if (h || _ticker.wake(), !arguments.length) {
                    return this._totalTime;
                }
                if (this._timeline) {
                    if (0 > time && (!dataAndEvents && (time += this.totalDuration())), this._timeline.smoothChildTiming) {
                        if (this._dirty) {
                            this.totalDuration();
                        }
                        var totalDuration = this._totalDuration;
                        var tl = this._timeline;
                        if (time > totalDuration && (!dataAndEvents && (time = totalDuration)), this._startTime = (this._paused ? this._pauseTime : tl._time) - (this._reversed ? totalDuration - time : time) / this._timeScale, tl._dirty || this._uncache(false), tl._timeline) {
                            for (; tl._timeline;) {
                                if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
                                    tl.totalTime(tl._totalTime, true);
                                }
                                tl = tl._timeline;
                            }
                        }
                    }
                    if (this._gc) {
                        this._enabled(true, false);
                    }
                    if (this._totalTime !== time || 0 === this._duration) {
                        if (tags.length) {
                            after();
                        }
                        this.render(time, recurring, false);
                        if (tags.length) {
                            after();
                        }
                    }
                }
                return this;
            };
            /** @type {function (?, boolean): ?} */
            p.progress = p.totalProgress = function (value, dataAndEvents) {
                var duration = this.duration();
                return arguments.length ? this.totalTime(duration * value, dataAndEvents) : duration ? this._time / duration : this.ratio;
            };
            /**
             * @param {number} value
             * @return {?}
             */
            p.startTime = function (value) {
                return arguments.length ? (value !== this._startTime && (this._startTime = value, this.timeline && (this.timeline._sortChildren && this.timeline.add(this, value - this._delay))), this) : this._startTime;
            };
            /**
             * @param {number} dataAndEvents
             * @return {?}
             */
            p.endTime = function (dataAndEvents) {
                return this._startTime + (0 != dataAndEvents ? this.totalDuration() : this.duration()) / this._timeScale;
            };
            /**
             * @param {number} value
             * @return {?}
             */
            p.timeScale = function (value) {
                if (!arguments.length) {
                    return this._timeScale;
                }
                if (value = value || _tinyNum, this._timeline && this._timeline.smoothChildTiming) {
                    var pauseTime = this._pauseTime;
                    var t = pauseTime || 0 === pauseTime ? pauseTime : this._timeline.totalTime();
                    /** @type {number} */
                    this._startTime = t - (t - this._startTime) * this._timeScale / value;
                }
                return this._timeScale = value, this._uncache(false);
            };
            /**
             * @param {string} recurring
             * @return {?}
             */
            p.reversed = function (recurring) {
                return arguments.length ? (recurring != this._reversed && (this._reversed = recurring, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, true)), this) : this._reversed;
            };
            /**
             * @param {boolean} recurring
             * @return {?}
             */
            p.paused = function (recurring) {
                if (!arguments.length) {
                    return this._paused;
                }
                var time;
                var ms;
                var tl = this._timeline;
                return recurring != this._paused && (tl && (h || (recurring || _ticker.wake()), time = tl.rawTime(), ms = time - this._pauseTime, !recurring && (tl.smoothChildTiming && (this._startTime += ms, this._uncache(false))), this._pauseTime = recurring ? time : null, this._paused = recurring, this._active = this.isActive(), !recurring && (0 !== ms && (this._initted && (this.duration() && (time = tl.smoothChildTiming ? this._totalTime : (time - this._startTime) / this._timeScale, this.render(time, time ===
                    this._totalTime, true))))))), this._gc && (!recurring && this._enabled(true, false)), this;
            };
            var SimpleTimeline = _class("core.SimpleTimeline", function (callback) {
                Animation.call(this, 0, callback);
                /** @type {boolean} */
                this.autoRemoveChildren = this.smoothChildTiming = true;
            });
            p = SimpleTimeline.prototype = new Animation;
            p.constructor = SimpleTimeline;
            /** @type {boolean} */
            p.kill()._gc = false;
            /** @type {null} */
            p._first = p._last = p._recent = null;
            /** @type {boolean} */
            p._sortChildren = false;
            /** @type {function (?, number, ?, ?): ?} */
            p.add = p.insert = function (child, position, arr, rest_items) {
                var prevTween;
                var st;
                if (child._startTime = Number(position || 0) + child._delay, child._paused && (this !== child._timeline && (child._pauseTime = child._startTime + (this.rawTime() - child._startTime) / child._timeScale)), child.timeline && child.timeline._remove(child, true), child.timeline = child._timeline = this, child._gc && child._enabled(true, true), prevTween = this._last, this._sortChildren) {
                    st = child._startTime;
                    for (; prevTween && prevTween._startTime > st;) {
                        prevTween = prevTween._prev;
                    }
                }
                return prevTween ? (child._next = prevTween._next, prevTween._next = child) : (child._next = this._first, this._first = child), child._next ? child._next._prev = child : this._last = child, child._prev = prevTween, this._recent = child, this._timeline && this._uncache(true), this;
            };
            /**
             * @param {?} tween
             * @param {boolean} recurring
             * @return {?}
             */
            p._remove = function (tween, recurring) {
                return tween.timeline === this && (recurring || tween._enabled(false, true), tween._prev ? tween._prev._next = tween._next : this._first === tween && (this._first = tween._next), tween._next ? tween._next._prev = tween._prev : this._last === tween && (this._last = tween._prev), tween._next = tween._prev = tween.timeline = null, tween === this._recent && (this._recent = this._last), this._timeline && this._uncache(true)), this;
            };
            /**
             * @param {number} time
             * @param {boolean} recurring
             * @param {boolean} opt_isDefault
             * @return {undefined}
             */
            p.render = function (time, recurring, opt_isDefault) {
                var next;
                var tween = this._first;
                this._totalTime = this._time = this._rawPrevTime = time;
                for (; tween;) {
                    next = tween._next;
                    if (tween._active || time >= tween._startTime && !tween._paused) {
                        if (tween._reversed) {
                            tween.render((tween._dirty ? tween.totalDuration() : tween._totalDuration) - (time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                        } else {
                            tween.render((time - tween._startTime) * tween._timeScale, recurring, opt_isDefault);
                        }
                    }
                    tween = next;
                }
            };
            /**
             * @return {?}
             */
            p.rawTime = function () {
                return h || _ticker.wake(), this._totalTime;
            };
            var TweenLite = _class("TweenLite", function (target, props, callback) {
                if (Animation.call(this, props, callback), this.render = TweenLite.prototype.render, null == target) {
                    throw "Cannot tween a null target.";
                }
                this.target = target = "string" != typeof target ? target : TweenLite.selector(target) || target;
                var i;
                var targ;
                var targets;
                var number = target.jquery || target.length && (target !== win && (target[0] && (target[0] === win || target[0].nodeType && (target[0].style && !target.nodeType))));
                var overwrite = this.vars.overwrite;
                if (this._overwrite = overwrite = null == overwrite ? _overwriteLookup[TweenLite.defaultOverwrite] : "number" == typeof overwrite ? overwrite >> 0 : _overwriteLookup[overwrite], (number || (target instanceof Array || target.push && _isArray(target))) && "number" != typeof target[0]) {
                    this._targets = targets = toArray(target);
                    /** @type {Array} */
                    this._propLookup = [];
                    /** @type {Array} */
                    this._siblings = [];
                    /** @type {number} */
                    i = 0;
                    for (; i < targets.length; i++) {
                        targ = targets[i];
                        if (targ) {
                            if ("string" != typeof targ) {
                                if (targ.length && (targ !== win && (targ[0] && (targ[0] === win || targ[0].nodeType && (targ[0].style && !targ.nodeType))))) {
                                    targets.splice(i--, 1);
                                    this._targets = targets = targets.concat(toArray(targ));
                                } else {
                                    this._siblings[i] = _register(targ, this, false);
                                    if (1 === overwrite) {
                                        if (this._siblings[i].length > 1) {
                                            _applyOverwrite(targ, this, null, 1, this._siblings[i]);
                                        }
                                    }
                                }
                            } else {
                                targ = targets[i--] = TweenLite.selector(targ);
                                if ("string" == typeof targ) {
                                    targets.splice(i + 1, 1);
                                }
                            }
                        } else {
                            targets.splice(i--, 1);
                        }
                    }
                } else {
                    this._propLookup = {};
                    this._siblings = _register(target, this, false);
                    if (1 === overwrite) {
                        if (this._siblings.length > 1) {
                            _applyOverwrite(target, this, null, 1, this._siblings);
                        }
                    }
                }
                if (this.vars.immediateRender || 0 === props && (0 === this._delay && this.vars.immediateRender !== false)) {
                    /** @type {number} */
                    this._time = -_tinyNum;
                    this.render(Math.min(0, -this._delay));
                }
            }, true);
            /**
             * @param {Array} v
             * @return {?}
             */
            var _isSelector = function (v) {
                return v && (v.length && (v !== win && (v[0] && (v[0] === win || v[0].nodeType && (v[0].style && !v.nodeType)))));
            };
            /**
             * @param {Object} c
             * @param {Function} target
             * @return {undefined}
             */
            var _autoCSS = function (c, target) {
                var p;
                var data = {};
                for (p in c) {
                    if (!paramNames[p]) {
                        if (!(p in target && ("transform" !== p && ("x" !== p && ("y" !== p && ("width" !== p && ("height" !== p && ("className" !== p && "border" !== p)))))))) {
                            if (!!(!_plugins[p] || _plugins[p] && _plugins[p]._autoCSS)) {
                                data[p] = c[p];
                                delete c[p];
                            }
                        }
                    }
                }
                c.css = data;
            };
            p = TweenLite.prototype = new Animation;
            p.constructor = TweenLite;
            /** @type {boolean} */
            p.kill()._gc = false;
            /** @type {number} */
            p.ratio = 0;
            /** @type {null} */
            p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
            /** @type {boolean} */
            p._notifyPluginsOfEnabled = p._lazy = false;
            /** @type {string} */
            TweenLite.version = "1.18.4";
            TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
            /** @type {string} */
            TweenLite.defaultOverwrite = "auto";
            TweenLite.ticker = _ticker;
            /** @type {number} */
            TweenLite.autoSleep = 120;
            /**
             * @param {number} dataAndEvents
             * @param {?} deepDataAndEvents
             * @return {undefined}
             */
            TweenLite.lagSmoothing = function (dataAndEvents, deepDataAndEvents) {
                _ticker.lagSmoothing(dataAndEvents, deepDataAndEvents);
            };
            TweenLite.selector = win.$ || (win.jQuery || function (e) {
                var selector = win.$ || win.jQuery;
                return selector ? (TweenLite.selector = selector, selector(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e);
            });
            /** @type {Array} */
            var tags = [];
            var params = {};
            /** @type {RegExp} */
            var core_rnotwhite = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi;
            /**
             * @param {number} v
             * @return {undefined}
             */
            var next = function (v) {
                var b;
                var pt = this._firstPT;
                /** @type {number} */
                var a = 1E-6;
                for (; pt;) {
                    b = pt.blob ? v ? this.join("") : this.start : pt.c * v + pt.s;
                    if (pt.r) {
                        /** @type {number} */
                        b = Math.round(b);
                    } else {
                        if (a > b) {
                            if (b > -a) {
                                /** @type {number} */
                                b = 0;
                            }
                        }
                    }
                    if (pt.f) {
                        if (pt.fp) {
                            pt.t[pt.p](pt.fp, b);
                        } else {
                            pt.t[pt.p](b);
                        }
                    } else {
                        pt.t[pt.p] = b;
                    }
                    pt = pt._next;
                }
            };
            /**
             * @param {number} value
             * @param {string} str
             * @param {?} dom
             * @param {?} item
             * @return {?}
             */
            var parse = function (value, str, dom, item) {
                var a;
                var _ref;
                var pdataOld;
                var j;
                var _len;
                var result;
                var t;
                /** @type {Array} */
                var p = [value, str];
                /** @type {number} */
                var pos = 0;
                /** @type {string} */
                var comment = "";
                /** @type {number} */
                var r = 0;
                /** @type {number} */
                p.start = value;
                if (dom) {
                    dom(p);
                    value = p[0];
                    str = p[1];
                }
                /** @type {number} */
                p.length = 0;
                a = value.match(core_rnotwhite) || [];
                _ref = str.match(core_rnotwhite) || [];
                if (item) {
                    /** @type {null} */
                    item._next = null;
                    /** @type {number} */
                    item.blob = 1;
                    p._firstPT = item;
                }
                _len = _ref.length;
                /** @type {number} */
                j = 0;
                for (; _len > j; j++) {
                    t = _ref[j];
                    result = str.substr(pos, str.indexOf(t, pos) - pos);
                    comment += result || !j ? result : ",";
                    pos += result.length;
                    if (r) {
                        /** @type {number} */
                        r = (r + 1) % 5;
                    } else {
                        if ("rgba(" === result.substr(-5)) {
                            /** @type {number} */
                            r = 1;
                        }
                    }
                    if (t === a[j] || a.length <= j) {
                        comment += t;
                    } else {
                        if (comment) {
                            p.push(comment);
                            /** @type {string} */
                            comment = "";
                        }
                        /** @type {number} */
                        pdataOld = parseFloat(a[j]);
                        p.push(pdataOld);
                        p._firstPT = {
                            _next: p._firstPT,
                            t: p,
                            p: p.length - 1,
                            s: pdataOld,
                            c: ("=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - pdataOld) || 0,
                            f: 0,
                            r: r && 4 > r
                        };
                    }
                    pos += t.length;
                }
                return comment += str.substr(pos), comment && p.push(comment), p.setRatio = next, p;
            };
            /**
             * @param {Object} target
             * @param {string} path
             * @param {string} value
             * @param {string} v
             * @param {Node} list
             * @param {number} opt_isDefault
             * @param {boolean} selector
             * @param {(RegExp|string)} mL
             * @return {?}
             */
            var set = function (target, path, value, v, list, opt_isDefault, selector, mL) {
                var m;
                var method;
                var val = "get" === value ? target[path] : value;
                /** @type {string} */
                var type = typeof target[path];
                /** @type {boolean} */
                var c = "string" == typeof v && "=" === v.charAt(1);
                var pt = {
                    t: target,
                    p: path,
                    s: val,
                    f: "function" === type,
                    pg: 0,
                    n: list || path,
                    r: opt_isDefault,
                    pr: 0,
                    c: c ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) : parseFloat(v) - val || 0
                };
                return "number" !== type && ("function" === type && ("get" === value && (method = path.indexOf("set") || "function" != typeof target["get" + path.substr(3)] ? path : "get" + path.substr(3), pt.s = val = selector ? target[method](selector) : target[method]())), "string" == typeof val && (selector || isNaN(val)) ? (pt.fp = selector, m = parse(val, v, mL || TweenLite.defaultStringFilter, pt), pt = {
                    t: m,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: 2,
                    pg: 0,
                    n: list || path,
                    pr: 0
                }) : c || (pt.s = parseFloat(val), pt.c = parseFloat(v) - pt.s || 0)), pt.c ? ((pt._next = this._firstPT) && (pt._next._prev = pt), this._firstPT = pt, pt) : void 0;
            };
            var _internals = TweenLite._internals = {
                isArray: _isArray,
                /** @type {function (Array): ?} */
                isSelector: _isSelector,
                lazyTweens: tags,
                /** @type {function (number, string, ?, ?): ?} */
                blobDif: parse
            };
            var _plugins = TweenLite._plugins = {};
            var _tweenLookup = _internals.tweenLookup = {};
            /** @type {number} */
            var _tweenLookupNum = 0;
            var paramNames = _internals.reservedProps = {
                ease: 1,
                delay: 1,
                overwrite: 1,
                onComplete: 1,
                onCompleteParams: 1,
                onCompleteScope: 1,
                useFrames: 1,
                runBackwards: 1,
                startAt: 1,
                onUpdate: 1,
                onUpdateParams: 1,
                onUpdateScope: 1,
                onStart: 1,
                onStartParams: 1,
                onStartScope: 1,
                onReverseComplete: 1,
                onReverseCompleteParams: 1,
                onReverseCompleteScope: 1,
                onRepeat: 1,
                onRepeatParams: 1,
                onRepeatScope: 1,
                easeParams: 1,
                yoyo: 1,
                immediateRender: 1,
                repeat: 1,
                repeatDelay: 1,
                data: 1,
                paused: 1,
                reversed: 1,
                autoCSS: 1,
                lazy: 1,
                onOverwrite: 1,
                callbackScope: 1,
                stringFilter: 1
            };
            var _overwriteLookup = {
                none: 0,
                all: 1,
                auto: 2,
                concurrent: 3,
                allOnStart: 4,
                preexisting: 5,
                true: 1,
                false: 0
            };
            var _rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline;
            var _rootTimeline = Animation._rootTimeline = new SimpleTimeline;
            /** @type {number} */
            var endFrame = 30;
            /** @type {function (): undefined} */
            var after = _internals.lazyRender = function () {
                var tag;
                /** @type {number} */
                var index = tags.length;
                params = {};
                for (; --index > -1;) {
                    tag = tags[index];
                    if (tag) {
                        if (tag._lazy !== false) {
                            tag.render(tag._lazy[0], tag._lazy[1], true);
                            /** @type {boolean} */
                            tag._lazy = false;
                        }
                    }
                }
                /** @type {number} */
                tags.length = 0;
            };
            _rootTimeline._startTime = _ticker.time;
            _rootFramesTimeline._startTime = _ticker.frame;
            /** @type {boolean} */
            _rootTimeline._active = _rootFramesTimeline._active = true;
            setTimeout(after, 1);
            /** @type {function (): undefined} */
            Animation._updateRoot = TweenLite.render = function () {
                var i;
                var a;
                var p;
                if (tags.length && after(), _rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false), _rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false), tags.length && after(), _ticker.frame >= endFrame) {
                    endFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
                    for (p in _tweenLookup) {
                        a = _tweenLookup[p].tweens;
                        i = a.length;
                        for (; --i > -1;) {
                            if (a[i]._gc) {
                                a.splice(i, 1);
                            }
                        }
                        if (0 === a.length) {
                            delete _tweenLookup[p];
                        }
                    }
                    if (p = _rootTimeline._first, (!p || p._paused) && (TweenLite.autoSleep && (!_rootFramesTimeline._first && 1 === _ticker._listeners.tick.length))) {
                        for (; p && p._paused;) {
                            p = p._next;
                        }
                        if (!p) {
                            _ticker.sleep();
                        }
                    }
                }
            };
            _ticker.addEventListener("tick", Animation._updateRoot);
            /**
             * @param {number} target
             * @param {?} tween
             * @param {boolean} recurring
             * @return {?}
             */
            var _register = function (target, tween, recurring) {
                var a;
                var i;
                var id = target._gsTweenID;
                if (_tweenLookup[id || (target._gsTweenID = id = "t" + _tweenLookupNum++)] || (_tweenLookup[id] = {
                        target: target,
                        tweens: []
                    }), tween && (a = _tweenLookup[id].tweens, a[i = a.length] = tween, recurring)) {
                    for (; --i > -1;) {
                        if (a[i] === tween) {
                            a.splice(i, 1);
                        }
                    }
                }
                return _tweenLookup[id].tweens;
            };
            /**
             * @param {string} context
             * @param {boolean} key
             * @param {?} arg
             * @param {?} values
             * @return {?}
             */
            var handler = function (context, key, arg, values) {
                var value;
                var result;
                var fn = context.vars.onOverwrite;
                return fn && (value = fn(context, key, arg, values)), fn = TweenLite.onOverwrite, fn && (result = fn(context, key, arg, values)), value !== false && result !== false;
            };
            /**
             * @param {?} target
             * @param {Object} tween
             * @param {Object} props
             * @param {number} dataAndEvents
             * @param {(Arguments|Array)} siblings
             * @return {?}
             */
            var _applyOverwrite = function (target, tween, props, dataAndEvents, siblings) {
                var i;
                var changed;
                var curTween;
                var l;
                if (1 === dataAndEvents || dataAndEvents >= 4) {
                    l = siblings.length;
                    /** @type {number} */
                    i = 0;
                    for (; l > i; i++) {
                        if ((curTween = siblings[i]) !== tween) {
                            if (!curTween._gc) {
                                if (curTween._kill(null, target, tween)) {
                                    /** @type {boolean} */
                                    changed = true;
                                }
                            }
                        } else {
                            if (5 === dataAndEvents) {
                                break;
                            }
                        }
                    }
                    return changed;
                }
                var globalStart;
                var startTime = tween._startTime + _tinyNum;
                /** @type {Array} */
                var overlaps = [];
                /** @type {number} */
                var oCount = 0;
                /** @type {boolean} */
                var zeroDur = 0 === tween._duration;
                i = siblings.length;
                for (; --i > -1;) {
                    if (!((curTween = siblings[i]) === tween)) {
                        if (!curTween._gc) {
                            if (!curTween._paused) {
                                if (curTween._timeline !== tween._timeline) {
                                    globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
                                    if (0 === _checkOverlap(curTween, globalStart, zeroDur)) {
                                        overlaps[oCount++] = curTween;
                                    }
                                } else {
                                    if (curTween._startTime <= startTime) {
                                        if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) {
                                            if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 2E-10)) {
                                                overlaps[oCount++] = curTween;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                /** @type {number} */
                i = oCount;
                for (; --i > -1;) {
                    if (curTween = overlaps[i], 2 === dataAndEvents && (curTween._kill(props, target, tween) && (changed = true)), 2 !== dataAndEvents || !curTween._firstPT && curTween._initted) {
                        if (2 !== dataAndEvents && !handler(curTween, tween)) {
                            continue;
                        }
                        if (curTween._enabled(false, false)) {
                            /** @type {boolean} */
                            changed = true;
                        }
                    }
                }
                return changed;
            };
            /**
             * @param {Object} tween
             * @param {number} reference
             * @param {boolean} zeroDur
             * @return {?}
             */
            var _checkOverlap = function (tween, reference, zeroDur) {
                var tl = tween._timeline;
                var ts = tl._timeScale;
                var t = tween._startTime;
                for (; tl._timeline;) {
                    if (t += tl._startTime, ts *= tl._timeScale, tl._paused) {
                        return -100;
                    }
                    tl = tl._timeline;
                }
                return t /= ts, t > reference ? t - reference : zeroDur && t === reference || !tween._initted && 2 * _tinyNum > t - reference ? _tinyNum : (t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum ? 0 : t - reference - _tinyNum;
            };
            /**
             * @return {undefined}
             */
            p._init = function () {
                var i;
                var initPlugins;
                var pt;
                var p;
                var vars;
                var v = this.vars;
                var op = this._overwrittenProps;
                var defaultDuration = this._duration;
                /** @type {boolean} */
                var x = !!v.immediateRender;
                var ease = v.ease;
                if (v.startAt) {
                    if (this._startAt) {
                        this._startAt.render(-1, true);
                        this._startAt.kill();
                    }
                    vars = {};
                    for (p in v.startAt) {
                        vars[p] = v.startAt[p];
                    }
                    if (vars.overwrite = false, vars.immediateRender = true, vars.lazy = x && v.lazy !== false, vars.startAt = vars.delay = null, this._startAt = TweenLite.to(this.target, 0, vars), x) {
                        if (this._time > 0) {
                            /** @type {null} */
                            this._startAt = null;
                        } else {
                            if (0 !== defaultDuration) {
                                return;
                            }
                        }
                    }
                } else {
                    if (v.runBackwards && 0 !== defaultDuration) {
                        if (this._startAt) {
                            this._startAt.render(-1, true);
                            this._startAt.kill();
                            /** @type {null} */
                            this._startAt = null;
                        } else {
                            if (0 !== this._time) {
                                /** @type {boolean} */
                                x = false;
                            }
                            pt = {};
                            for (p in v) {
                                if (!(paramNames[p] && "autoCSS" !== p)) {
                                    pt[p] = v[p];
                                }
                            }
                            if (pt.overwrite = 0, pt.data = "isFromStart", pt.lazy = x && v.lazy !== false, pt.immediateRender = x, this._startAt = TweenLite.to(this.target, 0, pt), x) {
                                if (0 === this._time) {
                                    return;
                                }
                            } else {
                                this._startAt._init();
                                this._startAt._enabled(false);
                                if (this.vars.immediateRender) {
                                    /** @type {null} */
                                    this._startAt = null;
                                }
                            }
                        }
                    }
                }
                if (this._ease = ease = ease ? ease instanceof Ease ? ease : "function" == typeof ease ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase : TweenLite.defaultEase, v.easeParams instanceof Array && (ease.config && (this._ease = ease.config.apply(ease, v.easeParams))), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets) {
                    i = this._targets.length;
                    for (; --i > -1;) {
                        if (this._initProps(this._targets[i], this._propLookup[i] = {}, this._siblings[i], op ? op[i] : null)) {
                            /** @type {boolean} */
                            initPlugins = true;
                        }
                    }
                } else {
                    initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op);
                }
                if (initPlugins && TweenLite._onPluginEvent("_onInitAllProps", this), op && (this._firstPT || "function" != typeof this.target && this._enabled(false, false)), v.runBackwards) {
                    /** @type {null} */
                    pt = this._firstPT;
                    for (; pt;) {
                        pt.s += pt.c;
                        /** @type {number} */
                        pt.c = -pt.c;
                        pt = pt._next;
                    }
                }
                this._onUpdate = v.onUpdate;
                /** @type {boolean} */
                this._initted = true;
            };
            /**
             * @param {?} target
             * @param {Object} propLookup
             * @param {Array} siblings
             * @param {Object} overwrittenProps
             * @return {?}
             */
            p._initProps = function (target, propLookup, siblings, overwrittenProps) {
                var p;
                var i;
                var h;
                var plugin;
                var pt;
                var v;
                if (null == target) {
                    return false;
                }
                if (params[target._gsTweenID]) {
                    after();
                }
                if (!this.vars.css) {
                    if (target.style) {
                        if (target !== win) {
                            if (target.nodeType) {
                                if (_plugins.css) {
                                    if (this.vars.autoCSS !== false) {
                                        _autoCSS(this.vars, target);
                                    }
                                }
                            }
                        }
                    }
                }
                for (p in this.vars) {
                    if (v = this.vars[p], paramNames[p]) {
                        if (v) {
                            if (v instanceof Array || v.push && _isArray(v)) {
                                if (-1 !== v.join("").indexOf("{self}")) {
                                    this.vars[p] = v = this._swapSelfInParams(v, this);
                                }
                            }
                        }
                    } else {
                        if (_plugins[p] && (plugin = new _plugins[p])._onInitTween(target, this.vars[p], this)) {
                            this._firstPT = pt = {
                                _next: this._firstPT,
                                t: plugin,
                                p: "setRatio",
                                s: 0,
                                c: 1,
                                f: 1,
                                n: p,
                                pg: 1,
                                pr: plugin._priority
                            };
                            i = plugin._overwriteProps.length;
                            for (; --i > -1;) {
                                propLookup[plugin._overwriteProps[i]] = this._firstPT;
                            }
                            if (plugin._priority || plugin._onInitAllProps) {
                                /** @type {boolean} */
                                h = true;
                            }
                            if (plugin._onDisable || plugin._onEnable) {
                                /** @type {boolean} */
                                this._notifyPluginsOfEnabled = true;
                            }
                            if (pt._next) {
                                pt._next._prev = pt;
                            }
                        } else {
                            propLookup[p] = set.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter);
                        }
                    }
                }
                return overwrittenProps && this._kill(overwrittenProps, target) ? this._initProps(target, propLookup, siblings, overwrittenProps) : this._overwrite > 1 && (this._firstPT && (siblings.length > 1 && _applyOverwrite(target, this, propLookup, this._overwrite, siblings))) ? (this._kill(propLookup, target), this._initProps(target, propLookup, siblings, overwrittenProps)) : (this._firstPT && ((this.vars.lazy !== false && this._duration || this.vars.lazy && !this._duration) && (params[target._gsTweenID] =
                    true)), h);
            };
            /**
             * @param {number} time
             * @param {boolean} recurring
             * @param {boolean} opt_isDefault
             * @return {?}
             */
            p.render = function (time, recurring, opt_isDefault) {
                var isComplete;
                var callback;
                var pt;
                var rawPrevTime;
                var prevTime = this._time;
                var duration = this._duration;
                var prevRawPrevTime = this._rawPrevTime;
                if (time >= duration - 1E-7) {
                    this._totalTime = this._time = duration;
                    this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
                    if (!this._reversed) {
                        /** @type {boolean} */
                        isComplete = true;
                        /** @type {string} */
                        callback = "onComplete";
                        opt_isDefault = opt_isDefault || this._timeline.autoRemoveChildren;
                    }
                    if (0 === duration) {
                        if (this._initted || (!this.vars.lazy || opt_isDefault)) {
                            if (this._startTime === this._timeline._duration) {
                                /** @type {number} */
                                time = 0;
                            }
                            if (0 > prevRawPrevTime || (0 >= time && time >= -1E-7 || prevRawPrevTime === _tinyNum && "isPause" !== this.data)) {
                                if (prevRawPrevTime !== time) {
                                    /** @type {boolean} */
                                    opt_isDefault = true;
                                    if (prevRawPrevTime > _tinyNum) {
                                        /** @type {string} */
                                        callback = "onReverseComplete";
                                    }
                                }
                            }
                            this._rawPrevTime = rawPrevTime = !recurring || (time || prevRawPrevTime === time) ? time : _tinyNum;
                        }
                    }
                } else {
                    if (1E-7 > time) {
                        /** @type {number} */
                        this._totalTime = this._time = 0;
                        this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
                        if (0 !== prevTime || 0 === duration && prevRawPrevTime > 0) {
                            /** @type {string} */
                            callback = "onReverseComplete";
                            isComplete = this._reversed;
                        }
                        if (0 > time) {
                            /** @type {boolean} */
                            this._active = false;
                            if (0 === duration) {
                                if (this._initted || (!this.vars.lazy || opt_isDefault)) {
                                    if (prevRawPrevTime >= 0) {
                                        if (prevRawPrevTime !== _tinyNum || "isPause" !== this.data) {
                                            /** @type {boolean} */
                                            opt_isDefault = true;
                                        }
                                    }
                                    this._rawPrevTime = rawPrevTime = !recurring || (time || prevRawPrevTime === time) ? time : _tinyNum;
                                }
                            }
                        }
                        if (!this._initted) {
                            /** @type {boolean} */
                            opt_isDefault = true;
                        }
                    } else {
                        if (this._totalTime = this._time = time, this._easeType) {
                            /** @type {number} */
                            var r = time / duration;
                            var type = this._easeType;
                            var pow = this._easePower;
                            if (1 === type || 3 === type && r >= 0.5) {
                                /** @type {number} */
                                r = 1 - r;
                            }
                            if (3 === type) {
                                r *= 2;
                            }
                            if (1 === pow) {
                                r *= r;
                            } else {
                                if (2 === pow) {
                                    r *= r * r;
                                } else {
                                    if (3 === pow) {
                                        r *= r * r * r;
                                    } else {
                                        if (4 === pow) {
                                            r *= r * r * r * r;
                                        }
                                    }
                                }
                            }
                            if (1 === type) {
                                /** @type {number} */
                                this.ratio = 1 - r;
                            } else {
                                if (2 === type) {
                                    /** @type {number} */
                                    this.ratio = r;
                                } else {
                                    if (0.5 > time / duration) {
                                        /** @type {number} */
                                        this.ratio = r / 2;
                                    } else {
                                        /** @type {number} */
                                        this.ratio = 1 - r / 2;
                                    }
                                }
                            }
                        } else {
                            this.ratio = this._ease.getRatio(time / duration);
                        }
                    }
                }
                if (this._time !== prevTime || opt_isDefault) {
                    if (!this._initted) {
                        if (this._init(), !this._initted || this._gc) {
                            return;
                        }
                        if (!opt_isDefault && (this._firstPT && (this.vars.lazy !== false && this._duration || this.vars.lazy && !this._duration))) {
                            return this._time = this._totalTime = prevTime, this._rawPrevTime = prevRawPrevTime, tags.push(this), void(this._lazy = [time, recurring]);
                        }
                        if (this._time && !isComplete) {
                            this.ratio = this._ease.getRatio(this._time / duration);
                        } else {
                            if (isComplete) {
                                if (this._ease._calcEnd) {
                                    this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1);
                                }
                            }
                        }
                    }
                    if (this._lazy !== false) {
                        /** @type {boolean} */
                        this._lazy = false;
                    }
                    if (!this._active) {
                        if (!this._paused) {
                            if (this._time !== prevTime) {
                                if (time >= 0) {
                                    /** @type {boolean} */
                                    this._active = true;
                                }
                            }
                        }
                    }
                    if (0 === prevTime) {
                        if (this._startAt) {
                            if (time >= 0) {
                                this._startAt.render(time, recurring, opt_isDefault);
                            } else {
                                if (!callback) {
                                    /** @type {string} */
                                    callback = "_dummyGS";
                                }
                            }
                        }
                        if (this.vars.onStart) {
                            if (0 !== this._time || 0 === duration) {
                                if (!recurring) {
                                    this._callback("onStart");
                                }
                            }
                        }
                    }
                    pt = this._firstPT;
                    for (; pt;) {
                        if (pt.f) {
                            pt.t[pt.p](pt.c * this.ratio + pt.s);
                        } else {
                            pt.t[pt.p] = pt.c * this.ratio + pt.s;
                        }
                        pt = pt._next;
                    }
                    if (this._onUpdate) {
                        if (0 > time) {
                            if (this._startAt) {
                                if (time !== -1E-4) {
                                    this._startAt.render(time, recurring, opt_isDefault);
                                }
                            }
                        }
                        if (!recurring) {
                            if (this._time !== prevTime || (isComplete || opt_isDefault)) {
                                this._callback("onUpdate");
                            }
                        }
                    }
                    if (callback) {
                        if (!this._gc || opt_isDefault) {
                            if (0 > time) {
                                if (this._startAt) {
                                    if (!this._onUpdate) {
                                        if (time !== -1E-4) {
                                            this._startAt.render(time, recurring, opt_isDefault);
                                        }
                                    }
                                }
                            }
                            if (isComplete) {
                                if (this._timeline.autoRemoveChildren) {
                                    this._enabled(false, false);
                                }
                                /** @type {boolean} */
                                this._active = false;
                            }
                            if (!recurring) {
                                if (this.vars[callback]) {
                                    this._callback(callback);
                                }
                            }
                            if (0 === duration) {
                                if (this._rawPrevTime === _tinyNum) {
                                    if (rawPrevTime !== _tinyNum) {
                                        /** @type {number} */
                                        this._rawPrevTime = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            };
            /**
             * @param {Object} vars
             * @param {?} target
             * @param {Object} value
             * @return {?}
             */
            p._kill = function (vars, target, value) {
                if ("all" === vars && (vars = null), null == vars && (null == target || target === this.target)) {
                    return this._lazy = false, this._enabled(false, false);
                }
                target = "string" != typeof target ? target || (this._targets || this.target) : TweenLite.selector(target) || target;
                var i;
                var overwrittenProps;
                var p;
                var pt;
                var propLookup;
                var changed;
                var killProps;
                var k;
                var progressValues;
                var attrNames = value && (this._time && (value._startTime === this._startTime && this._timeline === value._timeline));
                if ((_isArray(target) || _isSelector(target)) && "number" != typeof target[0]) {
                    i = target.length;
                    for (; --i > -1;) {
                        if (this._kill(vars, target[i], value)) {
                            /** @type {boolean} */
                            changed = true;
                        }
                    }
                } else {
                    if (this._targets) {
                        i = this._targets.length;
                        for (; --i > -1;) {
                            if (target === this._targets[i]) {
                                propLookup = this._propLookup[i] || {};
                                this._overwrittenProps = this._overwrittenProps || [];
                                overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
                                break;
                            }
                        }
                    } else {
                        if (target !== this.target) {
                            return false;
                        }
                        propLookup = this._propLookup;
                        overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
                    }
                    if (propLookup) {
                        if (killProps = vars || propLookup, k = vars !== overwrittenProps && ("all" !== overwrittenProps && (vars !== propLookup && ("object" != typeof vars || !vars._tempKill))), value && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
                            for (p in killProps) {
                                if (propLookup[p]) {
                                    if (!progressValues) {
                                        /** @type {Array} */
                                        progressValues = [];
                                    }
                                    progressValues.push(p);
                                }
                            }
                            if ((progressValues || !vars) && !handler(this, value, target, progressValues)) {
                                return false;
                            }
                        }
                        for (p in killProps) {
                            if (pt = propLookup[p]) {
                                if (attrNames) {
                                    if (pt.f) {
                                        pt.t[pt.p](pt.s);
                                    } else {
                                        pt.t[pt.p] = pt.s;
                                    }
                                    /** @type {boolean} */
                                    changed = true;
                                }
                                if (pt.pg) {
                                    if (pt.t._kill(killProps)) {
                                        /** @type {boolean} */
                                        changed = true;
                                    }
                                }
                                if (!(pt.pg && 0 !== pt.t._overwriteProps.length)) {
                                    if (pt._prev) {
                                        pt._prev._next = pt._next;
                                    } else {
                                        if (pt === this._firstPT) {
                                            this._firstPT = pt._next;
                                        }
                                    }
                                    if (pt._next) {
                                        pt._next._prev = pt._prev;
                                    }
                                    /** @type {null} */
                                    pt._next = pt._prev = null;
                                }
                                delete propLookup[p];
                            }
                            if (k) {
                                /** @type {number} */
                                overwrittenProps[p] = 1;
                            }
                        }
                        if (!this._firstPT) {
                            if (this._initted) {
                                this._enabled(false, false);
                            }
                        }
                    }
                }
                return changed;
            };
            /**
             * @return {?}
             */
            p.invalidate = function () {
                return this._notifyPluginsOfEnabled && TweenLite._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = false, this._propLookup = this._targets ? {} : [], Animation.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -_tinyNum, this.render(Math.min(0, -this._delay))), this;
            };
            /**
             * @param {boolean} recurring
             * @param {boolean} opt_isDefault
             * @return {?}
             */
            p._enabled = function (recurring, opt_isDefault) {
                if (h || _ticker.wake(), recurring && this._gc) {
                    var i;
                    var targets = this._targets;
                    if (targets) {
                        i = targets.length;
                        for (; --i > -1;) {
                            this._siblings[i] = _register(targets[i], this, true);
                        }
                    } else {
                        this._siblings = _register(this.target, this, true);
                    }
                }
                return Animation.prototype._enabled.call(this, recurring, opt_isDefault), this._notifyPluginsOfEnabled && this._firstPT ? TweenLite._onPluginEvent(recurring ? "_onEnable" : "_onDisable", this) : false;
            };
            /**
             * @param {Object} target
             * @param {number} duration
             * @param {number} vars
             * @return {?}
             */
            TweenLite.to = function (target, duration, vars) {
                return new TweenLite(target, duration, vars);
            };
            /**
             * @param {string} target
             * @param {string} duration
             * @param {Object} vars
             * @return {?}
             */
            TweenLite.from = function (target, duration, vars) {
                return vars.runBackwards = true, vars.immediateRender = 0 != vars.immediateRender, new TweenLite(target, duration, vars);
            };
            /**
             * @param {ArrayBuffer} target
             * @param {number} duration
             * @param {?} fromVars
             * @param {number} toVars
             * @return {?}
             */
            TweenLite.fromTo = function (target, duration, fromVars, toVars) {
                return toVars.startAt = fromVars, toVars.immediateRender = 0 != toVars.immediateRender && 0 != fromVars.immediateRender, new TweenLite(target, duration, toVars);
            };
            /**
             * @param {number} min1
             * @param {string} callback
             * @param {Object} params
             * @param {?} evt
             * @param {?} useFrames
             * @return {?}
             */
            TweenLite.delayedCall = function (min1, callback, params, evt, useFrames) {
                return new TweenLite(callback, 0, {
                    delay: min1,
                    onComplete: callback,
                    onCompleteParams: params,
                    callbackScope: evt,
                    onReverseComplete: callback,
                    onReverseCompleteParams: params,
                    immediateRender: false,
                    lazy: false,
                    useFrames: useFrames,
                    overwrite: 0
                });
            };
            /**
             * @param {ArrayBuffer} target
             * @param {number} vars
             * @return {?}
             */
            TweenLite.set = function (target, vars) {
                return new TweenLite(target, 0, vars);
            };
            /**
             * @param {?} target
             * @param {boolean} onlyActive
             * @return {?}
             */
            TweenLite.getTweensOf = function (target, onlyActive) {
                if (null == target) {
                    return [];
                }
                target = "string" != typeof target ? target : TweenLite.selector(target) || target;
                var i;
                var a;
                var j;
                var t;
                if ((_isArray(target) || _isSelector(target)) && "number" != typeof target[0]) {
                    i = target.length;
                    /** @type {Array} */
                    a = [];
                    for (; --i > -1;) {
                        /** @type {Array} */
                        a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
                    }
                    /** @type {number} */
                    i = a.length;
                    for (; --i > -1;) {
                        t = a[i];
                        /** @type {number} */
                        j = i;
                        for (; --j > -1;) {
                            if (t === a[j]) {
                                a.splice(i, 1);
                            }
                        }
                    }
                } else {
                    a = _register(target).concat();
                    i = a.length;
                    for (; --i > -1;) {
                        if (a[i]._gc || onlyActive && !a[i].isActive()) {
                            a.splice(i, 1);
                        }
                    }
                }
                return a;
            };
            /** @type {function (?, boolean, boolean): undefined} */
            TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function (target, onlyActive, vars) {
                if ("object" == typeof onlyActive) {
                    /** @type {boolean} */
                    vars = onlyActive;
                    /** @type {boolean} */
                    onlyActive = false;
                }
                var a = TweenLite.getTweensOf(target, onlyActive);
                var i = a.length;
                for (; --i > -1;) {
                    a[i]._kill(vars, target);
                }
            };
            var TweenPlugin = _class("plugins.TweenPlugin", function (classNames, dataAndEvents) {
                this._overwriteProps = (classNames || "").split(",");
                this._propName = this._overwriteProps[0];
                this._priority = dataAndEvents || 0;
                this._super = TweenPlugin.prototype;
            }, true);
            if (p = TweenPlugin.prototype, TweenPlugin.version = "1.18.0", TweenPlugin.API = 2, p._firstPT = null, p._addTween = set, p.setRatio = next, p._kill = function (lookup) {
                    var i;
                    var a = this._overwriteProps;
                    var pt = this._firstPT;
                    if (null != lookup[this._propName]) {
                        /** @type {Array} */
                        this._overwriteProps = [];
                    } else {
                        i = a.length;
                        for (; --i > -1;) {
                            if (null != lookup[a[i]]) {
                                a.splice(i, 1);
                            }
                        }
                    }
                    for (; pt;) {
                        if (null != lookup[pt.n]) {
                            if (pt._next) {
                                pt._next._prev = pt._prev;
                            }
                            if (pt._prev) {
                                pt._prev._next = pt._next;
                                /** @type {null} */
                                pt._prev = null;
                            } else {
                                if (this._firstPT === pt) {
                                    this._firstPT = pt._next;
                                }
                            }
                        }
                        pt = pt._next;
                    }
                    return false;
                }, p._roundProps = function (data, value) {
                    var pt = this._firstPT;
                    for (; pt;) {
                        if (data[this._propName] || null != pt.n && data[pt.n.split(this._propName + "_").join("")]) {
                            /** @type {number} */
                            pt.r = value;
                        }
                        pt = pt._next;
                    }
                }, TweenLite._onPluginEvent = function (type, tween) {
                    var changed;
                    var pt2;
                    var first;
                    var last;
                    var next;
                    var pt = tween._firstPT;
                    if ("_onInitAllProps" === type) {
                        for (; pt;) {
                            next = pt._next;
                            pt2 = first;
                            for (; pt2 && pt2.pr > pt.pr;) {
                                pt2 = pt2._next;
                            }
                            if (pt._prev = pt2 ? pt2._prev : last) {
                                pt._prev._next = pt;
                            } else {
                                first = pt;
                            }
                            if (pt._next = pt2) {
                                pt2._prev = pt;
                            } else {
                                last = pt;
                            }
                            pt = next;
                        }
                        pt = tween._firstPT = first;
                    }
                    for (; pt;) {
                        if (pt.pg) {
                            if ("function" == typeof pt.t[type]) {
                                if (pt.t[type]()) {
                                    /** @type {boolean} */
                                    changed = true;
                                }
                            }
                        }
                        pt = pt._next;
                    }
                    return changed;
                }, TweenPlugin.activate = function (plugins) {
                    var i = plugins.length;
                    for (; --i > -1;) {
                        if (plugins[i].API === TweenPlugin.API) {
                            _plugins[(new plugins[i])._propName] = plugins[i];
                        }
                    }
                    return true;
                }, _gsDefine.plugin = function (config) {
                    if (!(config && (config.propName && (config.init && config.API)))) {
                        throw "illegal plugin definition.";
                    }
                    var letter;
                    var propName = config.propName;
                    var helperMissingString = config.priority || 0;
                    var overwriteProps = config.overwriteProps;
                    var map = {
                        init: "_onInitTween",
                        set: "setRatio",
                        kill: "_kill",
                        round: "_roundProps",
                        initAll: "_onInitAllProps"
                    };
                    var Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin", function () {
                        TweenPlugin.call(this, propName, helperMissingString);
                        this._overwriteProps = overwriteProps || [];
                    }, config.global === true);
                    var options = Plugin.prototype = new TweenPlugin(propName);
                    options.constructor = Plugin;
                    Plugin.API = config.API;
                    for (letter in map) {
                        if ("function" == typeof config[letter]) {
                            options[map[letter]] = config[letter];
                        }
                    }
                    return Plugin.version = config.version, TweenPlugin.activate([Plugin]), Plugin;
                }, a = win._gsQueue) {
                /** @type {number} */
                i = 0;
                for (; i < a.length; i++) {
                    a[i]();
                }
                for (p in _defLookup) {
                    if (!_defLookup[p].func) {
                        win.console.log("GSAP encountered missing dependency: com.greensock." + p);
                    }
                }
            }
            /** @type {boolean} */
            h = false;
        }
    }("undefined" != typeof module && (module.exports && "undefined" != typeof global) ? global : this || window, "TweenMax");