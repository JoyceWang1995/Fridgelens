import fs from 'fs';

async function test() {
  const fileData = fs.readFileSync('/Users/kak/.gemini/antigravity/brain/5cc21cf7-5f5c-4184-8da0-d08fb19b736f/.system_generated/click_feedback/click_feedback_1774480606466.png');
  const base64 = fileData.toString('base64');
  
  const res = await fetch('http://localhost:3000/api/ai/detect-ingredients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, mimeType: 'image/png' })
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

test();
