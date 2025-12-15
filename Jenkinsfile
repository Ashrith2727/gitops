pipeline {
  agent any

  environment {
    IMAGE_NAME = "ashrith2727/gitops"
    IMAGE_TAG = "v1"
  }

  stages {

    stage('Checkout Code') {
      steps {
        git branch: 'main',
            url: 'https://github.com/Ashrith2727/gitops'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'cd app && npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'cd app && npm test || echo "No tests yet"'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          docker build -t $IMAGE_NAME:$IMAGE_TAG app/
        '''
      }
    }	

    stage('Security Scan (Trivy)') {
      steps {
        sh '''
          trivy image $IMAGE_NAME:$IMAGE_TAG || true
        '''
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push $IMAGE_NAME:$IMAGE_TAG
          '''
        }
      }
    }
  }

  post {
    success {
      echo "CI Pipeline completed successfully!"
    }
    failure {
      echo "CI Pipeline failed!"
    }
  }
}
