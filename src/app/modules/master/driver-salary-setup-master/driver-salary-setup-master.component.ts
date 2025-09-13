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
import { SweetAlertService } from '../../../services/sweet-alert.service';
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
    { label: 'Actual Days of Month', value: 'Actual Days of Month' },
    { label: 'Company Working Days', value: 'Company Working Days' }
  ];

  salaryTypes = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Daily', value: 'Daily' },
  ];

  OtTime = [
    { label: 'Fixed Time', value: 'Fixed Time' },
    { label: 'Total Hours', value: 'Total Hours' },]
  tablevalue: any;




  constructor(
    private commonService: commonService,
    private driverSalaryService: driverSalarySetupMasterService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private swal: SweetAlertService
  ) {
    this.form = this.fb.group({
      // create driver salary setup form
      id: [0],
      branch_id: [0],
      DriverID: [null],
      SetupDate: [''],
      SalaryCalcOnDaysInMonth: [''],
      SalaryCalcOnDays: [''],
      SalaryType: [''],
      SalaryPerDay: [''],
      BasicSalary: [''],
      SundayAmt: [''],
      WashingAmt: [''],
      MobileAmt: [''],
      DayTotalWorkHours: [''],
      WorkStartTime: [''],
      WorkEndTime: [''],
      OTRate: [''],
      KMRun: [''],
      KMRunAmt: [''],
      KhurakiStartTime: [''],
      KhurakiEndTime: [''],
      KhurakiAmt: [''],
      LocalNightAmt: [''],
      OutStationNightAmt: [''],
      OverTimeType: ['']
    });
  }




  async ngOnInit(): Promise<void> {
    this.driverSalaryService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for == 'getalldriversalarysetup') {
        this.users = msg.data;
        this.isLoading = false;
      } else if (msg.for == 'getAllDriverDropdown') {
        this.driverList = msg.data;
      } else if (msg.for == 'createDriverSalarySetupList') {
        if (msg.StatusID === 1) {
          const updated = msg.data[0];  // access the first item in data array

          this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
          this.showForm = false;
          this.form.reset();

          const index = this.users.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.users[index] = { ...updated };
          } else {
            this.users.push(updated)
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.StatusMessage });
        }

      } else if (msg.for === "deleteData") {
        if (msg.StatusID === 1) {
          const index = this.users.findIndex((v: any) => v.id == this.tablevalue.id);
          if (index !== -1) {
            this.users.splice(index, 1);
          }
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
      Search: '',
    };

    this.driverSalaryService.getAllDriverSalary(payload);
    this.commonService.GatAllDriverDropDown({ vendor_id: 0 })
  }

  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  columns = [
    { header: 'ID', field: 'id', icon: 'pi pi-hashtag', styleClass: 'text-gray-600' },
    { header: 'Driver Name', field: 'DriverName', icon: 'pi pi-user', styleClass: 'text-blue-600' },
    { header: 'Month & Year', field: 'SetupDateFormat', icon: 'pi pi-calendar', styleClass: 'text-green-600' },
    { header: 'Salary Type', field: 'SalaryType', icon: 'pi pi-briefcase', styleClass: 'text-purple-600' },
    { header: 'Salary Amount', field: 'BasicSalary', icon: 'pi pi-wallet', styleClass: 'text-emerald-600' },
    { header: 'Mobile Expenses', field: 'MobileAmt', icon: 'pi pi-mobile', styleClass: 'text-indigo-600' },
    { header: 'Washing Expenses', field: 'WashingAmt', icon: 'pi pi-refresh', styleClass: 'text-cyan-600' },
    { header: 'Sunday Amount', field: 'SundayAmt', icon: 'pi pi-sun', styleClass: 'text-amber-500' },
    { header: 'Over Time', field: 'OverTimeType', icon: 'pi pi-clock', styleClass: 'text-pink-600' },
    { header: 'OT Rate', field: 'OTRate', icon: 'pi pi-percentage', styleClass: 'text-orange-600' },
    { header: 'Khuraki Time', field: 'KhurakiStartTime', icon: 'pi pi-stopwatch', styleClass: 'text-fuchsia-600' },
    { header: 'Khuraki Amount', field: 'KhurakiAmt', icon: 'pi pi-dollar', styleClass: 'text-lime-600' },
    { header: 'Local Night Amount', field: 'LocalNightAmt', icon: 'pi pi-moon', styleClass: 'text-sky-600' },
  ];




  // Action buttons configuration
  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];

  // Handle action events
  async handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        console.log("Edit event", event.data);
        this.editUser(event.data);
        break;
      case 'delete':
        const status = await this.swal.confirmDelete("You want to delete this !");
        if (status) {
                this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });

          this.deleteUser(event.data);
          this.tablevalue = event.data
        }
        break;
      case 'add':
        this.add(event.data);
        break

    }
  }

  onSubmit() {
    if (this.form) {
      const value = {
        ...this.form.value,
        city_id: this.form.value.city_id?.Id || null,
        active: this.form.value.active ?? '1',
        ref_by: this.form.value.ref_by ?? '0',
        whatsappno: String(this.form.value.whatsappno ?? ''),
        mobileno: String(this.form.value.mobileno ?? ''),
        DriverID: this.form.value.DriverID?.id || null,

      };
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      console.log("Value", value)
      this.driverSalaryService.createUpdateDriverSalary(value);
      // this.form.reset();
    }
  }



  private editUser(data: any) {
    if (!data) return;

    this.header = 'UPDATE DRIVER SALARY & OT SETUP';
    this.showForm = true;

    const driver = this.driverList.find(c => c.id == data.DriverID);

    this.form.patchValue({
      id: data.id ?? 0,
      branch_id: data.branch_id ?? 0,

      DriverID: driver,

      // Format SetupDate to YYYY-MM-DD if it exists
      SetupDate: data.SetupDate ? this.formatDate(data.SetupDate) : '',

      SalaryCalcOnDaysInMonth: data.SalaryCalcOnDaysInMonth ?? '',
      SalaryCalcOnDays: data.LocalNightAmt ?? '',
      SalaryType: data.SalaryType ?? '',
      SalaryPerDay: data.SalaryPerDay ?? '',
      BasicSalary: data.BasicSalary ?? '',

      SundayAmt: data.SundayAmt ?? '',
      WashingAmt: data.WashingAmt ?? '',
      MobileAmt: data.MobileAmt ?? '',

      DayTotalWorkHours: data.DayTotalWorkHours ?? '',
      WorkStartTime: data.WorkStartTime ?? '',
      WorkEndTime: data.WorkEndTime ?? '',
      OTRate: data.OTRate ?? '',

      KMRun: data.KMRun ?? '',
      KMRunAmt: data.KMRunAmt ?? '',
      KhurakiStartTime: data.KhurakiStartTime ?? '',
      KhurakiEndTime: data.KhurakiEndTime ?? '',
      KhurakiAmt: data.KhurakiAmt ?? '',

      LocalNightAmt: data.LocalNightAmt ?? '',
      OutStationNightAmt: data.OutStationNightAmt ?? '',
      OverTimeType: data.OverTimeType ?? ''
    });
  }

  private deleteUser(user: any) {
    this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
    const payload = {
      table_name: "driver_mast",
      column_name: "id",
      column_value: "" + user.id,
    }
    this.commonService.deleteData(payload)
    console.log(payload)
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

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // returns 'YYYY-MM-DD'
  }

}
