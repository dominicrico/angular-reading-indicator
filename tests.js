/* License: MIT.
 * Copyright (C) 2015, Dominic Rico-Gomez.
 */

/* global describe, inject, module, beforeEach, it, expect */

'use strict';

describe('Testing the ngReadingIndicator', function () {
  var $rootScope, $compile, $scope, elem;

  beforeEach(module('ngReadingIndicator'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    elem = angular.element('<ng-reading-indicator indicator-options="options"></ng-reading-indicator>');

    $scope = $rootScope.$new();
  }));


  describe('directive test', function () {
    it('should show 100% on bottom of page', inject(function () {
      return true;
    }));

    it('shouldn\'t show a headline', inject(function () {

      $scope.options = { showHeadline: false };

      $compile(elem)($scope);
      $scope.$digest();

      expect(elem.find('h2').text()).toBe('');
    }));
    it('should show the headline given by the scope', inject(function () {

      elem.attr('indicator-headline', 'headline');

      $scope.$apply(function(){
        $scope.headline = 'Headline';
      });

      $compile(elem)($scope);
      $scope.$digest();

      expect(elem.find('h2').text()).toBe('Headline');
    }));

    it('should show the first headline of the article', inject(function () {
      return true;
    }));

    it('should be the big reading indicator', inject(function(){
      $scope.options = { expand: false, type: 'big' };

      $compile(elem)($scope);
      $scope.$digest();

      expect(elem.eq(0).hasClass('ng-reading-indicator-expanded')).toBe(true);
      expect(elem.eq(0).hasClass('ng-reading-indicator-shrink')).toBe(false);
    }));

    it('should be the small reading indicator', inject(function(){
      $scope.options = { expand: false, type: 'small' };

      $compile(elem)($scope);
      $scope.$digest();

      expect(elem.eq(0).hasClass('ng-reading-indicator-expanded')).toBe(false);
      expect(elem.eq(0).hasClass('ng-reading-indicator-shrink')).toBe(true);
    }));

  });

});
