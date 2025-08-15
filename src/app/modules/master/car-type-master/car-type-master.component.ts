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
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../services/sweet-alert.service';


@Component({
  selector: 'app-car-type-master',
  imports: [DynamicTableComponent, DialogModule, ReactiveFormsModule, InputTextModule, ButtonModule, SidebarModule, CommonModule],
  templateUrl: './car-type-master.component.html',
  styleUrls: ['./car-type-master.component.css']
})
export class CarTypeMasterComponent implements OnInit, OnDestroy, AfterViewInit {


  cartypelist: any[] = [];
  showForm: boolean = false;
  form!: FormGroup;
  isLoading: boolean = true;
  heading: string = '';
  tablevalue: any;


  constructor(
    private carTypeMasterService: carTypeMasterService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private swal: SweetAlertService
  ) {
    this.form = this.fb.group({
      id: [],
      car_type: ['', Validators.required],
      index_order: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      sitting_capacity: [0, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(3), Validators.max(100)]],
    });
  }


  async ngOnInit(): Promise<void> {

    this.carTypeMasterService.registerPageHandler((msg) => {
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for == 'CarTypeGate') {
        this.cartypelist = msg.data; // or however your API responds
        this.isLoading = false;
      } else if (msg.for == 'CarTypeAddUpdate') {
        if (msg.StatusID === 1) {
          const updated = msg.data[0];
          this.showForm = false;
          this.form.reset();
          const index = this.cartypelist.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.cartypelist[index] = { ...updated };
          } else {
            this.cartypelist.push(updated)
          }
        }
      } else if (msg.for == 'CarTypeDel') {
        if (msg.StatusID === 1) {
          const index = this.cartypelist.findIndex((v: any) => v.id == this.tablevalue.id);
          if (index !== -1) {
            this.cartypelist.splice(index, 1);
          }
        }
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
    { header: 'Index Order', field: 'index_order', icon: 'pi pi-mars', styleClass: 'text-blue-600' },
  ];


  actions = [
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];

  // Handle search events
  handleSearch(searchTerm: string) {
  }

  // Handle action events
  async handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'view':
        this.viewUser(event.data);
        break;
      case 'edit':
        this.heading = 'UPDATE NEW CAR';
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
        this.heading = 'ADD NEW CAR';
        this.add(event.data);
        this.form.reset();
        break

    }
  }

  onSubmit() {
    if (this.form?.valid) {
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      this.carTypeMasterService.CreateUpdate(this.form.value);
      this.form.reset()
    }
  }

  private viewUser(user: any) {
  }

  private editUser(user: any) {
    if (user) {
      this.showForm = !this.showForm;
      this.form.reset();
      this.form.patchValue({
        ...user
      })
    }
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
