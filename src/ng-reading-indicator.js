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
          headline: '=?indicatorHeadline',
          lazy: '=?indicatorLazy'
        },
        templateUrl: function (element, attributes) {
          return (attributes.indicatorTemplateUrl || TEMPLATE_URL);
        },
        link: function(scope, element, attributes) {
          var headline = null,
              article = null,
              bottom = null,
              top = null,
              height = null,
              progress = null,
              progressBar = null,
              elem = null,
              expandOffset = null,
              expandOnHeadline = false,
              options = {
                showHeadline: true,
                expand: true,
                type: 'small',
                topOffset: 150,
                readingTime: {
                  enable: true,
                  prefix: 'remaining estimate ',
                  minutesSuffix: 'min',
                  secondsSuffix: 'sec',
                  speed: 150,
                  seconds: true,
                  secondInterval: 5
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
          } else if (!options.expand && options.type !== 'big') {
            angular.element(element).addClass('ng-reading-indicator-shrink');
          }

          elem = (!scope.elementClass || scope.elementClass === '') ? $window : scope.elementClass;
          article = (!scope.elementClass || scope.elementClass === '') ? angular.element(document.body) : angular.element(document.getElementsByClassName(elem.replace('.', ''))[0]);
          progressBar = document.getElementsByClassName('ng-reading-indicator-progress')[0];

          function initizalize() {
            $timeout(function(){
              if (options.expand || (!options.expand && options.type !== 'small')) {
                if (options.showHeadline && scope.headline) {
                  headline = scope.headline;
                } else if (options.showHeadline && !scope.headline && article.find('h1').length > 0) {
                  headline = angular.element(article.find('h1')[0]).html();
                  expandOnHeadline = false;
                } else {
                  headline = false;
                }

                scope.headline = (headline) ? headline : null;
              } else {
                scope.headine = null;
              }

              updateSize();

              angular.element($window).on('scroll', updateProgress);
              angular.element($window).on('resize', updateSize);
            });
          }

          function findEdges(elem) {
            var bodyRect = document.body.getBoundingClientRect(),
                elemRect = elem.getBoundingClientRect();

            return {
              top: (elemRect.top - bodyRect.top),
              bottom: (elem.scrollHeight - window.innerHeight > 0 ) ? elem.scrollHeight - window.innerHeight : elem.scrollHeight,
              height: elemRect.height
            };
          }

          function updateSize() {
            bottom = findEdges(article[0]).bottom;
            top = findEdges(article[0]).top;
            height = findEdges(article[0]).height;
            expandOffset = (expandOnHeadline) ? findEdges(article.find('h1')[0]) : {top: 50};
            updateProgress();
          }

          function updateProgress() {
            var scrollPos = angular.element($window)[0].scrollY || angular.element($window)[0].pageYOffset;

            if (article[0].scrollHeight - window.innerHeight > 0) {
              progress = (scrollPos <= top) ? 0 : ((scrollPos-top) / bottom) * 100;
            } else {
              progress = (scrollPos <= top) ? 0 : (((scrollPos-top)+((top + bottom) - (document.body.offsetHeight - window.innerHeight))) / bottom) * 100;
            }

            if (options.readingTime.enable) {
              scope.$apply( function(){
                scope.readingTime = calculateReadingTime();
              });
            } else {
              scope.readingTime = null;
            }

            progressBar.style.width = progress + '%';
            if ((!options.expand && options.type === 'small' && scrollPos >= (top + expandOffset.top + options.topOffset)) || (options.expand && scrollPos > top && scrollPos < (top + expandOffset.top + options.topOffset))) {
              angular.element(element)[0].style.height = '5px';
              angular.element(element).addClass('ng-reading-indicator-shrink');
              angular.element(element).removeClass('ng-reading-indicator-expanded');
            } else if (((!options.expand && options.type === 'big') || options.expand) && scrollPos >= (top + expandOffset.top + options.topOffset)) {
              angular.element(element).removeClass('ng-reading-indicator-shrink');
              angular.element(element).addClass('ng-reading-indicator-expanded');
              angular.element(element)[0].style.height = '';
            } else {
              angular.element(element)[0].style.height = '0';
              angular.element(element).addClass('ng-reading-indicator-shrink');
              angular.element(element).removeClass('ng-reading-indicator-expanded');
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

            if (Math.floor((minutes <= 9 ? minutes + '0' : minutes) * (1 - (progress/100))) > 0 || !options.readingTime.seconds) {
              estimate += Math.floor((minutes <= 9 ? minutes + '0' : minutes) * (1 - (progress/100)));
              estimate += options.readingTime.minutesSuffix;
            } else if (Math.floor((minutes <= 9 ? minutes + '0' : minutes) * (1 - (progress/100))) === 0 && options.readingTime.seconds) {
              estimate += Math.round((((minutes <= 9 ? minutes + '0' : minutes)*60) * (1 - (progress/100))) / 10) * options.readingTime.secondInterval;
              estimate += options.readingTime.secondsSuffix;
            } else {
              estimate += 0 + options.readingTime.secondsSuffix;
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
