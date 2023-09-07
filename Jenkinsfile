def app

pipeline {
    agent any
    environment {
        ENV_TYPE = "production"
        PORT = 3067
        NAMESPACE = "inctagram-space"
        REGISTRY_HOSTNAME = "inctagram"
        PROJECT = "inctagram-back"
        REGISTRY = "registry.hub.docker.com"
        DEPLOYMENT_NAME = "inctagram-back-deployment"
        IMAGE_NAME = "${env.BUILD_ID}_${env.ENV_TYPE}_${env.GIT_COMMIT}"
        DOCKER_BUILD_NAME = "${env.REGISTRY_HOSTNAME}/${env.PROJECT}:${env.IMAGE_NAME}"
        DATABASE_URL = "{env.DATABASE_URL}"
        SHADOW_DB_URL = "{env.SHADOW_DB_URL}"
        SECRET_ACCESS_TOKEN = "{env.SECRET_ACCESS_TOKEN}"
        SECRET_REFRESH_TOKEN = "{env.SECRET_REFRESH_TOKEN}"
        TIME_EXPIRING_ACCESS_TOKEN = "{env.TIME_EXPIRING_ACCESS_TOKEN}"
        TIME_EXPIRING_REFRESH_TOKEN = "{env.TIME_EXPIRING_REFRESH_TOKEN}"
        SMTP_USER = "{env.SMTP_USER}"
        SMTP_PASS = "{env.SMTP_PASS}"
        SMTP_HOST = "{env.SMTP_HOST}"
        SMTP_PORT = "{env.SMTP_PORT}"
        EMAIL1 = "{env.EMAIL1}"
        EMAIL2 = "{env.EMAIL2}"
        SALT_HASH = "{env.SALT_HASH}"
        GOOGLE_CLIENT_ID = "{env.GOOGLE_CLIENT_ID}"
        GOOGLE_CLIENT_SECRET = "{env.GOOGLE_CLIENT_SECRET}"
        GH_CLIENT_ID = "{env.GH_CLIENT_ID}"
        GH_CLIENT_SECRET = "{env.GH_CLIENT_SECRET}"
    }

    stages {
        stage('Clone repository') {
            steps {
                checkout scm
            }
        }
        stage('Unit tests') {
            steps {
                script {
                    sh "yarn install"
                    sh "yarn test"
                }
            }
        }
        stage('e2e tests') {
            steps {
                script {
                    sh "yarn test:e2e"
                }
            }
        }
        stage('Build docker image') {
            steps {
                echo "Build image started..."
                    script {
                        app = docker.build("${env.DOCKER_BUILD_NAME}")
                    }
                echo "Build image finished..."
            }
        }
        stage('Push docker image') {
             steps {
                 echo "Push image started..."
                     script {
                        docker.withRegistry("https://${env.REGISTRY}", 'inctagram-space') {
                            app.push("${env.IMAGE_NAME}")
                        }
                     }
                 echo "Push image finished..."
             }
       }
       stage('Delete image local') {
             steps {
                 script {
                    sh "docker rmi -f ${env.DOCKER_BUILD_NAME}"
                 }
             }
        }
       stage('DB Migration') {
              steps {
                  echo "Migration started..."
                     script {
                        sh 'ls -ltr'
                        sh 'pwd'
                        sh 'prisma migrate deploy'
                     }
                  echo "Migration finished..."
              }
       }
        stage('Preparing deployment') {
             steps {
                 echo "Preparing started..."
                     sh 'ls -ltr'
                     sh 'pwd'
                     sh "chmod +x preparingDeploy.sh"
                     sh "./preparingDeploy.sh ${env.REGISTRY_HOSTNAME} ${env.PROJECT} ${env.IMAGE_NAME} ${env.DEPLOYMENT_NAME} ${env.PORT} ${env.NAMESPACE}"
                     sh "cat deployment.yaml"
             }
        }
        stage('Deploy to Kubernetes') {
             steps {
                 withKubeConfig([credentialsId: 'prod-kubernetes']) {
                    sh 'kubectl apply -f deployment.yaml'
                    sh "kubectl rollout status deployment/${env.DEPLOYMENT_NAME} --namespace=${env.NAMESPACE}"
                    sh "kubectl get services -o wide"
                 }
             }
        }
    }
}
