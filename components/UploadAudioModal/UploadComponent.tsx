import React, { useState, useEffect } from "react";

const UploadComponent = () => {
  const [highlighted, setHighlighted] = useState(false);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const highlight = () => {
    setHighlighted(true);
  };

  const unHighlight = () => {
    setHighlighted(false);
  };

  const handleDrop = (e) => {
    const dt = e.dataTransfer;
    const { files } = dt;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = function () {
      let img = document.createElement("img");
    //   img.src = reader.result;
      img.className = "image";
      document.getElementById("drop-area").appendChild(img);
    };
  };

  useEffect(() => {
    const dropArea = document.getElementById("drop-area");

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unHighlight, false);
    });

    dropArea.addEventListener("drop", handleDrop, false);

    // Cleanup event listeners on component unmount
    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, unHighlight, false);
      });

      dropArea.removeEventListener("drop", handleDrop, false);
    };
  }, []); // Empty dependency array means this effect will only run once, similar to componentDidMount

  return (
    <div id="drop-area">
      <input
        type="file"
        id="fileElem"
        accept="image/*"
        onChange={(e) => {
          handleFiles(e.target.files);
        }}
      />
      <label
        className={`upload-label ${highlighted ? "highlighted" : ""}`}
        htmlFor="fileElem"
      >
        <div className="upload-text">
          Drag Image here or click to upload
        </div>
      </label>
      <div className="image" />
    </div>
  );
};

export default UploadComponent;
