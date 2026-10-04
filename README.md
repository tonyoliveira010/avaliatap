# Remix of BuildBox Logistics

PRD — Tela Inicial Interna do Cliente



Plataforma de aluguel inteligente de tambores para pequenas obras



MVP Fase 1 — Solicitação e acompanhamento de pedidos





---



Objetivo da Tela



Criar a principal tela interna do cliente após login, onde ele poderá:



solicitar tambores



visualizar pedidos ativos



acompanhar status



visualizar cobranças



enviar fotos diárias



solicitar retirada



acompanhar prazo do aluguel.





A experiência deve ser:



mobile-first



extremamente simples



rápida



moderna



intuitiva



semelhante a apps como Uber/iFood.







---



Objetivo do MVP



Validar:



demanda



fluxo operacional



logística



cobrança



comportamento dos clientes.





O foco NÃO é complexidade. O foco é:



velocidade operacional e clareza visual.





---



Estilo Visual



Interface:



clean UI



moderna



minimalista



profissional.





Referências:



Uber



iFood



Notion



Linear



Careem.







---



Paleta



Primária:



verde escuro



chumbo



branco.





Sensação:



construção moderna



logística



tecnologia



confiança.







---



Estrutura Principal da Tela



1. Header Superior



Conteúdo:



saudação do usuário



foto/avatar



localização atual



botão notificações.





Exemplo: “Olá, Rogério 👋”



Abaixo: “2 pedidos ativos”





---



2. Card Principal — Solicitar Tambor



Grande destaque inicial.



Botão:



“Solicitar Tambor”



Descrição: “Alugue tambores para descarte de pequenas obras e reformas.”





---



Ao clicar:



abrir modal ou nova tela.





---



3. Formulário de Solicitação



Campos:



Tipo de material



Seleção:



Entulho



Areia



Pedra



Madeira



Gesso



Recicláveis



Terra.







---



Quantidade de tambores



Stepper:











---



Tipo de obra



Reforma pequena



Pintura



Construção



Limpeza



Comercial.







---



Endereço



autocomplete



mapa integrado futuramente.







---



Prazo desejado



1 dia



3 dias



semanal



personalizado.







---



Upload opcional



Foto da obra.





---



Sistema calcula automaticamente



Exibir:



diária



taxa logística estimada



caução se necessário



total previsto.







---



Botão:



“Continuar pagamento”





---



4. Área de Pedidos Ativos



Lista de cards.



Cada card deve mostrar:



Status visual



aguardando pagamento



confirmado



em entrega



ativo



próximo vencimento



retirada solicitada



finalizado.







---



Informações:



ID do pedido



quantidade de tambores



endereço



prazo restante



motorista responsável.







---



Barra de progresso



Exemplo: Entrega → Em uso → Retirada → Finalizado.





---



5. Card de Controle do Tambor



Elemento MUITO importante.



Mostrar:



dias restantes



ocupação estimada



status da vistoria diária.







---



Upload diário obrigatório



Botão:



“Enviar foto de hoje”



O cliente deve:



tirar foto



confirmar ocupação.







---



Regras:



1 foto por dia



horário validado



data automática.







---



Objetivo:



segurança



evitar fraude



validar uso



evitar retenção indevida.







---



6. Solicitar Retirada



Botão:



“Solicitar coleta”



Ao clicar:



sistema calcula logística



estimativa de retirada



possível custo adicional.







---



7. Área Financeira Simplificada



Mostrar:



pagamentos realizados



próximas cobranças



diárias extras



caução.







---



Exemplo:



Pacote: 3 dias.



Hoje: +1 diária adicional aplicada.





---



8. Notificações Inteligentes



Sistema deve enviar:



vencimento próximo



cobrança adicional



foto pendente



coleta confirmada



motorista a caminho.







---



Navegação Inferior Mobile



Bottom navigation:



Home



Tela principal.



Pedidos



Histórico.



Financeiro



Pagamentos.



Perfil



Dados da conta.





---



Requisitos Técnicos



Frontend



Lovable



React



TailwindCSS



mobile-first.







---



Backend



Supabase.







---



Funcionalidades Supabase



Auth



Database



Storage



Realtime.







---



Integrações futuras



Asaas API



Google Maps



Push notifications.







---



Estrutura inicial do banco



users



id



nome



telefone



score



endereço.







---



orders



id



user_id



driver_id



status



prazo



valor_total



logística



caução



created_at.







---



drums



id



qr_code



status



owner_driver_id



current_order_id.







---



inspections



id



order_id



image_url



created_at



validated.







---



payments



id



order_id



txid



status



valor



método.







---



Estados do Pedido



pending_payment

confirmed

driver_assigned

in_delivery

active

near_expiration

pickup_requested

completed

cancelled





---



Experiência Esperada



O usuário deve sentir que:



tudo está organizado



o descarte está sendo monitorado



existe segurança



o processo é rápido.







---



MVP FASE 1



O foco inicial será SOMENTE:



solicitação



acompanhamento



upload diário



status do pedido.





Sem:



IA



wallet



