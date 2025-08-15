// src/app/core/services/sweet-alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SweetAlertService {
    /** Generic confirm dialog (returns true when confirmed) */
    async confirm(opts: {
        title?: string;
        text?: string;
        confirmButtonText?: string;
        cancelButtonText?: string;
        icon?: SweetAlertIcon;
    } = {}): Promise<boolean> {
        const {
            title = 'Are you sure?',
            text = "You won't be able to revert this!",
            confirmButtonText = 'Yes',
            cancelButtonText = 'Cancel',
            icon = 'warning',
        } = opts;

        const res = await Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            focusCancel: true,
        });
        return res.isConfirmed === true;
    }

    /** Purpose-built delete confirm */
    async confirmDelete(entityLabel: string = 'this item'): Promise<boolean> {
        const res = await Swal.fire({
            title: 'Are you sure?',
            text: `${entityLabel}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // blue confirm button
            cancelButtonColor: '#d33',     // red cancel button
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });
        return res.isConfirmed;
    }


    success(message: string, title = 'Success') {
        return Swal.fire({ title, text: message, icon: 'success' });
    }

    error(message: string, title = 'Error') {
        return Swal.fire({ title, text: message, icon: 'error' });
    }

    info(message: string, title = 'Info') {
        return Swal.fire({ title, text: message, icon: 'info' });
    }

    /** Toast-style notification (top-right) */
    toast(message: string, icon: SweetAlertIcon = 'success', timer = 2500) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer,
            timerProgressBar: true,
        });
        return Toast.fire({ icon, title: message });
    }
}
