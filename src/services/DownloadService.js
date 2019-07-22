import * as fs from 'tns-core-modules/file-system';
import * as httpModule from 'http';
import Toast from 'nativescript-Toast';
import moment from 'moment';

export default {
    downloadFile(url) {
        const permissions = require('nativescript-permissions');
        permissions.requestPermission(['android.permission.INTERNET',
            'android.permission.READ_EXTERNAL_STORAGE',
            'android.permission.WRITE_EXTERNAL_STORAGE'], "I need these permissions because I'm cool").then(() => {
            console.log('downloading doc');


            let file = fs.File;
            const fileName = this.uniqueFileName(url);
            console.log(fileName);
            const androidDownloadsPath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString();
            const customFolderPath = fs.path.join(androidDownloadsPath, 'printax27');
            const path = fs.path.join(customFolderPath, fileName);
            const exists = fs.File.exists(path);

            if (!exists) {
                file = fs.File.fromPath(path);

                httpModule.getFile(url).then((res) => {
                    console.log(res);
                    const content = res.readTextSync((e) => {
                        console.log(e);
                    });
                    return content;
                }).then((cn) => {
                    file.writeText(cn.toString()).then(() => {
                        console.log('content saved!');
                        Toast.makeText('Файл успешно сохранён в папку /download/printax27').show();
                    });
                });
            } else {
                console.log('Не удалось сохранить файл');
                Toast.makeText('Не удалось сохранить файл').show();
            }
        });
    },
    uniqueFileName(url) {
        const msg = url;
        const body = msg.substring(msg.lastIndexOf('/') + 1);
        const ext = msg.substring(msg.lastIndexOf('.') + 1);
        const filename = `${body.replace(/\.[^/.]+$/, '') + moment().format('DD_MM|h:mm:ss')}.${ext}`;
        console.log(`unique filename is${filename}`);
        return filename;
    }
}
