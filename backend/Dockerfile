# Dockerfile

FROM eclipse-temurin:21-jdk

# Set the working directory first
WORKDIR /app

# Copy the JAR file into the /app directory
# We name it app.jar inside the container
COPY target/confease-backend-0.0.1-SNAPSHOT.jar app.jar

# Create the directory for persistent papers
RUN mkdir -p /app/uploads/papers 

# Run the jar from the current WORKDIR (/app/app.jar)
ENTRYPOINT ["java", "-jar", "app.jar"]