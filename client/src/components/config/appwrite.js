import { Client, Account, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("68ba5b8f0039a61e679f"); // Replace with your Appwrite project ID

export const account = new Account(client);
export { ID };
