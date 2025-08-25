import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class glMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllGlMaster(payload: any) {
    this.call('master.getAllGlMaster', payload);
  }
  //  "page": 1,
  //     "pageSize": 10

  getAllGlTypes() {
    this.call('master.getAllGlTypeDropdown', {});
  }

  createGlMaster(payload: any) {
    this.call('master.createGlMaster', payload);

    //  "GLName": "dgdgg",
    //     "GLType": "dgdfgfd"
  }

  updateGlmaster(payload: any) {
    this.call('master.updateGlMaster', payload);
  }
  deleteGlMaster(id: number){
    this.call('master.deleteGlMaster', {id}); 
  }
  protected handleMessage(msg: any): boolean {
    return false;
  }
}
