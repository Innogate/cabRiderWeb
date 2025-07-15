import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class userMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllUser(payload: any) {
    this.call('master.getAllUserMaster', payload);
  }


  protected handleMessage(msg: any): boolean {
    return false;
  }
}
