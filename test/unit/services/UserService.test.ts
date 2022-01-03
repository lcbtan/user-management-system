import { AppUser } from '../../../src/api/models/AppUser';
import { AppUserService } from '../../../src/api/services/AppUserService';
import { events } from '../../../src/api/subscribers/events';
import { EventDispatcherMock } from '../lib/EventDispatcherMock';
import { LogMock } from '../lib/LogMock';
import { RepositoryMock } from '../lib/RepositoryMock';

describe('UserService', () => {

    test('Find should return a list of users', async (done) => {
        const log = new LogMock();
        const repo = new RepositoryMock();
        const ed = new EventDispatcherMock();
        const user = new AppUser();
        user.id = '1';
        user.firstName = 'John';
        user.lastName = 'Doe';
        user.email = 'john.doe@test.com';
        repo.list = [user];
        const userService = new AppUserService(repo as any, ed as any, log);
        const list = await userService.find();
        expect(list[0].firstName).toBe(user.firstName);
        done();
    });

    test('Create should dispatch subscribers', async (done) => {
        const log = new LogMock();
        const repo = new RepositoryMock();
        const ed = new EventDispatcherMock();
        const user = new AppUser();
        user.id = '1';
        user.firstName = 'John';
        user.lastName = 'Doe';
        user.email = 'john.doe@test.com';
        const userService = new AppUserService(repo as any, ed as any, log);
        const newUser = await userService.create(user);
        expect(ed.dispatchMock).toBeCalledWith([events.user.created, newUser]);
        done();
    });

});
