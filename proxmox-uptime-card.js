const __webpack_id__ = "64396";

const __webpack_ids__ = [ "64396" ];

const __webpack_modules__ = {
    94327: function(t, e, s) {
        s.d(e, {
            Vy: () => a,
            fI: () => n,
            ux: () => c
        });
        var i = s(65940), r = s(83510);
        const o = [ "#4269d0", "#f4bd4a", "#ff725c", "#6cc5b0", "#a463f2", "#ff8ab7", "#9c6b4e", "#97bbf5", "#01ab63", "#094bad", "#c99000", "#d84f3e", "#49a28f", "#048732", "#d96895", "#8043ce", "#7599d1", "#7a4c31", "#6989f4", "#ffd444", "#ff957c", "#8fe9d3", "#62cc71", "#ffadda", "#c884ff", "#badeff", "#bf8b6d", "#927acc", "#97ee3f", "#bf3947", "#9f5b00", "#f48758", "#8caed6", "#f2b94f", "#eff26e", "#e43872", "#d9b100", "#9d7a00", "#698cff", "#00d27e", "#d06800", "#009f82", "#c49200", "#cbe8ff", "#fecddf", "#c27eb6", "#8cd2ce", "#c4b8d9", "#f883b0", "#a49100", "#f48800", "#27d0df", "#a04a9b" ];
        function a(t) {
            return o[t % o.length];
        }
        function n(t, e) {
            const s = e.getPropertyValue(`--graph-color-${t + 1}`) || a(t);
            return (0, r.RQ)(s);
        }
        const c = (0, i.A)(t => o.map((e, s) => n(s, t)), (t, e) => t[0].getPropertyValue("--graph-color-1") === e[0].getPropertyValue("--graph-color-1"));
    },
    85356: function(t, e, s) {
        s.d(e, {
            n: () => d,
            v: () => n
        });
        s(99342), s(65315), s(837), s(37089), s(88238), s(34536), s(16257), s(20152), 
        s(44711), s(72108), s(77030);
        var i = s(12275), r = s(14523), o = s(88341), a = s(24730);
        const n = {
            alarm_control_panel: [ "armed_away", "armed_custom_bypass", "armed_home", "armed_night", "armed_vacation", "arming", "disarmed", "disarming", "pending", "triggered" ],
            alert: [ "on", "off", "idle" ],
            assist_satellite: [ "idle", "listening", "responding", "processing" ],
            automation: [ "on", "off" ],
            binary_sensor: [ "on", "off" ],
            button: [],
            calendar: [ "on", "off" ],
            camera: [ "idle", "recording", "streaming" ],
            cover: [ "closed", "closing", "open", "opening" ],
            device_tracker: [ "home", "not_home" ],
            fan: [ "on", "off" ],
            humidifier: [ "on", "off" ],
            input_boolean: [ "on", "off" ],
            input_button: [],
            lawn_mower: [ "error", "paused", "mowing", "returning", "docked" ],
            light: [ "on", "off" ],
            lock: [ "jammed", "locked", "locking", "unlocked", "unlocking", "opening", "open" ],
            media_player: [ "off", "on", "idle", "playing", "paused", "standby", "buffering" ],
            person: [ "home", "not_home" ],
            plant: [ "ok", "problem" ],
            remote: [ "on", "off" ],
            scene: [],
            schedule: [ "on", "off" ],
            script: [ "on", "off" ],
            siren: [ "on", "off" ],
            sun: [ "above_horizon", "below_horizon" ],
            switch: [ "on", "off" ],
            timer: [ "active", "idle", "paused" ],
            update: [ "on", "off" ],
            vacuum: [ "cleaning", "docked", "error", "idle", "paused", "returning" ],
            valve: [ "closed", "closing", "open", "opening" ],
            weather: [ "clear-night", "cloudy", "exceptional", "fog", "hail", "lightning-rainy", "lightning", "partlycloudy", "pouring", "rainy", "snowy-rainy", "snowy", "sunny", "windy-variant", "windy" ]
        }, c = {
            alarm_control_panel: {
                code_format: [ "number", "text" ]
            },
            binary_sensor: {
                device_class: [ "battery", "battery_charging", "co", "cold", "connectivity", "door", "garage_door", "gas", "heat", "light", "lock", "moisture", "motion", "moving", "occupancy", "opening", "plug", "power", "presence", "problem", "running", "safety", "smoke", "sound", "tamper", "update", "vibration", "window" ]
            },
            button: {
                device_class: [ "restart", "update" ]
            },
            camera: {
                frontend_stream_type: [ "hls", "web_rtc" ]
            },
            climate: {
                hvac_action: [ "off", "idle", "preheating", "defrosting", "heating", "cooling", "drying", "fan" ]
            },
            cover: {
                device_class: [ "awning", "blind", "curtain", "damper", "door", "garage", "gate", "shade", "shutter", "window" ]
            },
            device_tracker: {
                source_type: [ "bluetooth", "bluetooth_le", "gps", "router" ]
            },
            fan: {
                direction: [ "forward", "reverse" ]
            },
            humidifier: {
                device_class: [ "humidifier", "dehumidifier" ],
                action: [ "off", "idle", "humidifying", "drying" ]
            },
            media_player: {
                device_class: [ "tv", "speaker", "receiver" ],
                media_content_type: [ "album", "app", "artist", "channel", "channels", "composer", "contributing_artist", "episode", "game", "genre", "image", "movie", "music", "playlist", "podcast", "season", "track", "tvshow", "url", "video" ],
                repeat: [ "off", "one", "all" ]
            },
            number: {
                device_class: [ "temperature" ]
            },
            sensor: {
                device_class: [ "apparent_power", "aqi", "battery", "carbon_dioxide", "carbon_monoxide", "current", "date", "duration", "energy", "frequency", "gas", "humidity", "illuminance", "monetary", "nitrogen_dioxide", "nitrogen_monoxide", "nitrous_oxide", "ozone", "ph", "pm1", "pm10", "pm25", "power_factor", "power", "pressure", "reactive_power", "signal_strength", "sulphur_dioxide", "temperature", "timestamp", "volatile_organic_compounds", "volatile_organic_compounds_parts", "voltage", "volume_flow_rate" ],
                state_class: [ "measurement", "total", "total_increasing" ]
            },
            switch: {
                device_class: [ "outlet", "switch" ]
            },
            update: {
                device_class: [ "firmware" ]
            },
            water_heater: {
                away_mode: [ "on", "off" ]
            }
        }, d = (t, e, s = void 0) => {
            const d = (0, i.t)(e), _ = [];
            switch (!s && d in n ? _.push(...n[d]) : s && d in c && s in c[d] && _.push(...c[d][s]), 
            d) {
              case "climate":
                s ? "fan_mode" === s ? _.push(...e.attributes.fan_modes) : "preset_mode" === s ? _.push(...e.attributes.preset_modes) : "swing_mode" === s && _.push(...e.attributes.swing_modes) : _.push(...e.attributes.hvac_modes);
                break;

              case "device_tracker":
              case "person":
                s || _.push(...Object.entries(t.states).filter(([ t, e ]) => "zone" === (0, 
                o.m)(t) && "zone.home" !== t && e.attributes.friendly_name).map(([ t, e ]) => e.attributes.friendly_name).sort((e, s) => (0, 
                a.xL)(e, s, t.locale.language)));
                break;

              case "event":
                "event_type" === s && _.push(...e.attributes.event_types);
                break;

              case "fan":
                "preset_mode" === s && _.push(...e.attributes.preset_modes);
                break;

              case "humidifier":
                "mode" === s && _.push(...e.attributes.available_modes);
                break;

              case "input_select":
              case "select":
                s || _.push(...e.attributes.options);
                break;

              case "light":
                "effect" === s && e.attributes.effect_list ? _.push(...e.attributes.effect_list) : "color_mode" === s && e.attributes.supported_color_modes && _.push(...e.attributes.supported_color_modes);
                break;

              case "media_player":
                "sound_mode" === s ? _.push(...e.attributes.sound_mode_list) : "source" === s && _.push(...e.attributes.source_list);
                break;

              case "remote":
                "current_activity" === s && _.push(...e.attributes.activity_list);
                break;

              case "sensor":
                s || "enum" !== e.attributes.device_class || _.push(...e.attributes.options);
                break;

              case "vacuum":
                "fan_speed" === s && _.push(...e.attributes.fan_speed_list);
                break;

              case "water_heater":
                s && "operation_mode" !== s || _.push(...e.attributes.operation_list);
            }
            return s || _.push(...r.s7), [ ...new Set(_) ];
        };
    },
    92900: function(t, e, s) {
        s.d(e, {
            c: () => f
        });
        var i = s(94327), r = s(83510), o = s(6788), a = s(88341), n = s(25442), c = s(14523), d = s(45736), _ = s(12275), h = s(85356);
        const u = {
            media_player: {
                paused: .5,
                idle: 1
            },
            vacuum: {
                returning: .5
            }
        };
        let l = 0;
        const p = new Map();
        function f(t, e, s) {
            return function(t, e, s) {
                if (!s || t === c.Hh) return (0, d.a)("--history-unavailable-color", e);
                if (t === c.HV) return (0, d.a)("--history-unknown-color", e);
                const i = (0, n.mg)(s, t);
                if (!i) return;
                const _ = (0, d.a)(i, e);
                if (!_) return;
                const h = (0, a.m)(s.entity_id), l = u[h]?.[t];
                return l ? (0, r.zm)((0, o.T)((0, r.Nc)((0, r.xp)(_)), l)) : _;
            }(t, e, s) || function(t, e, s) {
                if (!s) return;
                const r = (0, _.t)(s), o = (h.v[r] || "sensor" === r && "enum" === s.attributes.device_class && s.attributes.options || []).indexOf(t);
                return -1 !== o ? (0, i.fI)(o, e) : void 0;
            }(t, e, s) || function(t, e) {
                if (p.has(t)) return p.get(t);
                const s = (0, i.fI)(l, e);
                return l++, p.set(t, s), s;
            }(t, e);
        }
    },
    63002: function(t, e, s) {
        s.d(e, {
            $3: () => f,
            $O: () => k,
            $j: () => m,
            ED: () => o,
            JE: () => S,
            OQ: () => H,
            PU: () => I,
            Ph: () => l,
            Uf: () => x,
            W1: () => p,
            Wr: () => _,
            Z: () => c,
            gF: () => g,
            iY: () => y,
            jU: () => a,
            nN: () => v,
            p3: () => d,
            pJ: () => u,
            r_: () => n,
            sz: () => h
        });
        s(65315), s(59023);
        var i = s(72652), r = s(50654), o = function(t) {
            return t[t.NONE = 0] = "NONE", t[t.ARITHMETIC = 1] = "ARITHMETIC", t[t.CIRCULAR = 2] = "CIRCULAR", 
            t;
        }({});
        const a = 59509 == s.j ? [ "entity_not_recorded", "entity_no_longer_recorded", "state_class_removed", "units_changed", "mean_type_changed", "no_state" ] : null, n = [ "L", "gal", "ft³", "m³", "CCF", "MCF" ], c = t => t.sendMessagePromise({
            type: "recorder/info"
        }), d = (t, e) => t.callWS({
            type: "recorder/list_statistic_ids",
            statistic_type: e
        }), _ = (t, e) => t.callWS({
            type: "recorder/get_statistics_metadata",
            statistic_ids: e
        }), h = (t, e, s, i, r = "hour", o, a) => t.callWS({
            type: "recorder/statistics_during_period",
            start_time: e.toISOString(),
            end_time: s?.toISOString(),
            statistic_ids: i,
            period: r,
            units: o,
            types: a
        }), u = (t, e, s, i) => t.callWS({
            type: "recorder/statistic_during_period",
            statistic_id: e,
            units: i,
            fixed_period: s.fixed_period ? {
                start_time: s.fixed_period.start instanceof Date ? s.fixed_period.start.toISOString() : s.fixed_period.start,
                end_time: s.fixed_period.end instanceof Date ? s.fixed_period.end.toISOString() : s.fixed_period.end
            } : void 0,
            calendar: s.calendar ? {
                ..."week" === s.calendar.period ? {
                    first_weekday: (0, r.DD)(t.locale).substring(0, 3)
                } : {},
                ...s.calendar
            } : void 0,
            rolling_window: s.rolling_window
        }), l = t => t.callWS({
            type: "recorder/validate_statistics"
        }), p = (t, e, s) => t.callWS({
            type: "recorder/update_statistics_metadata",
            statistic_id: e,
            unit_of_measurement: s
        }), f = (t, e) => t.callWS({
            type: "recorder/clear_statistics",
            statistic_ids: e
        }), m = t => {
            let e = null;
            if (!t) return null;
            for (const s of t) null !== s.change && void 0 !== s.change && (null === e ? e = s.change : e += s.change);
            return e;
        }, g = (t, e) => {
            let s = null;
            for (const i of e) {
                if (!(i in t)) continue;
                const e = m(t[i]);
                null !== e && (null === s ? s = e : s += e);
            }
            return s;
        }, y = (t, e) => t.some(t => void 0 !== t[e] && null !== t[e]), b = [ "mean", "min", "max" ], w = [ "sum", "state", "change" ], v = (t, e) => !(!b.includes(e) || 0 === t.mean_type) || !(!w.includes(e) || !t.has_sum), x = (t, e, s, i, r) => {
            const o = new Date(s).toISOString();
            return t.callWS({
                type: "recorder/adjust_sum_statistics",
                statistic_id: e,
                start_time: o,
                adjustment: i,
                adjustment_unit_of_measurement: r
            });
        }, k = (t, e, s) => {
            const r = t.states[e];
            return r ? (0, i.u)(r) : s?.name || e;
        }, S = (t, e, s) => {
            let i;
            return e && (i = t.states[e]?.attributes.unit_of_measurement), void 0 === i ? s?.statistics_unit_of_measurement : i;
        }, H = t => t.includes(":"), I = t => t.callWS({
            type: "recorder/update_statistics_issues"
        });
    },
    18318: function(t, e, s) {
        s.a(t, async function(t, i) {
            try {
                s.r(e), s.d(e, {
                    DEFAULT_HOURS_TO_SHOW: () => g,
                    ProxmoxUptimeCard: () => y
                });
                s(99342), s(65315), s(22416);
                var r = s(69868), o = s(84922), a = s(22019), n = s(75907), c = s(26946), d = s(47807), _ = (s(94124), 
                s(70490), s(42163), s(69006)), h = s(3274), u = s(8510), l = s(38177), p = s(94372), f = s(63002), m = t([ d, _ ]);
                [ d, _ ] = m.then ? (await m)() : m;
                const g = 24;
                class y extends o.WF {
                    static async getConfigElement() {
                        return await Promise.all([ s.e("42153"), s.e("87110"), s.e("30199"), s.e("5255"), s.e("78589"), s.e("78525"), s.e("15116"), s.e("15043") ]).then(s.bind(s, 89227)), 
                        document.createElement("hui-history-graph-card-editor");
                    }
                    static getStubConfig() {
                        return {
                            type: "history-graph",
                            entities: [ "sun.sun" ]
                        };
                    }
                    getCardSize() {
                        return this._config?.title ? 2 : 0 + 2 * (this._entityIds?.length || 1);
                    }
                    getGridOptions() {
                        return {
                            columns: 12,
                            min_columns: 6,
                            min_rows: 2
                        };
                    }
                    setConfig(t) {
                        if (!t.entities || !Array.isArray(t.entities)) throw new Error("Entities need to be an array");
                        if (!t.entities.length) throw new Error("You must include at least one entity");
                        const e = t.entities ? (0, l.L)(t.entities) : [];
                        this._entityIds = [], e.forEach(t => {
                            this._entityIds.push(t.entity), t.name && (this._names[t.entity] = t.name);
                        }), this._hoursToShow = t.hours_to_show || g, this._config = t;
                    }
                    connectedCallback() {
                        super.connectedCallback(), this.hasUpdated && this._subscribeHistory();
                    }
                    disconnectedCallback() {
                        super.disconnectedCallback(), this._unsubscribeHistory();
                    }
                    async _subscribeHistory() {
                        if (!(0, c.x)(this.hass, "history") || this._subscribed) return;
                        const {
                            numeric_device_classes: t
                        } = await (0, h.KL)(this.hass);
                        this._subscribed = (0, _.IQ)(this.hass, e => {
                            this._subscribed && (this._stateHistory = (0, _.Mm)(this.hass, e, this._entityIds, this.hass.localize, t, this._config?.split_device_classes), 
                            this._mergeHistory());
                        }, this._hoursToShow, this._entityIds).catch(t => {
                            this._subscribed = void 0, this._error = t;
                        }), await this._fetchStatistics(t), this._setRedrawTimer();
                    }
                    _mergeHistory() {
                        this._stateHistory && (this._history = (0, _.tG)(this._stateHistory, this._statisticsHistory, this._config?.split_device_classes));
                    }
                    async _fetchStatistics(t) {
                        const e = new Date(), s = new Date();
                        s.setHours(s.getHours() - this._hoursToShow);
                        const i = await (0, f.sz)(this.hass, s, e, this._entityIds, "hour", void 0, [ "mean", "state" ]);
                        this._statisticsHistory = (0, _._1)(this.hass, i, this._entityIds, t, this._config?.split_device_classes), 
                        this._mergeHistory();
                    }
                    _redrawGraph() {
                        this._history && (this._history = {
                            ...this._history
                        });
                    }
                    _setRedrawTimer() {
                        clearInterval(this._interval), this._interval = window.setInterval(() => this._redrawGraph(), 6e4);
                    }
                    _unsubscribeHistory() {
                        clearInterval(this._interval), this._subscribed && (this._subscribed.then(t => t?.()), 
                        this._subscribed = void 0);
                    }
                    shouldUpdate(t) {
                        return (0, u.pY)(this, t) || t.size > 1 || !t.has("hass");
                    }
                    updated(t) {
                        if (super.updated(t), !(this._config && this.hass && this._hoursToShow && this._entityIds.length)) return;
                        if (!t.has("_config") && !t.has("hass")) return;
                        const e = t.get("_config");
                        !t.has("_config") || e?.entities === this._config.entities && e?.hours_to_show === this._config.hours_to_show || (this._unsubscribeHistory(), 
                        this._subscribeHistory());
                    }
                    render() {
                        if (!this.hass || !this._config) return o.s6;
                        const t = new Date();
                        t.setHours(t.getHours() - this._hoursToShow);
                        const e = `/history?${(0, p.KH)({
                            entity_id: this._entityIds.join(","),
                            start_date: t.toISOString()
                        })}`, s = this._config.grid_options?.columns ?? 12, i = "number" == typeof s && s <= 12, r = "number" == typeof this._config.grid_options?.rows;
                        return o.qy` <ha-card> ${this._config.title ? o.qy` <h1 class="card-header"> ${this._config.title} <a href="${e}"><ha-icon-next></ha-icon-next></a> </h1> ` : o.s6} <div class="content ${(0, 
                        n.H)({
                            "has-header": !!this._config.title,
                            "has-rows": !!this._config.grid_options?.rows,
                            "has-height": r
                        })}"> ${this._error ? o.qy` <ha-alert alert-type="error"> ${this.hass.localize("ui.components.history_charts.error")}: ${this._error.message || this._error.code} </ha-alert> ` : o.qy` <state-history-charts .hass="${this.hass}" .isLoadingData="${!this._history}" .historyData="${this._history}" .names="${this._names}" up-to-now .hoursToShow="${this._hoursToShow}" .showNames="${void 0 === this._config.show_names || this._config.show_names}" .logarithmicScale="${this._config.logarithmic_scale || !1}" .minYAxis="${this._config.min_y_axis}" .maxYAxis="${this._config.max_y_axis}" .fitYData="${this._config.fit_y_data || !1}" .height="${r ? "100%" : void 0}" .narrow="${i}" .expandLegend="${this._config.expand_legend}"></state-history-charts> `} </div> </ha-card> `;
                    }
                    constructor(...t) {
                        super(...t), this._names = {}, this._entityIds = [], this._hoursToShow = g;
                    }
                }
                y.styles = o.AH`ha-card{display:flex;flex-direction:column;height:100%}.card-header{justify-content:space-between;display:flex;padding-bottom:0}.card-header ha-icon-next{--mdc-icon-button-size:24px;line-height:24px;color:var(--primary-text-color)}.content{padding:0 16px 8px;flex:1;overflow:hidden}.has-header{padding-top:0}state-history-charts{--timeline-top-margin:16px}.has-height state-history-charts{height:100%}.has-rows{--chart-max-height:100%}`, 
                (0, r.__decorate)([ (0, a.MZ)({
                    attribute: !1
                }) ], y.prototype, "hass", void 0), (0, r.__decorate)([ (0, a.wk)() ], y.prototype, "_history", void 0), 
                (0, r.__decorate)([ (0, a.wk)() ], y.prototype, "_statisticsHistory", void 0), 
                (0, r.__decorate)([ (0, a.wk)() ], y.prototype, "_config", void 0), 
                (0, r.__decorate)([ (0, a.wk)() ], y.prototype, "_error", void 0), 
                y = (0, r.__decorate)([ (0, a.EM)("proxmox-uptime-card") ], y), 
                i();
            } catch (t) {
                i(t);
            }
        });
    },
    28829: function(t, e, s) {
        s.d(e, {
            b: () => r
        });
        var i = s(19490);
        function r(t, e) {
            return +(0, i.a)(t) - +(0, i.a)(e);
        }
    }
};
if (typeof ProxmoxUptimeCard !== "undefined" && !customElements.get("proxmox-uptime-card")) {
  customElements.define("proxmox-uptime-card", ProxmoxUptimeCard);
}
