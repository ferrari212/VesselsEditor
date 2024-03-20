export function readSingleFile(e) {

    const file = e.target.files[0];

    console.log(file);

    const result = { 
        status: 400, 
        message: "", 
        json: undefined 
    }
    
    if (!file) {
        
        result.message = "No file provided."

        return result
    
    }

    // Check if the file's MIME type is 'application/json'
    if (file.type !== 'application/json') {
        
        result.message = "File is not a JSON file."

        return result;

    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        
        const contents = e.target.result;

        try {
        
            result.json = JSON.parse(contents);
            result.message = "Success"

        } catch (error) {
            
            result.message = 'Error parsing JSON: ' + error 

            console.error(result.message);

        };

    };
    
    reader.readAsText(file);

    return result;

}