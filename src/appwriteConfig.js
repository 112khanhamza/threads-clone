import { Client, Databases, Functions, Storage } from 'appwrite';

const client = new Client();

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
const ENDPOINT = import.meta.env.VITE_ENDPOINT
export const DEV_DB_ID = import.meta.env.VITE_DB_ID
export const COLLECTION_ID_THREADS = import.meta.env.VITE_COLLECTION_ID_THREADS
export const BUCKET_ID_IMAGES = import.meta.env.VITE_BUCKET_ID_IMAGES

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const database = new Databases(client)
export const functions = new Functions(client);
export const storage = new Storage(client);

export default client;