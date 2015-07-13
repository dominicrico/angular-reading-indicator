/* License: MIT.
 * Copyright (C) 2015, Dominic Rico-Gomez.
 */

/* global describe, inject, module, beforeEach, it, expect */

'use strict';

describe('module ngReadingIndicator', function () {
  var $rootScope, $compile, $window, $document;

  var text = '<p>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.</p><p>Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.</p><p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero</p>';

  beforeEach(module('ngReadingIndicator'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $window = $injector.get('$window');
    $document = $injector.get('$document');
  }));


  describe('ng-reading-indicator directive', function () {
    it('should show 100% on bottom of page', inject(function ($window, $document) {

      var indicator = angular.element('<ng-reading-indicator></ng-reading-indicator>');
      var el = angular.element('<article><article>' + text + text + text + text + text + text + '</article></article>');

      indicator = $compile(indicator)($rootScope);
      el = $compile(el.contents())($rootScope);
      angular.element($document[0].body).prepend(el);
      angular.element($document[0].body).prepend(indicator);

      $rootScope.$digest();

      var progressWidth = angular.element($document)[0].getElementsByClassName('ng-reading-indicator-progress')[0].style.width;
      window.scrollTo(0, 99999);

      window.setTimeout(function () {
        // size of non-empty block element should be non-zero by default
        expect(window.pageYOffset).not.toBe(0);
        expect(progressWidth).toBe('100%');
      }, 150);
    }));
  });

});
