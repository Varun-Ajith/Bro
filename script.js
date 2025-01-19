// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

function getRandomPDFNumber() {
    return Math.floor(Math.random() * 150) + 1;
}

function showElement(elementId) {
    const element = document.getElementById(elementId);
    element.classList.add('active');
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    element.classList.add('fade-out');
}

function updateCountdown(number) {
    const countdown = document.getElementById('countdown');
    countdown.classList.remove('active'); // Reset animation
    void countdown.offsetWidth; // Trigger reflow
    countdown.classList.add('active'); // Restart animation
    countdown.querySelector('span').textContent = number;
}

async function renderPDF(pdfNumber) {
    const pdfViewer = document.getElementById('custom-pdf-viewer');
    pdfViewer.style.display = 'block';
    
    try {
        const loadingTask = pdfjsLib.getDocument(`${pdfNumber}.pdf`);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const canvas = document.getElementById('pdf-render');
        const context = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
            window.innerWidth / viewport.width,
            window.innerHeight / viewport.height
        );
        
        const scaledViewport = page.getViewport({ scale: scale * 0.95 });
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
    } catch (error) {
        console.error('Error rendering PDF:', error);
    }
}

async function playIntroSequence() {
    const pdfNumber = getRandomPDFNumber();
    
    // Welcome to Brostle
    showElement('welcome');
    await new Promise(resolve => setTimeout(resolve, 2000));
    hideElement('welcome');
    
    // Rule number
    await new Promise(resolve => setTimeout(resolve, 500));
    document.getElementById('ruleNumber').textContent = pdfNumber;
    showElement('rule');
    await new Promise(resolve => setTimeout(resolve, 2000));
    hideElement('rule');
    
    // Become a bro
    await new Promise(resolve => setTimeout(resolve, 500));
    showElement('bro');
    await new Promise(resolve => setTimeout(resolve, 2000));
    hideElement('bro');
    
    // Countdown with more dramatic pauses
    await new Promise(resolve => setTimeout(resolve, 800));
    showElement('countdown');
    
    // Enhanced countdown animation
    for (let i = 3; i >= 1; i--) {
        updateCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1200)); // Longer pause for each number
    }
    
    // Hide intro container
    document.querySelector('.intro-container').style.display = 'none';
    
    // Show PDF
    await renderPDF(pdfNumber);
}

window.addEventListener('resize', () => {
    const pdfViewer = document.getElementById('custom-pdf-viewer');
    if (pdfViewer.style.display === 'block') {
        const pdfNumber = document.getElementById('ruleNumber').textContent;
        renderPDF(pdfNumber);
    }
});

window.onload = playIntroSequence;