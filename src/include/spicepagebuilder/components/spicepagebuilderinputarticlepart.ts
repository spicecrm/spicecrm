import {Component, forwardRef, input, InputSignal, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../../services/language.service";

@Component({
    selector: 'spice-page-builder-input-article-part',
    templateUrl: '../templates/spicepagebuilderinputarticlepart.html',
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SpicePageBuilderInputArticlePart)
    }],
    standalone: false
})
export class SpicePageBuilderInputArticlePart implements ControlValueAccessor {
    /**
     * holds the disabled value of the input field
     */
    public disabled: InputSignal<boolean> = input();
    /**
     * holds the type of the input field
     */
    public type: InputSignal<'article' | 'media_article_image_size'> = input.required();

    /**
     * holds the internal value
     */
    public value: ModelSignal<string> = model(undefined);

    /**
     * holds the internal value
     */
    public options: WritableSignal<{ value: string, display: string }[]> = signal([]);
    /**
     * angular ngModel emit value function
     * @param {string} val - The new value after the change.
     */
    private onChange: (val: string) => void;

    constructor(private language: language) {
        this.options.set(this.language.getDisplayOptions('media_article_image_sizes', true));
    }

    /**
     * angular ngModel register touched function
     */
    public registerOnTouched = () => null;

    /**
     * register the onChange function to the ngModel
     * @param fn
     */
    public registerOnChange(fn: any) {
        this.onChange = fn;
    }

    /**
     * write the input value to the ngModel
     * @param val
     */
    public writeValue(val: string) {

        if (val) {
            val = val.split('.')[1];
        }

        this.value.set(val);
    }

    /**
     * emit the value to the ngModel
     */
    public emitValue() {

        if (!this.value()) return this.onChange(undefined);
        this.onChange(`${this.type()}.${this.value()}`);
    }
}