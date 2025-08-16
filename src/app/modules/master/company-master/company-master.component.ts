import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { guestMasterService } from '../../../services/guestMaster.service';
import { commonService } from '../../../services/comonApi.service';
import { globalRequestHandler } from '../../../utils/global';
import { companyMasterService } from '../../../services/companyMaster.service';

@Component({
  selector: 'app-company-master',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DynamicTableComponent],
  templateUrl: './company-master.component.html',
  styleUrl: './company-master.component.css'
})
export class CompanyMasterComponent implements OnInit, OnDestroy, AfterViewInit {

  showForm: boolean = false;
  isLoading: boolean = true;
  isEditMode: boolean = false;
  data: any[] = [];
  heading: string = '';
  form!: FormGroup;
  partyname: any[] = [];
  tablevalue: any;
  comonApiService: any;

  constructor(
    private companyMasterService: companyMasterService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder

  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      active: ['Y'],
      Name: ['', [Validators.required,Validators.minLength(3),Validators.pattern('^[A-Za-z ]{3,}$')]],
      ShortName: ['', Validators.required],
      Address: [''],
      City: [''],
      Phone: [''],
      Email: ['', [Validators.email]],
      Website: [''],
      Tally_CGSTAcName: [''],
      Tally_SGSTAcName: [''],
      Tally_IGSTAcName: [''],
      Tally_RndOffAcName: [''],
      Tally_CarRentPurchaseAc: [''],
      Tally_CarRentSaleAc: [''],
      GSTNo: [''],
      PANNo: [''],
      CINNo: [''],
      Udyam: [''],
      HSNCode: [''],
      CGST: [''],
      SGST: [''],
      IGST: [''],
      Tally_PurVouchType: [''],
      Tally_SaleVouchType: [''],
      id: [0],
    });
  }


  ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    };
    this.companyMasterService.getAllCompany(payload);
  }
  ngOnDestroy(): void {
    this.companyMasterService.unregisterPageHandler();
    this.comonApiService.unregisterPageHandler();
  }
  ngOnInit(): void {
    this.companyMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === "getAllCompany") {
        this.isLoading = false
        this.data = msg.data
      } else if (msg.for == 'createUpdateCompany') {
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

      }
      return true;
    });
  }
  // Define the columns for the dynamic table

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Company Name', field: 'Name', icon: 'pi pi-building', styleClass: 'text-red-600' },
    { header: 'Company Address', field: 'Address', icon: 'pi pi-map-marker', styleClass: 'text-green-600' },
    { header: 'Contact No', field: 'Phone', icon: 'pi pi-phone' },
    { header: 'Short Name', field: 'ShortName', icon: 'pi pi-tag', styleClass: 'text-lime-600' },
    { header: 'Email', field: 'Email', icon: 'pi pi-envelope', styleClass: 'text-yellow-600' },
    { header: 'Website', field: 'Website', icon: 'pi pi-globe', styleClass: 'text-green-600' },
    { header: 'City', field: 'City', icon: 'pi pi-map', styleClass: 'text-indigo-700' },
  ];

  actions = [
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];
  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.showForm = true;
        this.isEditMode = true;
        this.heading = 'UPDATE COMPANY';
        console.log("edit");
        const partyname = this.partyname.find(partyname => partyname.Id == event.data.party_name);
        this.form.patchValue({
          ...event.data,
          party_name: partyname
        })
        break;
      case 'delete':
        console.log("delete")
        break;
      case 'add':
        this.showForm = true;
        this.heading = 'ADD COMPANY';
        this.isEditMode = false;
        console.log("add");
        this.form.reset();
        break;
    }
  }
  saveCompany() {
    console.log("form value", this.form.value)
    if (this.form.invalid) {
      this.form.touched
      this.messageService.add({ severity: "warning", summary: "warning", detail: 'Invalid Form Data' });
      return;
    }
    const payload = {
      ...this.form.value,
      
    }
    //  this.guestlistMasterService.createGuest(payload)
   
  }

}
