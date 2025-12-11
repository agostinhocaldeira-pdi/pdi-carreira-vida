# Roteiro de Testes Completo - PDI Carreira & Vida

## Índice
1. [Autenticação](#1-autenticação)
2. [Onboarding](#2-onboarding)
3. [Perfil do Usuário](#3-perfil-do-usuário)
4. [Plano de Vida](#4-plano-de-vida)
5. [Mão na Massa (Metas e Ações)](#5-mão-na-massa)
6. [Diário](#6-diário)
7. [Ferramentas](#7-ferramentas)
8. [Progresso e Gamificação](#8-progresso-e-gamificação)
9. [Dashboard Empresa](#9-dashboard-empresa)
10. [Gestão de PDIs (Gestor)](#10-gestão-de-pdis-gestor)
11. [Administração](#11-administração)
12. [Integrações](#12-integrações)
13. [Assinatura e Pagamentos](#13-assinatura-e-pagamentos)
14. [Notificações](#14-notificações)
15. [Suporte](#15-suporte)
16. [LGPD e Segurança](#16-lgpd-e-segurança)
17. [Relatórios PDF](#17-relatórios-pdf)

---

## Legenda de Resultados

| Tipo | Descrição |
|------|-----------|
| ✅ **Positivo** | Teste passou como esperado |
| ❌ **Negativo** | Teste falhou como esperado (validação funcionou) |
| ⚠️ **Falso Positivo** | Teste passou quando deveria ter falhado (bug de segurança/validação) |
| 🔴 **Falso Negativo** | Teste falhou quando deveria ter passado (bug funcional) |

---

## 1. Autenticação

### 1.1 Cadastro de Usuário (Pessoa Física)

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| AUTH-001 | Cadastro com dados válidos | Preencher nome, email válido, telefone, senha forte e confirmar | ✅ Usuário criado, redirecionado para seleção de plano | |
| AUTH-002 | Cadastro com email já existente | Tentar cadastrar com email já registrado | ❌ Mensagem "Email já cadastrado" exibida | |
| AUTH-003 | Cadastro com email inválido | Inserir email sem formato correto (ex: "teste@") | ❌ Validação impede envio do formulário | |
| AUTH-004 | Cadastro com senha fraca | Inserir senha com menos de 6 caracteres | ❌ Mensagem de senha inválida exibida | |
| AUTH-005 | Cadastro sem aceitar LGPD | Tentar cadastrar sem marcar checkbox de termos | ❌ Botão de cadastro desabilitado | |
| AUTH-006 | **Falso Positivo** - SQL Injection no email | Inserir `'; DROP TABLE users;--` no campo email | ⚠️ Se cadastro for aceito = BUG CRÍTICO | |
| AUTH-007 | **Falso Negativo** - Email case-sensitive | Cadastrar com "Teste@Email.com" e logar com "teste@email.com" | 🔴 Se login falhar = BUG (deve ser case-insensitive) | |

### 1.2 Login

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| AUTH-010 | Login com credenciais válidas | Inserir email e senha corretos | ✅ Redirecionado para /home | |
| AUTH-011 | Login com senha incorreta | Inserir email correto e senha errada | ❌ Mensagem "Credenciais inválidas" | |
| AUTH-012 | Login com email não cadastrado | Inserir email inexistente | ❌ Mensagem de erro apropriada | |
| AUTH-013 | Login com campos vazios | Clicar em "Entrar" sem preencher campos | ❌ Validação impede envio | |
| AUTH-014 | Persistência de sessão | Fazer login, fechar aba, reabrir aplicação | ✅ Usuário permanece logado | |
| AUTH-015 | **Falso Positivo** - Brute force | Tentar 100 senhas erradas seguidas | ⚠️ Se não houver bloqueio = Risco de segurança | |
| AUTH-016 | Visibilidade de senha | Clicar no ícone de olho no campo senha | ✅ Senha visível/oculta alternadamente | |

### 1.3 Cadastro de Empresa

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| AUTH-020 | Cadastro empresa dados válidos | Preencher razão social, CNPJ válido, email, endereço | ✅ Empresa criada, usuário com role "empresa" | |
| AUTH-021 | CNPJ inválido | Inserir CNPJ com formato incorreto | ❌ Validação de CNPJ falha | |
| AUTH-022 | CNPJ duplicado | Cadastrar empresa com CNPJ já existente | ❌ Mensagem "CNPJ já cadastrado" | |
| AUTH-023 | CEP auto-preenchimento | Inserir CEP válido | ✅ Cidade, estado e logradouro preenchidos automaticamente | |
| AUTH-024 | CEP inválido | Inserir CEP inexistente | ❌ Mensagem de CEP não encontrado | |

### 1.4 Primeiro Acesso (Gestor/Funcionário)

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| AUTH-030 | Primeiro acesso gestor | Gestor faz login pela primeira vez via convite | ✅ Modal de troca de senha aparece | |
| AUTH-031 | Primeiro acesso funcionário | Funcionário faz login via convite | ✅ Redirecionado para onboarding após trocar senha | |
| AUTH-032 | **Falso Negativo** - Link expirado | Clicar em link de convite após 7 dias | 🔴 Se permitir acesso = BUG de segurança | |

### 1.5 Recuperação de Senha

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| AUTH-040 | Solicitar reset com email válido | Inserir email cadastrado | ✅ Email de recuperação enviado | |
| AUTH-041 | Solicitar reset com email inexistente | Inserir email não cadastrado | ❌ Mensagem genérica (não revelar se email existe) | |
| AUTH-042 | Usar link de reset | Clicar no link do email e definir nova senha | ✅ Senha alterada com sucesso | |

---

## 2. Onboarding

### 2.1 Fluxo de Onboarding

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ONB-001 | Completar todas as etapas | Navegar por todas as 7 etapas preenchendo campos | ✅ Dados salvos, redirecionado para /home | |
| ONB-002 | Tentar avançar sem preencher | Clicar "Próximo" sem preencher campo obrigatório | ❌ Botão desabilitado ou validação impede | |
| ONB-003 | Voltar etapas | Clicar "Voltar" em etapas intermediárias | ✅ Dados preenchidos anteriormente mantidos | |
| ONB-004 | Seleção de fase da vida | Selecionar uma das opções de fase | ✅ Seleção registrada, pode avançar | |
| ONB-005 | Campo de expectativas | Preencher texto longo em expectativas | ✅ Texto salvo corretamente (até 1000 caracteres) | |
| ONB-006 | Survey final (não-admin) | Completar survey de hábitos | ✅ Dados salvos em user_surveys | |
| ONB-007 | Survey skip para admin | Admin completa onboarding | ✅ Survey não é exibido para admins | |

### 2.2 Endereço no Onboarding

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ONB-010 | CEP válido | Inserir CEP e aguardar auto-preenchimento | ✅ Campos preenchidos automaticamente | |
| ONB-011 | CEP inválido | Inserir CEP inexistente | ❌ Mensagem de erro, campos manuais habilitados | |
| ONB-012 | Editar endereço auto-preenchido | Alterar cidade após auto-preenchimento | ✅ Alteração permitida e salva | |

---

## 3. Perfil do Usuário

### 3.1 Visualização e Edição

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PERF-001 | Visualizar dados do perfil | Acessar /perfil | ✅ Nome, email, telefone, role exibidos | |
| PERF-002 | Editar nome | Alterar nome e salvar | ✅ Nome atualizado com sucesso | |
| PERF-003 | Editar telefone | Alterar telefone para formato válido | ✅ Telefone atualizado | |
| PERF-004 | Alterar senha | Inserir senha atual e nova senha válida | ✅ Senha alterada com sucesso | |
| PERF-005 | Alterar senha com atual incorreta | Inserir senha atual errada | ❌ Mensagem de erro | |
| PERF-006 | Visualizar empresa vinculada | Funcionário/Gestor acessa perfil | ✅ Dados da empresa exibidos | |

### 3.2 Planos de Assinatura

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PERF-010 | Visualizar plano atual | Acessar seção de planos | ✅ Plano atual destacado | |
| PERF-011 | Gerenciar assinatura | Clicar em "Gerenciar Assinatura" | ✅ Redirecionado para Stripe Customer Portal | |
| PERF-012 | Plano gratuito expirado | Acessar perfil após 30 dias no gratuito | ✅ Modal de expiração exibido | |

---

## 4. Plano de Vida

### 4.1 VVD (Visão de Vida Desejada)

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| VVD-001 | Criar VVD | Preencher texto e clicar "Salvar" | ✅ VVD salvo, campo desabilitado | |
| VVD-002 | Editar VVD existente | Clicar "Editar", alterar texto, salvar | ✅ VVD atualizado | |
| VVD-003 | VVD vazio | Tentar salvar sem texto | ❌ Botão salvar desabilitado | |
| VVD-004 | Persistência | Salvar VVD, sair e voltar | ✅ VVD carregado corretamente | |
| VVD-005 | Geração de parágrafo (IA) | Clicar para gerar parágrafo resumido | ✅ IA gera resumo em 1 parágrafo | |
| VVD-006 | Geração de frase (IA) | Clicar para gerar frase poderosa | ✅ IA gera frase única | |
| VVD-007 | **Falso Negativo** - IA offline | Tentar gerar com API indisponível | 🔴 Se app travar = BUG (deve mostrar erro amigável) | |

### 4.2 Valores

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| VAL-001 | Adicionar valores | Preencher até 12 campos de valores | ✅ Valores salvos | |
| VAL-002 | Salvar com 1 valor | Preencher apenas 1 campo | ✅ Permitido salvar | |
| VAL-003 | Editar valores | Alterar valores existentes e salvar | ✅ Alterações persistidas | |
| VAL-004 | **Falso Positivo** - XSS em valores | Inserir `<script>alert('xss')</script>` | ⚠️ Se script executar = BUG CRÍTICO | |

### 4.3 Áreas da Vida (Roda da Vida)

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| AREA-001 | Definir notas atuais | Ajustar slider de 0-10 para cada área | ✅ Notas salvas | |
| AREA-002 | Definir notas desejadas | Ajustar slider de nota desejada | ✅ Notas salvas | |
| AREA-003 | Visualizar gráfico radar | Acessar Roda da Vida | ✅ Gráfico renderizado corretamente | |
| AREA-004 | Adicionar área personalizada | Criar nova área além das 8 padrão | ✅ Área adicionada (se disponível) | |

### 4.4 Objetivos

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| OBJ-001 | Criar objetivo | Preencher texto, data alvo, conexão VVD | ✅ Objetivo criado com status "a fazer" | |
| OBJ-002 | Limite de 3 objetivos ativos | Tentar criar 4º objetivo | ❌ Aviso sobre limite exibido | |
| OBJ-003 | Editar objetivo | Alterar texto de objetivo existente | ✅ Alteração salva | |
| OBJ-004 | Excluir objetivo | Clicar em excluir, confirmar | ✅ Objetivo removido | |
| OBJ-005 | Cancelar exclusão | Clicar em excluir, cancelar no modal | ✅ Objetivo mantido | |
| OBJ-006 | Alterar status | Mudar de "a fazer" para "em andamento" | ✅ Status atualizado | |
| OBJ-007 | Concluir objetivo | Mudar status para "concluído" | ✅ Status atualizado, contabilizado no progresso | |
| OBJ-008 | Modal pós-criação | Criar objetivo e fechar modal | ✅ Modal pergunta se quer criar meta | |

---

## 5. Mão na Massa

### 5.1 Metas

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| META-001 | Criar meta vinculada a objetivo | Selecionar objetivo, preencher meta | ✅ Meta criada e vinculada | |
| META-002 | Criar meta sem objetivo selecionado | Tentar criar meta sem selecionar objetivo | ❌ Campos desabilitados | |
| META-003 | Editar meta | Clicar em editar, alterar dados, salvar | ✅ Meta atualizada | |
| META-004 | Excluir meta | Clicar excluir, confirmar | ✅ Meta e ações vinculadas removidas | |
| META-005 | Marcar meta como concluída | Alterar status para concluído | ✅ Meta concluída | |
| META-006 | Auto-collapse do form | Salvar meta | ✅ Formulário minimizado automaticamente | |
| META-007 | Auto-expand ao editar | Clicar editar em meta da tabela | ✅ Form expande e faz scroll | |

### 5.2 Ações

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ACAO-001 | Adicionar ação | Preencher texto, periodicidade, status | ✅ Ação adicionada à meta | |
| ACAO-002 | Editar ação inline | Clicar lápis, editar, salvar | ✅ Ação atualizada | |
| ACAO-003 | Excluir ação | Clicar lixeira, confirmar | ✅ Ação removida | |
| ACAO-004 | Alterar status da ação | Mudar de "a fazer" para "concluído" | ✅ Status atualizado | |
| ACAO-005 | **Falso Negativo** - Salvar ação vazia | Tentar salvar ação sem texto | 🔴 Se salvar = BUG de validação | |

### 5.3 Passos

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PASSO-001 | Adicionar passo | Preencher texto do passo | ✅ Passo adicionado | |
| PASSO-002 | Marcar passo concluído | Clicar checkbox | ✅ Passo marcado como concluído | |
| PASSO-003 | Excluir passo | Clicar em remover | ✅ Passo removido | |

---

## 6. Diário

### 6.1 Registro de Hoje

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| DIARIO-001 | Criar entrada do dia | Preencher humor, reflexão, gratidão | ✅ Entrada salva | |
| DIARIO-002 | Editar entrada do dia | Alterar campos e salvar | ✅ Entrada atualizada | |
| DIARIO-003 | Selecionar hábitos | Marcar hábitos praticados | ✅ Hábitos salvos | |
| DIARIO-004 | Registrar conquistas | Preencher campo de conquistas | ✅ Conquistas salvas | |
| DIARIO-005 | **Falso Positivo** - Editar data passada | Tentar editar entrada de ontem | ⚠️ Se permitir edição = violação de regra de negócio | |

### 6.2 Histórico

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| DIARIO-010 | Visualizar histórico | Acessar aba "Ver Histórico" | ✅ Calendário e entradas exibidos | |
| DIARIO-011 | Selecionar data passada | Clicar em data no calendário | ✅ Entrada daquela data exibida (somente leitura) | |
| DIARIO-012 | Filtrar por período | Selecionar "Trimestre" | ✅ Gráfico atualizado para 90 dias | |
| DIARIO-013 | Hover no gráfico de humor | Passar mouse sobre ponto | ✅ Popup com detalhes do dia | |

---

## 7. Ferramentas

### 7.1 Análise SWOT

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| SWOT-001 | Adicionar força | Inserir texto em "Forças" | ✅ Força adicionada | |
| SWOT-002 | Adicionar fraqueza | Inserir texto em "Fraquezas" | ✅ Fraqueza adicionada | |
| SWOT-003 | Adicionar oportunidade | Inserir texto em "Oportunidades" | ✅ Oportunidade adicionada | |
| SWOT-004 | Adicionar ameaça | Inserir texto em "Ameaças" | ✅ Ameaça adicionada | |
| SWOT-005 | Excluir item | Clicar X em item existente | ✅ Item removido | |
| SWOT-006 | Persistência | Salvar, sair, voltar | ✅ Dados mantidos | |

### 7.2 Matriz de Eisenhower

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| EISEN-001 | Adicionar tarefa Q1 | Inserir em "Urgente e Importante" | ✅ Tarefa adicionada | |
| EISEN-002 | Adicionar tarefa Q2 | Inserir em "Não Urgente e Importante" | ✅ Tarefa adicionada | |
| EISEN-003 | Adicionar tarefa Q3 | Inserir em "Urgente e Não Importante" | ✅ Tarefa adicionada | |
| EISEN-004 | Adicionar tarefa Q4 | Inserir em "Não Urgente e Não Importante" | ✅ Tarefa adicionada | |
| EISEN-005 | Excluir tarefa | Remover tarefa de quadrante | ✅ Tarefa removida | |

### 7.3 Transformação de Crenças

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| CRENCA-001 | Registrar crença limitante | Preencher crença limitante | ✅ Crença salva | |
| CRENCA-002 | Responder perguntas | Preencher reflexões guiadas | ✅ Reflexões salvas | |
| CRENCA-003 | Definir nova crença | Criar crença fortalecedora | ✅ Nova crença salva | |
| CRENCA-004 | Visualizar histórico | Ver crenças trabalhadas anteriormente | ✅ Lista de crenças exibida | |

### 7.4 Autoavaliação 360°

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| AUTO360-001 | Preencher autoavaliação | Responder todas as perguntas | ✅ Respostas salvas | |
| AUTO360-002 | Adicionar feedback 360° | Inserir feedback recebido de terceiros | ✅ Feedback salvo | |
| AUTO360-003 | Gerar análise IA | Clicar para análise | ✅ IA gera análise comparativa | |
| AUTO360-004 | Visualizar histórico | Ver avaliações anteriores | ✅ Histórico exibido | |

### 7.5 Método SMART

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| SMART-001 | Criar meta SMART | Preencher S, M, A, R, T | ✅ Meta criada | |
| SMART-002 | Validação de campos | Tentar criar sem preencher todos | ❌ Validação impede | |
| SMART-003 | Exportar para Mão na Massa | Clicar para vincular a objetivo | ✅ Meta criada em user_goals | |

### 7.6 Roda da Vida (Ferramenta)

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| RODA-001 | Ajustar nota atual | Mover slider de área | ✅ Gráfico atualiza em tempo real | |
| RODA-002 | Ajustar nota desejada | Definir meta para área | ✅ Linha de meta exibida | |
| RODA-003 | Visualização completa | Ver todas as 8 áreas no radar | ✅ Gráfico completo renderizado | |

---

## 8. Progresso e Gamificação

### 8.1 Seu Progresso

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PROG-001 | Visualizar barras de progresso | Acessar seção de progresso | ✅ % de objetivos, metas, ações exibido | |
| PROG-002 | Itens com prazo expirado | Ter itens vencidos | ✅ Card de alerta exibido | |
| PROG-003 | Clicar em item expirado | Clicar no item do alerta | ✅ Navega para seção correta | |
| PROG-004 | Gerar insight | Clicar em "Gerar Insight" | ✅ IA gera insight personalizado | |
| PROG-005 | Limite mensal de insights | Gerar 2º insight no mesmo mês | ❌ Mensagem de limite exibida (não-admin) | |
| PROG-006 | Admin sem limite | Admin gera múltiplos insights | ✅ Sem restrição para admin | |

### 8.2 Gamificação

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| GAME-001 | Visualizar streak | Acessar home | ✅ Dias consecutivos exibidos | |
| GAME-002 | Manter streak | Fazer atividade em dias consecutivos | ✅ Contador incrementa | |
| GAME-003 | Perder streak | Não acessar por 2+ dias | ✅ Contador reseta | |
| GAME-004 | Desbloquear conquista | Completar requisito de achievement | ✅ Notificação de conquista | |
| GAME-005 | Visualizar conquistas | Acessar seção de badges | ✅ Conquistas desbloqueadas destacadas | |
| GAME-006 | Ver progresso de nível | Verificar XP e nível atual | ✅ Barra de progresso exibida | |

---

## 9. Dashboard Empresa

### 9.1 Acesso e Navegação

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| EMP-001 | Acessar como empresa | Login com role "empresa" | ✅ Redirecionado para /dashboard-empresa | |
| EMP-002 | Usuário comum tenta acessar | Navegar para /dashboard-empresa sem role | ❌ Acesso negado, redirecionado | |
| EMP-003 | Admin acessa qualquer empresa | Admin acessa dashboard | ✅ Acesso permitido | |

### 9.2 Gestores

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| EMP-010 | Cadastrar gestor | Preencher nome, email, telefone | ✅ Gestor criado, convite enviado | |
| EMP-011 | Email duplicado | Cadastrar gestor com email existente | ❌ Mensagem de erro | |
| EMP-012 | Gerar nova senha provisória | Clicar ícone de chave | ✅ Nova senha gerada, email enviado | |
| EMP-013 | Remover gestor | Clicar excluir, confirmar | ✅ Gestor removido | |
| EMP-014 | Ver progresso do gestor | Clicar no nome do gestor | ✅ Modal com progresso exibido | |

### 9.3 Funcionários

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| EMP-020 | Cadastrar funcionário | Preencher dados do funcionário | ✅ Funcionário criado, convite enviado | |
| EMP-021 | Associar a gestor | Selecionar funcionários e associar | ✅ Vinculação salva | |
| EMP-022 | Desassociar de gestor | Remover vinculação | ✅ Funcionário sem gestor | |
| EMP-023 | Ver progresso do funcionário | Clicar no nome | ✅ Modal com progresso | |
| EMP-024 | Funcionário já tem gestor | Tentar associar a outro gestor | ❌ Opção não disponível (1:1) | |

### 9.4 OKRs

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| EMP-030 | Criar OKR | Preencher título, período, key results | ✅ OKR criado | |
| EMP-031 | Editar OKR | Alterar dados existentes | ✅ OKR atualizado | |
| EMP-032 | Vincular funcionários | Selecionar funcionários para OKR | ✅ Vinculação salva | |
| EMP-033 | Ver alinhamento | Verificar % de funcionários alinhados | ✅ Percentual calculado corretamente | |
| EMP-034 | Excluir OKR | Remover OKR | ✅ OKR e vínculos removidos | |

### 9.5 Faturamento

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| EMP-040 | Visualizar faturamento | Acessar aba Faturamento | ✅ Valor baseado em funcionários ativos | |
| EMP-041 | 1-10 funcionários | Empresa com 5 funcionários | ✅ Valor = R$ 50/mês | |
| EMP-042 | 11-20 funcionários | Empresa com 15 funcionários | ✅ Valor = R$ 90/mês | |
| EMP-043 | 21+ funcionários | Empresa com 25 funcionários | ✅ Valor = R$ 150/mês | |

---

## 10. Gestão de PDIs (Gestor)

### 10.1 Acesso

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| GEST-001 | Gestor acessa | Login como gestor, ir para /gestao-pdis | ✅ Lista de funcionários vinculados | |
| GEST-002 | Usuário comum tenta acessar | Navegar para /gestao-pdis sem role | ❌ Acesso negado | |
| GEST-003 | Admin vê todos | Admin acessa página | ✅ Filtro de empresas disponível | |

### 10.2 Visualização de Progresso

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| GEST-010 | Ver progresso de funcionário | Clicar "Ver Progresso" | ✅ Modal com objetivos, metas, ações | |
| GEST-011 | Ver funcionário sem dados | Funcionário não preencheu PDI | ✅ Mensagem "sem dados ainda" | |

### 10.3 Mensagens

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| GEST-020 | Ver mensagens | Acessar aba "Mensagens" | ✅ Lista de mensagens de funcionários | |
| GEST-021 | Responder mensagem | Enviar resposta | ✅ Mensagem salva e notificação | |
| GEST-022 | Badge de não lidas | Ter mensagens não lidas | ✅ Badge com contador exibido | |
| GEST-023 | Marcar como lida | Abrir conversa | ✅ Badge atualizado | |

---

## 11. Administração

### 11.1 Acesso Admin

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ADM-001 | Admin acessa /admin | Login como admin | ✅ Dashboard admin carregado | |
| ADM-002 | Não-admin tenta acessar | Usuário comum vai para /admin | ❌ Acesso negado | |

### 11.2 Métricas

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ADM-010 | Ver total de usuários | Acessar painel de métricas | ✅ Contador correto do banco | |
| ADM-011 | Ver empresas cadastradas | Verificar card de empresas | ✅ Total correto | |
| ADM-012 | Ver taxa de sucesso | Verificar KPI de conclusão | ✅ Percentual calculado | |
| ADM-013 | Ver usuários ativos | Verificar ativos últimos 30 dias | ✅ Contagem correta | |

### 11.3 Gestão de Administradores

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ADM-020 | Adicionar administrador | Preencher dados | ✅ Admin criado com role | |
| ADM-021 | Remover administrador | Excluir admin não-primário | ✅ Admin removido | |
| ADM-022 | Tentar remover admin primário | Excluir admin principal | ❌ Ação bloqueada | |
| ADM-023 | Auto-exclusão bloqueada | Admin tenta se excluir | ❌ Ação bloqueada | |

### 11.4 Pesquisas de Satisfação

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ADM-030 | Ver resultados CSAT | Acessar dashboard de pesquisas | ✅ Gráficos e médias exibidos | |
| ADM-031 | Ver feedbacks recentes | Verificar tabela de feedbacks | ✅ Lista de feedbacks | |

### 11.5 Dashboard Financeiro

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| ADM-040 | Ver receita | Verificar card de receita | ✅ Valor de assinaturas | |
| ADM-041 | Ver despesas automáticas | Verificar custos de serviços | ✅ Lovable, Stripe, etc. | |
| ADM-042 | Adicionar despesa manual | Inserir despesa | ✅ Despesa salva | |
| ADM-043 | Ver resultado líquido | Verificar cálculo | ✅ Receita - Despesas | |

---

## 12. Integrações

### 12.1 Google Calendar

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| INT-001 | Conectar Google Calendar | Clicar "Conectar" | ✅ OAuth flow iniciado | |
| INT-002 | Autorizar acesso | Aceitar permissões no Google | ✅ Integração ativada | |
| INT-003 | Sincronizar metas | Clicar "Sincronizar" | ✅ Metas enviadas ao Calendar | |
| INT-004 | Token expirado | Sincronizar com token vencido | ✅ Re-autenticação automática | |
| INT-005 | Desconectar | Clicar "Desconectar" | ✅ Integração removida | |
| INT-006 | **Falso Negativo** - Erro de rede | Sincronizar sem internet | 🔴 Se app travar = BUG (deve mostrar erro) | |

### 12.2 Outras Integrações

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| INT-010 | Notion desabilitado | Verificar botão Notion | ✅ "Em breve" exibido | |
| INT-011 | Outras integrações | Verificar lista | ✅ Todas com "Em breve" | |

---

## 13. Assinatura e Pagamentos

### 13.1 Fluxo de Assinatura

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PAG-001 | Selecionar plano Básico | Clicar em assinar | ✅ Redirecionado para Stripe | |
| PAG-002 | Completar pagamento | Inserir dados de cartão teste | ✅ Assinatura ativada | |
| PAG-003 | Pagamento recusado | Usar cartão de teste que falha | ❌ Mensagem de erro do Stripe | |
| PAG-004 | Webhook de sucesso | Stripe envia evento | ✅ Status atualizado no banco | |

### 13.2 Trial Gratuito

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PAG-010 | Iniciar trial | Selecionar plano Gratuito | ✅ 30 dias de acesso total | |
| PAG-011 | Trial expira | Acessar após 30 dias | ✅ Modal de expiração + bloqueio de edição | |
| PAG-012 | Upgrade após expiração | Clicar em fazer upgrade | ✅ Redirecionado para Stripe | |

### 13.3 Cancelamento

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PAG-020 | Acessar portal | Clicar "Gerenciar Assinatura" | ✅ Stripe Customer Portal | |
| PAG-021 | Cancelar assinatura | Cancelar no portal | ✅ Acesso até fim do período pago | |

---

## 14. Notificações

### 14.1 Notificações por Email

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| NOTIF-001 | Lembrete de diário | Não preencher diário por 3 dias | ✅ Email enviado às 17h | |
| NOTIF-002 | Prazo de meta | Meta com prazo em 3 dias | ✅ Email de alerta | |
| NOTIF-003 | Resumo semanal | Domingo às 7h | ✅ Email com resumo da semana | |
| NOTIF-004 | **Falso Positivo** - Spam | Receber 10 emails no mesmo dia | ⚠️ Se ocorrer = Bug de rate limit | |

### 14.2 Preferências

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| NOTIF-010 | Desativar email | Toggle de email off | ✅ Emails não enviados | |
| NOTIF-011 | Alterar horário | Mudar hora do lembrete | ✅ Configuração salva | |
| NOTIF-012 | Alterar dias de antecedência | Mudar para 7 dias | ✅ Configuração salva | |

---

## 15. Suporte

### 15.1 Tickets de Suporte

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| SUP-001 | Criar ticket | Preencher categoria e mensagem | ✅ Ticket criado | |
| SUP-002 | Ver histórico | Acessar tickets anteriores | ✅ Lista de tickets | |
| SUP-003 | Responder ticket | Adicionar mensagem | ✅ Mensagem anexada | |
| SUP-004 | Badge de não lidos | Admin responde | ✅ Badge atualizado para usuário | |

### 15.2 Conversa com Gestor (Funcionário)

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| SUP-010 | Enviar para gestor | Selecionar "Conversa com Gestor" | ✅ Mensagem enviada ao gestor | |
| SUP-011 | Funcionário sem gestor | Tentar enviar sem gestor vinculado | ❌ Opção indisponível ou mensagem | |

### 15.3 FAQ

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| SUP-020 | Acessar FAQ | Ir para seção de FAQ | ✅ Perguntas frequentes exibidas | |
| SUP-021 | Expandir pergunta | Clicar em pergunta | ✅ Resposta expandida | |
| SUP-022 | Buscar no FAQ | Filtrar perguntas | ✅ Resultados filtrados | |

---

## 16. LGPD e Segurança

### 16.1 Consentimento

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| LGPD-001 | Ver termos no cadastro | Clicar no link de termos | ✅ Modal com termos exibido | |
| LGPD-002 | Aceitar termos | Marcar checkbox | ✅ Consentimento registrado | |
| LGPD-003 | Registro de consentimento | Verificar no banco | ✅ user_consents populado | |

### 16.2 Exportação de Dados

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| LGPD-010 | Exportar meus dados | Clicar "Exportar Dados" no perfil | ✅ JSON com todos os dados | |
| LGPD-011 | **Falso Positivo** - Exportar dados de outro | Tentar exportar dados de outro user | ⚠️ Se permitir = BUG CRÍTICO | |

### 16.3 Exclusão de Dados

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| LGPD-020 | Solicitar exclusão | Clicar "Solicitar Exclusão" | ✅ Solicitação registrada | |
| LGPD-021 | Admin processa exclusão | Aprovar solicitação | ✅ Dados do usuário removidos | |
| LGPD-022 | Verificar audit log | Checar log de exclusão | ✅ Ação registrada | |

### 16.4 Segurança de Dados

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| SEC-001 | RLS em objetivos | Usuário A tenta ver dados de B | ❌ Acesso negado via RLS | |
| SEC-002 | RLS em diário | Usuário tenta acessar diário de outro | ❌ Acesso negado | |
| SEC-003 | API sem autenticação | Chamar API sem token | ❌ 401 Unauthorized | |
| SEC-004 | **Falso Positivo** - Acesso público | Dados vazando sem auth | ⚠️ Se ocorrer = BUG CRÍTICO | |

---

## 17. Relatórios PDF

### 17.1 PDI Completo

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PDF-001 | Gerar PDI Completo | Clicar "Exportar PDI" | ✅ PDF gerado com todas as seções | |
| PDF-002 | Conteúdo do PDF | Verificar seções | ✅ VVD, Valores, Objetivos, Metas, etc. | |
| PDF-003 | PDF sem dados | Usuário sem preenchimento | ✅ Mensagens de "não preenchido" | |

### 17.2 Relatório de Progresso

| ID | Cenário | Ação | Resultado Esperado | Status |
|----|---------|------|-------------------|--------|
| PDF-010 | Gerar Relatório | Clicar "Relatório de Progresso" | ✅ PDF com métricas e gráficos | |
| PDF-011 | Dados de humor | Verificar análise de humor | ✅ Gráfico e tendências | |
| PDF-012 | Insights incluídos | Verificar seção de insights | ✅ Último insight gerado | |

---

## Checklist de Execução

### Pré-requisitos
- [ ] Ambiente de testes configurado (Stripe test mode)
- [ ] Usuários de teste criados para cada role
- [ ] Empresa de teste com gestores e funcionários
- [ ] Dados de teste populados

### Execução
- [ ] Testes de Autenticação concluídos
- [ ] Testes de Onboarding concluídos
- [ ] Testes de Perfil concluídos
- [ ] Testes de Plano de Vida concluídos
- [ ] Testes de Mão na Massa concluídos
- [ ] Testes de Diário concluídos
- [ ] Testes de Ferramentas concluídos
- [ ] Testes de Progresso/Gamificação concluídos
- [ ] Testes de Dashboard Empresa concluídos
- [ ] Testes de Gestão PDIs concluídos
- [ ] Testes de Administração concluídos
- [ ] Testes de Integrações concluídos
- [ ] Testes de Pagamentos concluídos
- [ ] Testes de Notificações concluídos
- [ ] Testes de Suporte concluídos
- [ ] Testes de LGPD/Segurança concluídos
- [ ] Testes de PDFs concluídos

### Bugs Encontrados
| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| | | | |

---

## Observações Finais

- **Falsos Positivos** identificados devem ser tratados como bugs de segurança
- **Falsos Negativos** identificados devem ser tratados como bugs funcionais
- Executar testes em diferentes navegadores (Chrome, Firefox, Safari)
- Executar testes em diferentes dispositivos (Desktop, Tablet, Mobile)
- Documentar todos os bugs encontrados com screenshots e passos para reprodução
