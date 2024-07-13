import dayjs from 'dayjs'
import { router, useLocalSearchParams } from 'expo-router'
import {
  CalendarRange,
  Calendar as IconCalendar,
  Info,
  MapPin,
  Settings2,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import { DateData } from 'react-native-calendars'
import Toast from 'react-native-toast-message'

import { Activities } from './activities'
import { Details } from './details'

import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar'
import { Input } from '@/components/input'
import { Loading } from '@/components/Loading'
import { Modal } from '@/components/modal'
import { TripDetails, tripServer } from '@/server/trip-server'
import { colors } from '@/styles/colors'
import { calendarUtils, DatesSelected } from '@/utils/calendarUtils'
import { messages } from '@/utils/messages'

export type TripData = TripDetails & { when: string }

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  UPDATE_TRIP = 2,
}

export default function Trip() {
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false)
  const [isLoadingTrip, setIsLoadingTrip] = useState(false)
  const [tripDetails, setTripDetails] = useState({} as TripData)
  const [option, setOption] = useState<'activity' | 'details'>('activity')
  const [destination, setDestination] = useState('')

  const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false)
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected)

  const tripId = useLocalSearchParams<{ id: string }>().id

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true)
      if (!tripId) {
        return router.back()
      }

      const trip = await tripServer.getById(tripId)

      const maxLengthDestination = 14
      const destination =
        trip.destination.length > maxLengthDestination
          ? trip.destination.slice(0, maxLengthDestination) + '...'
          : trip.destination

      const starts_at = dayjs(trip.starts_at).format('DD')
      const ends_at = dayjs(trip.ends_at).format('DD')
      const month = dayjs(trip.starts_at).format('MMM')
      setDestination(trip.destination)
      setTripDetails({
        ...trip,
        when: `${destination} de ${starts_at} a ${ends_at} de ${month}.`,
      })
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoadingTrip(false)
    }
  }

  function handleSelectedDates(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    })

    setSelectedDates(dates)
  }

  async function handleUpdateTrip() {
    try {
      if (!tripId) {
        return
      }

      if (!destination) {
        return messages.showToast({
          title: 'Atualizar viagem',
          message:
            'Lembre-se de, além de preencher o destino, selecione data de início e fim da viagem.',
          type: 'error',
        })
      }
      setIsUpdatingTrip(true)

      await tripServer.update({
        id: tripId,
        destination,
        starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
        ends_at: dayjs(selectedDates.endsAt?.dateString).toString(),
      })
      setShowModal(MODAL.NONE)
      getTripDetails()
      messages.showToast({
        title: 'Atualizar viagem',
        message: 'Viagem atualizada com sucesso.',
        type: 'success',
      })
    } catch (e) {
      messages.showToast({
        title: 'Atualizar viagem',
        message: 'Ocorreu um erro ao atualizar a viagem.',
        type: 'error',
      })
    } finally {
      setIsUpdatingTrip(false)
    }
  }

  useEffect(() => {
    getTripDetails()
  }, [])

  if (isLoadingTrip) {
    return <Loading />
  }

  return (
    <View className="flex-1 px-5 pt-16">
      <Input variant="tertiary">
        <MapPin size={20} color={colors.zinc[400]} />
        <Input.Field value={tripDetails.when} readOnly />
        <TouchableOpacity
          activeOpacity={0.6}
          className="flex w-9 h-9 bg-zinc-800 items-center justify-center rounded"
          onPress={() => setShowModal(MODAL.UPDATE_TRIP)}
        >
          <Settings2 size={20} color={colors.zinc[400]} />
        </TouchableOpacity>
      </Input>
      {option === 'activity' ? (
        <Activities tripDetails={tripDetails} />
      ) : (
        <Details tripId={tripDetails.id} />
      )}

      <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
        <View className="w-full flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2">
          <Button
            className="flex-1"
            onPress={() => setOption('activity')}
            variant={option === 'activity' ? 'primary' : 'secondary'}
          >
            <CalendarRange
              color={
                option === 'activity' ? colors.lime[950] : colors.zinc[200]
              }
              size={20}
            />
            <Button.Title>Atividades</Button.Title>
          </Button>
          <Button
            className="flex-1"
            onPress={() => setOption('details')}
            variant={option === 'details' ? 'primary' : 'secondary'}
          >
            <Info
              color={option === 'details' ? colors.lime[950] : colors.zinc[200]}
              size={20}
            />
            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>
      <Modal
        title="Atualizar viagem"
        subtitle="Somente quem criou a viagme pode editar"
        visible={showModal === MODAL.UPDATE_TRIP}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <Toast position="bottom" />
        <View className="gap-2 my-4">
          <Input variant="secondary">
            <MapPin size={20} color={colors.zinc[400]} />
            <Input.Field
              placeholder="Para Onde?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>
          <Input variant="secondary">
            <IconCalendar size={20} color={colors.zinc[400]} />
            <Input.Field
              placeholder="Quando?"
              value={selectedDates.formatDatesInText}
              onPressIn={() => setShowModal(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
            />
          </Input>

          <Button
            onPress={() => {
              handleUpdateTrip()
            }}
            isLoading={isUpdatingTrip}
          >
            <Button.Title>Atualizar viagem</Button.Title>
          </Button>
        </View>
      </Modal>
      <Modal
        title="Selecionar datas"
        subtitle="Selecione as datas de ida e volta da viagem"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <Calendar
          onDayPress={handleSelectedDates}
          markedDates={selectedDates.dates}
          minDate={dayjs().toISOString()}
        />

        <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
          <Button.Title>Confirmar</Button.Title>
        </Button>
      </Modal>
    </View>
  )
}
