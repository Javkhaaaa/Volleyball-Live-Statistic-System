# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). The CI/CD pipeline ensures code quality, runs tests, and automates the build and deployment process.

## Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Backend CI**: Compiles, tests, and builds the Spring Boot backend
- **Frontend CI**: Lints, builds the React frontend
- **Database Migration Check**: Validates database schema and migrations

**What it does:**
- Runs Maven build and tests for backend
- Runs ESLint and builds frontend
- Validates database migrations
- Uploads build artifacts

### 2. CD Pipeline (`.github/workflows/cd.yml`)

**Triggers:**
- Push to `main` branch
- Tags starting with `v*` (e.g., `v1.0.0`)

**Jobs:**
- **Build and Deploy**: Creates release packages
- **Docker Build**: Builds Docker images (optional)

**What it does:**
- Builds both backend and frontend
- Creates release package (tar.gz)
- Uploads release artifacts
- Creates GitHub release for tags

### 3. Code Quality (`.github/workflows/code-quality.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests

**Jobs:**
- **Backend Code Quality**: Runs checkstyle, spotbugs
- **Frontend Code Quality**: Runs ESLint, checks for console.log
- **Security Scan**: Runs Trivy vulnerability scanner

### 4. Nightly Build (`.github/workflows/nightly-build.yml`)

**Triggers:**
- Daily at 2 AM UTC
- Manual trigger via workflow_dispatch

**What it does:**
- Full system build
- Integration tests
- Generates build report

## Local Testing

### Test CI Pipeline Locally

You can test CI workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run CI workflow
act -W .github/workflows/ci.yml

# Run specific job
act -j backend-ci
```

### Manual Testing

```bash
# Backend
cd backend
./mvnw clean test
./mvnw package

# Frontend
cd frontend
npm ci
npm run lint
npm run build
```

## Secrets Configuration

For deployment, you may need to configure GitHub Secrets:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add the following secrets (if needed):
   - `DOCKER_USERNAME`: Docker Hub username
   - `DOCKER_PASSWORD`: Docker Hub password
   - `DEPLOY_KEY`: SSH key for server deployment
   - `SERVER_HOST`: Deployment server host
   - `SERVER_USER`: Deployment server user

## Branch Strategy

- **main**: Production-ready code, triggers CD pipeline
- **develop**: Development branch, triggers CI pipeline
- **feature/***: Feature branches, CI runs on PR

## Release Process

1. Create a tag:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. CD pipeline automatically:
   - Builds the application
   - Creates release package
   - Creates GitHub release with artifacts

## Monitoring

- View workflow runs: GitHub → Actions tab
- View build logs: Click on a workflow run
- Download artifacts: Available for 7-30 days depending on workflow

## Troubleshooting

### CI Fails

1. Check workflow logs in GitHub Actions
2. Run tests locally:
   ```bash
   cd backend && ./mvnw test
   cd ../frontend && npm run lint
   ```
3. Check database connection in CI (MySQL service)

### Build Artifacts Not Found

- Artifacts are retained for 7-30 days
- Download from workflow run page
- Check artifact upload step in logs

### MySQL Connection Issues in CI

- MySQL service takes time to start
- Wait step is included in workflows
- Check health check configuration

## Best Practices

1. **Always run tests locally before pushing**
2. **Keep workflows fast** - Use caching
3. **Fail fast** - Run quick checks first
4. **Use matrix builds** for multiple versions (if needed)
5. **Keep secrets secure** - Never commit secrets

## Customization

### Add More Tests

Edit `.github/workflows/ci.yml`:
```yaml
- name: Run Integration Tests
  run: ./mvnw integration-test
```

### Add Deployment Steps

Edit `.github/workflows/cd.yml`:
```yaml
- name: Deploy to Server
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.DEPLOY_KEY }}
    script: |
      # Deployment commands
```

### Add Notifications

Add notification steps:
```yaml
- name: Notify on Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Build succeeded!'
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Spring Boot CI/CD Best Practices](https://spring.io/guides/gs/spring-boot-for-azure/)

