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

  getAllChargesList(payload: any) {
    this.call('master.getAllChargesList', payload);
  }

  createUpdate(payload: any){
    this.call('master.createUpdateChargesMaster', payload);
  }

  Delete(payload: any){
    this.call('master.deleteCharges', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
