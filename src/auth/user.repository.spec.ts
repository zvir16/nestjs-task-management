import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import * as bcrypt from 'bcryptjs';

const mockAuthCredentialsDto = { username: 'Test user', password: 'test pass' };

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('SignUp', () => {
        let save;
        
        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        })

        it('succesfully signup to app', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockAuthCredentialsDto)).resolves.not.toThrow();
        })

        it('throw an exception on conflict username', () => {
            save.mockReturnValue({ code: '23505'});            
            expect(userRepository.signUp(mockAuthCredentialsDto)).resolves;
        })

        it('throw an exception on internal server error', () => {
            save.mockRejectedValue({ code: '121212'});
            expect(userRepository.signUp(mockAuthCredentialsDto)).resolves;
        })
    })

    describe('hashPassword', () => {
        it('call bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('some hash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('Test password', 'Test salt');
            expect(bcrypt.hash).toHaveBeenCalledWith('Test password', 'Test salt');
            expect(result).toEqual('some hash');
        });

    })
})