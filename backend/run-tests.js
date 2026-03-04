const { execSync } = require('child_process');

try {
  const result = execSync('npx jest --no-coverage --verbose --forceExit 2>&1', {
    encoding: 'utf-8',
    cwd: __dirname,
    maxBuffer: 10 * 1024 * 1024
  });
  console.log(result);
  process.exit(0);
} catch (error) {
  console.log(error.stdout);
  console.error(error.stderr);
  process.exit(error.status || 1);
}
