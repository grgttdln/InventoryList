"use client";
import {
  Box,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { Camera } from "react-camera-pro";
import { useRef, useState, useEffect } from "react";
import { addItem, removeItem, updateInventory } from "./operations";
import PicDetector from "./picDetector";

export default function CameraComponent({ refreshInventory }) {
  const camera = useRef(null);

  const [image, setImage] = useState(null);
  const [shortImageUrl, setShortImageUrl] = useState(null);
  const [openCam, setOpenCam] = useState(false);
  const [scanned, setScanned] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const handleOpenCam = () => setOpenCam(true);
  const handleCloseCam = () => setOpenCam(false);

  const handleTakePhoto = async () => {
    const photo = await camera.current.takePhoto();
    const blob = await fetch(photo).then((res) => res.blob());
    const shortUrl = URL.createObjectURL(blob);
    setImage(photo);
    setShortImageUrl(shortUrl);
    console.log(shortUrl); // Print the shortened URL to the console
    handleCloseCam();

    const objects = await PicDetector(blob);

    const uniqueObjects = Array.from(new Set(objects));

    setScanned(uniqueObjects);
  };

  const handleRetakePhoto = () => {
    setImage(null);
    setShortImageUrl(null);
    handleOpenCam();
  };

  const handleUploadPhoto = async () => {
    Object.keys(selectedObjects)
      .filter((object) => selectedObjects[object])
      .forEach((object) => {
        console.log("uploading object:", object);
        addItem(object);
      });
    await refreshInventory();
  };

  const handleRemovePhoto = async () => {
    Object.keys(selectedObjects)
      .filter((object) => selectedObjects[object])
      .forEach((object) => {
        console.log("removing object:", object);
        removeItem(object);
      });
    await refreshInventory();
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedObjects((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleDownloadPhoto = () => {
    const link = document.createElement("a");
    link.href = shortImageUrl;
    link.download = "photo.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      justifyContent={"center"}
    >
      {openCam && !image && (
        <Button variant="contained" onClick={handleTakePhoto}>
          Take photo
        </Button>
      )}
      {openCam && !image && <Camera ref={camera} aspectRatio={16 / 9} />}

      {image && (
        <Button variant="contained" onClick={handleRetakePhoto}>
          Retake Photo
        </Button>
      )}
      {!openCam && !image && (
        <Button variant="contained" onClick={handleOpenCam}>
          Open Camera
        </Button>
      )}
      {shortImageUrl && (
        <>
          <img
            src={shortImageUrl}
            alt="Taken photo"
            style={{ width: "100%" }}
          />
          <Box display="flex" gap={2} flexDirection={"row"}>
            {/* <Button variant="contained" onClick={handleDownloadPhoto}>
              Download Photo
            </Button> */}
            <Button variant="contained" onClick={handleUploadPhoto}>
              Add Photo Object
            </Button>
            <Button variant="contained" onClick={handleRemovePhoto}>
              Remove Photo Object
            </Button>
          </Box>
          <Box mt={2}>
            <h3>Detected Objects:</h3>
            <Stack
              height={"150px"}
              spacing={2}
              overflow={"auto"}
              marginTop={"10px"}
              width={"200px"}
            >
              <FormGroup>
                {scanned.map((object, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedObjects[object] || false}
                        onChange={handleCheckboxChange}
                        name={object}
                      />
                    }
                    label={object}
                  />
                ))}
              </FormGroup>
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}
