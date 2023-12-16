export default () => ({
  app: {
    port: process.env.APP_PORT,
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    synchronize: true,
    autoLoadEntities: true,
  },
});
