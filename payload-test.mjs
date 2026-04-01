async function test() {
  // Generate 5MB of base64
  const size = 5 * 1024 * 1024;
  const rawBytes = Buffer.alloc(Math.floor(size * 0.75), 'A');
  const base64 = rawBytes.toString('base64');
  
  console.log('Sending size:', base64.length, 'bytes');

  try {
    const res = await fetch('http://localhost:5174/api/ai/detect-ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64, mimeType: 'image/jpeg' })
    });

    const text = await res.text();
    console.log('Status via Vite Proxy:', res.status);
    console.log('Response via Vite Proxy:', text);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

test();
