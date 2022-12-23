import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiServer = 'http://localhost:8080/api/utente';
    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      constructor(private http: HttpClient) {}


    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiServer);
    }

      findById(id: number): Observable<User> {
        return this.http.get<User>(this.apiServer + "/" + id);
      }

      delete(id: number): Observable<boolean> {
       return this.http.delete<boolean>(this.apiServer + "/" + id);
      }

      create(userInput: User): Observable<User> {
        return this.http.post<User>(this.apiServer, userInput, this.httpOptions);
      }

      update(userInput: User): Observable<User> {
        return this.http.put<User>(this.apiServer + "/" + userInput.id, userInput, this.httpOptions);
      }


}
