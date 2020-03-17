const fs = require('fs');

module.exports.templateTags = [
  {
    name: 'base64',
    displayName: 'Base64',
    description: 'encode or decode values',
    args: [
      {
        displayName: 'Action',
        type: 'enum',
        options: [
          { displayName: 'Encode', value: 'encode' },
          { displayName: 'Decode', value: 'decode' },
        ],
      },
      {
        displayName: 'Kind',
        type: 'enum',
        options: args => [
          { displayName: 'Normal', value: 'normal' },
          { displayName: 'URL', value: 'url' },
          ...(args[0].value === 'encode' ? [{ displayName: 'File', value: 'file' }] : []),
        ],
      },
      {
        displayName: 'Value',
        hide: args => ['file'].includes(args[1].value),
        type: 'string',
        placeholder: 'My text',
      },
      {
        type: 'file',
        hide: args => ['normal', 'url'].includes(args[1].value),
        displayName: 'File',
      },
    ],
    run(context, action, kind, text, filePath) {
      text = text || '';

      if (action === 'encode') {
        if (kind === 'normal') {
          return Buffer.from(text, 'utf8').toString('base64');
        } else if (kind === 'url') {
          return Buffer.from(text, 'utf8')
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        } else if (kind === 'file') {
          if (filePath) {
            let file = fs.readFileSync(filePath);
            return Buffer.from(file).toString('base64');
          } else {
            return '';
          }
        }
      } else if (action === 'decode') {
        return Buffer.from(text, 'base64').toString('utf8');
      } else {
        throw new Error('Unsupported operation "' + action + '". Must be encode or decode.');
      }
    },
  },
];
