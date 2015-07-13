(function(angular, undefined){
  'use strict';

  var ngReadingIndicator = angular.module('ngReadingIndicator', ['ngSanitize']);

  ngReadingIndicator.directive('ngReadingIndicator', [
    '$window', '$document', '$templateCache', '$sce', '$timeout',
    function($window, $document, $templateCache, $sce, $timeout) {

      var TEMPLATE_URL = '';

      var template ='<div class="ng-reading-indicator-progress"></div><div class="ng-reading-indicator-headline"><h2 ng-bind-html="headline"></h2></div><div class="ng-reading-indicator-time" ng-if="readingTime"> {{ readingTime }}</div>';

      $templateCache.put(TEMPLATE_URL, template);

      return {
        restrict: 'AE',
        scope: {
          elementClass: '@indicatorElement',
          userOptions: '&indicatorOptions',
          headline: '=indicatorHeadline',
          lazy: '=indicatorLazy'
        },
        templateUrl: function (element, attributes) {
          return (attributes.indicatorTemplateUrl || TEMPLATE_URL);
        },
        link: function(scope, element, attributes) {
          var headline = null,
              article = null,
              bottom = null,
              top = null,
              progress = null,
              progressBar = null,
              elem = null,
              expandOn = null,
              options = {
                showHeadline: true,
                expand: true,
                type: 'small',
                topOffset: 150,
                readingTime: {
                  enable: true,
                  prefix: 'estimate ca. ',
                  suffix: 'min',
                  speed: 150,
                  seconds: false
                }
              };

          function extendDeep(dst) {
            angular.forEach(arguments, function (obj) {
              if (obj !== dst) {
                angular.forEach(obj, function (value, key) {
                  if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                    extendDeep(dst[key], value);
                  }
                  else {
                    dst[key] = value;
                  }
                });
              }
            });
            return dst;
          }

          extendDeep(options, scope.userOptions());

          if (!options.expand && options.type !== 'small') {
            angular.element(element).addClass('ng-reading-indicator-expanded');
          }

          elem = (!scope.elementClass || scope.elementClass === '') ? $window : scope.elementClass;
          article = (!scope.elementClass || scope.elementClass === '') ? angular.element(document.body) : angular.element(document.getElementsByClassName(elem.replace('.', ''))[0]);
          progressBar = document.getElementsByClassName('ng-reading-indicator-progress')[0];

          function initizalize() {
            if (options.expand || (!options.expand && options.type !== 'small')) {
              $timeout(function(){
                if (options.showHeadline && scope.headline) {
                  headline = scope.headline;
                } else if (options.showHeadline && !scope.headline && article.find('h1').length > 0) {
                  headline = angular.element(article.find('h1')[0]).html();
                } else {
                  headline = false;
                }

                scope.headline = (headline) ? headline : null;
                scope.readingTime = (options.readingTime.enable) ? calculateReadingTime() : null;

                updateSize();

                angular.element($window).on('scroll', updateProgress);
                angular.element($window).on('resize', updateSize);
              });
            }
          }

          function findEdges(elem) {
            var bodyRect = document.body.getBoundingClientRect(),
                elemRect = elem.getBoundingClientRect();

            return {
              top: (elemRect.top - bodyRect.top),
              bottom: (elem.scrollHeight - window.innerHeight)
            };
          }

          function updateSize() {
            bottom = findEdges(article[0]).bottom;
            top = findEdges(article[0]).top;
            expandOn = (headline) ? findEdges(article.find('h1')[0]) : {top: 50};
            updateProgress();
          }

          function updateProgress() {
            var scrollPos = angular.element($window)[0].scrollY || angular.element($window)[0].pageYOffset;
            progress = (scrollPos <= top) ? 0 : ((scrollPos - top) / bottom) * 100;
            progressBar.style.width = progress + '%';

            if (options.expand) {
              if (scrollPos > top && scrollPos < (expandOn.top + options.topOffset)) {
                angular.element(element)[0].style.height = '5px';
                angular.element(element).addClass('ng-reading-indicator-shrink');
                angular.element(element).removeClass('ng-reading-indicator-expanded');
              } else if (scrollPos >= (expandOn.top + options.topOffset)) {
                angular.element(element).removeClass('ng-reading-indicator-shrink');
                angular.element(element).addClass('ng-reading-indicator-expanded');
                angular.element(element)[0].style.height = '';
              }else {
                angular.element(element)[0].style.height = '0';
              }
            }
          }

          function calculateReadingTime(){
            var wordCount = article.text().split(' ').length;
            var minutes = Math.floor(wordCount / options.readingTime.speed);
            var seconds = Math.floor(wordCount % options.readingTime.speed / (options.readingTime.speed / 60));
            var estimate = 	options.readingTime.prefix;

            if (!options.readingTime.seconds && seconds >= 30) {
              minutes++;
            }

            estimate += (minutes <= 9 ? '0' : '');
            estimate += minutes;

            if (options.readingTime.seconds) {
              estimate += ':';
              estimate += (seconds <= 9 ? '0' : '');
              estimate += seconds;
            } else {
              estimate += options.readingTime.suffix;
            }

            return estimate;
          }

          if (attributes.indicatorLazy && attributes.indicatorLazy !== '') {
            scope.$watch('lazy', function(newVal){
              if (newVal !== '' || newVal.length > 0) {
                initizalize();
              }
            });
          } else {
            initizalize();
          }

          scope.$on('$destroy', function () {
            angular.element($window).off('scroll', updateProgress);
            angular.element($window).off('resize', updateSize);
          });
        }
      };
    }
  ]);

})(window.angular);
