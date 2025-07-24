import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { globalRequestHandler } from '../../../utils/global';
import { monthlyDutyMasterService } from '../../../services/monthlyDutyMaster';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-monthly-duty-master',
  imports: [CommonModule, DynamicTableComponent, ReactiveFormsModule, DropdownModule, AutoCompleteModule],
  templateUrl: './monthly-duty-master.component.html',
  styleUrl: './monthly-duty-master.component.css'
})
export class MonthlyDutyMasterComponent implements OnInit, OnDestroy, AfterViewInit{
  data: any[] = [];
  isLoading: boolean = true;
  showForm: boolean = false;
  form!: FormGroup;
  heading: string='';

 constructor(
  private monthlyDutyMasterService:monthlyDutyMasterService,
  private router:Router,
  private messageService:MessageService,
  private fb: FormBuilder,

 ){this.createForm()}

  createForm() {
    this.form = this.fb.group({
  id: 0,
  branch_id: 1,
  PartyID: 2,
  UsedBy: "Admin",
  CityID: 1,
  CarTypeID: 5,
  CarNo: ['', [Validators.pattern(/^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/)]],
  SetupType: "Monthly",
  DutyAmt: 1000.0,
  NoofDays: 25,
  ExceptDay: "Sunday",
  OutStationDuty: "Y",
  ExtraDayHrRate: 50,
  ExtraDayKMRate: 10,
  ExtraDayMinHr: 4,
  CompareKMTime: "false",
  FromTime: "08:00:00",
  ToTime: "20:00:00",
  TotHrs: 12,
  ExtraMonthHrsRate: 200,
  TotalKM: 3000,
  KMRate: 5,
  OTRate: 100,
  NightAmt: 150,
  OutNightRt: 200,
  FuelRt: 90,
  MobilRt: 20,
  FuelAvrg: 12,
  MobilAvrg: 15,
  NHaltTime: "02:00:00",
  GrgOutTime: "07:30:00",
  GrgInTime: "21:00:00",
  GrgOutKM: 10,
  GrgInKM: 20,
  CalcOnRptTime: "false",
  OutStationAmt: 500,
  ExtraDesc: "Festival Duty",
  ExtraAmt: 100,
  PerDayAmt: 400,

    });
  }



 ngOnInit(): void {
     this.monthlyDutyMasterService.registerPageHandler((msg) => {
       console.log(msg);
       globalRequestHandler(msg, this.router, this.messageService);
       if (msg.for === "getAllMonthlyDutyList"){
        this.data=msg.data;
        this.isLoading=false;
       }
       return true;
     });
   }
 
 
   ngOnDestroy(): void {
     
   }
 
   ngAfterViewInit(): void {
     const payload = {
       id: 0,
       PageNo: 1,
       PageSize: 1000,
       Search: "",
     };
     this.monthlyDutyMasterService.getAllMonthlyDuty(payload)
   }
     
    // Define the columns for the dynamic table
  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Duty NO', field: 'DutyNo', icon: 'pi pi-list', styleClass: 'text-green-600' },
    { header: 'Car No', field: 'CarNo', icon: 'pi pi-car', styleClass: 'text-indigo-500' },
    // { header: 'City', field: 'CityName', icon: 'pi pi-map-marker', styleClass: 'text-yellow-600' },
    // { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-slack' },
    // { header: 'Mobile No', field: 'mobileno', icon: 'pi pi-slack' },
    // { header: 'Driver Licenseno', field: 'drv_licenseno', icon: 'pi pi-slack' },
    // { header: 'Bank Name', field: 'bank_name', icon: 'pi pi-slack' },
    // { header: 'Bank Branch', field: 'bank_branch', icon: 'pi pi-slack' },
    // { header: 'Bank Account No', field: 'bank_acno', icon: 'pi pi-slack' },
    // { header: 'Bank Account Type', field: 'bank_actype', icon: 'pi pi-slack' },
  ];

  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];


  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.showForm=true;
         this.heading='EDIT CAR TYPE'
        break;
      case 'delete':
        break;
      case 'add':
         this.showForm=true;
         this.heading='ADD CAR TYPE'
        break
    }
  }
  
}
