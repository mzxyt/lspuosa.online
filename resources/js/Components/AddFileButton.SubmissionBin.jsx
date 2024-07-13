import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import FileIcon from "./FileIcon";
import FileItem from "./FileItem";
import axios from "axios";
import { MultipartHeader } from "@/constants/constants";
import { toast } from "sonner";

const AddFileButton = ({
  files,
  setFiles,
  submissionBinId,
  userId,
  handleViewFile,
  accept = "*",
  disableAddingFile = false,
  removable = true,
  shouldUpload = true,
}) => {
  const fileElemRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [fileIsTooLarge, setFileIsTooLarge] = useState(false);

  const onAddBtnClicked = () => {
    fileElemRef.current.click();
  };

  const getFileIndex = (file) => {
    for (let i = 0; i < files.length; i++) {
      if (file.uploaded) {
        if (file.id == files[i].id) {
          return i;
        }
      } else {
        if (file.uri == files[i].uri) {
          return i;
        }
      }
    }
    return -1;
  };

  const updateFileStatus = (file, uri, status = true) => {
    // get file index
    let index = getFileIndex(file);
    if (index >= 0) {
      // get file at index
      file.uploaded = status;
      file.uri = uri;
      // store files array elem
      let filesTemp = [...files];
      // replace with the updated one
      filesTemp[index] = file;
      // set files
      setFiles(filesTemp);
    }
  };

  const onSelectFile = (e) => {
    console.log(e.target.files);
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      if (file.size / 1024 > 10240) {
        setFileIsTooLarge(true);
      } else {
        setFileIsTooLarge(false);
        file.uri = URL.createObjectURL(file);
        file.uploaded = false;
        setFiles((files) => [file, ...files]);
      }
    }
  };

  const removeFile = (file) => {
    if (file.uploaded) {
      // update file
      file.processing = true;
      let filesTemp = [...files];
      filesTemp[getFileIndex(file)] = file;
      setFiles(filesTemp);

      // delete file
      axios
        .delete(
          route("submission_bin.attachment.delete", {
            id: file.id,
            user_id: userId,
          })
        )
        .then((res) => {
          console.log(res);
          let filesTemp = files.filter((f, index) => f.id !== file.id);
          setFiles(filesTemp);
        })
        .catch((err) => {
          toast.error("Something went wrong, please try again!");
          file.processing = false;
          let filesTemp = [...files];
          filesTemp[getFileIndex(file)] = file;
          setFiles(filesTemp);
        });
    } else {
      let filesTemp = files.filter((f, index) => f.uri !== file.uri);
      setFiles(filesTemp);
    }
  };

  const needToUpload = () => {
    for (let f of files) {
      if (f.uploaded === false) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      {fileIsTooLarge && (
        <div className="mt-2 text-center text-sm rounded-md px-3 py-3 border-[1px] border-red-300 bg-red-100 text-red-700">
          <p className="mb-0">The file is too large.</p>
        </div>
      )}
      <input
        type="file"
        className="d-none"
        ref={fileElemRef}
        accept={accept}
        onChange={onSelectFile}
        multiple
      />
      <div className="mb-3">
        {files &&
          files.map((file, index) => (
            <div key={index}>
              <FileItem
                handleViewFile={handleViewFile}
                submissionBinId={submissionBinId}
                removable={removable}
                handleRemove={removeFile}
                file={file}
                shouldUpload={shouldUpload}
              />
            </div>
          ))}
      </div>
      {!disableAddingFile && (
        <>
          <Button
            disabled={isUploading}
            variant="outline-light"
            style={{
              borderRadius: "8px",
              background: "#FFF",
              boxShadow:
                "0px 0px 0px 1px rgba(39, 39, 42, 0.10), 0px 1px 1.1px 0px rgba(39, 39, 42, 0.10), 0px 4px 6.6px 0px rgba(39, 39, 42, 0.10)",
            }}
            className="border-0 hover:opacity-70 col-12 text-dark"
            onClick={onAddBtnClicked}
          >
            <small className="font-medium flex items-center justify-center">
              <i className="bx bx-plus mr-2"></i>Add reference file
            </small>
          </Button>
          <small className="mt-2 text-center text-slate-500 block">
            The file should be below 10mb.
          </small>
        </>
      )}
    </>
  );
};

export default AddFileButton;
