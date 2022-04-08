/**
 * @module ModuleGroupware
 */
import {Component, OnInit} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {ObjectPageHeader} from "../../../objectcomponents/components/objectpageheader";
import {view} from "../../../services/view.service";

/**
 * @ignore
 */
declare var _: any;

/**
 * Outlook add-in detail pane showing a list of beans that use the email addresses found in the email.
 * In case there is just one such bean, the details of it will be shown.
 */
@Component({
    selector: 'groupware-detail-pane-header',
    templateUrl: '../templates/groupwaredetailpaneheader.html',
    providers: [view]
})
export class GroupwareDetailPaneHeader extends ObjectPageHeader {

    public ngOnInit() {
        super.ngOnInit();

        // get the Componentconfig if not set yet
        let componentconfig = this.componentconfig && !_.isEmpty(this.componentconfig) ? this.componentconfig : this.metadata.getComponentConfig('GroupwareDetailPaneHeader', this.model.module);

        // set the actionset & fiedset
        if(componentconfig.fieldset){
            this.fieldset = componentconfig.fieldset;
        }
    }
}
