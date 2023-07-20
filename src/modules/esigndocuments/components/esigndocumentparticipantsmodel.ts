/**
 * @module ObjectComponents
 */
import {
    Component, OnDestroy, OnInit,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {Router} from "@angular/router";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";


@Component({
    templateUrl: '../templates/esigndocumentparticipantsmodel.html',
    providers: [view],
})
export class ESignDocumentParticipantsModel extends fieldGeneric implements OnInit, OnDestroy {

    public modalTitle: string;

    /**
     * the list of Envelpoe
     */
    public envelope_id: any = '';

    /**
     * the componentset
     */
    public componentset: string;

    /**
     * the participants to be displayed. Loaded initially and then handled by the field itself
     */
    public participants: any = [];

    /**
     * a boolean indicator that the participants are loading
     */
    public isLoading: boolean = true;

    /**
     * the window itsel .. resp the containing modal container
     */
    public self: any = undefined;


    constructor(
        public language: language,
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public view: view,
        public backend: backend,
        public router: Router
    ) {
        super(model, view, language, metadata, router);
        let componentconfig = this.metadata.getComponentConfig('ESignDocumentParticipantsModel', this.model.module);
        this.componentset = componentconfig.componentset;
    }

    public ngOnInit() {
        this.setModalData()
    }

    /**
     * If there is no modal window title given from outside, use the default title
     * If there is no button text given from outside, use the default text
     * Set the output format in case it is given from outside
     */
    public setModalData() {
        if (!this.modalTitle) this.modalTitle = this.language.getLabel(this.language.getLabel('LBL_PARTICIPANTS'));
        this.isLoading = false
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
