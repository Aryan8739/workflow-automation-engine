import 'dotenv/config';
import mongoose from 'mongoose';
import Workflow from './src/models/Workflow.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const workflow = new Workflow({
      name: 'Weather Test Workflow',
      nodes: [
        {
          id: 'node-1',
          type: 'http',
          config: {
            method: 'GET',
            url: 'https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true'
          }
        },
        {
          id: 'node-2',
          type: 'transform',
          config: {
            code: 'return input.data.current_weather.temperature;'
          }
        },
        {
          id: 'node-3',
          type: 'delay',
          config: {
            ms: 2000
          }
        }
      ],
      edges: [
        { source: 'node-1', target: 'node-2' },
        { source: 'node-2', target: 'node-3' }
      ]
    });

    await workflow.save();
    console.log(`Seeded workflow with ID: ${workflow._id}`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
