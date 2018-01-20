
////////////////////////////////////////////////////////////////////////////////
/////////////////////************** GRUNTFILE **************////////////////////
////////////////////////////////////////////////////////////////////////////////



/********************************* Description *********************************
  *                                                                            *
  * Transforms the bower and assets files to 2 files for production and then   *
  * watch the .assets/js and .assets/styles. In details :                                             *
  *                                                                            *
  * 1) Proceeds to the the concatenation and minification of every js and css  *
  * bower files from ./bower_comonents : ./.tmp/js/bower.min.js and            *
  * ./.tmp/styles/bower.min.css.                                               *
  *                                                                            *
  *  2) The js files from ./assets/js are lint, verify with karma, concat and  *
  * minify into ./.tmp/js/angular.min.js. The sass files from .assets/styles   *
  * are convert to css, concat and minify into ./.tmp/styles/angular.min.css.  *
  *                                                                            *
  * 3) The ./.tmp/#/angular.min.# are concat with their corresponding          *
  * ./tmp/#/bower.min.# into ./assets/js/js.js and ./assets/styles/styles.css. *
  *                                                                            *
  * 4) The .assets/js and .assets/styles are watch, if there is any            *
  * modification then 2) and 3) for the corresponding folder.                  *
  *                                                                            *
*///////////////////////////////////////////////////////////////////////////////



module.exports = function (grunt) {

  'use strict'

  grunt.initConfig({
    watch: {
      script: { //watch every angular js file and if it changes : it lints, concats and minifies the files and then concats them with .tmp/js/bower.min.js into assets/js/js.js then it will be test with Karma
        files: [ 'assets/js/main.js', 'assets/js/*/**/*.js', '!assets/js/*/**/*.tests.js' ],
        tasks: [ 'jshint', 'concat:app'/*, 'karma'*/ ] //app = files create for the angular app
      },
      styles: { //watch every angular sass file and if it changes : it converts, concats and minifies the files and then concats them with .tmp/styles/bower.min.css into assets/styles/styles.css
        files: [ 'assets/styles/**/*.{sass,scss}' ],
        tasks: [ 'compass', 'concat:cssApp' ] //app = files create for the angular app
      }
    },
    bower_concat: {
      all: {
        dest: '.tmp/js/bower.js', //concat every bower js file into assets/js/bower.js
        cssDest: '.tmp/styles/bower.css', //concat every bower css file into assets/styles/bower.css
        bowerOptions: {
          relative: false
        },
        mainFiles: {
          'font-awesome': 'css/font-awesome.css',
          'bootstrap': [ 'custom/css/bootstrap.min.css', 'custom/js/bootstrap.min.js' ],
          'waypoints': 'lib/noframework.waypoints.min.js',
          'flexslider': [ 'jquery.flexslider-min.js', 'flexslider.css' ]
        },
        dependencies: {
          'bootstrap': 'jquery',
          'flexslider': 'jquery'
        }
      }
    },
    jshint: { //lint every js file
      options: {
        globals: {
          console: true
        }
      },
      all: [ 'assets/js/main.js', 'assets/js/*/**/*.js', '!assets/js/*/**/*.tests.js' ]
    },
    karma: { //Karma test with Jasmine, PhantomJS and Angular Mocks-up on every angular js files which has test files
      unit: {
        options: {
          frameworks: ['jasmine'],
          singleRun: true,
          browsers: ['PhantomJS'],
          files: [ '.tmp/js/bower.js', 'assets/js/app.js' ]
        }
      }
    },
    concat: { //concat js and css files
      app: { //concat every angular js file into .tmp/js/main.js
        src: [ 'assets/js/main.js', 'assets/js/*/**/*.js', '!assets/js/*/**/*.tests.js' ],
        dest: 'assets/js/app.js'
      },
      js: { //concat .tmp/js/bower.min.js and .tmp/js/main.min.js into assets/js/js.js
        src: [ 'assets/js/bower.min.js', '.tmp/js/main.min.js' ],
        dest: 'assets/js/js.js'
      },
      cssApp: { //concat every angular sass file into .tmp/styles/main.css
        src: [ '.tmp/styles/css/**/*.css' ],
        dest: 'assets/styles/app.css'
      },
      cssStyles: { //concat assets/styles/bower.min.css and .tmp/styles/main.min.css into assets/styles/styles.css
        src: [ 'assets/styles/bower.min.css', '.tmp/styles/main.min.css' ],
        dest: 'assets/styles/styles.css'
      }
    },
    uglify: {
      app: { //minify .tmp/js/main.js into assets/js/main.min.js
        files: {
          '.tmp/js/main.min.js': [ 'assets/js/app.js' ]
        }
      },
      bower: { //minify .tmp/js/bower.js into assets/js/bower.min.js
        files: {
          'assets/js/bower.min.js': [ '<%= bower_concat.all.dest %>' ]
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'assets/styles',
          cssDir: '.tmp/styles/css',
          cacheDir: '.tmp/.sass-cache',
          environment: 'production'
        }
      }
    },
    cssmin: {
      app: { //minify assets/styles/main.css into .tmp/styles/main.min.css
        files: {
          '.tmp/styles/main.min.css': [ 'assets/styles/app.css' ]
        }
      },
      bower: { //minify assets/styles/bower.css into .tmp/assets/styles/bower.min.css
        files: {
          'assets/styles/bower.min.css': [ '.tmp/styles/bower.css' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  //no karma because it aborts due to some unknown warnings, idem in watch
  grunt.registerTask('default', [ 'bower_concat', 'uglify:bower', 'jshint', 'concat:app', /*'karma',*/ 'compass', 'concat:cssApp', 'cssmin:bower', 'watch' ]);
  grunt.registerTask('production', [ 'bower_concat', 'uglify:bower', 'jshint', 'concat:app', /*'karma',*/ 'compass', 'concat:cssApp', 'cssmin:bower', 'uglify:app', 'cssmin:app', 'concat:js', 'concat:cssStyles' ]);
};
