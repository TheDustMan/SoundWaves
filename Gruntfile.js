module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        secret: grunt.file.readJSON('credentials.json'),
        environments: {
            options: {
                current_symlink: 'SoundWaves',
                local_path: 'product'
            },
            staging: {
                options: {
                    host: '<%= secret.credentials.host %>',
                    username: '<%= secret.credentials.username %>',
                    password: '<%= secret.credentials.password %>',
                    port: '<%= secret.credentials.port %>',
                    deploy_path: '/home/dustman/dustweb.org/javascript/projects',
                    debug: true,
                    release_to_keep: '5'
                }
            },
            production: {
                options: {
                    host: '<%= secret.credentials.host %>',
                    username: '<%= secret.credentials.username %>',
                    password: '<%= secret.credentials.password %>',
                    port: '<%= secret.credentials.port %>',
                    deploy_path: '/home/dustman/dustweb.org/javascript/projects',
                    release_to_keep: '5'
                }
            }
            },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'product/<%= pkg.name %>.bundle.js',
                dest: 'product/<%= pkg.name %>.bundle.min.js'
            }
            },
        jshint: {
            all: ['Gruntfile.js', '*.json', 'app/**/*.js']
        },
        browserify: {
            './product/<%= pkg.name %>.bundle.js': ['./app/<%= pkg.name %>.js']
        },
        shell: {
            create_product_dir: "mkdir -p product",
            cp_index_to_product: "cp app/index.html product",
            cp_assets_to_product: "cp -r app/assets product"
        }
        });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ssh-deploy');
    grunt.loadNpmTasks('grunt-browserify');    
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('default', ['browserify']);
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['jshint',
                                 'shell:create_product_dir',
                                 'shell:cp_index_to_product',
                                 'shell:cp_assets_to_product',
                                 'browserify',
                                 'uglify']);
    grunt.registerTask('deploy', ['ssh_deploy:staging']);
};