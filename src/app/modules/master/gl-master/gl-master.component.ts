import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { glMasterService } from '../../../services/glMaster.service';
import { commonService } from '../../../services/comonApi.service';
import { globalRequestHandler } from '../../../utils/global';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-gl-master',
  imports: [DynamicTableComponent,CommonModule, SidebarModule],
  templateUrl: './gl-master.component.html',
  styleUrl: './gl-master.component.css'
})
export class GlMasterComponent implements OnInit, OnDestroy, AfterViewInit {
isLoading = true;
data: any[]=[];
showForm: boolean = false;
form!: FormGroup;
  constructor(
    private glMasterService: glMasterService,
        private router: Router,
        private messageService: MessageService,
        private fb: FormBuilder,
        private commonService: commonService,
    
  ){
    this.form = this.fb.group({
      id: [],
      
    });
  }




  async ngOnInit(): Promise<void> {
    this.glMasterService.registerPageHandler((msg) => {
          console.log(msg);
          globalRequestHandler(msg, this.router, this.messageService);
          if (msg.for === "getAllGlMaster") {
            this.data = msg.data
            this.isLoading = false
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
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    };
    this.glMasterService.getAllGlMaster(payload);
  }


  columns = [
    { header: 'ID', field: 'id', icon: 'pi pi-hashtag', styleClass: 'text-gray-600' },
    // { header: 'Driver Name', field: 'drv_name', icon: 'pi pi-user', styleClass: 'text-blue-600' },
    // { header: 'Address', field: 'address', icon: 'pi pi-home', styleClass: 'text-green-600' },
    // { header: 'City', field: 'CityName', icon: 'pi pi-map-marker', styleClass: 'text-orange-500' },
    // { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-envelope', styleClass: 'text-purple-500' },
    // { header: 'Mobile No', field: 'mobileno', icon: 'pi pi-phone', styleClass: 'text-teal-500' },
    // { header: 'Driver Licenseno', field: 'drv_licenseno', icon: 'pi pi-id-card', styleClass: 'text-indigo-500' },
    // { header: 'Bank Name', field: 'bank_name', icon: 'pi pi-building', styleClass: 'text-pink-500' },
    // { header: 'Bank Branch', field: 'bank_branch', icon: 'pi pi-briefcase', styleClass: 'text-yellow-600' },
    // { header: 'Bank Account No', field: 'bank_acno', icon: 'pi pi-credit-card', styleClass: 'text-red-500' },
    // { header: 'Bank Account Type', field: 'bank_actype', icon: 'pi pi-wallet', styleClass: 'text-emerald-500' },
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
        break;
      case 'delete':
        break;
      case 'add':
        break

    }
  }
}
