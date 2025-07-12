import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebSocketService } from './services/websocket.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    DialogModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private service: WebSocketService) {
    // Just injecting starts connection
  }
  title = 'CabRyder';
  showWsDisconnectedDialog = false;

   ngOnInit(): void {
    this.service.connectionClosed$.subscribe((closed) => {
      this.showWsDisconnectedDialog = closed;
    });
  }


  retryWebSocket(): void {
    this.service.reconnectManually();
  }
}
