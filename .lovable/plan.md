
# Corrigir Traducoes das LiveNotifications

## Problema

O componente `LiveNotifications` usa chaves de traducao (`liveNotifications.actions.registered`, `liveNotifications.actions.purchased`, etc.) que nao existem nos arquivos de traducao (`es.json`, `pt.json`, `en.json`). Por isso, o i18next mostra a chave literal em vez do texto traduzido.

## Solucao

Adicionar as chaves de traducao nos 3 arquivos de idioma:

### `src/locales/es.json`
```json
"liveNotifications": {
  "actions": {
    "registered": "se registró en la plataforma",
    "purchased": "adquirió un plan",
    "demo": "solicitó una demostración"
  },
  "ago": "atrás"
}
```

### `src/locales/pt.json`
```json
"liveNotifications": {
  "actions": {
    "registered": "se registrou na plataforma",
    "purchased": "adquiriu um plano",
    "demo": "solicitou uma demonstração"
  },
  "ago": "atrás"
}
```

### `src/locales/en.json`
```json
"liveNotifications": {
  "actions": {
    "registered": "registered on the platform",
    "purchased": "purchased a plan",
    "demo": "requested a demo"
  },
  "ago": "ago"
}
```

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|----------|
| `src/locales/es.json` | Adicionar bloco `liveNotifications` |
| `src/locales/pt.json` | Adicionar bloco `liveNotifications` |
| `src/locales/en.json` | Adicionar bloco `liveNotifications` |
