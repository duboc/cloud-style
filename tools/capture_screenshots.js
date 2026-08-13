const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = process.env.CHROME_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const OUT_DIR = path.resolve(__dirname, '../docs/screenshots');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = async (event) => {
      try {
        let text;
        if (typeof event.data === 'string') {
          text = event.data;
        } else if (event.data && typeof event.data.text === 'function') {
          text = await event.data.text();
        } else if (event.data instanceof ArrayBuffer || ArrayBuffer.isView(event.data)) {
          text = new TextDecoder().decode(event.data);
        } else {
          text = String(event.data);
        }
        const data = JSON.parse(text);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(new Error(JSON.stringify(data.error)));
          else resolve(data.result);
        }
      } catch (err) {
        console.error('Error handling CDP message:', err);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function capture() {
  console.log('Launching headless Chrome...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-debugging-address=0.0.0.0',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--hide-scrollbars',
  ]);

  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      await wait(200);
      try {
        const res = await fetch('http://127.0.0.1:9222/json/list');
        if (res.ok) {
          targets = await res.json();
          if (targets && targets.length > 0) break;
        }
      } catch (e) {}
    }

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    console.log('Connected to target:', pageTarget.webSocketDebuggerUrl);

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    console.log('WebSocket connected. Enabling Page & Runtime...');
    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'Runtime.enable');
    await sendCdp(ws, 'DOM.enable');

    // Helper to evaluate JS in page
    async function evaluate(expression) {
      return sendCdp(ws, 'Runtime.evaluate', { expression, returnByValue: true });
    }

    // Helper to take screenshot
    async function saveScreenshot(filename) {
      const res = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filePath = path.join(OUT_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved: ${filename} (${buffer.length} bytes)`);
    }

    // --- DESKTOP (1600x900) ---
    console.log('\n--- Capturing Desktop Screens (1600x900) ---');
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    await sendCdp(ws, 'Page.navigate', { url: 'http://127.0.0.1:8000/index.html' });
    await wait(2000); // let fonts & content settle

    // 1. Cover
    await saveScreenshot('template-cover.png');
    await saveScreenshot('reference-home.png');

    // 2. Menu
    await evaluate("document.querySelector('[data-go=\"menu\"]').click()");
    await wait(1000);
    await saveScreenshot('template-menu.png');
    await saveScreenshot('reference-menu.png');

    // 3. Cards
    await evaluate("document.querySelector('.gc-menu-item').click()");
    await wait(1000);
    await saveScreenshot('template-cards.png');
    await saveScreenshot('reference-card-open.png');

    // 4. Article + Live Demo
    await evaluate("document.querySelector('.gc-card').click()");
    await wait(1000);
    await saveScreenshot('template-article.png');
    await saveScreenshot('reference-detail.png');

    // --- MOBILE (390x844) ---
    console.log('\n--- Capturing Mobile Screens (390x844) ---');
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await sendCdp(ws, 'Page.navigate', { url: 'http://127.0.0.1:8000/index.html' });
    await wait(2000);

    // 5. Mobile Cover
    await saveScreenshot('template-mobile-cover.png');
    await saveScreenshot('reference-mobile-home.png');

    // 6. Mobile Menu
    await evaluate("document.querySelector('[data-go=\"menu\"]').click()");
    await wait(1000);
    await saveScreenshot('template-mobile-menu.png');
    await saveScreenshot('reference-mobile-menu.png');

    ws.close();
    console.log('\nAll screenshots updated successfully!');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    chrome.kill('SIGTERM');
  }
}

capture();
