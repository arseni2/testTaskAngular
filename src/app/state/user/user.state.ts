import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {UserCreate, UserDeleteById, UserSearchByFirstnameAndLastname, UserUpdateById} from './user.actions';
import {IUser} from "../../models/users";
import {usersMockData} from "../../data/users";
import {isAfter, isBefore, parse} from 'date-fns';


export interface UserStateModel {
  users: IUser[];
  filteredUsers: IUser[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    users: usersMockData,
    filteredUsers: []
  }
})
@Injectable()
export class UserState {

  @Selector()
  static getState(state: UserStateModel) {
    return state;
  }

  @Selector()
  static getUsers(state: UserStateModel) {
    return state.users
  }

  @Action(UserSearchByFirstnameAndLastname)
  search(ctx: StateContext<UserStateModel>, { payload }: UserSearchByFirstnameAndLastname) {
    const { term, startTime, endTime, endDate, startDate } = payload;
    const query = term.toLowerCase();
    const state = ctx.getState();
    let filteredUsers = state.users;

    const startHour = startTime ? parseInt(startTime.split(':')[0]) : null;
    const startMinute = startTime ? parseInt(startTime.split(':')[1]) : -1;
    const endHour = endTime ? parseInt(endTime.split(':')[0]) : null;
    const endMinute = endTime ? parseInt(endTime.split(':')[1]) : -1;

    // Фильтрация по времени
    if (startHour !== null || endHour !== null) {
      filteredUsers = filteredUsers.filter(user => {
        const [userHour, userMinute] = user.time.split(':').map(Number);

        const timeMatch =
          (startHour !== null ? (userHour > startHour || (userHour === startHour && userMinute >= startMinute)) : true) &&
          (endHour !== null ? (userHour < endHour || (userHour === endHour && userMinute <= endMinute)) : true);

        return timeMatch;
      });
    }

    let start: Date | null = null;
    let end: Date | null = null;

    if (startDate) {
      start = parse(startDate, 'dd.MM.yyyy', new Date());
      start.setHours(0, 0, 0, 0); // Убираем время
    }

    if (endDate) {
      end = parse(endDate, 'dd.MM.yyyy', new Date());
      end.setHours(0, 0, 0, 0); // Убираем время
    }

    filteredUsers = filteredUsers.filter(user => {
      const [day, month, year] = user.date.split('.').map(Number);
      const userDate = new Date(year, month - 1, day);
      userDate.setHours(0, 0, 0, 0); // Убираем время у userDate

      const isAfterStart = start ? userDate >= start : true;
      const isBeforeEnd = end ? userDate <= end : true;

      return isAfterStart && isBeforeEnd;
    });

    // Фильтрация по имени
    filteredUsers = filteredUsers.filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query)
    );

    ctx.setState({
      ...state,
      filteredUsers: filteredUsers
    });
  }


  @Action(UserDeleteById)
  delete(ctx: StateContext<UserStateModel>, { id }: UserDeleteById) {
    const state = ctx.getState();
    const filteredUsers = state.users.filter((user) => user.id !== id)
    ctx.setState({
      ...state,
      users: filteredUsers
    });
  }

  @Action(UserCreate)
  create(ctx: StateContext<UserStateModel>, {payload}: UserCreate) {
    const state = ctx.getState();
    state.users.push(payload)
    ctx.setState({
      ...state
    });
  }

  @Action(UserUpdateById)
  update(ctx: StateContext<UserStateModel>, {payload}: UserCreate) {
    const state = ctx.getState();
    const newUsers = state.users.map((user) => {
      if(user.id === payload.id) {
        user = payload
      }
      return user
    })
    ctx.setState({
      ...state,
      users: newUsers
    });
  }
}
