import dayjs from 'dayjs'
import {
  ArrowRight,
  AtSign,
  Calendar as IconCalendar,
  MapPin,
  Settings2,
  UserRoundPlus,
} from 'lucide-react-native'
import { useState } from 'react'
import { Image, Keyboard, Text, View } from 'react-native'
import { DateData } from 'react-native-calendars'

import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar'
import { GuestEmail } from '@/components/email'
import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { colors } from '@/styles/colors'
import { DatesSelected, calendarUtils } from '@/utils/calendarUtils'
import { messages } from '@/utils/messages'
import { validateInput } from '@/utils/validateInput'
enum StepForm {
  TRIP_DETAILS = 1,
  ADD_EMAIL = 2,
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  GUESTS = 2,
}

export default function Index() {
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS)

  const [showModal, setShowModal] = useState(MODAL.NONE)

  const [selectedDates, setSelectedDates] = useState({} as DatesSelected)

  const [destination, setDestination] = useState('')

  const [emailToInvite, setEmailToInvite] = useState('')

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  function handleNextStepForm() {
    if (
      destination.trim().length === 0 ||
      !selectedDates.startsAt ||
      !selectedDates.endsAt
    ) {
      /* return  Alert.alert("Detalhes da viagem", "Preencha todos os campos para continuar"); */
      return messages.showToast({
        title: 'Detalhes da viagem',
        message: 'Preencha todos os campos para continuar',
        type: 'error',
      })
    } else if (destination.length < 4) {
      return messages.showToast({
        title: 'Detalhes da viagem',
        message: 'O destino deve ter no mínimo 4 caracteres',
        type: 'error',
      })
    } else if (stepForm === StepForm.TRIP_DETAILS) {
      return setStepForm(StepForm.ADD_EMAIL)
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

  function handleRemoveEmail(emailToRemmove: string) {
    setEmailsToInvite((prevState) =>
      prevState.filter((e) => e !== emailToRemmove),
    )
  }

  function handleAddEmail() {
    if (emailToInvite.trim().length === 0) {
      return messages.showToast({
        title: 'Adicionar e-mail',
        message: 'Preencha o campo de e-mail para continuar',
        type: 'error',
      })
    }
    if (!validateInput.email(emailToInvite)) {
      return messages.showToast({
        title: 'Adicionar e-mail',
        message: 'E-mail inválido',
        type: 'error',
      })
    }

    const emailAlreadyExists = emailsToInvite.find(
      (email) => email === emailToInvite,
    )
    if (emailAlreadyExists) {
      return messages.showToast({
        title: 'Adicionar e-mail',
        message: 'E-mail já adicionado',
        type: 'error',
      })
    }

    setEmailsToInvite((prevState) => [...prevState, emailToInvite])
    setEmailToInvite('')
  }

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Image
        source={require('@/assets/logo.png')}
        className="h-8"
        resizeMode="contain"
        alt='Logo da aplicação "Planner"'
      />

      <Image
        source={require('@/assets/bg.png')}
        className="absolute"
        alt="Background"
      />
      <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua {'\n'} próxima viagem
      </Text>

      <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800">
        <Input>
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onChangeText={setDestination}
            value={destination}
          />
        </Input>

        <Input>
          <IconCalendar color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            onFocus={() => Keyboard.dismiss()}
            editable={stepForm === StepForm.TRIP_DETAILS}
            showSoftInputOnFocus={false}
            onPressIn={() =>
              stepForm === StepForm.TRIP_DETAILS && setShowModal(MODAL.CALENDAR)
            }
            value={selectedDates.formatDatesInText}
          />
        </Input>
        {stepForm === StepForm.ADD_EMAIL && (
          <>
            <View className="border-b py-3 border-zinc-800">
              <Button
                variant="secondary"
                onPress={() => setStepForm(StepForm.TRIP_DETAILS)}
              >
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>
            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Quem está na viagem?"
                autoCorrect={false}
                value={
                  emailsToInvite.length > 0
                    ? `${emailsToInvite.length} pessoa(s) convidada(s)`
                    : ''
                }
                onPress={() => {
                  setShowModal(MODAL.GUESTS)
                  Keyboard.dismiss()
                }}
                showSoftInputOnFocus={false}
              />
            </Input>
          </>
        )}

        <Button onPress={handleNextStepForm}>
          <Button.Title>
            {stepForm === StepForm.TRIP_DETAILS
              ? 'Continuar'
              : 'Confirmar viagem'}{' '}
          </Button.Title>
          <ArrowRight color={colors.lime[950]} size={20} />
        </Button>
      </View>

      <Text className="text-zinc-500 font-regular text-center text-base">
        Ao planejar sua viagem pela plann.er {'\n'} você automaticamente
        concorda com nossos{' '}
        <Text className="text-zinc-300 underline">
          termos de uso e políticas de privacidade.
        </Text>
      </Text>

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

        <Button onPress={() => setShowModal(MODAL.NONE)}>
          <Button.Title>Confirmar</Button.Title>
        </Button>
      </Modal>
      <Modal
        title="Selecionar convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        visible={showModal === MODAL.GUESTS}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map((email) => (
              <GuestEmail
                key={email}
                email={email}
                onRemove={() => handleRemoveEmail(email)}
              />
            ))
          ) : (
            <Text className="text-zinc-600 font-regular text-base">
              {' '}
              Nenhum convidado adicionado{' '}
            </Text>
          )}
        </View>
        <View className="gap-4 mt-4">
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Adicionar e-mail"
              keyboardType="email-address"
              onChangeText={(text) =>
                setEmailToInvite(text.toLocaleLowerCase())
              }
              value={emailToInvite}
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
            />
          </Input>
        </View>
        <View className="mt-4">
          <Button onPress={handleAddEmail}>
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}
