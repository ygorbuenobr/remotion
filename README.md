# remotion

Gerador de vídeos verticais educacionais (9:16, 720×1280, 30 fps) no formato de referência "Tesla Roadster / Ancoragem de preço", feito com [Remotion](https://www.remotion.dev).

O exemplo completo (132 s, 65 cenas) está em `roteiro/tesla-ancoragem.json`. Para montar outro tema, siga `docs/COMO-FAZER-UM-VIDEO.md`.

## Como funciona

1. Cada vídeo é descrito por um JSON em `roteiro/`. Cada cena tem `type`, `duration` (segundos), `caption` e os campos do visual.
2. `src/Video.tsx` encadeia as cenas no tempo, cada uma em um `<Sequence>`.
3. `src/visuals.tsx` contém os 10 tipos de visual (`news`, `cards`, `tree`, `attention`, `ladder`, `ruler`, `menu`, `bottles`, `options`, `sai`).
4. `src/types.ts` define o contrato de cada cena.
5. `src/theme.ts` guarda cores, fontes e medidas.
6. `src/Root.tsx` calcula a duração total somando as cenas.

## Comandos

```bash
npm install
npm run studio                      # preview no navegador, com edição ao vivo
npm run validate                    # valida todos os roteiros em roteiro/
npm run typecheck                   # verificação de tipos
npm test                            # typecheck + validate
npm run render -- --props=roteiro/tesla-ancoragem.json   # gera out/video.mp4
```

Para outro roteiro, use o comando direto para dar nome ao arquivo de saída:

```bash
npx remotion render src/index.ts Video out/meu-tema.mp4 --props=roteiro/meu-tema.json
```

## Tokens visuais

Amostrados (aproximados) dos frames de referência, em `src/theme.ts`:

| Papel | HEX |
|---|---|
| Fundo | `#080808` |
| Texto | `#E8E8E8` |
| Texto secundário | `#888888` |
| Linha | `#404040` |
| Destaque | `#C5CC7A` (estimado, confiança média) |

## Estado atual

Feito:
- Os 132 s do original, com o texto das legendas, os números e a ordem das cenas conferidos frame a frame.
- Os 10 tipos de visual, incluindo a rampa, o carro, as barras de blocos, a régua de ancoragem, o cardápio, as garrafas, os pacotes e o fechamento.
- Validação do roteiro (estrutura, frames inteiros, duração total).
- Suporte a áudio por cena (campo `audio`, arquivos em `public/audio/`).

Não feito, ou feito de forma aproximada:
- **Narração.** Não há áudio gerado no repositório. Os arquivos de voz precisam ser criados (TTS ou gravação) e referenciados em cada cena.
- **Coordenadas.** As posições dos elementos foram estimadas a partir de frames de 400 px. Diferenças de alguns pixels são esperadas.
- **Carro e rampa.** São SVG simplificados. A curva da rampa e a silhueta do carro não são idênticas às do original.
- **Ícone do Instagram.** No original ele alterna entre o canto superior direito e o inferior esquerdo em algumas cenas. Aqui fica sempre no inferior esquerdo.
- **Fontes.** Usa fontes do sistema. A tipografia exata do original não foi identificada.
- **Licença do Remotion.** Verifique a licença atual antes de uso comercial.

## Testes

`npm test` roda o typecheck e a validação dos roteiros. Não há testes visuais automáticos. A conferência visual foi feita com contact sheets dos frames renderizados, comparados à referência.
