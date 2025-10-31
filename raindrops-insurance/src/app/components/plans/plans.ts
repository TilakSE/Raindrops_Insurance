import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InsuranceService } from '../../services/insurance';
import { Plan } from '../../models/plan';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.html',
  styleUrls: ['./plans.css']
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private insuranceService: InsuranceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading = true;
    this.insuranceService.getAllPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load insurance plans. Please ensure the JSON server is running.';
        this.loading = false;
        console.error('Error loading plans:', err);
      }
    });
  }

  viewPlanDetails(planId: number): void {
    this.router.navigate(['/plan-details', planId]);
  }
}