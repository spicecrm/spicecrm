/**
 * @module ObjectComponents
 */
import {
    Component, OnInit
} from '@angular/core';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * renders a modal with the GDPR Details
 */
@Component({
    templateUrl: './src/objectcomponents/templates/objectgdprmodal.html',
    providers: [view]
})
export class ObjectGDPRModal implements OnInit {

    /**
     * holds the componentconfig to be reetireved on ngInit
     */
    private componentconfig: any = {}

    /**
     * @ignore
     *
     * reference to self to allow destroying itself
     */
    private self: any = {};

    /**
     * the gdpr log as returned from the reference call
     */
    public gdprRelatedLog: any[] = [];

    /**
     * the gdpr log as returned from the reference call
     */
    public gdprAuditLog: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view
    ) {
        this.view.isEditable = false;
    }

    /**
     * loads the componentconfig
     */
    public ngOnInit(): void {
        this.componentconfig = this.metadata.getComponentConfig('ObjectGDPRModal', this.model.module);
    }

    get fieldset() {
        return this.componentconfig.fieldset;
    }

    /**
     * hides the modal
     */
    private hideGDPRLog() {
        this.self.destroy();
    }

    /**
     * consturcts a data object fromt he audit record so the field can be rendered properly
     *
     * @param data the audit data record
     */
    private getModelData(data) {
        let dataObject = {
            module: this.model.module,
            id: this.model.id
        };
        dataObject[data.field_name] = data.value;

        return dataObject;
    }
}
