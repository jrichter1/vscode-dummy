import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
const NYC = require('nyc');

async function setupCoverage() {
    const nyc = new NYC(
        {// set the project root
            cwd: path.join(__dirname, '..', '..', '..'),
            include: ['src/**/*.ts', 'out/**/*.js'],
            exclude: ['**/*test/**', '.vscode-test/**'],
            reporter: ['text', 'text-lcov', 'lcov', 'json'],
            tempDir: path.join(__dirname, '..', '..', '..', '.nyc_output'),
            all: true,
            checkCoverage: true,
            instrument: true,
            hookRequire: true,
            hookRunInContext: true,
            hookRunInThisContext: true,
        });

    await nyc.reset();
    await nyc.wrap();

    return nyc;
}

export async function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha();

	const nyc = await setupCoverage();
	const testsRoot = path.resolve(__dirname);

	return new Promise((c, e) => {
		glob('**/**-test.js', { cwd: testsRoot }, async (err, files) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			} finally {
				if (nyc) {
					await nyc.writeCoverageFile();
					await nyc.report();
					c();
				}
			}
		});
	});
}