import { Component, OnInit,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  username: string = '';
  password1: string = '';
  password2: string = '';

  constructor(private http: HttpClient,   private router: Router) { }

  ngOnInit() {
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const body = {
      username: this.username,
      password1: this.password1,
      password2: this.password2
    };

    this.http.post('http://localhost:3000/register',  body).pipe(
      tap({
        next: (response: any) => {
          alert(response.message);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          alert(error.error.message);
        }
      })
    ).subscribe();
  }
}
