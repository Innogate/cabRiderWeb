import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class partyRateMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllPartyRate(payload: any) {
    this.call('master.gatAllPartyRate', payload);
  }

  createUpdatePartyRate(id: number, party_id: number, city_id: number, PartyAddr: string, PinCode: string,
    GSTNo: string, ContactPersonName: string, ContactNo: string, EMailID: string, postJsonData: any
  ) {
    this.call('master.createUpdatePartyRate')
  }



  protected handleMessage(msg: any): boolean {
    return false;
  }
}
