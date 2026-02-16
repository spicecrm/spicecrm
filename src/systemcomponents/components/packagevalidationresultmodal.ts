import {
    Component,
    ComponentRef,
    effect,
    OnInit,
    signal,
    WritableSignal,
    ChangeDetectionStrategy,
    inject
} from '@angular/core';
import {toast} from "../../services/toast.service";

@Component({
    selector: 'package-validation-result',
    templateUrl: '../templates/packagevalidationresultmodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PackageValidationResultModal implements OnInit {

    public self: ComponentRef<this>;

    /**
     * packages to be displayed. packages with errors
     */
    public erroneousPackages: any[] = [];

    /**
     * package input used for the filter function
     */
    public packageFilter: WritableSignal<string> = signal(null);

    /**
     * error input based on the presented errors, used for the filter function
     */
    public errorFilter: WritableSignal<string> = signal(null);

    /**
     * presented values based on the filter conditions
     */
    public filteredValues: WritableSignal<any> = signal({});

    /**
     * toast service injection
     */
    public toast = inject(toast);

    constructor() {
        effect(() => {
            this.getFilteredValues();
        });
    }

    public ngOnInit() {
        this.getFilteredValues();
    }

    public close() {
        this.self.destroy();
    }

    public getFilteredValues() {
        const pkg = this.packageFilter();
        const err = this.errorFilter();

        const packages: any = this.erroneousPackages || {};
        const grouped: any = {};

        if (pkg == null && err == null) {
            Object.keys(packages).forEach(key => {
                grouped[key] = packages[key] || [];
            });

            this.filteredValues.set(grouped);
            return;
        }

        if (pkg != null && err == null) {
            grouped[pkg] = (packages[pkg] || []);

            this.filteredValues.set(grouped);
            return;
        }

        if (pkg == null && err != null) {
            Object.keys(packages).forEach(key => {
                const filtered = (packages[key] || []).filter(item => item?.error_type == err);
                if (filtered.length) grouped[key] = filtered;
            });

            this.filteredValues.set(grouped);
            return;
        }

        const fromPkg = (packages[pkg] || []);
        const filtered = fromPkg.filter(item => item?.error_type == err);

        if (filtered.length) grouped[pkg] = filtered;

        this.filteredValues.set(grouped);
    }

    public getFilterValues(type: string) {
        const errorTypes = [...new Set(
            Object.values(this.erroneousPackages)
                .flat()
                .map(item => item.error_type)
        )];

        return type == 'package' ? Object.keys(this.erroneousPackages) : errorTypes;
    }

    public getIcon(item) {
        if (item.error_type == 'package dependency mismatch') {
            return 'info'
        }
    }
}