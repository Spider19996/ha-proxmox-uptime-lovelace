const CARD_VERSION = "2.2.0";
const DEFAULT_FILTER = [
  "binary_sensor.node_.*_status",
  "binary_sensor.vm_.*_status",
  "binary_sensor.lxc_.*_status",
];
const LANGUAGE_AUTO = "auto";
const LANGUAGE_DE = "de";
const LANGUAGE_EN = "en";
const SUPPORTED_LANGUAGES = [LANGUAGE_AUTO, LANGUAGE_DE, LANGUAGE_EN];
const DEFAULT_SENSOR_ICON = "mdi:server";

const CARD_MESSAGES = {
  empty_entities: {
    [LANGUAGE_DE]:
      "Keine Proxmox-Uptime-Sensoren erfüllen den konfigurierten Filter.",
    [LANGUAGE_EN]: "No Proxmox uptime sensors matched the configured filter.",
  },
  configure_failed: {
    [LANGUAGE_DE]: "Konfiguration der Karte fehlgeschlagen.",
    [LANGUAGE_EN]: "Failed to configure card.",
  },
};

const ensureCardMetadataRegistered = () => {
  window.customCards = window.customCards || [];
  const alreadyRegistered = window.customCards.some(
    (card) => card?.type === "proxmox-uptime-card"
  );
  if (!alreadyRegistered) {
    window.customCards.push({
      type: "proxmox-uptime-card",
      name: "Proxmox Uptime Card",
      description: "History timeline for Proxmox nodes, VMs, and containers.",
    });
  }
};

