import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  login(payload: any) {
    this.post('/user/login', payload);
  }

  logout() {
    this.post('/user/logout', {});
    localStorage.clear();
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
