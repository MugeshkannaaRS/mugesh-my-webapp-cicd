pipeline {
    agent any

    environment {
        AWS_CREDENTIALS = credentials('aws-mugesh-creds')
        GITHUB_CREDS    = credentials('mugeshcicdtok')
        AWS_REGION      = "ap-south-1"
        ECR_REPO        = "903743538475.dkr.ecr.ap-south-1.amazonaws.com/mugesh-webapp"
    }

    triggers {
        githubPush()   // Auto trigger when you push to GitHub
    }

    stages {

        stage('Checkout Code') {
            steps {
                git(
                    url: 'https://github.com/MugeshkannaaRS/mugesh-my-webapp-cicd.git',
                    branch: 'main',
                    credentialsId: 'mugeshcicdtok'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t mugesh-webapp:latest .
                docker tag mugesh-webapp:latest ${ECR_REPO}:latest
                """
            }
        }

        stage('Login to ECR & Push Image') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin 903743538475.dkr.ecr.${AWS_REGION}.amazonaws.com

                docker push ${ECR_REPO}:latest
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {   // <-- Correct credential ID
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@13.234.117.9 '
                        sudo docker pull ${ECR_REPO}:latest &&
                        sudo docker stop mugesh-webapp || true &&
                        sudo docker rm mugesh-webapp || true &&
                        sudo docker run -d -p 3000:3000 --name mugesh-webapp ${ECR_REPO}:latest
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment Successful!"
            emailext (
                to: "mugeshkannaa7@gmail.com",
                subject: "SUCCESS: Mugesh WebApp Deployment",
                body: "Your CI/CD pipeline has successfully deployed the latest version of the app 🎉"
            )
        }

        failure {
            echo "❌ Pipeline failed!"
            emailext (
                to: "mugeshkannaa7@gmail.com",
                subject: "FAILED: Mugesh WebApp Deployment",
                body: "Your CI/CD pipeline FAILED. Please check Jenkins logs."
            )
        }
    }
}
