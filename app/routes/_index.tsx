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

const ROWS = {
  "1": 'grid-rows-1',
  "2": 'grid-rows-2',
  "3": 'grid-rows-3',
  "4": 'grid-rows-4',
  "5": 'grid-rows-5',
  "6": 'grid-rows-6',
  "7": 'grid-rows-7',
  "8": 'grid-rows-8',
  "9": 'grid-rows-9',
  "10": 'grid-rows-10',
  "11": 'grid-rows-11',
  "12": 'grid-rows-12',
  "13": 'grid-rows-13',
}

type Event = {
  id: number,
  startTime: keyof typeof ROW_STARTS,
  endTime: keyof typeof ROW_ENDS,
  color: string,
}

type Column = Array<Event>

type Cluster = {
  startTime: keyof typeof ROW_STARTS,
  endTime: keyof typeof ROW_ENDS,
  columns: Array<Column>,
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
    endTime: "10",
    color: "bg-blue-300",
  },
  {
    id: 9,
    startTime: "9",
    endTime: "11",
    color: "bg-violet-300",
  },
  {
    id: 10,
    startTime: "9",
    endTime: "11",
    color: "bg-blue-300",
  },
  {
    id: 11,
    startTime: "4",
    endTime: "5",
    color: "bg-blue-300",
  },
  {
    id: 12,
    startTime: "12",
    endTime: "13",
    color: "bg-violet-400",
  },
  {
    id: 13,
    startTime: "12",
    endTime: "13",
    color: "bg-blue-300",
  },
]


const findSuitableColumn = (event: Event, columns: Array<Column>):[number, boolean] => {
  let columnIndex = null
  let newCluster = true
  // Iterate through columns
  for (const [index, column] of columns.entries()) {
    // Look for a colliding event
    const collision = Boolean(column.find(existingEvent => 
      parseInt(event.startTime) < parseInt(existingEvent.endTime)
    ))
    // If there is no collission and no column is set yet,
    // the current event can be placed into this column
    if (!collision && !columnIndex) {
      columnIndex = index
    }
    // If there is a collision, the event should be part of the current cluster
    if (collision) {
      newCluster = false
    }
  }
  // If no suitable column is found, add one
  if (columnIndex === null) {
    columnIndex = columns.length
  }
  return [columnIndex, newCluster]
}

const divideEventsIntoClusters = (eventsArray: Array<Event>) => {
  let clusters: Array<Cluster> = [{
    startTime: "1",
    endTime: "2",
    columns: []
  }]

  // Sort events based on startTime
  eventsArray.sort((a: Event, b: Event) => parseInt(a.startTime) - parseInt(b.startTime))
  
  // Divide events into clusters
  eventsArray.forEach(event => {
    // Select last cluster in array
    const lastCluster = clusters[clusters.length-1]
    // Determine column and existing/new cluster
    const [columnIndex, newCluster] = findSuitableColumn(event, lastCluster.columns)
    // Create a new cluster
    if (newCluster && lastCluster.columns.length > 0) {
      // When creating a new cluster, set the end of the previous one
      // where the new one begins
      lastCluster.endTime = event.startTime
      clusters.push({
        startTime: event.startTime,
        endTime: event.endTime,
        columns: [[event]],
      })
    // Else add the event to an existing cluster
    } else {
      // If the column exists, add the event
      if(lastCluster.columns[columnIndex] !== undefined) {
        lastCluster.columns[columnIndex].push(event)
      // Else add the event to a new column
      } else {
        lastCluster.columns.push([event])
      }
      // Adjust cluster startTime and endTime
      if (
        lastCluster.columns.length &&
        parseInt(lastCluster.startTime) > parseInt(event.startTime)
      ) {
        lastCluster.startTime = event.startTime
      }
      if (
        lastCluster.columns.length &&
        parseInt(lastCluster.endTime)< parseInt(event.endTime)
      ) {
        lastCluster.endTime = event.endTime
      }
    }
    
  })
  return clusters
}

export default function Index() {
  
  const clustersWithEvents = divideEventsIntoClusters(SOURCE_EVENTS)
  
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
        <div className="flex-1">
          {clustersWithEvents.map((cluster, clusterIndex) => {
            // Determine cluster length and assign appropriate number of rows
            const clusterLength: number = parseInt(cluster.endTime) - parseInt(cluster.startTime)
            const rowsClass = clusterLength.toString() in ROWS ? ROWS[clusterLength.toString() as keyof typeof ROWS] : ROWS["1"]

            return (
              <div 
                key={clusterIndex}
                className="flex pb-2"
              >
                {cluster.columns.map((column, index) => (
                  <div
                    key={index}
                    className="flex-1 px-1"
                  >
                    <div
                      className={`
                        grid ${rowsClass} grid-flow-col gap-2 h-full
                        font-mono text-white text-xs md:text-sm text-center font-bold
                        leading-6 bg-stripes-fuchsia rounded-lg
                      `}
                    >
                      {column.map(event => {
                        // Calculate event grid position relative to its cluster
                        const offsetStartTime: number = parseInt(event.startTime)-parseInt(cluster.startTime)+1
                        const offsetEndTime: number = parseInt(event.endTime)-parseInt(cluster.startTime)+1

                        return(
                          <div
                            key={event.id}
                            className={
                              `p-2 md:p-4 rounded-lg shadow-lg bg-blue-500
                              ${ROW_STARTS[offsetStartTime.toString() as keyof typeof ROW_STARTS]}
                              ${ROW_ENDS[offsetEndTime.toString() as keyof typeof ROW_ENDS]}
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
            )
          })}
        </div>
      </div>      
    </div>
  )
}
