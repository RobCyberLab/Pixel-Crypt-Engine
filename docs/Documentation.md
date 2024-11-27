# Pixel Crypt Engine Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Technical Implementation](#technical-implementation)
5. [Examples](#examples)

## Project Overview📝
ImageCrypt is a Node.js-based command-line tool that provides secure image encryption and decryption capabilities. It uses AES-256-CTR encryption combined with optional GZIP compression to securely store and transfer image files. The tool features progress tracking, compression statistics, and a user-friendly CLI interface.

## Installation⚙️
To install and use ImageCrypt, follow these steps:

1. Clone the project repository:
```bash
git clone https://github.com/RobCyberLab/imagecrypt.git
```

2. Navigate to the project directory:
```bash
cd imagecrypt
```

3. Install dependencies:
```bash
npm install
```

4. Make the CLI executable:
```bash
chmod +x index.js
```

## Usage📖
ImageCrypt provides two main operations:

### Image Encryption
Encrypt an image file with optional compression:
```bash
imagecrypt -e -i input.jpg -o encrypted.bin -k "your-secret-key"
```

### Image Decryption
Decrypt a previously encrypted file:
```bash
imagecrypt -d -i encrypted.bin -o decrypted.jpg -k "your-secret-key"
```

### Available Options
```bash
Options
  -e, --encrypt    Encrypt an image
  -d, --decrypt    Decrypt an image
  -i, --input      Path to input image
  -o, --output     Save encrypted/decrypted image to
  -k, --key        Secret key for encryption/decryption
  -c, --compress   Enable compression (default: true)
```

## Technical Implementation🔐
The project implements several key features:

### Encryption Process
```javascript
async function encrypt({ input, output, key, compress }) {
    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key.padEnd(32).slice(0, 32), iv);
    
    // Read and optionally compress image data
    const imageData = await readFile(input);
    let processedData = compress ? await gzip(imageData) : imageData;
    
    // Encrypt and save
    const encryptedImage = Buffer.concat([
        iv,
        Buffer.from([compress ? 1 : 0]),
        cipher.update(processedData),
        cipher.final()
    ]);
}
```

### Decryption Process
```javascript
async function decrypt({ input, output, key }) {
    const algorithm = 'aes-256-ctr';
    const encryptedData = await readFile(input);
    
    // Extract IV and compression flag
    const iv = encryptedData.slice(0, 16);
    const isCompressed = encryptedData[16] === 1;
    const imageData = encryptedData.slice(17);
    
    // Decrypt and decompress if needed
    const decipher = crypto.createDecipheriv(algorithm, key.padEnd(32).slice(0, 32), iv);
    let decryptedImage = Buffer.concat([decipher.update(imageData), decipher.final()]);
    
    if (isCompressed) {
        decryptedImage = await gunzip(decryptedImage);
    }
}
```

### Progress Tracking
The tool uses Ora for elegant progress display:
```javascript
const spinner = ora('Starting encryption process...').start();
spinner.text = 'Encrypting data...';
spinner.succeed('Image encrypted successfully! 🎉');
```

### Compression Statistics
Shows compression effectiveness:
```javascript
function showStats(originalSize, compressedSize) {
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    console.log(boxen([
        `📊 Original size: ${(originalSize / 1024).toFixed(2)} KB`,
        `📉 Compressed size: ${(compressedSize / 1024).toFixed(2)} KB`,
        `💪 Compression ratio: ${ratio}%`
    ].join('\n')));
}
```

## Examples📌

### Example 1: Basic Encryption
```bash
imagecrypt -e -i photo.jpg -o encrypted.bin -k "mysecretkey123"
```
Output:
```
🔒 Pixel Crypt Engine

Starting encryption process...
Reading image file...
Compressing image...
✔ Compression complete!
┌─────────────────────────────────┐
│ 📊 Original size: 1024.50 KB    │
│ 📉 Compressed size: 892.30 KB   │
│ 💪 Compression ratio: 12.90%    │
└─────────────────────────────────┘
Encrypting data...
Saving encrypted file...
✔ Image encrypted successfully! 🎉
```

### Example 2: Decryption with Compressed Data
```bash
imagecrypt -d -i encrypted.bin -o decrypted.jpg -k "mysecretkey123"
```
Output:
```
🔒 Pixel Crypt Engine

Starting decryption process...
Reading encrypted file...
Decrypting data...
Decompressing data...
✔ Decompression complete!
┌─────────────────────────────────┐
│ 📊 Original size: 892.30 KB     │
│ 📉 Compressed size: 1024.50 KB  │
│ 💪 Compression ratio: -12.90%   │
└─────────────────────────────────┘
Saving decrypted image...
✔ Image decrypted successfully! 🎉
```

### Example 3: Encryption without Compression
```bash
imagecrypt -e -i photo.jpg -o encrypted.bin -k "mysecretkey123" --no-compress
```
Output:
```
🔒 Pixel Crypt Engine

Starting encryption process...
Reading image file...
Encrypting data...
Saving encrypted file...
✔ Image encrypted successfully! 🎉
```

Note: The tool includes several features for enhanced functionality:
- AES-256-CTR encryption for security
- GZIP compression for reduced file sizes
- Progress indicators with spinners
- Compression statistics display
- Error handling with informative messages
- Command-line help documentation

These features make the tool efficient for secure image storage and transfer while maintaining a focus on user experience and security.