automações complexas



mapa em tempo real.







---



Objetivo Final da Tela



Transformar o processo de descarte de pequenas obras em:



uma experiência simples, rastreável e digital.Continuação do PRD — Design Premium e Clean



Direção visual da plataforma





---



OBJETIVO VISUAL



A plataforma NÃO deve parecer:



app de entulho



sistema industrial antigo



painel pesado.





Ela deve transmitir:



tecnologia + logística premium + simplicidade.



O objetivo é fazer o usuário sentir:



confiança



organização



modernidade



agilidade.







---



EXPERIÊNCIA VISUAL



A interface deve parecer:



refinada



minimalista



fluida



elegante.





Misturando:



Uber



Linear



Notion



Apple



Framer



Stripe.







---



CONCEITO VISUAL



“Logística inteligente para pequenas obras”



Visual:



clean



sofisticado



industrial moderno.







---



PALETA PREMIUM



Cor principal



Verde escuro premium:



#0F3D2E





---



Cor secundária



Chumbo elegante:



#1F2937





---



Fundo



Cinza claro suave:



#F5F7FA





---



Branco



#FFFFFF





---



Alertas



Atenção



#F59E0B



Sucesso



#10B981



Erro



#EF4444





---



TIPOGRAFIA



Fonte:



Inter



ou



Satoshi





---



Sensação da tipografia



premium



moderna



tecnológica.







---



HIERARQUIA VISUAL



Títulos



bold



espaçamento amplo



clean.







---



Textos



suaves



legíveis



pouco poluídos.







---



ESPAÇAMENTO



Interface respirando bastante.



Usar:



paddings amplos



separação clara



poucos elementos por bloco.







---



HOME PREMIUM



HERO PRINCIPAL



Grande destaque logo no topo.





---



Estrutura



Título forte



“Descarte inteligente para pequenas obras”





---



Subtexto



“Solicite tambores, acompanhe retiradas e organize sua obra de forma simples.”





---



CTA



Botão premium:



“Solicitar agora”





---



VISUAL DO HERO



Fundo:



gradiente suave



textura industrial minimalista



blur leve.







---



Elemento visual



Ilustração clean:



tambor moderno



caminhonete minimalista



construção estilizada.







---



CATEGORIAS PREMIUM



Os cards precisam parecer:



aplicativos modernos.





---



CARD STYLE



fundo branco



bordas arredondadas 24px



sombra suave



hover elegante



micro animação.







---



ÍCONES



Estilo:



outline premium



minimalista



monocromático.





Biblioteca:



Lucide ou



Phosphor Icons.







---



COMPORTAMENTO



Ao tocar:



leve escala



brilho suave



animação fluida.







---



MODAL PREMIUM



Quando abrir solicitação: o modal deve parecer:



aplicativo financeiro moderno.





---



Visual do modal



cantos arredondados grandes



fundo branco



sombra elegante



backdrop blur.







---



Header do modal



Mostrar:



ícone categoria



título



descrição curta.







---



INPUTS



Estilo:



clean



grandes



modernos.







---



Inputs devem ter:



borda suave



foco verde premium



animação leve.







---



BOTÕES



Primário



Verde premium.



Hover:



mais escuro



brilho leve.







---



Secundário



Cinza claro elegante.





---



ÁREA DE PEDIDOS



Os pedidos ativos devem parecer:



cartões inteligentes.





---



CARD DE PEDIDO



Mostrar:



categoria



status



prazo



progresso



botão acompanhar.







---



Design



fundo branco



cantos 28px



sombra leve



badge colorida.







---



STATUS BADGES



Ativo



verde suave.



Aguardando



amarelo.



Em coleta



azul.



Vencendo



vermelho leve.





---



TIMELINE DO PEDIDO



Visual:



elegante



moderna



estilo tracking do Uber.







---



Exemplo



Solicitação enviada

↓

Pagamento aprovado

↓

Motorista a caminho

↓

Tambor entregue

↓

Em uso

↓

Coleta solicitada





---



ÁREA DE VISTORIA



Upload diário deve parecer:



sistema de verificação premium.





---



COMPONENTE



Grande área:



upload drag/drop



câmera



preview da imagem.







---



Informações exibidas



data



horário



ocupação estimada



status validado.







---



BOTTOM NAVIGATION



Estilo:



iOS premium.





---



Ícones minimalistas



Home



Pedidos



Financeiro



Suporte.







---



Barra:



floating



arredondada



blur transparente.







---



ANIMAÇÕES



MUITO importante.



Tudo deve ser:



suave



rápido



moderno.







---



Usar:



Framer Motion.







---



Microinterações



Clique



leve escala.



Hover



transição suave.



Cards



fade elegante.





---



EXPERIÊNCIA FINAL



O usuário deve pensar:



“isso parece uma startup grande.”



E NÃO:



app improvisado



sistema de construção antigo



painel pesado.







---



OBJETIVO DO DESIGN



Transformar:



descarte de entulho



em:



experiência digital premium.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5b856c75-8b2e-44cf-8772-3ff62576c4e3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
