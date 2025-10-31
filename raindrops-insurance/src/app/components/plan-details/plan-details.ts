import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceService } from '../../services/insurance';
import { PremiumCalculatorService } from '../../services/premium-calculator';
import { Plan } from '../../models/plan';
import { UserHealthData } from '../../models/user-health-data';

declare var bootstrap: any;

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-details.html',
  styleUrls: ['./plan-details.css']
})
export class PlanDetailsComponent implements OnInit {
  plan: Plan | null = null;
  loading: boolean = true;
  error: string = '';
  
  // User health data
  userHealthData: UserHealthData = {
    age: 0,
    earnings: 0,
    hasPreExistingConditions: false,
    isSmoker: false,
    hasChronicDiseases: false,
    exerciseRegularly: false
  };

  // Questionnaire state
  currentQuestion: number = 0;
  questionsCompleted: boolean = false;
  calculatedPremium: number = 0;

  // Questions
  questions = [
    { 
      id: 1, 
      question: 'What is your age?', 
      type: 'number', 
      field: 'age',
      placeholder: 'Enter your age',
      min: 18,
      max: 100,
      errorMsg: 'Age must be between 18 and 100'
    },
    { 
      id: 2, 
      question: 'What is your annual earnings (in ₹)?', 
      type: 'number', 
      field: 'earnings',
      placeholder: 'Enter your annual earnings',
      min: 0,
      errorMsg: 'Earnings cannot be negative'
    },
    { 
      id: 3, 
      question: 'Do you have any pre-existing medical conditions?', 
      type: 'boolean', 
      field: 'hasPreExistingConditions'
    },
    { 
      id: 4, 
      question: 'Are you a smoker?', 
      type: 'boolean', 
      field: 'isSmoker'
    },
    { 
      id: 5, 
      question: 'Do you have any chronic diseases (diabetes, hypertension, etc.)?', 
      type: 'boolean', 
      field: 'hasChronicDiseases'
    },
    { 
      id: 6, 
      question: 'Do you exercise regularly (at least 3 times a week)?', 
      type: 'boolean', 
      field: 'exerciseRegularly'
    }
  ];

  tempValue: any = '';
  validationError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService,
    private premiumCalculator: PremiumCalculatorService
  ) { }

  ngOnInit(): void {
    const planId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlanDetails(planId);
  }

  loadPlanDetails(planId: number): void {
    this.loading = true;
    this.insuranceService.getPlanById(planId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.plan = data[0];
        } else {
          this.error = 'Plan not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load plan details';
        this.loading = false;
        console.error('Error loading plan:', err);
      }
    });
  }

  startQuestionnaire(): void {
    this.currentQuestion = 0;
    this.tempValue = '';
    const modal = new bootstrap.Modal(document.getElementById('questionModal'));
    modal.show();
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestion];
  }

  validateInput(): boolean {
    this.validationError = '';
    const question = this.getCurrentQuestion();

    if (question.type === 'number') {
      const value = Number(this.tempValue);
      
      if (!this.tempValue || isNaN(value)) {
        this.validationError = 'Please enter a valid number';
        return false;
      }

      if (question.min !== undefined && value < question.min) {
        this.validationError = question.errorMsg || `Value must be at least ${question.min}`;
        return false;
      }

      if (question.max !== undefined && value > question.max) {
        this.validationError = question.errorMsg || `Value must be at most ${question.max}`;
        return false;
      }
    }

    return true;
  }

  nextQuestion(): void {
    if (!this.validateInput()) {
      return;
    }

    const question = this.getCurrentQuestion();
    
    if (question.type === 'number') {
      (this.userHealthData as any)[question.field] = Number(this.tempValue);
    } else if (question.type === 'boolean') {
      (this.userHealthData as any)[question.field] = this.tempValue === 'yes';
    }

    this.tempValue = '';
    this.validationError = '';

    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    } else {
      this.completeQuestionnaire();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.validationError = '';
      
      // Load previous answer
      const question = this.getCurrentQuestion();
      const value = (this.userHealthData as any)[question.field];
      
      if (question.type === 'boolean') {
        this.tempValue = value ? 'yes' : 'no';
      } else {
        this.tempValue = value;
      }
    }
  }

  completeQuestionnaire(): void {
    if (this.plan) {
      this.calculatedPremium = this.premiumCalculator.calculatePremium(
        this.plan.baseAmt,
        this.userHealthData
      );
      this.questionsCompleted = true;
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('questionModal'));
    modal?.hide();
  }

  proceedToBooking(): void {
    if (this.plan) {
      this.router.navigate(['/booking'], {
        state: {
          plan: this.plan,
          premium: this.calculatedPremium,
          userHealthData: this.userHealthData
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/plans']);
  }
}