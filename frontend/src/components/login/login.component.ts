import { Component, OnInit,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const body = {
      username: this.username,
      password: this.password
    };
    console.log(body.username);
    console.log(body.password);
    this.http.post('http://localhost:3000/login', body).pipe(
      tap({
        next: (response: any) => {
          localStorage.setItem("authToken", response.authToken);
          localStorage.setItem("currentUser", response.username);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          alert("Login Failed");
        }
      })
    ).subscribe();
}

}
