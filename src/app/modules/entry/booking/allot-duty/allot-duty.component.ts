import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DutyService } from '../../../../services/duty.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { carTypeMasterService } from '../../../../services/carTypeMaster.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { globalRequestHandler } from '../../../../utils/global';

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
    AutoCompleteModule
  ],
  templateUrl: './allot-duty.component.html',
  styleUrls: ['./allot-duty.component.css']  // ✅ FIX: changed styleUrl to styleUrls
})
export class AllotDutyComponent implements OnInit {
  dutyForm!: FormGroup;

  vendorList = [
    { label: 'Vendor A', value: 'A' },
    { label: 'Vendor B', value: 'B' },
  ];

  carTypes?: any[] = [];
  carTypeSearch: any;
  filteredCarTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dutyService: DutyService,
    private messageService: MessageService,
    private router: Router,
    private carTypeMaster: carTypeMasterService
  ) { }

  ngOnInit(): void {
    this.registerMessageHandler();
    this.initializeForm();
    this.getCarTypeName(); // triggers API to get car types
  }

  registerMessageHandler() {
    this.dutyService.registerPageHandler((msg) => {
      let handled = false;

      handled = globalRequestHandler(msg, this.router, this.messageService);

      if (msg.for) {
        switch (msg.for) {
          case 'CarTypeGate':
            if (Array.isArray(msg.data)) {
              this.carTypes = msg.data || [];
              console.log('Car Types Loaded:', this.carTypes);
            } else {
              this.carTypes = [];
              console.warn('Invalid carTypes data:', msg.data);
            }
            handled = true;
            break;

          case 'bookingAllotted':
            this.messageService.add({
              severity: msg.type,
              summary: msg.type,
              detail: msg.msg
            });
            console.log('Duty response:', msg);
            handled = true;
            break;
        }
      }

      if (!handled) {
        console.log('Unhandled message in AllotDutyComponent:', msg);
      }

      return handled;
    });
  }

  initializeForm() {
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

  getCarTypeName() {
    this.carTypeMaster.GateAllCarType({
      PageNo: 1,
      PageSize: 10,
      Search: this.carTypeSearch || '',
    });
  }

  filterCarTypes(event: any) {
    if (this.carTypes) {
      const query = event.query.toLowerCase();
      this.filteredCarTypes = this.carTypes.filter((type) =>
        type.car_type.toLowerCase().includes(query)
      );
    }
  }


  onCarTypeSelect(carType: any) {
    this.dutyForm.get('selectedCarType')?.setValue(carType);
    console.log('Car Type selected:', carType);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  save() {
    if (this.dutyForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form Error',
        detail: 'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.dutyForm.value;

    const formatDate = (date: Date | null) => {
      return date ? new Date(date).toISOString() : null;
    };

    const payload = {
      selectedVendor: formValue.selectedVendor,
      vendorContact: formValue.vendorContact,
      carType: formValue.selectedCarType?.car_type || null,
      carTypeId: formValue.selectedCarType?.id || null,
      grgOutTime: formatDate(formValue.grgOutTime),
      vendorGrgOutTime: formatDate(formValue.vendorGrgOutTime),
      vendorAdvanced: formValue.vendorAdvanced,
      carNo: formValue.carNo,
      driverName: formValue.driverName,
      driverContact: formValue.driverContact
    };

    console.log('Sending payload:', payload);

    this.dutyService.duty(payload);  // assuming it uses WebSocket
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Please wait, processing...'
    });
  }


  close() {
    console.log('Close clicked');
  }
}
