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


@Component({
  selector: 'app-charge-list-master',
  imports: [DynamicTableComponent, DialogModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule],
  templateUrl: './charge-list-master.component.html',
  styleUrl: './charge-list-master.component.css'
})
export class ChargeListMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  users: any[] = [];
  showForm: boolean = false;
  form!: FormGroup;
  header: string = ''

  taxableOptions = [
    { label: 'YES', value: 'Y' },
    { label: 'NO', value: 'N' }
  ];


  constructor(
    private chargesListMasterService: chargesListMasterService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
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
      } else if (msg.for == 'chargesAddUpdate') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
      } else if (msg.for == 'chargesDelete') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage })
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
    this.chargesListMasterService.GatAllChargesList(payload);
  }

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Charge Name', field: 'charge_name', icon: 'pi pi-slack' },
    { header: 'Taxable', field: 'taxable', icon: 'pi pi-check-circle', styleClass: 'text-green-600' },
    { header: 'Tally Name', field: 'TallyName', },
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
    // Implement your search logic here
    // Typically you would filter your data array
  }

  // Handle action events
  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'view':
        this.viewUser(event.data);
        break;
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
      console.log(this.form.value);
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      this.chargesListMasterService.CreateUpdate(this.form.value);
      this.form.reset()
    }
  }

  private viewUser(user: any) {
    console.log('Viewing user:', user);
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
      column_value: ""+user.id,
    }
    this.chargesListMasterService.Delete(payload)
  }

  private add(data: any) {
    this.header = 'Add New Charges';
    this.showForm = !this.showForm;
    this.form.reset();
  }
}
