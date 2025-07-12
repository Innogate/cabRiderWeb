import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class chargesListMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GatAllChargesList(payload: any) {
    this.post('/master/gatAllChargesList', payload);
  }

  CreateUpdate(payload: any){
    this.post('/master/createUpdateChargesMaster', payload);
  }

  Delete(payload: any){
    this.post('/master/deleteCharges', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
