/**
 * @module SystemComponents
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {footer} from "../../services/footer.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'system-label',
    templateUrl: '../templates/systemlabel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLabel implements OnChanges, AfterViewInit, OnDestroy {

    /**
     * the label to be rendered
     */
    @Input() public label: string;

    /**
     * the field
     */
    @Input() public length: 'default' | 'long' | 'short' = 'default';

    /**
     * Array (in the future maybe also an object) of values to be included in the label text.
     */
    @Input() public nestedValues: any;

    /**
     * the subscription on the language
     */
    public subsciptions: Subscription = new Subscription();

    constructor(public language: language,
                public modal: modal,
                public footer: footer,
                public renderer: Renderer2,
                public cdRef: ChangeDetectorRef,
                public sanitizer: DomSanitizer ) {
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
     * open label editor modal
     * @private
     */
    public openModal() {
        this.modal.openModal('SystemLabelEditorModal', true).subscribe(modalRef => {
            modalRef.instance.labelData = {name: this.label, global_translations: [], custom_translations: []};
        });
    }

    /**
     * triggers the change detection when the language is changed
     */
    public detectChanges() {
        this.cdRef.detectChanges();
    }

    /**
     * handle double click
     * @param event
     * @private
     */
    public onDblClick(event: MouseEvent) {
        this.openModal();
        event.preventDefault();
    }

    /**
     * handle right click to edit translations
     * @private
     */
    public onRightClick(event) {
        event.preventDefault();
        const dropdown = this.createDropdown(event);
        this.renderer.appendChild(this.footer.footercontainer.element.nativeElement, dropdown);
        const docClickListener = this.renderer.listen('document', 'click', event => {
            this.closeDropdown(event, dropdown);
            docClickListener();
        });
    }

    /**
     * remove the dropdown from the footer
     * @param event
     * @param dropdown
     * @private
     */
    public closeDropdown(event: MouseEvent, dropdown: HTMLElement) {
        if (this.footer.footercontainer.element.nativeElement.contains(dropdown)) {
            this.renderer.removeChild(this.footer.footercontainer.element.nativeElement, dropdown);
        }
    }

    /**
     * create dropdown
     * @param event
     * @private
     */
    public createDropdown(event: MouseEvent): HTMLElement {
        const dropdown = this.renderer.createElement('div');
        const addClasses = (item, classes) => classes.forEach(itemClass => this.renderer.addClass(item, itemClass));
        this.renderer.setStyle(dropdown, 'top', event.pageY + 'px');
        this.renderer.setStyle(dropdown, 'left', event.pageX + 'px');
        addClasses(dropdown, ['slds-dropdown--inverse', 'slds-dropdown', 'slds-theme--inverse']);
        const ul = this.renderer.createElement('ul');
        this.renderer.addClass(ul, 'slds-dropdown__list');
        const li = this.renderer.createElement('li');
        addClasses(li, ['slds-slds-dropdown__item', 'slds-p-around--xx-small']);

        this.renderer.setProperty(li, 'onclick', () => this.openModal());
        this.renderer.setProperty(li, 'innerHTML', `<a>${this.language.getLabel('LBL_EDIT_LABEL')}</a>`);

        this.renderer.appendChild(ul, li);
        this.renderer.appendChild(dropdown, ul);
        return dropdown;
    }

    /**
     * Gets the label text, using getLabelFormatted() or getLabel(), depending of the existence of nested values.
     */
    getLabel() {
        return this.nestedValues ?
            this.language.getLabelFormatted(this.label, this.nestedValues, this.length ) : this.language.getLabel( this.label, undefined, this.length );
    }

}
