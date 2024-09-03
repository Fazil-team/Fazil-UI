const env = 'prod'
const SERVER_IP = '/api'
const DEVELOP_IP = '127.0.0.1:8080'
export const baseURL = env === 'dev'?`http://${DEVELOP_IP}`:SERVER_IP
export const wsURL = env === 'dev'?`ws://${DEVELOP_IP}`:SERVER_IP;