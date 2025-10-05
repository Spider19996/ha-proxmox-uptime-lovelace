# Proxmox Uptime Lovelace Card

🇩🇪 [Deutsche Version lesen](README.de.md)

Custom Lovelace card for Home Assistant that renders the standard history timeline for Proxmox nodes, VMs, and LXC containers based on the binary sensors exposed by the Proxmox integration.

## Installation

### HACS (recommended)

1. Open HACS in Home Assistant and select **Frontend**.
2. Click the three-dot menu in the top right and choose **Custom repositories**.
3. Enter the URL of this repository and set the category to **Lovelace**.
4. After adding it, search for the card in HACS and install it.
5. The `proxmox-uptime-card.js` resource is added automatically and becomes available in Lovelace.

## Usage

Add the card to your dashboard by editing it in YAML mode or using the visual editor's **Show code editor** option. Use `custom:proxmox-uptime-card` as the card type:

```yaml
type: custom:proxmox-uptime-card
title: Proxmox Uptime
entities:
  - sensor.proxmox_host_uptime
```

### Friendly names and icons

Override the displayed label and icon per sensor either via the visual editor or YAML:

```yaml
type: custom:proxmox-uptime-card
names:
  binary_sensor.node_alpha_status: Proxmox Node Alpha
icons:
  binary_sensor.node_alpha_status: mdi:server
```

Sensor names are shown above each timeline with the configured icon on the left.

## Attribution

This project wraps the upstream [Home Assistant History Graph Card](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-history-graph-card.ts) and forwards its configuration so that uptime sensors are displayed without additional manual setup.
