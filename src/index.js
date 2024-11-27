#!/usr/bin/env node
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import welcome from 'cli-welcome';
import meow from 'meow';
import meowHelp from 'cli-meow-help';
import chalk from 'chalk';
import zlib from 'zlib';
import ora from 'ora';
import boxen from 'boxen';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const flags = {
    encrypt: {
        type: 'boolean',
        default: false,
        alias: 'e',
        desc: 'Encrypt an image'
    },
    decrypt: {
        type: 'boolean',
        default: false,
        alias: 'd',
        desc: 'Decrypt an image'
    },
    input: {
        type: 'string',
        alias: 'i',
        desc: 'Path to input image'
    },
    output: {
        type: 'string',
        alias: 'o',
        desc: 'Save encrypted/decrypted image to'
    },
    key: {
        type: 'string',
        alias: 'k',
        desc: 'Secret key for encryption/decryption'
    },
    compress: {
        type: 'boolean',
        alias: 'c',
        default: true,
        desc: 'Enable compression'
    }
};

const helpText = meowHelp({
    name: 'ImageCrypt',
    flags,
    commands: {
        help: { desc: 'Show help' }
    }
});

const cli = meow(helpText, {
    importMeta: import.meta,
    flags
});

function showStats(originalSize, compressedSize) {
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    const stats = [
        `📊 Original size: ${(originalSize / 1024).toFixed(2)} KB`,
        `📉 Compressed size: ${(compressedSize / 1024).toFixed(2)} KB`,
        `💪 Compression ratio: ${ratio}%`
    ].join('\n');

    console.log(boxen(stats, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
    }));
}

async function encrypt({ input, output, key, compress }) {
    const spinner = ora('Starting encryption process...').start();

    try {
        if (!input || !output || !key) {
            spinner.fail('Missing parameters!');
            throw new Error('Please provide input file, output file, and encryption key');
        }

        spinner.text = 'Reading image file...';
        const imageData = await readFile(input);
        
        let processedData = imageData;
        if (compress) {
            spinner.text = 'Compressing image...';
            processedData = await gzip(imageData);
            spinner.succeed('Compression complete!');
            showStats(imageData.length, processedData.length);
        }

        spinner.text = 'Encrypting data...';
        const algorithm = 'aes-256-ctr';
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key.padEnd(32).slice(0, 32), iv);
        
        const encryptedImage = Buffer.concat([
            iv,
            Buffer.from([compress ? 1 : 0]),
            cipher.update(processedData),
            cipher.final()
        ]);
        
        spinner.text = 'Saving encrypted file...';
        await writeFile(output, encryptedImage);
        spinner.succeed('Image encrypted successfully! 🎉');
    } catch (error) {
        spinner.fail(`Encryption failed: ${error.message}`);
        process.exit(1);
    }
}

async function decrypt({ input, output, key }) {
    const spinner = ora('Starting decryption process...').start();

    try {
        if (!input || !output || !key) {
            spinner.fail('Missing parameters!');
            throw new Error('Please provide input file, output file, and decryption key');
        }

        spinner.text = 'Reading encrypted file...';
        const encryptedData = await readFile(input);
        
        spinner.text = 'Decrypting data...';
        const algorithm = 'aes-256-ctr';
        const iv = encryptedData.slice(0, 16);
        const isCompressed = encryptedData[16] === 1;
        const imageData = encryptedData.slice(17);
        
        const decipher = crypto.createDecipheriv(algorithm, key.padEnd(32).slice(0, 32), iv);
        let decryptedImage = Buffer.concat([decipher.update(imageData), decipher.final()]);
        
        if (isCompressed) {
            spinner.text = 'Decompressing data...';
            const compressedSize = decryptedImage.length;
            decryptedImage = await gunzip(decryptedImage);
            spinner.succeed('Decompression complete!');
            showStats(decryptedImage.length, compressedSize);
        }

        spinner.text = 'Saving decrypted image...';
        await writeFile(output, decryptedImage);
        spinner.succeed('Image decrypted successfully! 🎉');
    } catch (error) {
        spinner.fail(`Decryption failed: ${error.message}`);
        process.exit(1);
    }
}

console.log(boxen('Pixel Crypt Engine', {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'magenta',
    title: '🔒 Welcome'
}));

if (cli.input.includes('help')) {
    cli.showHelp(0);
}

if (cli.flags.encrypt) {
    await encrypt(cli.flags);
} else if (cli.flags.decrypt) {
    await decrypt(cli.flags);
}