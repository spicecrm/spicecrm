import {Component, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketprolongmodal.html',
})
export class ServiceTicketProlongModal {
    private self: any = {};


    constructor(
        private model: model,
        private metadata: metadata,
        private language: language,
        private backend: backend,
    ) {

    }

    private cancel() {
        this.self.destroy();
    }

    private save() {

        this.self.destroy();
    }

}