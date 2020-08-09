/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'service-docs-signature-content',
    templateUrl: './src/modules/servicecomponents/templates/servicedocsignaturecontent.html',
    providers: [view]
})
export class ServiceDocSignatureContent {

    /**
     * the fieldset
     */
    @Input() public fieldset: any = null;

    /**
     * the parent model
     */
    @Input() public parent: any = {};

    /**
     * email sent
     */
    @Output() public rendertemplate: EventEmitter<string> = new EventEmitter<string>();

    /**
     * inidcates that we are sending
     */
    private sending: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private modal: modal,
        private view: view,
        private session: session
    ) {
    }

    public ngOnInit() {
        this.setViewData();
    }

    /**
     * if it is allowed: go to edit mode
     */
    private setViewData() {
        this.view.setEditMode();
        this.view.isEditable = true;
    }

    /**
     * Save the parent model and reload template
     */
    public saveSignature() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';
            this.parent.save().subscribe(
                success => {

                    modalRef.instance.self.destroy();
                    // emit that the PDF should be rendered new
                    this.rendertemplate.emit();
                },
                error => {
                    modalRef.instance.self.destroy();
                    this.sending = false;
                }
            );
        });
    }
}
