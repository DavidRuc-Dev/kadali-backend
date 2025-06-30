import express from 'express';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const app = express();
app.use(express.json());

app.post('/api/mensajes', async (req, res): Promise<any> => {
  const { nombre, mensaje } = req.body;

  if (!nombre || !mensaje) {
    return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });
  }

  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID! },
      properties: {
        Nombre: {
          title: [{ text: { content: nombre } }],
        },
        Mensaje: {
          rich_text: [{ text: { content: mensaje } }],
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
