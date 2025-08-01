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
import { carTypeMasterService } from '../../../../services/carTypeMaster.service';
import { AutoCompleteModule } from 'primeng/autocomplete';

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
  styleUrl: './allot-duty.component.css'
})
export class AllotDutyComponent implements OnInit {
  dutyForm!: FormGroup;

  vendorList = [
    { label: 'Vendor A', value: 'A' },
    { label: 'Vendor B', value: 'B' },
  ];

    carTypes?: any[];

  constructor(
    private fb: FormBuilder,
    private dutyService: DutyService,
    private messageService: MessageService,
    private router: Router,
    private carTypeMaster: carTypeMasterService
  ) { }

  carTypeSearch: any;
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

    this.carTypeMaster.registerPageHandler((msg) => {
      let rt = false;

      if (msg.for) {
        if (msg.for === 'CarTypeGate') {
          this.carTypes = msg.data;
          rt = true;
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    })

    this.getCarTypeName();

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

  onCarTypeSelect(cartype: any) {
    if (this.dutyForm) {
      this.dutyForm.get('CarType')?.setValue(cartype.value.id);
    }
  }

  filteredCarTypes: any[] = [];

  filterCarTypes(event: any) {
    if (!this.carTypes) return;
    const query = event.query.toLowerCase();
    this.filteredCarTypes = this.carTypes.filter((type) =>
      type.car_type.toLowerCase().includes(query)
    );
    console.log(this.filteredCarTypes)
  }

  getCarTypeName() {
    // console.log('getCarTypeName');
    this.carTypeMaster.GateAllCarType({
      PageNo: 1,
      PageSize: 10,
      Search: this.carTypeSearch,
    });
  }
}
