import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class carTypeMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GateAllCarType(payload: any) {
    this.call('master.getCarTypes', payload);
  }

  CreateUpdate(payload: any){
    this.call('master.createCartype', payload);
  }

  DeleteCartype(payload: any){
    console.log("payload", payload)
    this.call('master.deleteCartype', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
