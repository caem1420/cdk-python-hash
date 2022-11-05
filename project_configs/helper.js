const yaml = require('js-yaml');
const fs   = require('fs');
const {Tags} = require('aws-cdk-lib');

/* Create function for read props yaml file */
function readProps(file_path){
// Get document, or throw exception on error
        try {
        return yaml.load(fs.readFileSync(file_path, 'utf8'));
        } catch (e) {
        console.log(e);
        }
}


/* Create function for setTags for all resources in a stack*/
function setTags(stack, tags){
    console.log(typeof tags);
    Object.entries(tags).forEach(([key,value])=> {
         Tags.of(stack).add(key, value);
    });
   
}

module.exports = {readProps, setTags};