const ensureEditorElementRegistered = () => {
  if (customElements.get("proxmox-uptime-card-editor")) {
    return;
  }

  const LANGUAGE_OPTION_LABELS = {
    [LANGUAGE_AUTO]: { [LANGUAGE_EN]: "Auto", [LANGUAGE_DE]: "Auto" },
    [LANGUAGE_DE]: { [LANGUAGE_EN]: "German", [LANGUAGE_DE]: "Deutsch" },
    [LANGUAGE_EN]: { [LANGUAGE_EN]: "English", [LANGUAGE_DE]: "Englisch" },
  };

  const EDITOR_TABS = [
    {
      key: "general",
      fields: ["title", "entities", "show_all", "names_raw"],
    },
    {
      key: "filters",
      fields: ["match", "exclude"],
    },
    {
      key: "display",
      fields: [
        "hours_to_show",
        "show_names",
        "name_filters",
        "icons_raw",
        "timeline_color_on",
        "timeline_color_off",
        "timeline_color_unknown",
      ],
    },
    {
      key: "advanced",
      fields: ["language_mode"],
    },
  ];

  const EDITOR_TEXTS = {
    labels: {
      [LANGUAGE_EN]: {
        title: "Title",
        entities: "Entities",
        match: "Include pattern",
        exclude: "Exclude pattern",
        language_mode: "Language",
        names_raw: "Friendly names",
        show_all: "Show all entities",
        hours_to_show: "Hours to show",
        show_names: "Show legend names",
        name_filters: "Name filters",
        icons_raw: "Custom icons",
        timeline_color_on: "Timeline color (on)",
        timeline_color_off: "Timeline color (off)",
        timeline_color_unknown: "Timeline color (unknown)",
      },
      [LANGUAGE_DE]: {
        title: "Titel",
        entities: "Entitäten",
        match: "Einschlussmuster",
        exclude: "Ausschlussmuster",
        language_mode: "Sprache",
        names_raw: "Freundliche Namen",
        show_all: "Alle Entitäten anzeigen",
        hours_to_show: "Anzuzeigende Stunden",
        show_names: "Legendenamen anzeigen",
        name_filters: "Namensfilter",
        icons_raw: "Eigene Icons",
        timeline_color_on: "Zeitstrahlfarbe (an)",
        timeline_color_off: "Zeitstrahlfarbe (aus)",
        timeline_color_unknown: "Zeitstrahlfarbe (unbekannt)",
      },
    },
    helpers: {
      [LANGUAGE_EN]: {
        entities: "Leave empty to auto-detect Proxmox uptime sensors.",
        match: "Regular expressions matched against entity IDs (one per line).",
        exclude: "Patterns to exclude (one per line).",
        language_mode: "Select a fixed editor language or follow Home Assistant.",
        names_raw: "Use 'entity_id = Friendly Name' per line to override names.",
        show_all:
          "Remove the Proxmox integration filter when picking binary sensors.",
        name_filters:
          "Provide words or phrases (one per line) to strip from entity names.",
        icons_raw:
          "Use 'entity_id = mdi:icon-name' per line to override timeline icons.",
        timeline_color_on: "Color applied when a sensor reports ON (uptime).",
        timeline_color_off: "Color applied when a sensor reports OFF (downtime).",
        timeline_color_unknown:
          "Color applied when the sensor state is unknown or unavailable.",
      },
      [LANGUAGE_DE]: {
        entities:
          "Leer lassen, um Proxmox-Uptime-Sensoren automatisch zu erkennen.",
        match: "Reguläre Ausdrücke für Entity-IDs (eine pro Zeile).",
        exclude: "Auszuschließende Muster (eine pro Zeile).",
        language_mode: "Feste Editor-Sprache wählen oder Home Assistant folgen.",
        names_raw:
          "'entity_id = Anzeigename' pro Zeile für Namensüberschreibungen.",
        show_all:
          "Entfernt den Proxmox-Filter bei der Auswahl von Binary-Sensoren.",
        name_filters:
          "Wörter oder Phrasen (eine pro Zeile), die aus den Namen entfernt werden sollen.",
        icons_raw:
          "'entity_id = mdi:icon-name' pro Zeile für Icon-Überschreibungen.",
        timeline_color_on: "Farbe, wenn der Sensor AN meldet (Uptime).",
        timeline_color_off: "Farbe, wenn der Sensor AUS meldet (Downtime).",
        timeline_color_unknown:
          "Farbe, wenn der Sensorzustand unbekannt oder nicht verfügbar ist.",
      },
    },
    intro: {
      [LANGUAGE_DE]:
        "Optional Filter konfigurieren oder erkannte Sensoren überschreiben. Lasse Entitäten leer, um die Auto-Erkennung zu nutzen.",
      [LANGUAGE_EN]:
        "Configure optional filters or override detected sensors. Leave entities empty to use auto-discovery.",
    },
    tabs: {
      general: { [LANGUAGE_DE]: "Allgemein", [LANGUAGE_EN]: "General" },
      filters: { [LANGUAGE_DE]: "Filter", [LANGUAGE_EN]: "Filters" },
      display: { [LANGUAGE_DE]: "Darstellung", [LANGUAGE_EN]: "Display" },
      advanced: { [LANGUAGE_DE]: "Erweitert", [LANGUAGE_EN]: "Advanced" },
    },
  };

  const INTRO_TEXT = { ...EDITOR_TEXTS.intro };

  const TAB_LABELS = Object.keys(EDITOR_TEXTS.tabs).reduce((acc, key) => {
    acc[key] = { ...EDITOR_TEXTS.tabs[key] };
    return acc;
  }, {});

  const resolveEditorLanguage = (formData, config, hass) => {
    const mode = formData?.language_mode || config?.language || LANGUAGE_AUTO;
    if (mode === LANGUAGE_AUTO) {
      const hassLang = hass?.locale?.language || hass?.language || LANGUAGE_EN;
      return hassLang.startsWith("de") ? LANGUAGE_DE : LANGUAGE_EN;
    }
    return SUPPORTED_LANGUAGES.includes(mode) ? mode : LANGUAGE_EN;
  };

  const normalizeForCompare = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => normalizeForCompare(item));
    }
    if (value && typeof value === "object") {
      return Object.keys(value)
        .sort()
        .reduce((acc, key) => {
          acc[key] = normalizeForCompare(value[key]);
          return acc;
        }, {});
    }
    return value;
  };

  const serializeConfig = (value) =>
    JSON.stringify(normalizeForCompare(value));

  const FIELD_SCHEMAS = {
    title: () => ({ name: "title", selector: { text: {} } }),
    entities: (lang, formData) => {
      const showAll = !!formData?.show_all;
      const selector = {
        multiple: true,
        domain: "binary_sensor",
      };
      if (!showAll) {
        selector.integration = "proxmoxve";
      }
      return {
        name: "entities",
        selector: {
          entity: selector,
        },
      };
    },
    match: () => ({ name: "match", selector: { text: { multiline: true } } }),
    exclude: () => ({ name: "exclude", selector: { text: { multiline: true } } }),
    language_mode: (lang) => ({
      name: "language_mode",
      selector: {
        select: {
          mode: "dropdown",
          options: SUPPORTED_LANGUAGES.map((value) => ({
            value,
            label:
              LANGUAGE_OPTION_LABELS[value]?.[lang] ||
              LANGUAGE_OPTION_LABELS[value]?.[LANGUAGE_EN] ||
              value,
          })),
        },
      },
    }),
    names_raw: () => ({ name: "names_raw", selector: { text: { multiline: true } } }),
    hours_to_show: () => ({ name: "hours_to_show", selector: { number: { min: 1 } } }),
    show_names: () => ({ name: "show_names", selector: { boolean: {} } }),
    name_filters: () => ({ name: "name_filters", selector: { text: { multiline: true } } }),
    icons_raw: () => ({ name: "icons_raw", selector: { text: { multiline: true } } }),
    show_all: () => ({ name: "show_all", selector: { boolean: {} } }),
    timeline_color_on: () => null,
    timeline_color_off: () => null,
    timeline_color_unknown: () => null,
  };

  const createEditorSchemas = (lang, formData) => {
    const schemas = {};
    EDITOR_TABS.forEach((tab) => {
      schemas[tab.key] = tab.fields
        .map((field) =>
          FIELD_SCHEMAS[field]
            ? FIELD_SCHEMAS[field](lang, formData)
            : { name: field }
        )
        .filter(Boolean)
        .map((schema) => ({ ...schema }));
    });
    return schemas;
  };

  const LABEL_MAP = {
    [LANGUAGE_DE]: EDITOR_TEXTS.labels[LANGUAGE_DE],
    [LANGUAGE_EN]: EDITOR_TEXTS.labels[LANGUAGE_EN],
    default: EDITOR_TEXTS.labels[LANGUAGE_EN],
  };

  const HELPER_MAP = {
    [LANGUAGE_DE]: EDITOR_TEXTS.helpers[LANGUAGE_DE],
    [LANGUAGE_EN]: EDITOR_TEXTS.helpers[LANGUAGE_EN],
    default: EDITOR_TEXTS.helpers[LANGUAGE_EN],
  };

  const PATTERN_SEPARATOR = "\n";

  const serializePatternList = (value) => {
    if (!value) {
      return "";
    }
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).join(PATTERN_SEPARATOR);
    }
    return String(value);
  };

  const parsePatternList = (value) => {
    if (!value) {
      return undefined;
    }
    const entries = String(value)
      .split(PATTERN_SEPARATOR)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!entries.length) {
      return undefined;
    }
    return entries.length === 1 ? entries[0] : entries;
  };

  const parseNameFilters = (value) => {
    const parsed = parsePatternList(value);
    if (!parsed) {
      return undefined;
    }
    const filters = (Array.isArray(parsed) ? parsed : [parsed])
      .map((item) => String(item).trim())
      .filter(Boolean);
    return filters.length ? filters : undefined;
  };

  const serializeNames = (names) => {
    if (!names) {
      return "";
    }
    return Object.entries(names)
      .map(([entity, name]) => `${entity} = ${name}`)
      .join("\n");
  };

  const serializeIcons = (icons) => {
    if (!icons) {
      return "";
    }
    return Object.entries(icons)
      .map(([entity, icon]) => `${entity} = ${icon}`)
      .join("\n");
  };

  const parseNames = (value) => {
    if (!value) {
      return undefined;
    }
    const entries = {};
    String(value)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
          return;
        }
        const entity = line.slice(0, separatorIndex).trim();
        const name = line.slice(separatorIndex + 1).trim();
        if (entity && name) {
          entries[entity] = name;
        }
      });
    return Object.keys(entries).length ? entries : undefined;
  };

  const parseIcons = (value) => {
    if (!value) {
      return undefined;
    }
    const entries = {};
    String(value)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
          return;
        }
        const entity = line.slice(0, separatorIndex).trim();
        const icon = line.slice(separatorIndex + 1).trim();
        if (entity && icon) {
          entries[entity] = icon;
        }
      });
    return Object.keys(entries).length ? entries : undefined;
  };

  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return undefined;
    }
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : undefined;
  };

  const MANAGED_KEYS = [
    "entities",
    "title",
    "match",
    "exclude",
    "show_all",
    "names",
    "icons",
    "name_filters",
    "hours_to_show",
    "show_names",
    "language",
    "timeline_color_on",
    "timeline_color_off",
    "timeline_color_unknown",
  ];

  class ProxmoxUptimeCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._config = undefined;
      this._formData = {};
      this._hass = undefined;
      this._activeTab = "general";
      this._pendingConfigSignature = undefined;
      this._currentConfigSignature = undefined;
      this._formElement = undefined;
      this._handleValueChanged = this._handleValueChanged.bind(this);
    }

    setConfig(config) {
      const signature = serializeConfig(config);
      if (this._pendingConfigSignature === signature) {
        this._pendingConfigSignature = undefined;
        this._config = { ...config };
        this._currentConfigSignature = signature;
        return;
      }
      if (this._currentConfigSignature === signature) {
        this._config = { ...config };
        return;
      }
      this._pendingConfigSignature = undefined;
      this._config = { ...config };
      this._currentConfigSignature = signature;
      this._formData = this._createFormData(this._config);
      this._render();
    }

    set hass(value) {
      if (this._hass === value) {
        return;
      }
      const previousLanguage = resolveEditorLanguage(
        this._formData,
        this._config,
        this._hass
      );
      this._hass = value;
      const nextLanguage = resolveEditorLanguage(
        this._formData,
        this._config,
        this._hass
      );
      if (this._formElement) {
        this._formElement.hass = value;
      }
      if (previousLanguage !== nextLanguage) {
        this._render();
      }
    }

    get hass() {
      return this._hass;
    }

    connectedCallback() {
      this._render();
    }

    _createFormData(config) {
      return {
        entities: Array.isArray(config.entities)
          ? config.entities.map((entry) =>
              typeof entry === "string" ? entry : entry.entity
            )
          : undefined,
        title: config.title || "",
        match: serializePatternList(config.match ?? DEFAULT_FILTER),
        exclude: serializePatternList(config.exclude),
        language_mode: config.language || LANGUAGE_AUTO,
        names_raw: serializeNames(config.names),
        icons_raw: serializeIcons(config.icons),
        show_all: config.show_all || false,
        hours_to_show: config.hours_to_show,
        show_names: config.show_names ?? true,
        name_filters: serializePatternList(config.name_filters),
        timeline_color_on: config.timeline_color_on || "",
        timeline_color_off: config.timeline_color_off || "",
        timeline_color_unknown: config.timeline_color_unknown || "",
      };
    }

    _computeLabel(schema) {
      const lang = this._resolveLanguage();
      const labels = LABEL_MAP[lang] || LABEL_MAP.default;
      return labels[schema.name] || schema.name;
    }

    _computeHelper(schema) {
      const lang = this._resolveLanguage();
      const helpers = HELPER_MAP[lang] || HELPER_MAP.default;
      return helpers[schema.name] || "";
    }

    _resolveLanguage() {
      return resolveEditorLanguage(this._formData, this._config, this.hass);
    }

    _render() {
      if (!this.shadowRoot) {
        return;
      }

      if (this._formElement) {
        this._formElement.removeEventListener(
          "value-changed",
          this._handleValueChanged
        );
        this._formElement = undefined;
      }

      this.shadowRoot.innerHTML = "";

      const lang = this._resolveLanguage();
      const schemas = createEditorSchemas(lang, this._formData);
      if (!this._activeTab || !schemas[this._activeTab]) {
        this._activeTab = EDITOR_TABS[0]?.key || "general";
      }
      const activeSchema = schemas[this._activeTab] || [];

      const style = document.createElement("style");
      style.textContent = `
        :host {
          display: block;
        }
        .intro {
          color: var(--secondary-text-color);
          margin-bottom: 12px;
          font-size: 0.9rem;
        }
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        }
        .tab-button {
          background: none;
          border: none;
          padding: 8px 12px;
          margin: 0;
          cursor: pointer;
          font: inherit;
          color: var(--primary-text-color);
          border-bottom: 2px solid transparent;
        }
        .tab-button:hover {
          color: var(--primary-color);
        }
        .tab-button.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
          font-weight: 600;
        }
        .color-section {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }
        .color-row {
          display: grid;
          gap: 6px;
        }
        .color-label {
          font-weight: 600;
        }
        .color-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .color-picker {
          width: 42px;
          height: 32px;
          padding: 0;
          border: none;
          background: none;
        }
        .color-picker.placeholder {
          opacity: 0.5;
        }
        .color-text {
          flex: 1;
          min-width: 120px;
          font: inherit;
          padding: 6px 8px;
          border-radius: 4px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
        }
        .color-reset {
          border: none;
          background: none;
          color: var(--primary-color);
          font: inherit;
          cursor: pointer;
          padding: 4px 6px;
        }
        .color-reset:hover,
        .color-reset:focus {
          text-decoration: underline;
        }
        .color-helper {
          color: var(--secondary-text-color);
          font-size: 0.85rem;
        }
        .version-info {
          margin-top: 12px;
          color: var(--secondary-text-color);
          font-size: 0.9rem;
        }
      `;

      this.shadowRoot.append(style);

      const intro = document.createElement("div");
      intro.className = "intro";
      intro.textContent = INTRO_TEXT[lang] || INTRO_TEXT[LANGUAGE_EN];
      this.shadowRoot.append(intro);

      if (EDITOR_TABS.length > 1) {
        const tabs = document.createElement("div");
        tabs.className = "tabs";
        EDITOR_TABS.forEach((tab) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `tab-button${
            this._activeTab === tab.key ? " active" : ""
          }`;
          button.textContent =
            TAB_LABELS[tab.key]?.[lang] ||
            TAB_LABELS[tab.key]?.[LANGUAGE_EN] ||
            tab.key;
          button.addEventListener("click", () => {
            if (this._activeTab !== tab.key) {
              this._activeTab = tab.key;
              this._render();
            }
          });
          tabs.append(button);
        });
        this.shadowRoot.append(tabs);
      }

      const form = document.createElement("ha-form");
      form.schema = activeSchema;
      form.data = { ...this._formData };
      form.hass = this.hass;
      form.computeLabel = (schema) => this._computeLabel(schema);
      form.computeHelper = (schema) => this._computeHelper(schema);
      form.addEventListener("value-changed", this._handleValueChanged);

      this._formElement = form;
      this.shadowRoot.append(form);

      if (this._activeTab === "display") {
        this._renderColorEditors(lang);
      }

      if (this._activeTab === "advanced") {
        const versionInfo = document.createElement("div");
        versionInfo.className = "version-info";
        const advancedLang = this._resolveLanguage();
        versionInfo.textContent =
          (advancedLang === LANGUAGE_DE
            ? `Kartenversion: ${CARD_VERSION}`
            : `Card version: ${CARD_VERSION}`);
        this.shadowRoot.append(versionInfo);
      }
    }

    _renderColorEditors(lang) {
      const colorSection = document.createElement("div");
      colorSection.className = "color-section";
      const resetLabel = lang === LANGUAGE_DE ? "Zurücksetzen" : "Reset";
      const placeholderExample =
        lang === LANGUAGE_DE
          ? "z. B. #12AB34, rgb(0, 170, 255) oder var(--farbe)"
          : "e.g. #12AB34, rgb(0, 170, 255) or var(--color)";

      COLOR_FIELDS.forEach((field) => {
        const fieldName = field.name;
        const value = this._formData?.[fieldName] ?? "";
        const schemaStub = { name: fieldName };
        const labelText = this._computeLabel(schemaStub);
        const helperText = this._computeHelper(schemaStub);
        const inputId = `color-${fieldName}`;

        const row = document.createElement("div");
        row.className = "color-row";

        const label = document.createElement("label");
        label.className = "color-label";
        label.setAttribute("for", inputId);
        label.textContent = labelText;
        row.append(label);

        const controls = document.createElement("div");
        controls.className = "color-controls";

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.id = inputId;
        colorInput.className = "color-picker";
        colorInput.setAttribute("aria-label", labelText);

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.className = "color-text";
        textInput.placeholder = placeholderExample;
        textInput.value = value || "";

        const applyColorPreview = (raw) => {
          const normalizedHex = normalizeHexColorValue(raw);
          if (normalizedHex) {
            colorInput.value = normalizedHex;
            colorInput.classList.remove("placeholder");
            colorInput.dataset.placeholder = "false";
            colorInput.title = normalizedHex;
          } else {
            colorInput.value = "#000000";
            colorInput.classList.add("placeholder");
            colorInput.dataset.placeholder = "true";
            colorInput.title = raw
              ? lang === LANGUAGE_DE
                ? "Vorschau zeigt Platzhalter, da kein Hex-Farbwert"
                : "Preview shows placeholder because value is not hex"
              : lang === LANGUAGE_DE
              ? "Keine Farbe gesetzt"
              : "No color set";
          }
        };

        applyColorPreview(value);

        colorInput.addEventListener("input", (event) => {
          const colorValue = event.target.value;
          textInput.value = colorValue;
          applyColorPreview(colorValue);
          this._handleColorFieldChange(fieldName, colorValue);
        });

        textInput.addEventListener("input", () => {
          applyColorPreview(textInput.value.trim());
        });

        textInput.addEventListener("change", () => {
          const newValue = textInput.value.trim();
          applyColorPreview(newValue);
          this._handleColorFieldChange(fieldName, newValue);
        });

        textInput.addEventListener("blur", () => {
          const newValue = textInput.value.trim();
          applyColorPreview(newValue);
          this._handleColorFieldChange(fieldName, newValue);
        });

        const resetButton = document.createElement("button");
        resetButton.type = "button";
        resetButton.className = "color-reset";
        resetButton.textContent = resetLabel;
        resetButton.addEventListener("click", () => {
          textInput.value = "";
          applyColorPreview("");
          this._handleColorFieldChange(fieldName, "");
        });

        controls.append(colorInput, textInput, resetButton);
        row.append(controls);

        if (helperText) {
          const helper = document.createElement("div");
          helper.className = "color-helper";
          helper.textContent = helperText;
          row.append(helper);
        }

        colorSection.append(row);
      });

      this.shadowRoot.append(colorSection);
    }

    _syncFormElementData() {
      if (this._formElement) {
        this._formElement.data = { ...this._formData };
      }
    }

    _commitFormData(nextData) {
      const nextFormData = nextData ? { ...nextData } : {};
      const previousLanguage = this._resolveLanguage();
      const previousShowAll = !!this._formData?.show_all;
      this._formData = nextFormData;
      const newConfig = this._createConfigFromForm();
      this._config = newConfig;
      this._pendingConfigSignature = serializeConfig(newConfig);
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: newConfig },
          bubbles: true,
          composed: true,
        })
      );
      this._syncFormElementData();
      const nextLanguage = this._resolveLanguage();
      const nextShowAll = !!this._formData?.show_all;
      if (previousLanguage !== nextLanguage || previousShowAll !== nextShowAll) {
        this._render();
      }
    }

    _handleColorFieldChange(fieldName, rawValue) {
      const value = typeof rawValue === "string" ? rawValue.trim() : "";
      const current = this._formData?.[fieldName] ?? "";
      if (current === value) {
        return;
      }
      const nextFormData = { ...this._formData, [fieldName]: value };
      this._commitFormData(nextFormData);
    }

    _handleValueChanged(event) {
      event.stopPropagation();
      const nextData = event.detail.value || {};
      this._commitFormData(nextData);
    }

    _createConfigFromForm() {
      const form = this._formData || {};
      const config = { type: "custom:proxmox-uptime-card" };

      const existingConfig = this._config || {};
      Object.keys(existingConfig).forEach((key) => {
        if (!MANAGED_KEYS.includes(key) && existingConfig[key] !== undefined) {
          config[key] = existingConfig[key];
        }
      });

      if (Array.isArray(form.entities) && form.entities.length) {
        config.entities = form.entities;
      }

      const title = form.title?.trim();
      if (title) {
        config.title = title;
      }

      const match = parsePatternList(form.match);
      if (match) {
        config.match = match;
      }

      const exclude = parsePatternList(form.exclude);
      if (exclude) {
        config.exclude = exclude;
      }

      if (form.show_all) {
        config.show_all = true;
      }

      const language = form.language_mode;
      if (language && SUPPORTED_LANGUAGES.includes(language) && language !== LANGUAGE_AUTO) {
        config.language = language;
      }

      const names = parseNames(form.names_raw);
      if (names) {
        config.names = names;
      }

      const icons = parseIcons(form.icons_raw);
      if (icons) {
        config.icons = icons;
      }

      const hoursToShow = toNumber(form.hours_to_show);
      if (hoursToShow !== undefined) {
        config.hours_to_show = hoursToShow;
      }

      if (form.show_names !== undefined) {
        config.show_names = form.show_names;
      }

      const nameFilters = parseNameFilters(form.name_filters);
      if (nameFilters) {
        config.name_filters = nameFilters;
      }

      const timelineColorOn = form.timeline_color_on ? String(form.timeline_color_on).trim() : "";
      if (timelineColorOn) {
        config.timeline_color_on = timelineColorOn;
      }

      const timelineColorOff = form.timeline_color_off ? String(form.timeline_color_off).trim() : "";
      if (timelineColorOff) {
        config.timeline_color_off = timelineColorOff;
      }

      const timelineColorUnknown = form.timeline_color_unknown ? String(form.timeline_color_unknown).trim() : "";
      if (timelineColorUnknown) {
        config.timeline_color_unknown = timelineColorUnknown;
      }

      return config;
    }
  }

  customElements.define("proxmox-uptime-card-editor", ProxmoxUptimeCardEditor);
};

