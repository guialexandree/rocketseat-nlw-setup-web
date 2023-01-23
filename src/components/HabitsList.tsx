import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib'
import dayjs from 'dayjs'

type HabitsListProps = {
  date: Date
  onCompletedChange: (completed: number) => void
}

type HabitsInfo = {
  possibleHabits: Array<{
    id: string
    title: string
    created_at: string
  }>
  completedHabits: string[]
}
 
export function HabitsList({
  date,
  onCompletedChange
}: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  useEffect(() => {
    api
      .get('day', {
         params: {
          date: date.toISOString()
        }
      })
      .then((response) => setHabitsInfo(response.data))
  }, [])

  const isDateInPost = dayjs(date).endOf('day').isBefore(new Date())

  async function handleToggleHabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`)
    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
    let completeHabits: string[] = []
  
    if(isHabitAlreadyCompleted) {
      completeHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
    } else {
      completeHabits = [...habitsInfo!.completedHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits: completeHabits
    })

    onCompletedChange(completeHabits.length)
  }

  return (
    <section className='mt-6 flex flex-col gap-3' >
      {habitsInfo?.possibleHabits.map(habit => {
        return (
        <Checkbox.Root 
          key={habit.id}
          checked={habitsInfo.completedHabits.includes(habit.id)}
          disabled={isDateInPost}
          onCheckedChange={() => handleToggleHabit(habit.id)}
          className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
        >
          <section 
            className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background'
          >
            <Checkbox.Indicator>
              <Check 
                size={20}
                className='text-white'
              />
            </Checkbox.Indicator>
          </section>
          <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
            {habit.title}
          </span>
        </Checkbox.Root>
      )})}
    </section>
  )
}
