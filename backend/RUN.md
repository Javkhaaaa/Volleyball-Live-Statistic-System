# Backend ажиллуулах заавар

## Maven Wrapper ашиглах (Зөвлөмж)

Maven суулгаагүй бол Maven Wrapper ашиглана:

```bash
cd backend

# Анх удаа ажиллуулахад wrapper-ийг суулгана
./mvnw clean install

# Application ажиллуулах
./mvnw spring-boot:run
```

## Maven суулгасан бол

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

## macOS дээр Maven суулгах (Homebrew)

```bash
brew install maven
```

Суулгасны дараа:
```bash
mvn --version
```

## Java шалгах

Maven ажиллахын тулд Java 17+ шаардлагатай:

```bash
java -version
```

Хэрэв Java суугаагүй бол:
```bash
# Homebrew ашиглан
brew install openjdk@17

# Эсвэл Oracle-оос татаж суулгах
```