const toArray = (value) => {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const getEntityIdFromEntry = (entry) => {
  if (!entry) {
    return undefined;
  }
  if (typeof entry === "string") {
    return entry;
  }
  if (typeof entry === "object") {
    if (typeof entry.entity === "string") {
      return entry.entity;
    }
    if (typeof entry.entity_id === "string") {
      return entry.entity_id;
    }
  }
  return undefined;
};

const isBinarySensorEntityId = (entityId) =>
  typeof entityId === "string" && entityId.startsWith("binary_sensor.");

const filterBinarySensorEntries = (entries) =>
  entries.filter((entry) => isBinarySensorEntityId(getEntityIdFromEntry(entry)));

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const applyNameFilters = (name, filters) => {
  if (!filters || !filters.length) {
    return typeof name === "string" ? name : String(name ?? "");
  }

  const source = typeof name === "string" ? name : String(name ?? "");
  if (!source) {
    return source;
  }

  let result = source;
  filters.forEach((rawFilter) => {
    const filter = String(rawFilter).trim();
    if (!filter) {
      return;
    }
    const pattern = escapeRegExp(filter);
    if (!pattern) {
      return;
    }
    const regex = new RegExp(pattern, "gi");
    result = result.replace(regex, " ");
  });

  const normalized = result.replace(/\s+/g, " ").trim();
  const fallback = source.trim();
  return normalized || fallback;
};


const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");


const normalizeCssColor = (() => {
  let canvas;
  let context;
  return (value) => {
    if (!value) {
      return "";
    }
    canvas = canvas || document.createElement("canvas");
    context = context || canvas.getContext("2d");
    if (!context) {
      return String(value);
    }
    try {
      context.fillStyle = "#000000";
      context.fillStyle = value;
      return context.fillStyle || String(value);
    } catch (err) {
      return String(value);
    }
  };
})();

const applyAlphaToColor = (value, alpha = 0.2) => {
  if (!value) {
    return "";
  }
  const normalized = normalizeCssColor(value).trim();
  if (!normalized) {
    return "";
  }
  const safeAlpha = Number.isFinite(alpha) ? Math.min(1, Math.max(0, alpha)) : 0.2;
  const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
  }
  const rgbMatch = normalized.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
  }
  const rgbaMatch = normalized.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9]*\.?[0-9]+)\s*\)$/i);
  if (rgbaMatch) {
    const r = Number(rgbaMatch[1]);
    const g = Number(rgbaMatch[2]);
    const b = Number(rgbaMatch[3]);
    return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
  }
  return normalized;
};

