export function readSingleFile(e, callback) {

    const file = e.target.files[0];

    console.log(file);

    const result = { 
        status: 400, 
        message: "", 
        json: undefined 
    }
    
    if (!file) {
        
        result.message = "No file provided."

        callback(result)

        return
    
    }

    // Check if the file's MIME type is 'application/json'
    if (file.type !== 'application/json') {
        
        result.message = "File is not a JSON file."
        
        callback(result);

        return

    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        
        const contents = e.target.result;

        try {
        
            result.json = JSON.parse(contents);
            result.message = "Success"
            result.status = 200            

            callback(result)

        } catch (error) {
            
            result.message = 'Error parsing JSON: ' + error

            console.error(result.message);
            callback(result)
        
        };        


    };
    
    reader.readAsText(file);

}

function download() {
    
}
