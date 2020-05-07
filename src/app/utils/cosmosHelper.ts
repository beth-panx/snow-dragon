export async function createDb(client, databaseId) {

    const { database } = await client.databases.createIfNotExists({
        id: databaseId
    });

    return database;
}

export async function createContainer(client, databaseId, containerId, partitionKey) {
    const { container } = await client
        .database(databaseId)
        .containers.createIfNotExists(
            { id: containerId, partitionKey },
            { offerThroughput: 400 }
    );

    return container;
}

export async function find(container, querySpec) {
    if (!container) {
        throw new Error("Collection is not initialized.");
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
}

export async function addItem(client, databaseId, containerId, itemBody) {
    const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);

    return item;
}

export async function updateItem(container, itemId, partitionKey, updatedItem) {
    const { resource: replaced } = await container
        .item(itemId, partitionKey)
        .replace(updatedItem);

    return replaced;
}

export async function getItem(container, itemId, partitionKey) {
    const { resource } = await container.item(itemId, partitionKey).read();
    return resource;
}
