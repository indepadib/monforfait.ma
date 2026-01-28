export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl ${className}`} />
    )
}

export function OfferCardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </div>
                <Skeleton className="h-8 w-16" />
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
            </div>

            {/* Price */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
        </div>
    )
}
