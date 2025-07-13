const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">Loading...</p>
    </div>
  )
}

export default Loader
