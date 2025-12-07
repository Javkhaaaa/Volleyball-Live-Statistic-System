# Volleyball Live Statistic System

A comprehensive volleyball league management system with live statistics tracking, user management, and role-based access control.

## 🏐 Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **Role-Based Access Control**: Admin, Coach, and Statistician roles
- **User Management**: Admin can create and manage Coach and Statistician users
- **Audit Logging**: Complete audit trail for all user actions
- **Security**: BCrypt password hashing, account lockout, and secure token management
- **RESTful API**: Clean REST API architecture
- **Modern Frontend**: React + Vite with responsive UI

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2.0 (Java 17)
- **Frontend**: React 18 + Vite
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security with BCrypt

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.8+ (or use Maven Wrapper)
- Node.js 18+ and npm
- MySQL 8.0+
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Volleyball Live Statistic System"
```

### 2. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE volleyball_league CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run schema
mysql -u root -p volleyball_league < database/schema.sql

# Insert initial data
mysql -u root -p volleyball_league < database/insert_initial_data.sql
```

### 3. Backend Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/volleyball_league
    username: root
    password: your_password
```

### 4. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 6. Login

- **URL**: http://localhost:5173
- **Email**: `admin@volleyball.league`
- **Password**: `Admin@123`

## 📁 Project Structure

```
.
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/volleyball/
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── service/       # Business logic
│   │   │   │   ├── repository/    # Data access
│   │   │   │   ├── entity/        # JPA entities
│   │   │   │   ├── dto/           # Data transfer objects
│   │   │   │   ├── security/      # Security configuration
│   │   │   │   └── util/          # Utilities
│   │   │   └── resources/
│   │   │       └── application.yml
│   └── pom.xml
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   └── utils/         # Utilities
│   └── package.json
├── database/              # Database scripts
│   ├── schema.sql
│   └── insert_initial_data.sql
├── docs/                  # Documentation
└── .github/
    └── workflows/         # CI/CD pipelines
```

## 🔐 Roles & Permissions

### Admin
- Create Coach and Statistician users
- View all users
- Delete users
- Full system access

### Coach
- View assigned teams/matches
- Manage team statistics
- Limited access

### Statistician
- Record live statistics
- View match data
- Limited access

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for CI/CD. See [CI/CD Documentation](docs/CI_CD.md) for details.

### Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on push/PR to `main` or `develop`
   - Builds and tests backend
   - Lints and builds frontend
   - Validates database migrations

2. **CD Pipeline** (`.github/workflows/cd.yml`)
   - Runs on push to `main` or tags
   - Creates release packages
   - Builds Docker images (optional)

3. **Code Quality** (`.github/workflows/code-quality.yml`)
   - Runs code quality checks
   - Security scanning with Trivy
   - ESLint for frontend

4. **Nightly Build** (`.github/workflows/nightly-build.yml`)
   - Daily builds at 2 AM UTC
   - Full system integration tests

### Viewing CI/CD Status

- Go to GitHub → Actions tab
- View workflow runs and logs
- Download build artifacts

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm run lint
npm run build
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/me` - Get current user info

### Admin Endpoints (Requires ADMIN role)

- `POST /api/admin/create-user` - Create new user
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get user by ID
- `DELETE /api/admin/users/{id}` - Delete user

## 🛠️ Development

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Database Migrations

Migration scripts are in `database/` directory:
- `schema.sql` - Initial schema
- `migration_to_single_role.sql` - Role migration
- `fix_admin_role.sql` - Admin role fix

## 📖 Documentation

- [Architecture](docs/ARCHITECTURE.md) - System architecture
- [Setup Instructions](docs/SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [Quick Start](docs/QUICK_START.md) - Quick start guide
- [CI/CD](docs/CI_CD.md) - CI/CD pipeline documentation
- [User Guide](USER_GUIDE.md) - User manual (Mongolian)
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🔒 Security Features

- BCrypt password hashing
- JWT token-based authentication
- Account lockout after failed attempts
- Role-based access control
- Audit logging
- CORS configuration
- SQL injection prevention (JPA)

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in `application.yml`
- Check port 8080 is available

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration
- Verify proxy settings in `vite.config.js`

### Database connection errors
- Ensure MySQL service is running
- Verify database exists
- Check credentials in `application.yml`

See [Troubleshooting Guide](docs/TROUBLESHOOTING.md) for more.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Template

Use the provided PR template (`.github/pull_request_template.md`)

## 📝 License

[Add your license here]

## 👥 Authors

[Add authors here]

## 🙏 Acknowledgments

- Spring Boot team
- React team
- All contributors

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- Review [User Guide](USER_GUIDE.md)

---

**Status**: 🟢 Active Development

**Last Updated**: 2024
