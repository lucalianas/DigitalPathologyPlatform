(function () {
    'use strict';
    
    angular
        .module('promort.slides_manager.controllers')
        .controller('QualityControlController', QualityControlController);

    QualityControlController.$inject = ['$scope', '$routeParams', '$location',
        'SlideService', 'QualityControlService', 'ReviewStepsService'];

    function QualityControlController($scope, $routeParams, $location, SlideService,
                                      QualityControlService, ReviewStepsService) {
        var vm = this;
        vm.slide_id = undefined;
        vm.case_id = undefined;
        vm.stainings = undefined;
        vm.not_adequacy_reasons = undefined;
        vm.checkStainingFormSubmission = checkStainingFormSubmission;
        vm.checkQCFormSubmission = checkQCFormSubmission;
        vm.submitStaining = submitStaining;
        vm.submitQualityControl = submitQualityControl;

        vm.slideStainingSubmitted = false;
        vm.slideStaining = undefined;
        vm.slideQualityControl = {};
        vm.reviewNotes = '';

        activate();

        function activate() {
            vm.slide_id = $routeParams.slide;
            vm.case_id = $routeParams.case;

            SlideService.get(vm.slide_id)
                .then(getSlideSuccessFn, getSlideErrorFn);

            function getSlideSuccessFn(response) {
                if (response.data.quality_control === null) {
                    // initialize not_adequacy_reason
                    QualityControlService.fetchNotAdequacyReasons()
                        .then(fetchNotAdequacyReasonSuccessFn);
                    //noinspection JSAnnotator
                    function fetchNotAdequacyReasonSuccessFn(response) {
                        vm.not_adequacy_reasons = response.data;
                    }
                    //initialize staining
                    SlideService.fetchStainings()
                        .then(fetchStainingSuccessFn);
                    //noinspection JSAnnotator
                    function fetchStainingSuccessFn(response) {
                        vm.stainings = response.data;
                    }
                    if (response.data.staining !== null) {
                        vm.slideStaining = response.data.staining;
                        vm.slideStainingSubmitted = true;
                    }
                } else {
                    if (response.data.quality_control.adequate_slide) {
                        $location.url('worklist/' + vm.case_id + '/' + vm.slide_id + '/rois_manager');
                    } else {
                        $location.url('worklist/' + vm.case_id);
                    }
                }
            }

            function getSlideErrorFn(response) {
                console.error('Cannot load slide info');
                console.error(response);
            }
        }

        function checkStainingFormSubmission() {
            return !(typeof vm.slideStaining === 'undefined');
        }

        function checkQCFormSubmission() {
            if (!vm.slideStainingSubmitted) {
                return false;
            }
            if (vm.slideQualityControl.goodImageQuality &&
                vm.slideQualityControl.goodImageQuality === 'true') {
                return true;
            }
            if (vm.slideQualityControl.goodImageQuality &&
                vm.slideQualityControl.goodImageQuality === 'false' &&
                vm.slideQualityControl.notAdequacyReason) {
                return true;
            }
            return false;
        }

        function submitStaining() {
            SlideService.updateSliceStaining(
                vm.slide_id,
                vm.slideStaining
            ).then(slideStainingUpdateSuccessFn, slideStainingUpdateErrorFn);

            function slideStainingUpdateSuccessFn(response) {
                vm.slideStainingSubmitted = true;
            }

            function slideStainingUpdateErrorFn(response) {
                console.error('Unable to update slide staining');
                console.error(response);
            }
        }

        function submitQualityControl() {
            QualityControlService.create(
                vm.slide_id,
                $.parseJSON(vm.slideQualityControl.goodImageQuality),
                vm.slideQualityControl.notAdequacyReason,
                vm.slideQualityControl.notes
            ).then(qualityControlCreationSuccessFn, qualityControlCreationErrorFn);

            function qualityControlCreationSuccessFn(response) {
                if(vm.slideQualityControl.goodImageQuality === 'true') {
                    $location.url('worklist/' + vm.case_id + '/' + vm.slide_id + '/rois_manager');
                } else {
                    // close the review because image quality is bad
                    ReviewStepsService.closeReviewStep(vm.case_id, 'REVIEW_1',
                        vm.slide_id, 'Slide didn\'t pass quality control phase')
                        .then(closeReviewSuccessFn, closeReviewErrorFn);

                    //noinspection JSAnnotator
                    function closeReviewSuccessFn(response) {
                        // review closed, go back to case worklist
                        $location.url('worklist/' + vm.case_id);
                    }

                    //noinspection JSAnnotator
                    function closeReviewErrorFn(response) {
                        console.error(response.error);
                    }
                }
            }

            function qualityControlCreationErrorFn(response) {
                console.error(response);
            }
        }
    }
})();