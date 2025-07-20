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
  imports: [
    CommonModule,
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
  heading: string = '';
  cities: any[] = [];
  filteredCities: any[] = [];
  cityList: any[] = [{ Id: 0, CityName: '' }];
  form!: FormGroup;
  tax: boolean = true;
  validationMessage: string = '';
  tablevalue: any;

  partyTypes = [
    { label: 'Cab Vendor', value: 'c' },
    { label: 'Others', value: 'o' },
  ];

  taxTypes: any[] = [
    { label: 'CGST/SGST', value: 'c/s' },
    { label: 'IGST', value: 'i' },
  ];

  constructor(
    private vendorMasterService: vendorMasterService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commonService: commonService,
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      active: ['Y'],
      address: [''],
      bank_acno: ['', [Validators.pattern(/^\d{9,18}$/)]],
      bank_actype: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      bank_branch: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      bank_ifsc: ['', [Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      bank_name: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      city_id: [],
      email: ['', [Validators.email]],
      gstno: ['', [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      id: [0],
      mobileno: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      panno: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      pin_code: ['', [Validators.pattern(/^[1-9][0-9]{5}$/)]],
      ref_by: [''],
      vendor_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/)]],
      whatsappno: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      tax_type: ['c/s'],
      cgst: [0],
      sgst: [0],
      igst: [0],
      phone_no: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      party_type: [''],
      tds: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
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
      } else if (msg.for == 'createUpdateVendorMaster') {
        if (msg.StatusID === 1) {
          const updated = msg.data[0];  // access the first item in data array

          this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
          this.showForm = false;
          this.form.reset();

          const index = this.data.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.data[index] = { ...updated };
          } else {
            this.data.push(updated)
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.StatusMessage });
        }

      } else if (msg.for === "deleteData") {
        if (msg.StatusMessage === "success") {
          const index = this.data.findIndex((v: any) => v.id == this.tablevalue.id);
          if (index !== -1) {
            this.data.splice(index, 1);
          } 
          this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage })
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Cannot Delete data" })
        }
      }
      return true;
    });
    this.changeTaxType({ value: this.form.get('tax_type')?.value });
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
    this.vendorMasterService.getAllVendor(payload);
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
        this.changeTaxType({ value: event.data.tax_type });
        console.log("edit");
        break;
      case 'delete':
        this.deleteVendor(event.data)
        this.tablevalue=event.data
        break;
      case 'add':
        this.heading = 'ADD VENDOR';
        this.showForm = !this.showForm;
        this.form.reset();

        const defaultTaxType = 'c/s';
        this.form.patchValue({
          tax_type: defaultTaxType
        });
        this.changeTaxType({ value: defaultTaxType });
        console.log("add");
        break
    }
  }


  changeTaxType(event: any) {
    const selectedValue = event?.value;
    console.log(event)
    if (selectedValue === 'i') {
      // IGST selected → disable CGST/SGST
      this.form.patchValue({ cgst: 0, sgst: 0 });
      this.form.get('cgst')?.disable();
      this.form.get('sgst')?.disable();
      this.form.get('igst')?.enable();
    } else {
      // CGST/SGST selected → disable IGST
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


  autoFillNo() {
    const whatsappno = this.form.get("mobileno")?.value;
    this.form.get('whatsappno')?.setValue(whatsappno);
  }


  saveVendor() {
    if (this.form.invalid) {
      this.form.touched
      this.messageService.add({ severity: "warning", summary: "warning", detail: 'Invalid Form Data' })
      return;
    }
    const payload = {
      ...this.form.value,
      city_id: this.form.value.city_id?.Id,
      pin_code: "" + this.form.value.pin_code,
      mobileno: "" + this.form.value.mobileno,
      whatsappno: "" + this.form.value.whatsappno,
      bank_acno: "" + this.form.value.bank_acno,
      phone_no: "" + this.form.value.phone_no,
    }
    this.vendorMasterService.createUpdateVendor(payload)
  }


  private deleteVendor(vendor: any) {
    this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
    const payload = {
      table_name: "vendor_mast",
      column_name: "id",
      column_value: "" + vendor.id,
    }
    this.commonService.deleteData(payload)
  }

}
