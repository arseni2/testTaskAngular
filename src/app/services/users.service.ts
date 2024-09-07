import { Injectable } from '@angular/core';
import {IUser} from "../models/users";
import {usersMockData} from "../data/users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor() { }

  users: IUser[] = []

  getAll() {
    //имитация порлучения данных
    this.users = usersMockData
  }

  create() {
    //имитация создания
  }
  update() {
    //имитация обновления
  }
  delete(id: number) {
    this.users = this.users.filter((user) => user.id !== id)
  }

  searchByFirstnameAndLastname(term: string) {
    const lowerCaseTerm = term.toLowerCase();

    return this.users.filter(user =>
      user.firstName.toLowerCase().includes(lowerCaseTerm) ||
      user.lastName.toLowerCase().includes(lowerCaseTerm)
    );
  }
}
