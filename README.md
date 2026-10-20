# remotion

Gerador de vídeos verticais educacionais (9:16, 720×1280, 30 fps) no formato de referência "Tesla Roadster / Ancoragem de preço", feito com [Remotion](https://www.remotion.dev).

## Como funciona

1. Cada vídeo é descrito em um arquivo JSON em `roteiro/`. Cada cena tem um `type` e uma `duration` em segundos.
2. `src/Video.tsx` lê o roteiro e encadeia as cenas no tempo.
3. `src/Root.tsx` calcula a duração total somando as cenas.
4. `src/theme.ts` guarda a identidade visual (cores, fontes, tamanhos).

### Tipos de cena

| `type` | Uso | Campos |
|---|---|---|
| `title` | Gancho em manchete serifada, centralizada | `text` |
| `caption` | Legenda na parte inferior | `text` |
| `bars` | Barras de quadradinhos para comparar valores | `unitValue`, `items[]`, `caption?` |
| `ruler` | Régua de ancoragem com marcadores proporcionais | `max`, `markers[]`, `caption?` |
| `endcard` | Marca + CTA + handle | `cta` |

Todo vídeo tem `meta` com `section`, `date`, `brand` e `handle`, exibidos no cabeçalho e no rodapé.

## Comandos

```bash
npm install
npm run studio      # preview no navegador, com edição ao vivo
npm run typecheck   # verificação de tipos
npm run render      # gera out/video.mp4
```

Para criar um novo vídeo, copie `roteiro/tesla-ancoragem.json`, ajuste `meta` e as cenas, e renderize apontando para o novo arquivo (ver Próximos passos).

## Tokens visuais

Extraídos (aproximados) do vídeo de referência, em `src/theme.ts`:

| Papel | HEX |
|---|---|
| Fundo | `#080808` |
| Texto | `#E8E8E8` |
| Texto secundário | `#888888` |
| Linha | `#404040` |
| Destaque | `#C5CC7A` (estimado, confiança média) |

## Limitações conhecidas

- **Sem narração.** O original é legendado. Narração (TTS) precisa ser adicionada como trilha de áudio e a duração das cenas deve ser ajustada ao áudio gerado.
- **Sem ilustração.** O carro e a rampa do original não estão reproduzidos. Os visuais são blocos, réguas e texto.
- **Roteiro parcial.** `roteiro/tesla-ancoragem.json` cobre só o início do vídeo original (~42 s de 132 s).
- **Fontes do sistema.** Não há fontes externas carregadas. A tipografia do original não foi identificada com certeza.
- **Licença do Remotion.** Verifique a licença atual antes de usar comercialmente.

## Próximos passos

- Adicionar TTS e sincronizar a duração das cenas com o áudio.
- Criar cenas de ilustração (SVG) para o carro e a rampa.
- Terminar o roteiro do vídeo original (~42 s a 132 s).
- Adicionar um script `npm run render -- roteiro/<arquivo>.json` que aceite outro roteiro.
