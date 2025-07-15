import { LanguageOptions } from '../../shared/enums/language-options.enum';
import { SnackbarMessageService } from './../../shared/services/snackbar.service';
import { Router } from "@angular/router";
import { MailTranslateService } from '../../shared/services/mail-translate.service';
import { SnackbarOption } from '../../shared/enums/snackbar-options.enum';
import { TranslateService } from '@ngx-translate/core';

export const navigateWithRoute = (route: string | null, router: Router) => {
    if(route === null) {
        return;
    }

    router.navigate([`/${route}`]);
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