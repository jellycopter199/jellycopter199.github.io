import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const DOCUSIGN_CLIENT_ID = '46496f9a-9f32-481b-b153-0a089da9d914';
        const DOCUSIGN_USER_ID = '279c44cc-b7c2-48c2-8a02-aa685e6e049d';
        const DOCUSIGN_ACCOUNT_ID = 'c375a6fc-028d-4a93-b771-9ff0519f6f77';

        const DOCUSIGN_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAhAOvfXqMk1OYN1W8rXHIw8eGhu/m5p9xiGgcoWx6zzGs1ZMd
UA4ln7Z/4fUF1O5QUaixIs4ngQQ2z/fNoYHfSkY6dcrptHgguZ4W4ch3XSZmsuOU
E82jMkrMdukGsv56iP0yGYWRPkrobhuiIJOueE+CzpD2EmxDbsxjWNXvyXFDYucO
nYxo5oBvgFUA+zR5tMjjaUIdlLYXHa3GCRFTDw3WjrjRIWAOUoYwlbaVqxqXpA2W
D4dBZOFAGZekJJ2E9vKV6wu9MHOGdDOY+ACK7lAOS/7FK/GdDSmNEzYZSkdxYKR7
P16p8/MLDIHOekj48ReXFVpH0UCa4zGy5nvkawIDAQABAoIBABKZ0FbI9y4PsnFi
37sSlBFd4jXOGgXhw7tOwXCkmn3qMmpEwyBoteLAnK6STyLhp1MyMS9FxpQrq1Yh
74kzsD9vZhpQdR3Wv/RXcu2XnkCeQgyE+3Qk3pCeBcbgGO+3N+hoa0WO/S2T8Wxe
RrmksAnHWOzRHmhEdTs935EAp+Yv80+JuWlVzq77eRC74hhxR1gn5f0kAAasWJkI
TRgcGebtiBkxTidXTSPCyzUBHrTW0OD7J6aArtOyhlVCgx8QmhCV7W05BaiSS+iM
XOWAgosvlIILRXeQKqlHSaWlQaKJP/QW0CjmM7olIDvdeB0SrC/UYC7GPhkns0pk
jvDa9D0CgYEA4J4p4j9SOj/GBHXx7s7KzHmwBJFbD9oh4u4RNwjChjudhrav3D73
Y1Crd/zZhQ0oDomsV85iJ2oeJWqWI8FvAvZrtbPTQQwP6DcuBOKoqtiebZ5hQvE+
bytPFBbAoOc6xYVklg97ooYnRfqx+NYRVBs3FQC1RyHBM2pd4aVDrQ0CgYEAlnVn
VH20l9tuHj3ktFcT2z07/d58ss5W/i9IHEWBAs+xfP1JziRTk2ryA5bTeLMyUgg0
10giwkyZrQDGYEESSDZuGarwO4WEs5zSHwkS4WQ8E4IxbzTiM195EvZYDrd6ltU5
7Yopa05Cp5FbELfiNAes3A54DspLBKoGux2ZKVcCgYEAyzwQpZeprO67GpolV3Bg
anbIXrmubT9vXccOaH9SkuYp+BQgNuX6LTB2lVCA+DQZRF4pRCGHCiaoNC6mvp9s
9H9Godedk8N4OSKETwNOnZb2cjTVyB5D4Y6MNJ8JmAzgTowNoQFNWpaLvnPAyGfY
sgMV6bkETOIrz3u0ilBgVZkCgYAaGcnQHXJ7uYQz2NbY9hYqvUev9a26MxNiSv9+
cAw+WZtXrHTmPuUEuNO9Dagn0yZSlrvb8Nae0D0EhxLi1cb/Ifodl8rO+I2ZvwWw
fpl44jONytMakJkBAnn1cSi7fNbWXa0L6SDgTZZAjXW3w76I+h/hmNz469zxtTEv
uqW8RwKBgQCpXDJuv1hfJOuP9T6hSk+CxcC6jdW/C7XbQPjlFliolixMhL4GOlbP
jYQiG0EGj83yaLuZAXS3ZDB7OmQ8LK6R2V8RIEoWz/JaOv6ntfxdLoZQh4XpF/d0
sL4gOiBGZ/zfoUsLeRpsZdxsH2aik+bgVN5B4gHaEj21lramwaN6/g==
-----END RSA PRIVATE KEY-----`;

        const { recipientEmail, recipientName, pdfBase64 } = req.body;

        if (!recipientEmail || !recipientName || !pdfBase64) {
            return res.status(400).json({ message: 'Missing recipient or PDF data' });
        }

        
        const now = Math.floor(Date.now() / 1000);
        const header = { alg: 'RS256', typ: 'JWT' };
        const payload = {
            iss: DOCUSIGN_CLIENT_ID,
            sub: DOCUSIGN_USER_ID,
            aud: 'account-d.docusign.com',
            iat: now,
            exp: now + 3600,
            scope: 'signature impersonation',
        };

        const base64url = (input) =>
            Buffer.from(JSON.stringify(input))
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

        const jwtHeader = base64url(header);
        const jwtPayload = base64url(payload);
        const unsignedJWT = `${jwtHeader}.${jwtPayload}`;

        const signature = crypto
            .createSign('RSA-SHA256')
            .update(unsignedJWT)
            .sign(DOCUSIGN_PRIVATE_KEY, 'base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const jwt = `${unsignedJWT}.${signature}`;

        const tokenRes = await fetch('https://account-d.docusign.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            return res.status(500).json({ message: 'Token error', tokenData });
        }

        const accessToken = tokenData.access_token;
        const baseURI = tokenData.base_uri || 'https://demo.docusign.net';

        const envelope = {
            emailSubject: 'Please sign this document',
            documents: [
                {
                    documentBase64: pdfBase64,
                    name: 'Uploaded Document',
                    fileExtension: 'pdf',
                    documentId: '1',
                },
            ],
            recipients: {
                signers: [
                    {
                        email: recipientEmail,
                        name: recipientName,
                        recipientId: '1',
                        routingOrder: '1',
                        tabs: {
                            signHereTabs: [
                                {
                                    anchorString: '$sig',
                                    anchorYOffset: '0',
                                    anchorUnits: 'pixels',
                                    anchorXOffset: '0',
                                },
                            ],
                            initialHereTabs: [
                                {
                                    anchorString: '$init',
                                    anchorYOffset: '10',
                                    anchorUnits: 'pixels',
                                    anchorXOffset: '0',
                                },
                            ],
                        },
                    },
                ],
            },
            status: 'sent',
        };

        const envelopeRes = await fetch(
            `${baseURI}/restapi/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(envelope),
            }
        );

        const result = await envelopeRes.json();

        if (result.errorCode) {
            return res.status(500).json({ message: 'Envelope error', result });
        }

        return res.status(200).json({
            message: 'Envelope sent!',
            envelopeId: result.envelopeId,
        });
    } catch (err) {
        console.error('🔥 Internal error:', err);
        return res.status(500).json({ message: 'Internal server error', error: String(err) });
    }
}
