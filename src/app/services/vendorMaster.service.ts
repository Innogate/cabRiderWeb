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

  getAllVendor(payload: any) {
    this.call('master.gatAllVendorMaster', payload);
  }

  createUpdateVendor(payload: any){
    this.call('master.createUpdateVendor', payload)
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
