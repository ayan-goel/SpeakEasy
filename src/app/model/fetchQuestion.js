export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Send a GET request to the Python API to fetch the generated question
      const pythonResponse = await fetch('http://127.0.0.1:5000/generate-question', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the Python API request was successful
      if (!pythonResponse.ok) {
        const errorText = await pythonResponse.text();
        throw new Error(`Python API error: ${pythonResponse.status} - ${errorText}`);
      }

      // Parse the JSON response from the Python API
      const data = await pythonResponse.json();

      // Send the question back to the frontend
      res.status(200).json({ question: data.question });
    } catch (error) {
      console.error("Error fetching question from Python API:", error);
      res.status(500).json({ error: "Failed to fetch question" });
    }
  } else {
    // Return a 405 error if the request method is not GET
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}