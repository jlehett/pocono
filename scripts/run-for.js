import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

async function getPackages() {
    try {
        return await fs.readdir(PACKAGES_DIR);
    } catch (error) {
        console.error('Error reading packages directory:', error);
        process.exit(1);
    }
}

async function main() {
    const packages = await getPackages();

    if (packages.length === 0) {
        console.error('No packages found in the packages directory.');
        process.exit(1);
    }

    const { selectedPackage } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedPackage',
            message: 'Select a package:',
            choices: packages,
        },
    ]);

    const command = process.argv.slice(2).join(' ');

    if (!command) {
        console.error('No command provided. Usage: node run-for.js <command>');
        process.exit(1);
    }

    const packageDir = path.join(PACKAGES_DIR, selectedPackage);

    console.log(`Running "${command}" in ${packageDir}`);

    const [cmd, ...args] = command.split(' ');

    const childProcess = spawn(cmd, args, {
        cwd: packageDir,
        stdio: 'inherit',
        shell: true,
    });

    childProcess.on('error', (error) => {
        console.error(`Error executing command: ${error}`);
        process.exit(1);
    });

    childProcess.on('exit', (code) => {
        console.log(`Command exited with code ${code}`);
        process.exit(code);
    });
}

main().catch((error) => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
});
