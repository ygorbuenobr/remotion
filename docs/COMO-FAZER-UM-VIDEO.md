# Como fazer um vídeo neste formato (checklist para outro tema)

Este guia assume o formato do vídeo de referência: 9:16 (720×1280), 30 fps, fundo quase preto, uma ideia por cena, legenda centralizada, um gráfico ou visual por cena e fechamento com CTA. O exemplo completo é `roteiro/tesla-ancoragem.json` (132 s, 65 cenas).

Use este documento como to-do. Os itens marcados com ⚙ são feitos no repositório; os marcados com ✍ são feitos por você ou com IA, fora do código.

---

## Fase 1: Tema e ideia central

- [ ] ✍ Escolher um fenômeno com **contradição** que o público já viu (ex: "a Tesla não vende o carro voador").
- [ ] ✍ Escolher **um princípio** que explica a contradição (ex: ancoragem de preço, custo de oportunidade, viés de disponibilidade).
- [ ] ✍ Escrever a **promessa** em uma frase: "Você está [erro comum] sem perceber, porque [princípio]."
- [ ] ✍ Listar **3 contextos** onde o mesmo princípio aparece (um do cotidiano, um de negócios, um de consumo). Isso vira as cenas de generalização.

Critério de corte: se não consegue listar 3 contextos reais, o tema é pequeno demais para 132 s. Use 60 s.

## Fase 2: Pesquisa e números

- [ ] ✍ Para cada número do roteiro, anotar **fonte e data**. O vídeo de referência usa a fonte no rodapé da cena (ex: "Fortune, 17 out 2026").
- [ ] ✍ Para cada princípio citado, anotar a **referência original** (no exemplo: Tversky & Kahneman, Science, 1974).
- [ ] ✍ Números de exemplos ilustrativos (cardápio, carta de vinhos, planos) devem ser marcados como **ilustrativos** no vídeo. O original faz isso com "ILUSTRATIVO" no cabeçalho.
- [ ] ✍ Se um número não tem fonte, troque por um ilustrativo ou remova. Não publique número sem fonte.

## Fase 3: Roteiro em frames

Escreva o roteiro como tabela antes de tocar no JSON. Use a mesma granularidade do original: **um frame de 2 s por cena**, com exceção de cenas que repetem a mesma legenda e o mesmo visual (podem virar uma cena de 4 s).

| Frame | Tempo | Legenda | Visual (tipo) | O que muda na tela |
|---|---|---|---|---|
| 1 | 0–2 s | "…" | cards (arco) | carro no chão |
| 2 | 2–4 s | "…" | cards | aparece o card X |

Regras de ritmo observadas no original:

- Gancho nos primeiros 2 a 6 s, com contradição.
- Uma frase por legenda, 6 a 12 palavras, no máximo 2 linhas.
- Troca de cena a cada 2 s, mesmo quando a legenda continua.
- Números aparecem **depois** da frase que os introduz.
- Estrutura em "Primeiro / Segundo" quando o conceito tem duas partes.
- Fechamento: "Na [marca], a gente ajuda [público] a [resultado], com base em [diferencial], não em [alternativa ruim]." Depois, CTA em 3 etapas: "Se você quer entender mais sobre [tema], / siga o nosso perfil." e o end card.

Estrutura de bloco (proporções do original, 132 s):

| Bloco | % | Função |
|---|---|---|
| Gancho | 5% | Contradição |
| Contexto | 18% | Apresenta o caso e os dados |
| Função 1 | 11% | Por que o caso chama atenção (ou o primeiro efeito) |
| Função 2 | 21% | O conceito central, com números visualizados |
| Generalização A | 17% | Primeiro exemplo do cotidiano |
| Generalização B | 11% | Aplicação em negócios |
| Cuidado | 8% | Limite do princípio |
| Fechamento + CTA | 11% | Marca e seguir |

## Fase 4: Escolher os visuais

Cada cena usa **um** tipo de visual. Escolha pelo que a cena precisa mostrar:

| Quero mostrar | Tipo | Campos principais |
|---|---|---|
| Manchete de notícia | `news` | kicker, headline, lede, source |
| Lista de opções com preço ou valor | `cards` | items (title, sub, price, style, icon) |
| Raio-X de uma estratégia (uma opção que vira "vendas" e duas funções) | `tree` | stage (0–2), root, vendas |
| Efeito de atenção com métrica em blocos e arco animado | `attention` | title, sub, metric, arc, carRampa, carSalto, cars, campaign |
| Escada de valores com barras de blocos | `ladder` | title, unit, unitValue, bars (state, blocks, unknown, label), footnote, source |
| Verbete + régua de ancoragem | `ruler` | title, sub, verbete, rails (y, max, markers), box |
| Cardápio com destaque e contagem de pedidos | `menu` | items (name, price, style, note), chart |
| Comparação de garrafas (ou produtos) em escala | `bottles` | unit, bottles (label, sub, blocks, dashed) |
| Pacotes lado a lado (consultoria, academia) | `options` | title, sub, groups, footer, rails |
| Fechamento com logo, fluxo e CTA | `sai` | stage (0–4) |

