import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export function globalRequestHandler(msg: any, router: Router, msgService: MessageService): boolean {
  let rt = false;
  if (msg.command === 'goToLogin') {
    router.navigate(['/login']);
    rt = true;
  }
  if (msg.msg && msg.type) {
     msgService.add({ severity: msg.type, summary: (new TitleCasePipe()).transform(msg.type), detail: msg.msg, life: 3000 });
     rt = true;
  }
  return rt;
}


export function decodeJwtPayload(token:string) {
  try {
    // Split the token into its three parts: header, payload, and signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Extract the base64url-encoded payload
    const base64UrlPayload = parts[1];

    // Convert base64url to standard base64
    const base64Payload = base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/');

    // Decode the base64 string using atob()
    const decodedPayload = atob(base64Payload);

    // Parse the JSON string into a JavaScript object
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding JWT payload:", error);
    return null; // Or throw the error for handling upstream
  }
}


export function formatDateDdMmYyyy(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function getRowsPerPageOptions(total: number, step = 10): number[] {
  const options: number[] = [];
  for (let i = step; i < total; i += step) {
    options.push(i);
  }
  options.push(total); // Always include total as last option
  return options;
}

