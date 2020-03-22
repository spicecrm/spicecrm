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
    selector: 'system-label',
    templateUrl: './src/systemcomponents/templates/systemlabel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLabel implements OnChanges, OnDestroy{

    /**
     * teh label to be rendered
     */
    @Input() private label: string;

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