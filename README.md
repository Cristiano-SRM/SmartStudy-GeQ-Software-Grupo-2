 SmartStudy – Aplicação Web para Organização e Estudos

O SmartStudy é um protótipo de aplicação web voltado para auxiliar estudantes na organização de suas rotinas de estudo.
O sistema permite cadastro/login de usuários, criação e gerenciamento de matérias, registro de conteúdo estudado, acompanhamento de progresso e utilização de um cronômetro Pomodoro.

O projeto foi desenvolvido com foco em simplicidade, uso de tecnologias modernas e hospedagem totalmente gratuita.

Arquitetura da Aplicação

O SmartStudy é dividido em três camadas:

✔ Frontend (Interface do Usuário)

Desenvolvido em HTML, CSS e JavaScript

Hospedado no GitHub Pages

Responsável pela interface, navegação e interações do usuário

✔ Backend (Servidor da Aplicação)

Construído em Node.js + Express

Hospedado no Render.com

Recebe requisições do frontend e faz a ponte com o banco de dados

✔ Banco de Dados

Utiliza Supabase (PostgreSQL em nuvem)

Armazena:

usuários,

matérias cadastradas,

conteúdos registrados,

progresso (minutos estudados, streaks, etc.)

Links Importantes

Frontend (GitHub Pages)	https://cristiano-srm.github.io/SmartStudy-GeQ-Software-Grupo-2/SmartStudy.html

Backend (Render)	https://smartstudy-backend-fqd0.onrender.com

Repositório do Projeto	https://github.com/Cristiano-SRM/SmartStudy-GeQ-Software-Grupo-2

Funcionalidades Principais
 Autenticação

Cadastro de usuário

Login persistente via LocalStorage

 Gerenciamento de Matérias

Criar matérias com nome e cor identificadora

Registrar conteúdo estudado

Marcar matéria como concluída

Excluir matérias

Todas as ações são persistidas no PostgreSQL via Supabase

 Pomodoro

Timer personalizável

Contador automático de sessões

Minutos estudados registrados no banco

 Relatórios

Gráficos simples de uso

Streak de estudo

Total de sessões completadas

Dados carregados do banco de forma persistente
