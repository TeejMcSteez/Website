document.getElementById('submitButton').addEventListener('click', function(e) {
    e.preventDefault();
    const input = document.getElementById('tosText');
    const tos = input.value.trim();
    
    // const tosFile = document.getElementById('tosFile');
    // const file = tosFile.files[0]; // Changed from file to files

    if (tos) { // Check if either text or file exists
        if (tos) {
            fetch('/tosAPI/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ text: tos })
            })
            .then(response => response.json())
            .then(data => {
                displayResult(data);
                console.log('Response:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        
        // if (file) {
        //     const formData = new FormData();
        //     formData.append('file', file);

        //     fetch('/tosAPI/checkFile', {
        //         method: 'POST',
        //         body: formData
        //     })
        //     .then(response => {
        //         if (response.ok) {
        //             return response.json();
        //         }
        //         throw new Error('Error uploading file');
        //     })
        //     .then(data => { 
        //         displayResult(data);
        //         tosFile.value = '';
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
        // }
    } else {
        alert('Please enter some text to check or upload a file');
    }
});

function displayResult(data) {
    const result = document.getElementById('results');
    
    try {
        // Clean up the response by removing markdown code blocks
        const cleanJson = data.analysis.replace(/```json\n/, '').replace(/\n```/, '');
        const analysis = JSON.parse(cleanJson);
        
        result.innerHTML += `
            <div class="bg-gray-800 p-4 rounded-lg m-10 p-5">
                <p class="mb-2">Number of Red Flags: ${analysis.red_flags}</p>
                <p class="mb-2">Weird Words: ${analysis.weird_words.join(', ') || 'None found'}</p>
                <p class="mb-2">Obfuscated Terms: ${analysis.obfuscated_terms.join(', ') || 'None found'}</p>
                <p class="mb-2">Risk Level: <span class="${getRiskClass(analysis.risk_level)}">${analysis.risk_level}</span></p>
                <p class="mt-4">Summary: ${analysis.summary}</p>
            </div>
        `;
    } catch (error) {
        console.error('Parsing error:', error);
        result.innerHTML = `<p class="text-red-500">Error parsing analysis</p>`;
    }
}

function getRiskClass(risk) {
    switch(risk.toLowerCase()) {
        case 'high': return 'text-red-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-green-500';
        default: return 'text-white';
    }
}