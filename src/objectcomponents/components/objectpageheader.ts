import {
    Component,
    OnInit
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-page-header',
    templateUrl: './src/objectcomponents/templates/objectpageheader.html',
    providers: [view]
})
export class ObjectPageHeader implements OnInit {

    public componentconfig: any = {};
    private actionSet: string = '';
    private fieldset: string = '';
    private fieldsetitems: string = '';

    get moduleName() {
        return this.model.module;
    }

    constructor(private language: language, private router: Router, private model: model, private metadata: metadata) {

    }

    public ngOnInit() {
        // get the Componentconfig if not set yet
        let componentconfig = this.componentconfig && JSON.stringify(this.componentconfig) !== JSON.stringify({}) ? this.componentconfig : this.metadata.getComponentConfig('ObjectPageHeader', this.model.module);

        // set teh actionset & fiedset
        this.actionSet = componentconfig.actionset;
        this.fieldset = componentconfig.fieldset;
        if (this.fieldset) {
            this.fieldsetitems = this.metadata.getFieldSetFields(this.fieldset);
        }
    }

    private goToModule() {
        this.router.navigate(['/module/' + this.moduleName]);
    }

}
