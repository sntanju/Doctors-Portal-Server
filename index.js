const express = require('express')
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

const serviceAccount = {
    "type": "service_account",
    "project_id": "doctors-portal-b83fa",
    "private_key_id": "af11c97063f3e4ea1499e5155d3eacda130c2acb",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCU3zIv1VuTpneE\nXEyOvrzvPFzell+Q+LXujmeUDKar0nk7R7JrpY/mUfUesvm9nPF+ioIFOmwGEagU\nB27wMqYt6g26hzUs2BuWqlwATgbmp+5fz30xnOU3oh2q5q+FZ4DWk9ZcI84HbXMU\nrDDvoP9y/4FAgiU+6pCa4acTlTaYDS5TrkuDcGxPuGQ0XGHESDKZgIWBzONNQEAQ\ntfEzpf4yGtkXAYe5SohxZDZkHI1tZUKb3mCCuOo1drAhMiaiQ+Rgc4Gg8Vc26E/0\nrtIhbwTrZLs4nj+1es3/dZETnI2XkusFiNZRj5gXR7BqtbJ6alIFw2mA8mM8NoOm\nmIxTcXmbAgMBAAECggEAQ4wiEWIVcyENCZl3gy04PLR+zuAb7INsyRkEFkDHPx74\nstUNN5qfeDmnpo4+krIrQOdHp2eiq/5G7Q+SXpocnKieIgxHLFnB6tLRe7Hrn6yC\nlCZo/6HYvy1nmKui6DzWUIYztQrp6KTYmoCmk5PRVDRqSQLEM4/qnNvWGySQ6Nwg\nm19WwHiAfaBi4xIAhCPqWjC83bGQXn+xckGzgMOlgZT9APP8DtzXmMeRcsz06vR7\nT74ZH3/O6SJHNq2D9Aia4SlKiHsRV6UKbMauBF95wm9OszmCv+ccHKhXD3Qpa2YO\nyNRDuRV88ZNQRv33MyIYQtlUZe6sWJ0PYFQC/jpSQQKBgQDRQor5/BVnQKyyZgPZ\nUwd6MRV7M/GV7tL5qjv4EJ1krnDdeaY7ImSBvBf7H7ad/27q5RRY/5rcfkdjGZb+\neZQatln98qkthjn5dt1pOxZQbyI3DPfj8NUY+74+uYkePL/6acGU1ULJVa5Yzr/l\nSCGbUp4f2TKwtk50g3MF9ws3NwKBgQC2H6urEKAXQd3Ag9owggUFSULTofa68eID\nyJfQew9u1koxbAkFoEHqbAY81LNII24O8rJCw2/AFn6SCC9q0H2FHvDY/7XK5d1c\nMTjVJDc/usl/Qj0AJ706HPQ996EHot6PgezAlB6caxe1L/uaOJvznA9BQld5KIDA\nBmXBKLL6vQKBgQC3BrWZioOJ6MZjzthk97sdg9rfBIKz+cwrtFp5UMbpLa3n+KON\nKzqvQj3TVlyaerSf3LdcVEw1uHll0xb/AoWoi3/QnrKb77+7Uty7UoPk3B8X+U7D\n3nv0OxOdtxeYC9h6BI/dRl4AzOEOKd8rglhqiutkvcsZRor+W456VCZKJwKBgBaI\nHIjxaZz2/SRQK7JMo6pfwfDE3O2L91ZYfs/AKcygnlU29HbJuN3zt2HXPsbx+y/G\nPt+bpjuxjL8sXBFu8diCV3HBURBlF9nMDSfxbxRnW35vB3T5daO26VCxTi7Pq5E9\nlbjNmmvno+s6oHoX/tNIv2pndsL6i9M192jKTDpRAoGBAJnIbwN/+By6RwszEfSD\nYUIMDFwwhTzFxFI1oDVZWufjFifs1XYwiEAS97YDV9sw8BQs88TgvFeGW6nvVIie\nvkX6TMEoFIieRC97oSrE/wukExv4EHGigpS9vHMcyjbpqnnvHo6QgGdHWsTLFoy8\n/fduB/6EJW/C4jLNYgRK2s/3\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ug5j2@doctors-portal-b83fa.iam.gserviceaccount.com",
    "client_id": "106960294926180228844",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ug5j2%40doctors-portal-b83fa.iam.gserviceaccount.com"
  }
  

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}

async function run() {
    try {
        await client.connect();
        const database = client.db('doctors_portal');
        const appointmentsCollection = database.collection('appointments');
        const usersCollection = database.collection('users');

        app.get('/appointments', verifyToken, async (req, res) => {
            const email = req.query.email;
            const date = req.query.date;

            const query = { email: email, date: date }

            const cursor = appointmentsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        })

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result)
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctors portal!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})

// app.get('/users')
// app.post('/users')
// app.get('/users/:id')
// app.put('/users/:id');
// app.delete('/users/:id')
// users: get
// users: post