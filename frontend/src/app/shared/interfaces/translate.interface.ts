export interface TranslateExtendedParams {
    val?: string,
    len?: string,
    min?: string,
    max?: string,
    start?: string,
    end?: string
}

export interface TranslationParams {
    path: string,
    valParams?: TranslateExtendedParams
}