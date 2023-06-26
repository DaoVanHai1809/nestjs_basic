import { Module } from '@nestjs/common';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from '../../providers/tokens/tokens.module';
import { PwnedModule } from '../../providers/pwned/pwned.module';
import { MailModule } from '../../providers/mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    TokensModule,
    PwnedModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