Para escalas: fixe **um valor por bloco** (ex: `unitValue: 10000` para "1 quadrado = US$ 10 mil") e use o mesmo em todas as barras da cena. Se você mudar a escala no meio, o espectador perde a comparação.

Para régua de ancoragem: `max` é o valor do fim da régua. Marcadores com `value > max` aparecem com linha tracejada até a borda (`offscale`).

## Fase 5: Montar o JSON

1. Copie `roteiro/tesla-ancoragem.json` para `roteiro/<seu-tema>.json`.
2. Ajuste `meta` (título, seção, data, marca, handle).
3. Substitua as cenas, uma por frame da tabela. Mantenha a ordem.
4. Rode a validação (passo 6). Ela confere tipos, durações em frames inteiros e a duração total.

Exemplo de cena de comparação com barras:

```json
{
  "type": "ladder",
  "duration": 2,
  "header": { "left": "FUNÇÃO 2 · ESCADA DE PREÇOS", "right": "" },
  "caption": "250 mil dólares só para entrar na fila.",
  "title": "Reserva exigida",
  "unit": "1 quadrado = US$ 10 mil",
  "unitValue": 10000,
  "bars": [
    { "state": "full", "unknown": true, "label": "Rocket", "sub": "o sonho" },
    { "state": "full", "blocks": 25, "valueLabel": "US$ 250 mil", "label": "Thrust", "sub": "a âncora" },
    { "state": "ghost", "blocks": 5 }
  ]
}
```

## Fase 6: Validar e pré-visualizar

- [ ] ⚙ `npm run validate` (confere estrutura e duração total; `--expect=132` valida se o total bate com o alvo).
- [ ] ⚙ `npm run typecheck`.
- [ ] ⚙ `npm run studio` e revisar cena por cena, comparando com a tabela da Fase 3.
- [ ] ✍ Conferir cada número contra a fonte anotada na Fase 2.

## Fase 7: Narração (opcional, mas o original tem áudio)

O formato original tem trilha de áudio, mas o repositório ainda não gera voz. Para narrar:

- [ ] ✍ Escrever o texto da narração por cena (pode ser igual à legenda).
- [ ] ✍ Gerar um arquivo de áudio por cena com um serviço de TTS (ou gravar você mesmo).
- [ ] ⚙ Colocar os arquivos em `public/audio/` e referenciar em cada cena pelo campo `audio` (ex: `"audio": "audio/tesla-01.mp3"`). O componente `Audio` já está ligado em `src/Video.tsx`.
- [ ] ✍ Se a narração for mais longa que a cena, aumente `duration` (em múltiplos de 1/30 s) e valide de novo. Cada duração precisa dar frames inteiros.

## Fase 8: Render

```bash
npm install
npx remotion render src/index.ts Video out/<seu-tema>.mp4 --props=roteiro/<seu-tema>.json
```

Se o navegador do Remotion não baixar no seu ambiente, use um Chromium já instalado com `--browser-executable=<caminho>`.

## Fase 9: Checklist de design e edição

Design:
- [ ] Fundo `#080808`, texto `#E8E8E8`, secundário `#888888`.
- [ ] Uma cor de destaque (`#C5CC7A` no original) só para o dado central.
- [ ] Rótulo de seção em monoespaçada no topo, data ou "ILUSTRATIVO" à direita.
- [ ] Números sempre visualizados (blocos, régua), não só escritos.
- [ ] Um conceito por tela. Máximo 2 linhas de legenda.

Edição:
- [ ] Troca de cena a cada 2 s.
- [ ] Legenda aparece antes ou junto do visual que explica.
- [ ] Cenas do mesmo tipo usam o mesmo layout (consistência).
- [ ] Último frame com CTA por pelo menos 3 s.
- [ ] Duração total bate com o alvo (`--expect`).

## Fase 10: Publicação

- [ ] ✍ Legenda do post com o gancho e o CTA.
- [ ] ✍ Capa: frame do gancho com a manchete ou o número central.
- [ ] ✍ Versão de 9:16 para Reels, Shorts e TikTok. Não precisa de outro formato.

---

## O que é essencial vs. detalhe

| Essencial | Detalhe (pode simplificar) |
|---|---|
| Gancho com contradição nos primeiros 6 s | Posição exata do ícone do Instagram |
| Duas funções numeradas | Cor exata do destaque |
| Nomear o conceito em uma frase | Fonte exata |
| Número visualizado (blocos ou régua) | Animação de entrada |
| Generalização em 3 ou mais contextos | Ilustração de carro ou produto |
| Bloco de cuidado | Ticks da régua |
| CTA em 3 etapas | Cabeçalho com data |

## Uso de IA em cada fase

| Fase | Onde a IA ajuda |
|---|---|
| 1 | Gerar 10 temas e ranquear por contradição e número disponível |
| 2 | Levantar fontes; **você confere cada número** |
| 3 | Transformar o roteiro em tabela de frames |
| 4 | Sugerir o tipo de visual para cada cena |
| 5 | Gerar o JSON a partir da tabela (e validar com `npm run validate`) |
| 7 | TTS por cena |
| 9 | Revisar o JSON contra o checklist |
| 10 | Legenda, capa e variações de gancho |

**Regra:** IA escreve rascunho. Você confere números, fontes e o tom antes de publicar.
