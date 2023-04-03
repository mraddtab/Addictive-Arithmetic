import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth.services';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }
  
  currentUser: string = "";

  ngOnInit() {
    this.currentUser = localStorage.getItem("currentUser") ?? "";
  }
  navigateProfile(event: Event){
    this.router.navigate(['/profile']);
  }
  navigateHome(event: Event){
    this.router.navigate(['/home']);
  }
  logOut(event: Event) {
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}