const TIMELINE_STATE_ON = "on";
const TIMELINE_STATE_OFF = "off";
const TIMELINE_STATE_UNKNOWN = "unknown";

const TIMELINE_DEFAULT_COLORS = {
  [TIMELINE_STATE_ON]: "#4caf50",
  [TIMELINE_STATE_UNKNOWN]: "#ffeb3b",
  [TIMELINE_STATE_OFF]: "#f44336",
};

const TIMELINE_ON_ALIASES = new Set([
  "on",
  "open",
  "running",
  "true",
  "1",
  "up",
]);

const TIMELINE_OFF_ALIASES = new Set([
  "off",
  "closed",
  "stopped",
  "false",
  "0",
  "down",
]);

const TIMELINE_UNKNOWN_ALIASES = new Set([
  "unknown",
  "unavailable",
  "undefined",
  "none",
  "idle",
  "standby",
]);

const TIMELINE_ORIGINAL_COLORS_KEY = "__proxmoxTimelineOriginalColors";
const TIMELINE_SIGNATURE_KEY = "__proxmoxTimelineSignature";
const TIMELINE_ORIGINAL_STYLE_KEY = "__proxmoxTimelineOriginalStyles";
const TIMELINE_ELEMENT_SIGNATURE_KEY = "__proxmoxTimelineElementSignature";

const COLOR_FIELDS = [
  { name: "timeline_color_on" },
  { name: "timeline_color_off" },
  { name: "timeline_color_unknown" },
];

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const isSimpleHexColor = (value) =>
  typeof value === "string" && HEX_COLOR_PATTERN.test(value.trim());

const normalizeHexColorValue = (value) => {
  if (!isSimpleHexColor(value)) {
    return undefined;
  }
  const hex = value.trim().replace(/^#/, "").toLowerCase();
  if (hex.length === 3) {
    const expanded = hex
      .split("")
      .map((char) => char + char)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }
  return `#${hex.toUpperCase()}`;
};

const resolveTimelineStateFromRaw = (raw) => {
  if (raw === null || raw === undefined) {
    return TIMELINE_STATE_UNKNOWN;
  }
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (!normalized) {
      return TIMELINE_STATE_UNKNOWN;
    }
    if (TIMELINE_UNKNOWN_ALIASES.has(normalized)) {
      return TIMELINE_STATE_UNKNOWN;
    }
    if (TIMELINE_ON_ALIASES.has(normalized)) {
      return TIMELINE_STATE_ON;
    }
    if (TIMELINE_OFF_ALIASES.has(normalized)) {
      return TIMELINE_STATE_OFF;
    }
    const numeric = Number(normalized);
    if (Number.isFinite(numeric)) {
      if (numeric > 0) {
        return TIMELINE_STATE_ON;
      }
      if (numeric === 0) {
        return TIMELINE_STATE_OFF;
      }
      return TIMELINE_STATE_OFF;
    }
    return undefined;
  }
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) {
      return undefined;
    }
    if (raw > 0) {
      return TIMELINE_STATE_ON;
    }
    if (raw === 0) {
      return TIMELINE_STATE_OFF;
    }
    return TIMELINE_STATE_OFF;
  }
  if (typeof raw === "boolean") {
    return raw ? TIMELINE_STATE_ON : TIMELINE_STATE_OFF;
  }
  if (raw instanceof Date) {
    return undefined;
  }
  if (typeof raw === "object") {
    if (raw.isUnknown || raw.is_unknown || raw.isUnavailable || raw.is_unavailable) {
      return TIMELINE_STATE_UNKNOWN;
    }
    if ("state" in raw) {
      const resolved = resolveTimelineStateFromRaw(raw.state);
      if (resolved) {
        return resolved;
      }
    }
    if ("s" in raw) {
      const resolved = resolveTimelineStateFromRaw(raw.s);
      if (resolved) {
        return resolved;
      }
    }
    if ("value" in raw) {
      const resolved = resolveTimelineStateFromRaw(raw.value);
      if (resolved) {
        return resolved;
      }
    }
    if ("v" in raw) {
      const resolved = resolveTimelineStateFromRaw(raw.v);
      if (resolved) {
        return resolved;
      }
    }
    if ("y" in raw) {
      const resolved = resolveTimelineStateFromRaw(raw.y);
      if (resolved) {
        return resolved;
      }
    }
    if ("is_on" in raw || "isOn" in raw) {
      const resolved = resolveTimelineStateFromRaw(raw.is_on ?? raw.isOn);
      if (resolved) {
        return resolved;
      }
    }
    if ("is_off" in raw || "isOff" in raw) {
      const resolved = resolveTimelineStateFromRaw(raw.is_off ?? raw.isOff);
      if (resolved) {
        return resolved;
      }
    }
  }
  return undefined;
};

const extractRawFromContext = (context) => {
  if (!context) {
    return undefined;
  }
  if (context.raw !== undefined) {
    return context.raw;
  }
  if (context.element?.$context?.raw !== undefined) {
    return context.element.$context.raw;
  }
  if (context.parsed !== undefined) {
    if (context.parsed.y !== undefined) {
      return context.parsed.y;
    }
    if (context.parsed.state !== undefined) {
      return context.parsed.state;
    }
    if (context.parsed.value !== undefined) {
      return context.parsed.value;
    }
  }
  if (context.p0?.raw !== undefined) {
    return context.p0.raw;
  }
  if (context.p1?.raw !== undefined) {
    return context.p1.raw;
  }
  if (context.p0?.parsed !== undefined) {
    if (context.p0.parsed.y !== undefined) {
      return context.p0.parsed.y;
    }
    if (context.p0.parsed.state !== undefined) {
      return context.p0.parsed.state;
    }
    if (context.p0.parsed.value !== undefined) {
      return context.p0.parsed.value;
    }
  }
  if (context.p1?.parsed !== undefined) {
    if (context.p1.parsed.y !== undefined) {
      return context.p1.parsed.y;
    }
    if (context.p1.parsed.state !== undefined) {
      return context.p1.parsed.state;
    }
    if (context.p1.parsed.value !== undefined) {
      return context.p1.parsed.value;
    }
  }
  if (Array.isArray(context.dataset?.data) && context.dataIndex !== undefined) {
    return context.dataset.data[context.dataIndex];
  }
  return undefined;
};

const buildFallbackProvider = (value) => {
  if (typeof value === "function") {
    return (ctx) => value(ctx);
  }
  if (Array.isArray(value)) {
    return (ctx) => {
      if (!ctx || ctx.dataIndex === undefined) {
        return value[0];
      }
      const index = ctx.dataIndex % value.length;
      return value[index];
    };
  }
  if (value && typeof value === "object") {
    return () => value;
  }
  return () => value;
};

const createSegmentFallbackProvider = (segment, key, fallback) => {
  if (!segment) {
    return fallback;
  }
  const segmentValue = segment[key];
  if (typeof segmentValue === "function") {
    return (ctx) => segmentValue(ctx);
  }
  if (segmentValue !== undefined) {
    return () => segmentValue;
  }
  return fallback;
};

const extractRawFromDataPoint = (point) => {
  if (!point || typeof point !== "object") {
    return point;
  }
  if (point.state !== undefined) {
    return point.state;
  }
  if (point.raw !== undefined) {
    return point.raw;
  }
  if (point.v !== undefined) {
    return point.v;
  }
  if (point.value !== undefined) {
    return point.value;
  }
  if (point.y !== undefined) {
    return point.y;
  }
  if (point.is_on !== undefined) {
    return point.is_on ? TIMELINE_STATE_ON : TIMELINE_STATE_OFF;
  }
  if (point.isUnknown || point.is_unknown || point.isUnavailable || point.is_unavailable) {
    return TIMELINE_STATE_UNKNOWN;
  }
  return point;
};

