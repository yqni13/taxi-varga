import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    configAPIAddressString(text: string): string {
        return text.replaceAll(' ', '+');
    }

    removeEmptySpacesInString(text: string): string {
        return text.replaceAll(' ', '');
    }

    configPhoneNumber(phone: string): string {
        if(phone[0] === '+' && phone.split('+').length-1 === 1) {
            phone.replace('+', '00');
        }
        phone = phone.replaceAll('+', '');
        phone = phone.replaceAll(' ', '');
        return phone;
    }
}