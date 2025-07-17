import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { partyMasterService } from '../../../services/partyMaster.service';
import { MessageService } from 'primeng/api';
import { globalRequestHandler } from '../../../utils/global';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { commonService } from '../../../services/comonApi.service';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-party-master',
  imports: [DynamicTableComponent, CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
  ],
  templateUrl: './party-master.component.html',
  styleUrl: './party-master.component.css'
})
export class PartyMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  showForm: boolean = false;
  isLoading: boolean = true;
  data: any[] = [];
  form!: FormGroup;
  cities: any[] = [];
  filteredCities: any[] = [];
  cityList: any[] = [{ Id: 0, CityName: '' }];
  tax: boolean = true;
  header: string = '';



  taxTypes: any[] = [
    { label: 'CGST/SGST', value: 'CGST/SGST' },
    { label: 'IGST', value: 'IGST' },
  ]

  rcmOptions: any[] = [
    { label: 'Yes', value: 'Y' },
    { label: 'No', value: 'N' },
  ];

  constructor(
    private partyMasterService: partyMasterService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commonService: commonService
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [0],
      party_name: [''],
      address: [''],
      city_id: [],
      pin_code: [''],
      mobileno: [''],
      whatsappno: [''],
      gstno: [''],
      panno: [''],
      refby: [''],
      active: ['Y'],
      crdays: [0],
      crlimit: [0],
      email: [''],
      CGST: [0],
      SGST: [0],
      IGST: [0],
      phone_no: [''],
      credit_days: [0],
      credit_limit: [0],
      tax_type: ['CGST/SGST'],
      rcm: ['N'],
      cinno: [''],
      msmeno: [''],
      billing_instruction: [''],
      alias: [''],
    });
  }

  ngOnInit(): void {
    this.partyMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === "getAllParty") {
        this.data = msg.data;
        this.isLoading = false;
      } else if (msg.for == 'getAllCityDropdown') {
        this.cityList = msg.data;
      } else if (msg.for == 'createUpdateParty') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
        this.showForm = false;
        this.form.reset();
        console.log("data", msg.data)
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
    this.partyMasterService.unregisterPageHandler();
    this.commonService.unregisterPageHandler();
  }

  ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    };
    this.partyMasterService.GatAllParty(payload);
    this.commonService.GatAllCityDropDown({});
  }

  // Define the columns for the dynamic table
  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Party Name', field: 'party_name', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'Address', field: 'address', icon: 'pi pi-map', styleClass: 'text-green-600' },
    { header: 'City', field: 'CityName', icon: 'pi pi-map-marker', styleClass: 'text-yellow-600' },
    { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-book', styleClass: 'text-indigo-700' },
    { header: 'Mobile No', field: 'mobileno', icon: 'pi pi-phone', styleClass: 'text-yellow-400' },
    { header: 'whatsappno', field: 'whatsappno', icon: 'pi pi-phone', styleClass: 'text-green-700' },
    { header: 'email', field: 'email', icon: 'pi pi-google', styleClass: 'text-indigo-500' },
    { header: 'CGST', field: 'CGST', icon: 'pi pi-check-square', styleClass: 'text-yellow-300' },
    { header: 'IGST', field: 'IGST', icon: 'pi pi-check-circle', styleClass: 'text-indigo-400' },
    { header: 'SGST', field: 'SGST', icon: 'pi pi-money-bill', styleClass: 'text-rose-500' },
  ];

  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];


  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.header = 'UPDATE PARTY'
        this.showForm = true;
        this.form.reset();
        const city = this.cityList.find(city => city.Id == event.data.city_id);
        this.form.patchValue({
          ...event.data,
          city_id: city
        });
        break;
      case 'delete':
        this.deleteParty(event.data);
        break;
      case 'add':
        this.createForm();
        this.changeTaxType({ value: this.form.get('tax_type')?.value });
        this.header = 'ADD PARTY';
        this.showForm = !this.showForm;
        break
    }
  }

  aliasName() {
    const partyName = this.form.get('party_name')?.value || '';
    const alias = this.form.get('alias')?.value || '';
    if (!alias) {
      this.form.get('alias')?.setValue(partyName);
    }
  }


  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  changeTaxType(event: any) {
    const selectedValue = event?.value;
    this.tax = selectedValue === 'IGST';
    if (this.tax) {
      this.form.patchValue({ CGST: 0, SGST: 0 });
      this.form.get('CGST')?.disable();
      this.form.get('SGST')?.disable();
      this.form.get('IGST')?.enable();
    } else {
      this.form.patchValue({ IGST: 0 });
      this.form.get('CGST')?.enable();
      this.form.get('SGST')?.enable();
      this.form.get('IGST')?.disable();
    }
  }

  saveParty() {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.' });
      return;
    }
    const payload = this.form.value;
    payload.city_id = payload.city_id?.Id || 0;
    payload.pin_code = "" + payload.pin_code;
    payload.mobileno = "" + payload.mobileno;
    payload.whatsappno = "" + payload.whatsappno;
    console.log(payload);
    this.partyMasterService.CreateUpdateParty(payload);
  }


  private deleteParty(party: any) {
    this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
    const payload = {
      table_name: "party_mast",
      column_name: "id",
      column_value: "" + party.id,
    }
    this.commonService.deleteData(payload)
  }
}
