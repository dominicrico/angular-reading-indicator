/**
 * ngEmoticonApp Module
 *
 * Description
 */
angular.module('ngReadingIndicatorApp', ['ngReadingIndicator'])

  .controller('ngReadingIndicatorCtrl', ['$scope', function ($scope) {
    $scope.myHeadline = 'ngReadingIndicator can show a different Headline!'
  }]);

