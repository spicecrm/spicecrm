/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";


@Component({
    selector: 'objectrepositorymanager-add-module',
    templateUrl: '../templates/objectrepositorymanageraddmodule.html',
    styles: [
        ':host  .mce-ico{font-size: 12px; color: #54698d;}',
        ':host  .mce-text{font-size: 12px; color: #54698d;}',
        ':host  .mce-btn button{font-size: 12px; color: #54698d;}',
        ':host  .mce-tinymce{border-radius: 4px}',
        ':host  .mce-widget{font-family: \'Titillium Web\', sans-serif;}'
    ],
    providers: [view]
})
export class ObjectRepositoryManagerAddModule implements OnInit {
    @Output() public closedialog: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public mode: string = 'add';
    @Input() public edit_mode: string = 'custom';
    @Input() public moduleRepo: any = {
        id: "",
        module: "",
        path: "",
        description: "",
        package: "",
        version: "",
        scope: "custom"
    };
    public self;
    public scopes: Array<any> = ["custom", "global"];

    constructor(public backend: backend, public language: language, public modelutilities: modelutilities) {}

    public ngOnInit() {
        if(this.edit_mode == "custom") {
            this.scopes = ["custom"];
        }else {
            this.scopes = ["custom", "global"];
        }
    }
    public closeDialog() {
        this.self.destroy();
    }

    public onModalEscX() {
        this.closeDialog();
    }

    public add() {
        this.closedialog.emit(true);
        this.self.destroy();
    }
    public updateField(desc) {
        this.moduleRepo.description = desc;
    }

    /**
     * sets the version for the obj rep manager modal
     * @param version
     */
    public setVersion(version: {name: string;}) {
        this.moduleRepo.version = version?.name;
    }

    /**
     * sets the package for the obj rep manager modal
     * @param packageData
     */
    public setPackage(packageData: {name: string;}) {
        this.moduleRepo.package = packageData?.name;
    }
}
