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

  GatAllPartyRate(payload: any) {
    this.post('/master/gatAllPartyRate', payload);
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
