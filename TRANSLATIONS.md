## 🗣️ $\textsf{\color{salmon}How does the extended translation work?}$

### Translation workflow including extended service via validation example:

A request is sent validating the attached files. One of the validation functions: `validateFilesMaxNumber(...)` compares the current number of files against the limit (5) and throws the exception "InvalidFilesException" containing the message "support-invalid-max#files!${max}".

<br>

The used characters `!` and `#` represent certain limiters/triggers that are used to control our translation output later on. The interceptor catches the response, maps the data to the translation path and calls the notification service<br>
[see snackbar.service.ts](./frontend/src/app/shared/services/snackbar.service.ts) to display the converted exception data.<br>
Within this service the extended/customized translation service is called to return the correct translation value.<br>
snackbar.title: `validation.backend.headers.InvalidFilesException`<br>
snackbar.text: `validation.backend.data.support-invalid-max#files!5`

```sh
/* snackbar.service.ts */

notify(snackbar: SnackbarMessage) {
    ...
    snackbar.title = this.customTranslate.apply(snackbar.title);
    if(snackbar.text) {
        snackbar.text = this.customTranslate.apply(snackbar.text);
    }
    ...
}
```

<br>

`apply(...)` checks for the fallback case, the simple translation by `ngx-translate instant()` method or the extended translation with certain values to add. Everything within the customized translation logic needs at least the `#` trigger which simplifies the conditional return. In our example path from snackbar.title enters the else-if condition and translates the common way.<br>
The path from snackbar.text skips the conditional block and triggers the extended logic.<br>
path: `validation.backend.data.support-invalid-max#files!5`

```sh
/* custom-translate.service.ts */

apply(path: string, source?: any): string {
    if(path === '' || path.includes('undefined')) {
        return this.getDefaultErrorTranslation();
    } else if(!path.includes('#')) {
        return this.translate.instant(path);
    }

    const params: TranslationParams = this.toTranslationParams(path);
    const result: string = this.mapTranslationParams(params, source);

    return result;
}
```

<br>

The keywords need to be extracted from the paths before they can be mapped to the translations.<br>
Therefore, `toTranslationParams(...)` is called to generate a new object described by interface TranslationParams. The characters `!` and `#` come into action, describing the indices to modify the path and store the substring into our returning sub-object `valParams` described by interface TranslateExtendedParams<br>
[see interfaces](./frontend/src/app/shared/interfaces/translate.interface.ts).
```sh
/* custom-translate.service.ts */

private toTranslationParams(path: string): TranslationParams {
    const params: TranslateExtendedParams = {};
    if(path.includes('!')) {
        const substring = path.substring(path.indexOf('!'), path.length);
        path = path.replace(substring, '');
        params.max = substring.replace('!', '');
    }
    ...
    if(path.includes('#')) {
        const substring = path.substring(path.indexOf('#'), path.length);
        path = path.replace(substring, '');
        params.val = substring.replace('#', '');
    }
    return { path: path, valParams: params };
}
```
returning:
```sh
{
    path: 'validation.backend.data.support-invalid-max',
    valParams: {
        max: '5',
        val: 'files'
    }
}

```

<br>

`getTranslationFromSource(...)` (see last code) converts the path to a property accessing key, traverses the resource (specified source or all translation files joined by [custom-loader](./frontend/public/assets/i18n/custom-translate-loader.ts)) and returns the raw translation:
```sh
/* validation-en.json */

{
    "validation": {
        "backend": {
            "data": {
                ...
                "support-invalid-max": "The length/number for the record \"{{VAL}}\"
                must not exceed {{MAX}} characters/units. Please check your input.",
                ...
            }
        }
    }
}
```

<br>

The converted raw translation by path contains placeholders to be replaced with the filtered values from the original path (varParams). Our example holds values for varParams.val and varParams.max which replace the placeholders in the raw translation, returning:<br>
`The length/number for the record "files" must not exceed 5 characters/units. Please check your input.`
```sh
/* custom-translate.service.ts */

private mapTranslationParams(data: TranslationParams, source?: any): string {
    const lang = this.translate.currentLang;
    const resource = !source ? this.translate.translations[lang] as any : source;
    let result = this.getTranslationFromSource(data.path, resource);

    if(data.valParams && data.valParams.val && result.includes('{{VAL}}')){
        result = result.replace('{{VAL}}', data.valParams.val);
    }
    ...
    if(data.valParams && data.valParams.max && result.includes('{{MAX}}')) {
        result = result.replace('{{MAX}}', data.valParams.max);
    }

    return result ? result : this.getDefaultErrorTranslation();
}
```

<br>

See [custom-translate.service.ts](./frontend/src/app/shared/services/custom-translate.service.ts) for all methods in detail.