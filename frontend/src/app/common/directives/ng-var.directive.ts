import { Directive, inject, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[tavaVar]',
    standalone: true
})
export class VarDirective {

    private readonly templateRef = inject(TemplateRef<any>);
    private readonly vcRef = inject(ViewContainerRef);

    @Input()
    set tavaVar(context: unknown) {
        this.context.$implicit = this.context.tavaVar = context;

        if (!this.hasView) {
            this.vcRef.createEmbeddedView(this.templateRef, this.context);
            this.hasView = true;
        }
    }

    private context: {
        $implicit: unknown;
        tavaVar: unknown;
    } = {
        $implicit: null,
        tavaVar: null,
    };

    private hasView = false;
}