/**
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

/**
 * renders a summary panel on the service ticket
 */
@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketdetail.html'

})
export class ServiceTicketDetail implements OnInit{

    /**
     * the componentconfig passed in
     */
    public componentconfig: any = {};

    /**
     * the fieldset rendered in the header
     */
    private headerfieldset: string;

    /**
     * the componentset to be used
     */
    private componentset: string;

    constructor(private model: model, private metadata: metadata, private language: language) {

    }

    /**
     * load the config once we are initialized
     */
    public ngOnInit(): void {
        if (!this.componentconfig || (this.componentconfig && _.isEmpty(this.componentconfig))) {
            this.componentconfig = this.metadata.getComponentConfig('ServiceTicketDetail', this.model.module);
        }
        this.componentset = this.componentconfig.componentset;
        this.headerfieldset = this.componentconfig.headerfieldset;
    }
}
