// Click tracking system
let clickLog = [];
let clickCount = 0;

// Initialize tracking on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Click tracking initialized');
    
    // Track all elements with data-track attribute
    document.querySelectorAll('[data-track]').forEach(function(element) {
        element.addEventListener('click', function(e) {
            const trackId = element.getAttribute('data-track');
            logClick(trackId, element);
        });
    });

    // Format button toggle
    document.querySelectorAll('.format-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Ad close buttons
    document.querySelectorAll('.ad-close').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.closest('.ad-popup').style.display = 'none';
        });
    });
});

// Function to log clicks
function logClick(elementId, element) {
    clickCount++;
    const clickData = {
        clickNumber: clickCount,
        elementId: elementId,
        elementType: element.tagName,
        elementText: element.textContent.trim().substring(0, 50),
        timestamp: new Date().toISOString(),
        timeOnPage: Math.round((Date.now() - pageLoadTime) / 1000) + 's'
    };
    
    clickLog.push(clickData);
    
    // Log to console
    console.log('Click tracked:', clickData);
    console.log('All clicks:', clickLog);
}

// Function to export as CSV
function exportAsCSV() {
    if (clickLog.length === 0) {
        alert('No click data to export yet!');
        return;
    }

    // CSV headers
    let csv = 'Click Number,Element ID,Element Type,Element Text,Timestamp,Time on Page\n';
    
    // Add data rows
    clickLog.forEach(function(click) {
        csv += `${click.clickNumber},"${click.elementId}","${click.elementType}","${click.elementText}","${click.timestamp}","${click.timeOnPage}"\n`;
    });
    
    // Download
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ytmp3-clicks-' + new Date().getTime() + '.csv';
    link.click();
    URL.revokeObjectURL(url);
}

// Function to export as XML
function exportAsXML() {
    if (clickLog.length === 0) {
        alert('No click data to export yet!');
        return;
    }

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<clickData>\n';
    xml += '  <session>\n';
    xml += `    <pageLoadTime>${new Date(pageLoadTime).toISOString()}</pageLoadTime>\n`;
    xml += `    <totalClicks>${clickLog.length}</totalClicks>\n`;
    xml += '  </session>\n';
    xml += '  <clicks>\n';
    
    clickLog.forEach(function(click) {
        xml += '    <click>\n';
        xml += `      <clickNumber>${click.clickNumber}</clickNumber>\n`;
        xml += `      <elementId>${escapeXml(click.elementId)}</elementId>\n`;
        xml += `      <elementType>${escapeXml(click.elementType)}</elementType>\n`;
        xml += `      <elementText>${escapeXml(click.elementText)}</elementText>\n`;
        xml += `      <timestamp>${click.timestamp}</timestamp>\n`;
        xml += `      <timeOnPage>${click.timeOnPage}</timeOnPage>\n`;
        xml += '    </click>\n';
    });
    
    xml += '  </clicks>\n';
    xml += '</clickData>';
    
    // Download
    const blob = new Blob([xml], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ytmp3-clicks-' + new Date().getTime() + '.xml';
    link.click();
    URL.revokeObjectURL(url);
}

// Helper function to escape XML special characters
function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Track page load time
const pageLoadTime = Date.now();
