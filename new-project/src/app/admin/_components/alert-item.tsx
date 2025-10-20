import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

interface AlertItemProps {
  type: 'critical' | 'warning' | 'success' | 'info'
  message: string
  time: string
}

export function AlertItem({ type, message, time }: AlertItemProps) {
  const alertStyles = {
    critical: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
  }
  
  const icons = {
    critical: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    success: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
    info: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
  }

  return (
    <div className={`p-3 rounded-lg border ${alertStyles[type]} mb-2`}>
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          <p className="text-xs opacity-75 mt-1">{time}</p>
        </div>
      </div>
    </div>
  )
}

