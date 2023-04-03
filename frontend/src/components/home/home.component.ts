import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) { }
  goToGamePage(mode: number, difficulty: number) {
    this.router.navigate(['/game'], { queryParams: { mode: mode, difficulty: difficulty } });
  }
}