const applyTimelineColorsToDataset = (dataset, config) => {
  if (!dataset || !config) {
    return false;
  }

  const { colors, fills, fallback, fallbackFill, signature } = config;
  if (!colors.on && !colors.off && !colors.unknown) {
    return false;
  }

  if (!dataset[TIMELINE_ORIGINAL_COLORS_KEY]) {
    dataset[TIMELINE_ORIGINAL_COLORS_KEY] = {
      borderColor: dataset.borderColor,
      backgroundColor: dataset.backgroundColor,
      pointBackgroundColor: dataset.pointBackgroundColor,
      pointBorderColor: dataset.pointBorderColor,
      pointHoverBackgroundColor: dataset.pointHoverBackgroundColor,
      pointHoverBorderColor: dataset.pointHoverBorderColor,
      segment: dataset.segment,
    };
  }

  const originals = dataset[TIMELINE_ORIGINAL_COLORS_KEY];
  const borderFallback = buildFallbackProvider(originals.borderColor);
  const backgroundFallback = buildFallbackProvider(originals.backgroundColor);
  const pointBackgroundFallback = buildFallbackProvider(originals.pointBackgroundColor);
  const pointBorderFallback = buildFallbackProvider(originals.pointBorderColor);
  const pointHoverBackgroundFallback = buildFallbackProvider(originals.pointHoverBackgroundColor);
  const pointHoverBorderFallback = buildFallbackProvider(originals.pointHoverBorderColor);
  const segmentFallback = originals.segment;
  const segmentBorderFallback = createSegmentFallbackProvider(
    segmentFallback,
    "borderColor",
    borderFallback
  );
  const segmentBackgroundFallback = createSegmentFallbackProvider(
    segmentFallback,
    "backgroundColor",
    backgroundFallback
  );

  const resolveColor = (raw) => {
    const state = resolveTimelineStateFromRaw(raw);
    if (!state) {
      return fallback;
    }
    if (state === TIMELINE_STATE_ON) {
      return colors.on ?? fallback;
    }
    if (state === TIMELINE_STATE_OFF) {
      return colors.off ?? fallback;
    }
    if (state === TIMELINE_STATE_UNKNOWN) {
      return colors.unknown ?? fallback;
    }
    return fallback;
  };

  const resolveFill = (raw) => {
    const state = resolveTimelineStateFromRaw(raw);
    if (!state) {
      return fallbackFill;
    }
    if (state === TIMELINE_STATE_ON) {
      return fills.on ?? fallbackFill;
    }
    if (state === TIMELINE_STATE_OFF) {
      return fills.off ?? fallbackFill;
    }
    if (state === TIMELINE_STATE_UNKNOWN) {
      return fills.unknown ?? fallbackFill;
    }
    return fallbackFill;
  };

  const dataItems = Array.isArray(dataset.data) ? dataset.data : [];
  const borderColorsArray = [];
  const backgroundColorsArray = [];
  const pointBackgroundArray = [];
  const pointBorderArray = [];
  const pointHoverBackgroundArray = [];
  const pointHoverBorderArray = [];

  dataItems.forEach((item, index) => {
    const raw = extractRawFromDataPoint(item);
    const color = resolveColor(raw) ?? borderFallback({ dataIndex: index });
    const fill = resolveFill(raw) ?? backgroundFallback({ dataIndex: index });
    if (item && typeof item === "object") {
      item.color = color;
      item.borderColor = color;
      item.backgroundColor = fill;
      item.timelineColor = color;
      item.timelineFill = fill;
    }
    borderColorsArray.push(color);
    backgroundColorsArray.push(fill);
    pointBackgroundArray.push(color);
    pointBorderArray.push(color);
    pointHoverBackgroundArray.push(color);
    pointHoverBorderArray.push(color);
  });

  dataset.borderColor = (ctx) => {
    if (ctx && ctx.dataIndex !== undefined && borderColorsArray[ctx.dataIndex] !== undefined) {
      return borderColorsArray[ctx.dataIndex];
    }
    const raw = extractRawFromContext(ctx);
    const color = resolveColor(raw);
    return color ?? borderFallback(ctx);
  };

  dataset.backgroundColor = (ctx) => {
    if (ctx && ctx.dataIndex !== undefined && backgroundColorsArray[ctx.dataIndex] !== undefined) {
      return backgroundColorsArray[ctx.dataIndex];
    }
    const raw = extractRawFromContext(ctx);
    const color = resolveFill(raw);
    return color ?? backgroundFallback(ctx);
  };

  dataset.pointBackgroundColor = (ctx) => {
    if (ctx && ctx.dataIndex !== undefined && pointBackgroundArray[ctx.dataIndex] !== undefined) {
      return pointBackgroundArray[ctx.dataIndex];
    }
    const raw = extractRawFromContext(ctx);
    const color = resolveColor(raw);
    return color ?? pointBackgroundFallback(ctx);
  };

  dataset.pointBorderColor = (ctx) => {
    if (ctx && ctx.dataIndex !== undefined && pointBorderArray[ctx.dataIndex] !== undefined) {
      return pointBorderArray[ctx.dataIndex];
    }
    const raw = extractRawFromContext(ctx);
    const color = resolveColor(raw);
    return color ?? pointBorderFallback(ctx);
  };

  dataset.pointHoverBackgroundColor = (ctx) => {
    if (ctx && ctx.dataIndex !== undefined && pointHoverBackgroundArray[ctx.dataIndex] !== undefined) {
      return pointHoverBackgroundArray[ctx.dataIndex];
    }
    const raw = extractRawFromContext(ctx);
    const color = resolveColor(raw);
    return color ?? pointHoverBackgroundFallback(ctx);
  };

  dataset.pointHoverBorderColor = (ctx) => {
    if (ctx && ctx.dataIndex !== undefined && pointHoverBorderArray[ctx.dataIndex] !== undefined) {
      return pointHoverBorderArray[ctx.dataIndex];
    }
    const raw = extractRawFromContext(ctx);
    const color = resolveColor(raw);
    return color ?? pointHoverBorderFallback(ctx);
  };

  dataset.segment = {
    ...(segmentFallback || {}),
    borderColor: (ctx) => {
      const raw = extractRawFromContext(ctx);
      const color = resolveColor(raw);
      return color ?? segmentBorderFallback(ctx);
    },
    backgroundColor: (ctx) => {
      const raw = extractRawFromContext(ctx);
      const color = resolveFill(raw);
      return color ?? segmentBackgroundFallback(ctx);
    },
  };

  if (dataset.timeline && typeof dataset.timeline === "object") {
    dataset.timeline = {
      ...dataset.timeline,
      stateColors: {
        on: colors.on ?? config.fallback ?? dataset.timeline.stateColors?.on,
        off: colors.off ?? config.fallback ?? dataset.timeline.stateColors?.off,
        unknown:
          colors.unknown ?? config.fallback ?? dataset.timeline.stateColors?.unknown,
      },
    };
  }

  if (dataset.timelineLines && Array.isArray(dataset.timelineLines)) {
    dataset.timelineLines.forEach((line) => {
      if (!line || typeof line !== "object") {
        return;
      }
      const state = resolveTimelineStateFromRaw(line.state ?? line.raw ?? line.value);
      if (state === TIMELINE_STATE_ON && colors.on) {
        line.color = colors.on;
      } else if (state === TIMELINE_STATE_OFF && colors.off) {
        line.color = colors.off;
      } else if (state === TIMELINE_STATE_UNKNOWN && colors.unknown) {
        line.color = colors.unknown;
      }
    });
  }

  if (signature) {
    dataset[TIMELINE_SIGNATURE_KEY] = signature;
  }

  return true;
};

const resetTimelineDatasetColors = (dataset) => {
  if (!dataset || !dataset[TIMELINE_ORIGINAL_COLORS_KEY]) {
    return false;
  }
  const originals = dataset[TIMELINE_ORIGINAL_COLORS_KEY];
  dataset.borderColor = originals.borderColor;
  dataset.backgroundColor = originals.backgroundColor;
  dataset.pointBackgroundColor = originals.pointBackgroundColor;
  dataset.pointBorderColor = originals.pointBorderColor;
  dataset.pointHoverBackgroundColor = originals.pointHoverBackgroundColor;
  dataset.pointHoverBorderColor = originals.pointHoverBorderColor;
  dataset.segment = originals.segment;
  delete dataset[TIMELINE_ORIGINAL_COLORS_KEY];
  delete dataset[TIMELINE_SIGNATURE_KEY];
  return true;
};

const TIMELINE_STYLE_TARGETS = {
  on: [
    "--timeline-color-on",
    "--timeline-state-on-color",
    "--timeline-state-on",
    "--timeline-state-on-border",
    "--timeline-state-on-marker",
    "--timeline-color-on-background",
    "--timeline-state-on-background",
    "--state-on-color",
    "--state-active-color",
    "--state-binary_sensor-on-color",
    "--state-binary_sensor-active-color",
  ],
  off: [
    "--timeline-color-off",
    "--timeline-state-off-color",
    "--timeline-state-off",
    "--timeline-state-off-border",
    "--timeline-state-off-marker",
    "--timeline-color-off-background",
    "--timeline-state-off-background",
    "--state-off-color",
    "--state-inactive-color",
    "--state-binary_sensor-off-color",
    "--state-binary_sensor-inactive-color",
  ],
  unknown: [
    "--timeline-color-unknown",
    "--timeline-state-unknown-color",
    "--timeline-state-unknown",
    "--timeline-state-unknown-border",
    "--timeline-state-unknown-marker",
    "--timeline-color-unknown-background",
    "--timeline-state-unknown-background",
    "--history-unknown-color",
    "--history-unavailable-color",
    "--state-unknown-color",
    "--state-unavailable-color",
    "--state-binary_sensor-unknown-color",
    "--state-binary_sensor-unavailable-color",
  ],
};

const TIMELINE_STYLE_BACKGROUND_TARGETS = {
  on: [
    "--timeline-color-on-background",
    "--timeline-state-on-background",
  ],
  off: [
    "--timeline-color-off-background",
    "--timeline-state-off-background",
  ],
  unknown: [
    "--timeline-color-unknown-background",
    "--timeline-state-unknown-background",
  ],
};

const refreshStateHistoryTimeline = (timeline, signature) => {
  if (!timeline || timeline.tagName !== "STATE-HISTORY-CHART-TIMELINE") {
    return false;
  }

  if (timeline[TIMELINE_ELEMENT_SIGNATURE_KEY] === signature) {
    return false;
  }

  const currentData = timeline.data;
  if (!Array.isArray(currentData)) {
    timeline[TIMELINE_ELEMENT_SIGNATURE_KEY] = signature;
    return false;
  }

  const cloned = currentData.map((entry) => {
    if (!entry || typeof entry !== "object") {
      return entry;
    }
    const clone = { ...entry };
    if (Array.isArray(entry.data)) {
      clone.data = entry.data.map((item) =>
        item && typeof item === "object" ? { ...item } : item
      );
    }
    return clone;
  });

  try {
    timeline.data = cloned;
  } catch (err) {
    // Ignore write errors (read-only data bindings)
  }

  timeline[TIMELINE_ELEMENT_SIGNATURE_KEY] = signature;
  return true;
};

