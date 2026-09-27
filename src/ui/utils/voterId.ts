const VOTER_ID_KEY = 'featurama_voter_id';
let initialization: Promise<string> | null = null;

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function readOrCreateVoterId(): Promise<string> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default as
    import('@react-native-async-storage/async-storage').AsyncStorageStatic;
  let id = await AsyncStorage.getItem(VOTER_ID_KEY);
  if (!id) {
    id = generateUUID();
    await AsyncStorage.setItem(VOTER_ID_KEY, id);
  }
  return id;
}

export function getOrCreateVoterId(): Promise<string> {
  // Concurrent first mounts must not create different owners for the same device.
  if (!initialization) {
    initialization = readOrCreateVoterId().finally(() => {
      initialization = null;
    });
  }
  return initialization;
}
