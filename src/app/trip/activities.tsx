import { Text, View } from 'react-native'

import { TripData } from './[id]'

type ActivityProps = {
  tripDetails: TripData
}

export function Activities({ tripDetails }: ActivityProps) {
  return (
    <View className="flex-1">
      <Text className="text-white">{tripDetails.destination}</Text>
    </View>
  )
}
