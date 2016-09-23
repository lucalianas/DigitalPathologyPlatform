(function () {
    'use strict';

    angular
        .module('promort.viewer.directives')
        .directive('simpleViewer', simpleViewer)
        .directive('annotationsViewer', annotationsViewer);

    function simpleViewer() {
        var directive = {
            replace: true,
            controller: 'SimpleViewerController',
            controllerAs: 'svc',
            restrict: 'E',
            templateUrl: '/static/templates/viewer/simple_viewer.html',
            link: function(scope, element, attrs) {
                function setViewerHeight() {
                    // set viewer's height to maximize page's vertical space
                    var used_v_space = $('#index_navbar').height() + $('#qc_header').height();
                    var $vcont = $('#viewer_container');
                    var bottom_border = parseInt($vcont.css('marginBottom')) +
                            parseInt($vcont.css('marginTop')) +
                            parseInt($vcont.css('paddingTop')) +
                            parseInt($vcont.css('paddingBottom')) + 50;
                    console.log(bottom_border);

                    var available_v_space = $(window).height() - (used_v_space + bottom_border);
                    var $qfc = $('#qc_form_container');
                    if (available_v_space < $qfc.height()) {
                        available_v_space = $qfc.height();
                    }

                    $('#simple_viewer').height(available_v_space);
                }

                setViewerHeight();
                $(window).resize(setViewerHeight);
                $('#goodQuality').click(setViewerHeight);
                $('#badQuality').click(setViewerHeight);

                scope.$on('viewer.controller_initialized', function() {
                    var viewer_config = {
                        'showNavigator': true,
                        'showFullPageControl': false
                    };

                    var ome_seadragon_viewer = new ViewerController(
                        'simple_viewer',
                        scope.svc.getStaticFilesURL(),
                        scope.svc.getDZIURL(),
                        viewer_config
                    );
                    ome_seadragon_viewer.buildViewer();

                    ome_seadragon_viewer.viewer.addHandler('open', function() {
                        ome_seadragon_viewer.setMinDZILevel(8);
                    });

                    var scalebar_config = {
                        'xOffset': 10,
                        'yOffset': 10,
                        'barThickness': 5,
                        'color': '#777',
                        'fontColor': '#000',
                        'backgroundColor': 'rgba(255, 255, 255, 0.5)'
                    };
                    ome_seadragon_viewer.enableScalebar(
                        scope.svc.getSlideMicronsPerPixel(), scalebar_config
                    );
                });
            }
        };
        return directive;
    }

    function annotationsViewer() {
        var directive = {
            replace: true,
            controller: 'AnnotationsViewerController',
            controllerAs: 'avc',
            restrict: 'E',
            templateUrl: '/static/templates/viewer/rois_viewer.html',
            link: function(scope, element, attrs) {
                scope.$on('viewer.controller_initialized', function() {
                    console.log('ome_seadragon viewer with annotations - INITIALIZING');

                    var viewer_config = {
                        'showNavigator': true,
                        'showFullPageContrl': false
                    };
                    var ome_seadragon_viewer = new ViewerController(
                        'viewer',
                        scope.avc.getStaticFilesURL(),
                        scope.avc.getDZIURL(),
                        viewer_config
                    );
                    ome_seadragon_viewer.buildViewer();

                    var annotations_canvas = undefined;

                    ome_seadragon_viewer.viewer.addHandler('open', function() {
                        ome_seadragon_viewer.setMinDZILevel(8);

                        annotations_canvas = new AnnotationsController('rois_canvas');
                        annotations_canvas.buildAnnotationsCanvas(ome_seadragon_viewer);
                        ome_seadragon_viewer.addAnnotationsController(annotations_canvas, true);

                        console.log('Registering components');
                        scope.avc.registerComponents(ome_seadragon_viewer, annotations_canvas);
                    });

                    var scalebar_config = {
                        'xOffset': 10,
                        'yOffset': 10,
                        'barThickness': 5,
                        'color': '#777',
                        'fontColor': '#000',
                        'backgroundColor': 'rgba(255, 255, 255, 0.5)'
                    };
                    ome_seadragon_viewer.enableScalebar(
                        scope.avc.getSlideMicronsPerPixel(), scalebar_config
                    );
                });
            }
        };
        return directive;
    }
})();