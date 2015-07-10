module.exports = function(grunt) {
  'use strict';
  // ngReadingIndicator grunt configuration.
  grunt.initConfig({

    // LESS compile task configuration.
    less: {
      option: {
        compress: true,
        yuicompress: true,
      },
      ngReadingIndicator: {
        files: {
          'src/ng-reading-indicator.css': 'src/ng-reading-indicator.less'
        }
      }
    },

    // Autoprefixer compile task configuration.
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      ngReadingIndicator: {
        src: ['src/ng-reading-indicator.css']
      }
    },

    // CSSmin task configuration.
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['*.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/ng-reading-indicator.js',
        'tests.js'
      ]
    },

    // Uglify task configuration.
    uglify: {
      options: {
        sourceMap: true
      },
      ngReadingIndicator: {
        files: {
          'dist/ng-reading-indicator.min.js': ['src/ng-reading-indicator.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('build', ['less', 'autoprefixer', 'cssmin', 'uglify']);
  grunt.registerTask('test', ['jshint']);

};
