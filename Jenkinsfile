pipeline {
    agent any

    environment {
        AWS_CREDENTIALS = credentials('aws-mugesh-creds')        // FIXED
        GITHUB_CREDS     = credentials('mugeshcicdtok')           // FIXED
        AWS_REGION       = "ap-south-1"
        ECR_REPO         = "903743538475.dkr.ecr.ap-south-1.amazonaws.com/mugesh-webapp"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git(
                    url: 'https://github.com/MugeshkannaaRS/mugesh-my-webapp-cicd.git',
                    credentialsId: 'mugeshcicdtok',
                    branch: 'main'
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
                sh """
                ssh -o StrictHostKeyChecking=no ubuntu@13.234.117.9 "
                'docker pull ${ECR_REPO}:latest && docker stop app || true && docker rm app || true && docker run -d -p 3000:3000 --name app ${ECR_REPO}:latest'
                """
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed!"
        }
        success {
            echo "🚀 Deployment Successful!"
        }
    }
}
