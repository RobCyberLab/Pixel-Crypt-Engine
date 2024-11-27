# 🖼️Pixel Crypt Engine🛡️

## Table of Contents
1. [Introduction](#introduction)
2. [Technical Description](#technical-description)
3. [Technologies Used](#technologies-used)
4. [Main Features](#main-features)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Possible Improvements](#possible-improvements)

## Introduction📘
ImageCrypt is a command-line tool for secure image encryption and decryption. It uses AES-256-CTR encryption combined with optional compression to securely store and transfer image files. The tool provides a user-friendly interface with progress indicators and detailed statistics about the encryption/compression process.

## Technical Description⚙️
ImageCrypt implements several key technical features:

- **AES-256 Encryption**: Uses CTR mode for secure encryption:
```javascript
const algorithm = 'aes-256-ctr';
const cipher = crypto.createCipheriv(algorithm, key.padEnd(32).slice(0, 32), iv);
```

- **Compression Integration**: Implements GZIP compression for reduced file size:
```javascript
if (compress) {
    processedData = await gzip(imageData);
}
```

- **Progress Tracking**: Uses Ora for elegant progress display:
```javascript
const spinner = ora('Starting encryption process...').start();
spinner.text = 'Encrypting data...';
```

## Technologies Used💻
- **Node.js**: 
  - ES Modules structure
  - Async/await for asynchronous operations
  - Buffer handling for binary data
  
- **Core Modules**: 
  - `crypto` for encryption
  - `zlib` for compression
  - `fs` for file operations
  
- **NPM Packages**: 
  - `boxen` for styled terminal boxes
  - `chalk` for colored output
  - `ora` for spinners
  - `meow` for CLI argument parsing

## Main Features🌟
- **Encryption Capabilities**:
  - AES-256-CTR encryption
  - Random IV generation
  - Secure key handling
  - Compression flag storage

- **Processing Options**:
  - File encryption
  - File decryption
  - Optional compression
  - Custom output paths

- **User Experience**:
  - Progress spinners
  - Compression statistics
  - Error handling
  - Command help documentation

## Installation
```bash
npm install imagecrypt
```

## Usage🔍
### Basic Commands
```bash
# Encrypt an image
imagecrypt -e -i input.jpg -o encrypted.bin -k "your-secret-key"

# Decrypt an image
imagecrypt -d -i encrypted.bin -o decrypted.jpg -k "your-secret-key"

# Encrypt with compression disabled
imagecrypt -e -i input.jpg -o encrypted.bin -k "your-secret-key" --no-compress
```

### Available Options
- `-e, --encrypt`: Encrypt an image
- `-d, --decrypt`: Decrypt an image
- `-i, --input`: Path to input image
- `-o, --output`: Save encrypted/decrypted image to
- `-k, --key`: Secret key for encryption/decryption
- `-c, --compress`: Enable compression (default: true)

## Possible Improvements🚀
- **Enhanced Functionality**:
  - Multiple encryption algorithms support
  - Batch processing capabilities
  - Key file support
  - Digital signatures

- **User Interface**:
  - Interactive key input
  - File type validation
  - Progress bars
  - Detailed logging options

- **Performance Improvements**:
  - Streaming for large files
  - Parallel processing
  - Memory usage optimization
  - Compression level options

- **Additional Features**:
  - Directory encryption
  - Metadata preservation
  - Custom compression algorithms
  - File integrity verification