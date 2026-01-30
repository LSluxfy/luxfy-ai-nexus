
# Plano: Adicionar Traduções Faltantes (howItWorks e beforeAfter)

## Problema Identificado

Os componentes `HowItWorks.tsx` e `BeforeAfter.tsx` estão tentando acessar chaves de tradução que não existem nos arquivos de localização:

### Chaves Faltantes:

**howItWorks:**
- `howItWorks.title`
- `howItWorks.subtitle`
- `howItWorks.steps.0.title` / `howItWorks.steps.0.description`
- `howItWorks.steps.1.title` / `howItWorks.steps.1.description`
- `howItWorks.steps.2.title` / `howItWorks.steps.2.description`

**beforeAfter:**
- `beforeAfter.title`
- `beforeAfter.subtitle`
- `beforeAfter.before` / `beforeAfter.after`
- `beforeAfter.scenarios.0.before` / `beforeAfter.scenarios.0.after`
- `beforeAfter.scenarios.1.before` / `beforeAfter.scenarios.1.after`
- `beforeAfter.scenarios.2.before` / `beforeAfter.scenarios.2.after`

---

## Solução

Adicionar as seções de tradução faltantes nos 3 arquivos de localização:

### Arquivo 1: `src/locales/es.json`

Adicionar as seções `howItWorks` e `beforeAfter` com conteúdo em espanhol.

### Arquivo 2: `src/locales/pt.json`

Adicionar as seções `howItWorks` e `beforeAfter` com conteúdo em português.

### Arquivo 3: `src/locales/en.json`

Adicionar as seções `howItWorks` e `beforeAfter` com conteúdo em inglês.

---

## Conteúdo das Traduções

### Seção "Como Funciona" (howItWorks)

| Chave | Espanhol | Português | Inglês |
|-------|----------|-----------|--------|
| title | ¿Cómo Funciona? | Como Funciona? | How It Works? |
| subtitle | Comienza en minutos con 3 simples pasos | Comece em minutos com 3 passos simples | Get started in minutes with 3 simple steps |
| steps.0.title | Conecta tu WhatsApp | Conecte seu WhatsApp | Connect your WhatsApp |
| steps.0.description | Integra tu número de WhatsApp Business en minutos | Integre seu número do WhatsApp Business em minutos | Integrate your WhatsApp Business number in minutes |
| steps.1.title | Configura tu Agente IA | Configure seu Agente IA | Configure your AI Agent |
| steps.1.description | Personaliza las respuestas y entrena la IA con tus datos | Personalize as respostas e treine a IA com seus dados | Customize responses and train AI with your data |
| steps.2.title | ¡Automatiza y Vende! | Automatize e Venda! | Automate and Sell! |
| steps.2.description | Tu IA responde 24/7 y convierte leads automáticamente | Sua IA responde 24/7 e converte leads automaticamente | Your AI responds 24/7 and converts leads automatically |

### Seção "Antes e Depois" (beforeAfter)

| Chave | Espanhol | Português | Inglês |
|-------|----------|-----------|--------|
| title | Antes vs Después | Antes vs Depois | Before vs After |
| subtitle | Vea la transformación de su negocio | Veja a transformação do seu negócio | See the transformation of your business |
| before | Antes | Antes | Before |
| after | Después | Depois | After |
| scenarios.0.before | Clientes esperando horas por una respuesta | Clientes esperando horas por uma resposta | Customers waiting hours for a response |
| scenarios.0.after | Respuestas instantáneas 24/7 con IA | Respostas instantâneas 24/7 com IA | Instant 24/7 responses with AI |
| scenarios.1.before | Leads perdidos por falta de seguimiento | Leads perdidos por falta de acompanhamento | Leads lost due to lack of follow-up |
| scenarios.1.after | CRM visual con seguimiento automático | CRM visual com acompanhamento automático | Visual CRM with automatic follow-up |
| scenarios.2.before | Equipo sobrecargado con tareas repetitivas | Equipe sobrecarregada com tarefas repetitivas | Team overloaded with repetitive tasks |
| scenarios.2.after | Automatización que libera tu equipo | Automação que libera sua equipe | Automation that frees your team |

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/locales/es.json` | Adicionar seções `howItWorks` e `beforeAfter` |
| `src/locales/pt.json` | Adicionar seções `howItWorks` e `beforeAfter` |
| `src/locales/en.json` | Adicionar seções `howItWorks` e `beforeAfter` |

---

## Resultado Esperado

Após a implementação:
- A seção "Como Funciona" exibirá títulos e descrições traduzidos corretamente
- A seção "Antes vs Depois" mostrará todos os cenários com traduções adequadas
- Os avisos de tradução no console desaparecerão
