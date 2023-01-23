
type ProgressBarProps = {
  progress: number
}

export function ProgressBar ({ progress }: ProgressBarProps) {
  return (  
    <section className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>
      <section 
        role='progressbar'
        aria-label='Progresso de hábitos completados nesse dia'
        aria-valuenow={progress}
        className='h-3 rounded-xl bg-violet-600 transition-all'
        style={{ width: `${progress}%` }}
      />
    </section>
  );
}
