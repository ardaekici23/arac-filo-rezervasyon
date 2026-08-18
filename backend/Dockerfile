# ---- Build stage: reactor build (bootstrap + tüm bağımlı modüller) ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
COPY domain/pom.xml domain/pom.xml
COPY application/pom.xml application/pom.xml
COPY infrastructure/pom.xml infrastructure/pom.xml
COPY api/pom.xml api/pom.xml
COPY bootstrap/pom.xml bootstrap/pom.xml
RUN mvn -B -pl bootstrap -am dependency:go-offline

COPY domain domain
COPY application application
COPY infrastructure infrastructure
COPY api api
COPY bootstrap bootstrap
RUN mvn -B -pl bootstrap -am package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/bootstrap/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
