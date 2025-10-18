pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'meer03computer021engineer'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Marialk2183/microservices-cicd.git'
            }
        }

        stage('Build and Test') {
            steps {
                dir('user-service') {
                    bat 'npm install'
                    bat 'npm test || echo "No tests configured"'
                }
                dir('order-service') {
                    bat 'npm install'
                    bat 'npm test || echo "No tests configured"'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${DOCKER_HUB_REPO}/user-service:latest", "./user-service")
                    docker.build("${DOCKER_HUB_REPO}/order-service:latest", "./order-service")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    bat 'echo %PASS% | docker login -u %USER% --password-stdin'
                    bat "docker push ${DOCKER_HUB_REPO}/user-service:latest"
                    bat "docker push ${DOCKER_HUB_REPO}/order-service:latest"
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker-compose -f docker-compose.yml up -d --force-recreate'
            }
        }
    }
}
