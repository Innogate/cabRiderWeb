import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { globalRequestHandler } from '../../../utils/global';
import { companyMasterService } from '../../../services/companyMaster.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-company-master',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DynamicTableComponent],
  templateUrl: './company-master.component.html',
  styleUrl: './company-master.component.css'
})
export class CompanyMasterComponent implements OnInit, OnDestroy, AfterViewInit {

  showForm: boolean = false;
  isLoading: boolean = true;
  data: any[] = [];
  heading: string = '';
  form!: FormGroup;
  partyname: any[] = [];
  tablevalue: any;
  comonApiService: any;
  companylist: any[] = [];

  constructor(
    private companyMasterService: companyMasterService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private swal: SweetAlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [0],
      active: ['Y'],
      companyName: ['', [Validators.minLength(3), Validators.pattern('^[A-Za-z ]{3,}$')]],
      ShortName: [''],
      companyAddress: [''],
      companyCity: [''],
      companyPhone: ['', [Validators.pattern('^[6-9][0-9]{9}$')]],
      companyEmail: ['', [Validators.email]],
      companyWebsite: [''],
      Tally_CGSTAcName: [''],
      Tally_SGSTAcName: [''],
      Tally_IGSTAcName: [''],
      Tally_RndOffAcName: [''],
      Tally_CarRentPurchaseAc: [''],
      Tally_CarRentSaleAc: [''],
      companyGSTNo: ['', [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      companyPANNo: ['', [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      companyCINNo: ['', [Validators.pattern('^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$')]],
      Udyam: [''],
      HSNCode: ['', [Validators.pattern('^[0-9]{4,8}$')]],
      companyCGST: [''],
      companySGST: [''],
      companyIGST: [''],
      Tally_PurVouchType: [''],
      Tally_SaleVouchType: [''],
      companyBenificaryName: ['', [Validators.minLength(3), Validators.pattern('^[A-Za-z ]{3,}$')]],
      companyBankAccountNo: ['', [Validators.pattern('^[0-9]{9,18}$')]],
      companyBankAddress: [''],
      companyBankName: [''],
      companyBankIFSC: ['', [Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],

    });
  }


  ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 100,
      Search: "",
    };
    this.companyMasterService.getAllCompany(payload);
  }
  ngOnDestroy(): void {
    this.companyMasterService.unregisterPageHandler();
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

      } else if (msg.for == 'deleteCompany') {
        if (msg.StatusID === 1) {
          const index = this.companylist.findIndex((v: any) => v.id == this.tablevalue.id);
          if (index !== -1) {
            this.companylist.splice(index, 1);
          }
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
  async handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        // this.heading = 'UPDATE COMPANY';
        this.form.reset();
        this.editUser(event.data);
        break;
      case 'delete':
        const status = await this.swal.confirmDelete("You want to delete this !");
        if (status) {
          this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
          this.companyMasterService.deleteCompany(event.data.ID);
        }
        break;
      case 'add':
        this.showForm = true;
        this.heading = 'ADD COMPANY';
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
    this.companyMasterService.createUpdateCompany(payload)


  }
  // private deleteUser(user: any) {
  //   const payload = {
  //     id: user.id
  //   }
  //   this.comonApiService.deleteData(payload)
  // }


  private editUser(user: any) {
    if (user) {
      console.log("Editing user:", user);
      this.showForm = true;
      this.heading = 'UPDATE COMPANY';
      this.form.patchValue({
        ...user,
        id: user.ID,
        companyName: user.Name,
        companyAddress: user.Address,
        companyPhone: user.Phone,
        companyEmail: user.Email,
        companyWebsite: user.Website,
        companyCity: user.City,
        ShortName: user.ShortName,
        companyBenificaryName: user.BenificaryName,
        companyBankAddress: user.BankAddress,
        companyBankName: user.BankName,
        companyBankIFSC: user.BankIFSC,
        companyBankAccountNo: user.BankAccountNo,
        companyCINNo: user.CINNo,
        companyPANNo: user.PANNo,
        companyGSTNo: user.GSTNo,
        companyIGST: user.IGST,
        companySGST: user.SGST,
        companyCGST: user.CGST,
      });
    }
  }

}
