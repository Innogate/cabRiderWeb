import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgModel } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-driver-attendance',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    TableModule,
  ],
  templateUrl: './driver-attendance.component.html',
  styleUrl: './driver-attendance.component.css',
})
export class DriverAttendanceComponent {
  selectedDriver: any;
  searchText: string = '';
  selectedMonth: any;
  currentMonthYear: string = '';

  drivers = [
    { label: 'ALAM', value: 'ALAM' },
    { label: 'BARUN SARDAR', value: 'BARUN SARDAR' },
    { label: 'GURDEEP SINGH', value: 'GURDEEP SINGH' },
    { label: 'HARISH PUMP', value: 'HARISH PUMP' },
    { label: 'LIMUSINE TRAVELS', value: 'LIMUSINE TRAVELS' },

  ];


  ngOnInit() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.currentMonthYear = `${year}-${month}`; // format: "YYYY-MM"
  }
}
