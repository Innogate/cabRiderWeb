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

  createGuest(id: any, PartyID: any, GuestName: string, AddrType: string, Addrr: string, ContactNo: string, WhatsappNo: string, Email_ID: string, Honorific: string){
    this.call('master.createGuestMaster', {id, PartyID, GuestName, AddrType, Addrr, ContactNo, WhatsappNo, Email_ID, Honorific});
  }

//   Delete(payload: any){
//     this.post('/master/deleteCharges', payload);
//   }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