const buildTimelineDynamicStyleTargets = (timeline) => {
  const emptyTargets = {
    [TIMELINE_STATE_ON]: [],
    [TIMELINE_STATE_OFF]: [],
    [TIMELINE_STATE_UNKNOWN]: [],
  };

  if (!timeline || timeline.tagName !== "STATE-HISTORY-CHART-TIMELINE") {
    return emptyTargets;
  }

  const hass = timeline.hass;
  const data = Array.isArray(timeline.data) ? timeline.data : [];
  const accumulator = {
    [TIMELINE_STATE_ON]: new Set(),
    [TIMELINE_STATE_OFF]: new Set(),
    [TIMELINE_STATE_UNKNOWN]: new Set(),
  };

  const add = (stateKey, prop) => {
    if (!prop) {
      return;
    }
    accumulator[stateKey].add(prop);
  };

  data.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const entityId = entry.entity_id;
    if (!entityId || typeof entityId !== "string") {
      return;
    }
    const domain = entityId.split(".")[0];
    if (!domain) {
      return;
    }
    const stateObj = hass?.states?.[entityId];
    const deviceClassRaw = stateObj?.attributes?.device_class;
    const deviceClass = deviceClassRaw ? slugify(deviceClassRaw) : "";

    add(TIMELINE_STATE_ON, `--state-${domain}-on-color`);
    add(TIMELINE_STATE_OFF, `--state-${domain}-off-color`);
    add(TIMELINE_STATE_ON, `--state-${domain}-active-color`);
    add(TIMELINE_STATE_OFF, `--state-${domain}-inactive-color`);
    add(TIMELINE_STATE_UNKNOWN, `--state-${domain}-unknown-color`);
    add(TIMELINE_STATE_UNKNOWN, `--state-${domain}-unavailable-color`);

    if (deviceClass) {
      add(
        TIMELINE_STATE_ON,
        `--state-${domain}-${deviceClass}-on-color`
      );
      add(
        TIMELINE_STATE_OFF,
        `--state-${domain}-${deviceClass}-off-color`
      );
      add(
        TIMELINE_STATE_UNKNOWN,
        `--state-${domain}-${deviceClass}-unknown-color`
      );
    }
  });

  return {
    [TIMELINE_STATE_ON]: Array.from(accumulator[TIMELINE_STATE_ON]),
    [TIMELINE_STATE_OFF]: Array.from(accumulator[TIMELINE_STATE_OFF]),
    [TIMELINE_STATE_UNKNOWN]: Array.from(accumulator[TIMELINE_STATE_UNKNOWN]),
  };
};

const applyTimelineColorsToTimelines = (elements, config) => {
  if (!elements?.length || !config) {
    return false;
  }

  let applied = false;
  elements.forEach((timeline) => {
    if (!timeline) {
      return;
    }
    let timelineChanged = false;
    if (!timeline[TIMELINE_ORIGINAL_STYLE_KEY]) {
      timeline[TIMELINE_ORIGINAL_STYLE_KEY] = {};
    }
    const originals = timeline[TIMELINE_ORIGINAL_STYLE_KEY];
    const dynamicTargets = buildTimelineDynamicStyleTargets(timeline);

    const getColorForState = (stateKey) =>
      config.colors[stateKey] || config.fallback || "";
    const getFillForState = (stateKey) =>
      config.fills[stateKey] || config.fallbackFill || getColorForState(stateKey);

    [TIMELINE_STATE_ON, TIMELINE_STATE_OFF, TIMELINE_STATE_UNKNOWN].forEach((stateKey) => {
      const colorValue = getColorForState(stateKey);
      const fillValue = getFillForState(stateKey);
      const staticTargets = TIMELINE_STYLE_TARGETS[stateKey] || [];
      const combinedTargets = Array.from(
        new Set([...staticTargets, ...(dynamicTargets[stateKey] || [])])
      );
      const fillTargets = TIMELINE_STYLE_BACKGROUND_TARGETS[stateKey];

      combinedTargets.forEach((prop) => {
        if (!(prop in originals)) {
          originals[prop] = timeline.style.getPropertyValue(prop);
        }
        if (colorValue) {
          timeline.style.setProperty(prop, colorValue);
          timelineChanged = true;
        } else {
          if (timeline.style.getPropertyValue(prop)) {
            timelineChanged = true;
          }
          timeline.style.removeProperty(prop);
        }
      });

      fillTargets.forEach((prop) => {
        if (!(prop in originals)) {
          originals[prop] = timeline.style.getPropertyValue(prop);
        }
        if (fillValue) {
          timeline.style.setProperty(prop, fillValue);
          timelineChanged = true;
        } else {
          if (timeline.style.getPropertyValue(prop)) {
            timelineChanged = true;
          }
          timeline.style.removeProperty(prop);
        }
      });
    });

    if (
      timeline.tagName === "STATE-HISTORY-CHART-TIMELINE" &&
      refreshStateHistoryTimeline(timeline, config.signature)
    ) {
      timelineChanged = true;
    }

    if (timelineChanged) {
      applied = true;
    }
  });

  return applied;
};

const resetTimelineElementStyles = (elements) => {
  if (!elements?.length) {
    return false;
  }
  let changed = false;
  elements.forEach((timeline) => {
    const originals = timeline?.[TIMELINE_ORIGINAL_STYLE_KEY];
    if (!originals) {
      return;
    }
    Object.keys(originals).forEach((prop) => {
      const value = originals[prop];
      if (value) {
        timeline.style.setProperty(prop, value);
      } else {
        timeline.style.removeProperty(prop);
      }
    });
    refreshStateHistoryTimeline(timeline, undefined);
    delete timeline[TIMELINE_ORIGINAL_STYLE_KEY];
    delete timeline[TIMELINE_ELEMENT_SIGNATURE_KEY];
    changed = true;
  });
  return changed;
};

const prettifyEntityId = (entityId) => {
  const cleaned = entityId.replace(/^[^.]+\./, "");
  return cleaned
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const toRegExp = (value, defaultFlags = "i") => {
  if (value instanceof RegExp) {
    return value;
  }
  let pattern = String(value);
  let flags = defaultFlags;
  const match = pattern.match(/^\/(.*)\/([a-z]*)$/i);
  if (match) {
    pattern = match[1];
    flags = match[2];
    return new RegExp(pattern, flags);
  }
  try {
    return new RegExp(pattern, flags);
  } catch (err) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wildcard = escaped.replace(/\\\*/g, ".*");
    return new RegExp(`^${wildcard}$`, flags);
  }
};

const resolveLanguage = (config, hass) => {
  const configuredLanguage = config.language;
  if (
    configuredLanguage &&
    configuredLanguage !== LANGUAGE_AUTO &&
    SUPPORTED_LANGUAGES.includes(configuredLanguage)
  ) {
    return configuredLanguage;
  }
  const hassLang = hass?.locale?.language || hass?.language || LANGUAGE_EN;
  return hassLang.startsWith("de") ? LANGUAGE_DE : LANGUAGE_EN;
};

const computeEntities = (hass, config) => {
  if (!hass) {
    return [];
  }

  const providedEntitiesRaw = toArray(config.entities).filter(Boolean);
  const providedEntities = filterBinarySensorEntries(providedEntitiesRaw);
  const overrides = config.names || {};
  const iconOverrides = config.icons || {};
  const nameFilters = toArray(config.name_filters)
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (providedEntities.length) {
    return providedEntities
      .map((entry) => {
        const entityId = getEntityIdFromEntry(entry);
        if (!entityId) {
          return undefined;
        }
        const normalized =
          typeof entry === "string" ? { entity: entityId } : { ...entry };
        normalized.entity = entityId;
        if ("entity_id" in normalized) {
          delete normalized.entity_id;
        }

        const state = hass.states?.[entityId];
        const overrideName = overrides[entityId];
        let rawName;
        if (overrideName !== undefined && overrideName !== null) {
          rawName = overrideName;
        } else if (
          normalized.name !== undefined &&
          normalized.name !== null &&
          String(normalized.name).trim()
        ) {
          rawName = normalized.name;
        } else if (state?.attributes?.friendly_name) {
          rawName = state.attributes.friendly_name;
        } else {
          rawName = prettifyEntityId(entityId);
        }
        const filteredName = applyNameFilters(rawName, nameFilters);
        if (filteredName) {
          normalized.name = filteredName;
        } else {
          delete normalized.name;
        }

        const iconOverride = iconOverrides[entityId];
        const providedIcon =
          typeof normalized.icon === "string"
            ? normalized.icon.trim()
            : "";
        const stateIcon =
          typeof state?.attributes?.icon === "string"
            ? state.attributes.icon.trim()
            : "";
        const resolvedIcon = iconOverride || providedIcon || stateIcon;
        if (resolvedIcon) {
          normalized.icon = resolvedIcon;
        } else {
          delete normalized.icon;
        }

        return normalized;
      })
      .filter(Boolean);
  }

  const excludePatterns = toArray(config.exclude).map((value) => toRegExp(value));
  const states = Object.values(hass.states || {});

  const includePatterns = toArray(config.match ?? DEFAULT_FILTER).map((value) =>
    toRegExp(value)
  );

  let matchedStates = states.filter((state) => {
    if (!state?.entity_id) {
      return false;
    }
    const included = includePatterns.some((pattern) => pattern.test(state.entity_id));
    if (!included) {
      return false;
    }
    return true;
  });

  if (excludePatterns.length) {
    matchedStates = matchedStates.filter((state) => {
      if (!state?.entity_id) {
        return false;
      }
      const excluded = excludePatterns.some((pattern) =>
        pattern.test(state.entity_id)
      );
      return !excluded;
    });
  }

  const binaryStates = matchedStates.filter((state) =>
    isBinarySensorEntityId(state.entity_id)
  );

  const language = resolveLanguage(config, hass);
  const locale = language === LANGUAGE_DE ? "de" : "en";

  const baseNameCache = new Map();
  const displayNameCache = new Map();

  const resolveBaseName = (state) => {
    if (baseNameCache.has(state.entity_id)) {
      return baseNameCache.get(state.entity_id);
    }
    const rawName =
      state.attributes?.friendly_name || prettifyEntityId(state.entity_id);
    const filtered = applyNameFilters(rawName, nameFilters);
    baseNameCache.set(state.entity_id, filtered);
    return filtered;
  };

  const resolveDisplayName = (state) => {
    if (displayNameCache.has(state.entity_id)) {
      return displayNameCache.get(state.entity_id);
    }
    const override = overrides[state.entity_id];
    if (override !== undefined && override !== null) {
      const filteredOverride = applyNameFilters(override, nameFilters);
      if (filteredOverride) {
        displayNameCache.set(state.entity_id, filteredOverride);
        return filteredOverride;
      }
    }
    const baseName = resolveBaseName(state);
    displayNameCache.set(state.entity_id, baseName);
    return baseName;
  };

  const resolveIcon = (state) => {
    const override = iconOverrides[state.entity_id];
    if (override) {
      return override;
    }
    const icon = state.attributes?.icon;
    if (typeof icon === "string" && icon.trim()) {
      return icon.trim();
    }
    return undefined;
  };

  binaryStates.sort((a, b) => {
    const nameA = resolveBaseName(a);
    const nameB = resolveBaseName(b);
    const comparison = nameA.localeCompare(nameB, locale);
    if (comparison !== 0) {
      return comparison;
    }
    return a.entity_id.localeCompare(b.entity_id, locale);
  });

  const limit = Number.isInteger(config.limit) && config.limit > 0 ? config.limit : undefined;
  const limitedStates = limit ? binaryStates.slice(0, limit) : binaryStates;

  return limitedStates.map((state) => ({
    entity: state.entity_id,
    name: resolveDisplayName(state),
    icon: resolveIcon(state),
  }));
};

