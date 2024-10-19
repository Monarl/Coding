import { exec } from 'child_process';

const packages = ['axios', 'react', 'react-dom', 'react-router-dom', 'express', 'cors', 'bcrypt', 'jsonwebtoken', 'lowdb'];

exec(`npm install ${packages.join(' ')}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error installing packages: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
    }
    console.log(`Packages installed successfully:\n${stdout}`);
});
