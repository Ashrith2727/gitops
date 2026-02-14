pipeline {
  agent any

  environment {
    IMAGE_NAME = "ashrith2727/gitops"
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {

    stage('Checkout Code') {
      steps {
        git branch: 'main',
            url: 'https://github.com/brahmanyasudulagunta/gitops'
      }
    }

    stage('Build & Scan & Push') {
      steps {
        sh '''
          docker build -t $IMAGE_NAME:$IMAGE_TAG app/
        '''
      
        sh '''
          trivy image --severity CRITICAL,HIGH --exit-code 1 $IMAGE_NAME:$IMAGE_TAG
        '''
      
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

    stage('Update GitOps Repo') {
      steps {
         withCredentials([usernamePassword(
      credentialsId: 'github',
      usernameVariable: 'GIT_USER',
      passwordVariable: 'GIT_PASS'
      )]) {
        sh '''
         set -e

         rm -rf gitops-prod
         git clone https://${GIT_USER}:${GIT_PASS}@github.com/brahmanyasudulagunta/gitops-prod.git
         cd gitops-prod/environments/dev
 
         sed -i "s|image:.*|image: ashrith2727/gitops:${BUILD_NUMBER}|" canary.yaml
         git config user.email "jenkins@ci.local"
         git config user.name "jenkins"
         if git diff --quiet; then
           echo "No changes to commit"
         else
           git add .
           git commit -m "Update image to ${BUILD_NUMBER}"
           git push origin main
         fi
        '''
         }
      }
    }
    
    stage('Cleanup') {
      steps {
        sh "docker rmi $IMAGE_NAME:$IMAGE_TAG || true"
          }
      }
  }

  post {
    success {echo "CI Pipeline completed successfully!"}
    failure {echo "CI Pipeline failed!"}
  }
}
