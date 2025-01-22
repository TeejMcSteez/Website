document.getElementById('submitButton').addEventListener('click', function(e) {
    e.preventDefault();
    const input = document.getElementById('tosText');
    const tos = input.value.trim();
    
    if (tos) {
        fetch('/tosAPI/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ text: tos })
        })
        .then(response => response.json()) // Do something with response analysis
        .then(data => {
            displayResult(data);
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please enter some text to check');
    }
});

function displayResult(data) {
    // Data is already parsed from response.json()
    const result = document.getElementById('results'); // Changed from 'result' to 'results' to match HTML
    
    try {
        // Parse the analysis string which contains the JSON response from OpenAI
        const analysis = JSON.parse(data.analysis);
        
        result.innerHTML = `
            <p>Red Flags: ${analysis.red_flags || 'None found'}</p>
            <p>Weird Words: ${analysis.weird_words || 'None found'}</p>
            <p>Obfuscated Terms: ${analysis.obfuscated_terms || 'None found'}</p>
            <p>Summary: ${analysis.summary || 'No summary available'}</p>
        `;
    } catch (error) {
        // If the response isn't in JSON format
        result.innerHTML = `<p>Analysis: ${data.analysis}</p>`;
    }
}