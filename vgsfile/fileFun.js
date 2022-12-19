require('dotenv').config()
const mongoose = require('mongoose');
const File = require('../schema/fileSchema');
//for upload
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTIONSTRING);

exports.loadGD = (req, res) => {
    // script per caricare link
}

exports.loadFile = (req, res) => {
    // script per caricare file
    let form = new formidable.IncomingForm();

    form.multiples = true;
    form.uploadDir = path.join(__dirname, "../attachments");
    form.maxFileSize = 50 * 1024 * 1024;

    form.parse(req, (err, fields, files) => {
        if (err) throw err;

        const file = files.file;

        if (this.loadFileDB(file)) res.send({ fileUploaded: true });
    })
}

exports.loadFileDB = (file) => {
    const attachment = new File({
        hash: file.newFilename,
        name: encodeURIComponent(file.originalFilename.replace(/\s/g, "-")),
        path: file.filepath,
        date: Date.now()
    });

    attachment.save(err => {
        if (err) throw err;
    });

    return true;
}

exports.getFileList = (req, res) => {
    File.find((err, docs) => {
        res.send(docs);
    });
}

exports.getFileFromHash = (req, res) => {
    const hash = req.query.hash;
    File.findOne({ hash: hash }, (err, doc) => {
        try {
            const filename = doc.name;
            console.log(filename);
            const stream = fs.createReadStream(doc.path);
            res.set(({
                'Content-Disposition': `attachment; filename='${filename}'`,
                'Content-Type': 'application/pdf'
            }));
            stream.pipe(res);
        } catch (e) {
            console.log(e);
            res.send(500).end;
        }
    });
}

exports.deleteFileFromHash = (req, res) => {
    const hash = req.body.hash;

    // Scegliere con i tipi di europa se eliminare il file fisico o solo dal db
    if (process.env.DELETEFILE == -1) {
        File.findOne({ hash: hash }, (err, doc) => {
            if (err) throw err;

            if (fs.existsSync(doc.path)) fs.unlink(doc.path, err => {
                if (err) throw err;
            });
        })
    }

    File.deleteOne({ hash: hash }, (err) => {
        if (err) throw err;

        res.send({ deleted: true });
    });

}