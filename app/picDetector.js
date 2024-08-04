"use client";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const PicDetector = async (imageBlob) => {
  // Convert image blob to base64
  const reader = new FileReader();
  reader.readAsDataURL(imageBlob);

  const base64Promise = new Promise((resolve) => {
    reader.onloadend = () => resolve(reader.result);
  });

  const base64Image = await base64Promise;
  const base64Data = base64Image.split(",")[1]; // Extract base64 data

  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
  const body = {
    requests: [
      {
        features: [
          {
            maxResults: 10,
            type: "OBJECT_LOCALIZATION",
          },
        ],
        image: {
          content: base64Data,
        },
      },
    ],
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const objects = data.responses[0]?.localizedObjectAnnotations || [];
    const collection = objects.map((object) => object.name);

    return collection;
  } catch (error) {
    console.error("Error detecting objects:", error);
    return [];
  }
};

export default PicDetector;
