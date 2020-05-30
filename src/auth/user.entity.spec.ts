import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('UserEntity', () => {
    describe('validatePassword', () => {
        let user;

        beforeEach(() => {
            user = new User();
            user.password = 'testPassword';
            user.salt = 'testSalt';
            bcrypt.hash = jest.fn();
        });

        it('return true if password valid', async () => {
            bcrypt.hash.mockReturnValue('testPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('112211');
            expect(bcrypt.hash).toHaveBeenCalledWith('112211', 'testSalt');
            expect(result).toBeTruthy();

        });

        it('return false if password invalid', async () => {
            bcrypt.hash.mockReturnValue('wrong password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrong password');
            expect(bcrypt.hash).toHaveBeenCalledWith('wrong password', 'testSalt');
            expect(result).toBeFalsy();
        });
    })
});