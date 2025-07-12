import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { carTypeMasterService } from '../../../services/carTypeMaster.service';
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
import { comonApiService } from '../../../services/comonApi.service'
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-driver-master',
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
  templateUrl: './driver-master.component.html',
  styleUrl: './driver-master.component.css'
})
export class DriverMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  users: any[] = [];
  showForm: boolean = false;
  form!: FormGroup;
  header: string = ''
  isLoading = true;
  filteredCities: any[] = [];

  cityList: any[] = [
    { Id: 0, CityName: '' },
  ];


  accountTypes = [
    { label: 'SAVINGS', value: 'SAVINGS' },
    { label: 'CURRENT', value: 'CURRENT' },
    { label: 'SALARY', value: 'SALARY' },
  ];



  constructor(
    private driverMasterService: driverMasterService,
    private comonApiService: comonApiService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [],
      drv_name: ['', Validators.required],
      address: [''],
      city_id: [''],
      pin_code: [''],
      mobileno: ['', Validators.required],
      whatsappno: [''],
      drv_licenseno: [''],
      drv_license_expdate: [''],
      aadhar_cardno: [''],
      bank_name: [''],
      bank_branch: [''],
      bank_acno: [''],
      bank_actype: [''],
      bank_ifsc: [''],
      active: 1,
      ref_by: 0,
      licensePath: [''],
      adharPath: [''],
      enable_login: [false],
      username: [''],
      password: ['']
    });
  }





  async ngOnInit(): Promise<void> {
    this.driverMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for == 'getalldriver') {
        this.users = msg.data;
        this.isLoading = false
      } else if (msg.for == 'getAllCityDropdown') {
        this.cityList = msg.data;
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
    this.driverMasterService.unregisterPageHandler();
    this.comonApiService.unregisterPageHandler();
  }

  async ngAfterViewInit(): Promise<void> {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    };
    const data = {
    }
    this.driverMasterService.GatAllDriver(payload);
    this.comonApiService.GatAllCityDropDown(data);
  }

  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Driver Name', field: 'drv_name', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'Address', field: 'address', icon: 'pi pi-map', styleClass: 'text-green-600' },
    { header: 'City', field: 'CityName', icon: 'pi pi-map-marker', styleClass: 'text-yellow-600' },
    { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-slack' },
    { header: 'Mobile No', field: 'mobileno', icon: 'pi pi-slack' },
    { header: 'Driver Licenseno', field: 'drv_licenseno', icon: 'pi pi-slack' },
    { header: 'Bank Name', field: 'bank_name', icon: 'pi pi-slack' },
    { header: 'Bank Branch', field: 'bank_branch', icon: 'pi pi-slack' },
    { header: 'Bank Account No', field: 'bank_acno', icon: 'pi pi-slack' },
    { header: 'Bank Account Type', field: 'bank_actype', icon: 'pi pi-slack' },
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
    if (this.form?.valid) {
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
      this.driverMasterService.CreateUpdateDriver(value);
      this.form.reset();
    }
  }



  private editUser(user: any) {
    if (user) {
      this.header = 'Update Driver'
      this.showForm = !this.showForm;
      const city = this.cityList.find(c => c.Id === user.city_id);
      this.form.patchValue({
        ...user,
        city_id: city
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
    this.comonApiService.deleteData(payload)
  }

  private add(data: any) {
    this.header = 'Add New Driver';
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
