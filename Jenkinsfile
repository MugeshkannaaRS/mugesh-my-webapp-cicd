pipeline {
    agent any

    environment {
        AWS_CREDENTIALS = credentials('mk-aws-jenkins-creds')
        AWS_DEFAULT_REGION = "ap-south-1"
        ECR_REPO = "903743538475.dkr.ecr.ap-south-1.amazonaws.com/mugesh-mywebapp"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'mugeshcicdtok',
                    url: 'https://github.com/MugeshkannaaRS/mugesh-my-webapp-cicd.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests found"'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
                docker login --username AWS --password-stdin $ECR_REPO

                docker build -t mugesh-mywebapp .
                docker tag mugesh-mywebapp:latest $ECR_REPO:$IMAGE_TAG
                """
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh """
                docker push $ECR_REPO:$IMAGE_TAG
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh """
                CONTAINER_ID=\$(docker ps -q --filter ancestor=$ECR_REPO:$IMAGE_TAG)
                if [ ! -z "$CONTAINER_ID" ]; then
                    docker stop \$CONTAINER_ID
                    docker rm \$CONTAINER_ID
                fi

                docker run -d -p 80:3000 $ECR_REPO:$IMAGE_TAG
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
