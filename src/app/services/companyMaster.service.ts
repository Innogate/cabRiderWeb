import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class companyMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllCompany(payload: any) {
    this.call('master.getAllCompanyMaster', payload);
  }

//   CreateUpdateDriver(payload: any){
//     this.call('master.createUpdateDriver', payload);
//   }

//   Delete(payload: any){
//     this.post('/master/deleteCharges', payload);
//   }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
