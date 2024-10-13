document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let query = document.getElementById('query').value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'query': query
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayResults(data);
        displayChart(data);
    });
});

function displayResults(data) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Results</h2>';
    for (let i = 0; i < data.documents.length; i++) {
        let docDiv = document.createElement('div');
        docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i]}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
        resultsDiv.appendChild(docDiv);
    }
}


function displayChart(data) {
  let similarities = data.similarities.map(Number); // Convert similarities to numbers
  let indices = data.indices.map(String); // Convert indices to strings for labeling

  // Create the bar chart trace
  let trace = {
    x: indices,
    y: similarities,
    type: "bar",
    text: similarities.map((sim) => `Similarity: ${sim}`), // Add similarity scores as hover text
    hoverinfo: "text",
    marker: {
      color: "rgba(55, 128, 191, 0.7)", // Bar color
      line: {
        color: "rgba(55, 128, 191, 1.0)", // Bar border color
        width: 2, // Border width
      },
    },
  };

  // Layout of the chart
  let layout = {
    title: "Cosine Similarity of Top Documents",
    xaxis: {
      title: "Document Index",
      type: "category", // Treat the document indices as categorical labels
    },
    yaxis: {
      title: "Cosine Similarity",
      range: [0, 1], // Similarity typically ranges from 0 to 1
    },
  };

  let dataPlot = [trace];

  // Render the plot in the div with id 'similarity-chart'
  Plotly.newPlot("similarity-chart", dataPlot, layout);
}
