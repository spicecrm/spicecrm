import {Directive} from '@angular/core';
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {ActionSetItemI} from "./objectcomponents.interfaces";

@Directive({standalone: false})
export abstract class ObjectActionSetItemBase implements ActionSetItemI {
    /**
     * acl action to be checked for setting disabled
     */
    public aclAction: 'list' | 'listrelated' | 'view' | 'delete' | 'edit' | 'create' | 'export' | 'import' | string = 'edit';
    /**
     * acl action scope to be checked for setting disabled
     */
    public aclActionScope: 'model' | 'module' = 'model';
    /**
     * hidden flag
     */
    public hidden: boolean = false;

    constructor(protected metadata: metadata,
                          protected model: model) {
    }

    /**
     * @return the disabled flag based on the acl action
     */
    get disabled(): boolean {
        const modelGranted = this.aclActionScope == 'model' && this.model.checkAccess(this.aclAction);
        const moduleGranted = this.aclActionScope == 'module' && this.metadata.checkModuleAcl(this.model.module, this.aclAction);
        return !modelGranted && !moduleGranted;
    }

    /**
     * execute the action
     */
    public execute(): void {
        throw new Error('Method not implemented.');
    }
}