import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { glMasterService } from '../../../services/glMaster.service';
import { commonService } from '../../../services/comonApi.service';
import { globalRequestHandler } from '../../../utils/global';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-gl-master',
  imports: [DynamicTableComponent, CommonModule, SidebarModule, ReactiveFormsModule, DropdownModule, InputTextModule, AutoComplete],
  templateUrl: './gl-master.component.html',
  styleUrl: './gl-master.component.css'
})
export class GlMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = true;
  data: any[] = [];
  showForm = false;
  header: string = "";
  form!: FormGroup;
  Gl: any[] = [];
  filteredGl: any[] = [];
  glList: any[] = [{ Id: 0, GLType: '' }];
  constructor(
    private glMasterService: glMasterService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commonService: commonService,

  ) {
    this.form = this.fb.group({
      id: [],
      GLName: [''],
      GLType: [''],
  

    });
  }




  async ngOnInit(): Promise<void> {
    this.glMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === "getAllGlList") {
        this.data = msg.data
        this.isLoading = false
      }else if (msg.for == 'getAllGlTypes') {
        this.glList = msg.data;
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
      pageSize: 15
    };
    this.glMasterService.getAllGlMaster(payload);
    this.glMasterService.getAllGlTypes();
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
        break;
      case 'delete':
        break;
      case 'add':
        this.showForm = true;
        this.header = "ADD GL";
        break

    }
  }
  filterGl(event: any) {
    const query = event.query.toLowerCase();
    this.filteredGl = this.glList.filter(gl =>
      gl.GLType.toLowerCase().includes(query)
    );
  }
}
