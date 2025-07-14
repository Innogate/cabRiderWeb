import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class driverMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GatAllDriver(payload: any) {
    this.call('master.gatAllDriver', payload);
  }

  CreateUpdateDriver(payload: any){
    this.call('master.createUpdateDriver', payload);
  }

//   Delete(payload: any){
//     this.post('/master/deleteCharges', payload);
//   }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
