import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Role } from 'src/app/model/role';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

export interface UserForm extends FormGroup<{
  id: FormControl<any>;
  nome: FormControl<string>;
  cognome: FormControl<string>;
  dataDiNascita: FormControl<any>;
  username: FormControl<string>;
  password: FormControl<any>;
  confermaPassword: FormControl<any>;
  ruolo: FormControl<Role>;
}> { }

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {

  constructor(private userService: UserService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('IT');
  }

  ruoli: Role[] = []

  userReactive: UserForm = this.fb.group({
    id: this.fb.control(null),
    nome: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
    cognome: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
    username: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    dataDiNascita: this.fb.nonNullable.control('', [Validators.required]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
    confermaPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
    ruolo: this.fb.nonNullable.control(this.ruoli.find(res => res.descrizione == "ROLE_CLASSIC_USER")!, [Validators.required]),
  });

  urlFlag: string = "";
  errorMessage: string = "";

  ngOnInit(): void {
    let operation = this.route.snapshot.queryParamMap.get('operation');
    let id: number = Number(this.route.snapshot.paramMap.get('id'));
    if (operation?.includes("readOnly")) {
      this.userReactive.disable();
      this.urlFlag = "readOnlyActivated";
    }
    if (operation?.includes("edit")) {
      this.urlFlag = "editActivated";
    }
    if (operation?.includes("add")) {
      this.urlFlag = "addActivated";
    }
    if (!operation?.includes("add")) {
      this.userReactive.get('id')?.setValue(id);
      this.userService.findById(id).subscribe(res => {
        this.userReactive.patchValue(res);
      });
    }

    this.authService.getAllRoles().subscribe(res => {
      this.ruoli = res;
    });
  }

  handleFormRequest(): void {
      if (this.urlFlag == "addActivated") {

        let date = this.userReactive.get('dataDiNascita')?.value.toISOString();
        let dateForm = date?.split('T')[0]!;
        this.userReactive.get('dataDiNascita')?.setValue(dateForm);

        this.userService.create(this.userReactive.getRawValue()).subscribe({
          next: userItem => this.userReactive.patchValue(userItem),
          complete: () => this.router.navigate([`list`], this.snackbarService.openSnackBar('Operazione effettuata correttamente.', ["blue"])!)
        });
      }

      if (this.urlFlag == "editActivated") {
        this.userReactive.get('password')?.disable();
        this.userReactive.get('confermaPassword')?.disable();
        console.log(this.userReactive.value);
        this.userService.update(this.userReactive.value).subscribe({
          next: userItem => this.userReactive.patchValue(userItem),
          complete: () => this.router.navigate([`list`], this.snackbarService.openSnackBar('Operazione effettuata correttamente.', ["blue"])!)
        });
      }
  }


}
