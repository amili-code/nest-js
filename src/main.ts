import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import passport from 'passport';
import session from 'express-session';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized:false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
