import AsyncStorage from '@react-native-async-storage/async-storage'

const TRIP_STORAGE_KEY = '@nlw-rn-planner:tripId'

async function save(tripId: string) {
  try {
    await AsyncStorage.setItem(TRIP_STORAGE_KEY, tripId)
  } catch (error) {
    console.error(error)
  }
}

async function get() {
  try {
    return await AsyncStorage.getItem(TRIP_STORAGE_KEY)
  } catch (error) {
    console.error(error)
  }
}

async function remove() {
  try {
    await AsyncStorage.removeItem(TRIP_STORAGE_KEY)
  } catch (error) {
    console.error(error)
  }
}

async function clear() {
  try {
    await AsyncStorage.clear()
  } catch (error) {
    console.error(error)
  }
}

export const tripStorage = { save, get, remove, clear }
