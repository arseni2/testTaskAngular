import {Component, Input} from '@angular/core';
import {InputComponent} from "../shared/input/input.component";
import {IUser} from "../../models/users";

@Component({
  selector: 'app-table-row-form',
  standalone: true,
  imports: [
    InputComponent
  ],
  templateUrl: './table-row-form.component.html',
  styleUrl: './table-row-form.component.css'
})
export class TableRowFormComponent {

  constructor() {
  }
  @Input()
  user: IUser


}
