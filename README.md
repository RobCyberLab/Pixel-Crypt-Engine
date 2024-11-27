# 🖼️ Pixel Crypt Engine 🛡️

## Table of Contents
1. [Introduction](#introduction)
2. [Technical Description](#technical-description)
3. [Technologies Used](#technologies-used)
4. [Main Features](#main-features)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Possible Improvements](#possible-improvements)

## Introduction📘
Pixel Crypt Engine is a command-line tool for secure image encryption and decryption. It uses AES-256-CTR encryption combined with smart compression to securely store and transfer image files. The tool provides a user-friendly interface with progress indicators and detailed statistics about the encryption/compression process.

## Technical Description⚙️
The engine implements several key technical features:

- **AES-256 Encryption**: Uses CTR mode for secure encryption:
```javascript
const algorithm = 'aes-256-ctr';
const cipher = crypto.createCipheriv(algorithm, key.padEnd(32).slice(0, 32), iv);
```

- **Smart Compression**: Implements GZIP compression for files larger than 10KB:
```javascript
if (compress && imageData.length > MIN_COMPRESS_SIZE) {
    processedData = await gzip(imageData);
} else if (compress) {
    spinner.info('File too small for effective compression, skipping...');
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
  - Async/await operations
  - Buffer handling
  
- **Core Modules**: 
  - `crypto` for encryption
  - `zlib` for compression
  - `fs` for file operations
  
- **NPM Packages**: 
  - `boxen` for styled boxes
  - `chalk` for colored output
  - `ora` for spinners
  - `meow` for CLI parsing

## Main Features🌟
- **Encryption**:
  - AES-256-CTR encryption
  - Random IV generation
  - Smart compression (>10KB files)
  - Secure key handling

- **User Experience**:
  - Progress spinners
  - Compression statistics
  - Size-based compression
  - Informative messages

## Installation
```bash
npm install pixel-crypt-engine
```

## Usage🔍
### Basic Commands
```bash
# Encrypt an image
pixelcrypt -e -i input.jpg -o encrypted.bin -k "your-secret-key"

# Decrypt an image
pixelcrypt -d -i encrypted.bin -o decrypted.jpg -k "your-secret-key"

# Encrypt without compression
pixelcrypt -e -i input.jpg -o encrypted.bin -k "your-secret-key" --no-compress
```

### Available Options
- `-e, --encrypt`: Encrypt an image
- `-d, --decrypt`: Decrypt an image
- `-i, --input`: Input file path
- `-o, --output`: Output file path
- `-k, --key`: Secret key
- `-c, --compress`: Enable smart compression (default: true, applies to files >10KB)

## Possible Improvements🚀
- **Enhanced Security**:
  - Multiple encryption algorithms
  - Key file support
  - Digital signatures
  - File integrity checks

- **Better Compression**:
  - Multiple compression algorithms
  - Customizable size thresholds
  - Format-specific compression
  - Compression level options

- **Advanced Features**:
  - Batch processing
  - Directory encryption
  - Metadata preservation
  - Password strength checks