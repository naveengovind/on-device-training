const express = require('express')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const tfnode = require('@tensorflow/tfjs-node')
const sharp = require('sharp')
const app = express()
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app
const port = process.env.PORT || 3000;
app.post('/upload-multiple/:version', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = [];
            //loop all files
            for (let file of Object.values(req.files)){
                file.mv('./uploads/'+req.params.version+ "/" + file.name)
                data.push({
                    name: file.name,
                    size: file.size,
                    type: file.mimetype
                });
            }
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
app.get('/run/:version', async (req, res) => {
    res.send(await runInference("/Users/naveen/WebstormProjects/backend/2.png", req.params.version))
});

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

async function runInference(path, path2){
    const model = await tfnode.loadLayersModel('file:///Users/naveen/WebstormProjects/backend/uploads/'+path2+'/model.json');
    //load in image from file as tensor
    const imageBuffer = await sharp(path).resize(28, 28).removeAlpha().greyscale().toBuffer();
    let tensor = tfnode.node.decodeImage(imageBuffer)
    //resize tensor to shape [1, 28, 28, 1]
    tensor = tensor.mean(2).toFloat().expandDims(-1).expandDims(0)
    //resize image to fit model
    const prediction = model.predict(tensor)
    //get prediction
    const result = await prediction.data();
    //get index of highest probability
    const index = result.indexOf(Math.max(...result));
    const classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    return (classNames[index]);
}
