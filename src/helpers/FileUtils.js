export default class FileUtils {
    static getFileName = (file) => {
        if(!file.name || file.name.indexOf('.') < 0) {
            return null;
        }
        
        return file.name.substr(0, file.name.lastIndexOf('.'));
    }

    static getFileExtension = (file) => {
        if(!file.name || file.name.indexOf('.') < 0) {
            return null;
        }

        return file.name.substr(file.name.lastIndexOf('.') + 1);
    }

    static stripBase64Metadata = (base64String) => {
        return base64String.split(',')[1];
    }
}

