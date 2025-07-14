import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class driverSalarySetupMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GatAllDriverSalary(payload: any) {
    this.call('master.gatAllDriverSalary', payload);
  }

//   CreateUpdateDriver(payload: any){
//     this.post('/master/createUpdateDriver', payload);
//   }

//   Delete(payload: any){
//     this.post('/master/deleteCharges', payload);
//   }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
