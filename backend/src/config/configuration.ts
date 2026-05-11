export interface AppConfig {
  port: number
  frontendUrl: string
  mongodbUri: string
  jwt: {
    secret: string
    expiresIn: string
  }
  admin: {
    username: string
    password: string
  }
}

export default (): AppConfig => ({
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:5173',
  mongodbUri: process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017/devtools',
  jwt: {
    secret: process.env['JWT_SECRET'] ?? 'change-me',
    expiresIn: process.env['JWT_EXPIRES_IN'] ?? '1h',
  },
  admin: {
    username: process.env['ADMIN_USERNAME'] ?? 'admin',
    password: process.env['ADMIN_PASSWORD'] ?? 'admin123',
  },
})
