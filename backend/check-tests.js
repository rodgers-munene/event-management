const { exec } = require('child_process');
const fs = require('fs');

exec('npx jest --no-coverage --verbose --forceExit', {
  encoding: 'utf-8',
  cwd: __dirname,
  maxBuffer: 50 * 1024 * 1024
}, (error, stdout, stderr) => {
  // Write full output to file
  fs.writeFileSync('test-output.log', stdout);
  
  // Print summary lines
  const lines = stdout.split('\n');
  const summaryLines = lines.filter(line => 
    line.includes('Test Suites') || 
    line.includes('Tests:') ||
    line.includes('PASS') ||
    line.includes('FAIL') ||
    line.startsWith('✓') ||
    line.startsWith('✕')
  );
  
  console.log('=== TEST SUMMARY ===');
  console.log(summaryLines.join('\n'));
  console.log('====================');
  console.log('\nFull output written to test-output.log');
  
  if (error) {
    process.exit(error.code);
  }
});
