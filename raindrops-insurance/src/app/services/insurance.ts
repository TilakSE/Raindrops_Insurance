import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models/plan';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private apiUrl = 'http://localhost:3333';

  constructor(private http: HttpClient) { }

  // Get all plans
  getAllPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/plans`);
  }

  // Get plan by ID
  getPlanById(planId: number): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/plans?planId=${planId}`);
  }

  // Book insurance
  bookInsurance(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, booking);
  }

  // Get all bookings
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
  }
}