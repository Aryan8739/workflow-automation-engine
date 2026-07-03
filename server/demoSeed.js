import 'dotenv/config';
import mongoose from 'mongoose';
import Workflow from './src/models/Workflow.js';

const name = 'Parallel + Conditional Demo';

const nodes = [
  {
    id: 'fetch',
    type: 'http',
    position: { x: 40, y: 200 },
    config: {
      method: 'GET',
      url: 'https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true',
    },
  },
  {
    id: 'tempC',
    type: 'transform',
    position: { x: 340, y: 100 },
    config: { code: 'return input.data.current_weather.temperature;' },
  },
  {
    id: 'wind',
    type: 'transform',
    position: { x: 340, y: 300 },
    config: { code: 'return input.data.current_weather.windspeed;' },
  },
  {
    id: 'join',
    type: 'transform',
    position: { x: 640, y: 200 },
    config: { code: 'return { temp: input[0], wind: input[1] };' },
  },
  {
    id: 'check',
    type: 'condition',
    position: { x: 940, y: 200 },
    config: { expression: 'input.temp > 20' },
  },
  {
    id: 'warm',
    type: 'delay',
    position: { x: 1240, y: 100 },
    config: { ms: 800 },
  },
  {
    id: 'cool',
    type: 'delay',
    position: { x: 1240, y: 300 },
    config: { ms: 800 },
  },
];

const edges = [
  { source: 'fetch', target: 'tempC' },
  { source: 'fetch', target: 'wind' },
  { source: 'tempC', target: 'join' },
  { source: 'wind', target: 'join' },
  { source: 'join', target: 'check' },
  { source: 'check', target: 'warm', sourceHandle: 'true' },
  { source: 'check', target: 'cool', sourceHandle: 'false' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Workflow.deleteMany({ name });
  const wf = await Workflow.create({ name, nodes, edges });
  console.log(`Seeded "${name}" with ID: ${wf._id}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed();
