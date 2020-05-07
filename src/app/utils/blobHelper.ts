import { BlobServiceClient } from "@azure/storage-blob";
import * as uuidv1 from "uuid/v1";


export async function connectStorageAccount(channelId) {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
    const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    // Create a unique name for the container
    const containerName = "QuestionQueue" + channelId;
    const containerClient = await blobServiceClient.getContainerClient(containerName);

    return containerClient;
}

export async function createContainer(containerClient) {
    // Create the container
    const createContainerResponse = await containerClient.create();
    return createContainerResponse.requestId;
}

export async function createBlockBlobClient(containerClient, chatId) {
    const blobName = chatId + ".txt";
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    return blockBlobClient;
}

export async function uploadBlobs(blockBlobClient, data) {
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    return uploadBlobResponse.requestId;
    // console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
}

export async function listBlobs(containerClient) {
    for await (const blob of containerClient.listBlobsFlat()) {
        // TODO: Do something with list
    }
}

export async function downloadBlob(blockBlobClient) {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const result = await streamToString(downloadBlockBlobResponse.readableStreamBody);

    return result;
}

async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [] as any;
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}
