import { JwtStrategy } from "./jwt-strategy"
import { UserRepository } from './user.repository';
import { Test } from "@nestjs/testing";
import { User } from "./user.entity";
import { UnauthorizedException, BadRequestException } from "@nestjs/common";

const mockUserRepository = () =>({
    findOne: jest.fn()
});

describe('JWTStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UserRepository, useFactory: mockUserRepository}
            ]
        }).compile();

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
        userRepository = await module.get<UserRepository>(UserRepository);
    })

    describe('validate', () => {
        it('validate user and returns JWT payload', async () => {
            const user = new User();
            user.username = 'testUser';

            userRepository.findOne.mockResolvedValue(user);
            const result = await jwtStrategy.validate({ username: 'testUser'})
            expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'testUser'})
        });

        it('throw an unauthorization exception as user cannt be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({ username: 'TestUser'})).rejects.toThrow(UnauthorizedException);
        });
    })
})