import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { vendorMasterService } from '../../../services/vendorMaster.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { globalRequestHandler } from '../../../utils/global';
import { AutoComplete } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { commonService } from '../../../services/comonApi.service';

@Component({
  selector: 'app-vendor-master',
  imports: [CommonModule, 
    DynamicTableComponent, 
    DropdownModule, 
    AutoComplete,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './vendor-master.component.html',
  styleUrl: './vendor-master.component.css'
})
export class VendorMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  showForm: boolean = false;
  isLoading: boolean = true;
  data: any[] = [];
  heading: string ='';
  cities: any[] = [];
  filteredCities: any[] = [];
  cityList: any[] = [{ Id: 0, CityName: '' }];
  form!: FormGroup;
  tax: boolean = true;
  validationMessage: string = '';

  partyTypes = [
    { label: 'Cab Vendor', value: 'c' },
    { label: 'Others', value: 'o' },
  ];

  taxTypes: any[] = [
    { label: 'CGST/SGST', value: 'cgst/sgst' },
    { label: 'IGST', value: 'igst' },
  ]

  constructor(
    private vendorMasterService:vendorMasterService,
    private router:Router,
    private messageService:MessageService,
    private fb: FormBuilder,
    private commonService: commonService,
  ){
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      active: ['Y'],
      address: [''],
      bank_acno: [''],
      bank_actype: [''],
      bank_branch: [''],
      bank_ifsc: [''],
      bank_name: [''],
      city_id: [],
      email: [''],
      gstno: [''],
      id: [0],
      mobileno: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      panno: [''],
      pin_code: [''],
      ref_by: [''],
      vendor_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/)]],
      whatsappno: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      tax_type: ['cgst/sgst'],
      cgst: [0],
      sgst: [0],
      igst: [0],
      phone_no: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      party_type: ['', Validators.required],
      tds: [''],
    });
  }



  ngOnInit(): void {
    this.vendorMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === "getallvendor") {
        this.data = msg.data
        this.isLoading = false
      } else if (msg.for == 'getAllCityDropdown') {
        this.cityList = msg.data;
      } else if (msg.for == 'createUpdateVendor') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
        this.showForm = false;
        this.form.reset();
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
      this.vendorMasterService.unregisterPageHandler();
      this.commonService.unregisterPageHandler();
    }
  
    ngAfterViewInit(): void {
      const payload = {
        id: 0,
        PageNo: 1,
        PageSize: 1000,
        Search: "",
      };
      this.vendorMasterService.GatAllVendor(payload);
      this.commonService.GatAllCityDropDown({});
    }

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Vendor Name', field: 'vendor_name', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'Address', field: 'address', icon: 'pi pi-map', styleClass: 'text-green-600' },
    { header: 'City', field: 'CityName', icon: 'pi pi-map-marker', styleClass: 'text-yellow-600' },
    { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-map-marker', styleClass: 'text-sky-500' },
    { header: 'Mobile No', field: 'mobileno', icon: 'pi pi-phone', styleClass: 'text-red-600' },
    { header: 'WhatsApp No', field: 'whatsappno', icon: 'pi pi-whatsapp', styleClass: 'text-green-600' },
    { header: 'GST No', field: 'gstno', icon: 'pi pi-money-bill', styleClass: 'text-blue-800' },
    { header: 'PAN No', field: 'panno', icon: 'pi pi-wallet', styleClass: 'text-violet-800' },
    { header: 'Bank Name', field: 'bank_name', icon: 'pi pi-building-columns', styleClass: 'text-amber-900' },
    { header: 'Bank Branch', field: 'bank_branch', icon: 'pi pi-building', styleClass: 'text-amber-900' },
    { header: 'Bank Account No', field: 'bank_acno', icon: 'pi pi-id-card', styleClass: 'text-sky-600' },
    { header: 'Bank Account Type', field: 'bank_actype', icon: 'pi pi-credit-card', styleClass: 'text-rose-800' },
    // { header: 'Driver Licenseno', field: 'drv_licenseno', icon: 'pi pi-slack' },
  ];

  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];


  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.showForm = true;
        this.heading = 'UPDATE VENDOR';
        this.form.reset();
        const city = this.cityList.find(city => city.Id == event.data.city_id);
        this.form.patchValue({
          ...event.data,
          city_id: city
        });
        console.log("edit");
        break;
      case 'delete':
        console.log("delete");
        break;
      case 'add':
        this.heading = 'ADD VENDOR';
        this.showForm = !this.showForm;
        this.form.reset();
        this.changeTaxType({ value: this.form.get('tax_type')?.value });
        console.log("add");
        break
    }
  }


  changeTaxType(event: any) {
    const selectedValue = event?.value;
    this.tax = selectedValue === 'igst';
    if (this.tax) {
      this.form.patchValue({ cgst: 0, sgst: 0 });
      this.form.get('cgst')?.disable();
      this.form.get('sgst')?.disable();
      this.form.get('igst')?.enable();
    } else {
      this.form.patchValue({ igst: 0 });
      this.form.get('cgst')?.enable();
      this.form.get('sgst')?.enable();
      this.form.get('igst')?.disable();
    }
  }


  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }


  autoFillNo(){
    const whatsappno = this.form.get("mobileno")?.value;
    this.form.get('whatsappno')?.setValue(whatsappno);
  }


  saveVendor() {
  if (this.form.invalid) {
    console.log('Form is invalid, form values:', this.form.value);
  return;
  } else {
    console.log('Form is valid, form values:', this.form.value);
  }
}

}
