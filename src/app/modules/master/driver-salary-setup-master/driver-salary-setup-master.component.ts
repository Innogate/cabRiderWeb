import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { globalRequestHandler } from '../../../utils/global';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { driverMasterService } from '../../../services/driverMaster.service';
import { StyleClass } from 'primeng/styleclass';
import { CheckboxModule } from 'primeng/checkbox';
import { commonService } from '../../../services/comonApi.service'
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { driverSalarySetupMasterService } from '../../../services/driverSalarySetupMaster.service'
@Component({
  selector: 'app-driver-salary-setup-master',
  imports: [DynamicTableComponent,
    CheckboxModule,
    AutoCompleteModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FileUploadModule,
    CommonModule,
    HttpClientModule],
  templateUrl: './driver-salary-setup-master.component.html',
  styleUrl: './driver-salary-setup-master.component.css'
})
export class DriverSalarySetupMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  users: any[] = [];
  showForm: boolean = false;
  form!: FormGroup;
  header: string = ''
  isLoading = true;
  filteredCities: any[] = [];
  driverList: any[] = []; // Full list of drivers (e.g., from API)
  filteredDrivers: any[] = [];
  // salaryTypes: any[] = [];
  cityList: any[] = [
    { Id: 0, CityName: '' },
  ];
  SalaryCalculate = [
    { label: 'Actual Days of Mounth', value: 'Actual Days of Mounth' },
    { label: 'Company Working Days', value: 'Company Working Days' }
  ];

  salaryTypes = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Daily', value: 'Daily' },
  ];

  OtTime = [
    { label: 'Fixed Time', value: 'Fixed Time' },
    { label: 'Total Hours', value: 'Total Hours' },]




  constructor(
    private commonService: commonService,
    private driverSalaryService: driverSalarySetupMasterService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      // create driver salary setup form
      id: [0],
      branch_id: [0],
      DriverId: [null],
      SetupDate: [null],
      SalaryCalcOnDaysInMonth: [null],
      SalaryCalcOnDays: [null],
      SalaryType: [null],
      SalaryPerDay: [null],
      BasicSalary: [null],
      SundayAmt: [null],
      WashingAmt: [null],
      MobileAmt: [null],
      DayTotalWorkHours: [null],
      WorkStartTime: [null],
      WorkEndTime: [null],
      OTRate: [null],
      KMRun: [null],
      KMRunAmt: [null],
      KhurakiStartTime: [null],
      KhurakiEndTime: [null],
      KhurakiAmt: [null],
      LocalNightAmt: [null],
      OutStationNightAmt: [null],
      OverTimeType: [null]
    });
  }




  async ngOnInit(): Promise<void> {
    this.driverSalaryService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for == 'getalldriversalarysetup') {
        this.users = msg.data;
        this.isLoading = false
      } else if (msg.for == 'getAllDriverDropdown') {
        this.driverList = msg.data;
      } else if (msg.for == 'CreateUpdateDriver') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage })
      } else if (msg.for === "deleteData") {
        if (msg.StatusMessage === "success") {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage })
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Cannot Delete data" })
        }
      }
      return true;
    });
  }



  ngOnDestroy(): void {
    this.driverSalaryService.unregisterPageHandler();
    this.commonService.unregisterPageHandler();
  }


  filterDrivers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredDrivers = this.driverList.filter(driver =>
      driver.drv_name.toLowerCase().includes(query)
    );
  }

  async ngAfterViewInit(): Promise<void> {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    };
    this.driverSalaryService.getAllDriverSalary(payload);
    this.commonService.GatAllDriverDropDown({ vendor_id: 0})
  }

  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Driver Name', field: 'DriverName', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'Month & Year', field: 'SetupDateFormat', icon: 'pi pi-map', styleClass: 'text-green-600' },
    { header: 'Salary Type', field: 'SalaryType', icon: 'pi pi-map-marker', styleClass: 'text-yellow-600' },
    { header: 'Salary Amount', field: 'BasicSalary', icon: 'pi pi-slack' },
    { header: 'Mobile Expenses', field: 'MobileAmt', icon: 'pi pi-slack' },
    { header: 'Washing Expenses', field: 'WashingAmt', icon: 'pi pi-slack' },
    { header: 'Sunday Amount', field: 'SundayAmt', icon: 'pi pi-slack' },
    { header: 'Over Time', field: 'OverTimeType', icon: 'pi pi-slack' },
    { header: 'OT Rate', field: 'OTRate', icon: 'pi pi-slack' },
    { header: 'Khuraki Time', field: 'KhurakiStartTime', icon: 'pi pi-slack' },
    { header: 'Khuraki Amount', field: 'KhurakiAmt', icon: 'pi pi-slack' },
    { header: 'Local Night Amount', field: 'LocalNightAmt', icon: 'pi pi-slack' },

  ];




  // Action buttons configuration
  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];

  // Handle action events
  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        console.log("Edit event", event.data);
        this.editUser(event.data);
        break;
      case 'delete':
        this.deleteUser(event.data);
        break;
      case 'add':
        this.add(event.data);
        break

    }
  }

  onSubmit() {
     console.log("Form Value", this.form.value);
    if (this.form) {
      const value = {
        ...this.form.value,
        city_id: this.form.value.city_id?.Id || null,
        active: this.form.value.active ?? '1',
        ref_by: this.form.value.ref_by ?? '0',
        whatsappno: String(this.form.value.whatsappno ?? ''),
        mobileno: String(this.form.value.mobileno ?? '')

      };
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      console.log("Value", value)
      this.driverSalaryService.createUpdateDriverSalary(value);
      // this.form.reset();
    }
  }



  private editUser(data: any) {
    if (data) {
      this.header = 'UPDATE DRIVER SALARY & OT SETUP'
      this.showForm = !this.showForm;
      const driver = this.driverList.find(c => c.id == data.DriverID);
      this.form.patchValue({
        ...data,
        DriverId: driver
      })
    }
  }

  private deleteUser(user: any) {
    this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
    const payload = {
      table_name: "driver_mast",
      column_name: "id",
      column_value: "" + user.id,
    }
    this.commonService.deleteData(payload)
  }

  private add(data: any) {
    this.header = 'ADD DRIVER SALARY & OT SETUP';
    this.showForm = !this.showForm;
    this.form.reset();
  }

  onFileSelect(event: any, type: 'license' | 'aadhar') {
    const file = event.files[0];
    if (type === 'license') {
      console.log('Selected License:', file);
      // store or process license file
    } else if (type === 'aadhar') {
      console.log('Selected Aadhar:', file);
      // store or process aadhar file
    }
  }
}
