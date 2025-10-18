pipeline {
    agent any

    environment {
        // Jenkins credentials ID for Docker Hub (set this in Jenkins Credentials)
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-login')
        // Your Docker Hub username (repository prefix)
        DOCKERHUB_REPO = 'meer03computer021engineer'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Marialk2183/microservices-cicd.git'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-login', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PSW')]) {
                    // Safe Docker login for Windows
                    bat 'docker logout'
                    bat "echo %DOCKERHUB_PSW% | docker login -u %DOCKERHUB_USER% --password-stdin"
                    bat 'docker info'  // Verify login success
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    bat "docker build -t ${env.DOCKERHUB_REPO}/user-service:latest ./user-service"
                    bat "docker build -t ${env.DOCKERHUB_REPO}/order-service:latest ./order-service"
                    bat "docker images"  // Debug: confirm images built
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat "docker push ${env.DOCKERHUB_REPO}/user-service:latest"
                bat "docker push ${env.DOCKERHUB_REPO}/order-service:latest"
            }
        }

        stage('Deploy Containers') {
            steps {
                script {
                    // Stop & remove any existing containers
                    bat 'docker stop user-service || echo "No running user-service container"'
                    bat 'docker rm user-service || echo "No existing user-service container"'
                    bat 'docker stop order-service || echo "No running order-service container"'
                    bat 'docker rm order-service || echo "No existing order-service container"'

                    // Deploy new containers
                    bat "docker run -d -p 3000:3000 --name user-service ${env.DOCKERHUB_REPO}/user-service:latest"
                    bat "docker run -d -p 4000:4000 --name order-service ${env.DOCKERHUB_REPO}/order-service:latest"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}
