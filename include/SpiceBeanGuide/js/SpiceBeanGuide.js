SpiceCRM.SpiceBeanGuide = {
    salesStageDetails: {},
    detailsVisible: true,
    setStageDesctiption: function (_event, _stage) {
        if (this.detailsVisible) {
            if (this.salesStageDetails[_stage]) {
                $('.guidedetailinstructions')[0].innerHTML = this.salesStageDetails[_stage].stage_description;
                $('.guidedetailchecks')[0].innerHTML = this.salesStageDetails[_stage].checkcontent;
            }

            // toggle the active Class
            if (_event) {
                $('.activeStage').toggleClass('activeStage');
                _event.currentTarget.className += ' activeStage';
            }
        }
    },
    toggleDetails: function () {
        if (this.detailsVisible) {
            $('.guidedetail').hide(500);
            $(".guidevizcollapse img").attr("src", "themes/SpiceTheme/images/advanced_search.gif");
        } else {
            $('.guidedetail').show(500);
            $(".guidevizcollapse img").attr("src", "themes/SpiceTheme/images/basic_search.gif");
        }

        this.detailsVisible = !this.detailsVisible;
    }
}