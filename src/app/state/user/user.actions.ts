import {IUser} from "../../models/users";

export class UserAction {
  static readonly type = '[User] Add item';
  constructor(readonly payload: string) { }
}

interface UserSearchByFirstnameAndLastnamePayload {
  term: string
  startTime: string
  endTime: string
  startDate: string
  endDate: string
}
export class UserSearchByFirstnameAndLastname {
  static readonly type = '[User] search';
  constructor(readonly payload: UserSearchByFirstnameAndLastnamePayload) { }
}

export class UserDeleteById {
  static readonly type = '[User] delete';
  constructor(readonly id: number) { }
}

export class UserUpdateById {
  static readonly type = '[User] update';
  constructor(readonly payload: IUser) { }
}

export class UserCreate {
  static readonly type = '[User] create';
  constructor(readonly payload: IUser) { }
}
