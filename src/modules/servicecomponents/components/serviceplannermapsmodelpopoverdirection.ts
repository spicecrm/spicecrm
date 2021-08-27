/**
 * @module ServiceComponentsModule
 */
import {ChangeDetectorRef, Component, Renderer2} from '@angular/core';
import {model} from "../../../services/model.service";
import {broadcast} from "../../../services/broadcast.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {language} from "../../../services/language.service";
import {ServicePlannerDirectionResultI, ServicePlannerRoutePointI} from "../interfaces/servicecomponents.interfaces";
import {ServicePlannerService} from "../services/serviceplanner.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";

/** @ignore */
declare var google: any;
/** @ignore */
declare var moment: any;

/**
 * Displays and calculate the direction data for the Service Orders events.
 */
@Component({
    selector: 'service-planner-maps-model-popover-direction',
    templateUrl: './src/modules/servicecomponents/templates/serviceplannermapsmodelpopoverdirection.html'
})
export class ServicePlannerMapsModelPopoverDirection {
    /**
     * holds the duration of the direction
     */
    public directionData: ServicePlannerDirectionResultI;
    /**
     * holds the calculated date start
     */
    public calculatedDateStart: any;
    /**
     * holds the horizontal fieldset to display the model data
     */
    public fieldset: string;
    /**
     * holds the get direction data loading
     */
    public isLoading: boolean = false;
    /**
     * save the unit system for the distance measuring
     */
    private unitSystem: 'IMPERIAL' | 'METRIC' = 'METRIC';
    /**
     * holds the component config
     */
    public componentconfig: any;

    constructor(private model: model,
                private language: language,
                private renderer: Renderer2,
                private broadcast: broadcast,
                private userpreferences: userpreferences,
                private metadata: metadata,
                private cdRef: ChangeDetectorRef,
                private modal: modal,
                private servicePlannerService: ServicePlannerService) {
        this.subscribeToBroadcast();
        this.loadFieldset();
    }

    /**
     * convert distance to string with the unit on measure
     * @param distance
     */
    protected convertDistanceToString(distance: number) {

        if (this.unitSystem == 'IMPERIAL') {
            const feetDistance = distance * 3.2808;
            if (feetDistance > 5280) {
                const roundedMileDistance = Math.pow(+(feetDistance / 5280).toFixed(1), 1);
                return roundedMileDistance + ' mile';
            }
            return Math.round(feetDistance) + ' ft';
        } else if (distance > 1000) {
            const roundedKilometerDistance = Math.pow(+(distance / 1000).toFixed(1), 1);
            return roundedKilometerDistance + ' km';
        }

        return distance + ' m';
    }

    /**
     * subscribe to broadcast message to reset the distance unit system and recenter the map
     */
    private subscribeToBroadcast() {
        this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype !== 'userpreferences.save') return;
            this.unitSystem = this.userpreferences.toUse.distance_unit_system || 'METRIC';
            if (!!this.directionData) {
                this.directionData.distance.text = this.convertDistanceToString(this.directionData.distance.value);
            }
        });
    }

    /**
     * loads the fieldset for the model data
     */
    private loadFieldset() {
        let config = this.metadata.getComponentConfig('SpiceTimeline', 'ServiceOrders');
        if (!config || !config.fieldset) return;
        this.fieldset = config.fieldset;
    }

    /**
     * calculate the direction data
     */
    private calculateRoute() {

        if (!(window as any).google) return;

        this.isLoading = true;

        const directionsService = new google.maps.DirectionsService();

        const origin: ServicePlannerRoutePointI = {
            lat: this.servicePlannerService.timelineSelectedItem.event.data.address_latitude,
            lng: this.servicePlannerService.timelineSelectedItem.event.data.address_longitude
        };
        const destination: ServicePlannerRoutePointI = {
            lat: this.model.data.address_latitude,
            lng: this.model.data.address_longitude
        };

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem[(this.unitSystem || 'METRIC')]
            },
            (response, status) => {
                if (status === 'OK') {
                    this.calculateDirectionData(response.routes);
                } else {
                    window.console.error(this.language.getLabel('MSG_DIRECTION_REQUEST_FAILED'));
                    this.isLoading = false;
                    this.cdRef.detectChanges();
                }
            });
    }

    /**
     * calculate Direction object from direction result
     * @param routes: DirectionResult
     */
    private calculateDirectionData(routes) {
        let distance = {value: 0, text: ''};
        let duration = 0;
        routes.forEach(route => {
            route.legs.forEach(leg => {
                distance.value += leg.distance.value;
                duration += leg.duration.value;
            });
        });

        distance.text = this.convertDistanceToString(distance.value);

        this.directionData = {
            distance, duration: {
                minutes: Math.round(((duration / 3600) - Math.floor(duration / 3600)) * 60),
                hours: Math.floor(duration / 3600)
            }
        };
        this.calculatedDateStart = new moment(this.servicePlannerService.timelineSelectedItem.event.data.date_end)
            .add(moment.duration(this.directionData.duration.minutes + (this.directionData.duration.hours * 60) , 'minutes')).format();
        this.isLoading = false;
        this.cdRef.detectChanges();
    }

    /**
     * plan the Service Order
     * subtract the direction duration from the actual start date
     * open edit modal
     */
    private plan() {
        this.model.startEdit();

        let userFieldPrefix = this.componentconfig && this.componentconfig.planningUserFieldNamePrefix? this.componentconfig.planningUserFieldNamePrefix : undefined;
        if (!userFieldPrefix) {
            const config = this.metadata.getComponentConfig('ServicePlannerMapsModelPopoverDirection', 'ServiceOrders');
            userFieldPrefix = config.planningUserFieldNamePrefix || 'assigned_user';
        }
        this.model.setFields({
            date_start: new moment(this.calculatedDateStart),
            date_end: new moment(this.calculatedDateStart).add(1, 'hours'),
            serviceorder_status: 'planned'
        });

        if (!!this.servicePlannerService.timelineSelectedItem) {
                const fields = {};
                if (userFieldPrefix + '_type' in this.model.data) fields[userFieldPrefix + '_type'] = 'Users';
                if (userFieldPrefix + '_id' in this.model.data) fields[userFieldPrefix + '_id'] = this.servicePlannerService.timelineSelectedItem.record.id;
                if (userFieldPrefix + '_name' in this.model.data) fields[userFieldPrefix + '_name'] = this.servicePlannerService.timelineSelectedItem.record.name;
                this.model.setFields(fields);
        }

        this.modal.closeAllModals();
        this.model.edit();
    }
}
