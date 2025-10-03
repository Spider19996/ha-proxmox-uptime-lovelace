/*
 * Proxmox Uptime Card
 * A lightweight Lovelace card that renders the uptime of entities exposed by the
 * Proxmox integration. The card avoids a build step and only relies on helpers
 * that are already shipped with Home Assistant. It can therefore be dropped into
 * the "www" folder or installed through HACS without additional tooling.
 */

const ProxmoxBaseElement = customElements.get("ha-panel-lovelace")
  ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace"))
  : customElements.get("hui-view")
    ? Object.getPrototypeOf(customElements.get("hui-view"))
    : customElements.get("hui-masonry-view")
      ? Object.getPrototypeOf(customElements.get("hui-masonry-view"))
      : window.LitElement || HTMLElement;

const html = ProxmoxBaseElement.prototype?.html || window.litHtml || window.html;
const css = ProxmoxBaseElement.prototype?.css || window.litCss || window.css;
const LitElement = ProxmoxBaseElement || window.LitElement || HTMLElement;

const LOCALIZED_UNKNOWN = "state.default.unknown";

const formatDuration = (seconds, locale) => {
  if (!Number.isFinite(seconds)) {
    return null;
  }

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts = [];

  if (days > 0) {
    parts.push(new Intl.NumberFormat(locale).format(days) + "d");
  }
  if (hours > 0 || days > 0) {
    parts.push(new Intl.NumberFormat(locale).format(hours) + "h");
  }
  parts.push(new Intl.NumberFormat(locale).format(minutes) + "m");

  return parts.join(" ");
};

const normalizeEntities = (entities) =>
  entities.map((entry) =>
    typeof entry === "string"
      ? { entity: entry }
      : entry && typeof entry === "object"
        ? { entity: entry.entity, name: entry.name }
        : null,
  ).filter((entry) => entry?.entity);

class ProxmoxUptimeCard extends LitElement {
  static async getConfigElement() {
    return document.createElement("proxmox-uptime-card-editor");
  }