const collectChartBaseElements = (element) => {
  if (!element) {
    return [];
  }
  const visited = new Set();
  const queue = [];
  const charts = [];

  const enqueue = (root) => {
    if (root && !visited.has(root)) {
      visited.add(root);
      queue.push(root);
    }
  };

  if (element instanceof ShadowRoot) {
    enqueue(element);
  } else if (element.shadowRoot) {
    enqueue(element.shadowRoot);
  }

  while (queue.length) {
    const root = queue.shift();
    if (!root || typeof root.querySelectorAll !== "function") {
      continue;
    }
    root.querySelectorAll("ha-chart-base").forEach((chart) => charts.push(chart));
    root.querySelectorAll("*").forEach((node) => {
      if (node.shadowRoot) {
        enqueue(node.shadowRoot);
      }
    });
  }

  return charts;
};

const collectTimelineElements = (element) => {
  if (!element) {
    return [];
  }
  const visited = new Set();
  const queue = [];
  const timelines = [];
  const selectors = ["ha-timeline", "state-history-chart-timeline"];

  const enqueue = (root) => {
    if (root && !visited.has(root)) {
      visited.add(root);
      queue.push(root);
    }
  };

  if (element instanceof ShadowRoot) {
    enqueue(element);
  } else if (element.shadowRoot) {
    enqueue(element.shadowRoot);
  }

  while (queue.length) {
    const root = queue.shift();
    if (!root || typeof root.querySelectorAll !== "function") {
      continue;
    }
    selectors.forEach((selector) => {
      root
        .querySelectorAll(selector)
        .forEach((timeline) => timelines.push(timeline));
    });
    root.querySelectorAll("*").forEach((node) => {
      if (node.shadowRoot) {
        enqueue(node.shadowRoot);
      }
    });
  }

  return timelines;
};

const forwardHistoryConfig = (config, entities) => {
  const historyConfig = { type: "history-graph", entities };
  const passthroughKeys = ["title", "hours_to_show"];

  passthroughKeys.forEach((key) => {
    if (config[key] !== undefined) {
      historyConfig[key] = config[key];
    }
  });

  historyConfig.show_names = false;

  return historyConfig;
};

