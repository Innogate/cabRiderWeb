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

  createUpdateUser(id: number, name: string, mobile: string, email: string, username: string, password: string){
     this.call('master.createUpdateUserMaster', {id, name, mobile, email, username, password});
  }


  protected handleMessage(msg: any): boolean {
    return false;
  }
}
