import {UserRepository} from "./user-repository.type";
import {generateHash} from "../utils/password-utils";
import UserModel from "./user-model";
import {Observable} from "rxjs";
import {User} from "./user.type";
import {RegisterUser$, UserExists$} from "./user$.type";

export const registerUser$: RegisterUser$ = (username: string, password: string) => {
    return new Observable((subscriber) => {
        new UserModel({
            username: username,
            hash: generateHash(password),
        }).save((error, user: User) => {
            if (error) {
                subscriber.error(error);
                subscriber.complete();
                return;
            }
            subscriber.next(user);
            subscriber.complete();
        });
    });
};


export const userExists$: UserExists$ = (username: string) => {
    return new Observable((subscriber) => {
        UserModel.findOne({username: username}, (error, user) => {
            if (error) {
                subscriber.error(error);
                subscriber.complete();
                return;
            }

            if (!user) {
                subscriber.next(false);
                subscriber.complete();
            }
            else {
                subscriber.next(true);
                subscriber.complete();
            }
        });
    });
};

export class MongooseUserRepository implements UserRepository {

    public userExists$(username: string): Observable<boolean> {
        return new Observable((subscriber) => {
            UserModel.findOne({username: username}, (error, user) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }

                if (!user) {
                    subscriber.next(false);
                    subscriber.complete();
                }
                else {
                    subscriber.next(true);
                    subscriber.complete();
                }
            });
        });
    }

    async registerUser(username: string, password: string): Promise<void> {
        const newUser = new UserModel({
            username: username,
            hash: generateHash(password),
        });
        await newUser.save();
    }

    async userExists(username: string): Promise<Boolean> {
        const user = await UserModel.findOne({username: username});
        if (!user)
            return false;
        else
            return true;
    }
}