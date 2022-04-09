const tfnode = require('@tensorflow/tfjs-node')
const sharp = require('sharp')
async function main(){
    const model = await tfnode.loadLayersModel('file:///Users/naveen/WebstormProjects/backend/uploads/model.json');
    //load in image from file as tensor
    const imageBuffer = await sharp("/Users/naveen/WebstormProjects/backend/2.png").resize(28, 28).removeAlpha().greyscale().toBuffer();
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
    console.log(classNames[index]);
}
main()
