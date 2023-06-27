import { Module } from '@nestjs/common';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from '../../providers/tokens/tokens.module';
import { PwnedModule } from '../../providers/pwned/pwned.module';
import { MailModule } from '../../providers/mail/mail.module';
import { GeolocationModule } from '../../providers/geolocation/geolocation.module';
import { ApprovedSubnetsModule } from '../approved-subnets/approved-subnets.module';
import { ApprovedSubnetsService } from '../approved-subnets/approved-subnets.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    TokensModule,
    PwnedModule,
    MailModule,
    GeolocationModule,
    ApprovedSubnetsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ApprovedSubnetsService],
})
export class AuthModule {}
