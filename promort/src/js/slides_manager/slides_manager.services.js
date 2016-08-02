(function () {
    'use strict';
    
    angular
        .module('promort.slides_manager.services')
        .factory('QualityControlService', QualityControlService)
        .factory('SimpleViewerService', SimpleViewerService);

    QualityControlService.$inject = ['$http'];

    function QualityControlService($http) {
        var QualityControlService = {
            get: get,
            create: create,
            fetchNotAdequacyReasons: fetchNotAdequacyReasons
        };

        return QualityControlService;

        function get(slide_id) {
            return $http.get('api/slides/' + slide_id + '/quality_control/');
        }
        
        function fetchNotAdequacyReasons() {
            return $http.get('api/utils/slide_not_adequacy_reasons/');
        }

        function create(slide_id, adequacy, not_adequancy_reason) {
            var params = {
                adequate_slide: adequacy
            };
            if (not_adequancy_reason) {
                params.not_adequacy_reason = not_adequancy_reason;
            }
            console.log(params);
            return $http.post('api/slides/' + slide_id + '/quality_control/', params);
        }
    }

    SimpleViewerService.$inject = ['$http'];

    function SimpleViewerService($http) {
        var SimpleViewerService = {
            getOMEBaseURLs: getOMEBaseURLs,
            getSlideInfo: getSlideInfo
        };
        
        return SimpleViewerService;

        function getOMEBaseURLs() {
            return $http.get('api/utils/omeseadragon_base_urls/');
        }

        function getSlideInfo(slide_id) {
            return $http.get('api/slides/' + slide_id + '/');
        }
    }
})();