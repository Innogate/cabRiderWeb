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

  GetAllGuest(payload: any) {
    this.call('master.gatAllGuestMaster', payload);
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
