pipeline {
  agent any

  environment {
    IMAGE_NAME = "ashrith2727/gitops"
    IMAGE_TAG = "v2"
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
          credentialsId: 'dockerhub-gitops',
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

    stage('Update GitOps Repo') {
      steps {
         withCredentials([usernamePassword(
      credentialsId: 'github-creds',
      usernameVariable: 'GIT_USER',
      passwordVariable: 'GIT_PASS'
      )]) {
        sh '''
         rm -rf gitops-prod
         git clone https://${GIT_USER}:${GIT_PASS}@github.com/Ashrith2727/gitops-prod.git
         cd gitops-prod/environments/dev
         sed -i "s|image:.*|image: ashrith2727/gitops:v1|" deployment.yaml
         git config user.email "jenkins@ci.local"
         git config user.name "jenkins"
         git add .
         git commit -m "Update image to v1"
         git push origin main
         
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
