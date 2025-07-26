import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { partyRateMasterService } from '../../../services/partyRateMaster.service';
import { globalRequestHandler } from '../../../utils/global';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-party-rate-master',
  imports: [DynamicTableComponent, CommonModule, RouterModule, ButtonModule, AvatarModule],
  templateUrl: './party-rate-master.component.html',
  styleUrl: './party-rate-master.component.css'
})
export class PartyRateMasterComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading: boolean = false;
  data: any[] = [];

  constructor(
    private partyRateMasterService: partyRateMasterService,
    private router: Router,
    private messageService: MessageService
  ) {

  }

 columns = [
    { header: 'ID', field: 'id' },
    { header: 'Party Name', field: 'party_name', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'City Name', field: 'cityname', icon: 'pi pi-map-marker', styleClass: 'text-green-600' },
  ];



  ngOnInit(): void {
    this.partyRateMasterService.registerPageHandler((msg: any) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === 'getallpartyrate') {
        this.data = msg.data;
        this.isLoading = false;
      }
      return true;
    });

  }
  ngOnDestroy(): void {
    this.partyRateMasterService.unregisterPageHandler();
  }

  ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    }
    this.partyRateMasterService.getAllPartyRate(payload);
  }





  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];


  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        // this.editUser(event.data);
        break;
      case 'delete':
        // this.deleteUser(event.data);
        break;
      case 'add':
        // this.add(event.data);
        break

    }
  }

}
