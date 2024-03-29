import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from '../auth.service';

export interface LoginForm extends FormGroup<{
  username: FormControl<string>;
  password: FormControl<string>;
}>{}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  user?: User;
  destroy$: Subject<boolean> = new Subject();
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) { }

  userReactive: LoginForm = this.fb.group({
    username: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
  });

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
  }

  onClick(): void {
      this.authService.login(this.userReactive.getRawValue()).pipe(
        takeUntil(this.destroy$)
        ).subscribe(res => {
          this.authService.setUserLogged(res);
          this.router.navigateByUrl("list");
      });
    }

}
