import {Component, forwardRef, output, signal, WritableSignal} from '@angular/core';
import {modal} from "../../../services/modal.service";
import {take} from "rxjs/operators";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SpicePageBuilderMediaArticleService} from "../services/spicepagebuildermediaarticle.service";

@Component({
    selector: 'spice-page-builder-input-article',
    templateUrl: '../templates/spicepagebuilderinputarticle.html',
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SpicePageBuilderInputArticle)

    }],
    standalone: false
})
export class SpicePageBuilderInputArticle implements ControlValueAccessor {
    /**
     * list of published articles
     */
    public articles: { value: string; display: string; }[] = [];
    /**
     * holds the id of the article
     */
    public id: WritableSignal<string> = signal(undefined);
    /**
     * angular ngModel emit value function
     * @param {string} val - The new value after the change.
     */
    private onChange: (val: string) => void;
    /**
     * refill event emitter
     */
    public refill$ = output<void>();

    constructor(private modal: modal,
                public articleService: SpicePageBuilderMediaArticleService) {
    }

    public registerOnTouched = () => null;

    /**
     * write the input value to the ngModel
     * @param value
     */
    public writeValue(value: string) {
        this.id.set(value);
    }

    /**
     * register the onChange function to the ngModel
     * @param fn
     */
    public registerOnChange(fn: any) {
        this.onChange = fn;
    }

    /**
     * open select modal to select an article
     */
    public openSelectModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(modalRef => {
            modalRef.instance.module = 'MediaArticles';
            modalRef.instance.multiselect = false;
            modalRef.instance.selectedItems.pipe(take(1)).subscribe((items) => {
                this.id.set(items[0].id);
                this.onChange(this.id());
            });
        });
    }

    /**
     * clear the input value and emit undefined to the ngModel
     */
    public clear() {
        this.id.set(undefined);
        this.onChange(undefined);
    }
}