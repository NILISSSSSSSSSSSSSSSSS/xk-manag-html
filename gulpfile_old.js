const gulp = require('gulp');
const scp = require('gulp-scp2');

/**
 * 开发环境
 */
gulp.task('toDev', () => {
    gulp.src('dist/**/*')
        .pipe(scp({
            host: '39.104.149.243',
            username: 'root',
            password: 'xk123456#',
            dest: '/opt/nginx/dev/manage',
        }))
        .on('error', (err) => {
            console.log(err);
        });
});

gulp.task('toHttps', () => {
    gulp.src('dist/**/*')
        .pipe(scp({
            host: '39.104.149.243',
            username: 'root',
            password: 'xk123456#',
            dest: '/opt/nginx/dev/manageHttps',
        }))
        .on('error', (err) => {
            console.log(err);
        });
});

/**
 * 测试环境
 */
gulp.task('toTest', () => {
    gulp.src('dist/**/*')
        .pipe(scp({
            host: '39.104.149.243',
            username: 'root',
            password: 'xk123456#',
            dest: '/opt/nginx/test/manage',
        }))
        .on('error', (err) => {
            console.log(err);
        });
});


/**
 * 正式环境
 */
gulp.task('toProduct', () => {
    gulp.src('dist/**/*')
        .pipe(scp({
            host: '47.99.236.207',
            username: 'root',
            password: 'scxkkj123#',
            dest: '/data/web/manage',
        }))
        .on('error', (err) => {
            console.log(err);
        });
});


gulp.task('toProduct1', () => {
    gulp.src('dist/**/*')
        .pipe(scp({
            host: '47.99.63.170',
            username: 'root',
            password: 'scxkkj123#',
            dest: '/data/web/system',
        }))
        .on('error', (err) => {
            console.log(err);
        });
});