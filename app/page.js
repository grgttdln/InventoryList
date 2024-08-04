"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Input,
} from "@mui/material";
import CameraComponent from "@/app/camComponent";
import { addItem, removeItem, updateInventory } from "@/app/operations";

export default function Home() {
  // inventory
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  // picture
  const [openCam, setOpenCam] = useState(false);

  // search
  const [search, setSearch] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenCam = () => setOpenCam(true);
  const handleCloseCam = () => setOpenCam(false);

  const refreshInventory = async () => {
    let updatedInventory = await updateInventory();

    if (search.length > 0) {
      updatedInventory = updatedInventory.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setInventory(updatedInventory);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    console.log(search);
  };

  useEffect(() => {
    refreshInventory();
  }, [search]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Modal
        open={openCam}
        onClose={async () => {
          handleCloseCam();
          refreshInventory();
        }}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={800}
          height={800}
          border={"2px solid #000"}
          bgcolor={"white"}
          p={4}
          boxShadow={24}
          display={"flex"}
          gap={3}
          flexDirection={"column"}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <CameraComponent refreshInventory={refreshInventory} />
        </Box>
      </Modal>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          border={"2px solid #000"}
          bgcolor={"white"}
          p={4}
          boxShadow={24}
          display={"flex"}
          gap={3}
          flexDirection={"column"}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
            Add Item
          </Typography>
          <Stack spacing={2} width={"100%"} direction={"row"}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={async () => {
                await addItem(itemName);
                setItemName("");
                handleClose();
                refreshInventory();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        width={"900px"}
        height={"100px"}
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleOpen}>
              Add New Item
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                handleOpenCam();
                refreshInventory();
              }}
            >
              Take a Picture
            </Button>
          </Stack>
          <div style={{ flexGrow: 1 }} />
          <Stack>
            <Input
              placeholder="Search an Item"
              value={search}
              onChange={handleSearchChange}
            />
          </Stack>
        </Stack>
      </Box>

      <Box border={"1px solid #333"}>
        <Box
          width={"900px"}
          height={"100px"}
          bgcolor={"#ADD8E6"}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
        >
          <Typography variant={"h2"}>Inventory</Typography>
        </Box>

        <Stack width={"900px"} height={"300px"} spacing={2} overflow={"auto"}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width={"100%"}
              minHeight={"150px"}
              display="flex"
              alignItems={"center"}
              justifyContent={"space-between"}
              padding={5}
              bgcolor={"#f0f0f0"}
            >
              <Typography variant="h3" textAlign={"center"} color={"#333"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" textAlign={"center"} color={"#333"}>
                {quantity}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await addItem(name);
                    refreshInventory();
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await removeItem(name);
                    refreshInventory();
                  }}
                  color={"error"}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
