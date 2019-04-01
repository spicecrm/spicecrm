/**
 * @module ModuleAccounts
 */
import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {accountHierarchy} from "../services/accounthierarchy.service";


@Component({
    selector: "account-hierarchy",
    templateUrl: "./src/modules/accounts/templates/accounthierarchy.html",
    providers: [accountHierarchy]
})
export class AccountHierarchy implements OnInit {
    private componentconfig: any = {};
    private fieldsetFields: Array<any> = [];

    private loading: boolean = false;

    constructor(private language: language, private metadata: metadata, private accountHierarchy: accountHierarchy, private model: model) {

    }

    private loadHierarchy() {
        this.accountHierarchy.parentId = this.model.id;
        this.accountHierarchy.requestedFields = this.fieldsetFields;

        return this.accountHierarchy.loadHierachy();
    }

    public ngOnInit() {
        this.fieldsetFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);

        this.loading = true;

        this.loadHierarchy().subscribe(res => {
            this.loading = false;
        });
    }
}