# Proxmox Uptime Lovelace Card

🇬🇧 [Read English version](README.md)

Custom Lovelace card für Home Assistant, die die Laufzeiten von Proxmox-Knoten, VMs und LXC-Containern basierend auf den Sensoren der Proxmox-Integration visualisiert.

## Installation

### HACS (empfohlen)

1. Öffne HACS in Home Assistant und wähle **Frontend**.
2. Klicke oben rechts auf das Drei-Punkte-Menü und wähle **Benutzerdefiniertes Repository**.
3. Gib die URL dieses Repositories an und wähle den Typ **Lovelace**.
4. Nach dem Hinzufügen kannst du die Card in HACS suchen und installieren.
5. Die Ressource `proxmox-uptime-card.js` wird automatisch eingebunden und steht anschließend in Lovelace zur Verfügung.

## Verwendung

Füge die Karte deinem Dashboard hinzu, indem du sie im YAML-Modus bearbeitest oder im visuellen Editor **Code-Editor anzeigen** auswählst. Verwende `custom:proxmox-uptime-card` als Kartentyp:

```yaml
type: custom:proxmox-uptime-card
title: Proxmox Uptime
entities:
  - sensor.proxmox_host_uptime
```

## Entwicklung

Die Card wird ohne zusätzliche UI-Frameworks implementiert und über `defineCustomElement` als `proxmox-uptime-card` registriert.
