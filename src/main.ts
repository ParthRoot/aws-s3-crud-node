import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * @warning To load please set {APP_ENV_FILE_PATH=/path/to/file.env} on your machine
 * @returns string
 */
export const envFile = () => `.env`;

/**
 * It will load the .env file and set the environment variables
 */
export const loadEnv = () => {
  const envFilePath = envFile();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: envFilePath, override: true });
};

async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  console.log(`Running on PORT: ${port}`);
  await app.listen(port);
}
bootstrap();
