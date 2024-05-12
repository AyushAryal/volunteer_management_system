import { Skeleton } from "primereact/skeleton";

export function ListSkeleton() {
    return <div className='flex flex-column p-2 gap-4' style={{ height: '100%' }}>
        <Skeleton width={'80%'} height="1.3rem" />
        <Skeleton className="mb-5" width={'70%'} height="1.3rem" />
        <Skeleton width={'80%'} height="1.3rem" />
        <Skeleton className="mb-5" width={'70%'} height="1.3rem" />
        <Skeleton width={'80%'} height="1.3rem" />
        <Skeleton className="mb-5" width={'70%'} height="1.3rem" />
        <Skeleton width={'80%'} height="1.3rem" />
        <Skeleton className="mb-5" width={'70%'} height="1.3rem" />
        <Skeleton width={'80%'} height="1.3rem" />
        <Skeleton className="mb-5" width={'70%'} height="1.3rem" />
        <Skeleton width={'80%'} height="1.3rem" />
        <Skeleton className="mb-5" width={'70%'} height="1.3rem" />
    </div>
}
