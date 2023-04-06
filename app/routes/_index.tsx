import type { V2_MetaFunction } from "@remix-run/node"

export const meta: V2_MetaFunction = () => {
  return [{ title: "Basic Calendar Rendering App" }]
}

// Due to the nature of Tailwind, we need to specify class names in full here
// (if constructed dynamically, they won't make it to the final purged css)
const ROW_STARTS = {
  "1": 'row-start-1',
  "2": 'row-start-2',
  "3": 'row-start-3',
  "4": 'row-start-4',
  "5": 'row-start-5',
  "6": 'row-start-6',
  "7": 'row-start-7',
  "8": 'row-start-8',
  "9": 'row-start-9',
  "10": 'row-start-10',
  "11": 'row-start-11',
  "12": 'row-start-12',
  "13": 'row-start-13',
}

const ROW_ENDS = {
  "1": 'row-end-1',
  "2": 'row-end-2',
  "3": 'row-end-3',
  "4": 'row-end-4',
  "5": 'row-end-5',
  "6": 'row-end-6',
  "7": 'row-end-7',
  "8": 'row-end-8',
  "9": 'row-end-9',
  "10": 'row-end-10',
  "11": 'row-end-11',
  "12": 'row-end-12',
  "13": 'row-end-13',
}

type Event = {
  id: number,
  startTime: keyof typeof ROW_STARTS,
  endTime: keyof typeof ROW_ENDS,
  color: string,
}

// Here we have the source array populated with events - feel free to modify
const SOURCE_EVENTS: Array<Event>= [
  {
    id: 1,
    startTime: "1",
    endTime: "3",
    color: "bg-blue-500",
  },
  {
    id: 2,
    startTime: "2",
    endTime: "3",
    color: "bg-violet-400",
  },
  {
    id: 3,
    startTime: "2",
    endTime: "4",
    color: "bg-blue-400",
  },
  {
    id: 4,
    startTime: "5",
    endTime: "7",
    color: "bg-violet-500",
  },
  {
    id: 5,
    startTime: "7",
    endTime: "10",
    color: "bg-violet-300",
  },
  {
    id: 6,
    startTime: "6",
    endTime: "7",
    color: "bg-blue-400",
  },
  {
    id: 7,
    startTime: "7",
    endTime: "8",
    color: "bg-blue-400",
  },
  {
    id: 8,
    startTime: "5",
    endTime: "12",
    color: "bg-blue-300",
  },
  {
    id: 9,
    startTime: "9",
    endTime: "13",
    color: "bg-violet-300",
  },
]


const findSuitableColumn = (event: Event, columns: Array<Array<Event>>) => {
  // Iterate through columns
  for (const [index, column] of columns.entries()) {
    // Look for a colliding event
    const collision = Boolean(column.find(existingEvent => 
      parseInt(event.startTime) < parseInt(existingEvent.endTime)
    ))
    // If there is none, the current event can be placed into this column
    if (!collision) {
      return index
    }
  }
  // Else return index of a new column
  return columns.length
}

const divideEventsIntoColumns = (eventsArray: Array<Event>) => {
  let columns: Array<Array<Event>> = []

  // Sort events based on startTime
  eventsArray.sort((a: Event, b: Event) => parseInt(a.startTime) - parseInt(b.startTime))
  
  // Divide events into columns
  eventsArray.forEach(event => {
    const columnIndex = findSuitableColumn(event, columns)
    // If the column exists, add the event
    if(columns[columnIndex] !== undefined) {
      columns[columnIndex].push(event)
    // Else add the event to a new column
    } else {
      columns.push([event])
    }
  })
  return columns
}

export default function Index() {
  
  const columnsWithEvents = divideEventsIntoColumns(SOURCE_EVENTS)
  
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="text-3xl font-bold text-center my-8">
        Basic Calendar Rendering App
      </h1>
      <div className="border-b-2 mb-1"></div>
      <div className="flex">
        <div className="px-1">
          <div
            className="
              grid grid-rows-12 grid-flow-col gap-2 h-full
              font-mono text-white text-sm text-center font-bold
              leading-6 bg-stripes-fuchsia rounded-lg
            "
          >
            {[...Array(12)].map((element, index) => (
              <div key={index} className={`p-2 text-black border-b-2`}>
                <p>{index+1}</p>
              </div>
            ))}
          </div>
        </div>
        {columnsWithEvents.map((column, index) => (
          <div
            key={index}
            className="flex-1 px-1"
          >
            <div
              className="
                grid grid-rows-12 grid-flow-col gap-2 h-full
                font-mono text-white text-sm text-center font-bold
                leading-6 bg-stripes-fuchsia rounded-lg
              "
            >
              {column.map(event => {
                return(
                  <div
                    key={event.id}
                    className={
                      `p-4 rounded-lg shadow-lg bg-blue-500
                      ${ROW_STARTS[event.startTime]} ${ROW_ENDS[event.endTime]}
                      ${event.color}`
                    }
                  >
                    <p>ID: {event.id}</p>
                    <p>From: {event.startTime} To: {event.endTime}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>      
    </div>
  )
}
