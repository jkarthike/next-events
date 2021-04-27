import {
    connectDatabase,
    insertDocument,
    getAllDocuments,
} from '../../../helpers/db-utils';

async function handler(req, res) {
    const eventId = req.query.eventId;
    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        return res.status(500).json({
            message: 'Connecting to database failed !!!',
        });
    }

    if (req.method === 'POST') {
        const { email, name, text } = req.body;

        if (
            !email.includes('@') ||
            !name ||
            name.trim() === '' ||
            !text ||
            text.trim() === ''
        ) {
            res.status(422).json({ message: 'Invalid input' });
            return client.close();
        }

        const newComment = {
            eventId,
            email,
            name,
            text,
        };
        try {
            const result = await insertDocument(client, 'comments', newComment);
            newComment._id = result.insertedId;

            return res
                .status(201)
                .json({ message: 'Added Comments', comment: newComment });
        } catch (error) {
            res.status(500).json({
                message: 'Insering data to database failed !!!',
            });
            return client.close();
        }
    }

    if (req.method === 'GET') {
        try {
            const documents = await getAllDocuments(client, 'comments', {
                _id: -1,
            });
            return res.status(200).json({ comments: documents });
        } catch (error) {
            res.status(500).json({
                message: 'Getting documents failed !!!',
            });
            return client.close();
        }
    }

    client.close();
}

export default handler;
