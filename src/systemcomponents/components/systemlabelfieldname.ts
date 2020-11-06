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
    SimpleChanges, HostListener, AfterViewInit
} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'system-label-fieldname',
    templateUrl: './src/systemcomponents/templates/systemlabelfieldname.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLabelFieldname implements OnChanges, AfterViewInit, OnDestroy {

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

    constructor(private language: language,
                private modal: modal,
                private metadata: metadata,
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

    /**
     * handle the double click to open the editor modal
     * @private
     */
    @HostListener('dblclick')
    private onDBClick() {
        if (!this.language.inlineEditEnabled) return;
        this.modal.openModal('SystemLabelEditorModal', true).subscribe(modalRef => {
            const label = this.fieldconfig.label || this.metadata.getFieldlabel(this.module, this.field);
            modalRef.instance.labelData = {name: label, global_translations: [], custom_translations: []};
        });
    }
}
