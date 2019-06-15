/**
 * @module ModuleDuns
 */
import {Component} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {Observable, Subject} from "rxjs";

@Component({
    selector: "duns-number-modal",
    templateUrl: "./src/include/duns/templates/dunsnumbermodal.html"
})
export class DunsNumberModal {

    public self: any = {};
    public isLoading: boolean = false;
    public componentconfig: any = {};
    public fieldsetFields: any[] = [];
    public results: any[] = [];
    public selectedItem: string;
    public response: Observable<string>;
    public responseSubject: Subject<string>;

    constructor(private language: language, private backend: backend, private metadata: metadata, private model: model) {
        this.responseSubject = new Subject<string>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        let conf = this.metadata.getComponentConfig('DunsNumberModal', this.model.module);
        this.fieldsetFields = this.metadata.getFieldSetFields(conf.fieldset);
    }

    private confirm() {
        this.responseSubject.next(this.selectedItem);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private notFound() {
        this.responseSubject.next('none');
        this.responseSubject.complete();
        this.self.destroy();
    }

    private selectItem(item) {
        this.selectedItem = this.selectedItem == item ? undefined : item;
    }

    private rowClass(item) {
        return this.selectedItem == item ? 'slds-is-selected' : '';
    }

    private cancel() {
        this.responseSubject.next();
        this.responseSubject.complete();
        this.self.destroy();
    }

    private trackByFn(index, item) {
        return index;
    }
}
