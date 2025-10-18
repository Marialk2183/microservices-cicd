pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-login')
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
                    bat 'docker logout'
                    bat "echo %DOCKERHUB_PSW% | docker login -u %DOCKERHUB_USER% --password-stdin"
                    bat 'docker info'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    bat "docker build -t ${env.DOCKERHUB_REPO}/user-service:latest ./user-service"
                    bat "docker build -t ${env.DOCKERHUB_REPO}/order-service:latest ./order-service"
                    bat "docker images"
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
                    // Windows-safe cleanup and redeployment
                    bat '''
                        docker ps -a -q -f name=user-service > tmp.txt
                        for /f %%i in (tmp.txt) do docker stop %%i && docker rm %%i
                        del tmp.txt
                        docker ps -a -q -f name=order-service > tmp.txt
                        for /f %%i in (tmp.txt) do docker stop %%i && docker rm %%i
                        del tmp.txt
                    '''
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
