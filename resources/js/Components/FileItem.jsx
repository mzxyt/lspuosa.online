import React, { useEffect, useState } from "react";
import FileIcon from "./FileIcon";
import { Link } from "@inertiajs/react";

const FileItem = ({
  shouldUpload = true,
  file,
  removable = false,
  handleRemove,
  loadingDisabled = false,
  handleViewFile,
}) => {
  return (
    <div
      title={file.name}
      className={`${
        shouldUpload ? (!file.uploaded ? "processing" : "") : ""
      } file-item w-100 p-2 gap-2 flex items-center rounded border mb-1`}
    >
      <FileIcon file={file} size="sm" />
      {/* {
                file.id ? (
                    <Link href={route('reports.attachment.view', { id: file.id })} className='my-0 text-secondary text-sm col-8 text-truncate'>{file.name}</Link>
                ):(
                    <p className='my-0 text-secondary text-sm col-8 text-truncate'>{file.name}</p>
                )
            } */}
      <p
        className="my-0 text-secondary text-sm col-8 text-truncate cursor-pointer"
        onClick={() => handleViewFile(file)}
      >
        {file.name}
      </p>
      {shouldUpload
        ? removable &&
          (loadingDisabled || file.uploaded) && (
            <button
              className=""
              disabled={file.processing}
              onClick={() => handleRemove(file)}
            >
              <i className="bx bx-x"></i>
            </button>
          )
        : removable && (
            <button
              className=""
              disabled={file.processing}
              onClick={() => handleRemove(file)}
            >
              <i className="bx bx-x"></i>
            </button>
          )}
      {shouldUpload
        ? (file.processing || (!file.uploaded && !loadingDisabled)) && (
            <div className="loading-bar">
              <div className="wrapper">
                <div className="bar"></div>
              </div>
            </div>
          )
        : null}
    </div>
  );
};

export default FileItem;
