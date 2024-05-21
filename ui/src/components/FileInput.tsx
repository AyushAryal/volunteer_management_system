import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { useRef } from 'react';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const toBase64 = (file: File): Promise<string | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            return resolve(reader.result as string | null);
        }
        reader.onerror = (error) => reject(error);
    });

type FileInputProps = {
    file: string | undefined,
    onChange: (file: string | undefined) => void;
}

export function FileInput(props: FileInputProps) {
    let uploadRef = useRef<FileUpload>(null);

    return <div className="flex align-items-center gap-1">
        <div
            style={{ display: !props.file ? "initial" : "none" }}
        >
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
        <img style={{ height: "100px", width: "auto", objectFit: "cover" }} src={props.file} />
        {
            !props.file ? null :
                <Button
                    className="flex justify-content-center"
                    severity={"danger"}
                    outlined
                    onClick={() => {
                        uploadRef.current?.clear();
                        props.onChange(undefined);
                    }}
                    style={{
                        height: "2.5rem",
                        width: "2.5rem",
                    }}
                >
                    <FontAwesomeIcon
                        icon={faClose}
                        style={{
                            fontSize: "2rem",
                            height: "1.2rem",
                            width: "1.2rem",
                        }}
                    />
                </Button>
        }
    </div>;
}
