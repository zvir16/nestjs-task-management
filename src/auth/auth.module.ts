import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import * as config from 'config';

const JwtConfig = config.get('jwt');

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || JwtConfig.secret,
      signOptions: {
        expiresIn: JwtConfig.expiresIn,
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ],
})
export class AuthModule {}
