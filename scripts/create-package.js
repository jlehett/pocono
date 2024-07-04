import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

async function main() {
    const inquirer = (await import('inquirer')).default;

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'packageType',
            message: 'What type of package are you creating?',
            choices: ['ESM', 'CJS'],
        },
        {
            type: 'input',
            name: 'packageName',
            message: 'What is the name of the package?',
            validate: (input) => {
                if (/^[a-z0-9-]+$/.test(input)) {
                    return true;
                }
                return 'Package name must be lowercase, and can only contain alphanumeric characters and hyphens.';
            },
        },
    ]);

    const { packageType, packageName } = answers;
    const packageDir = path.join(PACKAGES_DIR, packageName);

    // Create package directory
    await fs.mkdir(packageDir, { recursive: true });

    // Create package.json
    const packageJson = {
        name: `@pocono/${packageName}`,
        version: '0.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        files: ['dist/'],
        scripts: {
            build: 'tsc',
            test: 'jest',
        },
    };

    if (packageType === 'ESM') {
        packageJson.type = 'module';
        packageJson.exports = {
            '.': {
                import: './dist/index.js',
            },
        };
    }

    await fs.writeFile(
        path.join(packageDir, 'package.json'),
        JSON.stringify(packageJson, null, 4),
    );

    // Create src directory and index.ts
    await fs.mkdir(path.join(packageDir, 'src'));
    await fs.writeFile(
        path.join(packageDir, 'src', 'index.ts'),
        '// Your code here',
    );

    // Create tsconfig.json
    const tsconfig = {
        extends:
            packageType === 'ESM'
                ? '../../configs/esm/tsconfig.esm.json'
                : '../../configs/cjs/tsconfig.cjs.json',
        include: ['src'],
        exclude: ['node_modules', 'dist'],
        compilerOptions: {
            outDir: './dist',
            rootDir: './src',
        },
    };
    await fs.writeFile(
        path.join(packageDir, 'tsconfig.json'),
        JSON.stringify(tsconfig, null, 4),
    );

    console.log(`Package ${packageName} created successfully!`);

    // Initialize git repository and install dependencies
    process.chdir(packageDir);
    execSync('npm install', { stdio: 'inherit' });

    console.log('Package initialized and dependencies installed.');
}

main().catch(console.error);
