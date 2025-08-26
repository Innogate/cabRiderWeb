import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { glMasterService } from '../../../services/glMaster.service';
import { commonService } from '../../../services/comonApi.service';
import { globalRequestHandler } from '../../../utils/global';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { AutoComplete } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { SweetAlertArrayOptions } from 'sweetalert2';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-gl-master',
  imports: [DynamicTableComponent, CommonModule, SidebarModule, ReactiveFormsModule, DropdownModule, InputTextModule, AutoComplete, ButtonModule],
  templateUrl: './gl-master.component.html',
  styleUrl: './gl-master.component.css'
})
export class GlMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = true;
  users: any[] = [];
  showForm = false;
  header: string = "";
  form!: FormGroup;
  Gl: any[] = [];
  filteredGl: any[] = [];
  glList: any[] = [{ Id: 0, GLType: '' }];
  tablevalue: any;
  constructor(
    private glMasterService: glMasterService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commonService: commonService,
    private swal: SweetAlertService,

  ) {
    this.form = this.fb.group({
      id: [null],
      GLName: ['', Validators.required],
      GLType: ['', Validators.required],
  

    });
  }




  async ngOnInit(): Promise<void> {
    this.glMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === "getAllGlList") {
        this.isLoading = false;
        this.users = msg.data;
       
        
      }else if (msg.for == 'getAllGlTypes') {
        this.glList = msg.data;
      }else if (msg.for == 'createGl') {
        if (msg.StatusID === 1) {
          const updated = msg.data;  // access the first item in data array
          this.showForm = false;
          this.form.reset();

          const index = this.users.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.users[index] = { ...updated };
          } else {
            this.users.push(updated)
          }
          this.users = [...this.users];
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.StatusMessage });
        }

      }else if (msg.for === "deleteGl") {
        if (msg.StatusID === 1) {
          const index = this.users.findIndex((v: any) => v.id == msg.data.id);
          if (index !== -1) {
            this.users.splice(index, 1);
          } 
        }
      }else if(msg.for === "updateGl"){
        if (msg.StatusID === 1) {
          const updated = msg.data;
          const index = this.users.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.users[index] = { ...updated };
            this.users= [...this.users];
          }
          this.showForm = false;
          this.form.reset();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.StatusMessage });
        }
      }
      return true;
    });
  }

  ngOnDestroy(): void {
    this.glMasterService.unregisterPageHandler();
    this.commonService.unregisterPageHandler();
  }

  async ngAfterViewInit(): Promise<void> {
    const payload = {
      page: 1,
      pageSize: 100
    };

    this.glMasterService.getAllGlMaster(payload);
  }


  columns = [
    { header: 'ID', field: 'id', icon: 'pi pi-hashtag', styleClass: 'text-gray-600' },
    { header: 'Gl Name', field: 'GLName', icon: 'pi pi-user', styleClass: 'text-blue-600' },
    { header: 'Gl Type', field: 'GLType', icon: 'pi pi-home', styleClass: 'text-green-600' }
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
        this.showForm = true;
        this.header = "UPDATE GL"; 
         this.form.reset();
        this.glMasterService.getAllGlTypes();
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
        this.showForm = true;
        this.header = "ADD GL";
        this.form.reset();
        this.glMasterService.getAllGlTypes();
        break

    }
  }
  filterGl(event: any) {
    const query = event.query.toLowerCase();
    this.filteredGl = this.glList.filter(gl =>
      gl.GLType.toLowerCase().includes(query)
    );
  }
    onSubmit() {
    if (this.form?.valid && this.form?.value.id === null) {
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      this.glMasterService.createGlMaster(this.form.value);
      console.log("value", this.form.value)
    }else if(this.form?.value.id !== null && this.form?.valid){ 
    

          this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      this.glMasterService.updateGlmaster(this.form.value);
    }
  }
  private deleteUser(user: any) {
    const payload = {
      id: user.id
    }
    console.log("deleted id no ",payload)
    this.glMasterService.deleteGlMaster(user.id) 
  } 
   private editUser(user: any) {
    if (user) {
      this.form.patchValue({
        ...user
      })
    }
  }
}
