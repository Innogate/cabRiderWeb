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
import { SidebarModule } from 'primeng/sidebar';


@Component({
  selector: 'app-car-type-master',
  imports: [DynamicTableComponent, DialogModule, ReactiveFormsModule, InputTextModule, ButtonModule, SidebarModule],
  templateUrl: './car-type-master.component.html',
  styleUrls: ['./car-type-master.component.css']
})
export class CarTypeMasterComponent implements OnInit, OnDestroy, AfterViewInit {


  users: any[] = [];
  showForm: boolean = false;
  form!: FormGroup;
  isLoading: boolean = true;

  constructor(
    private carTypeMasterService: carTypeMasterService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [],
      car_type: ['', Validators.required],
      index_order: [0, [Validators.required]],
      sitting_capacity: [0, Validators.required]
    });
  }


  async ngOnInit(): Promise<void> {

    this.carTypeMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for == 'CarTypeGate') {
        this.users = msg.data; // or however your API responds
        this.isLoading = false;
      } else if (msg.for == 'CarTypeAddUpdate') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
        this.showForm = false;
      } else if(msg.for == 'CarTypeDel'){
        this.messageService.add({severity: 'success', summary: 'Success', detail: msg.StatusMessage})
      }
      return true;
    });
  }

  ngOnDestroy(): void {
    this.carTypeMasterService.unregisterPageHandler();
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
    this.carTypeMasterService.GateAllCarType(payload);
  }

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Car Type', field: 'car_type', icon: 'pi pi-car', styleClass: 'text-red-600' },
    { header: 'Sitting Capacity', field: 'sitting_capacity', icon: 'pi pi-check-circle', styleClass: 'text-green-600' },
    { header: 'Index Order', field: 'index_order', icon: 'pi pi-index', styleClass: 'text-blue-600' },
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
      this.carTypeMasterService.CreateUpdate(this.form.value);
      this.form.reset()
    }
  }

  private viewUser(user: any) {
    console.log('Viewing user:', user);
    // Implement view logic
  }

  private editUser(user: any) {
    if (user) {
      this.showForm = !this.showForm;
      this.form.patchValue({
        ...user
      })
    }
    // Implement edit logic
  }

  private deleteUser(user: any) {
    const payload = {
      id: user.id
    }
    this.carTypeMasterService.DeleteCartype(payload)
  }

  private add(data: any) {
    this.showForm = !this.showForm;
    this.form.reset();
  }
}
