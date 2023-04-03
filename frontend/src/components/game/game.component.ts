import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  username: string = localStorage.getItem("currentUser") ?? "";
  timeLeft: number = 30;
  currentQuestion: string = this.generateQuestion(1,1);
  userAnswer: string = '';
  correctAnswer: number = 0;
  currentStreak: number = 0;
  @Input() mode: number = 0;
  @Input() difficulty: number = 0;
  
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the mode and difficulty values from the query parameters
    this.route.queryParams.subscribe(params => {
      this.mode = parseInt(params['mode']);
      this.difficulty = parseInt(params['difficulty']);
    });
    this.currentQuestion = this.generateQuestion(this.mode, this.difficulty);
  
    // Start the timer
    this.startTimer();
  } 

  startTimer() {
    const interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(interval);
        this.currentQuestion = this.generateQuestion(this.mode,this.difficulty);
        this.timeLeft = 30;
        this.startTimer();
      }
    }, 1000);
  }

    generateQuestion(mode: number, difficulty: number): string {
      let num1 = 0, num2 = 0, operator, result;

      if (mode === 1) {
        if (difficulty === 1) {
          num1 = Math.floor(Math.random() * 10);
          num2 = Math.floor(Math.random() * 10);
        } else if (difficulty === 2) {
          num1 = Math.floor(Math.random() * 100);
          num2 = Math.floor(Math.random() * 10);
        } else if (difficulty === 3) {
          num1 = Math.floor(Math.random() * 100);
          num2 = Math.floor(Math.random() * 100);
        }
        operator = Math.random() > 0.5 ? '+' : '-';
        result = operator === '+' ? num1 + num2 : num1 - num2;
        this.correctAnswer = result;
        return `${num1} ${operator} ${num2} =`;
      }

      else if (mode === 2) {
        if (difficulty === 1) {
          num1 = Math.floor(Math.random() * 10);
          do {
            num2 = Math.floor(Math.random() * 10);
          } while (num2 === 0);
        } else if (difficulty === 2) {
          num1 = Math.floor(Math.random() * 100);
          do {
            num2 = Math.floor(Math.random() * 10);
          } while (num2 === 0);
        } else if (difficulty === 3) {
          num1 = Math.floor(Math.random() * 100);
          do {
            num2 = Math.floor(Math.random() * 100);
          } while (num2 === 0);
        }
        operator = Math.random() > 0.5 ? 'x' : '÷';
        result = operator === 'x' ? num1 * num2 : num1 /num2;
        this.correctAnswer = parseFloat(result.toFixed(2));
        return `${num1} ${operator} ${num2} =`;
      }

      else if (mode === 3) {
        if (difficulty === 1) {
          num1 = Math.floor(Math.random() * 10);
          do {
            num2 = Math.floor(Math.random() * 10);
          } while (num2 === 0);
        } else if (difficulty === 2) {
          num1 = Math.floor(Math.random() * 100);
          do {
            num2 = Math.floor(Math.random() * 10);
          } while (num2 === 0);
        } else if (difficulty === 3) {
          num1 = Math.floor(Math.random() * 100);
          do {
            num2 = Math.floor(Math.random() * 100);
          } while (num2 === 0);
        }
        const operators = ['+', '-', 'x', '÷'];
        operator = operators[Math.floor(Math.random() * operators.length)];
        if (operator === '+') {
          result = num1 + num2;
          this.correctAnswer = result;
        } else if (operator === '-') {
          result = num1 - num2;
          this.correctAnswer = result;
        } else if (operator === 'x') {
          result = num1 * num2;
          this.correctAnswer = result;
        } else {
          result = num1/num2; 
          this.correctAnswer = result;
        }
        return `${num1} ${operator} ${num2} =`;
      }
      return '';
  }

  sendScore(correct: number) {
    const body = { username: this.username, streak: this.currentStreak, correct: correct};

    this.http.post('http://localhost:3000/game', body).pipe(
          tap({
            next: (response: any) => {
              
            },
            error: (error) => {
              alert("server error");
            }
          })
        ).subscribe();
  }
  checkAnswer() {
      // Convert userAnswer to a number
      const parsedUserAnswer = parseFloat(this.userAnswer);
      console.log(this.correctAnswer);
      console.log(parsedUserAnswer);  
      // Check if the parsedUserAnswer is equal to the correct answer
      if (parsedUserAnswer === this.correctAnswer) {
        this.currentStreak++;
        this.sendScore(1);

      } else {
        this.currentStreak = 0;
        this.sendScore(0);
      }
      this.timeLeft = 0;

  }
}
