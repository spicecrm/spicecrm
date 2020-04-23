/*view und model providen
fieldset laden mit parent feld
auf model data subscriben
parent type und parent id in das exchange object reinschreiben (extended field)



im xml die neue route im appointment manager pane
nach dem speichern im exchange sollte es ein notification zum spicecrm schicken



checken ob das meeting schon im crm ist -> dann zeigen
wenn nicht einfach das von oben zeigen


wenn es nicht in spice ist aber parent type,id und exchange id dann abspeichern (und dann im hintergrund den rest holen)
*/
import {Component, Input, OnInit} from "@angular/core";

import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'outlook-meeting-edit-container',
    templateUrl: './src/include/outlook/templates/outlookmeetingeditcontainer.html',
    providers: [model, view]
})
export class OutlookMeetingEditContainer implements OnInit {

    /**
     * the custom properties of the object
     */
    @Input() private customProperties: any;

    /**
     * the module of the item
     */
    @Input() private module: string;

    /**
     * the id of the item
     */
    @Input() private id: string;

    /**
     * the componentset
     */
    private componentset: string;

    constructor(
        private metadata: metadata,
        private view: view,
        private model: model
    ) {
    }

    public ngOnInit(): void {

        // load the config
        this.getConfiguration();

        // load the model
        this.loadModel();
    }

    private getConfiguration() {
        let componentconfig = this.metadata.getComponentConfig('OutlookMeetingEditContainer', this.module);
        this.componentset = componentconfig.componentset;
    }


    /**
     * initialöizes and oads the model
     */
    private loadModel() {
        this.model.module = this.module;
        this.model.id = this.id;
        this.model.getData();
    }

}
