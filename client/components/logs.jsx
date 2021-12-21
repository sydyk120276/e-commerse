import React from 'react'
import { useSelector } from 'react-redux'

const Logs = () => {
  const { logArray } = useSelector((s) => s.logs)
  return (
    <div>
      {logArray.map((log) => {
        return (
          <div key={log?.id}>
            {log?.string}
          </div>
        )
      })}
    </div>
  )
}

export default Logs
