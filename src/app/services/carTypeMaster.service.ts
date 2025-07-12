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
    this.post('/master/getCarTypes', payload);
  }

  CreateUpdate(payload: any){
    this.post('/master/createCartype', payload);
  }

  DeleteCartype(payload: any){
    console.log("payload", payload)
    this.post('/master/deleteCartype', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
