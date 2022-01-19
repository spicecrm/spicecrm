/**
 * @module ModuleGroupware
 */
import {Component, Input} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {metadata} from "../../../services/metadata.service";

/**
 * A groupware container for the tabs and their content.
 * Those include: beans list, search pane, attachment list, linked bean list.
 */
@Component({
    selector: 'groupware-email-archive-pane-item',
    templateUrl: '../templates/groupwareemailarchivepaneitem.html'
})
export class GroupwareEmailArchivePaneItem {

    /**
     * the component config
     */
    @Input() public componentconfig: any = [];


}
