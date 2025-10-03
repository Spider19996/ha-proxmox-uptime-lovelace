# Proxmox Uptime Lovelace Card

🇩🇪 [Deutsche Version lesen](README.de.md)

Custom Lovelace card for Home Assistant that visualises the uptime of Proxmox nodes, VMs, and LXC containers based on the sensors exposed by the Proxmox integration.

## Installation

### HACS (recommended)

1. Open HACS in Home Assistant and select **Frontend**.
2. Click the three-dot menu in the top right and choose **Custom repositories**.
3. Enter the URL of this repository and set the category to **Lovelace**.
4. After adding it, search for the card in HACS and install it.
5. The `proxmox-uptime-card.js` resource is added automatically and becomes available in Lovelace.

## Attribution

Portions of this project are derived from the [Home Assistant History Graph Card](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-history-graph-card.ts),
Copyright © 2013&ndash;2024 The Home Assistant Authors, and are licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
The adapted sections remain subject to the Apache License 2.0 in addition to this project's own licensing.