  static getStubConfig() {
    return {
      type: "proxmox-uptime-card",
      entities: [ "sensor.proxmox_host_uptime" ],
    };
  }

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { attribute: false },
      _entities: { attribute: false },
    };
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.entities) || !config.entities.length) {
      throw new Error("Entities need to be a non-empty array");
    }

    this._config = { ...config };
    this._entities = normalizeEntities(config.entities);

    if (!this._entities.length) {
      throw new Error("Entities need to be a non-empty array");
    }
  }

  getCardSize() {
    return (this._entities?.length || 1) + (this._config?.title ? 1 : 0);
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const locale = this.hass.locale?.language ?? this.hass.language ?? "en";

    return html`
      <ha-card>
        ${this._config.title
          ? html`<h1 class="card-header">${this._config.title}</h1>`
          : null}
        <div class="content">
          ${this._entities.length
            ? this._entities.map((item) => this._renderRow(item, locale))
            : html`<div class="empty">${this._localize("ui.panel.lovelace.editor.card.generic.no_entities", "No entities configured")}</div>`}
        </div>
      </ha-card>
    `;
  }

  _renderRow(item, locale) {
    const stateObj = this.hass.states[item.entity];
    const name = item.name || stateObj?.attributes.friendly_name || item.entity;

    let uptimeValue = stateObj?.attributes.uptime ?? stateObj?.state;
    if (typeof uptimeValue === "string") {
      const numeric = Number(uptimeValue);
      if (!Number.isNaN(numeric)) {
        uptimeValue = numeric;
      }
    }

    const formatted = typeof uptimeValue === "number"
      ? formatDuration(uptimeValue, locale)
      : uptimeValue;

    const lastChangedDate = stateObj?.last_changed ? new Date(stateObj.last_changed) : null;
    const hasLastChanged = lastChangedDate && !Number.isNaN(lastChangedDate.getTime());
    const lastBoot = stateObj?.attributes?.last_boot ?? stateObj?.attributes?.start_time;
    const bootDate = lastBoot ? new Date(lastBoot) : null;
    const hasBootDate = bootDate && !Number.isNaN(bootDate.getTime());
    const unknownText = this._localize(LOCALIZED_UNKNOWN, this._localize("state.default.unavailable", "Unknown"));

    return html`
      <div class="entity-row">
        <div class="icon">
          ${stateObj
            ? html`<ha-state-icon .stateObj=${stateObj}></ha-state-icon>`
            : html`<ha-icon icon="mdi:server"></ha-icon>`}
        </div>
        <div class="details">
          <div class="name">${name}</div>
          <div class="meta">
            <span class="uptime">
              ${formatted || unknownText}
            </span>
            ${lastBoot
              ? html`<span>
                  &bull;
                  ${this._localize("ui.dialogs.more_info_control.uptime.last_boot", "Last boot")}:
                  ${hasBootDate
                    ? html`<ha-relative-time .hass=${this.hass} .datetime=${bootDate}></ha-relative-time>`
                    : lastBoot}
                </span>`
              : null}
            ${hasLastChanged
              ? html`<span>
                  &bull;
                  ${this._localize("ui.panel.lovelace.editor.card.generic.updated", "Updated")}:
                  <ha-relative-time .hass=${this.hass} .datetime=${lastChangedDate}></ha-relative-time>
                </span>`
              : null}
          </div>
        </div>
      </div>
    `;
  }

  _localize(key, fallback) {
    return (this.hass?.localize?.(key)) || fallback;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
      }

      .card-header {
        margin: 0;
        padding: 0 0 16px;
        font-size: 1.2rem;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .entity-row {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 12px;
        align-items: center;
      }

      .icon {
        width: 40px;
        display: flex;
        justify-content: center;
      }

      .details {
        display: flex;
        flex-direction: column;
      }

      .name {
        font-weight: 600;
        margin-bottom: 4px;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        color: var(--secondary-text-color);
        font-size: 0.9rem;
      }

      .meta span {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .uptime {
        color: var(--primary-text-color);
        font-weight: 500;
      }

      .empty {
        color: var(--secondary-text-color);
      }
    `;
  }
}

class ProxmoxUptimeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { attribute: false },
      _entities: { attribute: false },
    };
  }

  constructor() {
    super();
    this._config = {};
    this._entities = [];
  }

  setConfig(config) {
    this._config = { ...config };
    this._entities = normalizeEntities(config.entities || []);
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    return html`
      <div class="card-config">
        <label class="field">
          <span>${this.hass.localize("ui.dialogs.helper_settings.input.text_field.label") || "Title"}</span>
          <input
            type="text"
            .value=${this._config.title || ""}
            @input=${(event) => this._handleTitle(event)}
          />
        </label>

        <div class="entities">
          <div class="entities-header">
            ${this.hass.localize("ui.panel.lovelace.editor.card.generic.entities") || "Entities"}
          </div>
          ${this._entities.map((entry, index) => this._renderEntityRow(entry, index))}
          <button type="button" class="add" @click=${this._addEntity}>
            ${this.hass.localize("ui.panel.lovelace.editor.card.generic.add_entity") || "Add entity"}
          </button>
        </div>
      </div>
    `;
  }

  _renderEntityRow(entry, index) {
    return html`
      <div class="entity-config">
        <label class="field">
          <span>${this.hass.localize("ui.components.entity.entity") || "Entity"}</span>
          <input
            type="text"
            placeholder="sensor.proxmox_*"
            .value=${entry.entity || ""}
            @input=${(event) => this._handleEntityChange(event, index)}
          />
        </label>
        <label class="field">
          <span>${this.hass.localize("ui.panel.lovelace.editor.card.generic.name") || "Name"}</span>
          <input
            type="text"
            .value=${entry.name || ""}
            @input=${(event) => this._handleNameChange(event, index)}
          />
        </label>
        <button type="button" class="remove" @click=${() => this._removeEntity(index)}>
          ${this.hass.localize("ui.common.delete") || "Remove"}
        </button>
      </div>
    `;
  }

  _handleTitle(event) {
    this._config = { ...this._config, title: event.target.value || undefined };
    this._notifyConfigChanged();
  }

  _handleEntityChange(event, index) {
    const value = event.target.value;
    this._entities = this._entities.map((entry, idx) =>
      idx === index ? { ...entry, entity: value } : entry,
    );
    this._notifyConfigChanged();
  }

  _handleNameChange(event, index) {
    const value = event.target.value;
    this._entities = this._entities.map((entry, idx) =>
      idx === index ? { ...entry, name: value || undefined } : entry,
    );
    this._notifyConfigChanged();
  }

  _addEntity() {
    this._entities = [ ...this._entities, { entity: "" } ];
    this._notifyConfigChanged();
  }

  _removeEntity(index) {
    this._entities = this._entities.filter((_, idx) => idx !== index);
    this._notifyConfigChanged();
  }

  _notifyConfigChanged() {
    const entities = this._entities.filter((entry) => entry.entity);
    const detail = {
      config: {
        ...this._config,
        entities,
      },
    };
    this.dispatchEvent(new CustomEvent("config-changed", { detail, bubbles: true, composed: true }));
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field > span {
        font-weight: 600;
      }

      input[type="text"] {
        min-height: 40px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .entities {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .entities-header {
        font-weight: 600;
      }

      .entity-config {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 2fr) auto;
        gap: 12px;
        align-items: end;
      }

      button {
        cursor: pointer;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
      }

      button.remove {
        background: var(--error-color);
      }

      button.add {
        align-self: flex-start;
        background: transparent;
        color: var(--primary-color);
        border: 1px dashed var(--primary-color);
      }
    `;
  }
}

if (!customElements.get("proxmox-uptime-card")) {
  customElements.define("proxmox-uptime-card", ProxmoxUptimeCard);
}

if (!customElements.get("proxmox-uptime-card-editor")) {
  customElements.define("proxmox-uptime-card-editor", ProxmoxUptimeCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "proxmox-uptime-card")) {
  window.customCards.push({
    type: "proxmox-uptime-card",
    name: "Proxmox Uptime Card",
    preview: true,
    description: "Visualises uptime sensors from the Proxmox integration.",
  });
}

export const ProxmoxUptimeCardDefinition = {
  type: "proxmox-uptime-card",
  name: "Proxmox Uptime Card",
  description: "Visualises uptime sensors from the Proxmox integration.",
  async loadCardHelpers() {
    if (window.loadCardHelpers) {
      try {
        await window.loadCardHelpers();
      } catch (err) {
        // ignore helper loading issues to keep the card functional without helpers
      }
    }
  },
  getStubConfig() {
    return {
      type: "proxmox-uptime-card",
      entities: [ "sensor.proxmox_host_uptime" ],
    };
  },
  getConfigElement() {
    return document.createElement("proxmox-uptime-card-editor");
  },
};

export default ProxmoxUptimeCard;
