import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const DOCUSIGN_CLIENT_ID = '46496f9a-9f32-481b-b153-0a089da9d9';
        const DOCUSIGN_USER_ID = '7f62b302-6232-4d1e-8e48-a3a3e23e39ed';
        const DOCUSIGN_ACCOUNT_ID = 'e4f601e4-0343-4c4a-bcd0-4bf769f85294';

        const DOCUSIGN_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAyJ+gYrV4PDW2JgNDrvhqUhn3pSJzRbQVbbY+BiGOrFQnmIHq
88Z9oS98T/ocnHCW/IRywtKpEiGJkseKsNxLO+7a6IFDzxM59W/QVMi1V8VW4Ctb
NojugEEvqnF+RjEDBf1TRFxPoswE4bsOlF8YM+UJlRkhD9ZAcntCQqXG8nvXp1yU
O52DJz0kVCimX/dUlzvNwhhqQEsCKuq+7lihhDhTSzS1Y9w9QROCmfk+KUZZLNQm
GCqtC0M1BCnfer48pLIfQpxp3wwaYt+1EsdZvdh5fyI/J5fkBRchcs3GEs6PNPNI
GRaOIU5FeItiCH3ATpwH9Ivx28oRMlgBmXy0UQIDAQABAoIBADdySnDNZ4f4bjlu
QIf8duHu9E7qyQH0JdH3AohOQPCmp3TSPx2Vd4YTKh+uZ7bitQ/gCRmIABsXMr7i
sBV2JMLRHiYRB60Uyrlm6CRufhPeYca9pM1bJdNDcMmB6Vy70fKXUyp6+rVq/lRm
jr5506YQAEh5M/Z9B728DBGAYI4GJ6iVt4+++cNYttQNAbjfXj+WjYjk+kQ2bm5t
YTH6JHda1CAzl+MTfaQnKzDoJELT1G2FX3WiDJpS8KL5N+aRMvLoLR7hxXd4O++6
HP4An5N5gO+vi5woxUJqC4FfwJgh6L/IHW2xtqucOsmy6taYbTebv/zq+Po+blCO
cd9nDzMCgYEA7aSe0BBlSoLDAHNZk2s+f9xXbMZI5+UfxRZXlOk9diAxd9eNDmo5
3ubIVXMOqCJzNREnnot5OvzJWLH5F1vgFu6Hs48mU9Q4mB20MP4O8EhNvKhP7UkN
as+HvdkR9ehFoJ08oe7Qztk3jHVeani4qCGToQjhKe3bGM/uYU2VlTcCgYEA2B7y
e83Je2135b+5SjT+m7buLADmCxzoBdqtlfD16AO4rQkhu4CQq3yB5d3f8qrq+za8
b/0CCJr8yIq6Z7dkZdXk/qLVk6deyuXQpWZiYovZ5U8Q26orY4+A/N6Y7JHf70+O
Chn5XM5lvVhvd2jTygzkkG+95DcgiXY9IGpORrcCgYBAD+esCS91FakBvxa/seJo
T3rV3OIceVzGIY68mt+xr14Gg3oID8TH/Qi2WEz0ME1EWfqHN+wXZbvViCyxClhv
dh/o3MclRAl5oFBKAMMALU2fdPQO8GmIiKd8Gz9HPjU+5gRJVvq9ODtMRvuL0j1d
PafxelZQmkk8+Bi37FVNowKBgHYvnk0jwT31JC8IxIwXJPEEfYSkzShgm2WwK2Mm
zWMevdwqdT7zVKniwapxxikPXMcaLLxVMMqB7yC/9KYJPScPbFXvuDoxuf3c5Ve+
AKmBbxweO8rUaTvd2xztodUlBL/60mMlxx8AY9TCytoTAlao7EksQjzOBMYHWfAj
EkFLAoGBAKjBv+ctOo26/TgD3GSSRKXzQqQrt53umwAeuzoee7uVEXuN53T3+xr5
uYi0H/cmJIpKYnJCPz5mafKTJP3e5QS7QK1O9DTDC8V8N0LSjQrZJ/vO0hK9XT0w
LnTCUWUDBRxdp3G+pUv+mVWhjIiIfuTapvrmGR+PK54leuDTwdBM
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

        const tokenRes = await fetch('https://account.docusign.com/oauth/token', {
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
        const baseURI = tokenData.base_uri || 'https://eu.docusign.net';

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
