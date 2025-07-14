import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { vendorMasterService } from '../../../services/vendorMaster.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { globalRequestHandler } from '../../../utils/global';

@Component({
  selector: 'app-vendor-master',
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './vendor-master.component.html',
  styleUrl: './vendor-master.component.css'
})
export class VendorMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean = true;
  data: any[] = [];

  constructor(
    private vendorMasterService:vendorMasterService,
    private router:Router,
    private messageService:MessageService
  ){}
    ngOnInit(): void {
      this.vendorMasterService.registerPageHandler((msg) => {
        console.log(msg);
        globalRequestHandler(msg, this.router, this.messageService);
        if (msg.for === "getallvendor"){
          this.data=msg.data
          this.isLoading=false
        }
        return true;
      });
    }
  
  
    ngOnDestroy(): void {

    }
  
    ngAfterViewInit(): void {
      const payload = {
        id: 0,
        PageNo: 1,
        PageSize: 1000,
        Search: "",
      };
      this.vendorMasterService.GatAllVendor(payload)
    }

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Vendor Name', field: 'vendor_name', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'Address', field: 'address', icon: 'pi pi-map', styleClass: 'text-green-600' },
    { header: 'City', field: 'CityName', icon: 'pi pi-map-marker', styleClass: 'text-yellow-600' },
    { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-map-marker', styleClass: 'text-sky-500' },
    { header: 'Mobile No', field: 'mobileno', icon: 'pi pi-phone', styleClass: 'text-red-600' },
    { header: 'WhatsApp No', field: 'whatsappno', icon: 'pi pi-whatsapp', styleClass: 'text-green-600' },
    { header: 'GST No', field: 'gstno', icon: 'pi pi-money-bill', styleClass: 'text-blue-800' },
    { header: 'PAN No', field: 'panno', icon: 'pi pi-wallet', styleClass: 'text-violet-800' },
    { header: 'Bank Name', field: 'bank_name', icon: 'pi pi-building-columns', styleClass: 'text-amber-900' },
    { header: 'Bank Branch', field: 'bank_branch', icon: 'pi pi-building', styleClass: 'text-amber-900' },
    { header: 'Bank Account No', field: 'bank_acno', icon: 'pi pi-id-card', styleClass: 'text-sky-600' },
    { header: 'Bank Account Type', field: 'bank_actype', icon: 'pi pi-credit-card', styleClass: 'text-rose-800' },
    // { header: 'Driver Licenseno', field: 'drv_licenseno', icon: 'pi pi-slack' },
  ];

  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];


  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        console.log("edit");
        break;
      case 'delete':
        console.log("delete");
        break;
      case 'add':
        console.log("add");
        break
    }
  }
}
