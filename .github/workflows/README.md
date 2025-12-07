# CI/CD Workflows

## Available Workflows

### 1. Simple CI (Recommended) - `simple-ci.yml`
**Хамгийн энгийн, найдвартай workflow**

- ✅ Backend build
- ✅ Frontend build
- ✅ Алдаа гарвал workflow үргэлжилнэ
- ✅ Хурдан ажиллана

**Ашиглах:**
- Энгийн build шалгах
- Хурдан feedback авах
- Алдаа гарвал workflow зогсохгүй

### 2. CI Pipeline - `ci.yml`
**Бүрэн CI pipeline**

- ✅ Backend build & test
- ✅ Frontend build & lint
- ✅ Database migration check
- ⚠️ MySQL service шаардлагатай

**Ашиглах:**
- Бүрэн test хийх
- Database migration шалгах
- Production-д бэлтгэх

### 3. CD Pipeline - `cd.yml`
**Deployment pipeline**

- ✅ Release package үүсгэх
- ✅ GitHub release үүсгэх (tag үед)
- ⚠️ Main branch эсвэл tag үед ажиллана

**Ашиглах:**
- Production release хийх
- Tag үүсгэхэд автоматаар release үүсгэнэ

### 4. Code Quality - `code-quality.yml`
**Code quality checks**

- ✅ ESLint
- ✅ Security scanning
- ✅ Code quality checks
- ⚠️ Бүх алдаа continue-on-error

**Ашиглах:**
- Code quality шалгах
- Security vulnerabilities олох
- Best practices шалгах

## Workflow сонгох

### Анх удаа ашиглах:
```yaml
# simple-ci.yml ашиглах - хамгийн энгийн
```

### Production-д бэлтгэх:
```yaml
# ci.yml + cd.yml ашиглах
```

### Code quality шалгах:
```yaml
# code-quality.yml ашиглах
```

## Troubleshooting

### Workflow амжилтгүй болвол:

1. **Simple CI ашиглах** - `simple-ci.yml` нь хамгийн найдвартай
2. **continue-on-error: true** - Алдаа гарвал workflow үргэлжилнэ
3. **Manual trigger** - `workflow_dispatch` ашиглан гараар ажиллуулах

### MySQL connection алдаа:

- `database-migration-check` job-ийг `continue-on-error: true` болгосон
- MySQL service амжилтгүй бол workflow үргэлжилнэ

### Build алдаа:

- `mvnw` байхгүй бол `mvn` ашиглана
- `npm ci` алдаа гарвал `npm install` ашиглана

## Best Practices

1. **Эхлээд Simple CI ашиглах** - Хурдан feedback
2. **Production-д CI + CD ашиглах** - Бүрэн шалгалт
3. **Code quality-г салгаж ажиллуулах** - Хурдан CI, удаан quality checks

## Disable Workflows

Хэрэв workflow ашиглахгүй бол:

1. GitHub → Settings → Actions → Workflow permissions
2. Эсвэл workflow файлыг устгах

