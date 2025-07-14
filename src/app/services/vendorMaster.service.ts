import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class vendorMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GatAllVendor(payload: any) {
    this.call('master.gatAllVendorMaster', payload);
  }

//   CreateUpdateParty(payload: any){
//     this.post('/master/createUpdatePart', payload);
//   }

//   Delete(payload: any){
//     this.post('/master/deleteCharges', payload);
//   }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
