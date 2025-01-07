import React, { useState } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input"; 
import axios from "axios";
import URL from "../Config";

const Email = () => {
  const [emails, setEmails] = useState([]);
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [excelFile, setExcelFile] = useState(null);

  const handleChipsChange = (newChips) => {
    setEmails(newChips);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    setExcelFile(file);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          // "http://localhost:5000/api/parse-emails",
          `${URL}/api/parse-emails`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setEmails((prevEmails) => [...prevEmails, ...response.data.emails]);
        alert("Emails from Excel added successfully!");
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Failed to parse Excel file.");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${URL}/api/schedule-email`, {
        senderEmail,
        subject,
        messageBody,
        emails,
        dateTime,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error scheduling email:", error);
      alert("Failed to schedule email.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 5, padding: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Schedule an Email
      </Typography>
      <TextField
        fullWidth
        label="Sender Email"
        variant="outlined"
        value={senderEmail}
        onChange={(e) => setSenderEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Subject"
        variant="outlined"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Message Body"
        variant="outlined"
        value={messageBody}
        multiline
        rows={4}
        onChange={(e) => setMessageBody(e.target.value)}
        sx={{ mb: 2 }}
      />
      <MuiChipsInput
        value={emails}
        onChange={handleChipsChange}
        fullWidth
        label="Recipient Emails"
        helperText="Add multiple emails or upload Excel"
        sx={{ mb: 2 }}
      />
      <Button
        variant="outlined"
        component="label"
        sx={{ mb: 2 }}
      >
        Upload Excel
        <input
          type="file"
          accept=".xlsx, .xls"
          hidden
          onChange={handleExcelUpload}
        />
      </Button>
      <TextField
        fullWidth
        label="Schedule Time"
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Schedule Email
      </Button>
    </Box>
  );
};

export default Email;
