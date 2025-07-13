import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class comonApiService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GatAllCityDropDown(payload: any) {
    this.post('/comonapi/gatAllCityDropDown', payload);
  }


   // universal delete
  deleteData(payload: any) {
    this.post('/comonapi/deleteData', payload);
  }


  GatAllDriverDropDown(payload: any) {
    this.post('/comonapi/gatAllDriverDropDown', payload);
  }

    GatAllBranchDropDown(payload: any) {
    this.post('/comonapi/gatAllBranchDropDown', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
