import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DutyService } from '../../../../services/duty.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private dutyService: DutyService,
    private messageService: MessageService,
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    this.dutyService.registerPageHandler((msg)=>{
      let rt = false
      if(msg.for){
        if(msg.for === "bookingAllotted"){
           this.messageService.add({ severity: msg.type, summary: msg.type, detail: msg.msg });
          console.log(msg)
          rt = true;
        }
      }
      return rt;
    })
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
    this.dutyService.duty(this.dutyForm.value);
    this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

}
