import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { useRef } from 'react';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faUpload } from '@fortawesome/free-solid-svg-icons';
import default_profile_image from "@assets/default_profile_image.png";
import "@components/profile/ProfileImageUpload.css";

const toBase64 = (file: File): Promise<string | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            return resolve(reader.result as string | null);
        }
        reader.onerror = (error) => reject(error);
    });

type ProfileImageUploadProps = {
    file: string | undefined,
    onChange: (file: string | undefined) => void;
}

export function ProfileImageUpload(props: ProfileImageUploadProps) {
    let uploadRef = useRef<FileUpload>(null);

    let actionButton = !props.file ?
        <Button
            className="flex justify-content-center"
            outlined
            onClick={() => {
                uploadRef.current?.getInput().click();
                uploadRef.current?.upload();
            }}
            style={{
                padding: "2px",
                height: "2rem",
                width: "2rem",
            }}
        >
            <FontAwesomeIcon
                icon={faUpload}
                style={{
                    fontSize: "2rem",
                }}
            />
        </Button>
        :
        <Button
            className="flex justify-content-center"
            severity={"danger"}
            outlined
            onClick={() => {
                uploadRef.current?.clear();
                props.onChange(undefined);
            }}
            style={{
                padding: "2px",
                height: "2rem",
                width: "2rem",
            }}
        >
            <FontAwesomeIcon
                icon={faClose}
                style={{
                    fontSize: "2rem",
                }}
            />
        </Button>;


    let image_preview = <img
        className="shadow-4"
        src={(props.file ?? "") == "" ? default_profile_image : props.file}
        style={{
            width: "8rem",
            height: "8rem",
            objectFit: "cover",
            borderRadius: "100%"
        }}
    />;

    return <div className="flex align-items-center gap-1">
        <div style={{ display: "none" }} >
            <FileUpload
                mode="basic"
                ref={uploadRef}
                accept="image/*"
                customUpload
                auto
                uploadHandler={(event: FileUploadHandlerEvent) => {
                    let file = event.files[0];
                    toBase64(file).then((base64) => {
                        props.onChange(base64 ?? "");
                    })
                }}
            />
        </div>
        <div className="relative"
            style={{
                width: "8rem",
                height: "8rem",
                borderRadius: "100%"
            }}>
            {image_preview}
            <div
                className="absolute profile-image-button-container"
                style={{
                    backgroundColor: "black",
                    top: "0",
                    left: "0",
                    width: "8rem",
                    height: "8rem",
                    borderRadius: "100%",
                }}
            >
                <span
                    className="absolute"
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    {actionButton}
                </span>
            </div>
        </div>

    </div>;
}
