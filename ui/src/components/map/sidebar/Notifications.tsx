
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { VirtualScroller } from "primereact/virtualscroller";
import { ListSkeleton } from "@components/map/sidebar/ListSkeleton";
import { Divider } from "primereact/divider";
import { Notification } from "@models/incident";
import { Button } from "primereact/button";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { get_notification_list, notification_view } from "@api/incident";


export function Notifications() {
    const notificationList = useHookstate(storeState.notificationList);
    const loadedNotificationList = useHookstate(storeState.loaded.notificationList);

    if (!loadedNotificationList.get()) {
        return <ListSkeleton />
    }

    const markAsRead = async (notification: Notification) => {
        await notification_view(notification.url);
        notificationList.set(await get_notification_list());
    }

    const template = (notification: Notification) => {
        return <div className={notification.viewed ? "" : "surface-50"}>
            <div className="flex flex-column flex-wrap p-2 w-full">
                <div className="flex justify-content-between">
                    <div className="m-1"> {notification.message}</div>
                    <div className="flex-column">
                        {
                            notification.viewed ? null :
                                <Button
                                    outlined
                                    size="small"
                                    style={{
                                        padding: "10px 0px",
                                        borderRadius: "50%",
                                    }}
                                    onClick={() => markAsRead(notification)}
                                >
                                    <FontAwesomeIcon icon={faEye} className="mx-2" />
                                </Button>
                        }
                    </div>
                </div>
                <div className="flex justify-content-between">
                    <div className="text-xs text-400 ">
                        <FontAwesomeIcon icon={faClock} className="mx-2" />
                        {notification.date.toDateString()}
                    </div>

                </div>
            </div>
            <Divider />
        </div>;
    };

    return (
        <VirtualScroller
            items={notificationList.get() as Notification[]}
            itemTemplate={template}
            itemSize={75}
            style={{ width: '100%', height: '75vh' }}
        >
        </VirtualScroller>
    );
}


