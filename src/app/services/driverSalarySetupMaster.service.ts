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

  getAllDriverSalary(payload: any) {
    this.call('master.getAllDriverSalary', payload);
  }

  createUpdateDriverSalary(payload: any) {
    this.call('master.createDriverSalarySetup', payload);
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
