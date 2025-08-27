# New Level - Frontend Refatorado

## 🎸 Sobre o Projeto

Este é o frontend refatorado da plataforma **New Level**, uma aplicação web focada na comunidade de música metal. O projeto foi completamente reestruturado com foco em **responsividade perfeita** e **melhor organização de código**, mantendo a identidade visual original.

## ✨ Principais Melhorias

### 🎨 Design e UX
- **Responsividade 100%**: Funciona perfeitamente em desktop, tablet e mobile
- **Material-UI (MUI)**: Interface moderna e consistente
- **Tema customizado**: Mantém a identidade visual metal com cores vermelhas e pretas
- **Animações suaves**: Transições e efeitos visuais aprimorados
- **Loading states**: Skeletons e indicadores de carregamento

### 🏗️ Arquitetura
- **Estrutura organizada**: Separação clara de responsabilidades
- **Componentes reutilizáveis**: Código mais limpo e manutenível
- **TypeScript**: Tipagem forte para melhor desenvolvimento
- **Context API**: Gerenciamento de estado eficiente
- **Error Boundaries**: Tratamento robusto de erros

### 📱 Responsividade
- **Mobile-first**: Design otimizado para dispositivos móveis
- **Breakpoints MUI**: xs, sm, md, lg, xl
- **FABs móveis**: Botões flutuantes para ações rápidas
- **Drawer navigation**: Menu lateral responsivo
- **Grid flexível**: Layout adaptativo para todos os tamanhos

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes
- **React Router DOM** - Roteamento
- **Axios** - Requisições HTTP
- **JWT Decode** - Autenticação
- **SweetAlert2** - Alertas elegantes
- **Toastr** - Notificações

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── common/          # Componentes comuns (Loading, ErrorBoundary)
│   └── layout/          # Componentes de layout (Navbar)
├── config/              # Configurações (API)
├── contexts/            # Contextos React (Auth)
├── routes/              # Configuração de rotas
├── styles/              # Estilos globais
├── theme/               # Tema MUI customizado
├── views/               # Páginas da aplicação
│   ├── auth/           # Autenticação (Login, Register, etc.)
│   ├── photos/         # Galeria de fotos
│   ├── videos/         # Biblioteca de vídeos
│   ├── presentation/   # Página de apresentação
│   └── error/          # Páginas de erro
├── assets/             # Imagens e recursos
└── gen/                # API gerada automaticamente
```

## 🎯 Funcionalidades

### 🔐 Autenticação
- Login responsivo com validação
- Registro de usuários e bandas
- Recuperação de senha
- JWT com refresh automático

### 📸 Galeria de Fotos
- Grid responsivo com lazy loading
- Busca por título
- Paginação inteligente
- Estados de loading e vazio
- Upload de novas fotos

### 🎬 Biblioteca de Vídeos
- Cards de vídeo com thumbnails
- Player integrado
- Filtros e busca
- Paginação otimizada
- Upload de novos vídeos

### 🎵 Recursos Adicionais
- Podcasts
- Perfis de usuário
- Loja parceira
- Sistema de notificações
- Painel administrativo

## 📱 Breakpoints Responsivos

```typescript
xs: 0px      // Mobile pequeno
sm: 600px    // Mobile grande
md: 900px    // Tablet
lg: 1200px   // Desktop
xl: 1536px   // Desktop grande
```

## 🎨 Paleta de Cores

```typescript
Primary: #d32f2f (Vermelho principal)
Secondary: #ff6b6b (Vermelho claro)
Dark: #b71c1c (Vermelho escuro)
Background: #F3F3F3 (Cinza claro)
Paper: #3c140c (Marrom escuro para modais)
```

## 🚀 Como Executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
# .env
REACT_APP_API_URL_LOCAL=http://localhost:5011
REACT_APP_API_URL_PROD=https://sua-api-producao.com
REACT_APP_FRONT_URL_LOCAL=http://localhost:3000
REACT_APP_FRONT_URL_PROD=https://seu-frontend-producao.com
```

3. **Executar em desenvolvimento:**
```bash
npm start
```

4. **Build para produção:**
```bash
npm run build
```

## 📋 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Gera build de produção
- `npm test` - Executa os testes
- `npm run generate-api` - Gera cliente da API

## 🔧 Configurações Importantes

### Tema MUI
O tema está configurado em `src/theme/theme.ts` com:
- Cores personalizadas
- Tipografia responsiva
- Componentes customizados
- Breakpoints otimizados

### Estilos Globais
Estilos globais em `src/styles/globalStyles.ts`:
- Reset CSS
- Classes utilitárias
- Animações
- Scrollbar customizada

### Contexto de Autenticação
Gerenciamento de autenticação em `src/contexts/AuthContext.tsx`:
- JWT handling
- Roles (Admin, Band, User)
- Estado global de autenticação

## 🎯 Melhorias Implementadas

### Performance
- ✅ Lazy loading de imagens
- ✅ Paginação otimizada
- ✅ Componentes memoizados
- ✅ Bundle splitting

### UX/UI
- ✅ Loading skeletons
- ✅ Estados vazios informativos
- ✅ Feedback visual consistente
- ✅ Navegação intuitiva

### Responsividade
- ✅ Mobile-first design
- ✅ Touch-friendly interfaces
- ✅ Adaptive layouts
- ✅ Optimized typography

### Acessibilidade
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast
- ✅ Screen reader support

## 🐛 Tratamento de Erros

- **Error Boundaries**: Captura erros React
- **API Error Handling**: Tratamento de erros de rede
- **Form Validation**: Validação robusta de formulários
- **Fallback UIs**: Interfaces de fallback elegantes

## 📈 Próximos Passos

- [ ] Implementar PWA
- [ ] Adicionar testes unitários
- [ ] Otimizar SEO
- [ ] Implementar analytics
- [ ] Adicionar modo escuro

## 🤝 Contribuição

Este projeto segue as melhores práticas de desenvolvimento React e está pronto para contribuições. Mantenha a consistência do código e a responsividade em todas as implementações.

## 📄 Licença

Este projeto é propriedade da New Level e está protegido por direitos autorais.

---

**Desenvolvido com ❤️ para a comunidade metal** 🤘
