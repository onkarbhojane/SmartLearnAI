import React, { useRef } from 'react';

export const FileInput = ({
  label,
  accept = ".pdf",
  multiple = false,
  onFilesSelected,
  className = '',
  ...props
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    onFilesSelected?.(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    onFilesSelected?.(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
          hover:border-blue-400 transition-colors
          ${className}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
          {...props}
        />
        <div className="space-y-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Drop your PDF files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports {accept.toUpperCase()} files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};