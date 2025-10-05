# Proxmox Uptime Lovelace Card

🇬🇧 [Read English version](README.md)

Custom Lovelace Card für Home Assistant, die den normalen History-Zeitstrahl für Proxmox-Knoten, VMs und LXC-Container basierend auf den Binary-Sensoren der Proxmox-Integration anzeigt.

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

### Optionen

- `show_timeline` *(optional, Standard `true`)* – Auf `false` setzen, um den unteren Zeitstrahl auszublenden. Die Option ist ebenfalls im visuellen Editor unter **Darstellung** verfügbar.

## Entwicklung

Die Card kapselt die bestehende History-Graph-Implementierung aus Home Assistant und reicht die relevanten Optionen automatisiert weiter.
