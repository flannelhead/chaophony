module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            dist: {
                options: {
                    compress: {
                        dead_code: true,
                        unused: true,
                        screw_ie8: true
                    },
                    preserveComments: 'some'
                },

                files: {
                    'chaophony.min.js': [
                        'bower_components/ramda/ramda.min.js',
                        'src/*.js',
                    ]
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    'chaophony.min.css': ['src/*.css']
                }
            }
        },

        targethtml: {
            dist: {
                files: {
                    'index.html': 'src/index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-targethtml');

    grunt.registerTask('dist', ['uglify', 'cssmin', 'targethtml']);
};

