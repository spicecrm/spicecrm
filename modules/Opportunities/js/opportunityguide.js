
SpiceCRM.OpportunityGuide = {
    salesStageDetails: {},
    setStageDesctiption: function(_event, _stage){
        $('.guidedetailinstructions')[0].innerHTML = this.salesStageDetails[_stage].sales_stage_description;
        $('.guidedetailchecks')[0].innerHTML = this.salesStageDetails[_stage].checkcontent;

        // toggle the active Class
        if(_event){
            $('.activeStage').toggleClass('activeStage');
            _event.currentTarget.className += ' activeStage';
        }
    }
}