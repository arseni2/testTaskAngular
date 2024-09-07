import {Component, Input, OnInit, signal} from '@angular/core';
import {IUser} from "../../models/users";
import {Store} from "@ngxs/store";
import {UserDeleteById, UserUpdateById} from "../../state/user/user.actions";
import {TableRowFormComponent} from "../table-row-form/table-row-form.component";
import {InputComponent} from "../shared/input/input.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: '[app-table-row]',
  standalone: true,
  imports: [
    TableRowFormComponent,
    InputComponent,
    ReactiveFormsModule,

  ],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent implements OnInit {
  constructor(
    private readonly store: Store
  ) {
  }
  @Input()
  user: IUser

  @Input()
  i: number

  updateForm = new FormGroup({
    fullName: new FormControl('', {validators: [Validators.required]}),
    time: new FormControl('', {validators: [Validators.required]}),
    date: new FormControl('', {validators: [Validators.required]}),
    message: new FormControl('', {validators: [Validators.required]})
  })


  expandedIndex = signal(-1);
  isEditMode = signal(false)

  deleteUserById(id: number) {
    this.store.dispatch(new UserDeleteById(id))
  }

  changeEditMode() {
    this.isEditMode.update(value => !value)
  }

  update() {
    if(this.updateForm.valid) {
      const user:IUser = {
        id: this.user.id,
        message: this.updateForm.getRawValue().message!,
        time: this.updateForm.getRawValue().time!,
        date: this.updateForm.getRawValue().date!,
        lastName: this.updateForm.getRawValue().fullName!.split(" ")[0],
        firstName: this.updateForm.getRawValue().fullName!.split(" ")[1],
      }
      this.store.dispatch(new UserUpdateById(user))
    }
  }

  ngOnInit() {
    if (this.user) {
      this.updateForm.setValue({
        fullName: this.user.firstName + ' ' + this.user.lastName,
        time: this.user.time,
        date: this.user.date,
        message: this.user.message
      })
    }
  }
}
