import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgClass, NgForOf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TableRowComponent} from "./components/table-row/table-row.component";
import {TableHeadComponent} from "./components/table-head/table-head.component";
import {Store} from "@ngxs/store";
import {UserState} from "./state/user/user.state";
import {IUser} from "./models/users";
import {UserCreate, UserSearchByFirstnameAndLastname} from "./state/user/user.actions";
import {InputComponent} from "./components/shared/input/input.component";
import {combineLatest, debounceTime, map, merge, startWith, tap} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgForOf, ReactiveFormsModule, TableRowComponent, TableHeadComponent, InputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(
    private readonly store: Store
  ) {

    combineLatest([
      this.searchControl.valueChanges.pipe(debounceTime(300), startWith(this.searchControl.value || "")),
      this.startTimeControl.valueChanges.pipe(debounceTime(300), startWith(this.startTimeControl.value || "")),
      this.endTimeControl.valueChanges.pipe(debounceTime(300), startWith(this.endTimeControl.value || "")),
      this.startDateControl.valueChanges.pipe(debounceTime(300), startWith(this.startDateControl.value || "")),
      this.endDateControl.valueChanges.pipe(debounceTime(300), startWith(this.endDateControl.value || ""))
    ]).pipe(
      map(([searchValue, startTimeValue, endTimeValue, startDateValue, endDateValue]) => ({
        searchValue: searchValue || "",
        startTimeValue: startTimeValue || "",
        endTimeValue: endTimeValue || "",
        startDateValue: startDateValue || "",
        endDateValue: endDateValue || "",
      }))
    ).subscribe(({searchValue, startTimeValue, endTimeValue, startDateValue, endDateValue}) => {
      this.store.dispatch(new UserSearchByFirstnameAndLastname({
        term: searchValue,
        startTime: startTimeValue,
        endTime: endTimeValue,
        startDate: startDateValue,
        endDate: endDateValue,
      })).subscribe((data) => {
        if (searchValue || startTimeValue || endTimeValue || startDateValue || endDateValue) {
          //@ts-ignore
          this.users = data.user.filteredUsers;
        } else {
          //@ts-ignore
          this.users = data.user.users;
        }
      });
    });

  }

  searchControl = new FormControl('');
  startTimeControl = new FormControl('');
  endTimeControl = new FormControl('');
  startDateControl = new FormControl('');
  endDateControl = new FormControl('');

  users: IUser[] = []

  createForm = new FormGroup({
    fullName: new FormControl('', {validators: [Validators.required]}),
    time: new FormControl('', {validators: [Validators.required]}),
    date: new FormControl('', {validators: [Validators.required]}),
    message: new FormControl('', {validators: [Validators.required]})
  })

  createUser() {
    if(this.createForm.valid) {
      const user:IUser = {
        id: this.users[this.users.length-1].id + 1,
        message: this.createForm.getRawValue().message!,
        time: this.createForm.getRawValue().time!,
        date: this.createForm.getRawValue().date!,
        lastName: this.createForm.getRawValue().fullName!.split(" ")[0],
        firstName: this.createForm.getRawValue().fullName!.split(" ")[1],
      }
      this.store.dispatch(new UserCreate(user)).subscribe((data) => {
        this.createForm.reset()
      })
    }
  }

  ngOnInit() {
    this.store.select(UserState.getUsers).subscribe((data) => {
      this.users = data
    })
  }
}
