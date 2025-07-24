FROM openjdk:17-slim

WORKDIR /demo

COPY target/*.jar demo.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "demo.jar"]
