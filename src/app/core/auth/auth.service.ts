import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServer = 'http://localhost:8080/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient) { }
  

  private userLoggedSubject$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  login(loginForm: User): Observable<User> {
    return this.http.post<{'jwt-token': string}>(this.apiServer + "/auth/login", loginForm, this.httpOptions).pipe(
      switchMap(res => of({ username: loginForm.username, token: res['jwt-token'] }))
    );
    // return this.http.post<User>("login", JSON .stringify(loginForm));
  }

  setUserLogged(user: User | null) {
    this.userLoggedSubject$.next(user);
    this.getUserRole().subscribe({
      next: res => user!.ruolo = res.role,
      complete: () => this.userLoggedSubject$.next(user)
    });
  }

  getUserLogged(): Observable<User | null> {
    return this.userLoggedSubject$.asObservable();
  }

  getUserRole(): Observable<{role: Role}> {
    return this.http.get<{role: Role}>(this.apiServer + "/utente/userInfo");
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiServer + "/ruolo");
  }

  isLoggedIn(): boolean {
    return this.userLoggedSubject$.value ? !!this.userLoggedSubject$.value.token : false;
  }

  getUserToken(): string | null | undefined  {
    return this.userLoggedSubject$.value ? this.userLoggedSubject$.value.token : null;
  }

  logout() {    
    this.setUserLogged(null);
  }

}