if (!customElements.get("proxmox-uptime-card")) {
  console.info(
    `%cPROXMOX-UPTIME-CARD ${CARD_VERSION} is loaded`,
    "color: #00a862; font-weight: 600;"
  );

  class ProxmoxUptimeCard extends HTMLElement {
    constructor() {
      super();
      this._config = undefined;
      this._helpers = undefined;
      this._card = undefined;
      this._cardWrapper = undefined;
      this._createCardPromise = undefined;
      this._lastEntitiesKey = "";
      this._timelineColorTimeout = undefined;
      this._lastTimelineSignature = "";
      this._legendContainer = undefined;
      this._legendData = [];
      this._styleElement = undefined;
    }

    static getStubConfig() {
      return {
        type: "custom:proxmox-uptime-card",
        title: "Proxmox Uptime",
      };
    }

    static async getConfigElement() {
      ensureEditorElementRegistered();
      return document.createElement("proxmox-uptime-card-editor");
    }

    setConfig(config) {
      if (!config) {
        throw new Error("Invalid configuration");
      }
      if (config.entities !== undefined && !Array.isArray(config.entities)) {
        throw new Error("`entities` must be an array when provided");
      }
      this._config = { ...config };
      this._lastEntitiesKey = "";
      this._teardownCard();
      if (this._hass) {
        this._createCard();
      }
    }

    set hass(hass) {
      this._hass = hass;
      if (!this._config) {
        return;
      }

      if (!this._card) {
        this._createCard();
        return;
      }

      if (this._config.entities === undefined) {
        const entities = computeEntities(this._hass, this._config);
        const key = JSON.stringify(entities);
        if (key !== this._lastEntitiesKey) {
          this._lastEntitiesKey = key;
          this._teardownCard();
          this._createCard();
          return;
        }
      }

      if (this._card) {
        this._card.hass = hass;
        this._renderLegend();
        this._scheduleTimelineColorUpdate();
      }
    }

    disconnectedCallback() {
      this._clearTimelineColorTimeout();
    }

    getCardSize() {
      if (this._card?.getCardSize) {
        return this._card.getCardSize();
      }
      return this._config?.title ? 3 : 2;
    }

    _ensureStyles() {
      if (this._styleElement && this.contains(this._styleElement)) {
        return;
      }
      if (!this._styleElement) {
        this._styleElement = document.createElement("style");
        this._styleElement.textContent = `
          :host {
            display: block;
          }

          .proxmox-uptime-wrapper {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .proxmox-uptime-legend {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .proxmox-uptime-legend[hidden] {
            display: none;
          }

          .proxmox-uptime-legend-row {
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 28px;
          }

          .proxmox-uptime-legend-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            color: var(--secondary-text-color);
          }

          .proxmox-uptime-legend-icon ha-icon {
            width: 24px;
            height: 24px;
          }

          .proxmox-uptime-legend-name {
            font-weight: 600;
            line-height: 1.4;
            word-break: break-word;
          }
        `;
      }
      this.prepend(this._styleElement);
    }

    _resolveLegendIcon(entityId, providedIcon) {
      const configIcon =
        typeof this._config?.icons?.[entityId] === "string"
          ? this._config.icons[entityId].trim()
          : "";
      if (configIcon) {
        return configIcon;
      }
      if (typeof providedIcon === "string" && providedIcon.trim()) {
        return providedIcon.trim();
      }
      const stateIcon =
        typeof this._hass?.states?.[entityId]?.attributes?.icon === "string"
          ? this._hass.states[entityId].attributes.icon.trim()
          : "";
      if (stateIcon) {
        return stateIcon;
      }
      return DEFAULT_SENSOR_ICON;
    }

    _resolveLegendName(entityId, providedName) {
      if (typeof providedName === "string" && providedName.trim()) {
        return providedName.trim();
      }
      const configName =
        typeof this._config?.names?.[entityId] === "string"
          ? this._config.names[entityId].trim()
          : "";
      if (configName) {
        return configName;
      }
      const stateName =
        typeof this._hass?.states?.[entityId]?.attributes?.friendly_name ===
        "string"
          ? this._hass.states[entityId].attributes.friendly_name
          : "";
      if (stateName) {
        return stateName;
      }
      return prettifyEntityId(entityId);
    }

    _renderLegend(entities) {
      if (Array.isArray(entities)) {
        this._legendData = entities.map((entry) =>
          typeof entry === "object" ? { ...entry } : entry
        );
      }

      if (!this._legendContainer) {
        return;
      }

      const data = Array.isArray(this._legendData)
        ? this._legendData
        : [];
      const showNames = this._config?.show_names ?? true;

      this._legendContainer.replaceChildren();

      if (!showNames || !data.length) {
        this._legendContainer.hidden = true;
        return;
      }

      this._legendContainer.hidden = false;

      data.forEach((entry) => {
        const entityId = getEntityIdFromEntry(entry);
        if (!entityId) {
          return;
        }
        const row = document.createElement("div");
        row.className = "proxmox-uptime-legend-row";

        const iconWrapper = document.createElement("div");
        iconWrapper.className = "proxmox-uptime-legend-icon";
        const iconElement = document.createElement("ha-icon");
        const providedIcon =
          typeof entry === "object" ? entry.icon : undefined;
        iconElement.setAttribute(
          "icon",
          this._resolveLegendIcon(entityId, providedIcon)
        );
        iconWrapper.append(iconElement);

        const nameElement = document.createElement("div");
        nameElement.className = "proxmox-uptime-legend-name";
        const providedName =
          typeof entry === "object" ? entry.name : undefined;
        nameElement.textContent = this._resolveLegendName(
          entityId,
          providedName
        );

        row.append(iconWrapper, nameElement);
        this._legendContainer.append(row);
      });
    }


    _clearTimelineColorTimeout() {
      if (this._timelineColorTimeout) {
        clearTimeout(this._timelineColorTimeout);
        this._timelineColorTimeout = undefined;
      }
    }

    _getTimelineColorConfig() {
      if (!this._config) {
        return null;
      }

      const rawOn =
        typeof this._config.timeline_color_on === "string"
          ? this._config.timeline_color_on.trim()
          : "";
      const rawOff =
        typeof this._config.timeline_color_off === "string"
          ? this._config.timeline_color_off.trim()
          : "";
      const rawUnknown =
        typeof this._config.timeline_color_unknown === "string"
          ? this._config.timeline_color_unknown.trim()
          : "";
      const rawLegacy =
        typeof this._config.timeline_color === "string"
          ? this._config.timeline_color.trim()
          : "";

      const resolvedOn = rawOn ? normalizeCssColor(rawOn).trim() : "";
      const resolvedOff = rawOff ? normalizeCssColor(rawOff).trim() : "";
      const resolvedUnknown = rawUnknown
        ? normalizeCssColor(rawUnknown).trim()
        : "";
      const legacyColor = rawLegacy ? normalizeCssColor(rawLegacy).trim() : "";

      const colorOn =
        resolvedOn || legacyColor || TIMELINE_DEFAULT_COLORS[TIMELINE_STATE_ON];
      const colorOff =
        resolvedOff || legacyColor || TIMELINE_DEFAULT_COLORS[TIMELINE_STATE_OFF];
      const colorUnknown =
        resolvedUnknown ||
        legacyColor ||
        TIMELINE_DEFAULT_COLORS[TIMELINE_STATE_UNKNOWN];

      if (!colorOn && !colorOff && !colorUnknown) {
        return null;
      }

      const fallbackColor =
        legacyColor ||
        colorUnknown ||
        colorOn ||
        colorOff ||
        undefined;
      const normalized = {
        on: colorOn || undefined,
        off: colorOff || undefined,
        unknown: colorUnknown || undefined,
      };

      return {
        colors: normalized,
        fills: {
          on: normalized.on ? applyAlphaToColor(normalized.on, 0.25) : undefined,
          off: normalized.off ? applyAlphaToColor(normalized.off, 0.25) : undefined,
          unknown: normalized.unknown
            ? applyAlphaToColor(normalized.unknown, 0.25)
            : undefined,
        },
        fallback: fallbackColor || undefined,
        fallbackFill: fallbackColor
          ? applyAlphaToColor(fallbackColor, 0.25)
          : undefined,
        signature: JSON.stringify({
          on: normalized.on || "",
          off: normalized.off || "",
          unknown: normalized.unknown || "",
          legacy: legacyColor,
        }),
      };
    }

    _resetTimelineColors() {
      if (!this._card) {
        return false;
      }
      const chartElements = collectChartBaseElements(this._card);
      const timelineElements = collectTimelineElements(this._card);
      if (!chartElements.length && !timelineElements.length) {
        return false;
      }
      let changed = false;
      chartElements.forEach((chartElement) => {
        const chart = chartElement?.chart || chartElement?._chart;
        if (!chart?.data?.datasets?.length) {
          return;
        }
        let chartChanged = false;
        chart.data.datasets.forEach((dataset) => {
          if (resetTimelineDatasetColors(dataset)) {
            changed = true;
            chartChanged = true;
          }
        });
        if (chartChanged && typeof chart.update === "function") {
          chart.update("none");
        }
      });
      if (resetTimelineElementStyles(timelineElements)) {
        changed = true;
      }
      return changed;
    }

    _scheduleTimelineColorUpdate() {
      const colorConfig = this._getTimelineColorConfig();
      if (!colorConfig) {
        this._lastTimelineSignature = "";
        this._resetTimelineColors();
        this._clearTimelineColorTimeout();
        return;
      }

      this._clearTimelineColorTimeout();
      let attempts = 0;
      const attemptLimit = 20;

      const apply = () => {
        if (!this.isConnected || !this._card) {
          this._timelineColorTimeout = undefined;
          return;
        }
        const success = this._applyTimelineColorToCard(colorConfig);
        if (!success && attempts < attemptLimit) {
          attempts += 1;
          this._timelineColorTimeout = setTimeout(apply, 150);
        } else {
          this._timelineColorTimeout = undefined;
          if (success) {
            this._lastTimelineSignature = colorConfig.signature;
          }
        }
      };

      apply();
    }

    _applyTimelineColorToCard(colorConfig) {
      if (!colorConfig || !this._card) {
        return false;
      }
      const chartElements = collectChartBaseElements(this._card);
      const timelineElements = collectTimelineElements(this._card);
      if (!chartElements.length && !timelineElements.length) {
        return false;
      }

      let applied = false;
      chartElements.forEach((chartElement) => {
        const chart = chartElement?.chart || chartElement?._chart;
        if (!chart?.data?.datasets?.length) {
          return;
        }
        let chartApplied = false;
        chart.data.datasets.forEach((dataset) => {
          if (!dataset) {
            return;
          }
          if (applyTimelineColorsToDataset(dataset, colorConfig)) {
            chartApplied = true;
            applied = true;
          }
        });
        if (chartApplied && typeof chart.update === "function") {
          chart.update("none");
        }
      });

      if (applyTimelineColorsToTimelines(timelineElements, colorConfig)) {
        applied = true;
      }

      return applied;
    }

    _localize(key, fallback) {
      const lang = resolveLanguage(this._config || {}, this._hass);
      return CARD_MESSAGES[key]?.[lang] || CARD_MESSAGES[key]?.[LANGUAGE_EN] || fallback;
    }

    async _loadHelpers() {
      if (this._helpers !== undefined) {
        return this._helpers;
      }
      if (window.loadCardHelpers) {
        try {
          this._helpers = await window.loadCardHelpers();
        } catch (err) {
          console.warn("proxmox-uptime-card: failed to load card helpers", err);
          this._helpers = null;
        }
      } else {
        this._helpers = null;
      }
      return this._helpers;
    }

    async _createCard() {
      if (!this._config || !this._hass) {
        return;
      }

      if (this._createCardPromise) {
        await this._createCardPromise;
        return;
      }

      this._createCardPromise = this._doCreateCard();
      try {
        await this._createCardPromise;
      } finally {
        this._createCardPromise = undefined;
      }
    }

    async _doCreateCard() {
      this._teardownCard();

      const entities = computeEntities(this._hass, this._config);
      const historyConfig = forwardHistoryConfig(this._config, entities);

      if (!historyConfig.entities?.length) {
        await this._showError(this._localize("empty_entities"));
        return;
      }

      this._lastEntitiesKey = JSON.stringify(historyConfig.entities);

      const helpers = await this._loadHelpers();
      let cardElement;

      if (helpers?.createCardElement) {
        cardElement = await helpers.createCardElement(historyConfig);
      } else {
        cardElement = document.createElement("hui-history-graph-card");
      }

      if (cardElement.tagName === "HUI-ERROR-CARD") {
        cardElement.hass = this._hass;
        this._card = cardElement;
        this._ensureStyles();
        const wrapper = document.createElement("div");
        wrapper.className = "proxmox-uptime-wrapper";
        const legend = document.createElement("div");
        legend.className = "proxmox-uptime-legend";
        legend.hidden = true;
        wrapper.append(legend);
        wrapper.append(cardElement);
        this._legendContainer = legend;
        this._cardWrapper = wrapper;
        this.append(wrapper);
        return;
      }

      if (cardElement.setConfig) {
        try {
          cardElement.setConfig(historyConfig);
        } catch (err) {
          await this._showError(
            err?.message || this._localize("configure_failed")
          );
          return;
        }
      } else {
        cardElement.config = historyConfig;
      }

      cardElement.hass = this._hass;
      this._card = cardElement;
      this._ensureStyles();
      const wrapper = document.createElement("div");
      wrapper.className = "proxmox-uptime-wrapper";
      const legend = document.createElement("div");
      legend.className = "proxmox-uptime-legend";
      legend.hidden = true;
      wrapper.append(legend);
      wrapper.append(cardElement);
      this._legendContainer = legend;
      this._cardWrapper = wrapper;
      this.append(wrapper);
      this._renderLegend(historyConfig.entities);
      this._scheduleTimelineColorUpdate();
    }

    async _showError(message) {
      await customElements.whenDefined("hui-error-card");
      const errorCard = document.createElement("hui-error-card");
      errorCard.setConfig({
        type: "custom:proxmox-uptime-card",
        error: message,
        origConfig: this._config,
      });
      errorCard.hass = this._hass;
      this._card = errorCard;
      this.append(errorCard);
    }

    _teardownCard() {
      this._resetTimelineColors();
      if (this._cardWrapper && this.contains(this._cardWrapper)) {
        this.removeChild(this._cardWrapper);
      } else if (this._card && this.contains(this._card)) {
        this.removeChild(this._card);
      }
      this._card = undefined;
      this._cardWrapper = undefined;
      this._legendContainer = undefined;
      this._legendData = [];
      this._clearTimelineColorTimeout();
      this._lastTimelineSignature = "";
    }
  }

  customElements.define("proxmox-uptime-card", ProxmoxUptimeCard);
  ensureCardMetadataRegistered();
  ensureEditorElementRegistered();
}
