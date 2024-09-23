# Usar uma imagem base do OpenJDK
FROM openjdk:21-jdk-slim

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o arquivo JAR gerado pela sua aplicação para o container
COPY target/projeto-0.0.1-SNAPSHOT.jar /app/apicielo.jar

# Expõe a porta que será usada pela aplicação
EXPOSE 8080

# Definir o comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "/app/apicielo.jar"]
