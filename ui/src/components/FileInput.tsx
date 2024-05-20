import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

type FileInputProps = {
    file: File,
    onChange: (file: File) => void;
}

export function FileInput(props: FileInputProps) {
    let uploadRef = useRef<FileUpload>(null);
    let [label, setLabel] = useState(props.file.name ?? "Choose");

    return <div className="flex align-items-center gap-1">
        <FileUpload
            mode="basic"
            ref={uploadRef}
            chooseOptions={{ label }}
            accept="image/*"
            customUpload
            auto
            uploadHandler={(event: FileUploadHandlerEvent) => {
                let file = event.files[0];
                setLabel(`${file.name}`);
                props.onChange(file);
            }}
        />
        {
            props.file.size === 0 ? null :
                <Button
                    className="flex justify-content-center"
                    severity={"danger"}
                    outlined
                    onClick={() => {
                        uploadRef.current?.clear();
                        props.onChange(new File([""], ""));
                        setLabel("Choose");
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
