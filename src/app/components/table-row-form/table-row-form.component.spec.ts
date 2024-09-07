import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowFormComponent } from './table-row-form.component';

describe('TableRowFormComponent', () => {
  let component: TableRowFormComponent;
  let fixture: ComponentFixture<TableRowFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRowFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableRowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
