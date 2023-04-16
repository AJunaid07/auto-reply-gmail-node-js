const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Set up authentication
const client = new OAuth2Client({
  clientId: '920293038236-qqbqraur31pmr4vq5to0f1m6lfsbslkr.apps.googleusercontent.com', 
  clientSecret: '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',
  redirectUri: 'http://localhost:3000/auth/callback' // The redirect URI must match the one you set in the Google Cloud Platform Console
});

// Exchange authorization code for access token
async function getAccessToken(code) {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
}

// Set up Gmail API client
const gmail = google.gmail({
  version: 'v1',
  auth: client,
});

// Check for new emails in the inbox
async function checkEmails() {
  const response = await gmail.users.messages.list({
    userId: 'rajali069@gmail.com',
    q: 'label:inbox',
  });

  const messages = response.data.messages || [];

  for (const message of messages) {
    const messageResponse = await gmail.users.messages.get({
      userId: 'rajali069@gmail.com',
      id: message.id,
    });

    const { threadId, to, cc } = messageResponse.data.payload;

    if (!to || !to.includes('komalhimmatsinghka5023@gmail.com') || cc.includes('afrinjamal.2001@gmail.com')) {
      continue;
    }

    const reply = `Thank you for your email! I am currently out of the office and will not be able to respond until 16/04/2023. Please let me know if this is urgent, and I will try to get back to you as soon as possible.`;

    await gmail.users.messages.send({
      userId: 'rajali069@gmail.com',
      requestBody: {
        threadId: threadId,
        raw: Buffer.from(reply).toString('base64'),
      },
    });

    await gmail.users.messages.modify({
      userId: 'me',
      id: message.id,
      requestBody: {
        addLabelIds: ['New_USER'],
        removeLabelIds: ['INBOX'],
    },
  });
}
}

// Main function
async function main() {
await getAccessToken('my-project-gmail-auto');
await checkEmails();
}

main();