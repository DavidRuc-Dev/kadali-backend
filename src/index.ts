import express from 'express';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const app = express();
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Servidor funcionando 🚀');
});

app.post('/api/mensajes', async (req, res): Promise<any> => {
  const { persona, correo, numero, plan } = req.body;

  if (!persona || !correo) {
    return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });
  }

  try {
       console.log("Payload enviado a Notion:", JSON.stringify({
    Nombre: { title: [{ text: { content: persona } }] },
    Mensaje: { rich_text: [{ text: { content: plan } }] },
    Numero: { phone_number: numero },
    Correo: { email: correo },
}, null, 2));
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID! },
      properties: {
        Persona: {
          title: [{ text: { content: persona } }],
        },
        Correo: {
          email: correo,
        },
        Numero: {
          rich_text: [{ text: { content: numero } }],
        },
        Plan: {
          rich_text: [{ text: { content: plan } }],
        },
      },
    });
 
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al guardar en Notion:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
