# Etapa 1: Construcción del JAR con Maven
FROM maven:3.9.2-eclipse-temurin-17 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia todo el código fuente
COPY . .

# Ejecuta la construcción del proyecto (sin tests para que sea más rápido)
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final con JDK para ejecutar el JAR
FROM openjdk:21-oracle

# Establece el directorio de trabajo
WORKDIR /app

# Copia el JAR desde la etapa de construcción
COPY --from=builder /app/target/*.jar app.jar

# Expone el puerto en el que corre tu app
EXPOSE 8081

# Comando de ejecución
CMD ["java", "-jar", "app.jar"]
