import { cn } from '@/lib/utils';

interface AgentStatusProps {
  isOnline: boolean;
}

export function AgentStatus({ isOnline }: AgentStatusProps) {
  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-full pr-4 border border-cyan-500/20">
      <div className="relative">
        <div className={cn(
          "w-3 h-3 rounded-full",
          isOnline ? "bg-emerald-500" : "bg-red-500"
        )}>
          {isOnline && (
            <>
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse opacity-90"></span>
            </>
          )}
        </div>
      </div>
      <span className="text-xs font-medium tracking-wider text-cyan-100">
        {isOnline ? "AGENT ONLINE" : "AGENT OFFLINE"}
      </span>
    </div>
  );
}