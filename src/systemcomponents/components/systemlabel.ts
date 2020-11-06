/**
 * @module SystemComponents
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";

@Component({
    selector: 'system-label',
    templateUrl: './src/systemcomponents/templates/systemlabel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLabel implements OnChanges, AfterViewInit, OnDestroy {

    /**
     * the label to be rendered
     */
    @Input() private label: string;

    /**
     * the field
     */
    @Input() private length: 'default' | 'long' | 'short' = 'default';

    /**
     * the subscription on the language
     */
    private subsciptions: Subscription = new Subscription();

    constructor(private language: language,
                private modal: modal,
                private cdRef: ChangeDetectorRef) {
        this.subsciptions.add(
            this.language.currentlanguage$.subscribe(() => this.detectChanges())
        );
    }

    /**
     * detach from changes detections to handle it manually
     */
    public ngAfterViewInit() {
        this.cdRef.detach();
    }

    /**
     * unsubscribe from the language service when the component is destroyed
     * reattach the component to change detection to inform the system when the component is destroyed
     */
    public ngOnDestroy(): void {
        this.cdRef.reattach();
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

    /**
     * handle the double click to open the editor modal
     * @private
     */
    @HostListener('dblclick')
    private onDBClick() {
        if (!this.language.inlineEditEnabled) return;
        this.modal.openModal('SystemLabelEditorModal', true).subscribe(modalRef => {
            modalRef.instance.labelData = {name: this.label, global_translations: [], custom_translations: []};
        });
    }
}
