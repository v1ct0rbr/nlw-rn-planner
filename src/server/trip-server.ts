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
    owner_name: 'John Doe',
    owner_email: 'johndoe@gmail.com',
  })
  return data.tripId
}

export const tripServer = { getById, create }
