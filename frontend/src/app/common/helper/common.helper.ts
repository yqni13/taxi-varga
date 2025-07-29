import { LanguageOptions } from '../../shared/enums/language-options.enum';
import { SnackbarMessageService } from './../../shared/services/snackbar.service';
import { Router } from "@angular/router";
import { MailTranslateService } from '../../shared/services/mail-translate.service';
import { SnackbarOption } from '../../shared/enums/snackbar-options.enum';
import { TranslateService } from '@ngx-translate/core';

export const isObjEmpty = (obj: Object): boolean => {
    for(var prop in obj) {
        if(Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

export const navigateWithRoute = (route: string | null, router: Router) => {
    if(route === null) {
        return;
    }

    router.navigate([`/${route}`]);
}

export const checkAddressInViennaByZipCode = (zipCode: string): boolean => {
    const postalCodesVienna = ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190', '1200', '1210', '1220', '1230'];

    return postalCodesVienna.includes(zipCode);
}

export const isQuickOriginValid = (zipCode: string): boolean => {
    return zipCode !== '2544' && !checkAddressInViennaByZipCode(zipCode) ? false : true;
}

/**
 * @param {string} title translation path for title 
 * @param {string} text translation path for text
 */
export const displayInfo = (snackbar: SnackbarMessageService, mailTranslate: MailTranslateService, translate: TranslateService, title: string, text?: string) => {
    snackbar.notify({
        title: translate.currentLang === LanguageOptions.EN
            ? mailTranslate.getTranslationEN(title)
            : mailTranslate.getTranslationDE(title),
        text: translate.currentLang === LanguageOptions.EN
            ? mailTranslate.getTranslationEN(text ?? '')
            : mailTranslate.getTranslationDE(text ?? ''),
        autoClose: false,
        type: SnackbarOption.INFO
    })
}
