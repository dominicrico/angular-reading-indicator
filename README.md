angular-reading-indicator
===========================

AngularJS directive which shows a progress bar with the current reading progress of a given article or the whole website with a reading time estimate.

Copyright (C) 2015, Dominic Rico-Gomez <hello@coderocket.me>

[![Build Status](https://travis-ci.org/dominicrico/angular-reading-indicator.png?branch=master)](https://travis-ci.org/dominicrico/angular-reading-indicator)
[![Coverage Status](https://coveralls.io/repos/dominicrico/angular-reading-indicator/badge.png)](https://coveralls.io/r/dominicrico/angular-reading-indicator)

Installation
------------

You can choose your preferred method of installation:
* Through bower: `bower install angular-reading-indicator --save`
* Through npm: `npm install angular-reading-indicator --save`
* From a CDN: [jsDelivr](http://www.jsdelivr.com/#!angular.reading-indicator)
* Download from github: [angular-reading-indicator](https://github.com/dominicrico/angular-reading-indicator)

Usage
-----
Include both ng-reading-indicator.min.js and ng-reading-indicator.min.css in your application.

```html
<script src="components/angular-reading-indicator/ng-reading-indicator.min.js"></script>

<link rel="stylesheet" href="components/angular-reading-indicator/ng-reading-indicator.min.css">
```

Add the module `ngReadingIndicator` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['ngReadingIndicator']);
```

### Configuration

Set your prefered options to customize the look of the progress bar and reading estimate.
Available/Default options:

```js
options = {
calcFrom: 'middle', // "top", "bottom", "middle" - From where of the viewport should we calc the process of reading defaults to "middle"
  showHeadline: true, // Show headline in the progress bar (only works if expand is true or type is "big")
  expand: true, // Show small bar and expand to big after passing the headline
  type: 'small', // Type of bar if expand is "false" available options are "small" or "big"
  topOffset: 150, // Offset relative to first headline to expand the progress bar
  readingTime: {
    enable: true, // Show the estimate reading time
    prefix: 'estimate ca. ', // Prefix of estimate
    minutesSuffix: 'min', // suffix for remaining minutes
    secondsSuffix: 'sec', // suffix for remaining seconds
    speed: 150, // Reading speed in words per minute
    seconds: true, // show remaining seconds else shows just 0min
    secondInterval: 5 // steps of remaining seconds
  }
};
```

```html
<ng-reading-indicator indicator-options="options"></ng-reading-indicator>
```

### ngReadingIndicator directive
Use ng-reading-indicator directive to display the reading progress on top of the window:

```html
<ng-reading-indicator></ng-reading-indicator>
<ng-reading-indicator indicator-headline="myHeadline" indicator-element=".myArticle" indicator-options="options"></ng-reading-indicator>
```

If you want to display a different text then the headline use the "indicator-headline"-attribute.

```js
 $scope.myHeadline = 'Lorem Ipsum';
```

```html
<ng-reading-indicator indicator-headline="myHeadline"></ng-reading-indicator>
```

This directive can wait for a scope to load before initializing! Just put in the scope to wait for change and then everything gets build.

```html
<ng-reading-indicator ndicator-lazy="text"></ng-reading-indicator>
```

If you want to use the progress bar just for one special element use the indicator-element-attribute and insert the classname (only the first element with class will be used, will be extendet to id in future release)

```html
<ng-reading-indicator indicator-element=".myArticle"></ng-reading-indicator>
```

You are also able to create your own template and use it via indicator-template-url.
If you want to display the headline just add a {{ headline }} in your template. Do you want to display the reading time estimate  then add {{ readingTime }} inside your template. And last but not least we need an element with the class "ng-reading-indicator-progress" as progress bar.
```html
<ng-reading-indicator indicator-template-url="foo.html"></ng-reading-indicator>
```

License
----

Released under the terms of the [MIT License](LICENSE).
