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
import { commonService } from '../../../services/comonApi.service'
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlertService } from '../../../services/sweet-alert.service';

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
  header: string = '';
  isLoading = true;
  filteredCities: any[] = [];
  tablevalue: any;
  

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
    private commonService: commonService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private swal: SweetAlertService
  ) {
    this.form = this.fb.group({
      id: [],
      drv_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/)]],
      address: [''],
      city_id: [''],
      pin_code: ['', [Validators.pattern(/^[1-9][0-9]{5}$/)]],
      mobileno: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      whatsappno: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      drv_licenseno: ['', [Validators.pattern(/^[A-Z]{2}\d{2}\d{4}\d{7}$/)]],
      drv_license_expdate: [''],
      aadhar_cardno: ['', [Validators.pattern(/^[2-9]\d{11}$/)]],
      bank_name: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      bank_branch: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      bank_acno: ['', [Validators.pattern(/^\d{9,18}$/)]],
      bank_actype: [''],
      bank_ifsc: ['', [Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
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
        if (msg.StatusID === 1) {
          const updated = msg.data[0];  // access the first item in data array

          // this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
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
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage })
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Cannot Delete data" })
        }
      }
      return true;
    });
  }



  ngOnDestroy(): void {
    this.driverMasterService.unregisterPageHandler();
    this.commonService.unregisterPageHandler();
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
    this.commonService.GatAllCityDropDown({});
  }

  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  columns = [
    { header: 'ID', field: 'id', icon: 'pi pi-hashtag', styleClass: 'text-gray-600' },
    { header: 'Driver Name', field: 'drv_name', icon: 'pi pi-user', styleClass: 'text-blue-600' },
    { header: 'Address', field: 'address', icon: 'pi pi-home', styleClass: 'text-green-600' },
    { header: 'City', field: 'CityName', icon: 'pi pi-map-marker', styleClass: 'text-orange-500' },
    { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-envelope', styleClass: 'text-purple-500' },
    { header: 'Mobile No', field: 'mobileno', icon: 'pi pi-phone', styleClass: 'text-teal-500' },
    { header: 'Driver Licenseno', field: 'drv_licenseno', icon: 'pi pi-id-card', styleClass: 'text-indigo-500' },
    { header: 'Bank Name', field: 'bank_name', icon: 'pi pi-building', styleClass: 'text-pink-500' },
    { header: 'Bank Branch', field: 'bank_branch', icon: 'pi pi-briefcase', styleClass: 'text-yellow-600' },
    { header: 'Bank Account No', field: 'bank_acno', icon: 'pi pi-credit-card', styleClass: 'text-red-500' },
    { header: 'Bank Account Type', field: 'bank_actype', icon: 'pi pi-wallet', styleClass: 'text-emerald-500' },
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
    if (this.form?.valid) {
      const value = {
        ...this.form.value,
        city_id: this.form.value.city_id?.Id,
        active: this.form.value.active ?? '1',
        ref_by: this.form.value.ref_by ?? '0',
        whatsappno: String(this.form.value.whatsappno ?? ''),
        mobileno: String(this.form.value.mobileno ?? ''),
        bank_actype: this.form.value.bank_actype?.value || null,

      };
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      console.log("Value", value)
      this.driverMasterService.CreateUpdateDriver(value);
      // this.form.reset();
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
    // this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
    const payload = {
      table_name: "driver_mast",
      column_name: "id",
      column_value: "" + user.id,
    }
    this.commonService.deleteData(payload)
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
