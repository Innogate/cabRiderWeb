import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class guestMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllGuest(payload: any) {
    this.call('master.gatAllGuestMaster', payload);
  }

  createGuest(payload: any){
    this.call('master.createGuestMaster', payload);
  }

//   Delete(payload: any){
//     this.post('/master/deleteCharges', payload);
//   }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
