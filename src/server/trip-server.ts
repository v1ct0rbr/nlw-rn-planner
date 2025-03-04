import { api } from './api'

export type TripDetails = {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

type TripCreate = Omit<TripDetails, 'id' | 'is_confirmed'> & {
  emails_to_invite: string[]
}

async function getById(id: string) {
  const { data } = await api.get<{ trip: TripDetails }>(`/trips/${id}`)
  return data.trip
}

async function create({
  destination,
  starts_at,
  ends_at,
  emails_to_invite,
}: TripCreate) {
  const { data } = await api.post<{ tripId: string }>('/trips', {
    destination,
    starts_at,
    ends_at,
    emails_to_invite,
    owner_name: 'Rodrigo Gonçalves',
    owner_email: 'rodrigo.rgtic@gmail.com',
  })

  return data
}

async function update({
  id,
  destination,
  starts_at,
  ends_at,
}: Omit<TripDetails, 'is_confirmed'>) {
  await api.put(`/trips/${id}`, {
    destination,
    starts_at,
    ends_at,
  })
}

export const tripServer = { getById, create, update }
