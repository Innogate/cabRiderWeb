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
import { chargesListMasterService } from '../../../services/chargesListMaster.service';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-charge-list-master',
  imports: [DynamicTableComponent, DialogModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, SidebarModule, CommonModule],
  templateUrl: './charge-list-master.component.html',
  styleUrl: './charge-list-master.component.css'
})
export class ChargeListMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  users: any[] = [];
  showForm: boolean = false;
  form!: FormGroup;
  header: string = ''
  isLoading: boolean = true;
  tablevalue: any;

  taxableOptions = [
    { label: 'YES', value: 'Y' },
    { label: 'NO', value: 'N' }
  ];


  constructor(
    private chargesListMasterService: chargesListMasterService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private swal: SweetAlertService
  ) {
    this.form = this.fb.group({
      id: [],
      charge_name: ['', Validators.required],
      taxable: ['', [Validators.required]],
      TallyName: ['', Validators.required]
    });
  }




  async ngOnInit(): Promise<void> {

    this.chargesListMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for == 'gatAllCharges') {
        this.users = msg.data; // or however your API responds
        this.isLoading = false;
      } else if (msg.for == 'chargesAddUpdate') {
        if (msg.StatusID === 1) {
          const updated = msg.data[0];  // access the first item in data array
          this.showForm = false;
          this.form.reset();

          const index = this.users.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.users[index] = { ...updated };
          } else {
            this.users.push(updated)
          }
        } 
      } else if (msg.for == 'chargesDelete') {
        if (msg.StatusMessage === "success") {
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
    this.chargesListMasterService.unregisterPageHandler();
  }

  async ngAfterViewInit(): Promise<void> {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
      SortColumn: "1",
      SortOrder: "ASC"
    };
    this.chargesListMasterService.getAllChargesList(payload);
  }

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Charge Name', field: 'charge_name', icon: 'pi pi-briefcase', styleClass: 'text-red-900' },
    { header: 'Taxable', field: 'taxable', icon: 'pi pi-check-circle', styleClass: 'text-green-600' },
    { header: 'Tally Name', field: 'TallyName', icon: 'pi pi-tag', styleClass: 'text-purple-600' },
  ];




  // Action buttons configuration
  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];

  // Handle search events
  handleSearch(searchTerm: string) {
    console.log('Searching for:', searchTerm);
  }

  // Handle action events
  async handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'view':
        this.viewUser(event.data);
        break;
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
      console.log(this.form.value);
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      this.chargesListMasterService.createUpdate(this.form.value);
      this.form.reset()
    }
  }

  private viewUser(user: any) {
  }

  private editUser(user: any) {
    if (user) {
      this.header = 'Update Charges'
      this.showForm = !this.showForm;
      this.form.patchValue({
        ...user
      })
    }
  }

  private deleteUser(user: any) {
    const payload = {
      table_name: "charges_mast",
      column_name: "id",
      column_value: "" + user.id,
    }
    this.chargesListMasterService.Delete(payload)
  }

  private add(data: any) {
    this.header = 'Add New Charges';
    this.showForm = !this.showForm;
    this.form.reset();
  }
}
