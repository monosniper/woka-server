const fs = require('fs');

class UploadService {
    async save(file, space, id) {
	const title = file.title.split('.');
	const fileName = id+'.'+title[title.length-1];
	const path = __dirname + '/../uploads/'+space+'/'+fileName;
	const image = file.base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	fs.writeFileSync(path, image,  {encoding: 'base64'});

	return fileName;
    }
}

module.exports = new UploadService();