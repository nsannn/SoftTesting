const cron = require('node-cron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const LOG_DIR = path.join(__dirname, 'scheduled-test-logs');
const SCHEDULE = '* * * * *'; 
// Schedule formats:
//   '0 8 * * *'    - every day at 8 in the morning
//   '0 9 * * 1-5'  - from monday to fridat at 9 in the morning
//   '*/30 * * * *' - Every 30 minutes
//   '* * * * *'    - Every minute

// Create log directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

function runTests() {
    const timestamp = getTimestamp();
    const logFile = path.join(LOG_DIR, `test-run-${timestamp}.log`);
    
    log('Starting scheduled test execution...');
    
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });
    logStream.write('='.repeat(60) + '\n');
    logStream.write(`Scheduled Test Execution\n`);
    logStream.write(`Timestamp: ${new Date().toISOString()}\n`);
    logStream.write('='.repeat(60) + '\n\n');
    
    // Run only dataDrivenTest.spec.js from Part 4
    const testProcess = exec('npx playwright test', { 
        cwd: __dirname,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    testProcess.stdout.on('data', (data) => {
        process.stdout.write(data);
        logStream.write(data);
    });
    
    testProcess.stderr.on('data', (data) => {
        process.stderr.write(data);
        logStream.write(data);
    });
    
    testProcess.on('close', (code) => {
        const result = code === 0 ? 'PASSED' : 'FAILED';
        const summary = `\n${'='.repeat(60)}\nTest execution ${result} with exit code: ${code}\nLog saved to: ${logFile}\n${'='.repeat(60)}\n`;
        
        log(`Test execution completed: ${result}`);
        logStream.write(summary);
        logStream.end();
    });
}

log('Playwright Scheduled Test Runner');
log(`Schedule: ${SCHEDULE}`);
log(`Log directory: ${LOG_DIR}`);

if (!cron.validate(SCHEDULE)) {
    console.error('Invalid cron expression!');
    process.exit(1);
}

cron.schedule(SCHEDULE, () => {
    log('Cron trigger activated');
    runTests();
});

log('Scheduler is running. Waiting for scheduled time...');

