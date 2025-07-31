import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-allot-duty',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
  ],
  templateUrl: './allot-duty.component.html',
  styleUrl: './allot-duty.component.css'
})
export class AllotDutyComponent implements OnInit {
  dutyForm!: FormGroup;

  vendorList = [
    { label: 'Vendor A', value: 'A' },
    { label: 'Vendor B', value: 'B' },
  ];

  carTypes = [
    { label: 'Sedan', value: 'sedan' },
    { label: 'SUV', value: 'suv' },
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dutyForm = this.fb.group({
      selectedVendor: [null, Validators.required],
      vendorContact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      selectedCarType: [null, Validators.required],
      grgOutTime: [null],
      vendorGrgOutTime: [null],
      vendorAdvanced: [0],
      carNo: [''],
      driverName: [''],
      driverContact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });


  }

  close() {
    console.log("Close clicked");
  }

  save() {
    console.log("Form Submitted:", this.dutyForm.value);

  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

}
