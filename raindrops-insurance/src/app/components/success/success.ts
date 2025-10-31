import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.html',
  styleUrls: ['./success.css']
})
export class SuccessComponent implements OnInit {
  booking: Booking | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.booking = navigation.extras.state['booking'];
    }
  }

  ngOnInit(): void {
    if (!this.booking) {
      this.router.navigate(['/']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewPlans(): void {
    this.router.navigate(['/plans']);
  }

  printConfirmation(): void {
    window.print();
  }
}