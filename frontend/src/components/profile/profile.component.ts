import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UserStats {
  username: string;
  questions_answered: number;
  incorrect_answers: number;
  correct_answers: number;
  longest_streak: number;
  accuracy: number;
}
const defaultUserStats: UserStats = {
  username: '',
  questions_answered: 0,
  incorrect_answers: 0,
  correct_answers: 0,
  longest_streak: 0,
  accuracy: 0,
};
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = localStorage.getItem("currentUser") ?? "";
  userStats: UserStats  = defaultUserStats;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Retrieve user stats from the API
    this.http.get<{success: boolean, userStats: UserStats}>('http://localhost:3000/user-stats', { params: { username: this.username } })
      .subscribe(
        response => {
          if (response.success) {
            this.userStats = response.userStats;
          } else {
            console.error('Failed to retrieve user stats');
          }
        },
        error => {
          console.error('Failed to retrieve user stats');
        }
      );
  }
}