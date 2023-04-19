/**
 * @module ModuleDeployment
 */
import {Component, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {navigationtab} from "../../../services/navigationtab.service";
import {language} from "../../../services/language.service";
import {DeploymentPackageI} from "../interfaces/deployment.interfaces";

/**
 * released packages cockpit view
 */
@Component({
    selector: 'deployment-system-packages-cockpit-view',
    templateUrl: '../templates/deploymentsystempackagescockpitview.html'
})
export class DeploymentSystemPackagesCockpitView implements OnInit {
    /**
     * package status dom
     */
    public statusConst: { [key: string]: any } = {
        STATUS_CREATED: '0',
        STATUS_IN_PROGRESS: '1',
        STATUS_COMPLETED: '2',
        STATUS_IN_TEST: '3',
        STATUS_DELIVERED: '4',
        STATUS_FETCHED: '5',
        STATUS_DEPLOYED: '6',
        STATUS_RELEASED: '7',
    };
    /**
     * status object to filter the results
     */
    public filterStatus = {
        fetched: true,
        deployed: true,
        released: true
    };
    /**
     * holds is loading boolean
     */
    public isLoading = false;
    /**
     * holds the released packages
     */
    public packages: DeploymentPackageI[] = [];
    /**
     * holds the filtered packages for display
     */
    public filteredPackages: DeploymentPackageI[] = [];
    /**
     * holds the available systems
     */
    public systems = [];
    /**
     * holds the selected system to filter
     */
    public selectedSystem: {id: string, name: string};
    /**
     * filter term to set filtered packages
     */
    public filterTerm: string;

    constructor(private backend: backend,
                private language: language,
                private navigationTab: navigationtab) {
    }

    /**
     * set tab info and load packages
     */
    public ngOnInit() {
        this.navigationTab.setTabInfo({
            displayname: this.language.getLabel('LBL_DEPLOYMENT_COCKPIT'),
            displayicon: 'package'
        });
        this.loadPackages();
    }

    /**
     * load released packages from backend
     */
    public loadPackages() {

        this.isLoading = true;

        this.backend.getRequest('module/SystemDeploymentPackages/released').subscribe(res => {
            this.packages = this.filteredPackages = res.packages;
            this.systems = res.systems;
            this.isLoading = false;
        });
    }

    /**
     * update filtered packages when the filter term changes
     */
    public updateFilteredPackagesTerm(packages?: DeploymentPackageI[]) {

        let furtherUpdate = false;

        if (!packages) {
            furtherUpdate = true;
            packages = this.packages;
        }

        this.filteredPackages = !this.filterTerm ? packages : packages.filter(p => p.name.toLowerCase().includes(this.filterTerm.toLowerCase()));

        if (furtherUpdate) {
            this.updateFilteredPackagesSystem(this.filteredPackages);
            this.updateFilteredPackagesStatusAll(this.filteredPackages);
        }
    }

    /**
     * update filtered packages when the system filter changes
     */
    public updateFilteredPackagesSystem(packages?: DeploymentPackageI[]) {

        let furtherUpdate = false;

        if (!packages) {
            furtherUpdate = true;
            packages = this.packages;
        }

        if (this.selectedSystem) {
            this.filteredPackages = !this.selectedSystem ? packages : packages.filter(p => p.source_system == this.selectedSystem.id);
        }

        if (furtherUpdate) {
            this.updateFilteredPackagesStatusAll(this.filteredPackages);
            this.updateFilteredPackagesTerm(this.filteredPackages);
        }
    }

    /**
     * update filtered packages when the status checkbox changes
     * @param statusFilter
     * @param status
     * @param packages
     */
    public updateFilteredPackagesStatus(statusFilter: string, status: string, packages?: DeploymentPackageI[]) {

        let furtherUpdate = false;

        if (!packages) {
            furtherUpdate = true;
            packages = this.packages;
        }

        this.filteredPackages = packages.filter(p => p.rpstatus != status);

        if (this.filterStatus[statusFilter]) {
            const packagesMatchStatus = this.packages.filter(p => p.rpstatus == status);
            this.filteredPackages = this.filteredPackages.concat(packagesMatchStatus);
        }

        if (furtherUpdate) {
            this.updateFilteredPackagesSystem(this.filteredPackages);
            this.updateFilteredPackagesTerm(this.filteredPackages);
        }
    }

    /**
     * update all filtered packages status
     * @param packages
     * @private
     */
    private updateFilteredPackagesStatusAll(packages?: DeploymentPackageI[]) {

        this.updateFilteredPackagesStatus('released', this.statusConst.STATUS_RELEASED, packages);
        this.updateFilteredPackagesStatus('fetched', this.statusConst.STATUS_FETCHED, packages);
        this.updateFilteredPackagesStatus('deployed', this.statusConst.STATUS_DEPLOYED, packages);
    }
}
