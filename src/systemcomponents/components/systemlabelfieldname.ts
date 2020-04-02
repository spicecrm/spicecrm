/**
 * @module SystemComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from '../../services/language.service';

@Component({
    selector: 'system-label-fieldname',
    templateUrl: './src/systemcomponents/templates/systemlabelfieldname.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLabelFieldname implements OnChanges, OnDestroy {

    /**
     * the module
     */
    @Input() private module: string;

    /**
     * the field
     */
    @Input() private field: string;

    /**
     * the field
     */
    @Input() private fieldconfig: any = {};

    /**
     * the field
     */
    @Input() private length: 'default' | 'long' | 'short' = 'default';

    /**
     * the subscription on the language
     */
    private subsciptions: Subscription = new Subscription();

    constructor(private language: language, private cdRef: ChangeDetectorRef) {
        this.subsciptions.add(
            this.language.currentlanguage$.subscribe(() => this.detectChanges())
        );
    }

    /**
     * unsubscribe from the language service when the component is destroyed
     */
    public ngOnDestroy(): void {
        this.subsciptions.unsubscribe();
    }

    /**
     * on changes also trigger the change detection
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.detectChanges();
    }

    /**
     * triggers the change detection when the language is changed
     */
    private detectChanges() {
        this.cdRef.detectChanges();
    }

}