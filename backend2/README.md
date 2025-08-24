# NewLevel - Sistema de Autenticação com DDD

Este projeto implementa um sistema completo de autenticação usando Domain Driven Design (DDD) com ASP.NET Core Identity, JWT tokens, renovação automática de tokens e recuperação de senha.

## 🏗️ Arquitetura

O projeto segue os princípios do Domain Driven Design com as seguintes camadas:

- **Domain**: Entidades, Value Objects e Interfaces
- **Application**: DTOs, Services e Contratos
- **Infrastructure**: Implementações concretas, Entity Framework, Identity
- **API**: Controllers e configurações da Web API

## 🚀 Funcionalidades

### ✅ Autenticação Completa
- **Login/Logout**: Sistema seguro de autenticação
- **Registro de usuários**: Criação de contas com validação
- **JWT Tokens**: Autenticação baseada em tokens
- **Refresh Tokens**: Renovação automática de tokens
- **Recuperação de senha**: Sistema de reset via email

### 🔐 Segurança
- Tokens JWT com expiração configurável
- Refresh tokens com rotação automática
- Validação de email e senha
- Middleware para detecção de tokens próximos ao vencimento

## 📋 Pré-requisitos

- .NET 8.0 SDK
- SQL Server ou LocalDB
- Visual Studio 2022 ou VS Code

## ⚙️ Configuração

### 1. Configurar Connection String
Edite `appsettings.json` para configurar sua conexão com o banco:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=NewLevelDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### 2. Configurar Email (Opcional)
Para funcionalidade de recuperação de senha, configure as credenciais SMTP:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "seu-email@gmail.com",
    "SmtpPassword": "sua-senha-de-app",
    "FromEmail": "seu-email@gmail.com",
    "FromName": "NewLevel Team"
  }
}
```

### 3. Configurar JWT
As configurações JWT já estão definidas, mas você pode personalizar:

```json
{
  "JwtSettings": {
    "Secret": "SuaChaveSecretaDeveSerMuitoSegura!",
    "AccessTokenExpirationMinutes": 15,
    "RefreshTokenExpirationDays": 7
  }
}
```

## 🚀 Como Executar

1. **Restaurar pacotes**:
```bash
dotnet restore
```

2. **Executar a aplicação**:
```bash
cd src/NewLevel.API
dotnet run
```

3. **Acessar Swagger**:
Abra `https://localhost:7000/swagger` para testar as APIs

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh-token` - Renovar token
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter dados do usuário atual

### Recuperação de Senha
- `POST /api/auth/forgot-password` - Solicitar reset de senha
- `POST /api/auth/reset-password` - Redefinir senha

## 🔄 Renovação Automática de Tokens

O sistema implementa renovação automática de tokens através de:

1. **Middleware de detecção**: Identifica tokens próximos ao vencimento
2. **Header de resposta**: `X-Token-Refresh-Required: true`
3. **Endpoint de refresh**: `/api/auth/refresh-token`

### Implementação no Frontend (Exemplo)

```javascript
// Interceptor para renovação automática
axios.interceptors.response.use(
  (response) => {
    if (response.headers['x-token-refresh-required']) {
      // Renovar token automaticamente
      refreshToken();
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirecionar para login
      logout();
    }
    return Promise.reject(error);
  }
);
```

## 🗂️ Estrutura do Projeto

```
NewLevel/
├── src/
│   ├── NewLevel.Domain/
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   └── Interfaces/
│   ├── NewLevel.Application/
│   │   ├── DTOs/
│   │   └── Services/
│   ├── NewLevel.Infrastructure/
│   │   ├── Data/
│   │   └── Services/
│   └── NewLevel.API/
│       ├── Controllers/
│       ├── Middleware/
│       └── Program.cs
└── NewLevel.sln
```

## 🛡️ Segurança

- Senhas são hasheadas usando Identity
- Tokens JWT assinados com chave secreta
- Refresh tokens únicos por usuário
- Validação de entrada em todos os endpoints
- CORS configurado para frontend específico

## 📝 Próximos Passos

1. Implementar roles e permissões
2. Adicionar logging estruturado
3. Implementar rate limiting
4. Adicionar testes unitários
5. Configurar CI/CD

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
